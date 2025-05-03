import { db } from "../db/db.mjs"

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const Mutation ={
    CreateCv: (parent, { input }, context) => {
        const { pubsub } = context;
        const { name, age, job, ownerId, skillIds } = input;

        if (!db.users.some((user) => user.id == ownerId)) {
            throw new Error(`User with id ${ownerId} not found`);
        }

        skillIds.forEach((skillId) => {
            if (!db.skills.some((skill) => skill.id == skillId)) {
                throw new Error(`Skill with id ${skillId} not found`);
            }
        });

        const newCv = {
            id: db.cvs.length ? db.cvs[db.cvs.length - 1].id + 1 : 1,
            name,
            age,
            job,
            ownerId,
            skillIds
        };

        db.cvs.push(newCv);
        pubsub.publish('cvChanged', {
            cvChanged: {
              type: 'CREATED',
              cv: newCv
            }
          });
        console.log('Published cvChanged event');
        return newCv;
    },
    UpdateCv: (parent, { input }, context) => {
        const { pubsub } = context;
        const { id, name, age, job, ownerId, skillIds } = input;
    
        const cv = db.cvs.find((cv) => cv.id == id);
        if (!cv) {
            throw new Error(`CV with id ${id} not found`);
        }
    
        if (ownerId) {
            if (!db.users.some((user) => user.id == ownerId)) {
                throw new Error(`User with id ${ownerId} not found`);
            }
            cv.ownerId = ownerId;
        }
    
        if (skillIds) {
            skillIds.forEach((skillId) => {
                if (!db.skills.some((skill) => skill.id == skillId)) {
                    throw new Error(`Skill with id ${skillId} not found`);
                }
            });
            cv.skillIds = skillIds;
        }
    
        if (name !== undefined) cv.name = name;
        if (age !== undefined) cv.age = age;
        if (job !== undefined) cv.job = job;
    
        pubsub.publish('cvChanged', {
            cvChanged: {
                type: 'UPDATED',
                cv: cv
            }
        });
    
        return cv;
    },
    
    DeleteCv: (parent, { id }, context) => {
        const { pubsub } = context;
        const cvIndex = db.cvs.findIndex((cv) => cv.id == id);
    
        if (cvIndex === -1) {
            throw new Error(`CV with id ${id} not found`);
        }
    
        const deletedCv = db.cvs[cvIndex];
        pubsub.publish('cvChanged', {
            cvChanged: {
              type: 'DELETED',
              cv: deletedCv
            }
          });
        db.cvs.splice(cvIndex, 1);
        return deletedCv;
    },
    
    CreateCvWithPrisma: async (_, { input }, { pubsub }) => {
        try {
          const { name, age, job, ownerId, skillIds } = input;
    
          // Check if user exists
          const userExists = await prisma.user.findUnique({
            where: { id: ownerId },
          });
          if (!userExists) {
            throw new Error(`User with id ${ownerId} not found`);
          }
    
          // Check if skills exist
          const skillsExist = await prisma.skill.findMany({
            where: {
              id: { in: skillIds },
            },
          });
          if (skillsExist.length !== skillIds.length) {
            throw new Error('One or more skills not found');
          }
    
          const cv = await prisma.cv.create({
            data: {
              name,
              age,
              job,
              userId: ownerId,
              skills: {
                connect: skillIds.map((id) => ({ id })),
              },
            },
            include: {
              owner: true,
              skills: true,
            },
          });
    
          // Publish event for subscriptions
          pubsub.publish('CV_CHANGED', {
            cvChanged: {
              type: 'CREATED',
              cv,
            },
          });
    
          return cv;
        } catch (error) {
          console.error('Error creating CV:', error);
          throw new Error('Failed to create CV');
        }
      },
    
      // Update a CV using Prisma
      UpdateCvWithPrisma: async (_, { input }, { pubsub }) => {
        try {
          const { id, name, age, job, ownerId, skillIds } = input;
    
          // Check if CV exists
          const cv = await prisma.cv.findUnique({ where: { id } });
          if (!cv) {
            throw new Error(`CV with id ${id} not found`);
          }
    
          // Check if user exists
          if (ownerId) {
            const userExists = await prisma.user.findUnique({
              where: { id: ownerId },
            });
            if (!userExists) {
              throw new Error(`User with id ${ownerId} not found`);
            }
          }
    
          // Check if skills exist
          if (skillIds) {
            const skillsExist = await prisma.skill.findMany({
              where: { id: { in: skillIds } },
            });
            if (skillsExist.length !== skillIds.length) {
              throw new Error('One or more skills not found');
            }
          }
    
          const updatedCv = await prisma.cv.update({
            where: { id },
            data: {
              name,
              age,
              job,
              userId: ownerId || cv.userId, // Only update if ownerId is provided
              skills: {
                set: skillIds ? skillIds.map((id) => ({ id })) : cv.skills, // Update skills if provided
              },
            },
            include: {
              owner: true,
              skills: true,
            },
          });
    
          // Publish event for subscriptions
          pubsub.publish('CV_CHANGED', {
            cvChanged: {
              type: 'UPDATED',
              cv: updatedCv,
            },
          });
    
          return updatedCv;
        } catch (error) {
          console.error('Error updating CV:', error);
          throw new Error('Failed to update CV');
        }
      },
    
      // Delete a CV using Prisma
      DeleteCvWithPrisma: async (_, { id }, { pubsub }) => {
        try {
          const cv = await prisma.cv.delete({
            where: { id },
            include: {
              owner: true,
              skills: true,
            },
          });
    
          // Publish event for subscriptions
          pubsub.publish('CV_CHANGED', {
            cvChanged: {
              type: 'DELETED',
              cv,
            },
          });
    
          return cv;
        } catch (error) {
          console.error('Error deleting CV:', error);
          throw new Error('Failed to delete CV');
        }
      },

    };