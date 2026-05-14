# Mawthiq (موثق) - Admin Management System

A premium, full-stack administrative dashboard for managing Users, Roles, and Permissions, built with **Laravel 11** and **React**.

## 🚀 Key Features
- **Advanced RBAC**: Dynamic permission groups, role assignment, and exclusive accordion management.
- **Bulk Actions**: Mass delete and status management for all resources.
- **Dynamic UI**: Grid/List view switching with persistent layout state.
- **Premium Design**: Atomic Design architecture, Glassmorphism header, and fixed sidebar.
- **Fully Responsive**: Optimized for all devices with full RTL support for Arabic language.

---

## 📂 Project Structure
- `/back`: Laravel 11 API with Sanctum authentication.
- `/front`: React application using Redux Toolkit (RTK Query) for state management.

---

## 🛠️ Setup Instructions

### 1. Backend (Laravel)
```bash
cd back
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```
*Make sure to configure your database in the `.env` file.*

### 2. Frontend (React)
```bash
cd front
npm install
cp .env.example .env
npm start
```
*Update `REACT_APP_API_URL` in `.env` if your local server runs on a different port.*

---

## 🎨 Design System
- **Framework**: Tailwind CSS & Vanilla CSS.
- **Architecture**: Atomic Design (Atoms, Molecules, Organisms, Templates, Pages).
- **Icons**: FontAwesome.
- **Typography**: Inter (En) & Tajawal (Ar).

---

## 🤝 Contribution Guide
1. Create a feature branch (`git checkout -b feature/amazing-feature`).
2. Commit your changes (`git commit -m 'Add some amazing feature'`).
3. Push to the branch (`git push origin feature/amazing-feature`).
4. Open a Pull Request.

---

## 📄 License
This project is proprietary. Please refer to the management for licensing details.
