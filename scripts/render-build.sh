#!/bin/bash
# Скрипт для сборки на Render

echo "Installing dependencies..."
npm ci

echo "Installing dev dependencies explicitly..."
# Явно устанавливаем необходимые dev-зависимости для сборки
npm install --no-save @vitejs/plugin-react @replit/vite-plugin-cartographer @replit/vite-plugin-runtime-error-modal

echo "Building application..."
npm run build

echo "Build completed successfully."