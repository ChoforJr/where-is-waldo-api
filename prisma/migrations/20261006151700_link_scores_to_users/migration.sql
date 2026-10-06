ALTER TABLE "Gameplay" ADD COLUMN "userId" INTEGER;
CREATE INDEX "Gameplay_userId_idx" ON "Gameplay"("userId");
ALTER TABLE "Gameplay" ADD CONSTRAINT "Gameplay_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
