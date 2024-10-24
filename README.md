# AWS Solutions Architect Associate Exam Practice Quiz Generator 📚☁️

Welcome to the **AWS Solutions Architect Associate Exam Practice Generator** application! This interactive quiz tool allows you to generate questions based on AWS services or provided cheat sheet text, helping you prepare effectively for your certification exam. 🎉

## Features 🚀

- **Dynamic Quiz Generation:** Enter an AWS service or a cheat sheet to generate multiple-choice questions.
- **Customizable Difficulty Levels:** Choose from easy, medium, or hard questions.
- **Instant Results:** Get immediate feedback on your answers, including explanations for correct and incorrect responses.
- **Save Your Progress:** Keep track of your results for future reference.

## Table of Contents 📑

- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Installation ⚙️

To get started with this application, follow these steps:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/elduke717/aws-quiz-app.git
   cd aws-quiz-app
   ```

2. **Install Dependencies:**

   - For the frontend, navigate to the `aws-quiz-frontend` directory and run:

     ```bash
     npm install
     ```

   - For the backend, navigate to the `aws-quiz-backend` directory and run:

     ```bash
     npm install
     ```

3. **Set Up Environment Variables:**

   - Create a `.env` file in the `server` directory and add your OpenAI API key:

     ```plaintext
     OPENAI_API_KEY=your_openai_api_key
     ```

4. **Start the Server:**

   ```bash
   cd aws-quiz-backend
   node index.js
   ```

5. **Start the Client:**

   In another terminal window, navigate to the `aws-quiz-frontend` directory and run:

   ```bash
   npm start
   ```

6. **Open in Browser:**

   Visit `http://localhost:3000` to view the application! 🌐

## Usage 🖥️

1. **Input AWS Service or Cheat Sheet:**

   - Enter an AWS service (e.g., "EC2") or paste relevant cheat sheet text.

2. **Select Difficulty Level:**

   - Choose the difficulty of the questions (easy, medium, hard).

3. **Start the Quiz:**

   - Click the "Start Quiz" button to generate your quiz.

4. **Answer Questions:**

   - Select your answers from the provided options and submit them.

5. **View Results:**

   - After submitting, view your results, including explanations for each question.

6. **Save Results:**
   - Optionally, save your results and start a new quiz. 📊

## Technologies Used 🛠️

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **OpenAI API:** For question generation
- **CORS:** To enable cross-origin requests

## Contributing 🤝

Contributions are welcome! If you have suggestions or improvements, please fork the repository and submit a pull request.

1. Fork the project
2. Create your feature branch: `git checkout -b feature/MyFeature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/MyFeature`
5. Open a pull request

## License 📄

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
