import { app } from "../..";
import { AuthRepository } from "../infra/auth.repository";
import bcrypt from "bcrypt";

export async function loginUserUseCase(email: string, password: string) {
  try {
    const user = await AuthRepository.findUserByEmail(email);

    if (!user) {
      return { status: 401, message: "Invalid credentials" };
    }
    const doesPasswordMatch = bcrypt.compare(password, user.passwordHash);

    if (!doesPasswordMatch) {
      return { status: 401, message: "Invalid credentials" };
    }

    // Use fastify.jwt.sign
    const token = app.jwt.sign({ id: user.id, email: user.email });

    return { status: 200, message: "success", data: token };
  } catch (error) {
    return { status: 500, message: "error", error };
  }
}
