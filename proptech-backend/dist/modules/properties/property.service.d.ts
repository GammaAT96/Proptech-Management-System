import type { CreatePropertyInput } from "./property.schema.js";
export declare const createProperty: (input: CreatePropertyInput) => Promise<{
    name: string;
    id: string;
    createdAt: Date;
    address: string;
    managerId: string;
    units: number;
}>;
export declare const getProperties: (managerId?: string) => Promise<{
    name: string;
    id: string;
    createdAt: Date;
    address: string;
    managerId: string;
    units: number;
}[]>;
export declare const getPropertyById: (id: string) => Promise<{
    name: string;
    id: string;
    createdAt: Date;
    address: string;
    managerId: string;
    units: number;
} | null>;
//# sourceMappingURL=property.service.d.ts.map