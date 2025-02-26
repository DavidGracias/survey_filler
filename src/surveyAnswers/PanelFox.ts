import SurveyAnswers from "../types/SurveyAnswers";
import { Information } from "../types/Information";
import { WeightedOption, chooseWeightedOption } from "./util/WeightedOptions";
import { ageAtDate } from "./util/ageAtDate";

const PanelFox = new SurveyAnswers({
  nextButtonAction: "button.big",
  questionSelector: ".SortableItem",
  additionalContext: [
    selectOptionWithText,
    ageAtDate,
    WeightedOption,
    chooseWeightedOption,
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
      information.phone;
  }
);
PanelFox.addQuestion(
  ["Phone"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    (element.querySelector("input") as HTMLInputElement).value =
      information.phone;
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
  false,
  true
);

PanelFox.addQuestion(
  ["How did you hear about this study?"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    selectOptionWithText(element, ["email"]);
  },
  false,
  true
);

PanelFox.addQuestion(
  ["What state do you reside?"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    var state =
      information.state.substring(0, 1).toUpperCase() +
      information.state.substring(1).toLowerCase();
    (element.querySelector("select") as HTMLSelectElement).value = state;
  }
);

PanelFox.addQuestion(
  ["What is your gender?"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    switch (information.gender) {
      case "m":
        element.querySelectorAll("input")[0].click();
        break;
      case "f":
        element.querySelectorAll("input")[1].click();
        break;
      case "n":
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
  false,
  true
);

PanelFox.addQuestion(
  ["Are you of Hispanic, Latino, or Spanish origin or descent?"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    selectOptionWithText(element, [information.race == "hispanic" ? "yes" : "no"]);
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
  ["age", "range"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    const options: NodeListOf<HTMLElement> =
      element.querySelectorAll(".option-label__tag");

    let under: number | undefined, over: number;

    Array.from(options)
      .filter((option) => option.textContent!.includes("-"))
      .forEach((option) => {
        var [lower, higher] = option.textContent!.trim().split("-");
        if (
          parseInt(lower) <= information.age &&
          information.age <= parseInt(higher)
        )
          option.click();

        if (under == undefined) under = parseInt(lower);
        over = parseInt(higher);
      });
    if (information.age < under!) {
      options[0].click();
    } else if (information.age > over!) {
      options[options.length - 1].click();
    }
  }
);

PanelFox.addQuestion(
  ["What is your exact age?"],
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
    selectOptionWithText(element, [information.educationLevel.split(" ")[0].substring(0, -1)]);
  }
);

PanelFox.addQuestion(
  ["Are you registered to vote?"],
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
      case "democrat":
        options = ["strong", "democrat"];
        break;
      case "republican":
        options = ["strong", "republican"];
        break;
      case "lean democrat":
        options = ["lean", "democrat"];
        break;
      case "lean republican":
        options = ["lean", "republican"];
        break;
      case "independent":
        options = ["independent", "no", "lean"];
        break;
      case "independent lean democrat":
        options = ["independent", "dem"];
        break;
      case "independent lean republican":
        options = ["independent", "rep"];
        break;
      case "libertarian":
      case "green":
      case "communist":
        case "other":
        options = ["other"];
        (element.querySelector("input") as HTMLInputElement).value = information.politicalAffiliation;
        break;
    }
    selectOptionWithText(element, options);
  }
);

PanelFox.addQuestion(
  ["How important is politics to your personal identity?"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    const weightedOptions = [];
    weightedOptions.push(WeightedOption(["not", "important"], 0));
    weightedOptions.push(WeightedOption(["very", "important"], 4));
    weightedOptions.push(WeightedOption(["somewhat", "important"], 6));
    const option = chooseWeightedOption(weightedOptions);
    option && selectOptionWithText(element, option);
  },
  false,
  true,
);

PanelFox.addQuestion(
  ["you", "family", "friend", "work", "any"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    selectOptionWithText(element, ["no"]);
  },
  true,
  true,
);

PanelFox.addQuestion(
  ["vote", "2020", "president", "election"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    if (ageAtDate(information.dob_mmddyyyy_slash, "2020-11-03") < 18)
      selectOptionWithText(element, ["not", "eligible"]);
    else selectOptionWithText(element, ["biden"]);
  },
  false,
  true
);

PanelFox.addQuestion(
  ["vote", "2024", "president", "election"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    if (ageAtDate(information.dob_mmddyyyy_slash, "2024-11-05") < 18)
      selectOptionWithText(element, ["not", "eligible"]);
    else selectOptionWithText(element, ["harris"]);
  },
  false,
  true
);

PanelFox.addQuestion(
  ["describes", "you", "group"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    selectOptionWithText(element, ["no difficulty", "enjoy", "group discussion"]);
  },
  false,
  true
);

PanelFox.addQuestion(
  ["Do you have a working", "webcam", "internet", "quiet"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    selectOptionWithText(element, ["yes"]);
  },
  true,
  true
);

PanelFox.addQuestion(
  ["Were you born in the United States?"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    selectOptionWithText(element, ["yes"]);
  },
  false,
  true
);

PanelFox.addQuestion(
  ["nation", "of", "origin"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    selectOptionWithText(element, [information.nationOfOrigin.slice(0, -1)]);
  }
);

export default PanelFox;
