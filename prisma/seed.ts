import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@proriders.com.br' },
    update: {},
    create: {
      email: 'admin@proriders.com.br',
      name: 'Admin Pro Riders',
      passwordHash,
      role: 'ADMIN',
    },
  });

  console.log('Admin created:', admin.email);

  const course = await prisma.course.upsert({
    where: { slug: 'mecanica-bmw-gs' },
    update: {},
    create: {
      name: 'Mecânica BMW GS',
      slug: 'mecanica-bmw-gs',
      description: 'Treinamento completo de mecânica para motores Boxer e modelos GS.',
      syllabus: 'Diagnóstico, suspensão, motor, elétrica.',
    }
  });

  await prisma.courseDate.upsert({
    where: { slug: 'mecanica-gs-sp-fev' },
    update: {},
    create: {
      courseId: course.id,
      slug: 'mecanica-gs-sp-fev',
      startDate: new Date('2026-02-15T08:00:00Z'),
      location: 'São Paulo, SP',
      price: 1200,
      maxStudents: 12,
      timeStart: '08:00',
      timeEnd: '18:00'
    }
  });

  await prisma.courseDate.upsert({
    where: { slug: 'mecanica-gs-lisboa-mar' },
    update: {},
    create: {
      courseId: course.id,
      slug: 'mecanica-gs-lisboa-mar',
      startDate: new Date('2026-03-20T09:00:00Z'),
      location: 'Lisboa, PT',
      price: 250, // €
      maxStudents: 10,
      timeStart: '09:00',
      timeEnd: '17:00'
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
