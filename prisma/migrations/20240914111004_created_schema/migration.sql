-- CreateTable
CREATE TABLE "app_user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_info" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "website_address" TEXT,
    "geo_location" TEXT,
    "phone" TEXT,

    CONSTRAINT "contact_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "job_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employer" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "company_name" TEXT NOT NULL,
    "contact_info_id" INTEGER NOT NULL,
    "logo_photo" TEXT,
    "staff_n_upper_limit" INTEGER NOT NULL,

    CONSTRAINT "employer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vacancy" (
    "id" SERIAL NOT NULL,
    "employer_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "job_category_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "occupation_type" TEXT NOT NULL,
    "publication_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vacancy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_seeker" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "target_role" TEXT,
    "contact_info_id" INTEGER NOT NULL,
    "photo" TEXT,
    "date_of_birth" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_seeker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resume" (
    "id" SERIAL NOT NULL,
    "job_seeker_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "resume_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "app_user_email_key" ON "app_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "contact_info_email_key" ON "contact_info"("email");

-- CreateIndex
CREATE UNIQUE INDEX "job_category_name_key" ON "job_category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "employer_userId_key" ON "employer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "employer_company_name_key" ON "employer"("company_name");

-- CreateIndex
CREATE UNIQUE INDEX "employer_contact_info_id_key" ON "employer"("contact_info_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_seeker_user_id_key" ON "job_seeker"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_seeker_contact_info_id_key" ON "job_seeker"("contact_info_id");

-- AddForeignKey
ALTER TABLE "employer" ADD CONSTRAINT "employer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employer" ADD CONSTRAINT "employer_contact_info_id_fkey" FOREIGN KEY ("contact_info_id") REFERENCES "contact_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vacancy" ADD CONSTRAINT "vacancy_employer_id_fkey" FOREIGN KEY ("employer_id") REFERENCES "employer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vacancy" ADD CONSTRAINT "vacancy_job_category_id_fkey" FOREIGN KEY ("job_category_id") REFERENCES "job_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_seeker" ADD CONSTRAINT "job_seeker_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_seeker" ADD CONSTRAINT "job_seeker_contact_info_id_fkey" FOREIGN KEY ("contact_info_id") REFERENCES "contact_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume" ADD CONSTRAINT "resume_job_seeker_id_fkey" FOREIGN KEY ("job_seeker_id") REFERENCES "job_seeker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
