import SurveyAnswers from "../types/SurveyAnswers";
import { Information } from "../types/Information";
import { EducationLevel } from "../types/InformationEnums";
import {
  chooseWeightedOption,
  WeightedOption,
  indexFromRanges,
  setInputValue,
} from "./util";

const AdlerWeiner = new SurveyAnswers({
  nextButtonAction: () => {
    const buttons: HTMLButtonElement[] = Array.from(
      document.querySelectorAll("button[type='submit']")
    );
    const button = buttons.find(
      (button) => button.textContent?.trim() === "Next"
    );
    button?.click();
  },
  questionSelector: "div.question-container",
  additionalContext: [
    selectOptionWithText,
    pressLabelIfNotChecked,
    EducationLevel,
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
  { hardcoded: true }
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
      information.phone.number,
    ];
    for (let i = 0; i < inputs.length; i++) {
      setInputValue(inputs[i] as HTMLInputElement, answers[i]);
    }
  }
);

AdlerWeiner.addQuestion(
  [
    "CONTACT INFO",
    "the following",
    "First and Last Name",
    "Mailing Address",
    "Apt",
    "City/Town",
    "State/Province",
    "ZIP/Postal Code",
    "Email Address",
    "Cell Phone Number",
  ],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    const inputs = element.querySelectorAll("input");
    const answers = [
      information.fullName,
      information.streetAddress,
      information.streetAddressII ?? "N/a",
      information.city,
      information.state,
      information.zipcode,
      information.email,
      information.phone.number,
    ];
    for (let i = 0; i < inputs.length; i++) {
      setInputValue(inputs[i] as HTMLInputElement, answers[i]);
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
  ["Where in the country do you live?"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    switch (information.region) {
      case "c":
        const weightedOptions = [];
        weightedOptions.push(WeightedOption(["Southern CA"], 1));
        weightedOptions.push(WeightedOption(["Northern CA"], 1));
        const option = chooseWeightedOption(weightedOptions);
        if (option) selectOptionWithText(element, option);
        break;
      case "w":
        selectOptionWithText(element, ["West outside of CA"]);
        break;
      case "mw":
        if (information.state.toLowerCase() == "illinois") {
          selectOptionWithText(element, ["Illinois"]);
        } else {
          selectOptionWithText(element, ["Midwest outside of Illinois"]);
        }
        break;
      case "s":
        selectOptionWithText(element, ["South"]);
        break;
      case "ne":
        selectOptionWithText(element, ["Northeast"]);
        break;
      default:
        selectOptionWithText(element, ["East"]);
    }
  }
);

AdlerWeiner.addQuestion(
  ["gender", "identi"],
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
  ["Are you", "male", "female", "non binary", "self describe"],
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
        gender = "non binary";
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
  ["age", "category"],
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

    setInputValue(element.querySelector("input")!, information.age.toString());
  }
);

AdlerWeiner.addQuestion(
  ["What is your exact age and date of birth?"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    const inputs = Array.from(element.querySelectorAll("input"));

    const answers = [
      information.age.toString(),
      information.dob_mmddyyyy_slash,
    ];
    for (let i = 0; i < inputs.length; i++) {
      setInputValue(inputs[i] as HTMLInputElement, answers[i]);
    }
  }
);

AdlerWeiner.addQuestion(
  ["What is your ethnicity"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    switch (information.race) {
      case "white":
        selectOptionWithText(element, ["caucasian"]);
        break;
      case "black":
        selectOptionWithText(element, ["african", "american"]);
        break;
      case "asian":
        selectOptionWithText(element, ["asian"]);
        break;
      case "hispanic":
        selectOptionWithText(element, ["hispanic"]);
        break;
      default:
        selectOptionWithText(element, ["other"]);
        setInputValue(element.querySelector("input")!, information.race);
        break;
    }
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

        setInputValue(element.querySelector("input")!, information.race);
        break;
    }
  }
);

AdlerWeiner.addQuestion(
  ["ethnic", "background"],
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
        setInputValue(element.querySelector("input")!, information.race);
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
  { hardcoded: true }
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

    setInputValue(element.querySelector("input")!, option!);
  },
  { hardcoded: true }
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
  { hardcoded: true }
);

AdlerWeiner.addQuestion(
  ["you", "household", "employed", "retired", "companies"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    const labels = Array.from(element.querySelectorAll("label"));
    for (const label of labels) {
      const text = label.innerText.toLowerCase();
      if (text.includes("none of the above")) pressLabelIfNotChecked(label);
    }
  },
  { hardcoded: true }
);

AdlerWeiner.addQuestion(
  ["category", "describes", "employ", "status"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    let status: string[] = [];
    switch (information.employment.status) {
      case "full time in person":
        status = ["full", "time", "outside"];
        break;
      case "self employed":
      case "full time remote":
        status = ["full", "time", "work from home"];
        break;
      case "part time":
        status = ["part", "time"];
        break;
      case "student":
        status = ["student"];
        break;
      case "homemaker":
        status = ["homemaker"];
        break;
      case "retired":
      case "other":
      case "unemployed":
        status = ["unemployed"];
        break;
    }
    selectOptionWithText(element, status);
  }
);

AdlerWeiner.addQuestion(
  ["provide", "employment", "information"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    const answers = [
      information.employment.occupation,
      information.employment.employer,
      information.employment.industry,
    ];
    const inputs = element.querySelectorAll("input");
    for (let i = 0; i < answers.length; i++) {
      setInputValue(inputs[i], answers[i] || "N/A");
    }
  }
);

AdlerWeiner.addQuestion(
  ["describes", "employment", "status"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    let status: string[] = [];
    switch (information.employment.status) {
      case "full time in person":
      case "full time remote":
        status = ["full", "time"];
        break;
      case "part time":
        status = ["part", "time"];
        break;
      case "self employed":
        status = ["self", "employed"];
        break;
      case "student":
        status = ["student", "not working"];
        break;
      case "homemaker":
        status = ["homemaker"];
        break;
      case "retired":
      case "other":
      case "unemployed":
        status = ["unemployed"];
        break;
    }
    selectOptionWithText(element, status);
  },
  { canDuplicate: true }
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
  ["annual", "household", "income"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    const labels = Array.from(element.querySelectorAll("label"));
    const index = indexFromRanges(labels, information.employment?.salary ?? 0);
    if (index != -1) pressLabelIfNotChecked(labels[index]);
  }
);

AdlerWeiner.addQuestion(
  ["living", "situation"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    let option = [];
    if (information.household.length === 0) {
      option = ["alone"];
    } else if (
      information.household.filter(
        (housemate) => housemate.relationship === "significant other"
      ).length > 0
    ) {
      option = ["significant other"];
      const children = information.household.filter(
        (housemate) => housemate.relationship === "child"
      );
      if (children.length > 0) {
        option.push("children");
        if (children.some((child) => child.age < 12)) {
          option.push("12", "under");
        } else {
          option.push("13", "older");
        }
      }
    } else if (
      information.household.filter(
        (housemate) => housemate.relationship === "other"
      ).length == information.household.length
    ) {
      option = ["roommate"];
    } else {
      option = ["family"];
    }

    selectOptionWithText(element, option);
  }
);

AdlerWeiner.addQuestion(
  ["children", "under", "18", "in", "household"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    const childrenUnder18 = information.household
      .filter((housemate) => housemate.relationship === "child")
      .filter((child) => child.age <= 18);
    if (childrenUnder18.length > 0) {
      selectOptionWithText(element, ["yes"]);
      setInputValue(
        element.querySelector("input")!,
        childrenUnder18.map((child) => child.age).join(", ")
      );
    } else {
      selectOptionWithText(element, ["no"]);
    }
  }
);

AdlerWeiner.addQuestion(
  ["Are you...", "single", "married"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    switch (information.maritalStatus) {
      case "single":
        selectOptionWithText(element, ["single"]);
        break;
      case "married":
        selectOptionWithText(element, ["married"]);
        break;
      case "domestic partner":
      case "living with significant other":
        selectOptionWithText(element, ["cohabitat"]);
        break;
      case "separated":
      case "divorced":
        selectOptionWithText(element, ["divorce", "separate"]);
        break;
      case "widowed":
        selectOptionWithText(element, ["widow"]);
        break;
    }
  }
);

AdlerWeiner.addQuestion(
  ["currently", "children", "under 18", "household"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    const childrenUnder18 = information.household
      .filter((housemate) => housemate.relationship === "child")
      .filter((child) => child.age <= 18);
    if (childrenUnder18.length > 0) {
      selectOptionWithText(element, ["yes"]);
      setInputValue(
        element.querySelector("input")!,
        childrenUnder18.map((child) => child.age).join(", ")
      );
    } else {
      selectOptionWithText(element, ["no"]);
    }
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
  { hardcoded: true }
);

AdlerWeiner.addQuestion(
  [
    "What is the name of the company you work at? The industry? Your job title?",
  ],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    const labels = Array.from(element.querySelectorAll("label"));
    labels.forEach((label) => {
      const text = label.innerText.toLowerCase();

      if (text.includes("name of company")) {
        setInputValue(
          label.nextSibling as HTMLInputElement,
          information.employment.employer ?? "N/A"
        );
      } else if (text.includes("industry")) {
        setInputValue(
          label.nextSibling as HTMLInputElement,
          information.employment.industry ?? "N/A"
        );
      } else if (text.includes("job title")) {
        setInputValue(
          label.nextSibling as HTMLInputElement,
          information.employment.occupation ?? "N/A"
        );
      } else if (text.includes("student") && text.includes("major")) {
        setInputValue(
          label.nextSibling as HTMLInputElement,
          information.education.major ?? "N/A"
        );
      }
    });
  }
);

AdlerWeiner.addQuestion(
  [
    "Would you consider your occupation to be",
    "white",
    "blue",
    "pink",
    "grey",
    "collar",
  ],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    const labels = Array.from(element.querySelectorAll("label"));
    labels.forEach((label) => {
      if (label.innerText.toLowerCase().includes(information.employment.collar))
        pressLabelIfNotChecked(label);
    });
  }
);

AdlerWeiner.addQuestion(
  ["highest", "education", "level", "complete"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    window.alert(
      "triggered enum function with enum: " + JSON.stringify(EducationLevel)
    );
    switch (information.education.level) {
      case EducationLevel.HighSchool:
        selectOptionWithText(element, ["high school graduate"]);
        break;
      case EducationLevel.Associates:
        selectOptionWithText(element, ["Some college"]);
        break;
      case EducationLevel.BachelorScience:
      case EducationLevel.BachelorArts:
        selectOptionWithText(element, ["College graduate"]);
        break;
      case EducationLevel.Masters:
      case EducationLevel.Doctorate:
        selectOptionWithText(element, ["Post graduate education"]);
        break;
      case EducationLevel.Other:
        selectOptionWithText(element, ["some high school"]);
        break;
    }
  }
);

export default AdlerWeiner;
