import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

function parseMysqlUrl(url: string): {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
} {
  const u = new URL(url);
  return {
    host: u.hostname,
    port: u.port ? Number(u.port) : 3306,
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.replace(/^\//, ""),
  };
}

const env = process.env;
const fromUrl = env.DATABASE_URL?.trim() ? parseMysqlUrl(env.DATABASE_URL.trim()) : null;

const poolConfig = {
  host: fromUrl?.host ?? env.DB_HOST ?? "localhost",
  port: fromUrl?.port ?? (env.DB_PORT ? Number(env.DB_PORT) : 3306),
  user: fromUrl?.user ?? env.DB_USER ?? "root",
  password: fromUrl?.password ?? env.DB_PASSWORD ?? "",
  database: fromUrl?.database ?? env.DB_NAME ?? "proptech_db",
  connectionLimit: env.DB_CONNECTION_LIMIT ? Number(env.DB_CONNECTION_LIMIT) : 10,
};

const adapter = new PrismaMariaDb(poolConfig);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}