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

export const BRANDS = [
    { name: 'Samsung', link: '' },
    { name: 'Sony', link: '' },
    { name: 'LG', link: '' },
    { name: 'Panasonic', link: '' },
    { name: 'JBL', link: '' },
];

export const CHARACTERISTICS = {
    weight: 'weight',
    color: 'color',
    material: 'material',
    size: 'size',
    screenDiagonal: 'screen-diagonal',
    typeScreen: 'type-screen',
    refreshRate: 'refresh-rate',
    resolution: 'resolution',
    cpu: 'cpu',
    amountRam: 'amount-ram',
    typeRam: 'type-ram',
    typeMemory: 'type-memory',
    volumeMemory: 'volume-memory',
    videocard: 'videocard',
    wifi: 'wi-fi',
    bluetooth: 'bluetooth',
    mainCamera: 'main-camera',
    frontCamera: 'front-camera',
    typeDevice: 'type-device',
    format: 'format',
    networkInterfaces: 'network-interfaces',
    typeConsole: 'type-console',
    year: 'year',
};

export const BaseCharacteristics = {
    weight: CHARACTERISTICS.weight,
    color: CHARACTERISTICS.color,
    material: CHARACTERISTICS.material,
    size: CHARACTERISTICS.size,
};

export const MonitorsCharacteristics = {
    screenDiagonal: CHARACTERISTICS.screenDiagonal,
    typeScreen: CHARACTERISTICS.typeScreen,
    refreshRate: CHARACTERISTICS.refreshRate,
    resolution: CHARACTERISTICS.resolution,
};

export const PCCharacteristics = {
    cpu: CHARACTERISTICS.cpu,
    amountRam: CHARACTERISTICS.amountRam,
    typeRam: CHARACTERISTICS.typeRam,
    volumeMemory: CHARACTERISTICS.volumeMemory,
    typeMemory: CHARACTERISTICS.typeMemory,
    videocard: CHARACTERISTICS.videocard,
};

export const NotebooksCharacteristics = {
    screenDiagonal: CHARACTERISTICS.screenDiagonal,
    typeScreen: CHARACTERISTICS.typeScreen,
    refreshRate: CHARACTERISTICS.refreshRate,
    resolution: CHARACTERISTICS.resolution,
    cpu: CHARACTERISTICS.cpu,
    amountRam: CHARACTERISTICS.amountRam,
    typeRam: CHARACTERISTICS.typeRam,
    volumeMemory: CHARACTERISTICS.volumeMemory,
    typeMemory: CHARACTERISTICS.typeMemory,
    videocard: CHARACTERISTICS.videocard,
};

export const TabletsCharacteristics = {
    screenDiagonal: CHARACTERISTICS.screenDiagonal,
    typeScreen: CHARACTERISTICS.typeScreen,
    refreshRate: CHARACTERISTICS.refreshRate,
    resolution: CHARACTERISTICS.resolution,
    cpu: CHARACTERISTICS.cpu,
    amountRam: CHARACTERISTICS.amountRam,
    typeRam: CHARACTERISTICS.typeRam,
    volumeMemory: CHARACTERISTICS.volumeMemory,
    typeMemory: CHARACTERISTICS.typeMemory,
    wifi: CHARACTERISTICS.wifi,
    bluetooth: CHARACTERISTICS.bluetooth,
    mainCamera: CHARACTERISTICS.mainCamera,
    frontCamera: CHARACTERISTICS.frontCamera,
};

export const SmartphonesCharacteristics = {
    screenDiagonal: CHARACTERISTICS.screenDiagonal,
    typeScreen: CHARACTERISTICS.typeScreen,
    refreshRate: CHARACTERISTICS.refreshRate,
    resolution: CHARACTERISTICS.resolution,
    cpu: CHARACTERISTICS.cpu,
    amountRam: CHARACTERISTICS.amountRam,
    typeRam: CHARACTERISTICS.typeRam,
    volumeMemory: CHARACTERISTICS.volumeMemory,
    typeMemory: CHARACTERISTICS.typeMemory,
    wifi: CHARACTERISTICS.wifi,
    bluetooth: CHARACTERISTICS.bluetooth,
    mainCamera: CHARACTERISTICS.mainCamera,
    frontCamera: CHARACTERISTICS.frontCamera,
};

export const PrintersMfuCharacteristics = {
    typeDevice: CHARACTERISTICS.typeDevice,
    format: CHARACTERISTICS.format,
    networkInterfaces: CHARACTERISTICS.networkInterfaces,
};

export const ScannersCharacteristics = {
    typeDevice: CHARACTERISTICS.typeDevice,
    format: CHARACTERISTICS.format,
    networkInterfaces: CHARACTERISTICS.networkInterfaces,
};

export const ConsolesCharacteristics = {
    typeConsole: CHARACTERISTICS.typeConsole,
    cpu: CHARACTERISTICS.cpu,
    amountRam: CHARACTERISTICS.amountRam,
    typeRam: CHARACTERISTICS.typeRam,
    volumeMemory: CHARACTERISTICS.volumeMemory,
    typeMemory: CHARACTERISTICS.typeMemory,
    videocard: CHARACTERISTICS.videocard,
    networkInterfaces: CHARACTERISTICS.networkInterfaces,
};

export const GamesCharacteristics = {
    typeConsole: CHARACTERISTICS.typeConsole,
    year: CHARACTERISTICS.year,
};

export const MousesCharacteristics = {};

export const KeyboardsCharacteristics = {};

export const TVCharacteristics = {};

export const VideosCharacteristics = {};

export const RefrigeratorsCharacteristics = {};

export const WashingMachinesCharacteristics = {};

export const CookersCharacteristics = {};

export const DrillsCharacteristics = {};

export const SawsCharacteristics = {};

export const HeadphonesCharacteristics = {};

export const CATEGORY_PRODUCTS = [
    {
        category: ProductsCategoryEnum.Other,
        subCategories: [{ category: ProductsSubCategoryEnum.OTHER }],
    },
    {
        category: ProductsCategoryEnum.NotebooksAndPC,
        subCategories: [
            { category: ProductsSubCategoryEnum.NOTEBOOKS, filter: NotebooksCharacteristics },
            { category: ProductsSubCategoryEnum.PC, filter: PCCharacteristics },
            { category: ProductsSubCategoryEnum.MONITORS, filter: MonitorsCharacteristics },
            { category: ProductsSubCategoryEnum.SCANNERS, filter: ScannersCharacteristics },
            { category: ProductsSubCategoryEnum.PRINTERS, filter: PrintersMfuCharacteristics },
        ],
    },
    {
        category: ProductsCategoryEnum.Gaming,
        subCategories: [
            { category: ProductsSubCategoryEnum.CONSOLES, filter: ConsolesCharacteristics },
            { category: ProductsSubCategoryEnum.GAMES, filter: GamesCharacteristics },
        ],
    },
    {
        category: ProductsCategoryEnum.Phone,
        subCategories: [
            { category: ProductsSubCategoryEnum.TABLETS, filter: TabletsCharacteristics },
            { category: ProductsSubCategoryEnum.SMARTPHONES, filter: SmartphonesCharacteristics },
        ],
    },
    {
        category: ProductsCategoryEnum.TV,
        subCategories: [
            { category: ProductsSubCategoryEnum.TV, filter: TVCharacteristics },
            { category: ProductsSubCategoryEnum.VIDEOS, filter: VideosCharacteristics },
        ],
    },
    {
        category: ProductsCategoryEnum.HouseholdAppliances,
        subCategories: [
            { category: ProductsSubCategoryEnum.REFRIGERATORS, filter: RefrigeratorsCharacteristics },
            { category: ProductsSubCategoryEnum.WASHING_MACHINES, filter: WashingMachinesCharacteristics },
            { category: ProductsSubCategoryEnum.COOKERS, filter: CookersCharacteristics },
        ],
    },
    {
        category: ProductsCategoryEnum.Instrument,
        subCategories: [
            { category: ProductsSubCategoryEnum.DRILLS, filter: DrillsCharacteristics },
            { category: ProductsSubCategoryEnum.SAWS, filter: SawsCharacteristics },
        ],
    },
    {
        category: ProductsCategoryEnum.Accessories,
        subCategories: [
            { category: ProductsSubCategoryEnum.MOUSES, filter: MousesCharacteristics },
            { category: ProductsSubCategoryEnum.KEYBOARDS, filter: KeyboardsCharacteristics },
            { category: ProductsSubCategoryEnum.HEADPHONES, filter: HeadphonesCharacteristics },
        ],
    },
];
