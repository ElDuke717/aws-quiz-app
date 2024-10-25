const express = require("express");
const cors = require("cors");
require("dotenv").config();
const OpenAI = require("openai");
const Anthropic = require("@anthropic-ai/sdk");
const fs = require("fs");
const path = require("path");

// Initialize API clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Model-specific token limits
const TOKEN_LIMITS = {
  'gpt-4o-mini': 15000,
  'gpt-4o': 15000,
  'claude-3-5-sonnet-20241022': 8000,
  'claude-3-opus-20240229': 4000,
  'claude-3-sonnet-20240229': 4000,
  'claude-3-haiku-20240229': 8000
};

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
const PORT = process.env.PORT || 5050;

app.post("/generate-questions", async (req, res) => {
  let { service, cheatSheet, difficulty, model, questionType } = req.body;
if (!questionType) {
  questionType = "basic"; // Default to 'basic'
}
  
  try {
    // Validate difficulty level
    const allowedDifficulties = ["easy", "medium", "hard"];
    if (!allowedDifficulties.includes(difficulty)) {
      difficulty = "medium";
    }

    // Build the prompt dynamically
    // Build the prompt dynamically
let prompt = "";

if (cheatSheet) {
  prompt += `Based on the following text, generate 10 ${difficulty} `;
} else if (service) {
  prompt += `Generate 10 ${difficulty} `;
} else {
  return res
    .status(400)
    .send("Please provide either an AWS service or cheat sheet text.");
}

if (questionType === "situational") {
  prompt += `scenario-based multiple-choice questions `;
} else {
  prompt += `multiple-choice questions `;
}

if (cheatSheet) {
  prompt += `for the AWS Solutions Architect Associate Exam. The text is: "${cheatSheet}". `;
} else if (service) {
  prompt += `on AWS ${service} for the AWS Solutions Architect Associate Exam. `;
}

prompt += `Each question should have 4 options (A, B, C, D), and some questions may require selecting multiple correct answers (e.g., "Select TWO"). 

Provide the correct answer(s) and explanations for each option without revealing the correct answer upfront.

**Important Instructions:**
- **Format the response as a JSON array without any code block formatting** (do not include any \`\`\`json or \`\`\`).
- **Do not include any additional text** before or after the JSON array.
- Ensure the JSON is **valid and can be parsed directly**.

Here is the structure to follow for each question object:

{
  "question": "Question text",
  "options": ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"],
  "correctAnswers": ["A", "C"], // An array of correct answer(s)
  "explanation": {
    "A": "Explanation for option A",
    "B": "Explanation for option B",
    "C": "Explanation for option C",
    "D": "Explanation for option D"
  }
}

Provide only the JSON array as the output.`;

    let assistantMessage;
    const maxTokens = TOKEN_LIMITS[model] || 15000;

    // Handle different model types
    if (model.startsWith('claude')) {
      const response = await anthropic.messages.create({
        model: model,
        max_tokens: maxTokens,
        temperature: 0.7,
        messages: [{ role: "user", content: prompt }]
      });
      
      // Extract the content from Claude's response
      assistantMessage = response.content[0].text;
      
      // Additional cleanup for Claude's response
      if (assistantMessage.includes('```json')) {
        assistantMessage = assistantMessage.split('```json')[1].split('```')[0].trim();
      }
    } else {
      const response = await openai.chat.completions.create({
        model: model || "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: maxTokens,
        temperature: 0.7,
      });
      assistantMessage = response.choices[0].message.content;
    }

    // Clean up the response
    assistantMessage = assistantMessage.trim();

    // Remove code block markers if they exist
    if (assistantMessage.startsWith('```')) {
      assistantMessage = assistantMessage.replace(/```(?:json)?/g, '').trim();
    }
    
    try {
      // Parse and validate the JSON
      const questions = JSON.parse(assistantMessage);

      // Ensure questions is an array
      if (!Array.isArray(questions)) {
        throw new Error("Response is not an array of questions");
      }

      // Validate question format
      questions.forEach((q, i) => {
        if (!q.question || !q.options || !q.correctAnswers || !q.explanation) {
          console.error(`Question ${i} is missing required fields:`, q);
        }
        // Ensure correctAnswers is an array
        if (!Array.isArray(q.correctAnswers)) {
          q.correctAnswers = [q.correctAnswers];
        }
      });

      // Save the questions along with the service to a file
      const dataToSave =
        JSON.stringify({ service, cheatSheet, difficulty, questions }, null, 2) +
        ",\n";
      const filePath = path.join(__dirname, "questions.txt");

      fs.appendFile(filePath, dataToSave, (err) => {
        if (err) {
          console.error("Error saving questions:", err);
        } else {
          console.log("Questions saved successfully.");
        }
      });

      res.json({ questions });
    } catch (parseError) {
      console.error("Error parsing response:", parseError);
      console.error("Raw response:", assistantMessage);
      res.status(500).send("Error parsing AI response: Invalid JSON format");
    }
  } catch (error) {
    console.error(
      "Error generating questions:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send("Error generating questions.");
  }
});

app.post("/check-answers", async (req, res) => {
  const { userAnswers, questions, model } = req.body;
  try {
    const results = questions.map((question, index) => {
      const userAnswer = userAnswers[index] || [];
      const correctAnswers = question.correctAnswers || [];

      // Compare user's answers with correct answers
      const correct = arraysEqual(
        userAnswer.map((a) => a.trim().toUpperCase()).sort(),
        correctAnswers.map((a) => a.trim().toUpperCase()).sort()
      );

      // Get the full option texts for user's answers
      const userAnswerTexts = userAnswer.map((ua) =>
        question.options.find((opt) => opt.startsWith(ua))
      );

      // Get the full option texts for correct answers
      const correctAnswerTexts = correctAnswers.map((ca) =>
        question.options.find((opt) => opt.startsWith(ca))
      );

      // Create result object
      const result = {
        question: question.question,
        userAnswer: userAnswerTexts.length > 0 ? userAnswerTexts.join(', ') : "No answer provided",
        correctAnswer: correctAnswerTexts.join(', '),
        correct: correct,
        explanation: question.explanation || "Explanation not available",
      };

      return result;
    });
    res.json({ results });
  } catch (error) {
    console.error("Error in check-answers:", error);
    res.status(500).send("Error checking answers.");
  }
});

// Helper function to compare arrays
function arraysEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

app.post("/save-results", async (req, res) => {
  const { results } = req.body;
  try {
    const dataToSave = JSON.stringify(results, null, 2) + ",\n";
    const filePath = path.join(__dirname, "results.txt");

    fs.appendFile(filePath, dataToSave, (err) => {
      if (err) {
        console.error("Error saving results:", err);
        res.status(500).send("Error saving results.");
      } else {
        res.send("Results saved successfully.");
      }
    });
  } catch (error) {
    console.error("Error in save-results:", error);
    res.status(500).send("Error saving results.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});