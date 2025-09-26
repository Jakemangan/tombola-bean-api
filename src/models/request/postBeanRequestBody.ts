import { IsNotEmpty, IsString } from 'class-validator';

export class PostBeanRequestBody {
  @IsString() @IsNotEmpty()
  Cost: string;

  @IsString() @IsNotEmpty()
  Image: string;

  @IsString() @IsNotEmpty()
  colour: string;

  @IsString() @IsNotEmpty()
  Name: string;

  @IsString() @IsNotEmpty()
  Description: string;

  @IsString() @IsNotEmpty()
  Country: string;
}