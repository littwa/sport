import { ECharacteristics, ProductsCategoryEnum, ProductsSubCategoryEnum } from '../enums/products.enum';

// export type TGetProdParam = {} ProductsSubCategoryEnum | ProductsCategoryEnum | undefined;

export type TCharacteristics = {
    [key in ECharacteristics]: any;
};
