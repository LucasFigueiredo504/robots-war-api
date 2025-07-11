import { app } from "../..";
import { AuthRepository } from "../infra/auth.repository";
import bcrypt from "bcrypt";

export async function signupUserUseCase(
  userName: string,
  email: string,
  password: string
) {
  try {
    const existingUser = await AuthRepository.findUserByEmail(email);

    if (existingUser) {
      return { status: 409, message: "User already exists" };
    }
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await AuthRepository.createUser(userName, email, passwordHash);

    // Use fastify.jwt.sign
    const token = app.jwt.sign({ id: user?.id, email: user?.email });

    return { status: 200, message: "success", data: token };
  } catch (error) {
    console.log(error);
    return { status: 500, message: "error" };
  }
}
