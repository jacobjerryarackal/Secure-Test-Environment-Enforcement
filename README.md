# Secure Test Environment Enforcement (STEE)

A locked-down, auditable assessment platform designed to ensure candidate integrity through real-time browser enforcement and unified event logging.

## 🚀 Project Overview
STEE provides a secure environment for high-stakes assessments by:
- **Restricting Browser Actions**: Disables copy, paste, cut, and right-click context menus.
- **Enforcing Focus**: Monitors tab switches, fullscreen escapes, and focus changes.
- **Unified Event Logging**: Captures a complete, timestamped audit trail of candidate behavior.
- **Real-time Monitoring**: Sends batched logs to a secure backend for employer review.

## 🛠 Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Axios
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Deployment**: Vercel (Frontend) & Render (Backend)

## 📋 Features
### 1. Browser Enforcement
- Blocks `Ctrl/Cmd + C`, `Ctrl/Cmd + V`, and `Ctrl/Cmd + X`.
- Disables the right-click context menu and text selection.
- Displays warning toasts on restricted actions.

### 2. Event Logging Schema
Captures all critical events with:
- **Event Type** (Copy, Paste, Tab Switch, etc.)
- **Timestamp**
- **Attempt ID**
- **Metadata** (Browser info, focus state, etc.)

## ⚙️ Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=[https://secure-test-environment-enforcement-jo3z.onrender.com/api](https://secure-test-environment-enforcement-jo3z.onrender.com/api)
NEXT_PUBLIC_APP_NAME="Secure Test Environment"

```

### Backend (.env)

```env
MONGO_URI=your_mongodb_connection_string
PORT=10000

```

## 🚀 Getting Started

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-link>

# Install Backend dependencies
cd backend
npm install

# Install Frontend dependencies
cd ../frontend
npm install

```

### 2. Local Development

Start the Backend:

```bash
cd backend
npm run dev

```

Start the Frontend:

```bash
cd frontend
npm run dev

```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) to view the application.

## 🌐 Deployment Notes

### CORS Configuration

The backend is configured to allow requests specifically from the Vercel production domain. If you deploy to a new domain, update the `corsConfig.js` in the backend:

```javascript
origin: [
  'http://localhost:3000',
  '[https://secure-test-environment-enforcement-one.vercel.app](https://secure-test-environment-enforcement-one.vercel.app)'
]

```

### Health Check

Verify the backend is live by visiting:
`https://<your-render-url>.onrender.com/`
It should respond with **"API is Online"**.



### Key Changes Made:
* [cite_start]**Objective-Driven**: Added the "Overall Objective" of ensuring a locked-down, auditable environment[cite: 3, 4].
* [cite_start]**Task Specifics**: Explicitly listed the blocking of `Ctrl+C/V/X` and context menus as core features[cite: 13, 15, 16, 17, 18].
* [cite_start]**Logging Details**: Included the unified event schema (Timestamp, Attempt ID, Metadata) as defined in your requirements[cite: 32, 34, 35, 37].
* **Troubleshooting Support**: Added the deployment notes for CORS and the Health Check route to help future developers (or yourself) avoid the "Not Found" issues you recently resolved.

```