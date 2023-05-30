export enum ProductsCategoryEnum {
    Other = 'other',
    NotebooksAndPC = 'notebooks_and_pc',
    Gaming = 'gaming',
    TVs = 'tvs',
    Phone = 'phone',
    HouseholdAppliances = 'Household_appliances',
    Instrument = 'instrument',
    Accessories = 'accessories',
}

export enum ProductsSubCategoryEnum {
    OTHER = 'other',
    MONITORS = 'monitors',
    NOTEBOOKS = 'notebooks',
    PC = 'pc',
    TABLETS = 'tablets',
    SMARTPHONES = 'smartphones',
    SCANNERS = 'scanners',
    PRINTERS = 'printers-mfu',
    CONSOLES = 'consoles',
    GAMES = 'games',
    MOUSES = 'mouses',
    KEYBOARDS = 'keyboards',
    TV = 'tv',
    VIDEOS = 'videos',
    REFRIGERATORS = 'refrigerators',
    WASHING_MACHINES = 'washing-machines',
    COOKERS = 'cookers',
    DRILLS = 'drills',
    SAWS = 'saws',
    HEADPHONES = 'headphones',
}

export enum EProductsProps {
    code = 'code',
    name = 'name',
    category = 'category',
    sub_category = 'sub_category',
    unit = 'unit',
    quantity = 'quantity',
    availability = 'availability',
    info = 'info',
    description = 'description',
    tags = 'tags',
    photos = 'photos',
    date_created = 'date_created',
    rating = 'rating',
    reviews = 'reviews',
    characteristics = 'characteristics',
}

export enum ECharacteristics {
    weight = 'weight',
    weight_unit = 'weight_unit',
    color = 'color',
    material = 'material',
    size = 'size',
    brand = 'brand',
    price = 'price',
    year = 'year',
    additional_characteristic = 'additional_characteristic',
    screen_diagonal = 'screen_diagonal',
    type_screen = 'type_screen',
    refresh_rate = 'refresh_rate',
    resolution = 'resolution',
    cpu = 'cpu',
    amount_ram = 'amount_ram',
    type_ram = 'type_ram',
    type_memory = 'type_memory',
    volume_memory = 'volume_memory',
    videocard = 'videocard',
    wifi = 'wifi',
    bluetooth = 'bluetooth',
    main_camera = 'main_camera',
    front_camera = 'front_camera',
    type_device = 'type_device',
    format = 'format',
    network_interfaces = 'network_interfaces',
    type_console = 'type_console',
}

export enum ENumberTypesFilter {
    weight = ECharacteristics.weight,
    price = ECharacteristics.price,
    year = ECharacteristics.year,
    screen_diagonal = ECharacteristics.screen_diagonal,
    refresh_rate = ECharacteristics.refresh_rate,
    resolution = ECharacteristics.resolution,
    amount_ram = ECharacteristics.amount_ram,
    volume_memory = ECharacteristics.volume_memory,
    quantity = EProductsProps.quantity,
}

export enum EBooleanTypesFilter {
    availability = EProductsProps.availability,
}

export enum EUnitWeight {
    Kilogram = 'kg',
    Gram = 'gram',
    Ton = 'ton',
    Pound = 'pound',
    Pood = 'pood',
    Other = 'other',
}

export enum EUnit {
    Watt = 'W',
    Joule = 'J',
    Newton = 'N',
    Hertz = 'Hz',
    Metre = 'm',
    Ampere = 'a',
    Second = 's',
    Hour = 'hour',
    Minute = 'min',
    Litre = 'L',
    NotDefined = 'n-a',
}

export enum EColor {
    White = 'white',
    Black = 'black',
    Gold = 'gold',
    Red = 'red',
    Green = 'green',
    Blue = 'blue',
    Grey = 'grey',
    Yellow = 'yellow',
    Ping = 'pink',
    Silver = 'silver',
    Brown = 'brown',
    Violet = 'violet',
    Orange = 'orange',
    Other = 'other',
}