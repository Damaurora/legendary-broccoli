// Этот скрипт готовит проект к деплою на Render.com
// и создает простое решение, которое гарантированно запустится

const fs = require('fs');
const path = require('path');

console.log('🚀 Подготовка экстренного деплоя для Render.com...');

// Создаем директорию public если её нет
if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

// Простой package.json для продакшна
const packageJson = {
  "name": "damask-shop-emergency",
  "version": "1.0.0", 
  "private": true,
  "scripts": {
    "start": "node server.cjs"
  },
  "engines": {
    "node": ">=18.0.0"
  }
};

// Сервер на чистом Node.js без зависимостей
const serverCode = `// Простой HTTP сервер без зависимостей
// Для экстренного деплоя на Render.com

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// Тип MIME по расширению файла
const getMimeType = (extension) => {
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
  };
  return mimeTypes[extension] || 'text/plain';
};

const server = http.createServer((req, res) => {
  console.log(\`\${new Date().toISOString()} \${req.method} \${req.url}\`);
  
  // Если запрос на корень, отдаем index.html
  let filePath = './public' + (req.url === '/' ? '/index.html' : req.url);
  
  // Проверяем существование файла
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // Если файл не найден, отдаем index.html (для SPA маршрутизации)
      filePath = './public/index.html';
    }
    
    // Определяем MIME тип по расширению
    const extname = path.extname(filePath);
    const contentType = getMimeType(extname);
    
    // Читаем файл и отправляем контент
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Ошибка сервера: ' + err.code);
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(\`Сервер запущен на порту \${PORT}\`);
  console.log(\`http://localhost:\${PORT}\`);
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
      color: #333;
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
      text-align: center;
      margin-bottom: 30px;
    }
    h2 {
      margin-top: 30px;
      color: #333;
      border-bottom: 1px solid #ddd;
      padding-bottom: 10px;
    }
    .maintenance {
      font-weight: bold;
      color: #e63900;
      text-align: center;
      font-size: 1.2em;
      margin-bottom: 30px;
    }
    a {
      color: #e63900;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .store-list {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      margin-top: 20px;
    }
    .store-card {
      flex: 1 1 300px;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 15px;
      background-color: white;
    }
    .store-name {
      font-weight: bold;
      margin-bottom: 5px;
    }
    .contact-info {
      margin-top: 30px;
      background-color: white;
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #ddd;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      color: #777;
      font-size: 0.9em;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>DAMASK SHOP</h1>
    <p class="maintenance">⚠️ Сайт находится в режиме обслуживания ⚠️</p>
    
    <h2>Наши магазины</h2>
    <p>Вы всегда можете посетить наши физические магазины:</p>
    
    <div class="store-list">
      <div class="store-card">
        <div class="store-name">ул. Гагарина, 100</div>
        <div>Часы работы: 10:00 - 20:00</div>
        <div>Телефон: +7 (XXX) XXX-XX-XX</div>
      </div>
      
      <div class="store-card">
        <div class="store-name">ул. Победы, 78</div>
        <div>Часы работы: 10:00 - 20:00</div>
        <div>Телефон: +7 (XXX) XXX-XX-XX</div>
      </div>
    </div>
    
    <h2>Контактная информация</h2>
    <div class="contact-info">
      <p>Общий телефон: +7 (XXX) XXX-XX-XX</p>
      <p>Email: info@damask-shop.ru</p>
      <p>Telegram: @damask_shop</p>
    </div>
    
    <p class="footer">Мы скоро вернемся онлайн с новым улучшенным сайтом!</p>
  </div>
</body>
</html>`;

// Записываем файлы
fs.writeFileSync('public/index.html', html);
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
fs.writeFileSync('server.cjs', serverCode);

console.log('✅ Экстренный деплой подготовлен!');
console.log('📋 Инструкции для Render.com:');
console.log('1. Build Command: npm install (или оставьте пустым)');
console.log('2. Start Command: npm start');

// Сообщение о статус-файле для Render
console.log('\n🔍 Создан статус-файл render-build-completed.txt для подтверждения успешной сборки');
fs.writeFileSync('render-build-completed.txt', 'Сборка успешно завершена ' + new Date().toISOString());