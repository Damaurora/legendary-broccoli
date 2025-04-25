import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Проверка наличия URL для подключения к базе данных
if (!process.env.DATABASE_URL) {
  console.error("ВНИМАНИЕ: Переменная окружения DATABASE_URL не установлена!");
  console.error("Вам нужно создать PostgreSQL базу данных и добавить DATABASE_URL в переменные окружения.");
  console.error("Для локальной разработки создайте файл .env с переменной DATABASE_URL.");
  console.error("Для Render.com добавьте переменную окружения DATABASE_URL в настройках вашего сервиса.");
  console.error("Пример: DATABASE_URL=postgres://username:password@host:port/database");
  
  // Используем демо-URL для локальной разработки
  if (process.env.NODE_ENV === 'development') {
    console.log("Используется локальная база данных для разработки.");
    process.env.DATABASE_URL = process.env.REPLIT_DB_URL || 'postgres://postgres:postgres@localhost:5432/postgres';
  } else {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?",
    );
  }
}

// Создаем пул подключений
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });