import SurveyAnswers from "../types/SurveyAnswers";
import { Information } from "../types/Information";
import {
  CarPurchaseReason,
  EducationLevel,
  EmploymentStatus,
  Gender,
  MaritalStatus,
  Race,
  Region,
  Relationship,
  VehicleOwnership,
  VehiclePower,
  VehiclePurchaseLocation,
  VehicleUse,
  VehicleTypes,
  Car,
  CarFeatures,
  FeatureImportance,
} from "../types/InformationEnums";
import {
  chooseWeightedOption,
  WeightedOption,
  indexFromRanges,
  setInputValue,
} from "./util";

const AdlerWeiner = new SurveyAnswers({
  nextButtonAction: () => {
    const buttons: HTMLButtonElement[] = Array.from(
      document.querySelectorAll("button[type='submit']")
    );
    const button = buttons.find(
      (button) => button.textContent?.trim() === "Next"
    );
    button?.click();
  },
  questionSelector: "div.question-container",
  additionalContext: [selectOptionWithText, pressLabelIfNotChecked],
});

function selectOptionWithText(questionElement: HTMLElement, needles: string[]) {
  const formatString = (str: string) => str.trim().toLowerCase();
  needles = needles.map(formatString);
  const matchingLabels = Array.from(
    questionElement.querySelectorAll("label")
  ).filter((option_label) => {
    if (!option_label.textContent) return false;
    const haystack = formatString(option_label.textContent);
    var found = true;
    needles.forEach((needle) => (found &&= haystack.includes(needle)));
    return found;
  });

  if (matchingLabels.length > 0) {
    matchingLabels.sort(
      (a, b) => a.textContent!.trim().length - b.textContent!.trim().length
    );
    pressLabelIfNotChecked(matchingLabels[0]);
  }
}

function pressLabelIfNotChecked(label: HTMLLabelElement) {
  if (!label.classList.contains("checked")) label.click();
}

AdlerWeiner.addQuestion(
  [
    "Right to Opt-Out Info",
    "Financial Incentive Info",
    "Adler Weiner Privacy Policy",
  ],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    const labels = element.querySelectorAll("label");
    for (const label of labels) {
      pressLabelIfNotChecked(label);
    }
  },
  { hardcoded: true }
);

AdlerWeiner.addQuestion(
  [
    "the following",
    "Name",
    "Address",
    "City/Town",
    "State/Province",
    "ZIP/Postal Code",
    "Email Address",
    "Phone Number",
  ],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    const inputs = element.querySelectorAll("input");
    const answers = [
      information.fullName,
      information.streetAddress,
      information.city,
      information.state,
      information.zipcode,
      information.email,
      information.phone.number,
    ];
    for (let i = 0; i < answers.length; i++) {
      setInputValue(inputs[i] as HTMLInputElement, answers[i]);
    }
  }
);

AdlerWeiner.addQuestion(
  [
    "CONTACT INFO",
    "the following",
    "First and Last Name",
    "Mailing Address",
    "Apt",
    "City/Town",
    "State/Province",
    "ZIP/Postal Code",
    "Email Address",
    "Cell Phone Number",
  ],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    const inputs = element.querySelectorAll("input");
    const answers = [
      information.fullName,
      information.streetAddress,
      information.streetAddressII ?? "N/a",
      information.city,
      information.state,
      information.zipcode,
      information.email,
      information.phone.number,
    ];
    for (let i = 0; i < answers.length; i++) {
      setInputValue(inputs[i] as HTMLInputElement, answers[i]);
    }
  }
);

AdlerWeiner.addQuestion(
  ["Which area of the country is your permanent residence?"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    const labels = Array.from(element.querySelectorAll("label"));

    labels.forEach((label) => {
      const text = label.innerText.toLowerCase().split(" ");
      if (text.includes("outside")) {
        const index = text.indexOf("outside");
        text[index + 2] = "";
      }

      if (text.join(" ").includes(information.state.toLowerCase()))
        pressLabelIfNotChecked(label);
    });
  }
);

AdlerWeiner.addQuestion(
  ["Where in the country do you live?"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    switch (information.region) {
      case Region.California:
        const weightedOptions = [];
        weightedOptions.push(WeightedOption(["Southern CA"], 1));
        weightedOptions.push(WeightedOption(["Northern CA"], 1));
        const option = chooseWeightedOption(weightedOptions);
        if (option) selectOptionWithText(element, option);
        break;
      case Region.West:
        selectOptionWithText(element, ["West outside of CA"]);
        break;
      case Region.Midwest:
        if (information.state.toLowerCase() == "illinois") {
          selectOptionWithText(element, ["Illinois"]);
        } else {
          selectOptionWithText(element, ["Midwest outside of Illinois"]);
        }
        break;
      case Region.South:
        selectOptionWithText(element, ["South"]);
        break;
      case Region.Northeast:
        selectOptionWithText(element, ["Northeast"]);
        break;
      default:
        selectOptionWithText(element, ["East"]);
    }
  }
);

AdlerWeiner.addQuestion(
  ["gender", "identi"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    let gender = "other";
    switch (information.gender) {
      case Gender.Male:
        gender = "male";
        break;
      case Gender.Female:
        gender = "female";
        break;
      case Gender.NonBinary:
        gender = "non-binary";
        break;
    }
    selectOptionWithText(element, [gender]);
  }
);

AdlerWeiner.addQuestion(
  ["Are you", "male", "female", "non binary", "self describe"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    let gender = "other";
    switch (information.gender) {
      case Gender.Male:
        gender = "male";
        break;
      case Gender.Female:
        gender = "female";
        break;
      case Gender.NonBinary:
        gender = "non binary";
        break;
    }
    selectOptionWithText(element, [gender]);
  }
);

AdlerWeiner.addQuestion(
  ["age", "group"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    const options = Array.from(element.querySelectorAll("label"));
    const index = indexFromRanges(options, information.age);
    if (index != -1) pressLabelIfNotChecked(options[index]);
  }
);

AdlerWeiner.addQuestion(
  ["age", "category"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    const options = Array.from(element.querySelectorAll("label"));
    const index = indexFromRanges(options, information.age);
    if (index != -1) pressLabelIfNotChecked(options[index]);
  }
);

AdlerWeiner.addQuestion(
  ["What is your exact age?"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    setInputValue(element.querySelector("input"), information.age.toString());
  }
);

AdlerWeiner.addQuestion(
  ["What is your exact age and date of birth?"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    const inputs = Array.from(element.querySelectorAll("input"));

    const answers = [
      information.age.toString(),
      information.dob_mmddyyyy_slash,
    ];
    for (let i = 0; i < answers.length; i++) {
      setInputValue(inputs[i] as HTMLInputElement, answers[i]);
    }
  }
);

AdlerWeiner.addQuestion(
  ["What is your ethnicity"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    switch (information.race) {
      case Race.White:
        selectOptionWithText(element, ["caucasian"]);
        break;
      case Race.Black:
        selectOptionWithText(element, ["african", "american"]);
        break;
      case Race.Asian:
        selectOptionWithText(element, ["asian"]);
        break;
      case Race.Hispanic:
        selectOptionWithText(element, ["hispanic"]);
        break;
      default:
        selectOptionWithText(element, ["other"]);
        setInputValue(
          element.querySelector("input"),
          information.race.toString()
        );
        break;
    }
  }
);

AdlerWeiner.addQuestion(
  ["ethnicity", "identify"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    switch (information.race) {
      case Race.White:
        selectOptionWithText(element, ["white"]);
        break;
      case Race.Black:
        selectOptionWithText(element, ["black"]);
        break;
      case Race.Asian:
        selectOptionWithText(element, ["asian"]);
        break;
      case Race.Hispanic:
        selectOptionWithText(element, ["hispanic"]);
        break;
      case Race.NativeAmerican:
      case Race.MiddleEastern:
      case Race.MixedRace:
      case Race.Other:
        selectOptionWithText(element, ["other"]);

        setInputValue(
          element.querySelector("input"),
          information.race.toString()
        );
        break;
    }
  }
);

AdlerWeiner.addQuestion(
  ["ethnic", "background"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    switch (information.race) {
      case Race.White:
        selectOptionWithText(element, ["white"]);
        break;
      case Race.Black:
        selectOptionWithText(element, ["black"]);
        break;
      case Race.Asian:
        selectOptionWithText(element, ["asian"]);
        break;
      case Race.Hispanic:
        selectOptionWithText(element, ["hispanic"]);
        break;
      case Race.NativeAmerican:
      case Race.MiddleEastern:
      case Race.MixedRace:
      case Race.Other:
        selectOptionWithText(element, ["other"]);
        setInputValue(
          element.querySelector("input"),
          information.race.toString()
        );
        break;
    }
  }
);

AdlerWeiner.addQuestion(
  ["last time", "participated", "in", "a", "study"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    const weightedOptions = [];
    weightedOptions.push(WeightedOption(["under", "month"], 0));
    weightedOptions.push(WeightedOption(["1", "3", "month"], 1));
    weightedOptions.push(WeightedOption(["4", "6", "month"], 2));
    weightedOptions.push(WeightedOption(["over", "months"], 4));
    weightedOptions.push(WeightedOption(["never"], 0));

    const option = chooseWeightedOption(weightedOptions);
    selectOptionWithText(element, option);
  },
  { hardcoded: true }
);

AdlerWeiner.addQuestion(
  ["What subject was it on?"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    const weightedOptions = [];
    weightedOptions.push(WeightedOption("Virtual Reality", 1));
    weightedOptions.push(WeightedOption("Pet Food", 1));
    weightedOptions.push(WeightedOption("Cannabis Consumption", 1));
    const option = chooseWeightedOption(weightedOptions);

    setInputValue(element.querySelector("input"), option);
  },
  { hardcoded: true }
);

AdlerWeiner.addQuestion(
  ["you", "family", "employment history", "with", "any of the following"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    const labels = Array.from(element.querySelectorAll("label"));
    for (const label of labels) {
      const text = label.innerText.toLowerCase();
      if (text.includes("none of the above")) pressLabelIfNotChecked(label);
    }
  },
  { hardcoded: true }
);

AdlerWeiner.addQuestion(
  ["you", "household", "employed", "retired", "companies"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    const labels = Array.from(element.querySelectorAll("label"));
    for (const label of labels) {
      const text = label.innerText.toLowerCase();
      if (text.includes("none of the above")) pressLabelIfNotChecked(label);
    }
  },
  { hardcoded: true }
);

AdlerWeiner.addQuestion(
  ["category", "describes", "employ", "status"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    let status: string[] = [];
    switch (information.employment.status) {
      case EmploymentStatus.FullTimeInPerson:
        status = ["full", "time", "outside"];
        break;
      case EmploymentStatus.SelfEmployed:
      case EmploymentStatus.FullTimeRemote:
        status = ["full", "time", "work from home"];
        break;
      case EmploymentStatus.PartTime:
        status = ["part", "time"];
        break;
      case EmploymentStatus.Student:
        status = ["student"];
        break;
      case EmploymentStatus.Homemaker:
        status = ["homemaker"];
        break;
      case EmploymentStatus.Retired:
      case EmploymentStatus.Other:
      case EmploymentStatus.Unemployed:
        status = ["unemployed"];
        break;
    }
    selectOptionWithText(element, status);
  }
);

AdlerWeiner.addQuestion(
  ["provide", "employment", "information"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    const answers = [
      information.employment.occupation,
      information.employment.employer,
      information.employment.industry,
    ];
    const inputs = element.querySelectorAll("input");
    for (let i = 0; i < answers.length; i++) {
      setInputValue(inputs[i], answers[i] || "N/A");
    }
  }
);

AdlerWeiner.addQuestion(
  ["describes", "employment", "status"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    let status: string[] = [];
    switch (information.employment.status) {
      case EmploymentStatus.FullTimeInPerson:
      case EmploymentStatus.FullTimeRemote:
        status = ["full", "time"];
        break;
      case EmploymentStatus.PartTime:
        status = ["part", "time"];
        break;
      case EmploymentStatus.SelfEmployed:
        status = ["self", "employed"];
        break;
      case EmploymentStatus.Student:
        status = ["student", "not working"];
        break;
      case EmploymentStatus.Homemaker:
        status = ["homemaker"];
        break;
      case EmploymentStatus.Retired:
      case EmploymentStatus.Other:
      case EmploymentStatus.Unemployed:
        status = ["unemployed"];
        break;
    }
    selectOptionWithText(element, status);
  },
  { canDuplicate: true }
);

AdlerWeiner.addQuestion(
  ["your", "yearly", "income"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    const labels = Array.from(element.querySelectorAll("label"));
    const index = indexFromRanges(labels, information.employment?.salary ?? 0);
    if (index != -1) pressLabelIfNotChecked(labels[index]);
  }
);

AdlerWeiner.addQuestion(
  ["annual", "household", "income"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    const labels = Array.from(element.querySelectorAll("label"));
    const index = indexFromRanges(labels, information.employment?.salary ?? 0);
    if (index != -1) pressLabelIfNotChecked(labels[index]);
  }
);

AdlerWeiner.addQuestion(
  ["living", "situation"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    let option = [];
    if (information.household.length === 0) {
      option = ["alone"];
    } else if (
      information.household.filter(
        (housemate) => housemate.relationship === Relationship.SignificantOther
      ).length > 0
    ) {
      option = ["significant other"];
      const children = information.household.filter(
        (housemate) => housemate.relationship === Relationship.Child
      );
      if (children.length > 0) {
        option.push("children");
        if (children.some((child) => child.age < 12)) {
          option.push("12", "under");
        } else {
          option.push("13", "older");
        }
      }
    } else if (
      information.household.filter(
        (housemate) => housemate.relationship === Relationship.Other
      ).length == information.household.length
    ) {
      option = ["roommate"];
    } else {
      option = ["family"];
    }

    selectOptionWithText(element, option);
  }
);

AdlerWeiner.addQuestion(
  ["children", "under", "18", "in", "household"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    const childrenUnder18 = information.household
      .filter((housemate) => housemate.relationship === Relationship.Child)
      .filter((child) => child.age <= 18);
    if (childrenUnder18.length > 0) {
      selectOptionWithText(element, ["yes"]);
      setInputValue(
        element.querySelector("input"),
        childrenUnder18.map((child) => child.age).join(", ")
      );
    } else {
      selectOptionWithText(element, ["no"]);
    }
  }
);

AdlerWeiner.addQuestion(
  ["Are you...", "single", "married"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    switch (information.maritalStatus) {
      case MaritalStatus.Single:
        selectOptionWithText(element, ["single"]);
        break;
      case MaritalStatus.Married:
        selectOptionWithText(element, ["married"]);
        break;
      case MaritalStatus.DomesticPartner:
      case MaritalStatus.LivingWithSO:
        selectOptionWithText(element, ["cohabitat"]);
        break;
      case MaritalStatus.Separated:
      case MaritalStatus.Divorced:
        selectOptionWithText(element, ["divorce", "separate"]);
        break;
      case MaritalStatus.Widowed:
        selectOptionWithText(element, ["widow"]);
        break;
    }
  }
);

AdlerWeiner.addQuestion(
  ["currently", "children", "under 18", "household"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    const childrenUnder18 = information.household
      .filter((housemate) => housemate.relationship === Relationship.Child)
      .filter((child) => child.age <= 18);
    if (childrenUnder18.length > 0) {
      selectOptionWithText(element, ["yes"]);
      setInputValue(
        element.querySelector("input"),
        childrenUnder18.map((child) => child.age).join(", ")
      );
    } else {
      selectOptionWithText(element, ["no"]);
    }
  }
);

AdlerWeiner.addQuestion(
  ["week", "how many hours do you", "watch"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    element.querySelectorAll("label").forEach((label) => {
      pressLabelIfNotChecked(label);
    });
  },
  { hardcoded: true }
);

AdlerWeiner.addQuestion(
  [
    "What is the name of the company you work at? The industry? Your job title?",
  ],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    const labels = Array.from(element.querySelectorAll("label"));
    labels.forEach((label) => {
      const text = label.innerText.toLowerCase();
      const next = label.nextSibling as HTMLInputElement | null;

      if (text.includes("name of company")) {
        setInputValue(next, information.employment.employer ?? "N/A");
      } else if (text.includes("industry")) {
        setInputValue(next, information.employment.industry ?? "N/A");
      } else if (text.includes("job title")) {
        setInputValue(next, information.employment.occupation ?? "N/A");
      } else if (text.includes("student") && text.includes("major")) {
        setInputValue(next, information.education.major ?? "N/A");
      }
    });
  }
);

AdlerWeiner.addQuestion(
  [
    "Would you consider your occupation to be",
    "white",
    "blue",
    "pink",
    "grey",
    "collar",
  ],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    const labels = Array.from(element.querySelectorAll("label"));
    labels.forEach((label) => {
      if (
        label.innerText
          .toLowerCase()
          .includes(information.employment.collar.toString())
      )
        pressLabelIfNotChecked(label);
    });
  }
);

AdlerWeiner.addQuestion(
  ["highest", "education", "level"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    switch (information.education.level) {
      case EducationLevel.HighSchool:
        selectOptionWithText(element, ["high school graduate"]);
        break;
      case EducationLevel.Associates:
        selectOptionWithText(element, ["Some college"]);
        break;
      case EducationLevel.BachelorScience:
      case EducationLevel.BachelorArts:
        selectOptionWithText(element, ["College graduate"]);
        break;
      case EducationLevel.Masters:
      case EducationLevel.Doctorate:
        selectOptionWithText(element, ["Post graduate education"]);
        break;
      case EducationLevel.Other:
        selectOptionWithText(element, ["some high school"]);
        break;
    }
  }
);

AdlerWeiner.addQuestion(
  ["Do you", "own", "vehicle"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    const ownsVehicle = information.garage.vehicles.some(
      (vehicle) =>
        vehicle.ownership === VehicleOwnership.PurchasedNew ||
        vehicle.ownership === VehicleOwnership.PurchasedUsed ||
        vehicle.ownership === VehicleOwnership.CertifiedPreOwned
    );
    const leasedVehicle = information.garage.vehicles.some(
      (vehicle) => vehicle.ownership === VehicleOwnership.Leased
    );
    const companyVehicle = information.garage.vehicles.some(
      (vehicle) => vehicle.ownership === VehicleOwnership.CompanyVehicle
    );
    if (ownsVehicle) {
      selectOptionWithText(element, ["own"]);
    } else if (leasedVehicle) {
      selectOptionWithText(element, ["lease"]);
    } else if (companyVehicle) {
      selectOptionWithText(element, ["company"]);
    } else {
      selectOptionWithText(element, ["no"]);
    }
  }
);

AdlerWeiner.addQuestion(
  [
    "Do you routinely travel distances using this car for day-to-day activities",
  ],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    selectOptionWithText(element, ["yes"]);
  },
  { hardcoded: true }
);

AdlerWeiner.addQuestion(
  ["routine", "travel distance", "day"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    if (
      information.garage.vehicles.length > 0 &&
      information.garage.vehicles.some(
        (vehicle) => vehicle.dailyTravelInMiles > 0
      )
    ) {
      selectOptionWithText(element, ["yes"]);
    } else {
      selectOptionWithText(element, ["no"]);
    }
  }
);

AdlerWeiner.addQuestion(
  ["what distance", "drive daily"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    const distances = information.garage.vehicles.map(
      (vehicle) => vehicle.dailyTravelInMiles
    );
    setInputValue(
      element.querySelector("input"),
      Math.max(...distances).toString()
    );
  }
);

AdlerWeiner.addQuestion(
  ["make", "model", "year", "vehicle"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    const vehicleDescriptions = information.garage.vehicles.map(
      (vehicle) =>
        `${vehicle.productionYear} ${vehicle.make} ${vehicle.model}${
          "trim" in vehicle ? ` ${vehicle.trim}` : ""
        }`
    );

    setInputValue(
      element.querySelector("textarea"),
      vehicleDescriptions.join(", ")
    );
  }
);

AdlerWeiner.addQuestion(
  ["What", "powers", "vehicle"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    const electric = information.garage.vehicles.some(
      (vehicle) => vehicle.powerType === VehiclePower.Electric
    );
    const gas = information.garage.vehicles.some(
      (vehicle) =>
        vehicle.powerType === VehiclePower.Gas ||
        vehicle.powerType === VehiclePower.Diesel
    );
    const hybrid = information.garage.vehicles.some(
      (vehicle) => vehicle.powerType === VehiclePower.Hybrid
    );
    window.alert(
      "what powers vehicle triggered: " + electric + " " + gas + " " + hybrid
    );

    if (electric) selectOptionWithText(element, ["electric"]);
    else if (gas) selectOptionWithText(element, ["gas"]);
    else if (hybrid) selectOptionWithText(element, ["hybrid"]);
  }
);

AdlerWeiner.addQuestion(
  ["When", "purchase", "lease", "vehicle"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    const vehicles = information.garage.vehicles.map((vehicle) =>
      new Date(vehicle.purchaseDate_mmddyyyy_slash).getTime()
    );
    const newestVehiclePurchaseDate = vehicles.sort((a, b) => a - b)[0];

    const xMonthsAgo = (x: number) =>
      new Date(Date.now() - x * 30 * 24 * 60 * 60 * 1000).getTime();
    const withinLast3Months = newestVehiclePurchaseDate > xMonthsAgo(3);
    const withinLast6Months = newestVehiclePurchaseDate > xMonthsAgo(6);

    const xYearsAgo = (x: number) => xMonthsAgo(x * 12);
    const withinLastYear = newestVehiclePurchaseDate > xYearsAgo(1);
    const withinLast2Years = newestVehiclePurchaseDate > xYearsAgo(2);
    const withinLast4Years = newestVehiclePurchaseDate > xYearsAgo(4);

    if (withinLast3Months) {
      selectOptionWithText(element, ["within the last 6 months"]);
      selectOptionWithText(element, ["within the last 3 months"]);
    } else if (withinLast6Months) {
      selectOptionWithText(element, ["within the last 6 months"]);
    } else if (withinLastYear) {
      selectOptionWithText(element, ["within the last year"]);
      selectOptionWithText(element, ["6 months to 12 months"]);
    } else if (withinLast2Years) {
      selectOptionWithText(element, ["1-2 years ago"]);
    } else if (withinLast4Years) {
      selectOptionWithText(element, ["3-4 years ago"]);
    } else {
      const labels = Array.from(element.querySelectorAll("label"));
      pressLabelIfNotChecked(labels[labels.length - 1]);
    }
  }
);

AdlerWeiner.addQuestion(
  ["Where did you purchase/lease this vehicle", "how did you acquire it"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    const newestVehicle = information.garage.vehicles.sort(
      (a, b) =>
        new Date(a.purchaseDate_mmddyyyy_slash).getTime() -
        new Date(b.purchaseDate_mmddyyyy_slash).getTime()
    )[0];

    const [purchaseLocation, purchaseCondition] = [
      newestVehicle.purchasedLocation,
      newestVehicle.ownership,
    ];

    if (purchaseLocation === VehiclePurchaseLocation.Dealer) {
      selectOptionWithText(element, ["dealer"]);
    } else if (purchaseLocation === VehiclePurchaseLocation.PrivateSale) {
      selectOptionWithText(element, ["private sale"]);
    } else if (purchaseLocation === VehiclePurchaseLocation.OnlineWebsite) {
      selectOptionWithText(element, ["online website"]);
    } else if (purchaseLocation === VehiclePurchaseLocation.Carvana) {
      selectOptionWithText(element, ["carvana"]);
    } else if (purchaseLocation === VehiclePurchaseLocation.CarMax) {
      selectOptionWithText(element, ["carmax"]);
    }

    if (purchaseCondition === VehicleOwnership.PurchasedNew) {
      selectOptionWithText(element, ["purchased", "new"]);
    } else if (purchaseCondition === VehicleOwnership.PurchasedUsed) {
      selectOptionWithText(element, ["bought", "used"]);
    } else if (purchaseCondition === VehicleOwnership.CertifiedPreOwned) {
      selectOptionWithText(element, ["certified", "pre-owned"]);
    } else if (purchaseCondition === VehicleOwnership.Leased) {
      selectOptionWithText(element, ["leased"]);
    } else {
      selectOptionWithText(element, ["purchased", "new"]);
    }
  }
);

AdlerWeiner.addQuestion(
  ["to what extent", "sole", "primary", "shared", "decision-maker"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;
    selectOptionWithText(element, ["sole"]);
  },
  { hardcoded: true }
);

AdlerWeiner.addQuestion(
  ["which", "occasions", "do you", "regularly", "use", "vehicle", "for"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    const useVehicleFor = (use: VehicleUse) =>
      information.garage.vehicles.some((vehicle) =>
        vehicle.dailyUse.includes(use)
      );

    const commutingToWork = useVehicleFor(VehicleUse.Commute);
    const roadTrips = useVehicleFor(VehicleUse.RoadTrip);
    const pleasure = useVehicleFor(VehicleUse.Pleasure);
    const hauling = useVehicleFor(VehicleUse.Hauling);
    const dailyPleasure = useVehicleFor(VehicleUse.DailyPleasure);
    const errands = useVehicleFor(VehicleUse.Errands);
    const school = useVehicleFor(VehicleUse.School);
    const business = useVehicleFor(VehicleUse.Business);
    const rideShare = useVehicleFor(VehicleUse.RideShare);
    const caufferFriendsFamily = useVehicleFor(VehicleUse.CaufferFriendsFamily);

    if (commutingToWork) {
      selectOptionWithText(element, ["commut"]);
    }
    if (hauling) {
      selectOptionWithText(element, ["haul", "tow"]);
    }
    if (roadTrips) {
      selectOptionWithText(element, ["road trip"]);
    }
    if (pleasure || dailyPleasure) {
      selectOptionWithText(element, ["pleasure"]);
    }
    if (dailyPleasure) {
      selectOptionWithText(element, ["fun"]);
    }
    if (errands) {
      selectOptionWithText(element, ["driving", "kids"]);
    }
    if (school) {
      selectOptionWithText(element, ["school"]);
    }
    if (school || caufferFriendsFamily) {
      selectOptionWithText(element, ["driving", "kids", "friends"]);
    }
    if (business) {
      selectOptionWithText(element, ["business"]);
    }
    if (rideShare) {
      selectOptionWithText(element, ["ride", "hail"]);
    }
  }
);

AdlerWeiner.addQuestion(
  ["factors", "influenced", "your", "decision", "to", "buy", "vehicle"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    const factorsToBuy = (use: CarPurchaseReason) =>
      information.garage.vehicles
        .filter((v): v is Car => v.type === VehicleTypes.Car)
        .some((car) => car.purchaseReason.includes(use));

    const financialIncentive = factorsToBuy(
      CarPurchaseReason.FinancialIncentive
    );
    const familyNeeds = factorsToBuy(CarPurchaseReason.FamilyNeeds);
    const neededAdditionalVehicle = factorsToBuy(
      CarPurchaseReason.NeededAdditionalVehicle
    );
    const newModel = factorsToBuy(CarPurchaseReason.NewModel);
    const newTechnology = factorsToBuy(CarPurchaseReason.NewTechnology);
    const previousCarOutdated = factorsToBuy(
      CarPurchaseReason.PreviousCarOutdated
    );
    const financialSituationChanged = factorsToBuy(
      CarPurchaseReason.FinancialSituationChanged
    );
    const leaseExpired = factorsToBuy(CarPurchaseReason.LeaseExpired);
    const environment = factorsToBuy(CarPurchaseReason.Environment);

    if (financialIncentive) {
      selectOptionWithText(element, ["financial", "incentive"]);
    }
    if (familyNeeds) {
      selectOptionWithText(element, ["family", "needs"]);
    }
    if (neededAdditionalVehicle) {
      selectOptionWithText(element, ["need", "additional", "vehicle"]);
    }
    if (newModel || newTechnology) {
      selectOptionWithText(element, ["new", "model", "feature"]);
    }
    if (previousCarOutdated) {
      selectOptionWithText(element, ["previous", "needed", "replacing"]);
    }
    if (financialSituationChanged) {
      selectOptionWithText(element, ["financial", "situation", "changed"]);
    }
    if (leaseExpired) {
      selectOptionWithText(element, ["lease", "expired"]);
    }
    if (environment) {
      setInputValue(element.querySelector("input"), "Environment");
    }
  }
);

AdlerWeiner.addQuestion(
  ["how important", "vehicle", "features", "options", "purchas"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    const mostRecentVehicle = information.garage.vehicles
      .filter((v): v is Car => v.type === VehicleTypes.Car)
      .sort(
        (a, b) =>
          new Date(a.purchaseDate_mmddyyyy_slash).getTime() -
          new Date(b.purchaseDate_mmddyyyy_slash).getTime()
      )[0];

    const selectImportanceForFeature = (
      rowNumber: number,
      importance: FeatureImportance
    ) => {
      const rows = element.querySelectorAll(`tbody > tr`);
      var i = 2;
      switch (importance) {
        case FeatureImportance.SomewhatImportant:
          i = 1;
          break;
        case FeatureImportance.VeryImportant:
          i = 0;
          break;
      }
      rows[rowNumber].querySelectorAll(`label`)[i].click();
    };

    const getFeatureImportance = (feature: CarFeatures) => {
      return (
        information.garage.featurePreferences.find(
          (fp) => fp.feature === feature
        )?.importance ?? FeatureImportance.NotSpecified
      );
    };

    mostRecentVehicle.features.forEach((feature) => {
      switch (feature) {
        case CarFeatures.AllWheelDrive:
        case CarFeatures.BackupCamera:
        case CarFeatures.Bluetooth:
        case CarFeatures.CruiseControl:
        case CarFeatures.HeatedSeats:
        case CarFeatures.Navigation:
          break;
        case CarFeatures.SunroofMoonroof:
          selectImportanceForFeature(0, getFeatureImportance(feature));
          break;
        case CarFeatures.PremiumAudio:
          selectImportanceForFeature(1, getFeatureImportance(feature));
          break;
        case CarFeatures.AdvancedDriverAssist:
          selectImportanceForFeature(2, getFeatureImportance(feature));
          break;
        case CarFeatures.PremiumInterior:
          selectImportanceForFeature(3, getFeatureImportance(feature));
          break;
        case CarFeatures.TowingPackage:
          selectImportanceForFeature(4, getFeatureImportance(feature));
          break;
        case CarFeatures.UpgradedInfotainment:
          selectImportanceForFeature(5, getFeatureImportance(feature));
          break;
        case CarFeatures.SportPackage:
          selectImportanceForFeature(6, getFeatureImportance(feature));
          break;
      }
    });
  }
);

AdlerWeiner.addQuestion(
  ["which", "features", "options", "in the vehicle", "you", "purchased/leased"],
  (information: Information, selector: string, i: number) => {
    const element = document.querySelectorAll(selector)[i] as HTMLElement;

    const mostRecentVehicle = information.garage.vehicles
      .filter((v): v is Car => v.type === VehicleTypes.Car)
      .sort(
        (a, b) =>
          new Date(a.purchaseDate_mmddyyyy_slash).getTime() -
          new Date(b.purchaseDate_mmddyyyy_slash).getTime()
      )[0];

    const selectOptionForFeature = (
      rowNumber: number,
      isIncluded: boolean
    ) => {
      const rows = element.querySelectorAll(`tbody > tr`);
      const weightedOptions = [];
      weightedOptions.push(WeightedOption([0], 1)); // standard
      weightedOptions.push(WeightedOption([1], 1)); // paid extra
      const option = chooseWeightedOption(weightedOptions)[0];
      const i = isIncluded ? option : 2;
      rows[rowNumber].querySelectorAll(`label`)[i].click();
    };

    const getFeatureImportance = (feature: CarFeatures) => {
      return (
        information.garage.featurePreferences.find(
          (fp) => fp.feature === feature
        )?.importance ?? FeatureImportance.NotSpecified
      );
    };

    const carIncludesFeature = (feature: CarFeatures) => {
      return mostRecentVehicle.features.includes(feature);
    };

    mostRecentVehicle.features.forEach((feature) => {
      switch (feature) {
        case CarFeatures.AllWheelDrive:
        case CarFeatures.BackupCamera:
        case CarFeatures.Bluetooth:
        case CarFeatures.CruiseControl:
        case CarFeatures.HeatedSeats:
        case CarFeatures.Navigation:
          break;
        case CarFeatures.SunroofMoonroof:
          selectOptionForFeature(0, carIncludesFeature(feature));
          break;
        case CarFeatures.PremiumAudio:
          selectOptionForFeature(1, carIncludesFeature(feature));
          break;
        case CarFeatures.AdvancedDriverAssist:
          selectOptionForFeature(2, carIncludesFeature(feature));
          break;
        case CarFeatures.PremiumInterior:
          selectOptionForFeature(3, carIncludesFeature(feature));
          break;
        case CarFeatures.TowingPackage:
          selectOptionForFeature(4, carIncludesFeature(feature));
          break;
        case CarFeatures.UpgradedInfotainment:
          selectOptionForFeature(5, carIncludesFeature(feature));
          break;
        case CarFeatures.SportPackage:
          selectOptionForFeature(6, carIncludesFeature(feature));
          break;
      }
    });
  }
);

AdlerWeiner.addQuestion(
  ["Thank you so much for completing this survey"],
  () => {}
);

AdlerWeiner.addQuestion(
  [
    "This is the last page of the survey",
    "It is important that you answer all of these questions",
  ],
  () => {}
);

export default AdlerWeiner;
