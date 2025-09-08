import { test, expect } from "vitest";
import { server } from "../app.ts";
import { randomUUID } from "node:crypto";
import supertest from "supertest";
import { makeCourse } from "../test/factories/make-course.ts";
import { makeAutheticatedUser } from "../test/factories/make-users.ts";

test("get courses", async () => {
  await server.ready();

  const titleId = randomUUID();
  const { token } = await makeAutheticatedUser('student')
  const course = await makeCourse(titleId)

  const response = await supertest(server.server)
    .get(`/courses?search=${titleId}`)
    .set('Authorization', token);

  expect(response.status).toEqual(200);
  expect(response.body).toEqual({    
    courses: [
      {
        id: expect.any(String),
        title: titleId,
        description: expect.any(String),
        enrollments: 0,
      },
    ],total: 1,
  });
});
