-- AlterTable
ALTER TABLE "leads" ADD COLUMN     "courseDateId" TEXT;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_courseDateId_fkey" FOREIGN KEY ("courseDateId") REFERENCES "course_dates"("id") ON DELETE SET NULL ON UPDATE CASCADE;
