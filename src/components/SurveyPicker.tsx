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

import { defaultBody } from "../App";
import ComponentProps from "../types/ComponentProps";
import GenericSurvey from "./GenericSurvey";

import SurveyAnswers from "../types/SurveyAnswers";
import PanelFox from "../surveyAnswers/PanelFox";
import PRC from "../surveyAnswers/PRC";
import RecruitAndField from "../surveyAnswers/RecruitAndField";
import AdlerWeiner from "../surveyAnswers/AdlerWeiner";
import FocusInsite from "../surveyAnswers/FocusInsite";

enum SurveyProviders {
  PRC,
  FieldWork,
  RecruitAndField,
  AdlerWeiner,
  FocusInsite,
  // Hilton,
  Unknown,
}

const surveyAnswers: Record<SurveyProviders, SurveyAnswers | undefined> = {
  [SurveyProviders.PRC]: PRC,
  [SurveyProviders.FieldWork]: PanelFox,
  [SurveyProviders.RecruitAndField]: RecruitAndField,
  [SurveyProviders.AdlerWeiner]: AdlerWeiner,
  [SurveyProviders.FocusInsite]: FocusInsite,
  // [SurveyProviders.Hilton]: undefined,
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

    const document = new DOMParser().parseFromString(body, "text/html");
    const headerImageSrc = (
      document.querySelector("header img") as HTMLImageElement | null
    )?.src;

    if (url.includes("panelfox.io/s/FieldGoals"))
      setSurveyProvider(SurveyProviders.FieldWork);
    else if (
      body.includes("This form was created inside of Recruit and Field Inc.")
    )
      setSurveyProvider(SurveyProviders.RecruitAndField);
    else if (surveyProvider == SurveyProviders.Unknown && headerImageSrc) {
      const headerImage = new Image();
      headerImage.src = headerImageSrc;

      const adlerWeinerImage = new Image();
      adlerWeinerImage.src = "../assets/adlerweinerresearch.png";
      compareImages(headerImage, adlerWeinerImage, () =>
        setSurveyProvider(SurveyProviders.AdlerWeiner)
      );
    }
  }, [body, url]);

  useEffect(() => {
    const fetchSurveyAnswer = async () => {
      const surveyAnswer = surveyAnswers[surveyProvider];
      if (surveyAnswer !== undefined) {
        await surveyAnswer.waitForAllQuestions();
        setOpenSurveyProviderDropdown(false);
        await triggerContextInjection(surveyAnswer, tabId);
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

async function compareImages(
  image1: HTMLImageElement,
  image2: HTMLImageElement,
  onMatch: () => void
) {
  while (!image1.complete || !image2.complete) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  const canvas = document.createElement("canvas");
  canvas.width = Math.min(image1.width, image2.width);
  canvas.height = Math.min(image1.height, image2.height);
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

  ctx.drawImage(image1, 0, 0, canvas.width, canvas.height);
  const image1Data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing image2
  ctx.drawImage(image2, 0, 0, canvas.width, canvas.height);
  const image2Data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  let similarPixels = 0;
  const pixelTolerance = 30;

  for (let i = 0; i < image1Data.length; i += 4) {
    let isSimilar = true;
    // Iterate over RGBA for each pixel
    for (let j = 0; j < 4; ++j)
      isSimilar &&=
        Math.abs(image1Data[i + j] - image2Data[i + j]) <= pixelTolerance;
    if (isSimilar) similarPixels++;
  }

  const totalPixels = canvas.width * canvas.height;

  const similarityThreshold = 0.7;
  if (similarPixels / totalPixels >= similarityThreshold) onMatch();
}

async function triggerContextInjection(surveyAnswer: SurveyAnswers, tabId: number) {
  const { additionalContext, ...mainContext } = surveyAnswer.getContext();
  
  const injectContext = {
    ...mainContext,
    ...Object.fromEntries(
      additionalContext.map((item) => [item.name, item])
    ),
  };

  const injectCode = Object.entries(injectContext)
      .map(([key, value]) => 
        `globalThis.${key} = ${typeof value === 'string' ? JSON.stringify(value) : value};`
      ).join("\n");

  await chrome.scripting.executeScript({
    target: { tabId: tabId },
    world: "MAIN",
    func: (code) => {
      new Function(code)();
    },
    args: [injectCode]
  });
}
