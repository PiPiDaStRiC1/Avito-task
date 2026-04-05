# AI Avito

AI-ассистент для улучшения объявлений на Авито.

## Требования

- Node.js 20+
- OpenRouter API key

## Быстрый старт

1. Установите зависимости в корне проекта:

```bash
npm install
```

2. Установите зависимости для backend и frontend:

```bash
cd backend
npm install
cd ../frontend
npm install
cd ..
```

3. Настройте backend окружение:

- Скопируйте `backend/.env.example` в `backend/.env`
- Укажите `OPENROUTER_API_KEY`
- При необходимости измените `OPENROUTER_BASE_URL` и `OPENROUTER_MODEL`

4. Запустите приложение:

```bash
npm run dev
```

Это поднимет frontend и backend одновременно.

## Отдельный запуск

Frontend:

```bash
npm run dev:frontend
```

Backend:

```bash
npm run dev:backend
```

## AI режим

Проект настроен на OpenRouter API:

- `OPENROUTER_BASE_URL=https://openrouter.ai/api/v1`
- `OPENROUTER_MODEL=deepseek/deepseek-chat-v3-0324:free`
- `OPENROUTER_API_KEY=...`

Кнопки AI на странице редактирования показывают состояния:

- ожидание запроса
- загрузка ответа
- успех
- ошибка с повтором запроса

## Принятые решения

- Сохраняю изменения объявления в runtime JSON-хранилище на backend, чтобы не требовать базу данных для запуска.
- Использую OpenRouter как единый AI-шлюз для быстрого демонстрационного запуска.
- Черновик формы редактирования хранится в `localStorage`.
- Незаполненные дополнительные характеристики не блокируют сохранение формы.
