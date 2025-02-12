import SurveyAnswers from "../types/SurveyAnswers";
import { Information } from "../types/Information";

const RecruitAndField = new SurveyAnswers("div[role='button']");

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
    });

    document.querySelector("textarea")!.value = "iPhone X";

    const capitalizedState =
      information.state.charAt(0).toUpperCase() +
      information.state.slice(1).toLowerCase();

    (
      document.querySelector(
        "[data-value='" + capitalizedState + "']"
      ) as HTMLElement
    ).click();
  }
);

export default RecruitAndField;
