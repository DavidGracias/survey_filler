export enum People {
  David,
  Bela
}

export enum Gender {
  Male = "m",
  Female = "f",
  NonBinary = "n",
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

export class Information {
  
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  gender: Gender;
  age: number;
  email: string;
  phone: string;
  streetAddress: string;
  streetAddressII: string;
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

  constructor(person: People) {
    switch (person) {
      case People.Bela:
        this.firstName = "Izabela";
        this.middleName = "Joy";
        this.lastName = "Quintas";

        this.gender = Gender.Female;

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

        break;

      case People.David:
      default:
        this.firstName = "David";
        this.middleName = "";
        this.lastName = "Garcia";

        this.gender = Gender.Male;

        this.email = "davidg0130@gmail.com";
        this.phone = "7038538605";

        this.streetAddress = "4219 W Purdue Ave.";
        this.streetAddressII = "";
        this.city = "Phoenix";
        this.state = "Arizona";
        this.stateAbbreviation = "AZ";
        this.zipcode = "85051";
        this.county = "Maricopa";
        this.tz = Timezone.MT;

        this.dob_year = 2001;
        this.dob_month = 1;
        this.dob_day = 30;

    }


    [this.dob_month_text, this.dob_month_abv] =  getMonthString(this.dob_month);

    this.fullName = `${this.firstName} ${this.middleName} ${this.lastName}`.trim();

    this.address = `${this.streetAddress} ${this.streetAddressII} ${this.city} ${this.stateAbbreviation}, ${this.zipcode}`.trim();
    
    this.region = getRegion(this.state);
    
    this.dob_mmddyyyy_slash = `${ (this.dob_month < 10? "0" : "") +this.dob_month}/${this.dob_day}/${this.dob_year}`;
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
    [Region.Northeast]: ["Maine", "New Hampshire", "Vermont", "Massachusetts", "Rhode Island", "Connecticut", "New York", "New Jersey", "Pennsylvania"],
    [Region.Midwest]: ["Ohio", "Indiana", "Illinois", "Michigan", "Wisconsin", "Minnesota", "Iowa", "Missouri", "North Dakota", "South Dakota", "Nebraska", "Kansas"],
    [Region.South]: ["Delaware", "Maryland", "Virginia", "West Virginia", "North Carolina", "South Carolina", "Georgia", "Florida", "Kentucky", "Tennessee", "Alabama", "Mississippi", "Arkansas", "Louisiana", "Oklahoma", "Texas"],
    [Region.West]: ["Montana", "Idaho", "Wyoming", "Colorado", "New Mexico", "Arizona", "Utah", "Nevada", "Oregon", "Washington", "Alaska", "Hawaii"],
    [Region.California]: ["California"] // special case for many places
  };

  for (const region of Object.keys(usRegions) as (keyof typeof usRegions)[]) {
    if (usRegions[region].includes(state)) return region;
  }

  return Region.Unknown;
}