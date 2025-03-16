import { Alert, Button, Container, Divider, Typography } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import ComponentProps from "../types/ComponentProps";
import { DEBUG_MODE } from "../App";
import SurveyAnswers, { MatchedQuestion } from "../types/SurveyAnswers";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import EditNoteIcon from "@mui/icons-material/EditNote";

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
    surveyAnswer.printQuestions();
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
    if (!matchedQuestions.length) return;
    if (DEBUG_MODE) {
      window.alert(
        "matchedQuestions (# of items = " +
          matchedQuestions.length +
          "): \n" +
          JSON.stringify(matchedQuestions)
      );
    }

    // Create async function to handle sequential execution
    const answerQuestionsSequentially = async () => {
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
      if (DEBUG_MODE) {
        window.alert("DEBUG_MODE is enabled, skipping pressNextButton()");
        return; // don't auto-continue if in debug mode
      }

      if (!unmatchedQuestionIndices.length) {
        triggerNextButton(tabId, surveyAnswer);
      }

      chrome.scripting.executeScript({
        target: { tabId: tabId },
        world: "MAIN",
        func: markQuestionsAsUnmatched,
        args: [surveyAnswer.questionSelector, unmatchedQuestionIndices],
      });
    });
  }, [matchedQuestions]);

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
            {matchedQuestions.map((question) => (
              <ListItem dense={true}>
                <ListItemText primary={JSON.stringify(question.text)} />
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

      @keyframes pulse {
        0%, 100% { background: transparent; }
        25%, 75% { background: rgba(240,172,77, .2) }
        50% { background: #F0AC4D; }
      }
    `;
    document.head.appendChild(style);
  }

  // Add/remove class to questions
  document.querySelectorAll(questionSelector).forEach((question, i) => {
    if (questionIndices.includes(i)) question.classList.add(classUnmatched);
    else question.classList.remove(classUnmatched);
  });
}
