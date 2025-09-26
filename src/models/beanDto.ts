/*
* Used as DTO for /GET and DBO for Bean model
*/
export interface Bean {
  _id: string;
  index: number;
  isBOTD: boolean;
  Cost: string;
  Image: string;
  colour: string;
  Name: string;
  Description: string;
  Country: string;
}