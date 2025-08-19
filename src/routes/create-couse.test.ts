import { test, expect } from "vitest";
import { server } from "../app.ts";
import supertest from "supertest";
import { fakerPT_BR as faker } from "@faker-js/faker";

test("Cria um curso com sucesso", async () => {
  await server.ready();

  const titleCourse = faker.book.title();
  const descriptionCourse = faker.lorem.words(4);

  const response = await supertest(server.server)
    .post("/courses")
    .set("Content-Type", "application/json")
    .send({ title: titleCourse, description: descriptionCourse });

  expect(response.status).toEqual(201);
  expect(response.body).toEqual({
    courseId: expect.any(String),
  });
});
