import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PostBeanRequestBody {
  @ApiProperty({
    description: 'Cost of the bean',
    example: '$12.99',
  })
  @IsString()
  @IsNotEmpty()
  Cost: string;

  @ApiProperty({
    description: 'Image URL for the bean',
    example: 'https://example.com/bean-image.jpg',
  })
  @IsString()
  @IsNotEmpty()
  Image: string;

  @ApiProperty({
    description: 'Color of the bean',
    example: 'Dark Brown',
  })
  @IsString()
  @IsNotEmpty()
  colour: string;

  @ApiProperty({
    description: 'Name of the bean',
    example: 'Ethiopian Yirgacheffe',
  })
  @IsString()
  @IsNotEmpty()
  Name: string;

  @ApiProperty({
    description: 'Description of the bean',
    example: 'A bright and floral coffee with citrus notes',
  })
  @IsString()
  @IsNotEmpty()
  Description: string;

  @ApiProperty({
    description: 'Country of origin',
    example: 'Ethiopia',
  })
  @IsString()
  @IsNotEmpty()
  Country: string;
}
