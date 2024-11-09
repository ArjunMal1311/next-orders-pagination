import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const ITEMS_PER_PAGE = 50;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const cursor = searchParams.get('cursor');
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortDirection = (searchParams.get('sortDirection') || 'desc') as 'asc' | 'desc';
  const limit = Number(searchParams.get('limit')) || ITEMS_PER_PAGE;

  try {
    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        take: limit + 1,
        ...(cursor && {
          cursor: {
            id: cursor.split('_')[0],
          },
          skip: 1,
        }),
        orderBy: [
          { [sortBy]: sortDirection },
          { id: 'asc' },
        ],
        select: {
          id: true,
          customerName: true,
          orderAmount: true,
          status: true,
          createdAt: true,
        }
      }),
      prisma.order.count()
    ]);

    const hasNextPage = orders.length > limit;
    const data = orders.slice(0, limit);

    let nextCursor = null;
    if (hasNextPage && data.length > 0) {
      const lastOrder = data[data.length - 1];
      nextCursor = `${lastOrder.id}_${lastOrder.createdAt.toISOString()}`;
    }

    return NextResponse.json({
      data,
      nextCursor,
      hasNextPage,
      totalCount,
      metadata: {
        sortBy,
        sortDirection,
        responseTime: Date.now(),
      }
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
} 