# BACKEND-DEV

This folder contains the **Authentication, Users, Exams, and Questions** modules of the Online Examination System backend, built with **Node.js (Express)** and **MySQL**.

> Attempts/Answers endpoints are a teammate's responsibility and are intentionally not included here.

## 1. Project Structure

```
BACKEND-DEV/
├── config/
│   └── db.js              # MySQL connection pool
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── examController.js
│   └── questionController.js
├── middleware/
│   ├── auth.js             # JWT verification + role restriction
│   └── errorHandler.js
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── examRoutes.js
│   └── questionRoutes.js
├── sql/
│   └── schema.sql          # users, exams, questions tables
├── utils/
│   └── jwt.js
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

## 2. Setup

1. Install dependencies:
   ```bash
   cd BACKEND-DEV
   npm install
   ```

2. Create a MySQL database using the schema:
   ```bash
   mysql -u root -p < sql/schema.sql
   ```

3. Copy the environment template and fill in your own values:
   ```bash
   cp .env.example .env
   ```
   Edit `.env`:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=exam_system
   JWT_SECRET=replace_this_with_a_long_random_secret_string
   JWT_EXPIRES_IN=1d
   ```

4. Run the server:
   ```bash
   npm run dev     # with nodemon, auto-restarts on save
   # or
   npm start
   ```

5. Confirm it's alive:
   ```bash
   curl http://localhost:5000/api/health
   ```

## 3. Authentication Flow

All protected routes expect:
```
Authorization: Bearer <token>
```
The token is returned by `/api/auth/register` and `/api/auth/login`.

The first user you create via `/api/auth/register` will always be a `student` — the endpoint deliberately blocks self-promotion to `admin`. To create your first admin, either:
- register normally, then manually run in MySQL:
  ```sql
  UPDATE users SET role = 'admin' WHERE email = 'you@example.com';
  ```
- or uncomment/adjust the seed insert at the bottom of `sql/schema.sql`.

## 4. Endpoints

### Auth (`/api/auth`)
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login, receive JWT |
| GET | `/me` | Private | Get current user |
| POST | `/logout` | Private | Logout |

### Users (`/api/users`)
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/profile` | Private | Get user profile |
| PUT | `/profile` | Private | Update profile (name, bio, password) |

### Exams (`/api/exams`)
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/` | Private | List exams (students only see published) |
| GET | `/:id` | Private | Get exam details |
| POST | `/` | Admin | Create exam |
| PUT | `/:id` | Admin | Update exam |
| DELETE | `/:id` | Admin | Delete exam |
| PATCH | `/:id/status` | Admin | Publish/unpublish (`{ "status": "published" }`) |

### Questions
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/exams/:examId/questions` | Admin | Add question |
| GET | `/api/exams/:examId/questions` | Private | Get questions (`is_correct` hidden from students) |
| PUT | `/api/questions/:id` | Admin | Update question |
| DELETE | `/api/questions/:id` | Admin | Delete question |

## 5. Sample Requests

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"secret123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"secret123"}'
```

**Create exam (admin token required):**
```bash
curl -X POST http://localhost:5000/api/exams \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Midterm Test","description":"Covers chapters 1-4","duration_minutes":45}'
```

**Add a question:**
```bash
curl -X POST http://localhost:5000/api/exams/1/questions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "question_text":"What is 2 + 2?",
    "option_a":"3","option_b":"4","option_c":"5","option_d":"6",
    "is_correct":"B",
    "marks":2
  }'
```

## 6. Integration Notes for the Team

- `exams.created_by` and `questions.exam_id` are foreign keys — make sure the Attempts/Answers module references `questions.id` and `exams.id` correctly.
- `role` on the `users` table is an ENUM of `student` / `admin` — reuse this for any role checks elsewhere in the app instead of duplicating a roles table.
- The JWT payload contains `{ id, role }` — anyone else's middleware verifying the same `JWT_SECRET` can decode it the same way.
- CORS is currently wide open (`cors()` with no options) for ease of local development — lock this down to your frontend's origin before deploying.
