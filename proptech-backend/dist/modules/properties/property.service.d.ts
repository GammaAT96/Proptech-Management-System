import type { CreatePropertyInput } from "./property.schema.js";
export declare const createProperty: (input: CreatePropertyInput) => Promise<{
    name: string;
    id: string;
    createdAt: Date;
    address: string;
    units: number;
    managerId: string;
}>;
export declare const getProperties: () => Promise<{
    name: string;
    id: string;
    createdAt: Date;
    address: string;
    units: number;
    managerId: string;
}[]>;
export declare const getPropertyById: (id: string) => Promise<{
    name: string;
    id: string;
    createdAt: Date;
    address: string;
    units: number;
    managerId: string;
} | null>;
//# sourceMappingURL=property.service.d.ts.map