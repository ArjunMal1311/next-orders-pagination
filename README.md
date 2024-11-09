# Orders Dashboard
A high-performance order management dashboard built with Next.js, React Query, and Prisma.

## Features
- 🚀 High-performance data grid with virtualization
- 📊 Real-time sorting and filtering
- 🔄 Infinite scrolling with cursor-based pagination
- 💾 Efficient data caching
- 🎯 Type-safe database operations
- ⚡ Optimized for large datasets

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Data Fetching**: TanStack Query (React Query)
- **Virtualization**: TanStack Virtual
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone


2. Install dependencies:
```bash
pnpm install
```

3. Set up the database:
```bash
pnpm run db:setup
```

4. Start the development server:
```bash
pnpm run dev
```

5. Run database migrations:
```bash
pnpm run db:migrate
```

├── app/
│ ├── api/
│ │ └── orders/
│ │ └── route.ts # Orders API endpoint
│ ├── layout.tsx # Root layout
│ ├── page.tsx # Main dashboard page
│ └── providers.tsx # React Query provider
├── components/
│ ├── OrdersTable.tsx # Main orders table component
│ └── ui/ # UI components
├── lib/
│ ├── prisma.ts # Prisma client
│ └── utils.ts # Utility functions
├── prisma/
│ └── schema.prisma # Database schema
└── types/
└── order.ts # TypeScript types



## Performance Optimizations

- Cursor-based pagination for consistent performance
- Row virtualization for handling large datasets
- Parallel database queries
- Efficient caching strategy
- Optimized database indexes
- Selective field fetching

## API Routes
### GET /api/orders

Fetches paginated orders with sorting capabilities.
Query Parameters:
- `cursor`: Pagination cursor
- `sortBy`: Field to sort by (default: 'createdAt')
- `sortDirection`: Sort direction ('asc' or 'desc')
- `limit`: Items per page (default: 50)

## Development
### Database Management
Generate Prisma Client:
```bash
pnpm run db:generate
```


## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [TanStack](https://tanstack.com/)
- [shadcn/ui](https://ui.shadcn.com/)