import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express'; 

// Initialize express app
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to parse JSON requests
app.use(express.json());

// Helper function to dynamically import routes
async function loadRoutes() {
  const routePaths = [
    'users',
    'employers',
    'job-seekers',
    'vacancies',
    'resumes'
  ];

  for (const route of routePaths) {
    try {
      // Dynamic import of route modules
      const routePath = new URL(`./src/app/api/${route}/route.ts`, import.meta.url).href;
      
      const routeModule = await import(routePath);
      const router = express.Router();

      router.get('/', async (req, res) => {
        const result = await routeModule.GET(req);
        res.status(result.status || 200).json(result.body);
      });

      router.post('/', async (req, res) => {
        const result = await routeModule.POST(req);
        res.status(result.status || 200).json(result.body);
      });

      router.put('/:id', async (req, res) => {
        const result = await routeModule.PUT(req);
        res.status(result.status || 200).json(result.body);
      });

      router.delete('/:id', async (req, res) => {
        const result = await routeModule.DELETE(req);
        res.status(result.status || 200).json(result.body);
      });

      app.use(`/api/${route}`, router);
    } catch (err) {
      console.error(`Failed to load routes for ${route}:`, err);
    }
  }
}


(async () => {
    try {
        await loadRoutes();

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
          console.log(`Server is listening on port ${PORT}`);
        });
    } catch(error) {
        console.error('Error during server startup:', error);
    }
})();