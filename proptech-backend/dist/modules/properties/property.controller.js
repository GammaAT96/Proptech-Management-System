import { createProperty, getProperties, getPropertyById, } from "./property.service.js";
import { createPropertySchema } from "./property.schema.js";
export const createPropertyHandler = async (req, res) => {
    const parsed = createPropertySchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            error: "VALIDATION_ERROR",
            details: parsed.error.flatten(),
        });
    }
    const property = await createProperty(parsed.data);
    res.status(201).json(property);
};
export const listPropertiesHandler = async (_req, res) => {
    const properties = await getProperties();
    res.json(properties);
};
export const getPropertyHandler = async (req, res) => {
    const property = await getPropertyById(req.params.id);
    if (!property) {
        return res.status(404).json({ error: "PROPERTY_NOT_FOUND" });
    }
    res.json(property);
};
//# sourceMappingURL=property.controller.js.map