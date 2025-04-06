import { Alert, Button, Container, Divider, Typography } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import ComponentProps from "../types/ComponentProps";
import { DEBUG_MODE, defaultBody } from "../App";
import SurveyAnswers, { MatchedQuestion } from "../types/SurveyAnswers";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ContextBuilder from "../types/ContextBuilder";
import { executeScript } from "../constants/util/chrome";

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
    let [matchedQuestionsLocal, unmatchedQuestionIndicesLocal] =
      surveyAnswer.getQuestionsFromDocument(document);
    if (!information.hardcodedQuestionsEnabled) {
      matchedQuestionsLocal = matchedQuestionsLocal.filter(
        (question) => !question.options.hardcoded
      );
    }

    if (
      matchedQuestionsLocal.every(
        (question, i) => question.text !== matchedQuestions[i]?.text
      )
    ) {
      setMatchedQuestions(matchedQuestionsLocal);
      setUnmatchedQuestionIndices(unmatchedQuestionIndicesLocal);
      if (!matchedQuestionsLocal.length) triggerNextButton(tabId, surveyAnswer);
    }
  }, [document]);

  useEffect(() => {
    if (!matchedQuestions.length && !unmatchedQuestionIndices.length) return;

    // Create async function to handle sequential execution
    const answerQuestionsSequentially = async () => {
      await injectContext(surveyAnswer, tabId);

      // Then proceed with questions
      for (const question of matchedQuestions) {
        await executeScript(
          tabId,
          [information, surveyAnswer.questionSelector, question.i],
          question.action
        );
      }
    };

    answerQuestionsSequentially().then(() => {
      executeScript(
        tabId,
        [
          surveyAnswer.questionSelector,
          unmatchedQuestionIndices,
          classUnmatched,
        ],
        markQuestionsAsUnmatched
      );

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
      executeScript(
        tabId,
        [surveyAnswer.nextButtonSelector],
        surveyAnswer.nextButtonAction
      ),
    250
  );
}

const classUnmatched = "unmatched";
function markQuestionsAsUnmatched(
  questionSelector: string,
  questionIndices: number[],
  classUnmatched: string
) {
  // Inject CSS with animation
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
  document;
}

async function injectContext(surveyAnswer: SurveyAnswers, tabId: number) {
  const injectionContext = ContextBuilder.getInjectionContext(surveyAnswer);
  await executeScript(
    tabId,
    [injectionContext, classUnmatched],
    (code, classUnmatched) => {
      // print the injected context with colors
      console.clear();
      const color = "color: #4CAF50; font-weight: bold;";
      const resetColor = "color: inherit; font-weight: normal;";
      const regex = /globalThis\.(\w+)/g;
      const styleParams: string[] = [];
      const formattedCode = code.replace(regex, (_match, key) => {
        styleParams.push(color, resetColor);
        return `globalThis.%c${key}%c`;
      });
      // Log with all style parameters
      console.log("injected context:\n\n" + formattedCode, ...styleParams);

      // inject the context
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

      document.addEventListener("click", (e) => {
        const target = e.target as Element;
        const unmatchedClass_Ancestor = target.closest(`.${classUnmatched}`);
        const label_Ancestor = target.closest("label");
        if (unmatchedClass_Ancestor && label_Ancestor)
          unmatchedClass_Ancestor.classList.remove(classUnmatched);
      });
    }
  ).then(() =>
    executeScript(tabId, [injectionContext], (code) => {
      // verify which functions are injected in globalThis
      const globalFunctions = Object.getOwnPropertyNames(globalThis).filter(
        (prop) => new RegExp(`\\b${prop}\\b`).test(code)
      );
      console.log(
        "Available global functions (includes some non-injected functions as well, please ignore for debugging purposes):",
        globalFunctions
      );
    })
  );
}
