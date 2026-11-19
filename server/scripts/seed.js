import { config } from '../config.js';
import { connectDB, disconnectDB } from '../db.js';
import Product from '../models/Product.js';
import { products } from '../../src/data/products.js';

async function seed() {
  if (!config.mongoUri) {
    throw new Error('MONGODB_URI is not configured. Copy .env.example to .env and set it.');
  }

  await connectDB();
  let created = 0;
  let updated = 0;

  for (const [index, product] of products.entries()) {
    const { _id, ...fields } = product;
    const result = await Product.updateOne(
      { id: product.id },
      { $set: { ...fields, sortIndex: index } },
      { upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );
    if (result.upsertedCount > 0 || result.upsertedId) created += 1;
    else updated += 1;
  }

  console.log(
    `Seed complete: ${created} inserted, ${updated} updated (${products.length} catalogue entries).`,
  );
}

try {
  await seed();
} catch (error) {
  console.error('Seed failed:', error);
  process.exitCode = 1;
} finally {
  await disconnectDB().catch(() => {});
}
