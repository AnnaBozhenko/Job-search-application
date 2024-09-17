import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET on many vacancies
export async function GET(_request: Request) {
    try {
        const vacancies = await prisma.vacancy.findMany({
            select: {
                employer: {
                    select: {
                        companyName: true,
                        contactInfo: {
                            select: {
                                email: true,
                            },
                        },
                    },
                },
                jobCategory: true,
                description: true,
                publicationDate: true,
            },
        });
        return NextResponse.json(vacancies);
    } catch(error) {
        console.error("Failed to fetch vacancies: ", error);
        return NextResponse.json({error: "Failed to find vacancies"}, {status: 500});
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { employerId, title, jobCategoryName, description, occupationType } = body;
        
        // check for obligatory fields
        if (!employerId || !title || !jobCategoryName || !description || !occupationType) {
            return NextResponse.json({error: "Missed required fields"}, {status: 400});
        }
        
        // validate jobCategory exists
        let jobCategoryId: number;
        try {
          const existingJobCategory = await prisma.jobCategory.findUniqueOrThrow({where: { name: jobCategoryName }});
          jobCategoryId = existingJobCategory.id;
        } catch (error) {
          const newJobCategory = await prisma.jobCategory.create( {data: { name: jobCategoryName } } );
          jobCategoryId = newJobCategory.id;
        }

        const vacancy = await prisma.vacancy.create({
            data: {
                employer: {connect: { id: employerId }},
                jobCategory: {connect: { id: jobCategoryId }},
                title: title,
                description: description,
                occupationType: occupationType,
                publicationDate: new Date(),
            },
            select: {
                employer: {
                    select: {
                        companyName: true,
                    },
                },
                title: true,
                jobCategory: true,
                description: true,
                publicationDate: true,
            },
        });

        return NextResponse.json({vacancy}, {status: 201})
    } catch (error) {
        console.error("Failed to create vacancy: ", error);
        return NextResponse.json({error: "Failed to create vacancy"}, {status: 500})
    }
}


export async function PUT(request: Request) {
    try {
        const { vacancyId, title, jobCategoryName, description, occupationType } = await request.json();
        if (!vacancyId) {
            return NextResponse.json({error: "Missed required field"}, {status: 400});
        }
        
        let jobCategoryId: number | undefined;
        if (jobCategoryName) {
          try {
            const existingJobCategory = await prisma.jobCategory.findUniqueOrThrow({where: { name: jobCategoryName }});
            jobCategoryId = existingJobCategory.id;
          } catch (error) {
            const newJobCategory = await prisma.jobCategory.create( {data: { name: jobCategoryName } } );
            jobCategoryId = newJobCategory.id;
          }
        }

        const updatedVacancy = await prisma.vacancy.update({
            where: {id: vacancyId},
            data: {
                title: title ?? undefined,
                jobCategoryId: jobCategoryId ?? undefined,
                description: description ?? undefined,
                occupationType: occupationType ?? undefined,
            },
            select: {
                title: true,
                jobCategory: true,
                employer: {
                    select: {
                        companyName: true,
                    },
                },
                description: true,
                occupationType: true,
            },
        });

        return NextResponse.json({updatedVacancy});
    } catch (error) {
        return NextResponse.json({error: "Failed to update Vacancy"}, {status: 500});
    }
}

export async function DELETE(request: Request) {
    try {
        const { vacancyId } = await request.json();

        if(!vacancyId) {
            return NextResponse.json({error: "Missed required field"}, {status: 400});
        }

        await prisma.vacancy.delete({where: {id: vacancyId}});

        return NextResponse.json({message: "Vacancy was deleted"});
    } catch (error) {
        return NextResponse.json({error: "Vacancy was not found"}, {status: 404});
    }
}