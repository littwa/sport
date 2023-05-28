import { ECharacteristics, ProductsCategoryEnum, ProductsSubCategoryEnum } from '../enums/products.enum';

// export const PRODUCT_UPDATE_KEYS = [
//     'name',
//     'category',
//     'sub_category',
//     'unit',
//     'quantity',
//     'availability',
//     'info',
//     'description',
//     'tags',
//     'characteristics',
//     'photos',
//     'weight',
//     'weight_unit',
//     'brand',
//     'year',
// ];

export const BRANDS = [
    { name: 'samsung', link: '' },
    { name: 'sony', link: '' },
    { name: 'lg', link: '' },
    { name: 'panasonic', link: '' },
    { name: 'jbl', link: '' },
    { name: 'acer', link: '' },
    { name: 'lenovo', link: '' },
    { name: 'asus', link: '' },
    { name: 'hp', link: '' },
    { name: 'dell', link: '' },
    { name: 'siemens', link: '' },
    { name: 'toshiba', link: '' },
    { name: 'other', link: '' },
];

export const BaseCharacteristics = [
    ECharacteristics.weight,
    ECharacteristics.weight_unit,
    ECharacteristics.size,
    ECharacteristics.brand,
    ECharacteristics.price,
    ECharacteristics.color,
    ECharacteristics.material,
    ECharacteristics.additional_characteristic,
    ECharacteristics.year,
];

export const MonitorsCharacteristics = [
    ECharacteristics.screen_diagonal,
    ECharacteristics.type_screen,
    ECharacteristics.refresh_rate,
    ECharacteristics.resolution,
];

export const PCCharacteristics = [
    ECharacteristics.cpu,
    ECharacteristics.amount_ram,
    ECharacteristics.type_ram,
    ECharacteristics.volume_memory,
    ECharacteristics.type_memory,
    ECharacteristics.videocard,
];

export const NotebooksCharacteristics = [
    ECharacteristics.screen_diagonal,
    ECharacteristics.type_screen,
    ECharacteristics.refresh_rate,
    ECharacteristics.resolution,
    ECharacteristics.cpu,
    ECharacteristics.amount_ram,
    ECharacteristics.type_ram,
    ECharacteristics.volume_memory,
    ECharacteristics.type_memory,
    ECharacteristics.videocard,
];

export const TabletsCharacteristics = [
    ECharacteristics.screen_diagonal,
    ECharacteristics.type_screen,
    ECharacteristics.refresh_rate,
    ECharacteristics.resolution,
    ECharacteristics.cpu,
    ECharacteristics.amount_ram,
    ECharacteristics.type_ram,
    ECharacteristics.volume_memory,
    ECharacteristics.type_memory,
    ECharacteristics.wifi,
    ECharacteristics.bluetooth,
    ECharacteristics.main_camera,
    ECharacteristics.front_camera,
];

export const SmartphonesCharacteristics = [
    ECharacteristics.screen_diagonal,
    ECharacteristics.type_screen,
    ECharacteristics.refresh_rate,
    ECharacteristics.resolution,
    ECharacteristics.cpu,
    ECharacteristics.amount_ram,
    ECharacteristics.type_ram,
    ECharacteristics.volume_memory,
    ECharacteristics.type_memory,
    ECharacteristics.wifi,
    ECharacteristics.bluetooth,
    ECharacteristics.main_camera,
    ECharacteristics.front_camera,
];

export const PrintersMfuCharacteristics = [
    ECharacteristics.type_device,
    ECharacteristics.format,
    ECharacteristics.network_interfaces,
];

export const ScannersCharacteristics = [
    ECharacteristics.type_device,
    ECharacteristics.format,
    ECharacteristics.network_interfaces,
];

export const ConsolesCharacteristics = [
    ECharacteristics.type_console,
    ECharacteristics.cpu,
    ECharacteristics.amount_ram,
    ECharacteristics.type_ram,
    ECharacteristics.volume_memory,
    ECharacteristics.type_memory,
    ECharacteristics.videocard,
    ECharacteristics.network_interfaces,
];

export const GamesCharacteristics = [ECharacteristics.type_console];

export const TVCharacteristics = [
    ECharacteristics.screen_diagonal,
    ECharacteristics.type_screen,
    ECharacteristics.refresh_rate,
    ECharacteristics.resolution,
    ECharacteristics.cpu,
    ECharacteristics.wifi,
    ECharacteristics.bluetooth,
    ECharacteristics.front_camera,
];

export const VideosCharacteristics = [
    ECharacteristics.cpu,
    ECharacteristics.wifi,
    ECharacteristics.bluetooth,
    ECharacteristics.main_camera,
    ECharacteristics.front_camera,
];

export const MousesCharacteristics = [];

export const KeyboardsCharacteristics = [];

export const RefrigeratorsCharacteristics = [];

export const WashingMachinesCharacteristics = [];

export const CookersCharacteristics = [];

export const DrillsCharacteristics = [];

export const SawsCharacteristics = [];

export const HeadphonesCharacteristics = [];

export const CATEGORY_PRODUCTS = [
    {
        category: ProductsCategoryEnum.Other,
        subCategories: [{ category: ProductsSubCategoryEnum.OTHER, filter: [] }],
    },
    {
        category: ProductsCategoryEnum.NotebooksAndPC,
        subCategories: [
            { category: ProductsSubCategoryEnum.OTHER, filter: [] },
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
            { category: ProductsSubCategoryEnum.OTHER, filter: [] },
            { category: ProductsSubCategoryEnum.CONSOLES, filter: ConsolesCharacteristics },
            { category: ProductsSubCategoryEnum.GAMES, filter: GamesCharacteristics },
        ],
    },
    {
        category: ProductsCategoryEnum.Phone,
        subCategories: [
            { category: ProductsSubCategoryEnum.OTHER, filter: [] },
            { category: ProductsSubCategoryEnum.TABLETS, filter: TabletsCharacteristics },
            { category: ProductsSubCategoryEnum.SMARTPHONES, filter: SmartphonesCharacteristics },
        ],
    },
    {
        category: ProductsCategoryEnum.TVs,
        subCategories: [
            { category: ProductsSubCategoryEnum.OTHER, filter: [] },
            { category: ProductsSubCategoryEnum.TV, filter: TVCharacteristics },
            { category: ProductsSubCategoryEnum.VIDEOS, filter: VideosCharacteristics },
        ],
    },
    {
        category: ProductsCategoryEnum.HouseholdAppliances,
        subCategories: [
            { category: ProductsSubCategoryEnum.OTHER, filter: [] },
            { category: ProductsSubCategoryEnum.REFRIGERATORS, filter: RefrigeratorsCharacteristics },
            { category: ProductsSubCategoryEnum.WASHING_MACHINES, filter: WashingMachinesCharacteristics },
            { category: ProductsSubCategoryEnum.COOKERS, filter: CookersCharacteristics },
        ],
    },
    {
        category: ProductsCategoryEnum.Instrument,
        subCategories: [
            { category: ProductsSubCategoryEnum.OTHER, filter: [] },
            { category: ProductsSubCategoryEnum.DRILLS, filter: DrillsCharacteristics },
            { category: ProductsSubCategoryEnum.SAWS, filter: SawsCharacteristics },
        ],
    },
    {
        category: ProductsCategoryEnum.Accessories,
        subCategories: [
            { category: ProductsSubCategoryEnum.OTHER, filter: [] },
            { category: ProductsSubCategoryEnum.MOUSES, filter: MousesCharacteristics },
            { category: ProductsSubCategoryEnum.KEYBOARDS, filter: KeyboardsCharacteristics },
            { category: ProductsSubCategoryEnum.HEADPHONES, filter: HeadphonesCharacteristics },
        ],
    },
];
