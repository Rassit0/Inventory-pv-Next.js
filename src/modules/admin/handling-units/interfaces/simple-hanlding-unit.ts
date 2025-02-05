export interface ISimpleHandlingUnit {
    id:           string;
    name:         string;
    abbreviation: string;
    createdAt:    Date;
    updatedAt:    Date;
    products:     Product[];
}

export interface Product {
    id:             string;
    name:           string;
    description:    string;
    slug:           string;
    type:           string;
    price:          string;
    stock:          string;
    imageUrl:       null;
    lastSaleDate:   null;
    launchDate:     null;
    expirationDate: null;
    isEnable:       boolean;
    unitId:         string;
    purchasePrice:  string;
    minimumStock:   string;
    reorderPoint:   string;
    stockLocation:  string;
    seasonId:       null;
    createdAt:      Date;
    updatedAt:      Date;
}
