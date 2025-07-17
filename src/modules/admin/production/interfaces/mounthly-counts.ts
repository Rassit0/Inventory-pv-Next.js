export interface IMonthlyOrdersCounts {
    Enero: IMonthlyOrderCount;
    Febrero: IMonthlyOrderCount;
    Marzo: IMonthlyOrderCount;
    Abril: IMonthlyOrderCount;
    Mayo: IMonthlyOrderCount;
    Junio: IMonthlyOrderCount;
    Julio: IMonthlyOrderCount;
    Agosto: IMonthlyOrderCount;
    Septiembre: IMonthlyOrderCount;
    Octubre: IMonthlyOrderCount;
    Noviembre: IMonthlyOrderCount;
    Diciembre: IMonthlyOrderCount;
}

export interface IMonthlyOrderCount {
    PENDING:     number;
    IN_PROGRESS: number;
    COMPLETED:   number;
    CANCELED:    number;
}
