import { ECharacteristics, ProductsCategoryEnum, ProductsSubCategoryEnum } from '../enums/products.enum';

export type TCharacteristics = {
    [key in ECharacteristics]: any;
};

export type TQueryOrderSpecify = 'asc' | 'desc';
