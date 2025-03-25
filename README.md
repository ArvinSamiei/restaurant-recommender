# 🥂 Bain Restaurant Recommender

A fullstack web application that helps Bain partners in Toronto find high-quality, business-appropriate restaurants for client engagements. The app filters restaurants based on both Yelp data and internal Bain partner feedback, streamlining the decision-making process for client-facing meals.

---

## 🚀 Features

- 🌟 Recommends restaurants with Yelp rating > 4
- 🥂 Filters for restaurants with full bar and reservation capability
- 📝 Partners can leave comments and internal ratings
- 🔄 Displays both Yelp and Bain-specific ratings side-by-side
- 🧭 Clean UI built for quick, professional use
- 🐳 Fully Dockerized setup for local and production deployment

---

## 🧱 Tech Stack

### Frontend

- React + Vite
- TailwindCSS
- Docker + Nginx (for production build)

### Backend

- FastAPI (Python)
- MongoDB (via `pymongo`)
- Yelp Fusion API integration
- Dockerized

---

## 🧪 Getting Started

### 📦 Prerequisites

- Docker and Docker Compose
- Yelp API Key

---

### 🔧 Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/restaurant-recommender.git
   cd restaurant-recommender
   ```

2. **Create a `.env` file with the following contents:**

   ```env
   YELP_API_KEY=your_yelp_api_key_here
   SECRET_KEY=your_jwt_secret_key
   MONGODB_URI=your_mongo_db_uri
   ```

3. **Build the backend Docker image:**

   ```bash
   docker build -t backend-image ./backend
   ```

4. **Run the backend container and pass the environment variables using the `.env` file:**

   ```bash
   docker run --env-file <path to your env file> -p 8000:8000 backend-image
   ```

5. **Set the backend API URL at build time using a Docker build argument.**  
   Instead of creating `.env` files manually, the Dockerfile will inject `VITE_API_URL` during the build step.

   Example for local development:

   ```bash
   docker build -t frontend-image ./frontend \
     --build-arg VITE_API_URL=http://localhost:8000
   ```

   Or via Docker Compose:

   ```yaml
   services:
     frontend:
       build:
         context: ./frontend
         args:
           VITE_API_URL: http://backend:8000
       ports:
         - "80:80"
   ```

6. **Run the frontend container (already built with the correct API URL):**

   ```bash
   docker run -p 80:80 frontend-image
   ```

7. **Access the application:**

   - Frontend:

     ```
     http://localhost
     ```

   - Backend (FastAPI):
     ```
     http://localhost:8000
     ```

---

## 📁 Project Structure

```
project-root/
│
├── backend/                # FastAPI backend
│   ├── main.py             # Entry point
│   ├── yelp.py             # Yelp API integration
│   ├── db.py               # MongoDB utilities
│   ├── models.py           # Data models
│   └── Dockerfile
│
├── frontend/               # React + Tailwind UI
│   ├── src/                # React components
│   ├── nginx.conf          # Nginx production config
│   └── Dockerfile
│
└── docker-compose.yml
```

## 🧩 Component Diagram

![Component Diagram](./docs/Component%20Diagram.jpg)

---

## 🚀 Deployment Architecture

![Deployment Diagram](./docs/Deployment%20Diagram.jpg)

---

## 🛠 API Overview

FastAPI provides auto-generated docs at:

```
http://localhost:8000/docs
```

Endpoints include:

- `GET /restaurants` – fetch filtered restaurants
- `POST /reviews` – submit partner comments
- `GET /reviews/{id}` – get partner feedback

---

## 📄 License

This project is provided for evaluation and demonstration purposes.

---

## 🙏 Acknowledgements

- [Yelp Fusion API](https://www.yelp.com/developers)
- [FastAPI](https://fastapi.tiangolo.com/)
- [TailwindCSS](https://tailwindcss.com/)
