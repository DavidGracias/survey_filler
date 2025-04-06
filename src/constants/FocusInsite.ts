import { Information } from "../types/Information";
import SurveyAnswers from "../types/SurveyAnswers";
import { capitalize, setInputValue, dispatchKeyboardEvent } from "./util";

const FocusInsite = new SurveyAnswers({
  nextButtonAction: "button.ss-primary-action-btn",
  questionSelector: ".ss_cl_survey_qstn_item",
  additionalContext: [capitalize, setInputValue, dispatchKeyboardEvent],
});

FocusInsite.addQuestion(
  [
    "Please start by telling us your...",
    "Please enter your best contact information for us to connect with you",
  ],
  async (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    const answers = [
      information.firstName,
      information.lastName,
      information.email,
      null,
      information.phone.number,
      information.city,
      null,
      null,
      information.zipcode,
      null,
    ];
    answers.forEach((answer, j) => {
      if (answer) setInputValue(element.querySelectorAll(`input`)[j], answer);
    });

    // TODO: figure out how to programatically trigger the focus event
    // const inputs = document.querySelectorAll(`input`);
    // for (let j = 0; j < inputs.length; j++) {
    //   inputs[j].dispatchEvent(new Event("focus", { bubbles: true }));
    //   inputs[j].dispatchEvent(new Event("input", { bubbles: true }));
    //   inputs[j].dispatchEvent(new Event("change", { bubbles: true }));
    //   inputs[j].dispatchEvent(new Event("keyup", { bubbles: true }));
    //   inputs[j].dispatchEvent(new Event("invalid", { bubbles: true }));
    // }

    const answersReact = [
      capitalize(information.state),
      "United States of America",
    ];
    const inputDropdowns = element.querySelectorAll(`.ss-eui-dropdown`);
    for (let j = 0; j < answersReact.length; j++) {
      dispatchKeyboardEvent(
        inputDropdowns[j].querySelector(`input`)!,
        "keydown",
        " "
      );

      // wait for the dropdown to be visible
      do {
        var dropdownItems =
          inputDropdowns[j].querySelectorAll("[role='option']");
        await new Promise((resolve) => setTimeout(resolve, 100));
      } while (dropdownItems.length == 0);

      for (const item of Array.from(dropdownItems) as HTMLElement[]) {
        if (item.textContent?.includes(answersReact[j])) item.click();
      }
    }
  }
);

// FocusInsite.addQuestion(
//   [
//     ""
//   ],
//   (information: Information, selector: string, i: number) => {
//     const element = document.querySelectorAll(selector)[i] as HTMLElement;

//   }
// );

// FocusInsite.addQuestion(
//   [
//     ""
//   ],
//   (information: Information, selector: string, i: number) => {
//     const element = document.querySelectorAll(selector)[i] as HTMLElement;

//   }
// );

export default FocusInsite;
