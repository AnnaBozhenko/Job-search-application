import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
/*

{
        "employer": {
            "companyName": "Test Company",
            "contactInfo": {
                "email": "employer@test.com"
            }
        },
        "jobCategory": {
            "id": 1,
            "name": "Backend Development"
        },
        "description": "We are looking for a skilled software developer",
        "publicationDate": "2024-09-15T09:26:46.521Z"
    },*/
interface ContactInfo {
  email: string;
}

interface Employer {
  companyName: string;
  contactInfo: ContactInfo;
}

interface JobCategory {
  id: number;
  name: string;
}

interface Vacancy {
  id: number;
  employer: Employer;
  jobCategory: JobCategory;
  description: string;
  publicationDate: string;    
}

export default function EmployerDashboard() {
    const [vacancies, setVacancies] = useState<Vacancy[]>([])

    useEffect(() => {
        fetch('/api/vacancies')
        .then(response => response.json())
        .then(data => setVacancies(data))
    }, [])

    return (
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-6">Employer Dashboard</h1>
          <Button className="mb-4">Post New Vacancy</Button>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {vacancies.map(vacancy => (
              <Card key={vacancy.id}>
                <CardHeader>
                  <CardTitle>{vacancy.jobCategory.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Published on {vacancy.publicationDate}</p>
                  <p>{vacancy.description}</p>
                  <Button className="mt-2" variant="outline">Edit</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
    )
}