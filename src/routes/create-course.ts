import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../database/client.ts";
import { courses } from "../database/schema.ts";
import z from "zod";

export const creatCoursesRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/courses",
    {
      schema: {
        tags: ["courses"],
        summary: "Cria um curso",
        description:
          "Essa rota recebe um título e uma descrição e cria um curso no banco de dados",
        body: z.object({
          title: z.string().min(5, "Titulo prescisa ter no minimo 5 caracter"),
          description: z.string().optional(),
        }),
        response: {
          201: z
            .object({ courseId: z.uuid() })
            .describe("Curso criado com sucesso!"),
          400: z
            .object({ message: z.string() })
            .describe("Parametro obrigatorio não informado"),
        },
      },
    },
    async (request, reply) => {
      const courseTitle = request.body.title;
      const courseDescription = request.body.description;

      if (!courseTitle) {
        return reply.status(400).send({ message: "Título Obrigatorio." });
      }
      console.log(courseTitle, courseDescription);
      const result = await db
        .insert(courses)
        .values({
          title: courseTitle,
          description: courseDescription,
        })
        .returning();

      return reply.status(201).send({ courseId: result[0].id });
    }
  );
};
