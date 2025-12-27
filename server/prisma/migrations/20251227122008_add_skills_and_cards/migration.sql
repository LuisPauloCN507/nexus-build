-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Character" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "buildDetails" TEXT NOT NULL,
    "strategy" TEXT,
    "speed" TEXT,
    "stamina" TEXT,
    "power" TEXT,
    "guts" TEXT,
    "wisdom" TEXT,
    "recommendedSkills" TEXT,
    "supportCards" TEXT,
    "sourceName" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    CONSTRAINT "Character_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Character" ("buildDetails", "gameId", "guts", "id", "imageUrl", "name", "power", "sourceName", "sourceUrl", "speed", "stamina", "strategy", "tier", "wisdom") SELECT "buildDetails", "gameId", "guts", "id", "imageUrl", "name", "power", "sourceName", "sourceUrl", "speed", "stamina", "strategy", "tier", "wisdom" FROM "Character";
DROP TABLE "Character";
ALTER TABLE "new_Character" RENAME TO "Character";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
