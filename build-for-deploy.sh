#!/bin/bash

# Этот скрипт создает готовую сборку для деплоя на Render
# Запускайте его локально перед отправкой кода на GitHub

# Установка зависимостей
echo "🔧 Установка зависимостей..."
npm install

# Сборка фронтенда
echo "🏗️ Сборка frontend (vite)..."
npx vite build

# Сборка бэкенда
echo "🏗️ Сборка backend (esbuild)..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# Создаем package.json для production
echo "📝 Создание package.json для production..."
cat > dist/package.json << EOF
{
  "name": "damask-shop",
  "type": "module",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "@neondatabase/serverless": "^0.9.0",
    "drizzle-orm": "^0.29.0",
    "express": "^4.18.2",
    "express-session": "^1.18.0",
    "ws": "^8.16.0",
    "connect-pg-simple": "^9.0.1",
    "passport": "^0.7.0",
    "passport-local": "^1.0.0"
  }
}
EOF

# Создаем простой скрипт для старта
cat > start-prod.sh << EOF
#!/bin/bash

# Устанавливаем только production зависимости
cd dist
npm install --omit=dev
node index.js
EOF

chmod +x start-prod.sh

echo "✅ Сборка готова к деплою!"
echo "👉 Запускайте './start-prod.sh' на сервере"