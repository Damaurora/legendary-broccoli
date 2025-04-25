#!/usr/bin/env node

/**
 * Этот специальный скрипт предназначен для сборки на Render.com
 * 
 * Он динамически устанавливает все необходимые пакеты для сборки
 * и генерирует статические файлы для деплоя
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Начинаем настройку сборки для Render...');

// Функция для выполнения команд с выводом
function runCommand(command) {
  console.log(`\n⚙️ Выполняем: ${command}`);
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`❌ Ошибка при выполнении команды: ${command}`);
    console.error(error.message);
    return false;
  }
}

// Установка всех зависимостей включая dev
console.log('📦 Установка зависимостей...');
runCommand('npm install --include=dev');

// На всякий случай явно устанавливаем vite и плагины
console.log('📦 Дополнительная установка критических dev-зависимостей для сборки...');
runCommand('npm install --no-save @vitejs/plugin-react @replit/vite-plugin-cartographer @replit/vite-plugin-runtime-error-modal vite esbuild typescript @tailwindcss/vite tailwindcss-animate');

// Сборка клиента
console.log('🏗️ Сборка frontend (vite)...');
runCommand('npx vite build');

// Сборка сервера
console.log('🏗️ Сборка backend (esbuild)...');
runCommand('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist');

console.log('✅ Сборка успешно завершена!');