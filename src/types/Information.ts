export enum People {
  David,
  Bela,
}

export enum Gender {
  Male = "m",
  Female = "f",
  NonBinary = "n",
}

export enum MaritalStatus {
  Single = "single",
  LivingWithSO = "living with significant other",
  Married = "married",
  Divorced = "divorced",
  Separated = "separated",
  Widowed = "widowed",
  DomesticPartner = "domestic partner",
}

export enum Relationship {
  Child = "child",
  SignificantOther = "significant other",
  Parent = "parent",
  OtherFamily = "other family",
  Other = "other",
}

export interface Housemate {
  name: string;
  age: number;
  gender: Gender;
  relationship: Relationship;
}

export interface Employment {
  status: EmploymentStatus;
  occupation?: string;
  industry?: string;
  employer?: string;
  salary?: number;
}

export enum EmploymentStatus {
  FullTimeInPerson = "full time in person",
  FullTimeRemote = "full time remote",
  PartTime = "part time",
  SelfEmployed = "self employed",
  Student = "student",
  Homemaker = "homemaker",
  Unemployed = "unemployed",
  Retired = "retired",
  Other = "other",
}

export enum EducationLevel {
  HighSchool = "high school",
  Associates = "associates",
  BachelorScience = "bachelors science",
  BachelorArts = "bachelors arts",
  Masters = "masters",
  Doctorate = "doctorate",
  Other = "other",
}

export enum PoliticalAffiliation {
  Democrat = "democrat",
  Republican = "republican",
  LeanDemocrat = "lean democrat",
  LeanRepublican = "lean republican",
  Independent = "independent",
  IndependentLeanDemocrat = "independent lean democrat",
  IndependentLeanRepublican = "independent lean republican",
  Libertarian = "libertarian",
  Green = "green",
  Communist = "communist",
  Other = "other",
}

export enum Timezone {
  PT = "pt",
  MT = "mt",
  CT = "ct",
  ET = "et",
}

export enum Region {
  Northeast = "ne",
  Midwest = "mw",
  South = "s",
  California = "c",
  West = "w",
  Unknown = "",
}

export enum Race {
  Hispanic = "hispanic",
  White = "white",
  Black = "black",
  Asian = "asian",
  PacificIslander = "pacific islander",
  MiddleEastern = "middle eastern",
  NativeAmerican = "native american",
  MixedRace = "mixed race",
  Other = "other",
}

export enum NationOfOrigin {
  USA = "United States",
  Canada = "Canada",
  Mexico = "Mexico",
  China = "China",
  India = "India",
  Brazil = "Brazil",
  Ecuador = "Ecuador",
  Colombia = "Colombia",
  // Add more nations as needed
  Other = "Other",
}

export class Information {
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  gender: Gender;
  maritalStatus: MaritalStatus;
  household: Housemate[];
  age: number;
  email: string;
  phone: string;
  streetAddress: string;
  streetAddressII: string | null;
  city: string;
  state: string;
  stateAbbreviation: string;
  zipcode: string;
  county: string;
  address: string;
  tz: Timezone;
  region: Region;
  dob_mmddyyyy_slash: string;
  dob_year: number;
  dob_month: number;
  dob_day: number;
  dob_month_text: string;
  dob_month_abv: string;

  educationLevel: EducationLevel;
  employment: Employment;
  race: Race;
  nationOfOrigin: NationOfOrigin;
  politicalAffiliation: PoliticalAffiliation;

  hardcodedQuestionsEnabled: boolean;


  constructor(person: People) {
    switch (person) {
      case People.Bela:
        this.firstName = "Izabela";
        this.middleName = "Joy";
        this.lastName = "Quintas";

        this.gender = Gender.Female;

        this.maritalStatus = MaritalStatus.Married;
        this.household = [
          {
            name: "David Garcia",
            age: getAge("01/30/2001"),
            gender: Gender.Male,
            relationship: Relationship.SignificantOther,
          },
        ];

        this.email = "izabela.quintas55@gmail.com";
        this.phone = "7082052545";

        this.streetAddress = "8688 E Raintree Drive";
        this.streetAddressII = "Apt. 3039";
        this.city = "Scottsdale";
        this.state = "Arizona";
        this.stateAbbreviation = "AZ";
        this.zipcode = "85260";
        this.county = "Maricopa";
        this.tz = Timezone.MT;

        this.dob_year = 2000;
        this.dob_month = 11;
        this.dob_day = 17;

        this.employment = {
          status: EmploymentStatus.Homemaker,
          salary: 145000,
        };
        this.educationLevel = EducationLevel.BachelorScience;

        this.race = Race.Hispanic;
        this.nationOfOrigin = NationOfOrigin.Ecuador;

        this.politicalAffiliation = PoliticalAffiliation.IndependentLeanDemocrat;

        this.hardcodedQuestionsEnabled = true;
        break;

      case People.David:
      default:
        this.firstName = "David";
        this.middleName = "";
        this.lastName = "Garcia";

        this.gender = Gender.Male;

        this.maritalStatus = MaritalStatus.Married;
        this.household = [
          {
            name: "Izabela Quintas",
            age: getAge("11/17/2000"),
            gender: Gender.Female,
            relationship: Relationship.SignificantOther,
          },
        ];

        this.email = "davidg0130@gmail.com";
        this.phone = "7038538605";

        this.streetAddress = "4219 W Purdue Ave.";
        this.streetAddressII = null;
        this.city = "Phoenix";
        this.state = "Arizona";
        this.stateAbbreviation = "AZ";
        this.zipcode = "85051";
        this.county = "Maricopa";
        this.tz = Timezone.MT;

        this.dob_year = 2001;
        this.dob_month = 1;
        this.dob_day = 30;

        this.employment = {
          status: EmploymentStatus.FullTimeRemote,
          occupation: "Software Engineer",
          industry: "Technology",
          employer: "Atlassian",
          salary: 145000,
        };
        this.educationLevel = EducationLevel.BachelorScience;

        this.race = Race.Hispanic;
        this.nationOfOrigin = NationOfOrigin.Ecuador;

        this.politicalAffiliation = PoliticalAffiliation.IndependentLeanDemocrat;

        this.hardcodedQuestionsEnabled = true;
    }

    [this.dob_month_text, this.dob_month_abv] = getMonthString(this.dob_month);

    this.fullName =
      `${this.firstName} ${this.middleName} ${this.lastName}`.trim();

    this.address =
      `${this.streetAddress} ${this.streetAddressII} ${this.city} ${this.stateAbbreviation}, ${this.zipcode}`.trim();

    this.region = getRegion(this.state);

    this.dob_mmddyyyy_slash = `${
      (this.dob_month < 10 ? "0" : "") + this.dob_month
    }/${this.dob_day}/${this.dob_year}`;
    this.age = getAge(this.dob_mmddyyyy_slash);
  }
}

function getMonthString(month: number): [string, string] {
  switch (month) {
    case 1:
      return ["January", "Jan"];
    case 2:
      return ["February", "Feb"];
    case 3:
      return ["March", "Mar"];
    case 4:
      return ["April", "Apr"];
    case 5:
      return ["May", "May"];
    case 6:
      return ["June", "Jun"];
    case 7:
      return ["July", "Jul"];
    case 8:
      return ["August", "Aug"];
    case 9:
      return ["September", "Sep"];
    case 10:
      return ["October", "Oct"];
    case 11:
      return ["November", "Nov"];
    case 12:
      return ["December", "Dec"];
  }
  return ["", ""];
}

function getAge(birthday: string): number {
  const millis = Date.now() - Date.parse(birthday);
  return new Date(millis).getFullYear() - 1970;
}

function getRegion(state: string): Region {
  const usRegions = {
    [Region.Northeast]: [
      "Maine",
      "New Hampshire",
      "Vermont",
      "Massachusetts",
      "Rhode Island",
      "Connecticut",
      "New York",
      "New Jersey",
      "Pennsylvania",
    ],
    [Region.Midwest]: [
      "Ohio",
      "Indiana",
      "Illinois",
      "Michigan",
      "Wisconsin",
      "Minnesota",
      "Iowa",
      "Missouri",
      "North Dakota",
      "South Dakota",
      "Nebraska",
      "Kansas",
    ],
    [Region.South]: [
      "Delaware",
      "Maryland",
      "Virginia",
      "West Virginia",
      "North Carolina",
      "South Carolina",
      "Georgia",
      "Florida",
      "Kentucky",
      "Tennessee",
      "Alabama",
      "Mississippi",
      "Arkansas",
      "Louisiana",
      "Oklahoma",
      "Texas",
    ],
    [Region.West]: [
      "Montana",
      "Idaho",
      "Wyoming",
      "Colorado",
      "New Mexico",
      "Arizona",
      "Utah",
      "Nevada",
      "Oregon",
      "Washington",
      "Alaska",
      "Hawaii",
    ],
    [Region.California]: ["California"], // special case for many places
  };

  for (const region of Object.keys(usRegions) as (keyof typeof usRegions)[]) {
    if (usRegions[region].includes(state)) return region;
  }

  return Region.Unknown;
}
