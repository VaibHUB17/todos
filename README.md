# Nhost Todo App (React + GraphQL)

A complete Todo application using:
- React (hooks)
- Nhost Authentication (Email/Password)
- Nhost Postgres + auto-generated GraphQL API
- Apollo Client
- React Router

## 1) Backend Setup (Nhost)

1. Create a new Nhost project.
2. In your Nhost dashboard, open **Database** and create the `todos` table with this SQL:

```sql
create extension if not exists "pgcrypto";

create table public.todos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  is_completed boolean default false,
  created_at timestamptz default now()
);
```

3. Enable **Email/Password** authentication:
- Go to **Authentication** settings in Nhost.
- Ensure Email/Password sign-in is enabled.

4. Configure table permissions (GraphQL / Hasura):
- Go to **Data -> public -> todos -> Permissions**.
- For role `user`, allow `select`, `insert`, `update`, `delete` as needed in your project.
- Apply row-level security rules according to your ownership model.

## 2) Frontend Setup

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
copy .env.example .env
```

3. Update `.env` values:
- `REACT_APP_NHOST_SUBDOMAIN`
- `REACT_APP_NHOST_REGION`

4. Start the app:

```bash
npm start
```

The app routes:
- `/signup`
- `/login`
- `/todos` (protected route)

## 3) GraphQL Operations Included

- `GetTodos`
- `AddTodo`
- `ToggleComplete`
- `DeleteTodo`

All operations are implemented in [src/pages/Todos.jsx](src/pages/Todos.jsx).

## 4) Project Structure

```text
src/
├── utils/
│   ├── nhost.js
│   └── apollo.js
├── pages/
│   ├── Login.jsx
│   ├── Signup.jsx
│   └── Todos.jsx
├── components/
│   ├── TodoItem.jsx
│   └── ProtectedRoute.jsx
├── App.jsx
└── index.js
```
