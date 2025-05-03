import { db } from "../db/db.mjs";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const Query = {
  GetUsers: () => db.users,

  GetUserById: (parent, { id }) => {
    const user = db.users.find((user) => user.id == id);
    if (!user) throw new Error(`User with id ${id} not found`);
    return user;
  },

  GetUserByEmail: (parent, { email }) => {
    const user = db.users.find((user) => user.email === email);
    if (!user) throw new Error(`User with email ${email} not found`);
    return user;
  },

  GetUserByName: (parent, { name }) => {
    return db.users.filter((user) => user.name.toLowerCase().includes(name.toLowerCase()));
  },

  GetUsersByAge: (parent, { age }) => {
    return db.users.filter((user) => user.age == age);
  },

  GetCvs: () => db.cvs,

  GetCv: (parent, { id }) => {
    const cv = db.cvs.find((cv) => cv.id == id);
    if (!cv) throw new Error(`CV with id ${id} not found`);
    return cv;
  },

  GetCvByName: (parent, { name }) => {
    return db.cvs.filter((cv) => cv.name.toLowerCase().includes(name.toLowerCase()));
  },

  GetCvByJob: (parent, { job }) => {
    return db.cvs.filter((cv) => cv.job.toLowerCase().includes(job.toLowerCase()));
  },
  GetCvByOwnerId: (parent, { ownerId }) => {
    return db.cvs.filter((cv) => cv.ownerId == ownerId);
  },
  
  GetCvsBySkill: (parent, { skillId }) => {
    return db.cvs.filter((cv) =>
      cv.skillIds.includes(skillId)
    );
  },

  GetSkills: () => db.skills,

  GetSkill: (parent, { id }) => {
    const skill = db.skills.find((skill) => skill.id == id);
    if (!skill) throw new Error(`Skill with id ${id} not found`);
    return skill;
  },

  GetSkillsByName: (parent, { name }) => {
    return db.skills.filter((skill) =>
      skill.designation.toLowerCase().includes(name.toLowerCase())
    );
  },
  prismaGetUsers: async () => {
    return await prisma.user.findMany();
  },

  prismaGetUserById: async (parent, { id }) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error(`User with id ${id} not found`);
    return user;
  },

  prismaGetCvs: async () => {
    return await prisma.cv.findMany({
      include: { user: true, skills: true },
    });
  },

  prismaGetCv: async (parent, { id }) => {
    const cv = await prisma.cv.findUnique({
      where: { id },
      include: { user: true, skills: true },
    });
    if (!cv) throw new Error(`CV with id ${id} not found`);
    return cv;
  },
};
