import SurveyAnswers from "../types/SurveyAnswers";
import { Information } from "../types/Information";
import { chooseWeightedOption } from "./util/WeightedOptions";
import { WeightedOption } from "./util/WeightedOptions";
import { indexFromRanges } from "./util/IndexFromRange";

const AdlerWeiner = new SurveyAnswers({
  nextButtonAction: "button[type='submit']",
  questionSelector: "div.question-container",
  additionalContext: [
    WeightedOption,
    chooseWeightedOption,
    selectOptionWithText,
    indexFromRanges,
    pressLabelIfNotChecked,
  ],
});

function selectOptionWithText(questionElement: HTMLElement, needles: string[]) {
  needles = needles.map((n) => n.trim().toLowerCase());
  questionElement.querySelectorAll("label").forEach((option_label) => {
    const haystack = option_label.textContent!.trim().toLowerCase();
    var found = true;
    needles.forEach((needle) => (found &&= haystack.includes(needle)));
    if (found) pressLabelIfNotChecked(option_label);
  });
}

function pressLabelIfNotChecked(label: HTMLLabelElement) {
  if (!label.classList.contains("checked")) label.click();
}

AdlerWeiner.addQuestion(
  [
    "Right to Opt-Out Info",
    "Financial Incentive Info",
    "Adler Weiner Privacy Policy",
  ],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    const labels = element.querySelectorAll("label");
    for (const label of labels) {
      pressLabelIfNotChecked(label);
    }
  },
  false,
  true
);

AdlerWeiner.addQuestion(
  [
    "the following",
    "Name",
    "Address",
    "City/Town",
    "State/Province",
    "ZIP/Postal Code",
    "Email Address",
    "Phone Number",
  ],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    const inputs = element.querySelectorAll("input");
    const answers = [
      information.fullName,
      information.streetAddress,
      information.city,
      information.state,
      information.zipcode,
      information.email,
      information.phone,
    ];
    for (let i = 0; i < inputs.length; i++) {
      (inputs[i] as HTMLInputElement).value = answers[i];
    }
  }
);

AdlerWeiner.addQuestion(
  ["Which area of the country is your permanent residence?"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    const labels = Array.from(element.querySelectorAll("label"));

    labels.forEach((label) => {
      const text = label.innerText.toLowerCase().split(" ");
      if (text.includes("outside")) {
        const index = text.indexOf("outside");
        text[index + 2] = "";
      }

      if (text.join(" ").includes(information.state.toLowerCase()))
        pressLabelIfNotChecked(label);
    });
  }
);

AdlerWeiner.addQuestion(
  ["gender", "identify"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    let gender = "other";
    switch (information.gender) {
      case "m":
        gender = "male";
        break;
      case "f":
        gender = "female";
        break;
      case "n":
        gender = "non-binary";
        break;
    }
    selectOptionWithText(element, [gender]);
  }
);

AdlerWeiner.addQuestion(
  ["age", "group"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    const options = Array.from(element.querySelectorAll("label"));
    const index = indexFromRanges(options, information.age);
    if (index != -1) pressLabelIfNotChecked(options[index]);
  }
);

AdlerWeiner.addQuestion(
  ["What is your exact age?"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    element.querySelector("input")!.value = information.age.toString();
  }
);

AdlerWeiner.addQuestion(
  ["ethnicity", "identify"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    switch (information.race) {
      case "white":
        selectOptionWithText(element, ["white"]);
        break;
      case "black":
        selectOptionWithText(element, ["black"]);
        break;
      case "asian":
        selectOptionWithText(element, ["asian"]);
        break;
      case "hispanic":
        selectOptionWithText(element, ["hispanic"]);
        break;
      case "native american":
      case "middle eastern":
      case "mixed race":
      case "other":
        selectOptionWithText(element, ["other"]);
        element.querySelector("input")!.value = information.race;
        break;
    }
  }
);

AdlerWeiner.addQuestion(
  ["last time", "participated", "in", "a", "study"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    const weightedOptions = [];
    weightedOptions.push(WeightedOption(["under", "month"], 0));
    weightedOptions.push(WeightedOption(["1", "3", "month"], 1));
    weightedOptions.push(WeightedOption(["4", "6", "month"], 2));
    weightedOptions.push(WeightedOption(["over", "months"], 4));
    weightedOptions.push(WeightedOption(["never"], 0));

    const option = chooseWeightedOption(weightedOptions);

    if (option) selectOptionWithText(element, option);
  },
  false,
  true
);

AdlerWeiner.addQuestion(
  ["What subject was it on?"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    const weightedOptions = [];
    weightedOptions.push(WeightedOption("Virtual Reality", 1));
    weightedOptions.push(WeightedOption("Pet Food", 1));
    weightedOptions.push(WeightedOption("Cannabis Consumption", 1));
    const option = chooseWeightedOption(weightedOptions);

    const input = element.querySelector("input")!;
    input.value = option!;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  },
  false,
  true
);

AdlerWeiner.addQuestion(
  ["you", "family", "employment history", "with", "any of the following"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    const labels = Array.from(element.querySelectorAll("label"));
    for (const label of labels) {
      const text = label.innerText.toLowerCase();
      if (text.includes("none of the above")) pressLabelIfNotChecked(label);
    }
  },
  true,
  true
);

AdlerWeiner.addQuestion(
  ["your", "yearly", "income"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    const labels = Array.from(element.querySelectorAll("label"));
    const index = indexFromRanges(labels, information.employment?.salary ?? 0);
    if (index != -1) pressLabelIfNotChecked(labels[index]);
  }
);

AdlerWeiner.addQuestion(
  ["week", "how many hours do you", "watch"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    element.querySelectorAll("label").forEach((label) => {
      pressLabelIfNotChecked(label);
    });
  },
  false,
  true
);

export default AdlerWeiner;
