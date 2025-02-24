import SurveyAnswers from "../types/SurveyAnswers";
import { Information } from "../types/Information";

const PanelFox = new SurveyAnswers({
  nextButtonAction: "button.big",
  questionSelector: ".SortableItem",
  additionalContext: [selectOptionWithText]
});

function selectOptionWithText(questionElement: HTMLElement, needles: string[]) {
  needles = needles.map((n) => n.trim().toLowerCase());
  questionElement.querySelectorAll(".option-label__tag").forEach((option_label) => {
    const haystack = option_label.textContent!.trim().toLowerCase();
    var found = true;
    needles.forEach((needle) => (found &&= haystack.includes(needle)));
    if (found) (option_label as HTMLDivElement).click();
  });
}

// function selectAnswerAtIndex(index: number) {
//   (document.querySelectorAll(".option-label__tag")[index] as HTMLDivElement).click();
// }

PanelFox.addQuestion(
  [
    "First Name",
  ],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    (element.querySelector("input") as HTMLInputElement).value = information.firstName;
  }
);
PanelFox.addQuestion(
  [
    "Last Name",
  ],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    (element.querySelector("input") as HTMLInputElement).value = information.lastName;
  }
);
PanelFox.addQuestion(
  [
    "Email",
  ],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    (element.querySelector("input") as HTMLInputElement).value = information.email;
  }
);
PanelFox.addQuestion(
  [
    "Phone Number",
  ],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    (element.querySelector("input") as HTMLInputElement).value = information.phone;
  }
);
PanelFox.addQuestion(
  [
    "Do you certify that the information you provide on this survey is true and accurate",
  ],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    selectOptionWithText(element, ["yes"]);
  }
);

PanelFox.addQuestion(
  [
    "How did you hear about this study?",
  ],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    selectOptionWithText(element, ["email"]);
  }
);


// PanelFox.addPage(
//   [
//     "First Name",
//     "Last Name",
//     "Email",
//     "Cell Phone Number",
//     "Alternate Phone Number",
//     "In what state do you reside?",
//     "What is your 5-digit zip code?",
//   ],
//   (information: Information) => {
//     const inputs = document.querySelectorAll(
//       "input[placeholder='Your answer']"
//     )!;
//     var answers = [
//       information.firstName,
//       information.lastName,
//       information.email,
//       information.phone,
//       "",
//       information.zipcode,
//     ];
//     for (let i = 0; i < inputs.length; i++)
//       (inputs[i] as HTMLInputElement).value = answers[i];

//     (document.querySelector("select") as HTMLSelectElement).value =
//       information.stateAbbreviation.toUpperCase();
//   }
// );

// PanelFox.addPage(["What state do you reside?"], (information: Information) => {
//   var state =
//     information.state.substring(0, 1).toUpperCase() +
//     information.state.substring(1).toLowerCase();
//   (document.querySelector("select") as HTMLSelectElement).value = state;
// });

// PanelFox.addPage(
//   ["What is your date of birth?"],
//   (information: Information) => {
//     const input: HTMLInputElement = document.querySelector("input")!;

//     input.value = information.dob_mmddyyyy_slash;
//     input.dispatchEvent(new Event("input", { bubbles: true }));
//   }
// );

// PanelFox.addPage(
//   [
//     "What is your gender?",
//     "What is your age?",
//     "Which of the following best describes your racial or ethnic identity?",
//   ],
//   (information: Information) => {
//     switch (information.gender) {
//       case "m":
//         document.querySelectorAll("input")[0].click();
//         break;
//       case "f":
//         document.querySelectorAll("input")[1].click();
//         break;
//       case "n":
//         document.querySelectorAll("input")[2].click();
//         break;
//     }

//     document.querySelectorAll("input")[3].value = information.age.toString();

//     selectAnswerWithText(["hispanic"]);
//   }
// );

// PanelFox.addPage(
//   [
//     "What is your gender?",
//     "When was the last time you participated in a political focus group?",
//     "Are you of Hispanic, Latino, or Spanish origin or descent?",
//     "We want to be sure we’re representing everybody; how would you describe your race or ethnicity?",
//   ],
//   (information: Information) => {
//     switch (information.gender) {
//       case "m":
//         document.querySelectorAll("input")[0].click();
//         break;
//       case "f":
//         document.querySelectorAll("input")[1].click();
//         break;
//       case "n":
//         document.querySelectorAll("input")[2].click();
//         break;
//     }

//     selectAnswerAtIndex(5);
//     selectAnswerAtIndex(6);

//     selectAnswerWithText(["hispanic"]);
//   }
// );

// PanelFox.addPage(
//   ["Were you born in the United States?"],
//   (information: Information) => {
//     selectAnswerAtIndex(0);

//     // autoloads: What is your family’s background of nation of origin?
//     selectAnswerWithText(["ecuador"]);
//   }
// );

// PanelFox.addPage(
//   [
//     "Which range does your current age fall?",
//     "What is your exact age?",
//     "What is the last year of schooling that you have completed?",
//   ],
//   (information: Information) => {
//     const options: NodeListOf<HTMLDivElement> =
//       document.querySelectorAll(".option-label__tag");

//     Array.from(options)
//       .filter((option) => option.textContent!.includes("-"))
//       .forEach((option) => {
//         var [lower, higher] = option.textContent!.trim().split("-");
//         if (
//           parseInt(lower) <= information.age &&
//           information.age <= parseInt(higher)
//         )
//           option.click();
//       });

//     (
//       document.querySelector("input[type='number']")! as HTMLInputElement
//     ).value = information.age.toString();

//     selectAnswerWithText(["bachelor"]);
//   }
// );

// PanelFox.addPage(
//   ["Are you registered to vote?"],
//   (information: Information) => {
//     selectAnswerWithText(["yes"]);

//     // auto-appears: Generally speaking, do you think of yourself as a Democrat, a Republican, an Independent, or something else?
//     selectAnswerWithText(["ind", "dem"]);

//     // auto-appears: For whom did you vote in the 2020 general election for president, or were you not able to vote?
//     selectAnswerWithText(["biden"]);

//     // auto-appears: For whom did you vote in the 2024 general election for president, or were you not able to vote?
//     selectAnswerWithText(["harris"]);
//   }
// );

// PanelFox.addPage(
//   ["How important is politics to your personal identity?"],
//   (information: Information) => {
//     selectAnswerWithText(["very", "important"]);
//   }
// );

// PanelFox.addPage(
//   ["Are you, your family, or your friends affiliated or work with any political organizations or elected officials?"],
//   (information: Information) => {
//     selectAnswerWithText(["no"]);

//     // auto-appears: Are you, your family, or your friends affiliated or work with any media or journalism organizations?
//     selectAnswerWithText(["no"]);

//     // auto-appears: Which of the following statements best describes you in a group situation?
//     selectAnswerWithText(["no difficulty expressing my opinions"]);

//     // auto-appears: This study will be fully completed online. Do you have a working desktop or laptop, fully functional webcam, stable internet connection, a quiet place to have a conversation on your computer? Devices like Chromebooks, cellphones, and Netbooks with Android operating system will not be able to functional for this study.
//     selectAnswerAtIndex(9)
//   }
// );

// PanelFox.addPage(
//   ["In which time zone do you live?", "What region do you live in?"],
//   (information: Information) => {
//     selectAnswerWithText([information.tz]);

//     var wnocaOptionExists = true;
//     document.querySelectorAll(".option-label__tag").forEach((label) => {
//       const text = (label.textContent ?? "").toLowerCase();
//       ["west", "california"].forEach(
//         (region) => (wnocaOptionExists &&= text.includes(region))
//       );
//     });

//     var regionText: string[] = [];
//     switch (information.region) {
//       case "ne":
//         regionText = ["north", "east"];
//         break;
//       case "mw":
//         regionText = ["mid", "west"];
//         break;
//       case "s":
//         regionText = ["south"];
//         break;
//       case "c":
//         regionText = wnocaOptionExists ? ["california"] : ["west"];
//         break; // TODO: fix this case, currently it doesn't matter since we live in non-CA states
//       case "w":
//         regionText = wnocaOptionExists ? ["west", "california"] : ["west"];
//         break;
//     }

//     selectAnswerWithText(regionText);
//   }
// );

export default PanelFox;
