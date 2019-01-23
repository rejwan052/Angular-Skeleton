export class Address {

  public id: number;
  public addressLine1: string;
  public addressLine2: string;
  public city: string;
  public town: string;

  constructor(id?: number, addressLine1?: string, addressLine2?: string, city?: string, town?: string) {
    this.id = id;
    this.addressLine1 = addressLine1;
    this.addressLine2 = addressLine2;
    this.city = city;
    this.town = town;
  }

}
