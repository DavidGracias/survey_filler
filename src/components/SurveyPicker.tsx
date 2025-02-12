import { useEffect, useMemo, useState } from "react";
import {
  Collapse,
  Container,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { StarBorder, ExpandLess, ExpandMore } from "@mui/icons-material";

import { DEBUG_MODE, defaultBody } from "../App";
import ComponentProps from "../types/ComponentProps";
import GenericSurvey from "./GenericSurvey";

import SurveyAnswers from "../types/SurveyAnswers";
import PanelFox from "../surveyAnswers/PanelFox";
import PRC from "../surveyAnswers/PRC";
import RecruitAndField from "../surveyAnswers/RecruitAndField";

enum SurveyProviders {
  PRC,
  FieldWork,
  RecruitAndField,
  Hilton,
  Unknown,
}

const surveyAnswers: Record<SurveyProviders, SurveyAnswers | undefined> = {
  [SurveyProviders.PRC]: PRC,
  [SurveyProviders.FieldWork]: PanelFox,
  [SurveyProviders.RecruitAndField]: RecruitAndField,
  [SurveyProviders.Hilton]: undefined,
  [SurveyProviders.Unknown]: undefined,
};

export default function SurveyPicker({
  url,
  body,
  tabId,
  information,
}: Omit<ComponentProps, "surveyAnswer">) {
  const [surveyProvider, setSurveyProvider] = useState<SurveyProviders>(
    SurveyProviders.Unknown
  );
  const [surveyAnswer, setSurveyAnswer] = useState<SurveyAnswers>();
  const [openSurveyProviderDropdown, setOpenSurveyProviderDropdown] =
    useState(true);

  useEffect(() => {
    if (body == defaultBody) return;

    if (url.includes("panelfox.io/s/FieldGoals"))
      setSurveyProvider(SurveyProviders.FieldWork);
    else if (
      body.includes("This form was created inside of Recruit and Field Inc.")
    )
      setSurveyProvider(SurveyProviders.RecruitAndField);
  }, [body, url]);

  useEffect(() => {
    const fetchSurveyAnswer = async () => {
      const surveyAnswer = surveyAnswers[surveyProvider];
      if (surveyAnswer !== undefined) {
        await surveyAnswer.waitForAllPages();
        setOpenSurveyProviderDropdown(false);
      }
      setSurveyAnswer(surveyAnswer);
    };

    fetchSurveyAnswer();
  }, [surveyProvider]);

  return (
    <>
      <Container sx={{ margin: "10px 0px" }}>
        <ListItemButton
          onClick={() =>
            setOpenSurveyProviderDropdown(!openSurveyProviderDropdown)
          }
        >
          <ListItemText primary={SurveyProviders[surveyProvider]} />
          {openSurveyProviderDropdown ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openSurveyProviderDropdown} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {Object.values(SurveyProviders)
              .filter(
                (value): value is SurveyProviders => typeof value === "number"
              )
              .map((provider: SurveyProviders) => (
                <ListItemButton
                  onClick={() => setSurveyProvider(provider)}
                  key={provider}
                >
                  <ListItemIcon>
                    {provider == surveyProvider && <StarBorder />}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      SurveyProviders[provider] ==
                      SurveyProviders[SurveyProviders.Unknown]
                        ? "Unset"
                        : SurveyProviders[provider]
                    }
                  />
                </ListItemButton>
              ))}
          </List>
        </Collapse>
      </Container>
      <Divider />

      {surveyAnswer === undefined ? (
        <Container>
          <h1>Unknown Survey Provider</h1>
          <p>Survey provider not recognized.</p>
        </Container>
      ) : (
        <GenericSurvey
          url={url}
          body={body}
          tabId={tabId}
          information={information}
          surveyAnswer={surveyAnswer}
        />
      )}
    </>
  );
}
