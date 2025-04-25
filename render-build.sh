#!/bin/bash

# Этот скрипт предназначен для сборки проекта на Render
# Он использует прямой подход с явной установкой всех зависимостей

echo "🔧 Начинаем настройку сборки для Render..."

# Устанавливаем Node.js
echo "📦 Установка зависимостей..."
npm install

# Принудительно устанавливаем dev-зависимости
echo "📦 Принудительно устанавливаем dev-зависимости..."
npm install --save-dev @vitejs/plugin-react @replit/vite-plugin-cartographer @replit/vite-plugin-runtime-error-modal vite esbuild typescript @tailwindcss/vite tailwindcss-animate drizzle-kit

# Проверяем есть ли drizzle-kit в системе
if ! command -v drizzle-kit &> /dev/null; then
    echo "📦 Устанавливаем drizzle-kit глобально..."
    npm install -g drizzle-kit
fi

# Проверяем, есть ли в системе esbuild
if ! command -v esbuild &> /dev/null; then
    echo "📦 Устанавливаем esbuild глобально..."
    npm install -g esbuild
fi

# Создаем базу данных
echo "🏗️ Применяем миграции к базе данных..."
npx drizzle-kit push

# Сборка клиента
echo "🏗️ Сборка frontend (vite)..."
npx vite build

# Сборка сервера
echo "🏗️ Сборка backend (esbuild)..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "✅ Сборка успешно завершена!"