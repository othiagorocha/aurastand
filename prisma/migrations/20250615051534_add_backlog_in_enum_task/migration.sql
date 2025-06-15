-- AlterEnum
ALTER TYPE "TaskStatus" ADD VALUE 'BACKLOG';

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
