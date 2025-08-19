import { fakerPT_BR as faker } from "@faker-js/faker";
import { db } from "../../database/client.ts";
import { courses } from "../../database/schema.ts";

export async function makeCourse(title?: string) {
  const result = await db
    .insert(courses)
    .values({
      title: title ?? faker.book.title(),
      description: faker.lorem.words(4),
    })
    .returning();

  return result[0];
}
