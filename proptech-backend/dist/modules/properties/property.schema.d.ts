import { z } from "zod";
export declare const createPropertySchema: z.ZodObject<{
    name: z.ZodString;
    address: z.ZodString;
    units: z.ZodNumber;
    managerId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    address: string;
    units: number;
    managerId: string;
}, {
    name: string;
    address: string;
    units: number;
    managerId: string;
}>;
export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
//# sourceMappingURL=property.schema.d.ts.map