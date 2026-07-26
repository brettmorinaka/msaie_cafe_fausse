# Café Fausse Web Application

Full-stack website for **Café Fausse** — a fine-dining restaurant in Washington, DC. The app includes a React front-end, Flask REST API, and PostgreSQL database for reservations and newsletter signups.

## Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Front-end  | React 18 (JSX), React Router, Vite  |
| Styling    | CSS Flexbox & Grid (responsive)     |
| Back-end   | Flask, Flask-CORS, Flask-SQLAlchemy |
| Database   | PostgreSQL                          |

## Features

- **Home** — branding, contact info, hours, navigation, newsletter signup
- **Menu** — starters, mains, desserts, beverages (per SRS)
- **Reservations** — form with validation, availability check, random table assignment (30 tables)
- **About Us** — history, founders, commitment to local ingredients
- **Gallery** — image grid with lightbox, awards, and customer reviews

## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+
- **PostgreSQL** 14+ (local or remote)

## Database setup

1. Start PostgreSQL and create a database:

```bash
createdb cafe_fausse
```

2. Copy environment config for the API:

```bash
cd backend
cp .env.example .env
```

3. Edit `backend/.env` if your PostgreSQL user, password, or host differ:

```
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/cafe_fausse
```

Tables (`customers`, `reservations`) are created automatically when the Flask app starts.

### Schema (reference)

- **customers** — `customer_id`, `customer_name`, `email_address`, `phone_number`, `newsletter_signup`
- **reservations** — `reservation_id`, `customer_id`, `time_slot`, `table_number`, `num_guests` (unique per time slot + table)

## Back-end setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

The API listens on **http://localhost:5000**.

### API endpoints

| Method | Path                             | Description                    |
| ------ | -------------------------------- | ------------------------------ |
| GET    | `/api/health`                    | Health check                   |
| GET    | `/api/reservations/availability` | Query `time_slot` (ISO 8601)   |
| POST   | `/api/reservations`              | Create reservation             |
| POST   | `/api/newsletter`                | Subscribe email (`email` JSON) |

## Front-end setup

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**. Vite proxies `/api` requests to the Flask server during development.

### Production build

```bash
cd frontend
npm run build
```

Serve the `frontend/dist` folder with any static host. Configure your reverse proxy so `/api` routes to the Flask application.

## Project structure

```
├── backend/
│   ├── app.py              # Flask app and REST routes
│   ├── models.py           # SQLAlchemy models
│   ├── config.py           # Database URL, table count
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/          # Home, Menu, Reservations, About, Gallery
│   │   ├── components/     # Layout, newsletter, lightbox
│   │   └── data/           # Static menu and gallery content
│   └── vite.config.js      # Dev proxy to Flask
├── project_requirements.mdc
└── README.md
```

## Testing the reservation flow

1. Ensure PostgreSQL is running and the Flask app has started without errors.
2. Open **Reservations**, pick a date/time within restaurant hours (Mon–Sat 5–11 PM, Sun 5–9 PM).
3. Submit the form — you should receive a confirmation with an assigned table number (1–30).
4. If all 30 tables are booked for that slot, the API returns an error and the UI shows a friendly message.

## License

Course project — Café Fausse SRS implementation.
