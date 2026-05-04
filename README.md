# 🧠 AI-Powered Worker Productivity Dashboard

## 🚀 Overview

This project is a **full-stack production-style web application** that simulates a manufacturing factory monitored by AI-powered CCTV systems.

It ingests structured events from computer vision systems, stores them, computes productivity metrics, and visualizes them through an interactive dashboard.

---

## 🏗️ Architecture

```
[ AI CCTV Events ]
        ↓
   Backend API (Node.js + Express)
        ↓
     MongoDB Database
        ↓
 Metrics Engine (Aggregation Logic)
        ↓
   Frontend Dashboard (React + Vite + Tailwind)
```

### Flow:

1. AI cameras generate structured events
2. Backend API ingests and stores them
3. Metrics engine processes events
4. Frontend displays insights in real-time

---

## ⚙️ Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

### Frontend

* React (Vite)
* Tailwind CSS
* Recharts (for charts)

### DevOps

* Docker
* Docker Compose

---

## 📦 Features

### ✅ Event Ingestion API

* Accepts AI-generated JSON events
* Deduplicates events using `event_id`
* Handles out-of-order timestamps

### ✅ Metrics Engine

Computes:

#### Worker-Level

* Active time
* Idle time
* Utilization %
* Units produced
* Units/hour

#### Workstation-Level

* Occupancy time
* Utilization %
* Throughput rate
* Total units

#### Factory-Level

* Total production
* Average utilization

---

## 📊 Dashboard

* Factory summary metrics
* Worker performance cards
* Workstation performance cards
* Bar charts (production)
* Utilization charts
* Filters (worker & workstation)
* Auto-refresh every 5 seconds

---

## 🧮 Metric Definitions

### ⏱️ Active Time

Time between consecutive `"working"` events

### ⚪ Idle Time

Time between `"idle"` events

### 📊 Utilization

```
(activeTime / totalTime) * 100
```

### 📦 Units Produced

Sum of all `product_count` events

### ⚡ Units per Hour

```
units / total_hours
```

### 🏭 Throughput

Units produced per hour per workstation

---

## 🧪 Sample Event

```json
{
  "timestamp": "2026-01-15T10:15:00Z",
  "worker_id": "W1",
  "workstation_id": "S3",
  "event_type": "working",
  "confidence": 0.93,
  "count": 1
}
```

---

## 🗄️ Database Schema

### Events Collection

```json
{
  "event_id": "uuid",
  "timestamp": "Date",
  "worker_id": "String",
  "workstation_id": "String",
  "event_type": "working | idle | absent | product_count",
  "confidence": "Number",
  "count": "Number"
}
```

---

## 🔄 Handling Real-World Challenges

### 1. Intermittent Connectivity

* Events are persisted immediately
* System tolerates delayed event arrival
* Metrics recomputed dynamically

---

### 2. Duplicate Events

* Each event has a unique `event_id`
* Duplicate events are rejected at API level

---

### 3. Out-of-Order Events

* Events are sorted by timestamp before processing
* Negative durations are ignored

---

## 🧠 System Design Considerations

### Model Versioning

* Add `model_version` field in events
* Enables tracking model performance over time

---

### Model Drift Detection

* Monitor:

  * Drop in confidence scores
  * Sudden utilization anomalies
* Trigger alerts when deviation exceeds threshold

---

### Retraining Strategy

* Store historical labeled data
* Periodically retrain models
* Deploy using versioned pipelines

---

## 📈 Scalability

### Current (6 Cameras)

* Single backend instance
* Single MongoDB instance

---

### Scaling to 100+ Cameras

* Load balancer in front of backend
* Horizontal scaling of API servers
* MongoDB indexing on:

  * `timestamp`
  * `worker_id`
  * `workstation_id`

---

### Multi-Site Scaling

* Multi-tenant architecture
* Separate DB per site OR partitioned collections
* Event streaming (Kafka / RabbitMQ)
* Microservices-based processing

---

## 🐳 Docker Setup

### Run Entire App

```bash
docker compose up --build
```

---

### Services

| Service  | Port                  |
| -------- | --------------------- |
| Frontend | http://localhost:5173 |
| Backend  | http://localhost:8000 |
| MongoDB  | 27017                 |

---

## 🔧 Environment Variables

### Backend `.env`

```
MONGODB_URL=mongodb://mongo:27017/stock-app
PORT=8000
```

---

## 📌 Assumptions

* Time between events represents activity duration
* Missing events imply continuation of previous state
* Product count events are independent of time tracking
* Workers are assigned to one workstation at a time

---

## ⚖️ Tradeoffs

* Chose MongoDB for flexibility over strict schema
* Computation done in-memory (not pre-aggregated)
* Simpler architecture over distributed systems

---

## 🚀 Future Improvements

* Real-time WebSocket updates
* Advanced analytics (ML insights)
* Alerts & anomaly detection
* Role-based dashboards
* Historical trend analysis

---

## 📂 How to Run Locally (Without Docker)

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd dashboard
npm install
npm run dev
```

---

## 👨‍💻 Author

Lavish Dadwani

---

## ✅ Conclusion

This project demonstrates:

* Real-world system design
* Event-driven architecture
* Data processing & analytics
* Full-stack engineering
* Production readiness with Docker

---

🔥 Built to simulate real industrial AI systems at scale.
