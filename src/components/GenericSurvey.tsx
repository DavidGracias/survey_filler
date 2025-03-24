import { Alert, Button, Container, Divider, Typography } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import ComponentProps from "../types/ComponentProps";
import { DEBUG_MODE } from "../App";
import SurveyAnswers, { MatchedQuestion } from "../types/SurveyAnswers";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ContextBuilder from "../types/ContextBuilder";

export default function GenericSurvey({
  url,
  body,
  tabId,
  information,
  surveyAnswer,
}: ComponentProps) {
  const [matchedQuestions, setMatchedQuestions] = useState<MatchedQuestion[]>(
    []
  );
  const [unmatchedQuestionIndices, setUnmatchedQuestionIndices] = useState<
    number[]
  >([]);
  const document = useMemo(
    () => new DOMParser().parseFromString(body, "text/html"),
    [body]
  );

  useEffect(() => {
    if (!DEBUG_MODE) return;
    // surveyAnswer.printQuestions();
  }, []);

  useEffect(() => {
    let [matchedQuestions, unmatchedQuestionIndices] =
      surveyAnswer.getQuestionsFromDocument(document);
    if (!information.hardcodedQuestionsEnabled) {
      matchedQuestions = matchedQuestions.filter(
        (question) => !question.options.hardcoded
      );
    }
    setMatchedQuestions(matchedQuestions);
    setUnmatchedQuestionIndices(unmatchedQuestionIndices);
  }, [document]);

  useEffect(() => {
    if (!matchedQuestions.length && !unmatchedQuestionIndices.length) return;

    // Create async function to handle sequential execution
    const answerQuestionsSequentially = async () => {
      await injectContext(surveyAnswer, tabId);

      for (const question of matchedQuestions) {
        await chrome.scripting.executeScript({
          target: { tabId: tabId },
          world: "MAIN",
          func: question.action,
          args: [information, surveyAnswer.questionSelector, question.i],
        });
      }
    };

    answerQuestionsSequentially().then(() => {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        world: "MAIN",
        func: (injectedContext: string) => {
          // Parse the context string to find globalThis assignments
          const globalThisAssignments = injectedContext
            .split("\n")
            .filter((line) => line.trim().startsWith("globalThis."))
            .map((line) => line.trim().split(".")[1]?.split(" ")[0])
            .filter(Boolean);

          // Log all found globalThis values
          console.log(
            "Injected globalThis values:",
            globalThisAssignments.reduce((acc, key) => {
              if (key in globalThis) {
                acc[key] = (globalThis as any)[key];
              }
              return acc;
            }, {} as Record<string, any>)
          );
        },
        args: [ContextBuilder.getInjectionContext(surveyAnswer)],
      });

      chrome.scripting.executeScript({
        target: { tabId: tabId },
        world: "MAIN",
        func: markQuestionsAsUnmatched,
        args: [surveyAnswer.questionSelector, unmatchedQuestionIndices],
      });

      if (!unmatchedQuestionIndices.length) {
        triggerNextButton(tabId, surveyAnswer);
      }
    });
  }, [matchedQuestions, unmatchedQuestionIndices]);

  return (
    <Container>
      {!unmatchedQuestionIndices.length && !matchedQuestions.length ? (
        <>
          <Typography variant="h5">
            Unable to load / find questions related to the survey. Please try
            again.
          </Typography>

          <Typography>
            Debugging mode: {DEBUG_MODE ? "enabled" : "disabled"}
          </Typography>

          <Typography>
            Here's a snippet of the body: `{body.slice(0, 100)}`
          </Typography>
        </>
      ) : (
        // page is defined
        <>
          {DEBUG_MODE && (
            <>
              <Button
                sx={{ display: "block", margin: "10px auto" }}
                variant="contained"
                onClick={() => triggerNextButton(tabId, surveyAnswer)}
              >
                Manually Trigger Next
              </Button>
              <Divider />
            </>
          )}
          {unmatchedQuestionIndices.length && (
            <>
              <Alert
                icon={<EditNoteIcon />}
                variant="filled"
                severity="warning"
                sx={{ margin: "10px 5px" }}
              >
                <Typography component="span" color="textPrimary">
                  <b>
                    {unmatchedQuestionIndices.length} question
                    {unmatchedQuestionIndices.length == 1 ? "" : "s"}
                  </b>
                </Typography>
                <Typography component="span" color="textSecondary">
                  {unmatchedQuestionIndices.length == 1 ? " was " : " were "}
                  not auto-filled,
                  <b>
                    {" complete " +
                      (unmatchedQuestionIndices.length == 1 ? "it" : "them") +
                      " manually "}
                  </b>
                  to continue!
                </Typography>
              </Alert>
              <Divider />
            </>
          )}
          <Typography variant="h6">
            Currently handling page associated with these questions:
          </Typography>
          <List>
            {matchedQuestions
              .filter(
                (question) =>
                  DEBUG_MODE ||
                  question.action.toString() != (() => {}).toString()
              )
              .map((question) => (
                <ListItem dense={true}>
                  <ListItemText
                    primary={
                      (DEBUG_MODE ? question.i + ": " : "") +
                      JSON.stringify(question.text)
                    }
                  />
                </ListItem>
              ))}
          </List>
        </>
      )}
    </Container>
  );
}

function triggerNextButton(tabId: number, surveyAnswer: SurveyAnswers) {
  setTimeout(
    () =>
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: surveyAnswer.nextButtonAction,
        args: [surveyAnswer.nextButtonSelector],
      }),
    250
  );
}

function markQuestionsAsUnmatched(
  questionSelector: string,
  questionIndices: number[]
) {
  // Inject CSS with animation
  const classUnmatched = "unmatched";
  if (!document.querySelector(`style[data-style="${classUnmatched}"]`)) {
    const style = document.createElement("style");
    style.setAttribute("data-style", classUnmatched);
    style.textContent = `
      .${classUnmatched} {
        border: 3px groove #F07C4D !important;
        padding: 5px;
        animation: pulse 8s infinite !important;
      }
        
      .${classUnmatched} * {
        background: transparent !important;
      }

      @keyframes pulse {
        0%, 100% { background: transparent; }
        25%, 75% { background: rgba(240,172,77, .2) }
        50% { background: #F0AC4D; }
      }
    `;
    document.head.appendChild(style);
  }

  // Add/remove class to questions
  document.querySelectorAll(questionSelector).forEach((question, i: number) => {
    if (questionIndices.includes(i)) question.classList.add(classUnmatched);
    else question.classList.remove(classUnmatched);
  });
}

async function injectContext(surveyAnswer: SurveyAnswers, tabId: number) {
  const injectionContext = ContextBuilder.getInjectionContext(surveyAnswer);
  await chrome.scripting.executeScript({
    target: {
      tabId: tabId,
      allFrames: true,
    },
    world: "MAIN",
    func: (code) => {
      console.clear();
      console.log("injected context:\n\n", code);
      try {
        return new Function(code);
      } catch (e) {
        console.log("Failed to inject via `new Function(code)` with error:", e);
      }
      try {
        let scriptElement = document.querySelector(
          'script[data-injected-context="true"]'
        );
        if (!scriptElement) {
          scriptElement = document.createElement("script");
          scriptElement.setAttribute("data-injected-context", "true");
          document.head.appendChild(scriptElement);
        }

        // @ts-ignore
        scriptElement.textContent = window
          .trustedTypes!.createPolicy("InjectedContextPolicy", {
            createScript: (script: string) => script,
          })
          .createScript(code);
      } catch (e) {
        console.log("Failed to inject via `trustedTypes` with error:", e);
      }
    },
    args: [injectionContext],
  });

  await new Promise((resolve) => setTimeout(resolve, 750));
}
