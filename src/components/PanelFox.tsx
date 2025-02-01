import { Box, Container } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { Information } from '../types/Information';

import ComponentProps from '../types/ComponentProps';

enum Question {
  Unknown,
  Skip,
  Intro,
  DoB,
  Demographics,
  Location,
}

export default function PanelFox({ url, body, tabId, information }: ComponentProps) {
  const [question, setQuestion] = useState<Question>(Question.Unknown);
  const [extensionLabel, setExtensionLabel] = useState<String>("Page still loading");



  useEffect(() => {
    if (!body.includes("<input")) {
      setQuestion(Question.Skip);
    } else if (body.includes("First Name") && body.includes("Last Name") && body.includes("Email") && body.includes("Cell Phone Number") && body.includes("Alternate Phone Number") && body.includes("In what state do you reside?") && body.includes("What is your 5-digit zip code?")) {
      setQuestion(Question.Intro);
    } else if (body.includes("What is your date of birth?")) {
      setQuestion(Question.DoB);
    } else if (body.includes("What is your gender?") && body.includes("What is your age?") && body.includes("Which of the following best describes your racial or ethnic identity?")) {
      setQuestion(Question.Demographics);
    } else if (body.includes("In which time zone do you live?") && body.includes("What region do you live in?")) {
      setQuestion(Question.Location);
    }
    else {
      setQuestion(Question.Unknown);
    }
  }, [body]);



  useEffect(() => {

    var questionFunction = (() => {

      setExtensionLabel(`Auto-filling the ${Question[question]} page... wait one moment please`);

      switch (question) {

        case Question.Skip:
          setExtensionLabel("Nothing to fill out here, skipping!");
          return (information: Information) => {
            setTimeout(() => {
              document.querySelector("button")!.click();
            }, 5e2);
          }

        case Question.Intro:
          return (information: Information) => {
            const inputs = document.querySelectorAll("input[placeholder='Your answer']")!;
            var answers = [information.firstName, information.lastName, information.email, information.phone, "", information.zipcode];
            for (let i = 0; i < inputs.length; i++)
              (inputs[i] as HTMLInputElement).value = answers[i];

            (document.querySelector("select") as HTMLSelectElement).value = information.stateAbbreviation.toUpperCase();

            setTimeout(() => {
              document.querySelector("button")!.click();
            }, 5e2);
          };

        case Question.DoB:
          return (information: Information) => {
            const input: HTMLInputElement = document.querySelector("input")!;

            input.value = information.dob_mmddyyyy_slash;
            input.dispatchEvent(new Event('input', { bubbles: true }));

            setTimeout(() => {
              document.querySelector("button")!.click();
            }, 1e3);
          };

        case Question.Demographics:
          return (information: Information) => {

            switch (information.gender) {
              case "m": document.querySelectorAll("input")[0].click(); break;
              case "f": document.querySelectorAll("input")[1].click(); break;
              case "n": document.querySelectorAll("input")[2].click(); break;
            }

            document.querySelectorAll("input")[3].value = information.age.toString();

            document.querySelectorAll(".option-label__tag").forEach((label) => {
              if (label.textContent!.trim() == "Hispanic")
                (label as HTMLDivElement).click();
            });

            setTimeout(() => {
              document.querySelector("button")!.click();
            }, 1e3);
          };

        case Question.Location:
          return (information: Information) => {
            document.querySelectorAll(".option-label__tag").forEach((label) => {
              if (label.textContent?.includes(information.tz.toUpperCase()))
                (label as HTMLDivElement).click();
            });


            var wnocaOptionExists = true;
            document.querySelectorAll(".option-label__tag").forEach((label) => {
              const text = (label.textContent ?? "").toLowerCase();
              ["west", "california"].forEach((region) => (wnocaOptionExists &&= text.includes(region)));
            });

            var regionText: string[] = [];
            switch (information.region) {
              case "ne": regionText = ["north", "east"]; break;
              case "mw": regionText = ["mid", "west"]; break;
              case "s": regionText = ["south"]; break;
              case "c": regionText = wnocaOptionExists ? ["california"] : ["west"]; break; // TODO: fix this case, currently it doesn't matter since we live in non-CA states
              case "w": regionText = wnocaOptionExists ? ["west", "california"] : ["west"]; break;
            }

            document.querySelectorAll(".option-label__tag").forEach((label) => {
              const text = (label.textContent ?? "").toLowerCase();
              var found = true;
              regionText.forEach((region) => (found &&= text.includes(region)));
              if (found) (label as HTMLDivElement).click();
            });

            setTimeout(() => {
              document.querySelector("button")!.click();
            }, 1e3);
          };

        case Question.Unknown:
          setExtensionLabel("This is an known page, please fill out manually");
          return (information: Information) => {

          };



      }; // end of swiutch statement
      return (information: Information) => null;
    })();

    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: questionFunction,
      args: [information],
    });


  }, [question]);

  return <Box> {extensionLabel} </Box>;
}