import SurveyAnswers from "../types/SurveyAnswers";
import { Information } from "../types/Information";

const RecruitAndField = new SurveyAnswers(() => {
  const buttons: NodeListOf<HTMLElement> =
    document.querySelectorAll("div[role='button']");
  for (const button of buttons) {
    if (button.innerText.includes("Next")) return button.click();
  }
});

RecruitAndField.addPage(
  [
    "WHO WE ARE",
    "PLEASE REVIEW TERMS BELOW BEFORE CONTINUING WITH THIS SURVEY",
    "PRIVACY POLICY",
    "NOTICE",
    "Do you acknowledge and agree to the terms stated above?",
  ],
  (information: Information) => {
    const labels = document.querySelectorAll("label");

    (labels[0].firstChild!.firstChild as HTMLElement).click();
    labels[1].click();
  }
);

RecruitAndField.addPage(
  [
    "First Name",
    "Last Name",
    "Email address",
    "Cell phone number",
    "Make and model of your mobile phone",
    "State",
    "City/Town",
    "Mailing zip code",
  ],
  (information: Information) => {
    const answers = [
      information.firstName,
      information.lastName,
      information.email,
      information.phone,
      information.city,
      information.zipcode,
    ];
    const inputs: NodeListOf<HTMLInputElement> =
      document.querySelectorAll("input[type='text']");
    answers.forEach((answer, index) => {
      inputs[index].value = answer;
      inputs[index].dispatchEvent(new Event("input", { bubbles: true }));
    });

    const textarea = document.querySelector("textarea")!;
    textarea.value = "iPhone X";
    textarea.dispatchEvent(new Event("input", { bubbles: true }));

    const capitalizedState =
      information.state.charAt(0).toUpperCase() +
      information.state.slice(1).toLowerCase();

    const listbox: HTMLElement = document.querySelector("div[role='option']")!;
    listbox.click();

    setTimeout(() => {
      const listbox_options: NodeListOf<HTMLElement> =
        document.querySelectorAll("[data-value='" + capitalizedState + "']")!;
      listbox_options[1].click();
    }, 100);
  }
);

RecruitAndField.addPage(
  [
    "Gender",
    "Age",
    "Please select which best describes your race/ethnic background",
    "Which of the following best describes your marital status?",
    "What is your employment status?",
    "What is your occupation?",
    "What industry do you work in?",
    "Company Name",
    "Which of the following best describes the highest level of education you’ve completed?",
    "Please select the following ages of children living in your home.",
    "Which of the following best describes your personal income?",
  ],
  (information: Information) => {

    const answers = [
      null,
      information.age.toString(),
      null,
      null,
      null,
      information.employment.occupation,
      information.employment.industry,
      information.employment.employer,
      null,
    ];
    const inputs: NodeListOf<HTMLInputElement> = document.querySelectorAll("input[type='text']");
    answers.forEach((answer, index) => {
      if (answer === null) return;

      inputs[index].value = answer ?? "N/A";
      inputs[index].dispatchEvent(new Event("input", { bubbles: true }));
    });


    const gender = (() => {
      switch (information.gender) {
        case "m":
          return "Male";
        case "f":
          return "Female";
        default:
          return "Other";
      }
    })();
    
    const maritalStatus = (() => (information.maritalStatus.charAt(0).toUpperCase() + information.maritalStatus.substring(1).toLowerCase()))();
    const employmentStatuses = information.employment.status.split(" ").map((status) => {
      let employmentStatus = status.toLowerCase();
      switch (employmentStatus) {
        case "homemaker":
          return "stay at home parent";
      }
      return employmentStatus;
    });

    const educationLevel = (() => {
      switch (information.educationLevel) {
        case "hs":
          return "High school graduate";
        case "a":
          return "2-year college";
        case "bs":
        case "ba":
          return "4-year college";
        case "pg":
          return "Postgraduate/PhD";
      }
    })();

    document.querySelectorAll("span")!.forEach((span) => {
      if (span.innerText == gender) span.click();
      if (span.innerText.includes("Hispanic")) span.click();
      if (span.innerText == maritalStatus) span.click();

      let employmentStatusFound = true;
      employmentStatuses.forEach((status) => {
        if (!span.innerText.toLowerCase().includes(status)) employmentStatusFound = false;
      });

      if (employmentStatusFound) span.click();

      if (span.innerText == educationLevel) span.click();
    });

    const questions = document.querySelectorAll("[role='presentation']");

    const salaryRanges = (questions[questions.length - 1] as HTMLElement).querySelector("span[dir='auto']")!;
    

    
  }
);

export default RecruitAndField;
