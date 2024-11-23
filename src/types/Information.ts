export enum People {
  David,
  Bela
}

export class Information {
  
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
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

  constructor(person: People) {
    switch (person) {
      case People.Bela:
        this.firstName = "Izabela";
        this.middleName = "Joy";
        this.lastName = "Quintas";
        this.fullName = `${this.firstName} ${this.middleName} ${this.lastName}`;

        this.email = "izabela.quintas55@gmail.com";
        this.phone = "7082052545";

        this.streetAddress = "8688 E Raintree Drive"
        this.streetAddressII = "Apt. 3039"
        this.city = "Scottsdale";
        this.state = "Arizona";
        this.stateAbbreviation = "AZ";
        this.zipcode = "85260";
        this.county = "Maricopa";

        this.address = `${this.streetAddress} ${this.streetAddressII} ${this.city} ${this.stateAbbreviation}, ${this.zipcode}`
        break;

      case People.David:
      default:
        this.firstName = "David";
        this.middleName = "";
        this.lastName = "Garcia";
        this.fullName = `${this.firstName} ${this.lastName}`;

        this.email = "davidg0130@gmail.com";
        this.phone = "7038538605";

        this.streetAddress = "4219 W Purdue Ave."
        this.streetAddressII = ""
        this.city = "Phoenix";
        this.state = "Arizona";
        this.stateAbbreviation = "AZ";
        this.zipcode = "85051";
        this.county = "Maricopa";

        this.address = `${this.streetAddress} ${this.city} ${this.stateAbbreviation}, ${this.zipcode}`
    }
  }
}