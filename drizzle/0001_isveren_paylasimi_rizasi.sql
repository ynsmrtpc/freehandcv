CREATE TABLE "rizalar" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kullanici_id" text NOT NULL,
	"tur" text NOT NULL,
	"verildi" boolean NOT NULL,
	"metin_surumu" text NOT NULL,
	"kaynak" text NOT NULL,
	"olusturma" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "isveren_paylasimi" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "paylasilan_cv_id" text;--> statement-breakpoint
ALTER TABLE "rizalar" ADD CONSTRAINT "rizalar_kullanici_id_user_id_fk" FOREIGN KEY ("kullanici_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "rizalar_kullanici_id_tur_olusturma_index" ON "rizalar" USING btree ("kullanici_id","tur","olusturma");