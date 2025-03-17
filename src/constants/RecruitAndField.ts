import SurveyAnswers from "../types/SurveyAnswers";
import { Information } from "../types/Information";
import {
  EducationLevel,
  EmploymentStatus,
  Gender,
  MaritalStatus,
  Race,
} from "../types/InformationEnums";
import { capitalize, indexFromRanges, setInputValue } from "./util";

const RecruitAndField = new SurveyAnswers({
  nextButtonAction: function nextButtonClick() {
    const buttons: NodeListOf<HTMLElement> =
      document.querySelectorAll("div[role='button']");
    for (const button of buttons) {
      if (button.innerText.includes("Next")) return button.click();
    }
  },
  questionSelector: "form > div > div > div[role=list] > div[role=listitem]",
  additionalContext: [selectOptionWithText, pressLabelIfNotChecked],
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

function pressLabelIfNotChecked(label: HTMLElement) {
  label.click();
}

RecruitAndField.addQuestion(
  ["PLEASE REVIEW TERMS BELOW BEFORE CONTINUING WITH THIS SURVEY"],
  () => {},
  { hardcoded: true }
);
RecruitAndField.addQuestion(["PRIVACY POLICY"], () => {}, { hardcoded: true });
RecruitAndField.addQuestion(["NOTICE: PLEASE READ"], () => {}, {
  hardcoded: true,
});
RecruitAndField.addQuestion(["USE OF AI"], () => {}, { hardcoded: true });
RecruitAndField.addQuestion(
  ["Click NEXT to find out more about this study"],
  () => {},
  { hardcoded: true }
);
RecruitAndField.addQuestion(
  [
    "If interested in this study, please answer the pre-qualifying questions as honestly as possible",
    "There are no right or wrong answers",
    "If you are a match, an Insights Coordinator will be in touch with you soon",
  ],
  () => {},
  { hardcoded: true }
);

RecruitAndField.addQuestion(
  [
    "Notice",
    "Filling out this survey does NOT guarantee a spot on this study",
    "You will NOT be compensated for filling this survey out",
    "Only participants who participate in our studies are compensated",
  ],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    const label = element.querySelector("label")!;
    if (label.getAttribute("aria-checked") === "false") label.click();
  },
  { hardcoded: true }
);

RecruitAndField.addQuestion(
  ["Do you acknowledge and agree to the terms stated above"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    selectOptionWithText(element, ["Yes"]);
  },
  { hardcoded: true }
);

RecruitAndField.addQuestion(
  ["First Name"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    setInputValue(element.querySelector("input")!, information.firstName);
  }
);

RecruitAndField.addQuestion(
  ["Last Name"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    setInputValue(element.querySelector("input")!, information.lastName);
  }
);

RecruitAndField.addQuestion(
  ["Email address"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    setInputValue(element.querySelector("input")!, information.email);
  }
);

RecruitAndField.addQuestion(
  ["Cell phone number"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    setInputValue(element.querySelector("input")!, information.phone.number);
  }
);

RecruitAndField.addQuestion(
  ["Make and model of your mobile phone"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    setInputValue(
      element.querySelector("input")!,
      `${information.phone.make} ${information.phone.model}`
    );
  }
);

RecruitAndField.addQuestion(
  ["State"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    // TODO: click only if not yet open

    // (element.querySelector("[role=option]")! as HTMLElement).click();

    const state = capitalize(information.state);

    // setTimeout(async () => {
    //   let listbox_options: NodeListOf<HTMLElement>;
    //   do {
    //     listbox_options = document.querySelectorAll(
    //       `div[data-value='${state}']`
    //     );
    //     await new Promise((resolve) => setTimeout(resolve, 1e2));
    //   } while (listbox_options.length <= 1);
    //   listbox_options[1].click();
    // }, 1e2);
  }
);

RecruitAndField.addQuestion(
  ["City/Town"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    setInputValue(element.querySelector("input")!, information.city);
  }
);

RecruitAndField.addQuestion(
  ["Mailing zip code"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    setInputValue(element.querySelector("input")!, information.zipcode);
  }
);

RecruitAndField.addQuestion(
  ["Gender"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    let genderArr: string[] = [];
    switch (information.gender) {
      case Gender.Male:
        genderArr = ["male"];
        break;
      case Gender.Female:
        genderArr = ["female"];
        break;
      case Gender.NonBinary:
        genderArr = ["non", "binary"];
        break;
    }

    selectOptionWithText(element, genderArr);
  }
);

RecruitAndField.addQuestion(
  ["Age"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    setInputValue(element.querySelector("input")!, information.age.toString());
  }
);

RecruitAndField.addQuestion(
  ["race", "ethnic", "background"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    let text: string[] = [];
    switch (information.race) {
      case Race.White:
        text = ["white"];
        break;
      case Race.Hispanic:
        text = ["hispanic", "latin"];
        break;
      case Race.Black:
        text = ["african american", "black"];
        break;
      case Race.NativeAmerican:
        text = ["american indian", "alaska native"];
        break;
      case Race.Asian:
        text = ["asian"];
        break;
      case Race.MiddleEastern:
        text = ["middle eastern", "north african"];
        break;
      case Race.PacificIslander:
        text = ["native hawaiian", "pacific islander"];
        break;
      case Race.MixedRace:
        text = ["multi racial"];
        break;
      default:
        text = ["other"];
        setInputValue(element.querySelector("input")!, information.race);
    }
    selectOptionWithText(element, text);
  }
);

RecruitAndField.addQuestion(
  ["marital status"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    let text: string[] = [];
    switch (information.maritalStatus) {
      case MaritalStatus.Single:
        text = ["single"];
        break;
      case MaritalStatus.DomesticPartner:
      case MaritalStatus.LivingWithSO:
        text = ["living with significant other"];
        break;
      case MaritalStatus.Married:
        text = ["married"];
        break;
      case MaritalStatus.Divorced:
        text = ["divorced"];
        break;
      case MaritalStatus.Separated:
        text = ["separated"];
        break;
      case MaritalStatus.Widowed:
        text = ["widowed"];
        break;
      default:
        text = ["other"];
        setInputValue(
          element.querySelector("input")!,
          information.maritalStatus
        );
    }
    selectOptionWithText(element, text);
  }
);

RecruitAndField.addQuestion(
  ["employment status"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    let text: string[] = [];
    switch (information.employment.status) {
      case EmploymentStatus.FullTimeInPerson:
      case EmploymentStatus.FullTimeRemote:
        text = ["full time"];
        break;
      case EmploymentStatus.PartTime:
        text = ["part time"];
        break;
      case EmploymentStatus.SelfEmployed:
        text = ["self employed"];
        break;
      case EmploymentStatus.Student:
        text = ["full time student"];
        break;
      case EmploymentStatus.Homemaker:
        text = ["stay at home parent"];
        break;
      case EmploymentStatus.Unemployed:
        text = ["unemployed"];
        break;
      case EmploymentStatus.Retired:
        text = ["retired"];
        break;
      default:
        text = ["other"];
        setInputValue(
          element.querySelector("input")!,
          information.employment.status
        );
    }
    selectOptionWithText(element, text);
  }
);

RecruitAndField.addQuestion(
  ["What is your occupation"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    setInputValue(
      element.querySelector("input")!,
      information.employment.occupation ?? "N/A"
    );
  }
);

RecruitAndField.addQuestion(
  ["What industry do you work in"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    setInputValue(
      element.querySelector("input")!,
      information.employment.industry ?? "N/A"
    );
  }
);

RecruitAndField.addQuestion(
  ["Company Name"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    setInputValue(
      element.querySelector("input")!,
      information.employment.employer ?? "N/A"
    );
  }
);

RecruitAndField.addQuestion(
  ["education"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    let text: string[] = [];
    switch (information.education.level) {
      case EducationLevel.HighSchool:
        text = ["high school graduate"];
        break;
      case EducationLevel.Associates:
        text = ["2-year college"];
        break;
      case EducationLevel.BachelorScience:
      case EducationLevel.BachelorArts:
        text = ["4-year college"];
        break;
      case EducationLevel.Masters:
      case EducationLevel.Doctorate:
        text = ["Postgraduate"];
        break;
      default:
        text = ["other"];
        setInputValue(
          element.querySelector("input")!,
          information.education.level
        );
    }
    selectOptionWithText(element, text);
  }
);

RecruitAndField.addQuestion(
  ["total", "annual", "household", "income"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    const options = Array.from(element.querySelectorAll("span"));
    const index = indexFromRanges(options, information.employment.salary ?? 0);
    if (index != -1) pressLabelIfNotChecked(options[index]);

    setInputValue(
      element.querySelector("input")!,
      information.employment.employer ?? "N/A"
    );
  }
);

// RecruitAndField.addPage(
//   [
//     "Which country were you born in?",
//     "How long have you lived in the USA?",
//   ],
//   (information: Information) => {
//     const answers = [
//       "United States",
//       information.age.toString(),
//     ];
//     document.querySelectorAll("input[type='text']").forEach((input, i) => {
//       (input as HTMLInputElement).value = answers[i];
//       (input as HTMLInputElement).dispatchEvent(new Event("input", { bubbles: true }));
//     });
//   }
// );

export default RecruitAndField;
