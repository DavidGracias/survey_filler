import SurveyAnswers from "../types/SurveyAnswers";
import { Information } from "../types/Information";

const RecruitAndField = new SurveyAnswers({
  nextButtonAction: function nextButtonClick() {
    const buttons: NodeListOf<HTMLElement> =
      document.querySelectorAll("div[role='button']");
    for (const button of buttons) {
      if (button.innerText.includes("Next")) return button.click();
    }
  },
  questionSelector: "",
  additionalContext: []
});

// RecruitAndField.addPage(
//   [
//     "WHO WE ARE",
//     "PLEASE REVIEW TERMS BELOW BEFORE CONTINUING WITH THIS SURVEY",
//     "PRIVACY POLICY",
//     "NOTICE",
//     "Do you acknowledge and agree to the terms stated above?",
//   ],
//   (information: Information) => {
//     const labels = document.querySelectorAll("label");

//     (labels[0].firstChild!.firstChild as HTMLElement).click();
//     labels[1].click();
//   }
// );

// RecruitAndField.addPage(
//   [
//     "First Name",
//     "Last Name",
//     "Email address",
//     "Cell phone number",
//     "Make and model of your mobile phone",
//     "State",
//     "City/Town",
//     "Mailing zip code",
//   ],
//   (information: Information) => {
//     const answers = [
//       information.firstName,
//       information.lastName,
//       information.email,
//       information.phone,
//       information.city,
//       information.zipcode,
//     ];
//     const inputs: NodeListOf<HTMLInputElement> =
//       document.querySelectorAll("input[type='text']");
//     answers.forEach((answer, index) => {
//       inputs[index].value = answer;
//       inputs[index].dispatchEvent(new Event("input", { bubbles: true }));
//     });

//     const textarea = document.querySelector("textarea")!;
//     textarea.value = "iPhone X";
//     textarea.dispatchEvent(new Event("input", { bubbles: true }));

//     const capitalizedState =
//       information.state.charAt(0).toUpperCase() +
//       information.state.slice(1).toLowerCase();

//     const listbox: HTMLElement = document.querySelector("div[role='option']")!;
//     listbox.click();

//     // TODO: fix this listbox clicking issue

//     setTimeout(async () => {
//       let listbox_options: NodeListOf<HTMLElement>;
//       do {
//         listbox_options =
//           document.querySelectorAll("[data-value='" + capitalizedState + "']")!;
//         await new Promise(resolve => setTimeout(resolve, 1e2));
//       } while (listbox_options.length <= 1);
//       listbox_options[1].click();
//     }, 1e2);
//   }
// );

// RecruitAndField.addPage(
//   [
//     "Gender",
//     "Age",
//     "Please select which best describes your race/ethnic background",
//     "Which of the following best describes your marital status?",
//     "What is your employment status?",
//     "What is your occupation?",
//     "What industry do you work in?",
//     "Company Name",
//     "Which of the following best describes the highest level of education you've completed?",
//     "Please select the following ages of children living in your home.",
//     "Which of the following best describes your personal income?",
//   ],
//   (information: Information) => {
//     const answers = [
//       null,
//       information.age.toString(),
//       null,
//       null,
//       null,
//       information.employment.occupation,
//       information.employment.industry,
//       information.employment.employer,
//       null,
//     ];
//     const inputs: NodeListOf<HTMLInputElement> =
//       document.querySelectorAll("input[type='text']");
//     answers.forEach((answer, index) => {
//       if (answer === null) return;

//       inputs[index].value = answer ?? "N/A";
//       inputs[index].dispatchEvent(new Event("input", { bubbles: true }));
//     });

//     const gender = (() => {
//       switch (information.gender) {
//         case "m":
//           return "Male";
//         case "f":
//           return "Female";
//         default:
//           return "Other";
//       }
//     })();

//     const maritalStatus = (() =>
//       information.maritalStatus.charAt(0).toUpperCase() +
//       information.maritalStatus.substring(1).toLowerCase())();
//     const employmentStatuses = information.employment.status
//       .split(" ")
//       .map((status) => {
//         let employmentStatus = status.toLowerCase();
//         switch (employmentStatus) {
//           case "homemaker":
//             return "stay at home parent";
//         }
//         return employmentStatus;
//       });

//     const educationLevel = (() => {
//       switch (information.educationLevel) {
//         case "hs":
//           return "High school graduate";
//         case "a":
//           return "2-year college";
//         case "bs":
//         case "ba":
//           return "4-year college";
//         case "pg":
//           return "Postgraduate/PhD";
//       }
//     })();

//     document.querySelectorAll("span")!.forEach((span) => {
//       if (span.innerText == gender) span.click();
//       if (span.innerText.includes("Hispanic")) span.click();
//       if (span.innerText == maritalStatus) span.click();

//       if (information.children.length == 0 && span.innerText == "No children in the home") span.click();

//       if (information.children.length > 0 && span.innerText.includes("Children ages ")) {
//         const children = span.innerText.split(" ");
//         const lower_bound = parseInt(children[2]);
//         const upper_bound = parseInt(children[4]);

//         let should_click = false;
//         information.children.filter((child) => child.liveAtHome).forEach((child) => {
//           if (lower_bound <= child.age && child.age <= upper_bound) should_click = true;
//         });
//         if (should_click) span.click();
//       }

//       let employmentStatusFound = true;
//       employmentStatuses.forEach((status) => {
//         if (!span.innerText.toLowerCase().includes(status))
//           employmentStatusFound = false;
//       });

//       if (employmentStatusFound) span.click();

//       if (span.innerText == educationLevel) span.click();
//     });

//     const questions = document.querySelectorAll("[role='presentation']");

//     const salaryRanges: NodeListOf<HTMLSpanElement> = (
//       questions[questions.length - 1] as HTMLElement
//     ).querySelectorAll("span[dir='auto']")!;

//     let upper_bounds: number[] = [];
//     salaryRanges.forEach((span) => {
//       const values = span.innerText.split("$");
//       const upper_bound = values.slice(-1)[0].replace("+", "").replace("k", ",000");
//       upper_bounds.push(parseInt(upper_bound.replace(",", "")));
//     });

//     upper_bounds = upper_bounds.sort((a, b) => a - b);
//     upper_bounds[upper_bounds.length - 1] = Number.MAX_VALUE;

//     const salary = information.employment.salary!;
//     const rangeIndex = upper_bounds.findIndex(bound => salary <= bound);
//     salaryRanges[rangeIndex].click();
//   }
// );

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
