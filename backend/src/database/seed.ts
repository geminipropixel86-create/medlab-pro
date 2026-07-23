import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserRole, UserStatus } from '../modules/auth/user.entity';
import { PriceItem } from '../modules/pricing/price-item.entity';
import { Offer } from '../modules/offers/offer.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const userRepo = app.get(getRepositoryToken(User));
    const priceRepo = app.get(getRepositoryToken(PriceItem));
    const offerRepo = app.get(getRepositoryToken(Offer));

    // ── Admin User ────────────────────────────────────
    const admin = await userRepo.findOne({ where: { email: 'admin@medlabpro.com' } });
    if (!admin) {
      await userRepo.save({
        firstName: 'Super',
        lastName: 'Admin',
        email: 'admin@medlabpro.com',
        phone: '+1234567890',
        passwordHash: await bcrypt.hash('Admin@123456', 12),
        role: UserRole.SUPER_ADMIN,
        status: UserStatus.ACTIVE,
        isEmailVerified: true,
      });
      console.log('✓ Admin user created (admin@medlabpro.com / Admin@123456)');
    }

    // Demo technician
    const tech = await userRepo.findOne({ where: { email: 'tech@medlabpro.com' } });
    if (!tech) {
      await userRepo.save({
        firstName: 'Lab',
        lastName: 'Tech',
        email: 'tech@medlabpro.com',
        phone: '+1234567891',
        passwordHash: await bcrypt.hash('Tech@123456', 12),
        role: UserRole.TECHNICIAN,
        status: UserStatus.ACTIVE,
        isEmailVerified: true,
      });
      console.log('✓ Technician user created (tech@medlabpro.com / Tech@123456)');
    }

    // ── Price Items ───────────────────────────────────
    const priceCount = await priceRepo.count();
    if (priceCount === 0) {
      const tests = [
        { name: 'Complete Blood Count (CBC)', category: 'Hematology', price: 500, preparationInstructions: 'No special preparation required' },
        { name: 'Blood Sugar (Fasting)', category: 'Biochemistry', price: 200, preparationInstructions: '8-12 hours fasting required' },
        { name: 'Lipid Profile', category: 'Biochemistry', price: 600, preparationInstructions: '10-12 hours fasting required' },
        { name: 'Thyroid Profile (T3, T4, TSH)', category: 'Endocrinology', price: 800, preparationInstructions: 'No special preparation required' },
        { name: 'Urine Analysis', category: 'Pathology', price: 300, preparationInstructions: 'First morning sample preferred' },
        { name: 'Liver Function Test', category: 'Biochemistry', price: 700, preparationInstructions: '8 hours fasting recommended' },
        { name: 'Kidney Function Test', category: 'Biochemistry', price: 650, preparationInstructions: 'No special preparation required' },
        { name: 'Vitamin D (25-OH)', category: 'Endocrinology', price: 1200, preparationInstructions: 'No special preparation required' },
        { name: 'Vitamin B12', category: 'Endocrinology', price: 900, preparationInstructions: '8 hours fasting recommended' },
        { name: 'HbA1c', category: 'Biochemistry', price: 550, preparationInstructions: 'No fasting required' },
        { name: 'Dengue NS1 Antigen', category: 'Microbiology', price: 1000, preparationInstructions: 'No special preparation required' },
        { name: 'Malaria Antigen', category: 'Microbiology', price: 400, preparationInstructions: 'No special preparation required' },
        { name: 'COVID-19 RT-PCR', category: 'Microbiology', price: 1500, preparationInstructions: 'No special preparation required' },
        { name: 'PSA (Prostate-Specific Antigen)', category: 'Oncology', price: 1100, preparationInstructions: 'No special preparation required' },
        { name: 'Iron Studies', category: 'Biochemistry', price: 750, preparationInstructions: '12 hours fasting; morning sample preferred' },
      ];
      await priceRepo.save(tests.map((t) => priceRepo.create(t)));
      console.log(`✓ ${tests.length} price items seeded`);
    }

    // ── Offers ────────────────────────────────────────
    const offerCount = await offerRepo.count();
    if (offerCount === 0) {
      const now = new Date();
      const offers = [
        { title: 'Summer Health Check', description: 'Complete health checkup at 30% off', discountPercentage: 30, validFrom: now, validUntil: new Date(now.getTime() + 90 * 86400000), couponCode: 'SUMMER30', maxDiscount: 2000, minPurchase: 3000 },
        { title: 'Senior Citizen Discount', description: 'Special discount for senior citizens', discountPercentage: 25, validFrom: now, validUntil: new Date(now.getTime() + 365 * 86400000), couponCode: 'SENIOR25', maxDiscount: 1500, minPurchase: 2000 },
        { title: 'First Time Offer', description: 'First test at our lab', discountPercentage: 50, validFrom: now, validUntil: new Date(now.getTime() + 30 * 86400000), couponCode: 'FIRST50', maxDiscount: 1000, minPurchase: 500 },
      ];
      await offerRepo.save(offers.map((o) => offerRepo.create(o)));
      console.log(`✓ ${offers.length} offers seeded`);
    }

    console.log('\n✓ Database seeding complete!');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await app.close();
  }
}

seed();