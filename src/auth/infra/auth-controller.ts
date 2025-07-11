import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { app } from "../..";
import { loginUserUseCase } from "../application/login-user.usecase";
import { signupUserUseCase } from "../application/signup-user.usecase";

interface LoginBody {
  email: string;
  password: string;
}
interface SignUpBody {
  userName: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
}

app.post(
  "/auth/login",
  async (request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) => {
    const { email, password } = request.body;

    const {
      status,
      message,
      data: token,
    } = await loginUserUseCase(email, password);

    if (status != 200) {
      return reply.status(status).send(message);
    }
    const response: AuthResponse = { token };

    return reply.status(200).send(response);
  }
);
app.post(
  "/auth/signup",
  async (
    request: FastifyRequest<{ Body: SignUpBody }>,
    reply: FastifyReply
  ) => {
    const { userName, email, password } = request.body;

    const {
      status,
      message,
      data: token,
    } = await signupUserUseCase(userName, email, password);

    if (status != 200) {
      return reply.status(status).send(message);
    }
    const response: AuthResponse = { token };

    return reply.status(200).send(response);
  }
);
