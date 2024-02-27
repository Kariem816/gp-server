/*
  Warnings:

  - The values [waste] on the enum `ControlElement` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ControlElement_new" AS ENUM ('attendance', 'gate', 'parking', 'garbage', 'irrigation', 'lighting', 'image');
ALTER TABLE "Controller" ALTER COLUMN "controls" TYPE "ControlElement_new"[] USING ("controls"::text::"ControlElement_new"[]);
ALTER TYPE "ControlElement" RENAME TO "ControlElement_old";
ALTER TYPE "ControlElement_new" RENAME TO "ControlElement";
DROP TYPE "ControlElement_old";
COMMIT;
