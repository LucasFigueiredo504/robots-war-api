CREATE TABLE "games" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "games_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"gold" numeric DEFAULT '0',
	"metl" numeric DEFAULT '0',
	"fuel" numeric DEFAULT '0',
	"level" numeric DEFAULT '0',
	"lst_online" timestamp DEFAULT now(),
	"last_time_base_spawned" timestamp DEFAULT now(),
	"unlocked_units" numeric[] DEFAULT '{}',
	"owned_units" integer[] DEFAULT '{}',
	"player_id" varchar NOT NULL,
	CONSTRAINT "games_player_id_unique" UNIQUE("player_id")
);
--> statement-breakpoint
CREATE TABLE "players" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "players_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	CONSTRAINT "players_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "units" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "units_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"pos_x" numeric NOT NULL,
	"pos_y" numeric NOT NULL,
	"level" numeric NOT NULL,
	"current_hp" numeric NOT NULL,
	"current_level" numeric NOT NULL,
	"type_id" varchar NOT NULL,
	"resource_amount" numeric NOT NULL,
	"last_time_collected" timestamp DEFAULT now(),
	"is_ready" boolean DEFAULT true,
	"available" boolean DEFAULT true,
	"game_id" integer NOT NULL
);
