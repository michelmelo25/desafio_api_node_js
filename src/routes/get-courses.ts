import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../database/client.ts'
import { courses } from '../database/schema.ts'
import z from 'zod'

export const getCoursesRoute:FastifyPluginAsyncZod = async (server) => {
    server.get('/courses', {
        schema: {
            tags: ['courses'],
            summary: 'Busco todos os cursos criados',
            description: 'Essa rota retorna todos os cursos criados no banco de dados',
            response: {
                200: z.object({
                    courses: z.array(
                        z.object({
                            id: z.uuid(),
                            title: z.string(),
                            description: z.string().nullable(),
                        })
                    )
                })                 
                }
            }
        },async (request, replay) => {
        const result = await db.select().from(courses)

        return replay.send({courses: result})
    })
}