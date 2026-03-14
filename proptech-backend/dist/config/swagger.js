import swaggerJsdoc from "swagger-jsdoc";
export const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "PropTech Maintenance API",
            version: "1.0.0",
            description: "API documentation for property maintenance system",
        },
        servers: [
            {
                url: "http://localhost:5000",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        //  ADD THIS PART
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["src/modules/**/*.ts"],
});
//# sourceMappingURL=swagger.js.map