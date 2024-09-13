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
                        website_address: true,
                        geoLocation: true,
                    },
                },
                companyName: true,
                staff_n_upper_limit: true,
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
                logo_photo, 
                staff_n_upper_limit, 
                email, website_address, geoLocation, phone} = body;
        
        // check for obligatory fields
        if (!userId || !companyName || !staff_n_upper_limit || !email) {
            return NextResponse.json({error: "Missed required fields"}, {status: 400});
        }

        // get the user
        const user = await prisma.user.findUnique({where: {id: userId}});
        if (!user) {
            return NextResponse.json({error: "The user was not found"}, { status: 404 });
        }

        // check if provided company already exists
        const existingEmployer = await prisma.employer.findUnique({where: {companyName}});
        if (existingEmployer) {
            return NextResponse.json({error: "Employer already exists"}, {status: 400});
        }

        // construct contact info data
        const contactInfo = {
            email: email,
            website_address: website_address || null,
            geoLocation: geoLocation || null,
            phone: phone || null};

        const employer = await prisma.employer.create({
            data: {
                user: {connect: {id: userId }},
                companyName: companyName,
                staff_n_upper_limit: staff_n_upper_limit,
                contactInfo: {
                    create: contactInfo  
                },
                logo_photo: logo_photo || null,
            },
            include : {
                contactInfo: true,
            },
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
               logo_photo, 
               staff_n_upper_limit,
               email, website_address, phone, geoLocation} = await request.json();
        
        // check for must-have fields
        if (!userId) {
            return NextResponse.json({error: "Missed required fields"}, {status: 400});
        }

        const user = await prisma.user.findUnique({ where: {id: userId} });
        if (!user) {
            return NextResponse.json({error: "User not found"}, {status: 404});
        }

        const employer = await prisma.employer.findUnique({ where: {userId: user.id},
                                                            include: {contactInfo: true,}, });
        
        if (!employer) {
            return NextResponse.json({error: "Employer not found"}, { status: 404 });
        }

        const updatedEmployer = await prisma.employer.update({
            where: {id: employer.id},
            data: {
                companyName: companyName ?? employer.companyName,
                contactInfo: (email || website_address || phone || geoLocation) ? {
                    update: {
                        email: email ?? employer.contactInfo?.email,
                        website_address: website_address ?? employer.contactInfo?.website_address,
                        phone: phone ?? employer.contactInfo?.phone, 
                        geoLocation: geoLocation ?? employer.contactInfo?.geoLocation,
                    }
                } : undefined,
                logo_photo: logo_photo ?? employer.logo_photo,
                staff_n_upper_limit: staff_n_upper_limit ?? employer.staff_n_upper_limit,
            }
        });

        return NextResponse.json(updatedEmployer);
    } catch (error) {
        return NextResponse.json({error: "Failed to update Employer"}, {status: 500});
    }
}


export async function DELETE(request: Request) {
    try {
        const {employerId} = await request.json();

        if(!employerId) {
            return NextResponse.json({error: "Missed required fields"}, {status: 400});
        }

        await prisma.employer.delete({where: {id: employerId}});

        return NextResponse.json({message: "Employer was deleted"});
    } catch (error) {
        return NextResponse.json({error: "Employer not found"}, {status: 404});
    }
} 

