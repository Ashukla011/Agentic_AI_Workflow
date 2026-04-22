# AgentFlow AI 🚀
### Intelligent AI Automation & Workflow Orchestration Dashboard

AgentFlow is a cutting-edge platform designed to orchestrate complex AI workflows using autonomous agents. Built with a modern tech stack and focusing on premium user experience, it allows users to create, manage, and monitor AI-driven processes seamlessly.

---

## ✨ Key Features

- **📊 Intelligent Dashboard**: Real-time overview of agent efficiency, success rates, and active processes.
- **🛠️ Visual Workflow Builder**: Drag-and-drop style interface for design complex automation logic.
- **🤖 Autonomous Agents**: Configure specialized agents with unique personas and LLM models (Gemini, etc.).
- **⚡ Execution Engine**: Real-time processing of workflows powered by Google Gemini API.
- **📈 Comprehensive Analytics**: Detailed tracking of execution history, performance metrics, and system health.
- **🔒 Secure Authentication**: Robust user registration and login system powered by Supabase.
- **☁️ Hybrid Storage**: Uses `localStorage` for rapid prototyping and local state, integrated with Supabase for user sessions.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Motion](https://motion.dev/)
- **Charts**: [Recharts](https://recharts.org/)

### Backend
- **Server**: Node.js with [Express](https://expressjs.com/)
- **AI Core**: [Google Generative AI (Gemini)](https://ai.google.dev/)
- **Auth & Backend-as-a-Service**: [Supabase](https://supabase.com/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm
- Google Gemini API Key
- Supabase Project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd agentic_workflow
   ```

2. **Frontend Setup**
   ```bash
   npm install
   ```

3. **Backend Setup**
   ```bash
   cd server
   npm install
   ```

4. **Environment Configuration**
   Create a `.env` file in the `server` directory:
   ```env
   PORT=3001
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

   Update the Supabase credentials in `supabase/info.tsx` (if needed for the frontend).

### Running the Application

1. **Start the Execution Engine (Backend)**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the Frontend Dashboard**
   ```bash
   # From the root directory
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

---

## 📂 Project Structure

- `app/`: React frontend application
  - `components/`: UI components and feature pages (Dashboard, Agents, etc.)
  - `lib/`: API utilities and Supabase client
  - `routes.tsx`: Navigation and routing configuration
- `server/`: Express backend (AI Execution Engine)
- `supabase/`: Supabase configuration files
- `styles/`: Global CSS and Tailwind configuration

---

## 📝 License

Distributed under the MIT License. See `ATTRIBUTIONS.md` for third-party library details.

---

