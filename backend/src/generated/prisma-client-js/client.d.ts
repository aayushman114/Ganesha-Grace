import * as runtime from "@prisma/client/runtime/client";
import * as $Class from "./internal/class.js";
import * as Prisma from "./internal/prismaNamespace.js";
export * as $Enums from './enums.js';
export * from "./enums.js";
/**
 * ## Prisma Client
 *
 * Type-safe database client for TypeScript
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Brands
 * const brands = await prisma.brand.findMany()
 * ```
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export declare const PrismaClient: $Class.PrismaClientConstructor;
export type PrismaClient<LogOpts extends Prisma.LogLevel = never, OmitOpts extends Prisma.PrismaClientOptions["omit"] = Prisma.PrismaClientOptions["omit"], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = $Class.PrismaClient<LogOpts, OmitOpts, ExtArgs>;
export { Prisma };
/**
 * Model brand
 *
 */
export type brand = Prisma.brandModel;
/**
 * Model category
 *
 */
export type category = Prisma.categoryModel;
/**
 * Model order
 *
 */
export type order = Prisma.orderModel;
/**
 * Model orderitem
 *
 */
export type orderitem = Prisma.orderitemModel;
/**
 * Model product
 *
 */
export type product = Prisma.productModel;
/**
 * Model session
 *
 */
export type session = Prisma.sessionModel;
/**
 * Model user
 *
 */
export type user = Prisma.userModel;
/**
 * Model heroBanner
 *
 */
export type heroBanner = Prisma.heroBannerModel;
//# sourceMappingURL=client.d.ts.map