-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "controllerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_key_key" ON "ApiKey"("key");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_name_controllerId_key" ON "ApiKey"("name", "controllerId");

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_controllerId_fkey" FOREIGN KEY ("controllerId") REFERENCES "Controller"("id") ON DELETE CASCADE ON UPDATE CASCADE;
