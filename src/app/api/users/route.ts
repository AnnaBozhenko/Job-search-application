import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return NextResponse.json(users);
    } catch (error) {
        console.error("Failed to fetch users: ", error);
        return NextResponse.json({error: "Failed to fetch users"}, 
                                 {status: 500});
    }
}


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, role } = body;

        const existingUser = await prisma.user.findUnique({where: {
                                                                      email
                                                                  }});
        if (existingUser) {
            return NextResponse.json({error: "User already exists"}, {status: 400});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: role,
            },
            select: {
                
                id: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true, 
            },
        });
        return NextResponse.json(user, {status: 201});
    } catch (error) {
        console.error("Failed to create user: ", error);
        return NextResponse.json({ error: "Failed to create user: " },
                                 {status: 500});
    }
}


export async function PUT(request: Request) {
    try {
      const body = await request.json();
      
      const {userId, email, password} = body; 

      if (!userId) {
        return NextResponse.json({error: "Missing reqired fields"}, {status: 400});
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        return NextResponse.json({error: "User not found"}, {status: 404});
      }

      //   handle hashing password if provided
      const hashedPassword = await bcrypt.hash(password, 10) ?? user.password;

      const updatedUser = await prisma.user.update({
        where: { id: userId},
        data: {
            password: hashedPassword,
            email: email ?? user.email,
        },
        select: {
            id: true,
            email: true,
            password: true,
            updatedAt: true,
        }
      });

      return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Failed to update user: ", error)
        return NextResponse.json({error: "Failed to update user"}, {status: 500});
    }
}


export async function DELETE(request: Request) {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: "Missing reqired fields" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: {id: userId } });

        if (!user) {
            return NextResponse.json({error: "User not found"}, {status: 404});
        }

        await prisma.user.delete({ where: { id: userId } });
        return NextResponse.json({ message: "User was succesfully deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}
