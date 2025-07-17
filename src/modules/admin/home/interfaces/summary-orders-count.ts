export interface ISummaryCounts {
    productionsCount:  IProductionsCount;
    recipesCount:      number;
    branchesCount:     number;
    wasteReportsCount: number;
}

export interface IProductionsCount {
    totalItems: number;
}
