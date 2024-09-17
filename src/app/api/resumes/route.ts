import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET on many resumes
export async function GET(_request: Request) {
    try {
        const resumes = await prisma.resume.findMany({
            select: {
                description: true,
                jobSeeker: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        return NextResponse.json(resumes);
    } catch(error) {
        console.error("Failed to fetch resumes: ", error);
        return NextResponse.json({error: "Failed to find resumes"}, {status: 500});
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { jobSeekerId, description } = body;
        
        // check for obligatory fields
        if (!jobSeekerId || !description) {
            return NextResponse.json({error: "Missed required fields"}, {status: 400});
        }

        // check if the job seeker exists
        const jobSeeker = await prisma.jobSeeker.findUnique({where: {id: jobSeekerId}});
        if (!jobSeeker) {
            return NextResponse.json({error: "Job-seeker was not found"}, { status: 404 });
        }

        const resume = await prisma.resume.create({
            data: {
                jobSeeker: {connect: {id: jobSeekerId}},
                description: description,
            },
            select: {
                description: true,
                jobSeeker: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        return NextResponse.json({resume}, {status: 201})
    } catch (error) {
        console.error("Failed to create resume: ", error);
        return NextResponse.json({error: "Failed to create resume"}, {status: 500})
    }
}

export async function PUT(request: Request) {
    try {
        const { resumeId, description } = await request.json();
        
        // check for must-have fields
        if (!resumeId || !description) {
            return NextResponse.json({error: "Missed required fields"}, {status: 400});
        }

        const updatedResume = await prisma.resume.update({
            where: {id: resumeId},
            data: {
                description: description,
            },
            select: {
                description: true,
                jobSeeker: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        return NextResponse.json({updatedResume});
    } catch (error) {
        return NextResponse.json({error: "Failed to update Resume"}, {status: 500});
    }
}

export async function DELETE(request: Request) {
    try {
        const { resumeId } = await request.json();
        if (!resumeId) {
            return NextResponse.json({error: "Missed required field"}, {status: 400});
        }

        await prisma.resume.delete({where: {id: resumeId}});

        return NextResponse.json({message: "Resume was deleted"});
    } catch (error) {
        return NextResponse.json({error: "Resume was not found"}, {status: 404});
    }
}
