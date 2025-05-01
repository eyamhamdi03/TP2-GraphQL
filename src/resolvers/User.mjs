import { db } from "../db/db.mjs";
export const User = {
    Cvs: (parent) => {
        return db.cvs.filter((cv) => cv.ownerId == parent.id);
    },
}