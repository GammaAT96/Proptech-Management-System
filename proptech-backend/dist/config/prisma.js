import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import * as mariadb from "mariadb";
const poolConfig = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Anant@5113",
    database: "proptech_db",
    connectionLimit: 10,
};
const adapter = new PrismaMariaDb(poolConfig);
const globalForPrisma = globalThis;
export const prisma = globalForPrisma.prisma ??
    new PrismaClient({
        adapter,
    });
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
//# sourceMappingURL=prisma.js.map