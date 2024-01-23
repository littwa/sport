export interface ICodeGetQuery {
    description?: string;
    type?: string;
    tags?: string[];
    page_size?: number;
    current_page?: number;
}

export interface IGetCodeTypeParams {
    name?: string;
}

export interface IGetCodeTagsParams extends IGetCodeTypeParams {
}
