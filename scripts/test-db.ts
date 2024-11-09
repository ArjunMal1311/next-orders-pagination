import { PrismaClient } from '@prisma/client'

async function testConnection() {
  const prisma = new PrismaClient()
  try {
    await prisma.$connect()
    console.log('Database connection successful')

    const testOrder = await prisma.order.create({
      data: {
        customerName: "Test Customer",
        orderAmount: 99.99,
        status: "pending",
        items: { items: ["test item"] }
      }
    })
    console.log('Test record created:', testOrder)

  } catch (error) {
    console.error('Database connection failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection() 