# Market Manager

A responsive market and sales management application designed to simplify financial record keeping for small-scale sellers.

Market Manager allows users to register sales, track gross income, investment, and earnings, and analyze their activity by day, month, or custom periods. The application is designed primarily for mobile use and can be installed as a Progressive Web App (PWA).

## Features

* Sales CRUD operations with quick quantity controls.
* Product and Category catalog management with profit margins and average ticket metrics.
* Bulk product categorization and organization tool.
* Category performance ranking with celebratory Olympic podium and WhatsApp sharing.
* Active selling location tracking (Lugares / Ferias / Showrooms).
* Daily, monthly, and custom-period filtering.
* Day closeout summary with fanfare and peak hours hourly breakdown.
* Dynamic multi-theme system (light, dark, and premium themes) with theme-synced toasts.
* Privacy mode for hiding monetary values in public spaces.
* Argentine Peso currency formatting.
* Backend validation with user-friendly Spanish error messages.
* Responsive mobile-first interface with PWA support.
* Production deployment with PostgreSQL and Django REST API.

## Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Axios
* React Router
* React Hot Toast
* Vite PWA

### Backend

* Python
* Django
* Django REST Framework
* PostgreSQL

## Architecture

The application is divided into a React frontend and a Django REST API backend.

```text
market-manager/
├── backend/
│   ├── config/
│   ├── sales/
│   ├── expenses/
│   └── inventory/
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   └── utils/
    └── ...
```

The frontend communicates with the Django REST API through Axios. Production configuration is handled through environment variables, allowing the same codebase to be used locally and in deployment.

## Running Locally

### Backend

From the backend directory, create and activate a virtual environment:

```bash
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure the required environment variables, then run migrations:

```bash
python manage.py migrate
```

Start the development server:

```bash
python manage.py runserver
```

### Frontend

From the frontend directory:

```bash
npm install
npm run dev
```

The frontend uses `VITE_API_URL` to determine the backend API URL.

## Deployment

The production application uses:

* Render for hosting.
* PostgreSQL for the production database.
* Environment variables for configuration.
* A production React/Vite build.
* PWA support for installation on compatible devices.

## Current Version

**v1.0.0**

This release represents the complete Category Management & Metrics release for Market Manager, featuring visual category rankings, bulk organization, full catalog metrics, and dynamic theme synchronization.

## Future Development

Market Manager is intended to grow beyond the current sales-focused workflow.

Potential future development includes:

* Product and category management.
* Inventory tracking.
* Product-level organization and identification.
* Expense management.
* More advanced financial dashboards and reports.
* Employee management and permissions.
* Support for larger general-store workflows.
* Customizable visual themes.

The current application serves as the foundation for these larger features while remaining useful as a standalone sales and financial tracking tool.
