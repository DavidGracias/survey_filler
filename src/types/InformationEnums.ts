export enum People {
  David,
  Bela,
}

export enum Gender {
  Male = "m",
  Female = "f",
  NonBinary = "n",
}

export interface Phone {
  number: string;
  make: string;
  model: string;
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

export enum JobCollar {
  // manual labor
  Blue = "blue",
  // personal services (healthcare, childcare, etc.)
  Pink = "pink",
  // professional services (law, finance, consulting, etc.)
  White = "white",
  // in between white and blue
  Grey = "grey",
}

export interface Employment {
  status: EmploymentStatus;
  occupation?: string;
  industry?: string;
  collar: JobCollar;
  employer?: string;
  salary?: number;
}

export interface Education {
  level: EducationLevel;
  major?: string;
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