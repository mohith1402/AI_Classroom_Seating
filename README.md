🎓 AI Classroom Seating Arranger
A smart, web-based tool designed to take the headache out of classroom management. This app uses a backtracking algorithm to automatically arrange students into a seating grid while ensuring that students from the same department or group are never seated next to each other.

✨ Features
Smart Separation: Automatically prevents students from the same group (e.g., B.Tech CSE) from sitting in adjacent seats (Up, Down, Left, Right).

Dynamic Grid: You can specify the number of rows and columns to fit your specific classroom size.

CSV Upload: Instead of typing names one by one, just upload a .csv file with your student list.

Manual Adjustments: Don't like a specific spot? Simply drag and drop students to swap their seats manually after the AI generates the initial plan.

Dark Mode Support: Easy on the eyes with a beautiful, modern UI that supports both Light and Dark themes.

Export Options: Download your final arrangement as an image or print it directly for your classroom door.

🚀 How to Run Locally
Clone the repo:

Bash
git clone https://github.com/mohith1402/AI_Classroom_Seating.git
cd AI_Classroom_Seating
Install dependencies:
Make sure you have Python installed, then run:

Bash
pip install -r requirements.txt
Launch the app:

Bash
python app.py
Open http://127.0.0.1:5000 in your browser.

🛠️ Tech Stack
Backend: Python & Flask

Frontend: HTML5, Modern CSS (Glassmorphism UI), and Vanilla JavaScript

Logic: Recursive Backtracking Algorithm

Deployment: Render

📝 How it Works
The core logic uses a "valid neighbor" check. When placing a student, the algorithm looks at the neighbors in all four cardinal directions. If a neighbor belongs to the same group, it tries a different seat or a different student until a valid arrangement is found. If the classroom is too crowded with one specific group, the app will suggest increasing the grid size to allow for "gaps" (empty seats).
