export interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    customerName: string;
    orderAmount: number;
    status: string;
    items: { items: OrderItem[] };
    createdAt: string;
}

export interface OrdersResponse {
    data: Order[];
    nextCursor: string | null;
    previousCursor?: string | null;
    totalCount: number;
    hasNextPage: boolean;
    metadata: {
        sortBy: string;
        sortDirection: string;
        responseTime: number;
        previousCursor?: string | null;
    }
} 