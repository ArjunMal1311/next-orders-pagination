'use client';

import { Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OrdersTable from '@/components/OrdersTable';

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-[#101010] py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-white">Orders Dashboard</h1>
          </div>
        </div>

        <Card className="overflow-hidden shadow-lg bg-[#1c1c1c] border-[#2a2a2a]">
          <CardHeader className="border-b border-[#2a2a2a] bg-[#1c1c1c] px-6 py-4">
            <CardTitle className="text-xl font-semibold text-white">Orders List</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <OrdersTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
