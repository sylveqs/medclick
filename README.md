# 🏥 МИС «МедКлик» — Медицинская информационная система

Система для автоматизации записи пациентов и учёта расходных материалов в сети частных клиник.

---

## 📋 Описание проекта

Проект разработан в рамках учебного задания. Решает две ключевые проблемы медицинской организации:

1. **Онлайн-запись на приём** — исключение двойной записи, автоматическое освобождение слотов при отмене.
2. **Учёт расходных материалов** — списание материалов с привязкой к пациенту, контроль остатков.

---

## 🛠️ Технологии

| Компонент | Технология |
|-----------|------------|
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Frontend | HTML, CSS, JavaScript |
| Аутентификация | JWT + bcrypt |

---

## 🚀 Установка и запуск

### 1. Клонировать репозиторий

bash
git clone https://github.com/ВАШ_USERNAME/medclick.git
cd medclick

2. **Установить зависимости для бэкенда**
bash
cd backend
npm install

3. **Настроить базу данных PostgreSQL**
Создайте базу данных medclick

Выполните скрипт создания таблиц (см. database.sql)

Настройте подключение в backend/db.js:

js
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'medclick',
  password: '1111',
  port: 5432,
});

4. **Запустить бэкенд**
bash
npm start
Сервер запустится на порту 5000

5. **Открыть фронтенд**
Откройте файл frontend/index.html в браузере

## 👥 Роли пользователей
Роль	Email	Пароль	Возможности

Администратор	admin@medclick.ru	admin123	Управление материалами, списание, подтверждение явок, добавление расписания
Пациент	Зарегистрируйтесь сами	—	Запись на приём, отмена записи, просмотр своих записей

## 📁 Структура проекта
text
- medclick/
- ├── backend/
- │   ├── routes/
- │   │   ├── auth.js          # Регистрация/вход
│   │   ├── schedule.js      # Расписание
│   │   ├── appointments.js  # Записи на приём
│   │   └── materials.js     # Учёт материалов
│   ├── db.js                # Подключение к БД
│   ├── server.js            # Точка входа
│   └── package.json
├── frontend/
│   ├── index.html           # Страница входа/регистрации
│   ├── patient.html         # Личный кабинет пациента
│   ├── admin.html           # Панель администратора
│   └── style.css            # Стили
├── database.sql             # Скрипт создания БД
└── README.md

## 🧪 Тестирование
Запись на приём (пациент)
Войти как пациент

Выбрать свободный слот

Нажать «Записаться»

Запись появится в разделе «Мои записи»

Списание материала (администратор)
Войти как администратор

Выбрать материал из списка

Указать ID записи и количество

Нажать «Списать»

## 📊 База данных (3-я нормальная форма)
Таблица	Описание
users	Пользователи (пациенты и администраторы)
doctors	Врачи
schedule	Расписание (слоты)
appointments	Записи на приём
materials	Расходные материалы
material_write_offs	Списание материалов

##🔗 API Endpoints
Метод	Endpoint	Описание
- POST	/api/auth/register	Регистрация
- POST	/api/auth/login	Вход
- GET	/api/schedule/available	Свободные слоты
- POST	/api/appointments	Запись на приём
- GET	/api/appointments/my/:id	Записи пациента
- GET	/api/appointments/all	Все записи (админ)
- PUT	/api/appointments/:id/cancel	Отмена записи
- PUT	/api/appointments/:id/confirm	Подтверждение явки
- GET	/api/materials	Список материалов
- POST	/api/materials/write-off	Списание материала

## 👨‍💻 Автор
Учебная практика по разработке информационной системы

<img width="1066" height="405" alt="Снимок экрана 2026-04-14 131438" src="https://github.com/user-attachments/assets/9af699d6-a120-4337-8749-2ffb8de116cb" />
<img width="1071" height="609" alt="Снимок экрана 2026-04-14 132719" src="https://github.com/user-attachments/assets/e205abaa-f61a-4762-8ce7-39f459263aad" />
<img width="951" height="491" alt="Снимок экрана 2026-04-14 132715" src="https://github.com/user-attachments/assets/329b437b-5770-45e4-80a5-eab5377a8213" />
<img width="974" height="465" alt="Снимок экрана 2026-04-14 132709" src="https://github.com/user-attachments/assets/f85dc751-19c0-496a-bbe7-5177bac8a5b1" />
<img width="539" height="228" alt="Снимок экрана 2026-04-14 132845" src="https://github.com/user-attachments/assets/82484d79-252a-4337-a4b3-bf687f50206e" />
<img width="1061" height="936" alt="Снимок экрана 2026-04-14 132618" src="https://github.com/user-attachments/assets/d3eca33a-08b2-4346-b0e1-69c51278f7b5" />
<img width="1242" height="526" alt="Снимок экрана 2026-04-14 131945" src="https://github.com/user-attachments/assets/7eca1c54-8e80-4aa1-a25c-e5c51a5b8f2e" />


