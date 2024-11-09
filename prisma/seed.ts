import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const TOTAL_ORDERS = 10000;
const BATCH_SIZE = 100;

const STATUS_OPTIONS = ['pending', 'processing', 'completed', 'cancelled'] as const;
const PRODUCT_NAMES = [
    'Laptop', 'Smartphone', 'Headphones', 'Monitor', 'Keyboard', 'Mouse',
    'Tablet', 'Smartwatch', 'Camera', 'Speaker', 'Printer', 'Router',
    'External HDD', 'USB Drive', 'Graphics Card', 'RAM', 'SSD', 'Processor',
    'Motherboard', 'Power Supply'
];

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

function generateOrderItems(): OrderItem[] {
    const numItems = faker.number.int({ min: 1, max: 5 });
    const items: OrderItem[] = [];

    for (let i = 0; i < numItems; i++) {
        items.push({
            name: faker.helpers.arrayElement(PRODUCT_NAMES),
            quantity: faker.number.int({ min: 1, max: 5 }),
            price: parseFloat(faker.commerce.price({ min: 10, max: 1000 }))
        });
    }

    return items;
}

function calculateOrderAmount(items: OrderItem[]): number {
    return Number(items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2));
}

async function generateOrders(startDate: Date, endDate: Date) {
    const orders = [];

    for (let i = 0; i < BATCH_SIZE; i++) {
        const items = generateOrderItems();
        const orderAmount = calculateOrderAmount(items);

        orders.push({
            customerName: faker.person.fullName(),
            orderAmount,
            status: faker.helpers.arrayElement(STATUS_OPTIONS),
            items: JSON.stringify({ items }),
            createdAt: faker.date.between({ from: startDate, to: endDate })
        });
    }

    return orders;
}

async function seed() {
    console.log('Starting seed...');
    const startTime = Date.now();

    try {
        await prisma.order.deleteMany();
        console.log('Cleared existing orders');

        const endDate = new Date();
        const startDate = new Date(endDate.getFullYear() - 1, endDate.getMonth(), endDate.getDate());

        const totalBatches = Math.ceil(TOTAL_ORDERS / BATCH_SIZE);
        let createdOrders = 0;

        for (let batch = 0; batch < totalBatches; batch++) {
            const orders = await generateOrders(startDate, endDate);

            await prisma.order.createMany({
                data: orders.map(order => ({
                    ...order,
                    items: JSON.parse(order.items as string)
                }))
            });

            createdOrders += orders.length;
            const progress = ((createdOrders / TOTAL_ORDERS) * 100).toFixed(1);
            console.log(`Progress: ${progress}% (${createdOrders}/${TOTAL_ORDERS} orders)`);
        }

        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;

        console.log(`\nSeeding completed in ${duration.toFixed(2)} seconds`);
        console.log(`Created ${createdOrders} orders`);
    } catch (error) {
        console.error('Error during seeding:', error);
        throw error;
    }
}

seed()
    .catch((error) => {
        console.error('Error seeding database:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 