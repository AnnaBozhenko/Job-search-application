import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";


const prisma = new PrismaClient();

export async function GET(request: Request) {
    const jobSeekers = await prisma.jobSeeker.findMany({
        select: {
            firstName: true,
            lastName: true,
            targetRole: true,
        },
    });

    return NextResponse.json(jobSeekers)
} 


export async function PUT(request: Request) {
    try {    
        const { userId, 
                firstName,
                lastName,
                targetRole,
                email,
                photo,
                dateOfBirth } = await request.json();

        if (!userId) {
            return NextResponse.json({error: "Missing required field"}, {status: 400});
        }

        const jobSeeker = await prisma.jobSeeker.findUnique({ where: {userId: userId} });
        if (!jobSeeker) {
            return NextResponse.json({error: "Job-seeker was not found"}, {status: 404});
        }

        const updatedJobSeeker = await prisma.jobSeeker.update({
            where: {id: jobSeeker.id},
            data: {
                firstName: firstName ?? undefined,
                lastName: lastName ?? undefined,
                targetRole: targetRole ?? undefined,
                contactInfo: (email) ? {
                    update: { 
                        email: email,
                    }
                } : undefined,
                photo: photo ?? undefined,
                dateOfBirth: dateOfBirth ?? undefined,
            },
            select: {
                firstName: true,
                lastName: true,
                targetRole: true,
                photo: true,
                dateOfBirth: true,
            }
        });

        return NextResponse.json({updatedJobSeeker});
    } catch (error) {
        return NextResponse.json({error: "Failed to update job-seeker"}, { status: 500 });
    }
} 


export async function POST(request: Request) {
    try {    
        const { userId, 
                firstName,
                lastName,
                targetRole,
                email,
                photo,
                dateOfBirth } = await request.json();

        if (!userId || !firstName || !lastName || !email || !dateOfBirth) {
            return NextResponse.json({error: "Missing required fields"}, {status: 400});
        }

        const jobSeeker = await prisma.jobSeeker.create({
            data: {
                user: { connect: { id: userId } },
                firstName: firstName,
                lastName: lastName,
                targetRole: targetRole ?? undefined,
                contactInfo: {
                    create: { 
                        email: email,
                    }
                },
                photo: photo ?? undefined,
                dateOfBirth: dateOfBirth,
            },
            select: {
                firstName: true,
                lastName: true,
                targetRole: true,
                photo: true,
                dateOfBirth: true,
            }
        });

        return NextResponse.json({jobSeeker}, {status: 201});
    } catch (error) {
        return NextResponse.json({error: "Failed to create job-seeker"}, { status: 500 });
    }
} 


export async function DELETE(request: Request) {
    try {    
        const { jobSeekerId } = await request.json();
        if (!jobSeekerId) {
            return NextResponse.json({error: "Missing required field"}, {status: 400});
        }

        await prisma.jobSeeker.delete({ where: {id: jobSeekerId } });
        return NextResponse.json({message: "Job-seeker was deleted"});
    } catch (error) {
        return NextResponse.json({error: "Job seeker was not found"}, { status: 404 });
    }
} 