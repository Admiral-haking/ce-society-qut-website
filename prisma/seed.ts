import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const hashedPassword = await hash('admin123456', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN',
      points: 1000
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create sample user
  const userPassword = await hash('user123456', 12);
  
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'Sample User',
      email: 'user@example.com',
      password: userPassword,
      role: 'USER',
      points: 100
    },
  });

  console.log('✅ Sample user created:', user.email);

  // Create sample news
  const news = await prisma.news.create({
    data: {
      title: 'خوش آمدید به انجمن علمی مهندسی کامپیوتر',
      content: 'به وب‌سایت رسمی انجمن علمی مهندسی کامپیوتر دانشگاه صنعتی قوچان خوش آمدید. این انجمن با هدف ارتقای سطح علمی و حرفه‌ای دانشجویان فعالیت می‌کند.',
      summary: 'خوش آمدید به انجمن علمی مهندسی کامپیوتر',
      category: 'اخبار',
      published: true,
      publishedAt: new Date(),
      authorId: admin.id
    },
  });

  console.log('✅ Sample news created:', news.title);

  // Create sample event
  const event = await prisma.event.create({
    data: {
      title: 'کارگاه برنامه‌نویسی پایتون',
      description: 'کارگاه آموزشی برنامه‌نویسی پایتون برای دانشجویان مهندسی کامپیوتر',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours later
      location: 'سالن کنفرانس دانشکده مهندسی',
      capacity: 50,
      organizerId: admin.id
    },
  });

  console.log('✅ Sample event created:', event.title);

  // Create sample course
  const course = await prisma.course.create({
    data: {
      title: 'مقدمه‌ای بر هوش مصنوعی',
      description: 'دوره آموزشی مقدماتی در زمینه هوش مصنوعی و یادگیری ماشین',
      price: 500000,
      published: true,
      startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      capacity: 30,
      instructorId: admin.id
    },
  });

  console.log('✅ Sample course created:', course.title);

  // Create sample competition
  const competition = await prisma.competition.create({
    data: {
      title: 'مسابقه برنامه‌نویسی دانشگاهی',
      description: 'مسابقه برنامه‌نویسی برای دانشجویان دانشگاه صنعتی قوچان',
      startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 4 hours later
      status: 'ACTIVE',
      rules: 'شرایط مسابقه: استفاده از زبان‌های برنامه‌نویسی C++، Java، Python',
      prize: 'جایزه نقدی 5 میلیون تومانی',
      maxParticipants: 100,
      location: 'آزمایشگاه کامپیوتر دانشکده مهندسی',
      organizerId: admin.id
    },
  });

  console.log('✅ Sample competition created:', competition.title);

  // Create sample settings
  const settings = await prisma.settings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      siteName: 'انجمن علمی مهندسی کامپیوتر',
      siteDescription: 'انجمن علمی مهندسی کامپیوتر دانشگاه صنعتی قوچان',
      siteLogo: '/images/logo.png',
      siteFavicon: '/favicon.ico',
      siteKeywords: 'انجمن علمی, مهندسی کامپیوتر, دانشگاه صنعتی قوچان',
      siteLanguage: 'fa',
      maintenanceMode: false,
      loginOpen: true,
      registrationOpen: true,
      heroOpen: true,
      statsActiveMembers: 150,
      statsWorkshops: 25,
      statsCompetitions: 10
    },
  });

  console.log('✅ Site settings created');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 