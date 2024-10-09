import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.usuario.create({
    data: {
      id: 'user_2mikmeP8YaDovLqGlhQDkmgOcNE', // Utiliza el userId que proporciona Clerk
    },
  });

  console.log('Usuario creado exitosamente');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
