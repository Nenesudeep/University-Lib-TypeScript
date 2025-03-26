import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

// Remove the manual dotenv config as Next.js handles env loading automatically
// import {config} from 'dotenv'
// config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
}

const sql = neon(process.env.DATABASE_URL);
// Fix the drizzle initialization syntax
export const db = drizzle(sql);
