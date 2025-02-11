import { Button, Container } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import ComponentProps from "../types/ComponentProps";
import { DEBUG_MODE } from "../App";
import GenericSurvey from "./GenericSurvey";
import PRC from "../surveyAnswers/PRC";
import SurveyAnswers from "../types/SurveyAnswers";
import PanelFox from "../surveyAnswers/PanelFox";

enum SurveyProviders {
  PRC,
  FieldWork,
  Hilton,
  Unknown,
}

const surveyAnswers: Record<SurveyProviders, SurveyAnswers | undefined> = {
  [SurveyProviders.PRC]: PRC,
  [SurveyProviders.FieldWork]: PanelFox,
  [SurveyProviders.Hilton]: undefined,
  [SurveyProviders.Unknown]: undefined,
};

export default function SurveyPicker({
  url,
  body,
  tabId,
  information,
}: Omit<ComponentProps, "surveyAnswer">) {
  const [surveyProvider, setSurveyProvider] = useState<SurveyProviders>(SurveyProviders.Unknown);
  const [surveyAnswer, setSurveyAnswer] = useState<SurveyAnswers | undefined>(undefined);

  useEffect(() => {
    const fetchSurveyAnswer = async () => {
      const surveyAnswer = surveyAnswers[surveyProvider];

      if (surveyAnswer !== undefined)
        await surveyAnswer.waitForAllPages();

      setSurveyAnswer(surveyAnswer);
    };

    fetchSurveyAnswer();
  }, [surveyProvider]);

  const SurveyComponent = useMemo(() => {
    if (surveyAnswer === undefined)
      return (
        <Container>
          <h1>Unknown Survey Provider</h1>
          <p>Survey provider not recognized.</p>
        </Container>
      );

    return (
      <GenericSurvey
        url={url}
        body={body}
        tabId={tabId}
        information={information}
        surveyAnswer={surveyAnswer}
      />
    );
  }, [surveyAnswer]);

  return (
    <Container>
      <Container>
        {Object.values(SurveyProviders).filter((value): value is SurveyProviders => typeof value === "number")
          .map((provider: SurveyProviders) => (
            <Button
              key={provider}
              variant="contained"
              onClick={() => setSurveyProvider(provider)}
              style={{ margin: "5px" }}
            >
              {SurveyProviders[provider]}
            </Button>
          ))}
        <Button
          key={"reset"}
          variant="contained"
          onClick={() => setSurveyProvider(SurveyProviders.Unknown)}
          style={{ margin: "5px" }}
        >
          Reset
        </Button>
        {DEBUG_MODE && (
          <>
            <br />
            <br />
            <Button
              variant="contained"
              onClick={() => {
                chrome.scripting.executeScript({
                  target: { tabId: tabId },
                  func: () => {
                    const nextButtonQuery = "button.next-button";
                    (
                      document.querySelector(
                        nextButtonQuery
                      ) as HTMLButtonElement
                    ).click();
                  },
                });
              }}
              style={{ margin: "5px" }}
            >
              Manually Trigger Next
            </Button>
          </>
        )}
      </Container>

      {SurveyComponent}
    </Container>
  );
}
