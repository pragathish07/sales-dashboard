#!/bin/sh
set -e

echo "Running Prisma migrations..."
npx prisma migrate deploy

# Check if all seeded tables are empty
COUNTS=$(node -e "
  const { PrismaPg } = require('@prisma/adapter-pg');
  const { PrismaClient } = require('@prisma/client');
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });
  Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.customer.count(),
    prisma.category.count()
  ]).then(([u, p, cu, ca]) => {
    console.log(u + p + cu + ca);
    return prisma.\$disconnect();
  }).catch(() => { console.log('0'); process.exit(0); });
")

if [ "$COUNTS" = "0" ]; then
  echo "Database is empty, running seed..."
  node dist/prisma/seed.js
else
  echo "Database already seeded ($COUNTS records found), skipping..."
fi

echo "Starting server..."
exec node dist/src/index.js
