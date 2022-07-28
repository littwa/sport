export class UpdateProductDto {
  readonly name?: string;
  readonly category?: string;
  readonly unit: string;
  readonly price?: string;
  readonly quantity?: string;
  readonly availability?: string;
  readonly info?: string;
  readonly description?: string;
  readonly tags?: string;
  readonly photos?: string;
  readonly characteristic?: string;
}

export class CreateProductDto extends UpdateProductDto {
  readonly name: string;
}

export class RateDto {
  readonly [userID: string]: 1 | 2 | 3 | 4 | 5;
}
