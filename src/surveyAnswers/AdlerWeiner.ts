import SurveyAnswers from "../types/SurveyAnswers";
import { Information } from "../types/Information";

const AdlerWeiner = new SurveyAnswers({
  nextButtonAction: "button[type='submit']",
  questionSelector: "div.question-container",
  additionalContext: []
});

AdlerWeiner.addQuestion(
  [
    "Please answer the following",
    "Name",
    "Address",
    "City/Town",
    "State/Province",
    "ZIP/Postal Code",
    "Email Address",
    "Phone Number",
  ],
  (information: Information, selector: string) => {
    // const inputs = element.querySelectorAll("input");
    // const answers = [
    //   information.fullName,
    //   information.streetAddress,
    //   information.city,
    //   information.state,
    //   information.zipcode,
    //   information.email,
    //   information.phone,
    // ];
    // for (let i = 0; i < inputs.length; i++) {
    //   (inputs[i] as HTMLInputElement).value = answers[i];
    // }
  });
// )
// AdlerWeiner.addPage(
//   [
//     "Right to Opt-Out Info",
//     "Financial Incentive Info",
//     "Adler Weiner Privacy Policy",
//   ],
//   (information: Information) => {
//     const labels = Array.from(document.querySelectorAll("label")).filter(
//       (label) => !label.classList.contains("checked")
//     );

//     for (const label of labels) {
//       label.click();
//     }
//   }
// );

// AdlerWeiner.addPage(
//   [
//     "Name",
//     "Address",
//     "City/Town",
//     "State/Province",
//     "ZIP/Postal Code",
//     "Email Address",
//     "Phone Number",
//   ],
//   (information: Information) => {
//     const spans = Array.from(document.querySelectorAll("span"));

//     for (const span of spans) {
//       if (span.innerText.includes("Yes")) {
//         span.click();
//       }
//     }
//   }
// );

export default AdlerWeiner;