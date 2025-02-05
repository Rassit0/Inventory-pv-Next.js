import { ISimpleCategory } from "./simple-category";

export interface IUpdateCategoryResponse {
    message: string;
    category: ISimpleCategory;
}