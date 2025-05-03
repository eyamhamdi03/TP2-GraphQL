import { PrismaClient, Role } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function seed() {
  const skill1 = await prisma.skill.create({ data: { name: "NestJS" } });
  const skill2 = await prisma.skill.create({ data: { name: "React" } });

  const user1 = await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@example.com",
      role: Role.USER,
    },
  });

  await prisma.cv.create({
    data: {
      name: "Alice CV",
      job: "Backend Developer",
      userId: user1.id,
      skills: {
        connect: [{ id: skill1.id }, { id: skill2.id }],
      },
    },
  });

  console.log("Mock data inserted.");
}

seed().finally(() => prisma.$disconnect());
