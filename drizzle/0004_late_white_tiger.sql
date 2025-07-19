ALTER TABLE "units" ALTER COLUMN "level" SET DATA TYPE numeric(5, 0);--> statement-breakpoint
ALTER TABLE "units" ALTER COLUMN "current_hp" SET DATA TYPE numeric(7, 2);--> statement-breakpoint
ALTER TABLE "units" ALTER COLUMN "current_level" SET DATA TYPE numeric(5, 0);--> statement-breakpoint
ALTER TABLE "units" ALTER COLUMN "resource_amount" SET DATA TYPE numeric(12, 4);