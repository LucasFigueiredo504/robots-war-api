import { eq } from "drizzle-orm";
import { db } from "../../db";
import { playersTable } from "../../db/schema";

type UserRecord = {
  id: number;
  userName: string;
  email: string;
  passwordHash: string;
};

export class AuthRepository {
  static async findUserByEmail(email: string): Promise<UserRecord | null> {
    const user = await db
      .select()
      .from(playersTable)
      .where(eq(playersTable.email, email));

    return user[0];
  }
  static async createUser(
    userName: string,
    email: string,
    password: string
  ): Promise<UserRecord | null> {
    const user = await db
      .insert(playersTable)
      .values({ userName, email, passwordHash: password })
      .returning();

    return user[0] || null;
  }
}
