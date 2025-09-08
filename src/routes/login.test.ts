import { test, expect } from "vitest";
import { server } from "../app.ts";
import supertest from "supertest";
import { fakerPT_BR as faker } from "@faker-js/faker";
import { makeUser } from "../test/factories/make-users.ts";

test("login com sucesso", async () => {
  await server.ready();

  const { user, passwordBeforeHash} = await makeUser()

  const response = await supertest(server.server)
    .post("/sessions")
    .set("Content-Type", "application/json")
    .send({ email: user.email, password: passwordBeforeHash });

  expect(response.status).toEqual(200);
  expect(response.body).toEqual({
    token: expect.any(String)
  });
});
