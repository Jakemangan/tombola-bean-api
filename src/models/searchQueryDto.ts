import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchQueryDto {
  @ApiProperty({
    description: 'Search criteria',
    enum: ['colour', 'name', 'country'],
    example: 'name',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['colour', 'name', 'country'], {
    message: 'Invalid criteria. Valid options are: colour, name, country',
  })
  criteria: string;

  @ApiProperty({
    description: 'Search value',
    example: 'Brazil',
  })
  @IsString()
  @IsNotEmpty()
  value: string;
}
