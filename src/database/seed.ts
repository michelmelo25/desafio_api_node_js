import { db } from "./client.ts";
import { courses, enrollments, users } from "./schema.ts";
import { hash } from 'argon2'
import { fakerPT_BR as faker } from "@faker-js/faker";

async function seed() {}

const passwordHash = await hash('123456')

const usersInsert = await db
  .insert(users)
  .values([
    { name: faker.person.fullName(), 
      email: faker.internet.email(),
      role: 'student',
      password: passwordHash,
    },
    { name: faker.person.fullName(), 
      email: faker.internet.email(),
      role: 'student',
      password: passwordHash,
    },
    { name: faker.person.fullName(), 
      email: faker.internet.email(),
      role: 'student',
      password: passwordHash,
    },
    { name: faker.person.fullName(), 
      email: faker.internet.email(),
      role: 'student',
      password: passwordHash,
    },
    { name: faker.person.fullName(), 
      email: faker.internet.email(),
      role: 'student',
      password: passwordHash,
    },
    { name: faker.person.fullName(), 
      email: faker.internet.email(),
      role: 'student',
      password: passwordHash,
    },
    { name: faker.person.fullName(), 
      email: faker.internet.email(),
      role: 'student',
      password: passwordHash,
    },
  ])
  .returning();

const coursesInsert = await db
  .insert(courses)
  .values([
    { title: faker.book.title(), description: faker.lorem.words(4) },
    { title: faker.book.title(), description: faker.lorem.words(4) },
  ])
  .returning();

await db.insert(enrollments).values([
  { coursesId: coursesInsert[0].id, userId: usersInsert[0].id },
  { coursesId: coursesInsert[0].id, userId: usersInsert[1].id },
  { coursesId: coursesInsert[0].id, userId: usersInsert[2].id },
  { coursesId: coursesInsert[0].id, userId: usersInsert[3].id },
  { coursesId: coursesInsert[1].id, userId: usersInsert[4].id },
  { coursesId: coursesInsert[1].id, userId: usersInsert[5].id },
  { coursesId: coursesInsert[1].id, userId: usersInsert[6].id },
]);

seed();
