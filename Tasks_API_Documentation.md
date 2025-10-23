# 🧾 Tasks API Documentation

Базовый URL:  
https://backendtodo-wo1d7d3c.b4a.run/api/tasks

---

## 📘 Создать задачу

**POST** `/api/tasks`

Создаёт новую задачу.

**Request body:**

```json
{
  "title": "Написать документацию",
  "description": "Создать описание API для проекта",
  "status": "in-progress"
}
```

**Response 201:**

```json
{
  "_id": "6718b3f12c1b2a7f71d9e1a0",
  "title": "Написать документацию",
  "description": "Создать описание API для проекта",
  "status": "in-progress",
  "createdAt": "2025-10-23T11:30:00Z"
}
```

---

## 📗 Получить все задачи

**GET** `/api/tasks`

Возвращает список всех задач.

**Response:**

```json
[
  {
    "_id": "6718b3f12c1b2a7f71d9e1a0",
    "title": "Написать документацию",
    "status": "in-progress"
  },
  {
    "_id": "6718b3f12c1b2a7f71d9e1a1",
    "title": "Сделать деплой",
    "status": "done"
  }
]
```

---

## 📙 Получить задачу по ID

**GET** `/api/tasks/:id`

Возвращает задачу по её идентификатору.

**Example:**
`GET /api/tasks/6718b3f12c1b2a7f71d9e1a0`

**Response:**

```json
{
  "_id": "6718b3f12c1b2a7f71d9e1a0",
  "title": "Написать документацию",
  "description": "Создать описание API для проекта",
  "status": "in-progress"
}
```

---

## 📒 Получить задачи по статусу

**GET** `/api/tasks/status/:status`

Возвращает все задачи с определённым статусом (`pending`, `in-progress`, `done`).

**Example:**
`GET /api/tasks/status/in-progress`

**Response:**

```json
[
  {
    "_id": "6718b3f12c1b2a7f71d9e1a0",
    "title": "Написать документацию",
    "status": "in-progress"
  }
]
```

---

## 📕 Обновить задачу

**PATCH** `/api/tasks/:id`

Изменяет задачу по ID.

**Request body:**

```json
{
  "title": "Обновлённая задача",
  "status": "done"
}
```

**Response:**

```json
{
  "_id": "6718b3f12c1b2a7f71d9e1a0",
  "title": "Обновлённая задача",
  "status": "done"
}
```

---

## 🗑️ Удалить задачу

**DELETE** `/api/tasks/:id`

Удаляет задачу по ID.

**Example:**
`DELETE /api/tasks/6718b3f12c1b2a7f71d9e1a0`

**Response:**

```json
{
  "message": "Task deleted successfully"
}
```
