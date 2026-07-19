import { PrismaClient } from '../src/generated/prisma/index.js';
import bcrypt from 'bcrypt';

/**
 * Deterministic development seed.
 * Passwords are hashed with bcrypt — never seed plaintext credentials into the DB.
 *
 * Default logins (change in production; these are for local/demo only):
 *   superadmin@ims.local / Password123!
 *   admin@ims.local      / Password123!
 *   staff@ims.local      / Password123!
 */

const prisma = new PrismaClient();

const SEED_PASSWORD = 'Password123!';
const BCRYPT_ROUNDS = 12;

async function main() {
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, BCRYPT_ROUNDS);

  const roles = await Promise.all(
    (['SUPER_ADMIN', 'ADMIN', 'STAFF'] as const).map((name) =>
      prisma.role.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );

  const roleByName = Object.fromEntries(roles.map((role) => [role.name, role])) as Record<
    'SUPER_ADMIN' | 'ADMIN' | 'STAFF',
    (typeof roles)[number]
  >;

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@ims.local' },
    update: {
      name: 'Super Admin',
      password: passwordHash,
      roleId: roleByName.SUPER_ADMIN.id,
      isActive: true,
    },
    create: {
      name: 'Super Admin',
      email: 'superadmin@ims.local',
      password: passwordHash,
      roleId: roleByName.SUPER_ADMIN.id,
      isActive: true,
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@ims.local' },
    update: {
      name: 'Admin User',
      password: passwordHash,
      roleId: roleByName.ADMIN.id,
      isActive: true,
    },
    create: {
      name: 'Admin User',
      email: 'admin@ims.local',
      password: passwordHash,
      roleId: roleByName.ADMIN.id,
      isActive: true,
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: 'staff@ims.local' },
    update: {
      name: 'Staff User',
      password: passwordHash,
      roleId: roleByName.STAFF.id,
      isActive: true,
    },
    create: {
      name: 'Staff User',
      email: 'staff@ims.local',
      password: passwordHash,
      roleId: roleByName.STAFF.id,
      isActive: true,
    },
  });

  const electronics = await prisma.category.upsert({
    where: { name: 'Electronics' },
    update: { description: 'Devices, peripherals, and accessories' },
    create: {
      name: 'Electronics',
      description: 'Devices, peripherals, and accessories',
    },
  });

  const office = await prisma.category.upsert({
    where: { name: 'Office Supplies' },
    update: { description: 'Everyday workplace consumables' },
    create: {
      name: 'Office Supplies',
      description: 'Everyday workplace consumables',
    },
  });

  const techSupply = await prisma.supplier.upsert({
    where: { id: 'seed_supplier_tech' },
    update: {
      name: 'TechSupply Co.',
      phone: '+1-555-0100',
      email: 'orders@techsupply.example',
      address: '100 Market Street, San Francisco, CA',
    },
    create: {
      id: 'seed_supplier_tech',
      name: 'TechSupply Co.',
      phone: '+1-555-0100',
      email: 'orders@techsupply.example',
      address: '100 Market Street, San Francisco, CA',
    },
  });

  const officeWorld = await prisma.supplier.upsert({
    where: { id: 'seed_supplier_office' },
    update: {
      name: 'Office World',
      phone: '+1-555-0200',
      email: 'sales@officeworld.example',
      address: '50 Commerce Ave, Austin, TX',
    },
    create: {
      id: 'seed_supplier_office',
      name: 'Office World',
      phone: '+1-555-0200',
      email: 'sales@officeworld.example',
      address: '50 Commerce Ave, Austin, TX',
    },
  });

  const laptop = await prisma.product.upsert({
    where: { sku: 'ELC-LAP-001' },
    update: {
      name: 'Business Laptop 14"',
      description: '14-inch productivity laptop',
      price: '1299.00',
      stock: 12,
      minimumStock: 5,
      categoryId: electronics.id,
      supplierId: techSupply.id,
      status: 'ACTIVE',
    },
    create: {
      sku: 'ELC-LAP-001',
      name: 'Business Laptop 14"',
      description: '14-inch productivity laptop',
      price: '1299.00',
      stock: 12,
      minimumStock: 5,
      categoryId: electronics.id,
      supplierId: techSupply.id,
      status: 'ACTIVE',
    },
  });

  const mouse = await prisma.product.upsert({
    where: { sku: 'ELC-MOU-002' },
    update: {
      name: 'Wireless Mouse',
      description: 'Ergonomic wireless mouse',
      price: '29.99',
      stock: 3,
      minimumStock: 10,
      categoryId: electronics.id,
      supplierId: techSupply.id,
      status: 'ACTIVE',
    },
    create: {
      sku: 'ELC-MOU-002',
      name: 'Wireless Mouse',
      description: 'Ergonomic wireless mouse',
      price: '29.99',
      stock: 3,
      minimumStock: 10,
      categoryId: electronics.id,
      supplierId: techSupply.id,
      status: 'ACTIVE',
    },
  });

  const notebook = await prisma.product.upsert({
    where: { sku: 'OFF-NBK-001' },
    update: {
      name: 'A5 Notebook Pack',
      description: 'Pack of 5 ruled notebooks',
      price: '12.50',
      stock: 48,
      minimumStock: 20,
      categoryId: office.id,
      supplierId: officeWorld.id,
      status: 'ACTIVE',
    },
    create: {
      sku: 'OFF-NBK-001',
      name: 'A5 Notebook Pack',
      description: 'Pack of 5 ruled notebooks',
      price: '12.50',
      stock: 48,
      minimumStock: 20,
      categoryId: office.id,
      supplierId: officeWorld.id,
      status: 'ACTIVE',
    },
  });

  // Seed sample movements only when the product has none (idempotent re-runs)
  const existingTx = await prisma.inventoryTransaction.count({
    where: { productId: laptop.id },
  });

  if (existingTx === 0) {
    await prisma.inventoryTransaction.createMany({
      data: [
        {
          type: 'IN',
          quantity: 20,
          note: 'Initial stock receipt',
          productId: laptop.id,
          userId: admin.id,
        },
        {
          type: 'OUT',
          quantity: 8,
          note: 'Issued to sales team',
          productId: laptop.id,
          userId: staff.id,
        },
        {
          type: 'IN',
          quantity: 15,
          note: 'Restock from TechSupply',
          productId: mouse.id,
          userId: admin.id,
        },
        {
          type: 'OUT',
          quantity: 12,
          note: 'Desk setup kits',
          productId: mouse.id,
          userId: staff.id,
        },
        {
          type: 'ADJUSTMENT',
          quantity: 2,
          note: 'Cycle count correction',
          productId: notebook.id,
          userId: superAdmin.id,
        },
      ],
    });
  }

  // eslint-disable-next-line no-console -- seed summary
  console.log('Seed completed:');
  // eslint-disable-next-line no-console -- seed summary
  console.log({
    roles: roles.map((r) => r.name),
    users: [superAdmin.email, admin.email, staff.email],
    password: SEED_PASSWORD,
    categories: [electronics.name, office.name],
    products: [laptop.sku, mouse.sku, notebook.sku],
  });
}

main()
  .catch((error: unknown) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
