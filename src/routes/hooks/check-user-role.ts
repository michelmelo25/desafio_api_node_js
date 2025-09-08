import type { FastifyRequest, FastifyReply } from "fastify";
import { getAuthenticatedUserFromRequest } from "../../utils/get-authenticated-user-from-request.ts";

type JWTPayload = {
    sub: string
    role: 'student' | 'manager'
}

export function checkUserRole(role: 'student' | 'manager'){
    return async function (request: FastifyRequest, reply: FastifyReply) {
      const user = getAuthenticatedUserFromRequest(request)

      if(user.role !== role){
        return reply.status(401).send()
      }

    }
}
