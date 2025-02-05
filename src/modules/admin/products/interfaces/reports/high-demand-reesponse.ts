export interface IHighDemand {
    reportName: string;
    products:   IHighDemandProduct[];
}

export interface IHighDemandProduct {
    id:           string;
    name:         string;
    stock:        string;
    lastSaleDate: Date;
}
