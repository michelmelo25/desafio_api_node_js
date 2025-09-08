import { fakerPT_BR as faker } from "@faker-js/faker";
import { db } from "../../database/client.ts";
import { hash } from "argon2";
import { randomUUID } from "node:crypto";
import jwt from 'jsonwebtoken' 
import { users } from "../../database/schema.ts";

export async function makeUser(role?: 'manager' |'student') {

    const passwordBeforeHash = randomUUID()

    const result = await db
    .insert(users)
    .values({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        role,
        password: await hash(passwordBeforeHash),
    })
    .returning();

  return {user: result[0], passwordBeforeHash};
}

export async function makeAutheticatedUser(role: 'manager' |'student'){
  const {user} = await makeUser(role);

  if(!process.env.JWT_SECRET){
    throw new Error('JWT_SECRET is required.')
  }

   const token = jwt.sign({ sub: user.id, role: user.role}, process.env.JWT_SECRET)
  
   return { user, token }
}