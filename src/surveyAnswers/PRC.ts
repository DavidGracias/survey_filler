import SurveyAnswers from "../types/SurveyAnswers";

const PRC = new SurveyAnswers({
  nextButtonAction: "button[type='submit']",
  questionSelector: "",
  additionalContext: []
});

// PRC.addPage(
//   ["First Name", "Last Name", "Street Address", "City", "ZIP Code", "County"],
//   (information) => {
//     const inputs = document.querySelectorAll("input")!;
//     var answers = [
//       information.firstName,
//       information.lastName,
//       information.streetAddress,
//       information.city,
//       information.zipcode,
//       information.county,
//       information.phone,
//       information.email,
//       information.dob_mmddyyyy_slash,
//       information.age,
//     ];
//     for (let i = 0; i < inputs.length; i++)
//       (inputs[i] as HTMLInputElement).value = answers[i].toString();

//     document.querySelectorAll("select > option").forEach((o) => {
//       const option = o as HTMLOptionElement;
//       if (
//         option.textContent?.trim().toUpperCase() ==
//         information.stateAbbreviation.toUpperCase()
//       ) {
//         option.click();
//         option.selected = true;
//       }
//     });
//   }
// );

// PRC.addPage(["What is your date of birth?"], (information) => {
//   const input: HTMLInputElement = document.querySelector("input")!;

//   input.value = information.dob_mmddyyyy_slash;
//   input.dispatchEvent(new Event("input", { bubbles: true }));
// });

// PRC.addPage(
//   [
//     "What is your gender?",
//     "What is your age?",
//     "Which of the following best describes your racial or ethnic identity?",
//   ],
//   (information) => {
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

//     document.querySelectorAll(".option-label__tag").forEach((label) => {
//       if (label.textContent!.trim() == "Hispanic")
//         (label as HTMLDivElement).click();
//     });
//   }
// );

// PRC.addPage(
//   ["In which time zone do you live?", "What region do you live in?"],
//   (information) => {
//     document.querySelectorAll(".option-label__tag").forEach((label) => {
//       if (label.textContent?.includes(information.tz.toUpperCase()))
//         (label as HTMLDivElement).click();
//     });

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

//     document.querySelectorAll(".option-label__tag").forEach((label) => {
//       const text = (label.textContent ?? "").toLowerCase();
//       var found = true;
//       regionText.forEach((region) => (found &&= text.includes(region)));
//       if (found) (label as HTMLDivElement).click();
//     });
//   }
// );

export default PRC;
