import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly brand: 'brand';
    readonly category: 'category';
    readonly order: 'order';
    readonly orderitem: 'orderitem';
    readonly product: 'product';
    readonly session: 'session';
    readonly user: 'user';
    readonly heroBanner: 'heroBanner';
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: 'ReadUncommitted';
    readonly ReadCommitted: 'ReadCommitted';
    readonly RepeatableRead: 'RepeatableRead';
    readonly Serializable: 'Serializable';
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const BrandScalarFieldEnum: {
    readonly id: 'id';
    readonly name: 'name';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type BrandScalarFieldEnum = (typeof BrandScalarFieldEnum)[keyof typeof BrandScalarFieldEnum];
export declare const CategoryScalarFieldEnum: {
    readonly id: 'id';
    readonly name: 'name';
    readonly slug: 'slug';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
    readonly parentId: 'parentId';
};
export type CategoryScalarFieldEnum = (typeof CategoryScalarFieldEnum)[keyof typeof CategoryScalarFieldEnum];
export declare const OrderScalarFieldEnum: {
    readonly id: 'id';
    readonly orderNumber: 'orderNumber';
    readonly customerName: 'customerName';
    readonly email: 'email';
    readonly phone: 'phone';
    readonly address: 'address';
    readonly city: 'city';
    readonly postalCode: 'postalCode';
    readonly subtotal: 'subtotal';
    readonly deliveryCharge: 'deliveryCharge';
    readonly total: 'total';
    readonly paymentMethod: 'paymentMethod';
    readonly paymentStatus: 'paymentStatus';
    readonly status: 'status';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
    readonly userId: 'userId';
    readonly idempotencyKey: 'idempotencyKey';
    readonly idempotencyRequestHash: 'idempotencyRequestHash';
};
export type OrderScalarFieldEnum = (typeof OrderScalarFieldEnum)[keyof typeof OrderScalarFieldEnum];
export declare const OrderitemScalarFieldEnum: {
    readonly id: 'id';
    readonly orderId: 'orderId';
    readonly productId: 'productId';
    readonly productName: 'productName';
    readonly unitPrice: 'unitPrice';
    readonly quantity: 'quantity';
    readonly lineTotal: 'lineTotal';
    readonly createdAt: 'createdAt';
};
export type OrderitemScalarFieldEnum = (typeof OrderitemScalarFieldEnum)[keyof typeof OrderitemScalarFieldEnum];
export declare const ProductScalarFieldEnum: {
    readonly id: 'id';
    readonly name: 'name';
    readonly description: 'description';
    readonly price: 'price';
    readonly rating: 'rating';
    readonly imageUrl: 'imageUrl';
    readonly stock: 'stock';
    readonly isActive: 'isActive';
    readonly categoryId: 'categoryId';
    readonly brandId: 'brandId';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
    readonly featured: 'featured';
    readonly onSale: 'onSale';
    readonly originalPrice: 'originalPrice';
};
export type ProductScalarFieldEnum = (typeof ProductScalarFieldEnum)[keyof typeof ProductScalarFieldEnum];
export declare const SessionScalarFieldEnum: {
    readonly id: 'id';
    readonly userId: 'userId';
    readonly tokenHash: 'tokenHash';
    readonly expiresAt: 'expiresAt';
    readonly createdAt: 'createdAt';
};
export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum];
export declare const UserScalarFieldEnum: {
    readonly id: 'id';
    readonly name: 'name';
    readonly email: 'email';
    readonly passwordHash: 'passwordHash';
    readonly role: 'role';
    readonly isActive: 'isActive';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const HeroBannerScalarFieldEnum: {
    readonly id: 'id';
    readonly title: 'title';
    readonly subtitle: 'subtitle';
    readonly imageUrl: 'imageUrl';
    readonly link: 'link';
    readonly sortOrder: 'sortOrder';
    readonly isActive: 'isActive';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type HeroBannerScalarFieldEnum = (typeof HeroBannerScalarFieldEnum)[keyof typeof HeroBannerScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: 'asc';
    readonly desc: 'desc';
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const brandOrderByRelevanceFieldEnum: {
    readonly name: 'name';
};
export type brandOrderByRelevanceFieldEnum = (typeof brandOrderByRelevanceFieldEnum)[keyof typeof brandOrderByRelevanceFieldEnum];
export declare const NullsOrder: {
    readonly first: 'first';
    readonly last: 'last';
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export declare const categoryOrderByRelevanceFieldEnum: {
    readonly name: 'name';
    readonly slug: 'slug';
};
export type categoryOrderByRelevanceFieldEnum = (typeof categoryOrderByRelevanceFieldEnum)[keyof typeof categoryOrderByRelevanceFieldEnum];
export declare const orderOrderByRelevanceFieldEnum: {
    readonly orderNumber: 'orderNumber';
    readonly customerName: 'customerName';
    readonly email: 'email';
    readonly phone: 'phone';
    readonly address: 'address';
    readonly city: 'city';
    readonly postalCode: 'postalCode';
    readonly paymentMethod: 'paymentMethod';
    readonly paymentStatus: 'paymentStatus';
    readonly status: 'status';
    readonly idempotencyKey: 'idempotencyKey';
    readonly idempotencyRequestHash: 'idempotencyRequestHash';
};
export type orderOrderByRelevanceFieldEnum = (typeof orderOrderByRelevanceFieldEnum)[keyof typeof orderOrderByRelevanceFieldEnum];
export declare const orderitemOrderByRelevanceFieldEnum: {
    readonly productName: 'productName';
};
export type orderitemOrderByRelevanceFieldEnum = (typeof orderitemOrderByRelevanceFieldEnum)[keyof typeof orderitemOrderByRelevanceFieldEnum];
export declare const productOrderByRelevanceFieldEnum: {
    readonly name: 'name';
    readonly description: 'description';
    readonly imageUrl: 'imageUrl';
};
export type productOrderByRelevanceFieldEnum = (typeof productOrderByRelevanceFieldEnum)[keyof typeof productOrderByRelevanceFieldEnum];
export declare const sessionOrderByRelevanceFieldEnum: {
    readonly tokenHash: 'tokenHash';
};
export type sessionOrderByRelevanceFieldEnum = (typeof sessionOrderByRelevanceFieldEnum)[keyof typeof sessionOrderByRelevanceFieldEnum];
export declare const userOrderByRelevanceFieldEnum: {
    readonly name: 'name';
    readonly email: 'email';
    readonly passwordHash: 'passwordHash';
    readonly role: 'role';
};
export type userOrderByRelevanceFieldEnum = (typeof userOrderByRelevanceFieldEnum)[keyof typeof userOrderByRelevanceFieldEnum];
export declare const heroBannerOrderByRelevanceFieldEnum: {
    readonly title: 'title';
    readonly subtitle: 'subtitle';
    readonly imageUrl: 'imageUrl';
    readonly link: 'link';
};
export type heroBannerOrderByRelevanceFieldEnum = (typeof heroBannerOrderByRelevanceFieldEnum)[keyof typeof heroBannerOrderByRelevanceFieldEnum];
//# sourceMappingURL=prismaNamespaceBrowser.d.ts.map