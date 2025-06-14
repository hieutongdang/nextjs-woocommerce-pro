# Next.js WooCommerce Store

A modern eCommerce + blog website built with Next.js 14+ (App Router) and WooCommerce GraphQL.

## Features

- Modern Next.js 14+ with App Router
- WooCommerce GraphQL integration
- Blog functionality
- Responsive design with Tailwind CSS
- Static Site Generation (SSG)
- SEO optimized

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app` - Next.js App Router pages and layouts
- `/components` - Reusable React components
- `/lib` - Utility functions and configurations
  - `/lib/apollo-client.ts` - Apollo Client configuration
  - `/lib/graphql/queries.ts` - GraphQL queries

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint 