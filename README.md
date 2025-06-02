# 🧠 Mini CRM Platform

A lightweight CRM (Customer Relationship Management) system built using **React**, **Node.js**, **Express**, and **MongoDB** with integrated **AI-powered customer summarization** using **Cohere API**.

---

## 📸 Architecture Overview

+---------------------+      HTTP/API       +-----------------------+
|     React Frontend  |  <----------------> |   Express Backend API |
|  (Customer UI, AI)  |                    |  (CRUD, Segments, AI) |
+---------------------+                    +-----------+-----------+
                                                          |
                                                          |
                                                          v
                                              +------------------------+
                                              |    MongoDB Database    |
                                              |  (Customers, Segments) |
                                              +------------------------+

🔧 Local Setup Instructions
Clone the repo:

bash
Copy
Edit
git clone https://github.com/yourusername/mini-crm.git
cd mini-crm
Install dependencies:

Backend:

bash
Copy
Edit
cd backend
npm install
Frontend:

bash
Copy
Edit
cd ../frontend
npm install
Set up environment variables:

Backend .env:

ini
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_connection_string
COHERE_API_KEY=your_cohere_api_key
GOOGLE_CLIENT_ID=your_google_client_id
Run the project:

Backend: npm start in /backend

Frontend: npm start in /frontend

🏗️ Architecture Diagram
scss
Copy
Edit
Frontend (React.js)
│
├── Customer Management
├── Segment Builder
├── Dashboard & Analytics
└── Google Authentication
       │
       ▼
Backend (Node.js + Express)
├── MongoDB Integration
├── AI Summary via Cohere API
└── Auth Validation
       │
       ▼
Cohere API + Google OAuth
🧰 Tech Stack
Frontend: React.js, CSS Modules

Backend: Node.js, Express.js

Database: MongoDB (Mongoose ODM)

Authentication: Google OAuth 2.0

AI Integration: Cohere API for natural language summaries

Others: Axios, React Router, Environment Config (.env)

🧠 AI Tools Used
Cohere API: Used to generate natural language summaries of customer behavior based on CRM data (spend, visits, segments, etc.)

🔒 Authentication
Google Sign-In is implemented using OAuth 2.0. Users can log in via their Google account before accessing CRM features.

⚠️ Known Limitations / Assumptions
AI summary may not reflect real-time customer behavior and is generated on demand.

No role-based access control yet (admin vs. user).

Assumes users are familiar with basic CRM operations and structure.

Not yet optimized for large-scale datasets (e.g., pagination is minimal).

Summary generation could incur costs via Cohere API.
