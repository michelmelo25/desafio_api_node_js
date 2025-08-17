import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../database/client.ts";
import { courses } from "../database/schema.ts";
import z from "zod";
import { eq } from "drizzle-orm";

export const getCourseByIdRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/courses/:id",
    {
      schema: {
        tags: ["courses"],
        summary: "Busca curso pelo ID",
        description:
          "Essa rota retorna o curso correspondente ao ID informado no parametro",
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          200: z.object({
            course: z.object({
              id: z.uuid(),
              title: z.string(),
              description: z.string().nullable(),
            }),
          }),
          404: z.null().describe("Curso não encontrado"),
        },
      },
    },
    async (request, replay) => {
      const courseID = request.params.id;

      const result = await db
        .select()
        .from(courses)
        .where(eq(courses.id, courseID));

      if (result.length > 0) {
        return replay.status(200).send({ course: result[0] });
      }

      return replay.status(404).send();
    }
  );
};
