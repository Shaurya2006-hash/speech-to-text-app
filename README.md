# VoiceNova AI

VoiceNova AI is an AI-powered Speech-to-Text web application that allows users to record voice, upload audio files, perform live transcription, and store transcription history securely.

The project combines frontend development, backend APIs, authentication, database integration, and AI-powered speech processing into one complete full-stack application.

---

# Features

## Live Speech-to-Text

* Real-time speech transcription using Browser SpeechRecognition API
* Instant text updates while speaking

## Audio Recording

* Record audio directly from the browser using MediaRecorder API

## Audio File Upload

* Upload supported audio files for transcription

## Authentication System

* Secure user login and signup using Supabase Authentication

## Transcription History

* Store and view previous transcription records
* User-specific history protection

## Responsive UI

* Modern responsive interface built using Tailwind CSS

---

# Tech Stack

## Frontend

* React.js
* Tailwind CSS
* Axios

## Backend

* Node.js
* Express.js

## Database & Authentication

* Supabase
* PostgreSQL

## AI & Speech Processing

* OpenAI Whisper
* Browser SpeechRecognition API
* MediaRecorder API

---

# Project Architecture

The application follows a full-stack architecture:

```text id="c6u1g9"
Frontend (React.js)
        ↓
Backend API (Node.js + Express.js)
        ↓
Supabase Database & Authentication
        ↓
Whisper Speech Processing
```

---

# Project Setup

## Clone Repository

```bash id="pbg5wq"
git clone https://github.com/your-username/voicenova-ai.git
cd voicenova-ai
```

---

# Frontend Setup

```bash id="8n6j8r"
cd client
npm install
npm start
```

Frontend runs on:

```text id="q36y9v"
http://localhost:3000
```

---

# Backend Setup

```bash id="mhg5cc"
cd server
npm install
npm run dev
```

Backend runs on:

```text id="gt1nh3"
http://localhost:5000
```

---

# Environment Variables

Create a `.env` file inside the backend folder.

```env id="v2mw6i"
PORT=5000

SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

OPENAI_API_KEY=your_openai_api_key
```

---

# API Endpoints

## Upload Audio

```http id="a2h4v0"
POST /api/transcribe
```

Uploads audio file and processes transcription.

---

## Get History

```http id="m8e7px"
GET /api/history
```

Returns previous transcription records for authenticated users.

---

# Authentication

This project uses Supabase Authentication for:

* Secure login
* Signup
* Session management
* Protected routes

Authentication ensures transcription history remains user-specific and secure.

---

# Main Functionalities

## Live Transcription

The browser SpeechRecognition API listens to the microphone and converts speech into text in real time.

Use Cases:

* Online meetings
* Note taking
* Lectures
* Accessibility systems

---

## Audio Recording

The MediaRecorder API records audio directly from the browser.

Recorded audio is:

1. Converted into audio blob
2. Sent to backend using Axios
3. Processed by backend APIs

---

## File Upload Validation

The backend validates:

* File type
* File size
* User authentication

This improves:

* Security
* Reliability
* User experience

---

# Challenges Faced

## Whisper Deployment Issues

During deployment testing, the frontend and backend upload system worked successfully, but Whisper processing generated errors in the cloud environment.

### Issue 1

The deployment server could not locate the uploads folder, causing:

```text id="d3w2v7"
ENOENT file path error
```

### Solution

Implemented automatic uploads folder creation using Node.js fs module.

### Remaining Deployment Challenge

Whisper and FFmpeg dependency configuration in cloud deployment environments.

This project improved understanding of:

* Backend debugging
* File handling
* Cloud deployment
* AI integration challenges

---

# History Feature Debugging

Initially, transcription history was not displaying correctly because the frontend was not sending the authenticated user ID properly.

After debugging:

* Session user ID was correctly passed
* Backend validation was fixed
* User-specific history worked successfully

This improved understanding of:

* Authentication flows
* Backend validation
* API debugging

---

# Code Structure

## Frontend Structure

```text id="5w7kya"
client/
 ├── components/
 ├── pages/
 ├── services/
 ├── routes/
 └── App.js
```

React Hooks used:

* useState
* useEffect
* useRef

---

## Backend Structure

```text id="3vbq1l"
server/
 ├── routes/
 ├── controllers/
 ├── middleware/
 ├── services/
 └── uploads/
```

Backend follows modular architecture for:

* Scalability
* Maintainability
* Clean code organization

---

# Deployment

## Frontend Deployment

* Vercel / Netlify

## Backend Deployment

* Render / Railway

---

# Future Improvements

Future enhancements may include:

* Better AI transcription APIs
* Deepgram integration
* Google Speech-to-Text API
* Real-time subtitle generation
* Multi-language support
* Improved deployment optimization

---

# Industry Use Cases

VoiceNova AI can be used in:

* Online meeting systems
* Hospitals
* Education platforms
* Accessibility tools
* Podcast subtitle generation
* Customer support applications

---

# Learning Outcomes

This project helped improve understanding of:

* Full-stack development
* Authentication systems
* REST APIs
* Frontend-backend communication
* AI integrations
* Cloud deployment
* Backend debugging
* File upload handling

---

# Conclusion

VoiceNova AI demonstrates how frontend applications, backend APIs, authentication systems, databases, and AI services work together to build a complete modern web application.

The project provided practical experience in real-world development workflows, debugging, deployment, and scalable application architecture.

---

# Author

[Your Name]

---

# GitHub Repository

Add your repository link here.

---

# Live Demo

Add your deployed project link here.
