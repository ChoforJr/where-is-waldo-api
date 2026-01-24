-- CreateTable
CREATE TABLE "Gameplay" (
    "id" SERIAL NOT NULL,
    "level" INTEGER NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endAt" TIMESTAMP(3),
    "waldo" BOOLEAN NOT NULL DEFAULT false,
    "wenda" BOOLEAN NOT NULL DEFAULT false,
    "wizard" BOOLEAN NOT NULL DEFAULT false,
    "odlaw" BOOLEAN NOT NULL DEFAULT false,
    "player" TEXT,

    CONSTRAINT "Gameplay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Gameplay_player_key" ON "Gameplay"("player");
