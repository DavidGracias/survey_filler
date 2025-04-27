import { useEffect, useState } from "react";
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

import { defaultBody } from "../App";
import ComponentProps from "../types/ComponentProps";
import GenericSurvey from "./GenericSurvey";

import SurveyAnswers from "../types/SurveyAnswers";
import PanelFox from "../constants/PanelFox";
import PRC from "../constants/PRC";
import RecruitAndField from "../constants/RecruitAndField";
import AdlerWeiner from "../constants/AdlerWeiner";
import FocusInsite from "../constants/FocusInsite";
import ConsumerViewpoint from "../constants/ConsumerViewpoint";
import { compareImages } from "../constants/util/Images";
import { People } from "../types/InformationEnums";

enum SurveyProviders {
  PRC,
  FocusForward,
  RecruitAndField,
  AdlerWeiner,
  FocusInsite,
  // Hilton,
  ConsumerViewpoint,
  Unknown,
}

const surveyAnswers: Record<SurveyProviders, SurveyAnswers | undefined> = {
  [SurveyProviders.PRC]: PRC,
  [SurveyProviders.FocusForward]: PanelFox,
  [SurveyProviders.RecruitAndField]: RecruitAndField,
  [SurveyProviders.AdlerWeiner]: AdlerWeiner,
  [SurveyProviders.FocusInsite]: FocusInsite,
  // [SurveyProviders.Hilton]: undefined,
  [SurveyProviders.ConsumerViewpoint]: ConsumerViewpoint,
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (body === defaultBody) return;

    if (url.includes("panelfox.io/s/")) {
      setSurveyProvider(SurveyProviders.FocusForward);
      const sp_uuid = url.split("?sp_uuid=")[1];
      const sp_uuid_david = "8a2667e0-771d-4150-b6da-cdfd9d582736";
      if (information.person == People.David && sp_uuid != sp_uuid_david) {
        // chrome.tabs.update(tabId, { url: url.split("?sp_uuid=")[0] + "?sp_uuid=" + sp_uuid_david });
        // return;
      }
      setSurveyProvider(SurveyProviders.FocusForward);
    }
    else if (url.includes("focusinsite.com"))
      setSurveyProvider(SurveyProviders.FocusInsite);
    else if (
      body.includes("This form was created inside of Recruit and Field Inc.")
    )
      setSurveyProvider(SurveyProviders.RecruitAndField);
    else if (
      body.includes("This form was created inside of Consumer Viewpoint.")
    )
      setSurveyProvider(SurveyProviders.ConsumerViewpoint);
    else if (surveyProvider === SurveyProviders.Unknown) {
      const document = new DOMParser().parseFromString(body, "text/html");
      const headerImageSrc = (
        document.querySelector("header img") as HTMLImageElement | null
      )?.src;
      if (headerImageSrc) {
        const headerImage = new Image();
        headerImage.src = headerImageSrc;

        const adlerWeinerImage = new Image();
        adlerWeinerImage.src = "../assets/adlerweinerresearch.png";
        compareImages(headerImage, adlerWeinerImage, () =>
          setSurveyProvider(SurveyProviders.AdlerWeiner)
        );
      }
    }
  }, [body, url]);

  useEffect(() => {
    const fetchSurveyAnswer = async () => {
      setIsLoading(true);
      const answer = surveyAnswers[surveyProvider];
      await answer?.waitForAllQuestions();
      setSurveyAnswer(answer);
      setOpenSurveyProviderDropdown(answer === undefined);
      setIsLoading(false);
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
                    {provider === surveyProvider && <StarBorder />}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      SurveyProviders[provider] ===
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

      {isLoading ? (
        <Container>
          <h1>Loading Survey...</h1>
        </Container>
      ) : surveyAnswer === undefined ? (
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
