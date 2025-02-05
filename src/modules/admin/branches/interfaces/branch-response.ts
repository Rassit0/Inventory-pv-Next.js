export interface IBranchResponse {
    branches: IBranch[];
}

export interface IBranch {
    id:         string;
    name:       string;
    location:   string;
    phone?:     string | null;
    email?:     string | null;
    managerId?:    string | null;
    latitude?:  number | null;
    longitude?: number | null;
    imageUrl?:  string | null;
    isEnable:   boolean;
    createdaAt: Date;
    updatedAt:  Date;
}
