'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRef, useEffect, useState, useMemo } from 'react';
import { Order, OrdersResponse } from '@/types/order';
import { formatCurrency } from '@/lib/utils';
import { ArrowUpDown } from 'lucide-react';
import { Button } from './ui/button';

interface FetchOrdersParams {
    cursor?: string | null;
    limit?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
}

const ITEMS_PER_PAGE = 50;
const STALE_TIME = 30 * 1000;
const CACHE_TIME = 5 * 60 * 1000;

const fetchOrders = async ({ cursor, limit = ITEMS_PER_PAGE, sortBy = 'createdAt', sortDirection = 'desc' }: FetchOrdersParams): Promise<OrdersResponse> => {
    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    params.append('limit', limit.toString());
    params.append('sortBy', sortBy);
    params.append('sortDirection', sortDirection);
    
    const response = await fetch(`/api/orders?${params.toString()}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
};

export default function OrdersTable() {
    const parentRef = useRef<HTMLDivElement>(null);
    const [loadTime, setLoadTime] = useState<number>(0);
    const [sortConfig, setSortConfig] = useState({
        sortBy: 'createdAt',
        sortDirection: 'desc' as 'asc' | 'desc'
    });

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery({
        queryKey: ['orders', sortConfig],
        queryFn: async ({ pageParam }) => {
            const startTime = performance.now();
            const result = await fetchOrders({ 
                cursor: pageParam as string | null, 
                sortBy: sortConfig.sortBy,
                sortDirection: sortConfig.sortDirection 
            });
            const endTime = performance.now();
            setLoadTime(endTime - startTime);
            return result;
        },
        getNextPageParam: (lastPage: OrdersResponse) => lastPage.nextCursor,
        initialPageParam: null as string | null,
        staleTime: STALE_TIME,
        gcTime: CACHE_TIME,
    });

    const allRows = useMemo(() => 
        data?.pages?.flatMap((page: OrdersResponse) => page.data) ?? [], 
        [data?.pages]
    );

    const totalItems = data?.pages[0]?.totalCount ?? 0;

    const rowVirtualizer = useVirtualizer({
        count: hasNextPage ? allRows.length + 1 : allRows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 50,
        overscan: 5,
    });

    useEffect(() => {
        const lastItem = rowVirtualizer.getVirtualItems().at(-1);

        if (!lastItem) return;

        if (
            lastItem.index >= allRows.length - 1 &&
            hasNextPage &&
            !isFetchingNextPage
        ) {
            fetchNextPage();
        }
    }, [
        hasNextPage,
        fetchNextPage,
        allRows.length,
        isFetchingNextPage,
        rowVirtualizer.getVirtualItems(),
    ]);

    const handleSort = (column: string) => {
        setSortConfig(prev => ({
            sortBy: column,
            sortDirection: prev.sortBy === column && prev.sortDirection === 'desc' ? 'asc' : 'desc'
        }));
    };

    const SortButton = ({ column, children }: { column: string, children: React.ReactNode }) => (
        <Button
            variant="ghost"
            onClick={() => handleSort(column)}
            className="text-gray-300 hover:bg-[#252525] hover:text-white"
        >
            {children}
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[600px] bg-[#1c1c1c]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center h-[600px] bg-[#1c1c1c] text-red-500">
                Error loading orders
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-4 py-2 bg-[#151515] border-b border-[#2a2a2a]">
                <div className="text-gray-300">
                    Total orders: {totalItems.toLocaleString()}
                </div>
            </div>

            <div
                ref={parentRef}
                className="border-[#2a2a2a] rounded-lg overflow-auto h-[600px] bg-[#1c1c1c]"
            >
                <div className="sticky top-0 bg-[#151515] px-6 py-3 grid grid-cols-5 gap-4 font-medium z-10 border-b border-[#2a2a2a]">
                    <SortButton column="id">Order ID</SortButton>
                    <SortButton column="customerName">Customer</SortButton>
                    <SortButton column="orderAmount">Amount</SortButton>
                    <SortButton column="status">Status</SortButton>
                    <SortButton column="createdAt">Date</SortButton>
                </div>
                <div
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        width: '100%',
                        position: 'relative',
                    }}
                >
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const order = allRows[virtualRow.index] as Order | undefined;
                        return (
                            <div
                                key={virtualRow.index}
                                data-index={virtualRow.index}
                                ref={rowVirtualizer.measureElement}
                                className={`absolute top-0 left-0 w-full px-6 py-3 grid grid-cols-5 gap-4 border-b border-[#2a2a2a] ${
                                    virtualRow.index % 2 === 0 ? 'bg-[#1c1c1c]' : 'bg-[#252525]'
                                }`}
                                style={{
                                    transform: `translateY(${virtualRow.start}px)`,
                                }}
                            >
                                {order ? (
                                    <>
                                        <div className="truncate text-gray-300">{order.id}</div>
                                        <div className="text-gray-300">{order.customerName}</div>
                                        <div className="text-gray-300">{formatCurrency(order.orderAmount)}</div>
                                        <div>
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    order.status === 'completed'
                                                        ? 'bg-green-900/50 text-green-400'
                                                        : order.status === 'processing'
                                                        ? 'bg-blue-900/50 text-blue-400'
                                                        : order.status === 'cancelled'
                                                        ? 'bg-red-900/50 text-red-400'
                                                        : 'bg-yellow-900/50 text-yellow-400'
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</div>
                                    </>
                                ) : (
                                    isFetchingNextPage && (
                                        <div className="col-span-5 text-center text-gray-400">Loading more...</div>
                                    )
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            
            <div className="flex items-center justify-between px-4 text-gray-400">
                <div>
                    {isFetchingNextPage && (
                        <span className="text-blue-400">Loading more...</span>
                    )}
                </div>
            </div>r̥
        </div>
    );
} 