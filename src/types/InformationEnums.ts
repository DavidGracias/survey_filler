export enum People {
  David,
  Bela,
}

export enum Gender {
  Male,
  Female,
  NonBinary,
}

export interface Phone {
  number: string;
  make: string;
  model: string;
}

export enum MaritalStatus {
  Single,
  LivingWithSO,
  Married,
  Divorced,
  Separated,
  Widowed,
  DomesticPartner,
}

export enum Relationship {
  Child,
  SignificantOther,
  Parent,
  OtherFamily,
  Other,
}

export interface Housemate {
  name: string;
  age: number;
  gender: Gender;
  relationship: Relationship;
}

export enum JobCollar {
  // manual labor
  Blue,
  // personal services (healthcare, childcare, etc.)
  Pink,
  // professional services (law, finance, consulting, etc.)
  White,
  // in between white and blue
  Grey,
}

export interface Employment {
  status: EmploymentStatus;
  occupation?: string;
  industry?: string;
  collar: JobCollar;
  employer?: string;
  salary?: number;
  linkedin?: string;
}

export interface Education {
  level: EducationLevel;
  major?: string;
}

export enum EmploymentStatus {
  FullTimeInPerson,
  FullTimeRemote,
  PartTime,
  SelfEmployed,
  Student,
  Homemaker,
  Unemployed,
  Retired,
  Other,
}

export enum EducationLevel {
  HighSchool,
  Associates,
  BachelorScience,
  BachelorArts,
  Masters,
  Doctorate,
  Other,
}

export enum PoliticalAffiliation {
  Democrat,
  Republican,
  LeanDemocrat,
  LeanRepublican,
  Independent,
  IndependentLeanDemocrat,
  IndependentLeanRepublican,
  Libertarian,
  Green,
  Communist,
  Other,
}

export enum Timezone {
  PT,
  MT,
  CT,
  ET,
}

export enum Region {
  Northeast,
  Midwest,
  South,
  California,
  West,
  Unknown,
}

export enum Race {
  Hispanic,
  White,
  Black,
  Asian,
  PacificIslander,
  MiddleEastern,
  NativeAmerican,
  MixedRace,
  Other,
}

export enum NationOfOrigin {
  USA,
  Canada,
  Mexico,
  China,
  India,
  Brazil,
  Ecuador,
  Colombia,
  // Add more nations as needed
  Other,
}

export interface Garage {
  vehicles: Vehicle[],
  featurePreferences: CarFeaturePreference[],
}

export interface Vehicle {
  ownership: VehicleOwnership,
  dailyTravelInMiles: number,
  dailyUse: VehicleUse[],
  make: string,
  model: string,
  productionYear: number,
  purchaseDate_mmddyyyy_slash: string,
  powerType: VehiclePower,
  purchasedLocation: VehiclePurchaseLocation,
  purchasePrice: number,
  type: VehicleTypes;
}

export enum VehicleTypes {
  Car,
  Motorcycle,
}

export interface Car extends Vehicle {
  type: VehicleTypes.Car;
  trim: string | null;
  features: CarFeatures[],
  purchaseReason: CarPurchaseReason[],
}

export interface Motorcycle extends Vehicle {
  type: VehicleTypes.Motorcycle;
  engineSize: number;
}

export enum VehicleOwnership {
  PurchasedNew,
  PurchasedUsed,
  CertifiedPreOwned,
  Leased,
  CompanyVehicle,
}

export enum VehiclePower {
  Electric,
  Gas,
  Diesel,
  Hybrid,
}

export enum VehiclePurchaseLocation {
  Dealer,
  Carvana,
  CarMax,
  PrivateSale,
  OnlineWebsite,
}

export enum VehicleUse {
  Commute,
  RoadTrip,
  Pleasure,
  DailyPleasure,
  Hauling,
  Errands,
  CaufferFriendsFamily,
  School,
  Business,
  RideShare,
}

export enum CarFeatures {
  AllWheelDrive,
  BackupCamera,
  Bluetooth,
  CruiseControl,
  HeatedSeats,
  Navigation,
  SunroofMoonroof,
  PremiumAudio,
  AdvancedDriverAssist,
  PremiumInterior,
  TowingPackage,
  UpgradedInfotainment,
  SportPackage,
  Other,
}

export enum FeatureImportance {
  VeryImportant,
  SomewhatImportant,
  NotThatImportant,
  NotSpecified
}

export interface CarFeaturePreference {
  feature: CarFeatures;
  importance: FeatureImportance;
}

export enum CarPurchaseReason {
  FinancialIncentive,
  FamilyNeeds,
  NeededAdditionalVehicle,
  NewModel,
  NewTechnology,
  PreviousCarOutdated,
  FinancialSituationChanged,
  LeaseExpired,
  Environment,
  Other,
}
