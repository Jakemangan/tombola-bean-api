import { ApiProperty } from '@nestjs/swagger';

/*
 * Used as DTO for /GET and DBO for Bean model
 */
export class Bean {
  @ApiProperty({
    description: 'Unique identifier for the bean',
    example: '507f1f77bcf86cd799439011',
  })
  _id: string;

  @ApiProperty({
    description: 'Index number of the bean',
    example: 1,
  })
  index: number;

  @ApiProperty({
    description: 'Whether this bean is the Bean of the Day',
    example: false,
  })
  isBOTD: boolean;

  @ApiProperty({
    description: 'Cost of the bean',
    example: '$12.99',
  })
  Cost: string;

  @ApiProperty({
    description: 'Image URL for the bean',
    example: 'https://example.com/bean-image.jpg',
  })
  Image: string;

  @ApiProperty({
    description: 'Color of the bean',
    example: 'Dark Brown',
  })
  colour: string;

  @ApiProperty({
    description: 'Name of the bean',
    example: 'Ethiopian Yirgacheffe',
  })
  Name: string;

  @ApiProperty({
    description: 'Description of the bean',
    example: 'A bright and floral coffee with citrus notes',
  })
  Description: string;

  @ApiProperty({
    description: 'Country of origin',
    example: 'Ethiopia',
  })
  Country: string;
}
