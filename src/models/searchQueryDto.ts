import { IsIn, IsNotEmpty, IsString } from "class-validator";

export class SearchQueryDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['colour', 'name', 'country'], {
    message: 'Invalid criteria. Valid options are: colour, name, country',
  })
  criteria: string;
  
  @IsString()
  @IsNotEmpty()
  value: string;
}