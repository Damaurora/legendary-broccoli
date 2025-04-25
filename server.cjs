// Простой сервер для запуска на Render
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
  console.log(`Server is running on port ${port}`);
});