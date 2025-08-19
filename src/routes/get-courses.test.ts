import { test, expect } from "vitest";
import { server } from "../app.ts";
import { randomUUID } from "node:crypto";
import supertest from "supertest";
import { makeCourse } from "../test/factories/make-course.ts";

test("get courses", async () => {
  await server.ready();

  const titleID = randomUUID();
  const course = await makeCourse(titleID);

  const response = await supertest(server.server).get(
    `/courses?search=${titleID}`
  );

  expect(response.status).toEqual(200);
  expect(response.body).toEqual({
    total: 1,
    courses: [
      {
        id: expect.any(String),
        title: titleID,
        description: expect.any(String),
        enrollments: 0,
      },
    ],
  });
});
