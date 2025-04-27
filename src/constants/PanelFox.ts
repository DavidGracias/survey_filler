import SurveyAnswers from "../types/SurveyAnswers";
import { Information } from "../types/Information";
import { WeightedOption, chooseWeightedOption } from "./util/WeightedOptions";
import { ageAtDate } from "./util/Age";
import { indexFromRanges } from "./util/IndexFromRange";
import { Gender, Race, PoliticalAffiliation } from "../types/InformationEnums";
import { setInputValue } from "./util/InputValues";

const PanelFox = new SurveyAnswers({
  nextButtonAction: "button.big",
  questionSelector: ".SortableItem",
  additionalContext: [
    ageAtDate,
    indexFromRanges,
    WeightedOption,
    chooseWeightedOption,
    selectOptionWithText,
  ],
});

function selectOptionWithText(questionElement: HTMLElement, needles: string[]) {
  needles = needles.map((n) => n.trim().toLowerCase());
  questionElement
    .querySelectorAll(".option-label__tag")
    .forEach((option_label) => {
      const haystack = option_label.textContent!.trim().toLowerCase();
      var found = true;
      needles.forEach((needle) => (found &&= haystack.includes(needle)));
      if (found) (option_label as HTMLDivElement).click();
    });
}

PanelFox.addQuestion(
  ["Thank you for your interest in this upcoming paid marketing research study"],
  () => { },
  { hardcoded: true }
);

PanelFox.addQuestion(
  ["First Name"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    (element.querySelector("input") as HTMLInputElement).value =
      information.firstName;
  }
);
PanelFox.addQuestion(
  ["Last Name"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    (element.querySelector("input") as HTMLInputElement).value =
      information.lastName;
  }
);
PanelFox.addQuestion(
  ["Email"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    (element.querySelector("input") as HTMLInputElement).value =
      information.email;
  }
);
PanelFox.addQuestion(
  ["Phone Number"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    (element.querySelector("input") as HTMLInputElement).value =
      information.phone.number;
  }
);
PanelFox.addQuestion(
  ["Phone"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    (element.querySelector("input") as HTMLInputElement).value =
      information.phone.number;
  }
);
PanelFox.addQuestion(
  ["City"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    (element.querySelector("input") as HTMLInputElement).value =
      information.city;
  }
);
PanelFox.addQuestion(
  ["Zip"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    (element.querySelector("input") as HTMLInputElement).value =
      information.zipcode;
  }
);

PanelFox.addQuestion(
  [
    "Do you certify that the information you provide on this survey is true and accurate",
  ],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    selectOptionWithText(element, ["yes"]);
  },
  { hardcoded: true }
);

PanelFox.addQuestion(
  ["How did you hear about this study"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    selectOptionWithText(element, ["email"]);
  },
  { hardcoded: true }
);

PanelFox.addQuestion(
  ["What state do you reside"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    var state =
      information.state.substring(0, 1).toUpperCase() +
      information.state.substring(1).toLowerCase();
    var state2 = information.stateAbbreviation.toUpperCase();

    const select = element.querySelector("select") as HTMLSelectElement;
    const includes = (s: string) => select.innerHTML.includes("value='" + s + "'") || select.innerHTML.includes('value="' + s + '"');

    if (includes(state)) {
      select.value = state;
      select.dispatchEvent(new Event("change"));
    } else if (includes(state2)) {
      select.value = state2;
      select.dispatchEvent(new Event("change"));
    }
  }
);

PanelFox.addQuestion(
  ["What is your gender"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    switch (information.gender) {
      case Gender.Male:
        element.querySelectorAll("input")[0].click();
        break;
      case Gender.Female:
        element.querySelectorAll("input")[1].click();
        break;
      case Gender.NonBinary:
        element.querySelectorAll("input")[2].click();
        break;
    }
  }
);

PanelFox.addQuestion(
  ["When was the last time you participated in", "focus group"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    const weightedOptions = [];
    weightedOptions.push(WeightedOption(["never"], 1));
    weightedOptions.push(WeightedOption(["more"], 9));
    weightedOptions.push(WeightedOption(["less"], 0));

    const option = chooseWeightedOption(weightedOptions);
    option && selectOptionWithText(element, option);
  },
  { hardcoded: true }
);

PanelFox.addQuestion(
  ["Are you of Hispanic, Latino, or Spanish origin or descent"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    selectOptionWithText(element, [
      information.race == Race.Hispanic ? "yes" : "no",
    ]);
  }
);

PanelFox.addQuestion(
  ["your", "race", "ethnicity"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    selectOptionWithText(element, information.race.toString().split(" "));
  }
);

PanelFox.addQuestion(
  ["date", "of", "birth"],
  (information: Information, selector: string, i: number) => {
    var element = document.querySelectorAll(selector)[i] as HTMLElement;
    while (!element) {
      element = document.querySelectorAll(selector)[i] as HTMLElement;
    }
    
    var input = element.querySelector("input");
    while (!input) {
      input = element.querySelector("input");
    }
    window.alert(input);

    setInputValue(input, information.dob_mmddyyyy_slash);
  }
);

PanelFox.addQuestion(
  ["age", "range"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    const options: NodeListOf<HTMLElement> =
      element.querySelectorAll(".option-label__tag");

    const index = indexFromRanges(Array.from(options), information.age);
    if (index != -1) options[index].click();
  }
);

PanelFox.addQuestion(
  ["What is your exact age"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    (element.querySelector("input") as HTMLInputElement).value =
      information.age.toString();
  }
);

PanelFox.addQuestion(
  ["schooling", "you", "completed"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    selectOptionWithText(element, [
      information.education.level.toString().split(" ")[0].substring(0, -1),
    ]);
  }
);

PanelFox.addQuestion(
  ["Are you registered to vote"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    selectOptionWithText(element, [information.age >= 18 ? "yes" : "no"]);
  }
);

PanelFox.addQuestion(
  ["Democrat", "Republican", "Independent", "else"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    let options: string[] = [];
    switch (information.politicalAffiliation) {
      case PoliticalAffiliation.Democrat:
        options = ["strong", "democrat"];
        break;
      case PoliticalAffiliation.Republican:
        options = ["strong", "republican"];
        break;
      case PoliticalAffiliation.LeanDemocrat:
        options = ["lean", "democrat"];
        break;
      case PoliticalAffiliation.LeanRepublican:
        options = ["lean", "republican"];
        break;
      case PoliticalAffiliation.Independent:
        options = ["independent", "no", "lean"];
        break;
      case PoliticalAffiliation.IndependentLeanDemocrat:
        options = ["independent", "dem"];
        break;
      case PoliticalAffiliation.IndependentLeanRepublican:
        options = ["independent", "rep"];
        break;
      case PoliticalAffiliation.Libertarian:
      case PoliticalAffiliation.Green:
      case PoliticalAffiliation.Communist:
      case PoliticalAffiliation.Other:
        options = ["other"];
        (element.querySelector("input") as HTMLInputElement).value =
          information.politicalAffiliation.toString();
        break;
    }
    selectOptionWithText(element, options);
  }
);

PanelFox.addQuestion(
  ["How important is politics to your personal identity"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    const weightedOptions = [];
    weightedOptions.push(WeightedOption(["not", "important"], 0));
    weightedOptions.push(WeightedOption(["very", "important"], 4));
    weightedOptions.push(WeightedOption(["somewhat", "important"], 6));
    const option = chooseWeightedOption(weightedOptions);
    option && selectOptionWithText(element, option);
  },
  { hardcoded: true }
);

PanelFox.addQuestion(
  ["you", "family", "friend", "work", "any"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    selectOptionWithText(element, ["no"]);
  },
  { canDuplicate: true, hardcoded: true }
);

PanelFox.addQuestion(
  ["vote", "2020", "president", "election"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    if (ageAtDate(information.dob_mmddyyyy_slash, "2020-11-03") < 18)
      selectOptionWithText(element, ["not", "eligible"]);
    else selectOptionWithText(element, ["biden"]);
  },
  { hardcoded: true }
);

PanelFox.addQuestion(
  ["vote", "2024", "president", "election"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    if (ageAtDate(information.dob_mmddyyyy_slash, "2024-11-05") < 18)
      selectOptionWithText(element, ["not", "eligible"]);
    else selectOptionWithText(element, ["harris"]);
  },
  { hardcoded: true }
);

PanelFox.addQuestion(
  ["describes", "you", "group"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    selectOptionWithText(element, [
      "no difficulty",
      "enjoy",
      "group discussion",
    ]);
  },
  { hardcoded: true }
);

PanelFox.addQuestion(
  ["Do you have a working", "webcam", "internet", "quiet"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    selectOptionWithText(element, ["yes"]);
  },
  { canDuplicate: true, hardcoded: true }
);

PanelFox.addQuestion(
  ["Were you born in the United States"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    selectOptionWithText(element, ["yes"]);
  },
  { hardcoded: true }
);

PanelFox.addQuestion(
  ["nation", "of", "origin"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    selectOptionWithText(element, [information.nationOfOrigin.toString().slice(0, -1)]);
  }
);

export default PanelFox;
