import { Button, Container, Divider, Typography } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import ComponentProps from "../types/ComponentProps";
import { DEBUG_MODE } from "../App";
import SurveyAnswers, { MatchedQuestion } from "../types/SurveyAnswers";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

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
  const [numUnmatchedQuestions, setNumUnmatchedQuestions] = useState<number>(0);
  const document = useMemo(
    () => new DOMParser().parseFromString(body, "text/html"),
    [body]
  );

  useEffect(() => {
    if (!DEBUG_MODE) return;
    surveyAnswer.printQuestions();
  }, []);

  useEffect(() => {
    let [matchedQuestions, allQuestionsMatched] = surveyAnswer.getQuestionsFromDocument(document);
    if (!information.hardcodedQuestionsEnabled) {
      matchedQuestions = matchedQuestions.filter((question) => !question.options.hardcoded);
    }
    setMatchedQuestions(matchedQuestions);
    setNumUnmatchedQuestions(allQuestionsMatched);
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

      if (numUnmatchedQuestions == 0) {
        triggerNextButton(tabId, surveyAnswer);
      }
    });
  }, [matchedQuestions]);

  return (
    <Container>
      {!numUnmatchedQuestions && !matchedQuestions.length ? (
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
          {numUnmatchedQuestions && (
            <Typography variant="h6">
              {numUnmatchedQuestions} questions were not matched and need to be processed manually.
            </Typography>
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
