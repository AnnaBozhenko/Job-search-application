import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Create users
  const user1 = await prisma.user.create({
    data: {
      email: 'employer@test.com',
      password: await bcrypt.hash('password123', 10),
      role: 'employer',
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'jobseeker1@test.com',
      password: await bcrypt.hash('password123', 10),
      role: 'jobseeker',
    },
  })

  const user3 = await prisma.user.create({
    data: {
      email: 'jobseeker2@test.com',
      password: await bcrypt.hash('password123', 10),
      role: 'jobseeker',
    },
  })
 
  // create ContactInfo for employer
  const contactInfoUser1 = await prisma.contactInfo.create({
    data: {
      email: user1.email,
      phone: '1234567890',
    },
  });

  // Create employer
  const employer = await prisma.employer.create({
    data: {
      userId: user1.id,
      companyName: 'Test Company',
      staffNUpperLimit: 100,
      contactInfoId: contactInfoUser1.id,
    },
  })

  // create ContactInfo for job-seeker 1
  const contactInfoUser2 = await prisma.contactInfo.create({
    data: {
      email: user2.email,
      phone: '1234567890',
    },
  });

  // Create job seeker 1
  const jobSeeker1 = await prisma.jobSeeker.create({
    data: {
      userId: user2.id,
      contactInfoId: contactInfoUser2.id,
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1990-01-01'),
    },
  })

  // create ContactInfo for job-seeker 2
  const contactInfoUser3 = await prisma.contactInfo.create({
    data: {
      email: user3.email,
      phone: '1234567890',
    },
  });  

    // Create job seeker 2
    const jobSeeker2 = await prisma.jobSeeker.create({
        data: {
          userId: user3.id,
          contactInfoId: contactInfoUser3.id,
          firstName: 'Sophie',
          lastName: 'Lorence',
          dateOfBirth: new Date('1980-01-01'),
        },
      })

  // Create job category
  const category = await prisma.jobCategory.create({
    data: {
      name: 'Backend Development',
    },
  })

  // Create vacancy
  const vacancy = await prisma.vacancy.create({
    data: {
      employerId: employer.id,
      title: 'JS/TS Developer',
      jobCategoryId: category.id,
      description: 'We are looking for a skilled software developer',
      occupationType: 'Full-time',
      publicationDate: new Date(),
    },
  })

  // Create resume for job seeker 1
  const resume1 = await prisma.resume.create({
    data: {
      jobSeekerId: jobSeeker1.id,
      description: 'Experienced TS/JS developer with 5 years of experience',
    },
  })

  // Create resume for job seeker 1
  const resume2 = await prisma.resume.create({
    data: {
      jobSeekerId: jobSeeker1.id,
      description: 'Experienced Python developer with 3 years of experience',
    },
  })

  console.log({ user1, user2, user3, employer, jobSeeker1, jobSeeker2, category, vacancy, resume1, resume2 })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })