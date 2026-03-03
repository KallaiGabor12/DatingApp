import { encryptEmail, hashPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function main() {

  await prisma.user.deleteMany({ where: { NOT: { id: -1 } } });
  await prisma.user.create({data:{
    email: encryptEmail("gal.attila0204@gmail.com"),
    password: await hashPassword("test"),
  }})

  console.log('✅ Seed done');
}

main()
  .catch((e) => {
    console.error('❌ Error while seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


