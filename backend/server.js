import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import express from 'express';
import http from 'http';
import chalk from 'chalk';
import cors from 'cors';
import path from 'path';
import hbs from 'hbs';
import { fileURLToPath } from 'url';

import { seedData } from "./seed/seedData.js";
import eventRoutes from "./routes/events.js"
import metricsRoutes from "./routes/metrics.js"
import "./database.js"
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// CORS configuration
app.use(cors({
  origin: [process.env.FRONTEND_URL , 'https://worker-productivity-dashboard-1-03sq.onrender.com', "https://worker-productivity-dashboard-7kk1-2rjhwhhat.vercel.app" , "http://localhost:8081",],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/events", eventRoutes);
app.use("/metrics", metricsRoutes);

app.post("/seed", async (req, res) => {
  await seedData();
  res.json({ message: "Seeded successfully" });
});

app.get('/', (req, res) => {
    res.send('server is working fine');
  });


app.set('view engine', 'hbs');
// app.set('view options', { layout: 'layout' });
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));


server.listen(PORT, (err) => {
    if (err) {
      console.log(chalk.red("Cannot run!"));
    } else {
      console.log(
        chalk.green.bold(
          `
        Yep, this is working 🍺
        App is listening on port: ${PORT} 🍕
        Env: ${process.env.NODE_ENV} 🦄🦄
        `
        )
      );
    }
  });
