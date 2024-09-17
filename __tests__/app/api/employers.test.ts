import { GET, POST, PUT, DELETE } from '../../../src/app/api/employers/route';
import { NextRequest } from 'next/server';

// Mock PrismaClient
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    employer: {
      findMany: jest.fn().mockResolvedValue([
        { 
          companyName: 'Test Company',
          staffNUpperLimit: 100,
          contactInfo: {
            email: 'employer@test.com',
            websiteAddress: null,
            geoLocation: null,
          }
        }
      ]),
      create: jest.fn().mockResolvedValue({
        companyName: 'New Company',
        staffNUpperLimit: 50,
        contactInfo: {
          email: 'new@company.com',
        }
      }),
    }
  })),
}));

describe('/api/employers', () => {
  it('GET /api/employers', async () => {
    const request = new NextRequest('http://localhost:3000/api/employers', {
      method: 'GET',
    });

    const response = await GET(request);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          companyName: 'Test Company',
        }),
      ])
    );
  });

  it('POST /api/employers', async () => {
    const request = new NextRequest('http://localhost:3000/api/employers', {
      method: 'POST',
      body: JSON.stringify({
        companyName: 'New Company',
        staffNUpperLimit: 50,
        email: 'new@company.com',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(201);

    const data = await response.json();
    expect(data.employer).toEqual(
      expect.objectContaining({
        companyName: 'New Company',
      })
    );
  });

  // Add more tests for PUT and DELETE
});