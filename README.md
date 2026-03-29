<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/sword.svg" width="80" alt="PixelQuest Sword"/>
  <h1 align="center">PixelQuest</h1>
  <p align="center">
    <strong>A Gamified Productivity Dashboard transforming daily tasks into an epic retro RPG adventure.</strong>
    <br />
    Manage quests, gain XP, build your base, and unlock interactive world maps!
  </p>
</div>

---

## 🚀 About The Project

**PixelQuest** takes the monotonous feel out of a standard to-do list by marrying task management with core Role-Playing Game mechanics. Powered by Next.js 14 and Tailwind CSS, this interactive Web App uses a living React ecosystem to spawn characters, pets, floating buildings, and immersive real-time dynamic skies.

Built entirely by **Kunal Singh**.

### 🎮 Core Features
- **Gamified Dashboard:** Add "Quests" (Tasks) and earn Gold and XP upon completion.
- **Interactive Base Building:** Buy structures like the Scholar's Tower, Farm, and Forge with 3D-placement mechanics across the map.
- **Dynamic Onboarding:** Beautiful Username claiming modal and local-storage preserved Map Guide popups.
- **Skill Tree Progression:** Assign XP points to Warrior, Scholar, and Explorer skill pathways to boost passive coin income and critical hits!
- **World Map Parallax:** A beautifully atmospheric, full-window skybox running a true CSS pseudo-randomized Day/Night lighting cycle with clouds and stars.
- **Secure Authentication:** Integrated strictly with Firebase Firestore for persistent cloud-saves preventing ghost data and local overrides. Guest mode available for instant testing.
- **Audio Overworld Engine:** Specialized spatial SFX and master ambient track muting controls accessible directly via the dashboard overlay.

---

## 🛠️ Built With
- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS animations
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Animation Engine:** [Framer Motion](https://www.framer.com/motion/)
- **Cloud Infrastructure:** [Google Firebase](https://firebase.google.com/) (Auth & Cloud Firestore)

---

## ⚙️ How To Run Locally

### Prerequisites
Make sure you have Node.js (`>=18.x`) and npm installed.
You MUST have a Firebase project configured with:
1. Email/Password Authentication Enabled
2. Cloud Firestore Database Built (Start in Test Mode)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/pixel-quest.git
   cd pixel-quest
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables by creating `.env.local` in the root:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Navigate to `http://localhost:3000` to dive into the adventure!

---

## 📜 Deployment (Production)

PixelQuest is structurally formatted to be instantly deployed on **Vercel**:
1. Push this highly-optimized repository to GitHub.
2. Link your GitHub repository via your Vercel Dashboard.
3. Import your `.env.local` keys strictly into Vercel's Environment Variables panel.
4. Hit **Deploy**. 

> Note: The exact internal configuration required for the Firestore WebSocket bypass (`experimentalForceLongPolling`) is already permanently enabled in `@/lib/firebase.ts`, so no further server-side tweaking is required to connect to the DB dynamically.

---

## 🔐 Privacy & .gitignore
This project's `.gitignore` contains safety locks for standard Next.js distributions, including blocking `/node_modules` alongside your unique `*.local` environment files.

> Developed with ❤️ by Kunal Singh | v1.0.0
