export interface IResponseParallelGroups {
    parallelGroups: IParallelGroup[];
}

export interface IParallelGroup {
    id:        string;
    name:      string;
    createdAt: Date;
    updatedAt: Date;
}
