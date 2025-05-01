import { db } from "../db/db.mjs";
export const Cv = {
    owner: (parent) => {
        return db.users.find((user) => user.id == parent.ownerId);
    },
    skills: (parent) => {
        return db.skills.filter((skill) => parent.skillIds.includes(skill.id));
    },
    }; 