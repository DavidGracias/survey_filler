import { Information } from "../types/Information";
import { Gender, People } from "../types/InformationEnums";
import SurveyAnswers from "../types/SurveyAnswers";
import {
  setInputValue,
  formatText,
  WeightedOption,
  chooseWeightedOption,
} from "./util";
import { partition } from "./util/Array";

const ConsumerViewpoint = new SurveyAnswers({
  nextButtonAction: () => {
    const nextButton: NodeListOf<HTMLElement> =
      document.querySelectorAll("[role=button]");
    for (let i = 0; i < nextButton.length; i++) {
      if (
        nextButton[i].textContent?.includes("Next") ||
        nextButton[i].textContent?.includes("Submit")
      )
        nextButton[i].click();
    }
  },
  questionSelector: "form > div > div > div > [role=listitem]",
  additionalContext: [chooseValidAnswer, chooseLabelWithText],
});

function chooseValidAnswer(element: HTMLElement, answer: string) {
  const inputs: HTMLSpanElement[] = Array.from(
    element.querySelectorAll("span[dir=auto]")
  );
  const [validAnswers, invalidAnswers] = partition(
    inputs,
    (i) => !i.textContent!.includes("STOP TAKING SURVEY")
  );
  invalidAnswers.forEach((input) => {
    input.remove();
  });
  validAnswers.forEach((input) => {
    if (formatText(input.textContent!).includes(formatText(answer)))
      input.click();
  });
}

function chooseLabelWithText(element: HTMLElement, text: string[]) {
  text = text.map((t) => formatText(t));
  const labels = Array.from(element.querySelectorAll("label")).map((l) =>
    formatText(l.textContent!)
  );
  var labels_found: number[] = [];
  for (let i = 0; i < labels.length; i++) {
    if (text.every((t) => labels[i].includes(t))) labels_found.push(i);
  }
  var chosenLabel = labels_found.sort(
    (a, b) => labels[a].length - labels[b].length
  )[0];
  if (chosenLabel !== undefined) {
    element.querySelectorAll("label")[chosenLabel].click();
  }
}

ConsumerViewpoint.addQuestion(
  [
    "THE INTEGRITY AND ACCURACY OF OUR RESEARCH IS OF THE UTMOST IMPORTANCE",
    "Do you understand?",
  ],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    element.querySelector("label")?.click();
  },
  { hardcoded: true }
);

ConsumerViewpoint.addQuestion(
  ["Do you agree to connect for the ID and tech check?"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    setInputValue(element.querySelector("input")!, "Yes");
  },
  { hardcoded: true }
);

ConsumerViewpoint.addQuestion(
  ["Which of the following best describes your primary role at work?"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    if (information.employment.industry == "Technology") {
      chooseValidAnswer(element, "code");
    } else if (
      information.employment.industry?.toLowerCase()?.includes("data")
    ) {
      chooseValidAnswer(element, "data");
    } else {
      window.alert(
        "Industry isn't Technology or Data -- are you sure this survey is relevant to you?"
      );
    }
  },
  { hardcoded: true }
);

ConsumerViewpoint.addQuestion(
  [
    "90-min ONLINE FOCUS GROUP",
    "To participate in the session using an online platform, there will be some technical requirements. These include:",
  ],
  () => {}
);

ConsumerViewpoint.addQuestion(
  ["Do you meet the technical requirements above?"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    (element.querySelector("[role=option]") as HTMLElement).click();
    (element.querySelector("[data-value='Yes']") as HTMLElement).click();
  },
  { hardcoded: true }
);

ConsumerViewpoint.addQuestion(
  ["your employment status"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    chooseLabelWithText(element, ["Employed", "full", "time"]);
  },
  { hardcoded: true }
);

ConsumerViewpoint.addQuestion(
  ["What is the name of the company or organization you work for?"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    setInputValue(
      element.querySelector("input")!,
      information.employment.employer ?? ""
    );
  }
);

ConsumerViewpoint.addQuestion(
  ["linkedin profile"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    setInputValue(
      element.querySelector("input")!,
      information.employment.linkedin ?? ""
    );
  }
);

ConsumerViewpoint.addQuestion(
  ["IF YOU WANT TO BE PAID MY AMAZON ECARD, PLEASE WRITE AMAZON BELOW"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    setInputValue(element.querySelector("textarea")!, "Amazon");
  },
  { hardcoded: true }
);

ConsumerViewpoint.addQuestion(
  ["Zip Code"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    setInputValue(element.querySelector("input")!, information.zipcode);
  }
);

ConsumerViewpoint.addQuestion(
  ["Last Name"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    setInputValue(element.querySelector("input")!, information.lastName);
  }
);

ConsumerViewpoint.addQuestion(
  ["Email"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    setInputValue(element.querySelector("input")!, information.email);
  }
);

ConsumerViewpoint.addQuestion(
  ["cell", "#"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    setInputValue(element.querySelector("input")!, information.phone.number);
  }
);

ConsumerViewpoint.addQuestion(
  ["First Name and LAST initial"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    setInputValue(
      element.querySelector("input")!,
      information.firstName + " " + information.lastName.charAt(0)
    );
  }
);

ConsumerViewpoint.addQuestion(
  ["State"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    setInputValue(element.querySelector("input")!, information.state);
  }
);

ConsumerViewpoint.addQuestion(
  ["Gender"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    const labels = element.querySelectorAll("label");
    switch (information.gender) {
      case Gender.Female:
        chooseLabelWithText(element, ["Female"]);
        break;
      case Gender.Male:
        chooseLabelWithText(element, ["Male"]);
        break;
      case Gender.NonBinary:
        chooseLabelWithText(element, ["Non-binary"]);
        break;
    }
  }
);

ConsumerViewpoint.addQuestion(
  ["Age"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    setInputValue(element.querySelector("input")!, information.age.toString());
  }
);

ConsumerViewpoint.addQuestion(
  ["Job title"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    setInputValue(
      element.querySelector("input")!,
      information.employment.occupation ?? ""
    );
  }
);

ConsumerViewpoint.addQuestion(
  ["And which of the following best describes your department/role at work?"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    if (information.employment.industry == "Technology") {
      chooseLabelWithText(element, ["IT"]);
    }
  },
  { hardcoded: true }
);

ConsumerViewpoint.addQuestion(
  [
    "How often",
    "do you use a computer to accomplish work related tasks or activities",
  ],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    chooseLabelWithText(element, ["Multiple times a day"]);
  },
  { hardcoded: true }
);

ConsumerViewpoint.addQuestion(
  ["How often", "are you using Copilot for work tasks"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    chooseLabelWithText(element, ["Daily"]);
  },
  { hardcoded: true }
);

ConsumerViewpoint.addQuestion(
  [
    "Completion of a survey does not constitute confirmation for participation. Not all participants who apply will qualify, nor will everyone receive a callback. If you are selected to participate, you will be contacted by one of our team members to complete the screening process and confirm your participation. All surveys are for market research purposes only. There will be no direct sales or promotions as a result of your participation. Your individual responses are kept confidential, anonymous and reported only in the aggregate.",
  ],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    chooseLabelWithText(element, ["agree"]);
  },
  { hardcoded: true }
);

ConsumerViewpoint.addQuestion(
  ["cell number"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    setInputValue(element.querySelector("input")!, information.phone.number);
  }
);

ConsumerViewpoint.addQuestion(
  [
    "Please confirm it is okay to text you ONLY for the purpose of booking you for this research study?",
  ],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    chooseLabelWithText(element, ["Yes"]);
  },
  { hardcoded: true }
);

ConsumerViewpoint.addQuestion(
  ["Where did you hear about this study?", "What page or person referred you"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    const weightedOptions = [];
    weightedOptions.push(WeightedOption("Craigslist", 1));
    weightedOptions.push(WeightedOption("FocusGroup.org", 1));
    weightedOptions.push(WeightedOption("Email", 1));
    weightedOptions.push(WeightedOption("Facebook", 1));
    weightedOptions.push(WeightedOption("Reddit", 1));
    const option = chooseWeightedOption(weightedOptions);
    setInputValue(element.querySelector("textarea")!, option);
  },
  { hardcoded: true }
);

ConsumerViewpoint.addQuestion(
  ["notes to recruiter or referral"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    let referral;
    switch (information.person) {
      case People.David:
        referral = "Izabela Quintas (708-205-2545)";
        break;
      case People.Bela:
        referral = "David Garcia (703-853-8605)";
        break;
      default:
        return;
    }
    setInputValue(
      element.querySelector("textarea")!,
      `${referral} referred me`
    );
  },
  { hardcoded: true }
);

export default ConsumerViewpoint;
