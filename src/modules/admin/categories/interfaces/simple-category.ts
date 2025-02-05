// export interface ISimpleCategory {
//     id: number;
//     name: string;
//     description: string;
//     createdAt: Date;
//     updatedAt: Date;
// }
interface subParent {
    parent: {
        id: string;
        name: string
    }
}
export interface ISimpleCategory {
    id: string;
    name: string;
    description: string;
    slug: string;
    imageUrl: null | string;
    parentId: null | string;
    createdAt: Date;
    updatedAt: Date;
    parents: subParent[];
    products?: any[];
}
