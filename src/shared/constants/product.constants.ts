import { ProductsCategoryEnum, ProductsSubCategoryEnum } from '../enums/products.enum';

export const PRODUCT_UPDATE_KEYS = [
    'name',
    'category',
    'unit',
    'quantity',
    'price',
    'availability',
    'info',
    'description',
    'tags',
];

export const CATEGORY_PRODUCTS = [
    {
        category: ProductsCategoryEnum.Other,
        subCategories: [{ category: ProductsSubCategoryEnum.OTHER }],
    },
    {
        category: ProductsCategoryEnum.NotebooksAndPC,
        subCategories: [
            { category: ProductsSubCategoryEnum.NOTEBOOKS },
            { category: ProductsSubCategoryEnum.PC },
            { category: ProductsSubCategoryEnum.MONITORS },
            { category: ProductsSubCategoryEnum.SCANNERS },
            { category: ProductsSubCategoryEnum.PRINTERS },
        ],
    },
    {
        category: ProductsCategoryEnum.Gaming,
        subCategories: [{ category: ProductsSubCategoryEnum.CONSOLES }, { category: ProductsSubCategoryEnum.GAMES }],
    },
    {
        category: ProductsCategoryEnum.TV,
        subCategories: [{ category: ProductsSubCategoryEnum.TV }, { category: ProductsSubCategoryEnum.VIDEOS }],
    },
    {
        category: ProductsCategoryEnum.Phone,
        subCategories: [
            { category: ProductsSubCategoryEnum.TABLETS },
            { category: ProductsSubCategoryEnum.SMARTPHONES },
        ],
    },
    {
        category: ProductsCategoryEnum.HouseholdAppliances,
        subCategories: [
            { category: ProductsSubCategoryEnum.REFRIGERATORS },
            { category: ProductsSubCategoryEnum.WASHING_MACHINES },
            { category: ProductsSubCategoryEnum.COOKERS },
        ],
    },
    {
        category: ProductsCategoryEnum.Instrument,
        subCategories: [{ category: ProductsSubCategoryEnum.DRILLS }, { category: ProductsSubCategoryEnum.SAWS }],
    },
    {
        category: ProductsCategoryEnum.Accessories,
        subCategories: [
            { category: ProductsSubCategoryEnum.MOUSES },
            { category: ProductsSubCategoryEnum.KEYBOARDS },
            { category: ProductsSubCategoryEnum.HEADPHONES },
        ],
    },
];
