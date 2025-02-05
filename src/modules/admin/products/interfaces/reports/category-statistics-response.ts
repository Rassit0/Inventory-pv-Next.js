export interface ICategoryStatisticsResponse {
    reportName: string;
    statistics: ICategoryStatistics[];
}

export interface ICategoryStatistics {
    imageUrl:      null | string;
    categoryName:  string;
    totalProducts: number;
    totalStock:    number;
}
