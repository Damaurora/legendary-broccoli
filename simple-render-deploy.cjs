// Этот скрипт создает простой деплой для Render
// Не требует dev-зависимостей и сборки на сервере

const fs = require('fs');
const path = require('path');

// Создаем директорию public если её нет
if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

// Простой package.json для продакшна
const packageJson = {
  "name": "damask-shop",
  "version": "1.0.0", 
  "private": true,
  "scripts": {
    "start": "node server.cjs"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
};

// Сервер Express
const serverCode = `// Простой сервер для запуска на Render
// Не требует сборки, только запуск

const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

console.log('Starting simple Express server...');

// Обслуживаем статические файлы
app.use(express.static(path.join(__dirname, 'public')));

// Перенаправляем все запросы к SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(\`Server is running on port \${port}\`);
});`;

// Создаем простой index.html
const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Damask Shop</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      line-height: 1.6;
    }
    .container {
      background-color: #f5f5f5;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      margin-top: 50px;
    }
    h1 {
      color: #e63900;
    }
    h2 {
      margin-top: 30px;
      color: #333;
    }
    .maintenance {
      font-weight: bold;
      color: #e63900;
    }
    a {
      color: #e63900;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Damask Shop</h1>
    <p class="maintenance">Сайт находится в режиме обслуживания</p>
    
    <h2>Наши магазины</h2>
    <p>Вы всегда можете посетить наши физические магазины:</p>
    <ul>
      <li>ул. Гагарина, 100</li>
      <li>ул. Победы, 78</li>
    </ul>
    
    <h2>Контакты</h2>
    <p>Телефон: +7 (XXX) XXX-XX-XX</p>
    <p>Email: info@damask-shop.ru</p>
    
    <p>Мы скоро вернемся онлайн с новым улучшенным сайтом!</p>
  </div>
</body>
</html>`;

// Записываем файлы
fs.writeFileSync('public/index.html', html);
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
fs.writeFileSync('server.cjs', serverCode);

console.log('✅ Простой деплой подготовлен!');
console.log('📋 Инструкции:');
console.log('1. Загрузите эти файлы в репозиторий:');
console.log('   - server.cjs');
console.log('   - package.json (новый)');
console.log('   - public/index.html');
console.log('2. В Render.com укажите:');
console.log('   - Build Command: npm install');
console.log('   - Start Command: npm start');