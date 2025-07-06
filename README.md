📚 Dire-Dev – The Ultimate Web App for Dire Dawa University Students
🚀 Welcome to Dire-Dev, your all-in-one academic platform designed exclusively for Dire Dawa University students. Access learning materials, collaborate in real-time, and unlock powerful development tools—all in one place!

🔥 Features Overview
📱 Modern & Responsive UI
Sleek and intuitive navigation layout

Toggle between Dark and Light mode

Fully responsive across all devices

🔐 Secure Authentication
Email/password sign-up & login

Google authentication

Protected routes and role-based access control

📚 Academic Resources
Dev-Materials: Organized course content by department & semester

Dev-Books: Searchable digital library of textbooks

Filtering and searching by keyword, course, or semester

💬 Real-Time Collaboration
Private & group chat support

Code sharing with syntax highlighting

File & image sharing

🗨️ Discussion Forum
Q&A system for academic discussions

Upvote/downvote features

Threads categorized by subjects

🛠️ Developer Tools
In-browser code editor (HTML, CSS, JS, Python)

Markdown notes with live preview

Task management system (To-Do list, reminders)

🛠️ Tech Stack
Frontend
React.js (Vite)

SCSS for responsive and modular styling

React Router for seamless navigation

Firebase Authentication for login/signup

Backend
Firebase Firestore: Realtime NoSQL database

Firebase Storage: File and image uploads

Firebase Hosting: Production-ready deployment

UI & UX
Custom-designed UI components

Accessibility best practices

Fully responsive across mobile, tablet, and desktop

🚀 Getting Started
✅ Prerequisites
Node.js (v16+)

npm or yarn

Firebase account

📦 Installation
Clone the repository


git clone https://github.com/yourusername/dire-dev.git
cd dire-dev
Install dependencies

bash
Copy
Edit
npm install
# or
yarn install
Configure Firebase

Create a .env file in the root directory:


VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
Start development server


npm run dev
📂 Project Structure

Edit
src/
├── assets/          # Static assets (images, logos) <br>
├── components/      # Reusable components (Navbar, Buttons, etc.) <br>
├── config/          # Firebase config & environment setup<br>
├── context/         # Global state/context providers<br>
├── hooks/           # Custom React hooks<br>
├── pages/           # Route pages (Home, Forum, Tools, etc.)<br>
├── services/        # API and Firebase services<br>
├── styles/          # Global and modular SCSS styles<br>
├── App.jsx          # Root component<br>
└── main.jsx         # Entry point
🔧 Available Scripts
Command	Description
npm run dev	Start development server
npm run build	Build for production
npm run preview	Preview production build
npm run lint	Run ESLint for code quality
npm run format	Format code using Prettier

🌟 Key Components & Modules
✅ Authentication
Email/password & Google login

Password reset functionality

Role-based access for admin, student, etc.

📢 Announcements
Admin interface to post updates

Real-time updates

Pinned posts

🧵 Forum System
Rich-text threads & replies

Voting system

Categorization by subject/department

👨‍💻 Dev Tools
Code editor with real-time preview

Markdown support for documentation

Cloud-synced to-do/task system

🔐 Firebase Security Rules Example
js
Copy
Edit
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /announcements/{announcement} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.token.isAdmin == true;
      allow update, delete: if request.auth != null &&
        (request.auth.token.isAdmin == true || resource.data.authorId == request.auth.uid);
    }
  }
}
🤝 Contributing
We love community contributions! Follow the steps below:

Fork the repository

Create a new branch:
git checkout -b feature/YourFeatureName

Commit your changes:
git commit -m "Add YourFeatureName"

Push to your branch:
git push origin feature/YourFeatureName

Open a Pull Request

📄 License
This project is licensed under the MIT License. See the LICENSE file for details.

✉️ Contact
Project Lead: Your Name
Email: your.email@example.com
University: Dire Dawa University

🌟 Support the Project
Contribute, suggest, or report bugs to make Dire-Dev better for all Dire Dawa University students.

💡 Let’s build the future of learning and development at Dire Dawa University together!

