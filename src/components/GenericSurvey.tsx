import { Container } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import ComponentProps from '../types/ComponentProps';
import { DEBUG_MODE } from '../App';
import { PageAction, PageText } from '../types/SurveyAnswers';

type Page = {text: PageText, action: PageAction};

export default function GenericSurvey({ url, body, tabId, information, surveyAnswer }: ComponentProps) {
  const [page, setPage] = useState<Page>();

  useEffect(() => {
    window.alert("body changed!")
    const pageTextAction = surveyAnswer.getPageTextActionFromBody(body);
    if (pageTextAction === undefined) return;
    const [pageText, pageAction] = pageTextAction;
    setPage({ text: pageText, action: pageAction, });
  }, [body]);

  useEffect(() => {
    if (page === undefined) return;

    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: (information) => {
        page.action(information);
        
        if ( DEBUG_MODE ) return; // don't auto-continue if in debug mode
        setTimeout(() => {
          (document.querySelector(surveyAnswer.nextButtonQuery) as HTMLButtonElement).click();
        }, 1e3);
      },
      args: [information],
    });
  }, [page]);

  return (
    <Container>
      { (page === undefined) ?
      <>
        Unable to load / find page related to the survey. Please try again.
        Here's a snippet of the body: `{body.slice(0, 100)}`

        Debugging:
      </>
      : // page is defined
      <>
        Currently handling page associated with this text: `{page.text.join(", ")}`
      </>
      }
    </Container>
  );
}
