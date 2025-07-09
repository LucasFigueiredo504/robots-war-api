import { eq } from "drizzle-orm";
import { db } from "../../db";
import { gamesTable } from "../../db/schema";

export class ResourcesRepository {
  static async updateGoldAmount(
    newAmount: number,
    unitId: number
  ): Promise<void> {
    await db
      .update(gamesTable)
      .set({ gold: String(newAmount) })
      .where(eq(gamesTable.id, unitId));
  }
  static async updateFuelAmount(
    newAmount: number,
    unitId: number
  ): Promise<void> {
    await db
      .update(gamesTable)
      .set({ fuel: String(newAmount) })
      .where(eq(gamesTable.id, unitId));
  }
  static async updateMetaldAmount(
    newAmount: number,
    unitId: number
  ): Promise<void> {
    await db
      .update(gamesTable)
      .set({ metal: String(newAmount) })
      .where(eq(gamesTable.id, unitId));
  }
}
