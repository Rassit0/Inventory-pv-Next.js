export interface IOutOfStock {
    reportName: string;
    products:   Product[];
}

export interface Product {
    id:    string;
    name:  string;
    stock: string;
    unit:  Unit;
}

export interface Unit {
    name:         Name;
    abbreviation: Abbreviation;
}

export enum Abbreviation {
    G = "g.",
    U = "u.",
}

export enum Name {
    Gramoss = "Gramoss",
    Unidad = "Unidad",
}
