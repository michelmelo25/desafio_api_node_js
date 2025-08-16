// const fastify = require('fastify')
// const crypto = require('crypto')

import fastify from "fastify"
import crypto from 'node:crypto'

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

const courses = [
    { id: '1', title: 'Curso de Node.js' },
    { id: '2', title: 'Curso de React' },
    { id: '3', title: 'Curso de React Native' },

]

server.get('/courses', () => {
    return { courses }
})

server.get('/courses/:id', (request, replay) => {
    type Params = {
        id: string
    }

    const params = request.params as Params
    const courseID = params.id

    const course = courses.find(course => course.id === courseID)

    if (course) {
        return { course }
    }

    return replay.status(404).send()
})

server.post('/courses', (request, reply) => {
    type Body = {
        title: string
    }

    const coursedID = crypto.randomUUID()
    const body = request.body as Body
    const courseTitle = body.title

    if (!courseTitle) {
        return reply.status(400).send({ message: 'Título Obrigatorio.' })
    }

    courses.push({ id: coursedID, title: courseTitle })

    return reply.status(201).send({ coursedID })
})

server.delete('/courses/:id', (request, replay) => {
    type Params = {
        id: string
    }

    const params = request.params as Params
    const courseID = params.id
    const courseIndex = courses.findIndex(course => course.id === courseID)

    
    if(courseIndex > -1){
        courses.splice(courseIndex,1)
        return replay.status(200).send()
    }

    return replay.status(404).send()
})

server.patch('/courses/:id', (request, replay) => {
    type Body = {
        title: string
    }
    type Params = {
        id: string
    }

    const params = request.params as Params
    const body = request.body as Body
    const courseID = params.id
    const courseTitle = body.title

    const courseIndex = courses.findIndex(course => course.id === courseID)

    if(courseIndex > -1){
        courses[courseIndex].title = courseTitle
        return replay.status(200).send()
    }
    return replay.status(404).send()
})


server.listen({ port: 3333 }).then(() => {
    console.log('HTTP server running!')
})