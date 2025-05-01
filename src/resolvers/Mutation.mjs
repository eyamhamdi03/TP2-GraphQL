import { db } from "../db/db.mjs"
export const Mutation ={
    CreateCv:(parent,{name,age,job,ownerId,skillIds},context,info)=> {
if (!db.users.some((user)=>user.id==ownerId))
{
    throw new Error (`User with id ${ownerId} not found`);
}
else {
    const lastId = db.cvs.length ? db.cvs[db.cvs.length - 1].id : 0;
    const newCv = {
        id : lastId + 1,
        name,
        age,
        job,
        ownerId,
        skillIds
    }
    db.cvs.push(newCv);
    return(newCv);
}
    }
}
