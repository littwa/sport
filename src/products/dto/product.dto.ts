export class updateProductDto {
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

export class createProductDto extends updateProductDto {
  readonly name: string;
}
