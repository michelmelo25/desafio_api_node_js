import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../database/client.ts";
import { courses, enrollments } from "../database/schema.ts";
import { ilike, asc, and, SQL, eq, count } from "drizzle-orm";
import z from "zod";
import { id } from "zod/locales";
import { checkRequestJwt } from "./hooks/check-request-jwt.ts";

export const getCoursesRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/courses",
    {
      preHandler: [
        checkRequestJwt,
      ],
      schema: {
        tags: ["courses"],
        summary: "Busco todos os cursos criados",
        description:
          "Essa rota retorna todos os cursos criados no banco de dados",
        querystring: z.object({
          search: z.string().optional(),
          orderBy: z.enum(["title"]).optional().default("title"),
          page: z.coerce.number().optional().default(1),
          limite: z.coerce.number().optional().default(10),
        }),
        response: {
          200: z.object({
            courses: z
              .array(
                z.object({
                  id: z.uuid(),
                  title: z.string().describe("Título do curso"),
                  description: z
                    .string()
                    .nullable()
                    .describe("Descrição do curso"),
                  enrollments: z.number().describe("Número de matrículas"),
                })
              )
              .describe("Lista de cursos"),
            total: z.number().describe("Total de cursos encontrados"),
          }),
        },
      },
    },
    async (request, replay) => {
      const { search, orderBy, page, limite } = request.query;

      const conditions: SQL[] = [];

      if (search) {
        conditions.push(ilike(courses.title, `%${search}%`));
      }

      const [result, total] = await Promise.all([
        db
          .select({
            id: courses.id,
            title: courses.title,
            description: courses.description,
            enrollments: count(enrollments.id).as("enrollmentsCount"),
          })
          .from(courses)
          .leftJoin(enrollments, eq(enrollments.coursesId, courses.id))
          .orderBy(asc(courses[orderBy]))
          .offset((page - 1) * 2)
          .limit(limite)
          .where(and(...conditions))
          .groupBy(courses.id),
        db.$count(courses, and(...conditions)),
      ]);

      return replay.send({ courses: result, total: total });
    }
  );
};
