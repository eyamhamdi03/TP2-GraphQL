import { db } from "../db/db.mjs"

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
    
};


