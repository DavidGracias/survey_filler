import { Button, Container, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ComponentProps from "../types/ComponentProps";
import { DEBUG_MODE } from "../App";
import { Page } from "../types/SurveyAnswers";
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
  const [page, setPage] = useState<Page>();

  useEffect(() => {
    if (!DEBUG_MODE) return;

    surveyAnswer.printPages();
  }, []);

  useEffect(() => {
    const page = surveyAnswer.getPageFromBody(body);
    setPage(page);
  }, [body]);

  useEffect(() => {
    if (page === undefined) return;

    chrome.scripting
      .executeScript({
        target: { tabId: tabId },
        func: page.action,
        args: [information],
      })
      .then(() => {
        if (DEBUG_MODE) return; // don't auto-continue if in debug mode
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: surveyAnswer.nextButtonAction,
        });
      });
  }, [page]);

  return (
    <Container>
      {page === undefined ? (
        <>
          <Typography variant="h5">
            Unable to load / find page related to the survey. Please try again.
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
                onClick={() =>
                  setTimeout(
                    () =>
                      chrome.scripting.executeScript({
                        target: { tabId: tabId },
                        func: surveyAnswer.nextButtonAction,
                      }),
                    1e3
                  )
                }
              >
                Manually Trigger Next
              </Button>
              <Divider />
            </>
          )}
          <Typography variant="h6">
            Currently handling page associated with these questions:
          </Typography>
          <List>
            {page.text.map((question) => (
              <ListItem dense={true}>
                <ListItemText primary={question} />
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Container>
  );
}
