import fastify from "fastify"
import {eq} from 'drizzle-orm'
import { db } from "./src/database/client.ts"
import { courses } from "./src/database/schema.ts"

const server = fastify({
    logger: {
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        },
    }
})


server.get('/courses', async (request, replay) => {
    const result = await db.select().from(courses)

    return replay.send({courses: result})
})

server.get('/courses/:id', async(request, replay) => {
    type Params = {
        id: string
    }

    const params = request.params as Params
    const courseID = params.id

    const result = await db
    .select()
    .from(courses)
    .where(eq(courses.id,courseID))

    if (result.length > 0) {
        return replay.status(200).send({ course: result[0] })
    }

    return replay.status(404).send()
})

server.post('/courses', async (request, reply) => {
    type Body = {
        title: string
        description: string
    }

    const body = request.body as Body
    const courseTitle = body.title
    const courseDescription = body.description

    if (!courseTitle) {
        return reply.status(400).send({ message: 'Título Obrigatorio.' })
    }

    const result = await db.
    insert(courses)
    .values({
        title: courseTitle,
        description: courseDescription,})
    .returning()

    return reply.status(201).send({ coursedID: result[0].id })
})

server.delete('/courses/:id', async (request, replay) => {
    type Params = {
        id: string
    }

    const params = request.params as Params
    const courseID = params.id
    
    const result = await db.delete(courses).where(eq(courses.id,courseID)).returning()

    
    if(result.length > 0){
        return replay.status(200).send({coursesDeleted: result})
    }

    return replay.status(404).send()
})

server.patch('/courses/:id', async (request, replay) => {
    type Body = {
        title: string
        description: string
    }
    type Params = {
        id: string
    }

    const params = request.params as Params
    const body = request.body as Body
    const courseID = params.id
    const courseTitle = body.title
    const courseDescription = body.description

    if(!courseTitle && !courseDescription){
        return replay.status(400).send({messege: "Titulo ou descrição deve ser informado para realizar a atualização!"})
    }

    const result = await db
    .update(courses)
    .set({title: courseTitle, description: courseDescription})
    .where(eq(courses.id, courseID))
    .returning()

    if(result.length > 0){
        return replay.status(200).send({courseUpdate: result[0]})
    }
    return replay.status(404).send()
})


server.listen({ port: 3333 }).then(() => {
    console.log('HTTP server running!')
})