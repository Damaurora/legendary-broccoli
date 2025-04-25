#!/bin/bash

# Применение миграций базы данных
echo "Applying database migrations..."
npm run db:push

# Другие действия перед деплоем могут быть добавлены здесь
echo "Deploy setup completed successfully."