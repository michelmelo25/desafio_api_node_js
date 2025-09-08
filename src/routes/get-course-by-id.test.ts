import { test, expect } from "vitest";
import { server } from "../app.ts";
import supertest from "supertest";
import { makeCourse } from "../test/factories/make-course.ts";
import { makeAutheticatedUser } from "../test/factories/make-users.ts";

test("get course by id", async () => {
  await server.ready();

  const { token } = await makeAutheticatedUser('student')
  const course = await makeCourse();

  const response = await supertest(server.server).
    get(`/courses/${course.id}`)
    .set('Authorization', token);

  expect(response.status).toEqual(200);
  expect(response.body).toEqual({
    course: {
      id: expect.any(String),
      title: expect.any(String),
      description: expect.any(String),
    },
  });
});

test("return 404 for non exist course", async () => {
  await server.ready();
  const { token } = await makeAutheticatedUser('student')

  const nonExistentId = "e7b8a9c2-4f3a-4d2a-9c1e-2b7a8c9d1e2f"; // exemplo de UUID válido
  const response = await supertest(server.server)
    .get(`/courses/${nonExistentId}`)
    .set('Authorization', token);

  expect(response.status).toEqual(404);
});
