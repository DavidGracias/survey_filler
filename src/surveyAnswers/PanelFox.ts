import SurveyAnswers from "../types/SurveyAnswers";
import { Information } from "../types/Information";

const PanelFox = new SurveyAnswers("button");

PanelFox.addPage(
  [
    "First Name",
    "Last Name",
    "Email",
    "Phone Number",
    "Do you certify that the information you provide on this survey is true and accurate? By consenting you confirm that you understand that false representation will result in dismissal without pay if selected for the study.",
    "How did you hear about this study?",
  ],
  (information: Information) => {
    const inputs = document.querySelectorAll("input[placeholder='Your answer']")!;
    var answers = [
      information.firstName,
      information.lastName,
      information.email,
      information.phone,
    ];
    for (let i = 0; i < inputs.length; i++)
      (inputs[i] as HTMLInputElement).value = answers[i];
    

    const radios = document.querySelectorAll("div.option-label__tag")!;
    (radios[0] as HTMLInputElement).click();
    (radios[2] as HTMLInputElement).click();
  }
);

PanelFox.addPage(
  [
    "First Name",
    "Last Name",
    "Email",
    "Cell Phone Number",
    "Alternate Phone Number",
    "In what state do you reside?",
    "What is your 5-digit zip code?",
  ],
  (information: Information) => {
    const inputs = document.querySelectorAll(
      "input[placeholder='Your answer']"
    )!;
    var answers = [
      information.firstName,
      information.lastName,
      information.email,
      information.phone,
      "",
      information.zipcode,
    ];
    for (let i = 0; i < inputs.length; i++)
      (inputs[i] as HTMLInputElement).value = answers[i];

    (document.querySelector("select") as HTMLSelectElement).value =
      information.stateAbbreviation.toUpperCase();
  }
);

PanelFox.addPage(
  ["What is your date of birth?"],
  (information: Information) => {
    const input: HTMLInputElement = document.querySelector("input")!;

    input.value = information.dob_mmddyyyy_slash;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }
);

PanelFox.addPage(
  [
    "What is your gender?",
    "What is your age?",
    "Which of the following best describes your racial or ethnic identity?",
  ],
  (information: Information) => {
    switch (information.gender) {
      case "m":
        document.querySelectorAll("input")[0].click();
        break;
      case "f":
        document.querySelectorAll("input")[1].click();
        break;
      case "n":
        document.querySelectorAll("input")[2].click();
        break;
    }

    document.querySelectorAll("input")[3].value = information.age.toString();

    document.querySelectorAll(".option-label__tag").forEach((label) => {
      if (label.textContent!.trim() == "Hispanic")
        (label as HTMLDivElement).click();
    });
  }
);

PanelFox.addPage(
  ["In which time zone do you live?", "What region do you live in?"],
  (information: Information) => {
    document.querySelectorAll(".option-label__tag").forEach((label) => {
      if (label.textContent?.includes(information.tz.toUpperCase()))
        (label as HTMLDivElement).click();
    });

    var wnocaOptionExists = true;
    document.querySelectorAll(".option-label__tag").forEach((label) => {
      const text = (label.textContent ?? "").toLowerCase();
      ["west", "california"].forEach(
        (region) => (wnocaOptionExists &&= text.includes(region))
      );
    });

    var regionText: string[] = [];
    switch (information.region) {
      case "ne":
        regionText = ["north", "east"];
        break;
      case "mw":
        regionText = ["mid", "west"];
        break;
      case "s":
        regionText = ["south"];
        break;
      case "c":
        regionText = wnocaOptionExists ? ["california"] : ["west"];
        break; // TODO: fix this case, currently it doesn't matter since we live in non-CA states
      case "w":
        regionText = wnocaOptionExists ? ["west", "california"] : ["west"];
        break;
    }

    document.querySelectorAll(".option-label__tag").forEach((label) => {
      const text = (label.textContent ?? "").toLowerCase();
      var found = true;
      regionText.forEach((region) => (found &&= text.includes(region)));
      if (found) (label as HTMLDivElement).click();
    });
  }
);

PanelFox.printPages();

export default PanelFox;
