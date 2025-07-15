ALTER TABLE "units" ALTER COLUMN "type_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "units" ADD COLUMN "instance_id" varchar NOT NULL;