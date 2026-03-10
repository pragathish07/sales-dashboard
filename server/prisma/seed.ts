import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...\n");

  
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log(`Admin user: ${admin.email} (password: admin123)`);

  
  const salesPassword = await bcrypt.hash("sales123", 10);
  const salesUser = await prisma.user.upsert({
    where: { email: "sales@example.com" },
    update: {},
    create: {
      name: "Sales User",
      email: "sales@example.com",
      password: salesPassword,
      role: "SALES",
    },
  });
  console.log(`Sales user: ${salesUser.email} (password: sales123)`);

  
  const categories = ["Electronics", "Accessories", "Home Appliances", "Clothing"];
  const createdCategories = [];

  for (const name of categories) {
    const cat = await prisma.category.upsert({
      where: { id: name.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: { name },
    });
    createdCategories.push(cat);
  }
  console.log(`Created ${createdCategories.length} categories`);


  const sampleProducts = [
    {
      name: "Laptop",
      sku: "ELEC-001",
      description: "High performance laptop",
      price: 65000,
      costPrice: 55000,
      categoryId: createdCategories[0].id,
      stock: 12,
    },
    {
      name: "Wireless Mouse",
      sku: "ACC-001",
      description: "Ergonomic wireless mouse",
      price: 800,
      costPrice: 500,
      categoryId: createdCategories[1].id,
      stock: 45,
    },
    {
      name: "Keyboard",
      sku: "ACC-002",
      description: "Mechanical keyboard",
      price: 2500,
      costPrice: 1800,
      categoryId: createdCategories[1].id,
      stock: 30,
    },
    {
      name: "Monitor",
      sku: "ELEC-002",
      description: '27" 4K Monitor',
      price: 25000,
      costPrice: 20000,
      categoryId: createdCategories[0].id,
      stock: 8,
    },
  ];

  for (const prod of sampleProducts) {
    const { stock, ...productData } = prod;
    const existing = await prisma.product.findUnique({
      where: { sku: prod.sku },
    });

    if (!existing) {
      await prisma.product.create({
        data: {
          ...productData,
          inventory: {
            create: {
              quantity: stock,
              reorderLevel: 10,
            },
          },
        },
      });
    }
  }
  console.log(`Created ${sampleProducts.length} sample products`);

  
  const customer = await prisma.customer.upsert({
    where: { id: "seed-customer-1" },
    update: {},
    create: {
      name: "Rahul Sharma",
      phone: "9876543210",
      email: "rahul@example.com",
      address: "Mumbai, India",
    },
  });
  console.log(`Sample customer: ${customer.name}`);

  console.log("\n🎉 Seed complete! You can now log in:");
  console.log("   Admin  → admin@example.com / admin123");
  console.log("   Sales  → sales@example.com / sales123\n");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
