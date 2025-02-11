import { Container } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import ComponentProps from '../types/ComponentProps';
import { DEBUG_MODE } from '../App';
import { Page } from '../types/SurveyAnswers';
import { Information } from '../types/Information';

export default function GenericSurvey({ url, body, tabId, information, surveyAnswer }: ComponentProps) {
  const [page, setPage] = useState<Page>();

  useEffect(() => {
    if (!DEBUG_MODE) return;
    
    window.alert("Print pages now...");
    surveyAnswer.printPages();
  }, []);

  useEffect(() => {
    const page = surveyAnswer.getPageFromBody(body);
    setPage(page);
  }, [body]);

  useEffect(() => {
    if (page === undefined) return;

    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: (information: Information, cancel_next: boolean) => {
        page.action(information);
        
        if ( cancel_next ) return; // don't auto-continue if in debug mode
        setTimeout(() => {
          (document.querySelector(surveyAnswer.nextButtonQuery) as HTMLButtonElement).click();
        }, 1e3);
      },
      args: [information, DEBUG_MODE],
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
