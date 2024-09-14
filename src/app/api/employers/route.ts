import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET on many employers
export async function GET(request: Request) {
    try {
        const employers = await prisma.employer.findMany({
            select: {
                contactInfo: {
                    select: {
                        email: true,
                        websiteAddress: true,
                        geoLocation: true,
                    },
                },
                companyName: true,
                staffNUpperLimit: true,
            },
        });
        return NextResponse.json(employers);
    } catch(error) {
        console.error("Failed to fetch employers: ", error);
        return NextResponse.json({error: "Failed to find employers"}, {status: 500});
    }
}


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId,
                companyName, 
                logoPhoto, 
                staffNUpperLimit, 
                email, websiteAddress, geoLocation, phone} = body;
        
        // check for obligatory fields
        if (!userId || !companyName || !staffNUpperLimit || !email) {
            return NextResponse.json({error: "Missed required fields"}, {status: 400});
        }

        // get the user
        const user = await prisma.user.findUnique({where: {id: userId}});
        if (!user) {
            return NextResponse.json({error: "User was not found"}, { status: 404 });
        }

        // check if provided company already exists
        const existingEmployer = await prisma.employer.findUnique({where: {companyName}});
        if (existingEmployer) {
            return NextResponse.json({error: "Employer already exists"}, {status: 400});
        }

        const employer = await prisma.employer.create({
            data: {
                user: {connect: {id: userId }},
                companyName: companyName,
                staffNUpperLimit: staffNUpperLimit,
                contactInfo: {
                    create: {
                        email: email,
                        websiteAddress: websiteAddress ?? undefined,
                        geoLocation: geoLocation ?? undefined,
                        phone: phone ?? undefined,
                    }  
                },
                logoPhoto: logoPhoto ?? undefined,
            },
            select: {
                companyName: true,
                staffNUpperLimit: true,
                logoPhoto: true,
                contactInfo: { select: { email: true, } }
            }
        });

        return NextResponse.json({employer}, {status: 201})
    } catch (error) {
        console.error("Failed to create employer: ", error);
        return NextResponse.json({error: "Failed to create employer: "}, {status: 500})
    }
}


export async function PUT(request: Request) {
    try {
        const {userId, 
               companyName, 
               logoPhoto, 
               staffNUpperLimit,
               email, websiteAddress, phone, geoLocation} = await request.json();
        
        // check for must-have fields
        if (!userId) {
            return NextResponse.json({error: "Missed required field"}, {status: 400});
        }

        const user = await prisma.user.findUnique({ where: {id: userId} });
        if (!user) {
            return NextResponse.json({error: "User was not found"}, {status: 404});
        }

        const employer = await prisma.employer.findUnique({ where: {userId: user.id}, });
        if (!employer) {
            return NextResponse.json({error: "Employer was not found"}, { status: 404 });
        }

        const updatedEmployer = await prisma.employer.update({
            where: {id: employer.id},
            data: {
                companyName: companyName ?? undefined,
                contactInfo: {
                    update: {
                        email: email ?? undefined,
                        websiteAddress: websiteAddress ?? undefined,
                        phone: phone ?? undefined, 
                        geoLocation: geoLocation ?? undefined,
                    }
                } ,
                logoPhoto: logoPhoto ?? undefined,
                staffNUpperLimit: staffNUpperLimit ?? undefined,
            },
            select: {
                companyName: true,
                logoPhoto: true,
                staffNUpperLimit: true,
            }
        });

        return NextResponse.json({updatedEmployer});
    } catch (error) {
        return NextResponse.json({error: "Failed to update Employer"}, {status: 500});
    }
}


export async function DELETE(request: Request) {
    try {
        const {employerId} = await request.json();

        if(!employerId) {
            return NextResponse.json({error: "Missed required field"}, {status: 400});
        }

        await prisma.employer.delete({where: {id: employerId}});

        return NextResponse.json({message: "Employer was deleted"});
    } catch (error) {
        return NextResponse.json({error: "Employer was not found"}, {status: 404});
    }
} 

