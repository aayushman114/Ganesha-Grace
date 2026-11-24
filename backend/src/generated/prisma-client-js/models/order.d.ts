import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model order
 *
 */
export type orderModel = runtime.Types.Result.DefaultSelection<Prisma.$orderPayload>;
export type AggregateOrder = {
    _count: OrderCountAggregateOutputType | null;
    _avg: OrderAvgAggregateOutputType | null;
    _sum: OrderSumAggregateOutputType | null;
    _min: OrderMinAggregateOutputType | null;
    _max: OrderMaxAggregateOutputType | null;
};
export type OrderAvgAggregateOutputType = {
    id: number | null;
    subtotal: runtime.Decimal | null;
    deliveryCharge: runtime.Decimal | null;
    total: runtime.Decimal | null;
    userId: number | null;
};
export type OrderSumAggregateOutputType = {
    id: number | null;
    subtotal: runtime.Decimal | null;
    deliveryCharge: runtime.Decimal | null;
    total: runtime.Decimal | null;
    userId: number | null;
};
export type OrderMinAggregateOutputType = {
    id: number | null;
    orderNumber: string | null;
    customerName: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    postalCode: string | null;
    subtotal: runtime.Decimal | null;
    deliveryCharge: runtime.Decimal | null;
    total: runtime.Decimal | null;
    paymentMethod: string | null;
    paymentStatus: string | null;
    status: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    userId: number | null;
    idempotencyKey: string | null;
    idempotencyRequestHash: string | null;
};
export type OrderMaxAggregateOutputType = {
    id: number | null;
    orderNumber: string | null;
    customerName: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    postalCode: string | null;
    subtotal: runtime.Decimal | null;
    deliveryCharge: runtime.Decimal | null;
    total: runtime.Decimal | null;
    paymentMethod: string | null;
    paymentStatus: string | null;
    status: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    userId: number | null;
    idempotencyKey: string | null;
    idempotencyRequestHash: string | null;
};
export type OrderCountAggregateOutputType = {
    id: number;
    orderNumber: number;
    customerName: number;
    email: number;
    phone: number;
    address: number;
    city: number;
    postalCode: number;
    subtotal: number;
    deliveryCharge: number;
    total: number;
    paymentMethod: number;
    paymentStatus: number;
    status: number;
    createdAt: number;
    updatedAt: number;
    userId: number;
    idempotencyKey: number;
    idempotencyRequestHash: number;
    _all: number;
};
export type OrderAvgAggregateInputType = {
    id?: true;
    subtotal?: true;
    deliveryCharge?: true;
    total?: true;
    userId?: true;
};
export type OrderSumAggregateInputType = {
    id?: true;
    subtotal?: true;
    deliveryCharge?: true;
    total?: true;
    userId?: true;
};
export type OrderMinAggregateInputType = {
    id?: true;
    orderNumber?: true;
    customerName?: true;
    email?: true;
    phone?: true;
    address?: true;
    city?: true;
    postalCode?: true;
    subtotal?: true;
    deliveryCharge?: true;
    total?: true;
    paymentMethod?: true;
    paymentStatus?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
    userId?: true;
    idempotencyKey?: true;
    idempotencyRequestHash?: true;
};
export type OrderMaxAggregateInputType = {
    id?: true;
    orderNumber?: true;
    customerName?: true;
    email?: true;
    phone?: true;
    address?: true;
    city?: true;
    postalCode?: true;
    subtotal?: true;
    deliveryCharge?: true;
    total?: true;
    paymentMethod?: true;
    paymentStatus?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
    userId?: true;
    idempotencyKey?: true;
    idempotencyRequestHash?: true;
};
export type OrderCountAggregateInputType = {
    id?: true;
    orderNumber?: true;
    customerName?: true;
    email?: true;
    phone?: true;
    address?: true;
    city?: true;
    postalCode?: true;
    subtotal?: true;
    deliveryCharge?: true;
    total?: true;
    paymentMethod?: true;
    paymentStatus?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
    userId?: true;
    idempotencyKey?: true;
    idempotencyRequestHash?: true;
    _all?: true;
};
export type OrderAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which order to aggregate.
     */
    where?: Prisma.orderWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of orders to fetch.
     */
    orderBy?: Prisma.orderOrderByWithRelationInput | Prisma.orderOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.orderWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` orders from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` orders.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned orders
    **/
    _count?: true | OrderCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: OrderAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: OrderSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: OrderMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: OrderMaxAggregateInputType;
};
export type GetOrderAggregateType<T extends OrderAggregateArgs> = {
    [P in keyof T & keyof AggregateOrder]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateOrder[P]> : Prisma.GetScalarType<T[P], AggregateOrder[P]>;
};
export type orderGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.orderWhereInput;
    orderBy?: Prisma.orderOrderByWithAggregationInput | Prisma.orderOrderByWithAggregationInput[];
    by: Prisma.OrderScalarFieldEnum[] | Prisma.OrderScalarFieldEnum;
    having?: Prisma.orderScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: OrderCountAggregateInputType | true;
    _avg?: OrderAvgAggregateInputType;
    _sum?: OrderSumAggregateInputType;
    _min?: OrderMinAggregateInputType;
    _max?: OrderMaxAggregateInputType;
};
export type OrderGroupByOutputType = {
    id: number;
    orderNumber: string;
    customerName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string | null;
    subtotal: runtime.Decimal;
    deliveryCharge: runtime.Decimal;
    total: runtime.Decimal;
    paymentMethod: string;
    paymentStatus: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    userId: number | null;
    idempotencyKey: string | null;
    idempotencyRequestHash: string | null;
    _count: OrderCountAggregateOutputType | null;
    _avg: OrderAvgAggregateOutputType | null;
    _sum: OrderSumAggregateOutputType | null;
    _min: OrderMinAggregateOutputType | null;
    _max: OrderMaxAggregateOutputType | null;
};
export type GetOrderGroupByPayload<T extends orderGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<OrderGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof OrderGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], OrderGroupByOutputType[P]> : Prisma.GetScalarType<T[P], OrderGroupByOutputType[P]>;
}>>;
export type orderWhereInput = {
    AND?: Prisma.orderWhereInput | Prisma.orderWhereInput[];
    OR?: Prisma.orderWhereInput[];
    NOT?: Prisma.orderWhereInput | Prisma.orderWhereInput[];
    id?: Prisma.IntFilter<"order"> | number;
    orderNumber?: Prisma.StringFilter<"order"> | string;
    customerName?: Prisma.StringFilter<"order"> | string;
    email?: Prisma.StringFilter<"order"> | string;
    phone?: Prisma.StringFilter<"order"> | string;
    address?: Prisma.StringFilter<"order"> | string;
    city?: Prisma.StringFilter<"order"> | string;
    postalCode?: Prisma.StringNullableFilter<"order"> | string | null;
    subtotal?: Prisma.DecimalFilter<"order"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    deliveryCharge?: Prisma.DecimalFilter<"order"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: Prisma.DecimalFilter<"order"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    paymentMethod?: Prisma.StringFilter<"order"> | string;
    paymentStatus?: Prisma.StringFilter<"order"> | string;
    status?: Prisma.StringFilter<"order"> | string;
    createdAt?: Prisma.DateTimeFilter<"order"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"order"> | Date | string;
    userId?: Prisma.IntNullableFilter<"order"> | number | null;
    idempotencyKey?: Prisma.StringNullableFilter<"order"> | string | null;
    idempotencyRequestHash?: Prisma.StringNullableFilter<"order"> | string | null;
    user?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.userWhereInput> | null;
    orderitem?: Prisma.OrderitemListRelationFilter;
};
export type orderOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orderNumber?: Prisma.SortOrder;
    customerName?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    city?: Prisma.SortOrder;
    postalCode?: Prisma.SortOrderInput | Prisma.SortOrder;
    subtotal?: Prisma.SortOrder;
    deliveryCharge?: Prisma.SortOrder;
    total?: Prisma.SortOrder;
    paymentMethod?: Prisma.SortOrder;
    paymentStatus?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    userId?: Prisma.SortOrderInput | Prisma.SortOrder;
    idempotencyKey?: Prisma.SortOrderInput | Prisma.SortOrder;
    idempotencyRequestHash?: Prisma.SortOrderInput | Prisma.SortOrder;
    user?: Prisma.userOrderByWithRelationInput;
    orderitem?: Prisma.orderitemOrderByRelationAggregateInput;
    _relevance?: Prisma.orderOrderByRelevanceInput;
};
export type orderWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    orderNumber?: string;
    idempotencyKey?: string;
    AND?: Prisma.orderWhereInput | Prisma.orderWhereInput[];
    OR?: Prisma.orderWhereInput[];
    NOT?: Prisma.orderWhereInput | Prisma.orderWhereInput[];
    customerName?: Prisma.StringFilter<"order"> | string;
    email?: Prisma.StringFilter<"order"> | string;
    phone?: Prisma.StringFilter<"order"> | string;
    address?: Prisma.StringFilter<"order"> | string;
    city?: Prisma.StringFilter<"order"> | string;
    postalCode?: Prisma.StringNullableFilter<"order"> | string | null;
    subtotal?: Prisma.DecimalFilter<"order"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    deliveryCharge?: Prisma.DecimalFilter<"order"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: Prisma.DecimalFilter<"order"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    paymentMethod?: Prisma.StringFilter<"order"> | string;
    paymentStatus?: Prisma.StringFilter<"order"> | string;
    status?: Prisma.StringFilter<"order"> | string;
    createdAt?: Prisma.DateTimeFilter<"order"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"order"> | Date | string;
    userId?: Prisma.IntNullableFilter<"order"> | number | null;
    idempotencyRequestHash?: Prisma.StringNullableFilter<"order"> | string | null;
    user?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.userWhereInput> | null;
    orderitem?: Prisma.OrderitemListRelationFilter;
}, "id" | "orderNumber" | "idempotencyKey">;
export type orderOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orderNumber?: Prisma.SortOrder;
    customerName?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    city?: Prisma.SortOrder;
    postalCode?: Prisma.SortOrderInput | Prisma.SortOrder;
    subtotal?: Prisma.SortOrder;
    deliveryCharge?: Prisma.SortOrder;
    total?: Prisma.SortOrder;
    paymentMethod?: Prisma.SortOrder;
    paymentStatus?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    userId?: Prisma.SortOrderInput | Prisma.SortOrder;
    idempotencyKey?: Prisma.SortOrderInput | Prisma.SortOrder;
    idempotencyRequestHash?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.orderCountOrderByAggregateInput;
    _avg?: Prisma.orderAvgOrderByAggregateInput;
    _max?: Prisma.orderMaxOrderByAggregateInput;
    _min?: Prisma.orderMinOrderByAggregateInput;
    _sum?: Prisma.orderSumOrderByAggregateInput;
};
export type orderScalarWhereWithAggregatesInput = {
    AND?: Prisma.orderScalarWhereWithAggregatesInput | Prisma.orderScalarWhereWithAggregatesInput[];
    OR?: Prisma.orderScalarWhereWithAggregatesInput[];
    NOT?: Prisma.orderScalarWhereWithAggregatesInput | Prisma.orderScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"order"> | number;
    orderNumber?: Prisma.StringWithAggregatesFilter<"order"> | string;
    customerName?: Prisma.StringWithAggregatesFilter<"order"> | string;
    email?: Prisma.StringWithAggregatesFilter<"order"> | string;
    phone?: Prisma.StringWithAggregatesFilter<"order"> | string;
    address?: Prisma.StringWithAggregatesFilter<"order"> | string;
    city?: Prisma.StringWithAggregatesFilter<"order"> | string;
    postalCode?: Prisma.StringNullableWithAggregatesFilter<"order"> | string | null;
    subtotal?: Prisma.DecimalWithAggregatesFilter<"order"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    deliveryCharge?: Prisma.DecimalWithAggregatesFilter<"order"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: Prisma.DecimalWithAggregatesFilter<"order"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    paymentMethod?: Prisma.StringWithAggregatesFilter<"order"> | string;
    paymentStatus?: Prisma.StringWithAggregatesFilter<"order"> | string;
    status?: Prisma.StringWithAggregatesFilter<"order"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"order"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"order"> | Date | string;
    userId?: Prisma.IntNullableWithAggregatesFilter<"order"> | number | null;
    idempotencyKey?: Prisma.StringNullableWithAggregatesFilter<"order"> | string | null;
    idempotencyRequestHash?: Prisma.StringNullableWithAggregatesFilter<"order"> | string | null;
};
export type orderCreateInput = {
    orderNumber: string;
    customerName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode?: string | null;
    subtotal: runtime.Decimal | runtime.DecimalJsLike | number | string;
    deliveryCharge?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    total: runtime.Decimal | runtime.DecimalJsLike | number | string;
    paymentMethod?: string;
    paymentStatus?: string;
    status?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    idempotencyKey?: string | null;
    idempotencyRequestHash?: string | null;
    user?: Prisma.userCreateNestedOneWithoutOrderInput;
    orderitem?: Prisma.orderitemCreateNestedManyWithoutOrderInput;
};
export type orderUncheckedCreateInput = {
    id?: number;
    orderNumber: string;
    customerName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode?: string | null;
    subtotal: runtime.Decimal | runtime.DecimalJsLike | number | string;
    deliveryCharge?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    total: runtime.Decimal | runtime.DecimalJsLike | number | string;
    paymentMethod?: string;
    paymentStatus?: string;
    status?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    userId?: number | null;
    idempotencyKey?: string | null;
    idempotencyRequestHash?: string | null;
    orderitem?: Prisma.orderitemUncheckedCreateNestedManyWithoutOrderInput;
};
export type orderUpdateInput = {
    orderNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    customerName?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.StringFieldUpdateOperationsInput | string;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    postalCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    deliveryCharge?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    paymentMethod?: Prisma.StringFieldUpdateOperationsInput | string;
    paymentStatus?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    idempotencyKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    idempotencyRequestHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    user?: Prisma.userUpdateOneWithoutOrderNestedInput;
    orderitem?: Prisma.orderitemUpdateManyWithoutOrderNestedInput;
};
export type orderUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    orderNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    customerName?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.StringFieldUpdateOperationsInput | string;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    postalCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    deliveryCharge?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    paymentMethod?: Prisma.StringFieldUpdateOperationsInput | string;
    paymentStatus?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    userId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    idempotencyKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    idempotencyRequestHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderitem?: Prisma.orderitemUncheckedUpdateManyWithoutOrderNestedInput;
};
export type orderCreateManyInput = {
    id?: number;
    orderNumber: string;
    customerName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode?: string | null;
    subtotal: runtime.Decimal | runtime.DecimalJsLike | number | string;
    deliveryCharge?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    total: runtime.Decimal | runtime.DecimalJsLike | number | string;
    paymentMethod?: string;
    paymentStatus?: string;
    status?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    userId?: number | null;
    idempotencyKey?: string | null;
    idempotencyRequestHash?: string | null;
};
export type orderUpdateManyMutationInput = {
    orderNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    customerName?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.StringFieldUpdateOperationsInput | string;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    postalCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    deliveryCharge?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    paymentMethod?: Prisma.StringFieldUpdateOperationsInput | string;
    paymentStatus?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    idempotencyKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    idempotencyRequestHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type orderUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    orderNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    customerName?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.StringFieldUpdateOperationsInput | string;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    postalCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    deliveryCharge?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    paymentMethod?: Prisma.StringFieldUpdateOperationsInput | string;
    paymentStatus?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    userId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    idempotencyKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    idempotencyRequestHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type orderOrderByRelevanceInput = {
    fields: Prisma.orderOrderByRelevanceFieldEnum | Prisma.orderOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type orderCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orderNumber?: Prisma.SortOrder;
    customerName?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    city?: Prisma.SortOrder;
    postalCode?: Prisma.SortOrder;
    subtotal?: Prisma.SortOrder;
    deliveryCharge?: Prisma.SortOrder;
    total?: Prisma.SortOrder;
    paymentMethod?: Prisma.SortOrder;
    paymentStatus?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    idempotencyKey?: Prisma.SortOrder;
    idempotencyRequestHash?: Prisma.SortOrder;
};
export type orderAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    subtotal?: Prisma.SortOrder;
    deliveryCharge?: Prisma.SortOrder;
    total?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
};
export type orderMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orderNumber?: Prisma.SortOrder;
    customerName?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    city?: Prisma.SortOrder;
    postalCode?: Prisma.SortOrder;
    subtotal?: Prisma.SortOrder;
    deliveryCharge?: Prisma.SortOrder;
    total?: Prisma.SortOrder;
    paymentMethod?: Prisma.SortOrder;
    paymentStatus?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    idempotencyKey?: Prisma.SortOrder;
    idempotencyRequestHash?: Prisma.SortOrder;
};
export type orderMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orderNumber?: Prisma.SortOrder;
    customerName?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    city?: Prisma.SortOrder;
    postalCode?: Prisma.SortOrder;
    subtotal?: Prisma.SortOrder;
    deliveryCharge?: Prisma.SortOrder;
    total?: Prisma.SortOrder;
    paymentMethod?: Prisma.SortOrder;
    paymentStatus?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    idempotencyKey?: Prisma.SortOrder;
    idempotencyRequestHash?: Prisma.SortOrder;
};
export type orderSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    subtotal?: Prisma.SortOrder;
    deliveryCharge?: Prisma.SortOrder;
    total?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
};
export type OrderScalarRelationFilter = {
    is?: Prisma.orderWhereInput;
    isNot?: Prisma.orderWhereInput;
};
export type OrderListRelationFilter = {
    every?: Prisma.orderWhereInput;
    some?: Prisma.orderWhereInput;
    none?: Prisma.orderWhereInput;
};
export type orderOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type DecimalFieldUpdateOperationsInput = {
    set?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    increment?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    decrement?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    multiply?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    divide?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type orderCreateNestedOneWithoutOrderitemInput = {
    create?: Prisma.XOR<Prisma.orderCreateWithoutOrderitemInput, Prisma.orderUncheckedCreateWithoutOrderitemInput>;
    connectOrCreate?: Prisma.orderCreateOrConnectWithoutOrderitemInput;
    connect?: Prisma.orderWhereUniqueInput;
};
export type orderUpdateOneRequiredWithoutOrderitemNestedInput = {
    create?: Prisma.XOR<Prisma.orderCreateWithoutOrderitemInput, Prisma.orderUncheckedCreateWithoutOrderitemInput>;
    connectOrCreate?: Prisma.orderCreateOrConnectWithoutOrderitemInput;
    upsert?: Prisma.orderUpsertWithoutOrderitemInput;
    connect?: Prisma.orderWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.orderUpdateToOneWithWhereWithoutOrderitemInput, Prisma.orderUpdateWithoutOrderitemInput>, Prisma.orderUncheckedUpdateWithoutOrderitemInput>;
};
export type orderCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.orderCreateWithoutUserInput, Prisma.orderUncheckedCreateWithoutUserInput> | Prisma.orderCreateWithoutUserInput[] | Prisma.orderUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.orderCreateOrConnectWithoutUserInput | Prisma.orderCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.orderCreateManyUserInputEnvelope;
    connect?: Prisma.orderWhereUniqueInput | Prisma.orderWhereUniqueInput[];
};
export type orderUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.orderCreateWithoutUserInput, Prisma.orderUncheckedCreateWithoutUserInput> | Prisma.orderCreateWithoutUserInput[] | Prisma.orderUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.orderCreateOrConnectWithoutUserInput | Prisma.orderCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.orderCreateManyUserInputEnvelope;
    connect?: Prisma.orderWhereUniqueInput | Prisma.orderWhereUniqueInput[];
};
export type orderUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.orderCreateWithoutUserInput, Prisma.orderUncheckedCreateWithoutUserInput> | Prisma.orderCreateWithoutUserInput[] | Prisma.orderUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.orderCreateOrConnectWithoutUserInput | Prisma.orderCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.orderUpsertWithWhereUniqueWithoutUserInput | Prisma.orderUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.orderCreateManyUserInputEnvelope;
    set?: Prisma.orderWhereUniqueInput | Prisma.orderWhereUniqueInput[];
    disconnect?: Prisma.orderWhereUniqueInput | Prisma.orderWhereUniqueInput[];
    delete?: Prisma.orderWhereUniqueInput | Prisma.orderWhereUniqueInput[];
    connect?: Prisma.orderWhereUniqueInput | Prisma.orderWhereUniqueInput[];
    update?: Prisma.orderUpdateWithWhereUniqueWithoutUserInput | Prisma.orderUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.orderUpdateManyWithWhereWithoutUserInput | Prisma.orderUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.orderScalarWhereInput | Prisma.orderScalarWhereInput[];
};
export type orderUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.orderCreateWithoutUserInput, Prisma.orderUncheckedCreateWithoutUserInput> | Prisma.orderCreateWithoutUserInput[] | Prisma.orderUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.orderCreateOrConnectWithoutUserInput | Prisma.orderCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.orderUpsertWithWhereUniqueWithoutUserInput | Prisma.orderUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.orderCreateManyUserInputEnvelope;
    set?: Prisma.orderWhereUniqueInput | Prisma.orderWhereUniqueInput[];
    disconnect?: Prisma.orderWhereUniqueInput | Prisma.orderWhereUniqueInput[];
    delete?: Prisma.orderWhereUniqueInput | Prisma.orderWhereUniqueInput[];
    connect?: Prisma.orderWhereUniqueInput | Prisma.orderWhereUniqueInput[];
    update?: Prisma.orderUpdateWithWhereUniqueWithoutUserInput | Prisma.orderUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.orderUpdateManyWithWhereWithoutUserInput | Prisma.orderUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.orderScalarWhereInput | Prisma.orderScalarWhereInput[];
};
export type orderCreateWithoutOrderitemInput = {
    orderNumber: string;
    customerName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode?: string | null;
    subtotal: runtime.Decimal | runtime.DecimalJsLike | number | string;
    deliveryCharge?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    total: runtime.Decimal | runtime.DecimalJsLike | number | string;
    paymentMethod?: string;
    paymentStatus?: string;
    status?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    idempotencyKey?: string | null;
    idempotencyRequestHash?: string | null;
    user?: Prisma.userCreateNestedOneWithoutOrderInput;
};
export type orderUncheckedCreateWithoutOrderitemInput = {
    id?: number;
    orderNumber: string;
    customerName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode?: string | null;
    subtotal: runtime.Decimal | runtime.DecimalJsLike | number | string;
    deliveryCharge?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    total: runtime.Decimal | runtime.DecimalJsLike | number | string;
    paymentMethod?: string;
    paymentStatus?: string;
    status?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    userId?: number | null;
    idempotencyKey?: string | null;
    idempotencyRequestHash?: string | null;
};
export type orderCreateOrConnectWithoutOrderitemInput = {
    where: Prisma.orderWhereUniqueInput;
    create: Prisma.XOR<Prisma.orderCreateWithoutOrderitemInput, Prisma.orderUncheckedCreateWithoutOrderitemInput>;
};
export type orderUpsertWithoutOrderitemInput = {
    update: Prisma.XOR<Prisma.orderUpdateWithoutOrderitemInput, Prisma.orderUncheckedUpdateWithoutOrderitemInput>;
    create: Prisma.XOR<Prisma.orderCreateWithoutOrderitemInput, Prisma.orderUncheckedCreateWithoutOrderitemInput>;
    where?: Prisma.orderWhereInput;
};
export type orderUpdateToOneWithWhereWithoutOrderitemInput = {
    where?: Prisma.orderWhereInput;
    data: Prisma.XOR<Prisma.orderUpdateWithoutOrderitemInput, Prisma.orderUncheckedUpdateWithoutOrderitemInput>;
};
export type orderUpdateWithoutOrderitemInput = {
    orderNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    customerName?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.StringFieldUpdateOperationsInput | string;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    postalCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    deliveryCharge?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    paymentMethod?: Prisma.StringFieldUpdateOperationsInput | string;
    paymentStatus?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    idempotencyKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    idempotencyRequestHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    user?: Prisma.userUpdateOneWithoutOrderNestedInput;
};
export type orderUncheckedUpdateWithoutOrderitemInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    orderNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    customerName?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.StringFieldUpdateOperationsInput | string;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    postalCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    deliveryCharge?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    paymentMethod?: Prisma.StringFieldUpdateOperationsInput | string;
    paymentStatus?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    userId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    idempotencyKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    idempotencyRequestHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type orderCreateWithoutUserInput = {
    orderNumber: string;
    customerName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode?: string | null;
    subtotal: runtime.Decimal | runtime.DecimalJsLike | number | string;
    deliveryCharge?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    total: runtime.Decimal | runtime.DecimalJsLike | number | string;
    paymentMethod?: string;
    paymentStatus?: string;
    status?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    idempotencyKey?: string | null;
    idempotencyRequestHash?: string | null;
    orderitem?: Prisma.orderitemCreateNestedManyWithoutOrderInput;
};
export type orderUncheckedCreateWithoutUserInput = {
    id?: number;
    orderNumber: string;
    customerName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode?: string | null;
    subtotal: runtime.Decimal | runtime.DecimalJsLike | number | string;
    deliveryCharge?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    total: runtime.Decimal | runtime.DecimalJsLike | number | string;
    paymentMethod?: string;
    paymentStatus?: string;
    status?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    idempotencyKey?: string | null;
    idempotencyRequestHash?: string | null;
    orderitem?: Prisma.orderitemUncheckedCreateNestedManyWithoutOrderInput;
};
export type orderCreateOrConnectWithoutUserInput = {
    where: Prisma.orderWhereUniqueInput;
    create: Prisma.XOR<Prisma.orderCreateWithoutUserInput, Prisma.orderUncheckedCreateWithoutUserInput>;
};
export type orderCreateManyUserInputEnvelope = {
    data: Prisma.orderCreateManyUserInput | Prisma.orderCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type orderUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.orderWhereUniqueInput;
    update: Prisma.XOR<Prisma.orderUpdateWithoutUserInput, Prisma.orderUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.orderCreateWithoutUserInput, Prisma.orderUncheckedCreateWithoutUserInput>;
};
export type orderUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.orderWhereUniqueInput;
    data: Prisma.XOR<Prisma.orderUpdateWithoutUserInput, Prisma.orderUncheckedUpdateWithoutUserInput>;
};
export type orderUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.orderScalarWhereInput;
    data: Prisma.XOR<Prisma.orderUpdateManyMutationInput, Prisma.orderUncheckedUpdateManyWithoutUserInput>;
};
export type orderScalarWhereInput = {
    AND?: Prisma.orderScalarWhereInput | Prisma.orderScalarWhereInput[];
    OR?: Prisma.orderScalarWhereInput[];
    NOT?: Prisma.orderScalarWhereInput | Prisma.orderScalarWhereInput[];
    id?: Prisma.IntFilter<"order"> | number;
    orderNumber?: Prisma.StringFilter<"order"> | string;
    customerName?: Prisma.StringFilter<"order"> | string;
    email?: Prisma.StringFilter<"order"> | string;
    phone?: Prisma.StringFilter<"order"> | string;
    address?: Prisma.StringFilter<"order"> | string;
    city?: Prisma.StringFilter<"order"> | string;
    postalCode?: Prisma.StringNullableFilter<"order"> | string | null;
    subtotal?: Prisma.DecimalFilter<"order"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    deliveryCharge?: Prisma.DecimalFilter<"order"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: Prisma.DecimalFilter<"order"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    paymentMethod?: Prisma.StringFilter<"order"> | string;
    paymentStatus?: Prisma.StringFilter<"order"> | string;
    status?: Prisma.StringFilter<"order"> | string;
    createdAt?: Prisma.DateTimeFilter<"order"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"order"> | Date | string;
    userId?: Prisma.IntNullableFilter<"order"> | number | null;
    idempotencyKey?: Prisma.StringNullableFilter<"order"> | string | null;
    idempotencyRequestHash?: Prisma.StringNullableFilter<"order"> | string | null;
};
export type orderCreateManyUserInput = {
    id?: number;
    orderNumber: string;
    customerName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode?: string | null;
    subtotal: runtime.Decimal | runtime.DecimalJsLike | number | string;
    deliveryCharge?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    total: runtime.Decimal | runtime.DecimalJsLike | number | string;
    paymentMethod?: string;
    paymentStatus?: string;
    status?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    idempotencyKey?: string | null;
    idempotencyRequestHash?: string | null;
};
export type orderUpdateWithoutUserInput = {
    orderNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    customerName?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.StringFieldUpdateOperationsInput | string;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    postalCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    deliveryCharge?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    paymentMethod?: Prisma.StringFieldUpdateOperationsInput | string;
    paymentStatus?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    idempotencyKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    idempotencyRequestHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderitem?: Prisma.orderitemUpdateManyWithoutOrderNestedInput;
};
export type orderUncheckedUpdateWithoutUserInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    orderNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    customerName?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.StringFieldUpdateOperationsInput | string;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    postalCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    deliveryCharge?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    paymentMethod?: Prisma.StringFieldUpdateOperationsInput | string;
    paymentStatus?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    idempotencyKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    idempotencyRequestHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderitem?: Prisma.orderitemUncheckedUpdateManyWithoutOrderNestedInput;
};
export type orderUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    orderNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    customerName?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.StringFieldUpdateOperationsInput | string;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    postalCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    deliveryCharge?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    paymentMethod?: Prisma.StringFieldUpdateOperationsInput | string;
    paymentStatus?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    idempotencyKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    idempotencyRequestHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
/**
 * Count Type OrderCountOutputType
 */
export type OrderCountOutputType = {
    orderitem: number;
};
export type OrderCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    orderitem?: boolean | OrderCountOutputTypeCountOrderitemArgs;
};
/**
 * OrderCountOutputType without action
 */
export type OrderCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderCountOutputType
     */
    select?: Prisma.OrderCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * OrderCountOutputType without action
 */
export type OrderCountOutputTypeCountOrderitemArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.orderitemWhereInput;
};
export type orderSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orderNumber?: boolean;
    customerName?: boolean;
    email?: boolean;
    phone?: boolean;
    address?: boolean;
    city?: boolean;
    postalCode?: boolean;
    subtotal?: boolean;
    deliveryCharge?: boolean;
    total?: boolean;
    paymentMethod?: boolean;
    paymentStatus?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    userId?: boolean;
    idempotencyKey?: boolean;
    idempotencyRequestHash?: boolean;
    user?: boolean | Prisma.order$userArgs<ExtArgs>;
    orderitem?: boolean | Prisma.order$orderitemArgs<ExtArgs>;
    _count?: boolean | Prisma.OrderCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["order"]>;
export type orderSelectScalar = {
    id?: boolean;
    orderNumber?: boolean;
    customerName?: boolean;
    email?: boolean;
    phone?: boolean;
    address?: boolean;
    city?: boolean;
    postalCode?: boolean;
    subtotal?: boolean;
    deliveryCharge?: boolean;
    total?: boolean;
    paymentMethod?: boolean;
    paymentStatus?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    userId?: boolean;
    idempotencyKey?: boolean;
    idempotencyRequestHash?: boolean;
};
export type orderOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orderNumber" | "customerName" | "email" | "phone" | "address" | "city" | "postalCode" | "subtotal" | "deliveryCharge" | "total" | "paymentMethod" | "paymentStatus" | "status" | "createdAt" | "updatedAt" | "userId" | "idempotencyKey" | "idempotencyRequestHash", ExtArgs["result"]["order"]>;
export type orderInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.order$userArgs<ExtArgs>;
    orderitem?: boolean | Prisma.order$orderitemArgs<ExtArgs>;
    _count?: boolean | Prisma.OrderCountOutputTypeDefaultArgs<ExtArgs>;
};
export type $orderPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "order";
    objects: {
        user: Prisma.$userPayload<ExtArgs> | null;
        orderitem: Prisma.$orderitemPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        orderNumber: string;
        customerName: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        postalCode: string | null;
        subtotal: runtime.Decimal;
        deliveryCharge: runtime.Decimal;
        total: runtime.Decimal;
        paymentMethod: string;
        paymentStatus: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number | null;
        idempotencyKey: string | null;
        idempotencyRequestHash: string | null;
    }, ExtArgs["result"]["order"]>;
    composites: {};
};
export type orderGetPayload<S extends boolean | null | undefined | orderDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$orderPayload, S>;
export type orderCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<orderFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: OrderCountAggregateInputType | true;
};
export interface orderDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['order'];
        meta: {
            name: 'order';
        };
    };
    /**
     * Find zero or one Order that matches the filter.
     * @param {orderFindUniqueArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends orderFindUniqueArgs>(args: Prisma.SelectSubset<T, orderFindUniqueArgs<ExtArgs>>): Prisma.Prisma__orderClient<runtime.Types.Result.GetResult<Prisma.$orderPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Order that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {orderFindUniqueOrThrowArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends orderFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, orderFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__orderClient<runtime.Types.Result.GetResult<Prisma.$orderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Order that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {orderFindFirstArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends orderFindFirstArgs>(args?: Prisma.SelectSubset<T, orderFindFirstArgs<ExtArgs>>): Prisma.Prisma__orderClient<runtime.Types.Result.GetResult<Prisma.$orderPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Order that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {orderFindFirstOrThrowArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends orderFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, orderFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__orderClient<runtime.Types.Result.GetResult<Prisma.$orderPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Orders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {orderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Orders
     * const orders = await prisma.order.findMany()
     *
     * // Get first 10 Orders
     * const orders = await prisma.order.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const orderWithIdOnly = await prisma.order.findMany({ select: { id: true } })
     *
     */
    findMany<T extends orderFindManyArgs>(args?: Prisma.SelectSubset<T, orderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$orderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Order.
     * @param {orderCreateArgs} args - Arguments to create a Order.
     * @example
     * // Create one Order
     * const Order = await prisma.order.create({
     *   data: {
     *     // ... data to create a Order
     *   }
     * })
     *
     */
    create<T extends orderCreateArgs>(args: Prisma.SelectSubset<T, orderCreateArgs<ExtArgs>>): Prisma.Prisma__orderClient<runtime.Types.Result.GetResult<Prisma.$orderPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Orders.
     * @param {orderCreateManyArgs} args - Arguments to create many Orders.
     * @example
     * // Create many Orders
     * const order = await prisma.order.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends orderCreateManyArgs>(args?: Prisma.SelectSubset<T, orderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a Order.
     * @param {orderDeleteArgs} args - Arguments to delete one Order.
     * @example
     * // Delete one Order
     * const Order = await prisma.order.delete({
     *   where: {
     *     // ... filter to delete one Order
     *   }
     * })
     *
     */
    delete<T extends orderDeleteArgs>(args: Prisma.SelectSubset<T, orderDeleteArgs<ExtArgs>>): Prisma.Prisma__orderClient<runtime.Types.Result.GetResult<Prisma.$orderPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Order.
     * @param {orderUpdateArgs} args - Arguments to update one Order.
     * @example
     * // Update one Order
     * const order = await prisma.order.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends orderUpdateArgs>(args: Prisma.SelectSubset<T, orderUpdateArgs<ExtArgs>>): Prisma.Prisma__orderClient<runtime.Types.Result.GetResult<Prisma.$orderPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Orders.
     * @param {orderDeleteManyArgs} args - Arguments to filter Orders to delete.
     * @example
     * // Delete a few Orders
     * const { count } = await prisma.order.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends orderDeleteManyArgs>(args?: Prisma.SelectSubset<T, orderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Orders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {orderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Orders
     * const order = await prisma.order.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends orderUpdateManyArgs>(args: Prisma.SelectSubset<T, orderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one Order.
     * @param {orderUpsertArgs} args - Arguments to update or create a Order.
     * @example
     * // Update or create a Order
     * const order = await prisma.order.upsert({
     *   create: {
     *     // ... data to create a Order
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Order we want to update
     *   }
     * })
     */
    upsert<T extends orderUpsertArgs>(args: Prisma.SelectSubset<T, orderUpsertArgs<ExtArgs>>): Prisma.Prisma__orderClient<runtime.Types.Result.GetResult<Prisma.$orderPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Orders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {orderCountArgs} args - Arguments to filter Orders to count.
     * @example
     * // Count the number of Orders
     * const count = await prisma.order.count({
     *   where: {
     *     // ... the filter for the Orders we want to count
     *   }
     * })
    **/
    count<T extends orderCountArgs>(args?: Prisma.Subset<T, orderCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], OrderCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Order.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrderAggregateArgs>(args: Prisma.Subset<T, OrderAggregateArgs>): Prisma.PrismaPromise<GetOrderAggregateType<T>>;
    /**
     * Group by Order.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {orderGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends orderGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: orderGroupByArgs['orderBy'];
    } : {
        orderBy?: orderGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, orderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the order model
     */
    readonly fields: orderFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for order.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__orderClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.order$userArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.order$userArgs<ExtArgs>>): Prisma.Prisma__userClient<runtime.Types.Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    orderitem<T extends Prisma.order$orderitemArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.order$orderitemArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$orderitemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the order model
 */
export interface orderFieldRefs {
    readonly id: Prisma.FieldRef<"order", 'Int'>;
    readonly orderNumber: Prisma.FieldRef<"order", 'String'>;
    readonly customerName: Prisma.FieldRef<"order", 'String'>;
    readonly email: Prisma.FieldRef<"order", 'String'>;
    readonly phone: Prisma.FieldRef<"order", 'String'>;
    readonly address: Prisma.FieldRef<"order", 'String'>;
    readonly city: Prisma.FieldRef<"order", 'String'>;
    readonly postalCode: Prisma.FieldRef<"order", 'String'>;
    readonly subtotal: Prisma.FieldRef<"order", 'Decimal'>;
    readonly deliveryCharge: Prisma.FieldRef<"order", 'Decimal'>;
    readonly total: Prisma.FieldRef<"order", 'Decimal'>;
    readonly paymentMethod: Prisma.FieldRef<"order", 'String'>;
    readonly paymentStatus: Prisma.FieldRef<"order", 'String'>;
    readonly status: Prisma.FieldRef<"order", 'String'>;
    readonly createdAt: Prisma.FieldRef<"order", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"order", 'DateTime'>;
    readonly userId: Prisma.FieldRef<"order", 'Int'>;
    readonly idempotencyKey: Prisma.FieldRef<"order", 'String'>;
    readonly idempotencyRequestHash: Prisma.FieldRef<"order", 'String'>;
}
/**
 * order findUnique
 */
export type orderFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the order
     */
    select?: Prisma.orderSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the order
     */
    omit?: Prisma.orderOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.orderInclude<ExtArgs> | null;
    /**
     * Filter, which order to fetch.
     */
    where: Prisma.orderWhereUniqueInput;
};
/**
 * order findUniqueOrThrow
 */
export type orderFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the order
     */
    select?: Prisma.orderSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the order
     */
    omit?: Prisma.orderOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.orderInclude<ExtArgs> | null;
    /**
     * Filter, which order to fetch.
     */
    where: Prisma.orderWhereUniqueInput;
};
/**
 * order findFirst
 */
export type orderFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the order
     */
    select?: Prisma.orderSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the order
     */
    omit?: Prisma.orderOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.orderInclude<ExtArgs> | null;
    /**
     * Filter, which order to fetch.
     */
    where?: Prisma.orderWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of orders to fetch.
     */
    orderBy?: Prisma.orderOrderByWithRelationInput | Prisma.orderOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for orders.
     */
    cursor?: Prisma.orderWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` orders from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` orders.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of orders.
     */
    distinct?: Prisma.OrderScalarFieldEnum | Prisma.OrderScalarFieldEnum[];
};
/**
 * order findFirstOrThrow
 */
export type orderFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the order
     */
    select?: Prisma.orderSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the order
     */
    omit?: Prisma.orderOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.orderInclude<ExtArgs> | null;
    /**
     * Filter, which order to fetch.
     */
    where?: Prisma.orderWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of orders to fetch.
     */
    orderBy?: Prisma.orderOrderByWithRelationInput | Prisma.orderOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for orders.
     */
    cursor?: Prisma.orderWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` orders from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` orders.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of orders.
     */
    distinct?: Prisma.OrderScalarFieldEnum | Prisma.OrderScalarFieldEnum[];
};
/**
 * order findMany
 */
export type orderFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the order
     */
    select?: Prisma.orderSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the order
     */
    omit?: Prisma.orderOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.orderInclude<ExtArgs> | null;
    /**
     * Filter, which orders to fetch.
     */
    where?: Prisma.orderWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of orders to fetch.
     */
    orderBy?: Prisma.orderOrderByWithRelationInput | Prisma.orderOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing orders.
     */
    cursor?: Prisma.orderWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` orders from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` orders.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of orders.
     */
    distinct?: Prisma.OrderScalarFieldEnum | Prisma.OrderScalarFieldEnum[];
};
/**
 * order create
 */
export type orderCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the order
     */
    select?: Prisma.orderSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the order
     */
    omit?: Prisma.orderOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.orderInclude<ExtArgs> | null;
    /**
     * The data needed to create a order.
     */
    data: Prisma.XOR<Prisma.orderCreateInput, Prisma.orderUncheckedCreateInput>;
};
/**
 * order createMany
 */
export type orderCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many orders.
     */
    data: Prisma.orderCreateManyInput | Prisma.orderCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * order update
 */
export type orderUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the order
     */
    select?: Prisma.orderSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the order
     */
    omit?: Prisma.orderOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.orderInclude<ExtArgs> | null;
    /**
     * The data needed to update a order.
     */
    data: Prisma.XOR<Prisma.orderUpdateInput, Prisma.orderUncheckedUpdateInput>;
    /**
     * Choose, which order to update.
     */
    where: Prisma.orderWhereUniqueInput;
};
/**
 * order updateMany
 */
export type orderUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update orders.
     */
    data: Prisma.XOR<Prisma.orderUpdateManyMutationInput, Prisma.orderUncheckedUpdateManyInput>;
    /**
     * Filter which orders to update
     */
    where?: Prisma.orderWhereInput;
    /**
     * Limit how many orders to update.
     */
    limit?: number;
};
/**
 * order upsert
 */
export type orderUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the order
     */
    select?: Prisma.orderSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the order
     */
    omit?: Prisma.orderOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.orderInclude<ExtArgs> | null;
    /**
     * The filter to search for the order to update in case it exists.
     */
    where: Prisma.orderWhereUniqueInput;
    /**
     * In case the order found by the `where` argument doesn't exist, create a new order with this data.
     */
    create: Prisma.XOR<Prisma.orderCreateInput, Prisma.orderUncheckedCreateInput>;
    /**
     * In case the order was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.orderUpdateInput, Prisma.orderUncheckedUpdateInput>;
};
/**
 * order delete
 */
export type orderDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the order
     */
    select?: Prisma.orderSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the order
     */
    omit?: Prisma.orderOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.orderInclude<ExtArgs> | null;
    /**
     * Filter which order to delete.
     */
    where: Prisma.orderWhereUniqueInput;
};
/**
 * order deleteMany
 */
export type orderDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which orders to delete
     */
    where?: Prisma.orderWhereInput;
    /**
     * Limit how many orders to delete.
     */
    limit?: number;
};
/**
 * order.user
 */
export type order$userArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: Prisma.userSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the user
     */
    omit?: Prisma.userOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.userInclude<ExtArgs> | null;
    where?: Prisma.userWhereInput;
};
/**
 * order.orderitem
 */
export type order$orderitemArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the orderitem
     */
    select?: Prisma.orderitemSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the orderitem
     */
    omit?: Prisma.orderitemOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.orderitemInclude<ExtArgs> | null;
    where?: Prisma.orderitemWhereInput;
    orderBy?: Prisma.orderitemOrderByWithRelationInput | Prisma.orderitemOrderByWithRelationInput[];
    cursor?: Prisma.orderitemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OrderitemScalarFieldEnum | Prisma.OrderitemScalarFieldEnum[];
};
/**
 * order without action
 */
export type orderDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the order
     */
    select?: Prisma.orderSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the order
     */
    omit?: Prisma.orderOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.orderInclude<ExtArgs> | null;
};
//# sourceMappingURL=order.d.ts.map