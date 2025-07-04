# 🖼️ The Interactive Gallery

**The Interactive Gallery** is a full-stack web application that allows users to browse beautiful images from the Unsplash API, view image details, and interact by leaving comments. Built with modern technologies and designed to showcase clean architecture, user-friendly interfaces, and solid API integration.

---

## 🧰 Tech Stack

### 🖥 Frontend
- [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) for styling
- Axios for HTTP requests
- React Router for navigation
- React Hook Form or Formik for forms

### ⚙️ Backend
- [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/) for data persistence
- Knex.js for database queries
- Axios for Unsplash API calls
- JWT for authentication (optional)
- bcrypt for password hashing

---

## 📁 Folder Structure

```bash
the-interactive-gallery/
│
├── frontend/           # React + TypeScript app
│   ├── public/
│   ├── src/
│   └── ...
│
├── backend/            # Node.js + Express.js API
│   ├── src/
│   ├── migrations/
│   └── ...
│
├── .gitignore
├── README.md
└── ...
