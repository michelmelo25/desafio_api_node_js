import fastify from "fastify";
import { eq } from "drizzle-orm";
import {
  validatorCompiler,
  serializerCompiler,
  type ZodTypeProvider,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import { fastifySwagger } from "@fastify/swagger";
import { db } from "./src/database/client.ts";
import { courses } from "./src/database/schema.ts";
import { creatCoursesRoute } from "./src/routes/create-course.ts";
import { getCoursesRoute } from "./src/routes/get-courses.ts";
import { getCourseByIdRoute } from "./src/routes/get-course-by-id.ts";
import scalarAPIReference from "@scalar/fastify-api-reference";

const server = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>();

if (process.env.NODE_ENV === "develompment") {
  server.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Desafio Node.js",
        version: "1.0.0",
      },
    },
    transform: jsonSchemaTransform,
  });

  server.register(scalarAPIReference, {
    routePrefix: "/docs",
    configuration: {
      theme: "kepler",
    },
  });
}

server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);

server.register(creatCoursesRoute);
server.register(getCoursesRoute);
server.register(getCourseByIdRoute);
//server.register(creatCoursesRoute)
//server.register(creatCoursesRoute)

server.delete("/courses/:id", async (request, replay) => {
  type Params = {
    id: string;
  };

  const params = request.params as Params;
  const courseID = params.id;

  const result = await db
    .delete(courses)
    .where(eq(courses.id, courseID))
    .returning();

  if (result.length > 0) {
    return replay.status(200).send({ coursesDeleted: result });
  }

  return replay.status(404).send();
});

server.patch("/courses/:id", async (request, replay) => {
  type Body = {
    title: string;
    description: string;
  };
  type Params = {
    id: string;
  };

  const params = request.params as Params;
  const body = request.body as Body;
  const courseID = params.id;
  const courseTitle = body.title;
  const courseDescription = body.description;

  if (!courseTitle && !courseDescription) {
    return replay.status(400).send({
      messege:
        "Titulo ou descrição deve ser informado para realizar a atualização!",
    });
  }

  const result = await db
    .update(courses)
    .set({ title: courseTitle, description: courseDescription })
    .where(eq(courses.id, courseID))
    .returning();

  if (result.length > 0) {
    return replay.status(200).send({ courseUpdate: result[0] });
  }
  return replay.status(404).send();
});

server.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running!");
});
