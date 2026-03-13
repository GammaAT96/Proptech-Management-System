// Ensures Prisma uses the standard Node engine by default.
// Some environments set PRISMA_CLIENT_ENGINE_TYPE=client, which requires an adapter/Accelerate.
if (process.env.PRISMA_CLIENT_ENGINE_TYPE === "client") {
    process.env.PRISMA_CLIENT_ENGINE_TYPE = "library";
}
export {};
//# sourceMappingURL=prismaEnv.js.map