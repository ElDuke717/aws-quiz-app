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
  "gpt-4o-mini": 15000,
  "gpt-4o": 15000,
  "claude-3-5-sonnet-20241022": 8000,
  "claude-3-opus-20240229": 4000,
  "claude-3-sonnet-20240229": 4000,
  "claude-3-haiku-20240229": 8000,
};

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
const PORT = process.env.PORT || 5050;

app.post("/generate-content", async (req, res) => {
  let { service, cheatSheet, difficulty, model, questionType, contentType } =
    req.body;

  try {
    // Validate contentType
    if (!contentType) {
      contentType = "quiz"; // Default to 'quiz'
    }

    // Validate difficulty level
    const allowedDifficulties = ["easy", "medium", "hard"];
    if (!allowedDifficulties.includes(difficulty)) {
      difficulty = "medium";
    }

    // Validate questionType
    if (!questionType) {
      questionType = "basic"; // Default to 'basic'
    }

    // Build the prompt dynamically
    let prompt = "";

    if (cheatSheet) {
      prompt += `Based on the following text, `;
    } else if (service) {
      prompt += `Provide detailed information on AWS ${service}. `;
    } else {
      return res
        .status(400)
        .send("Please provide either an AWS service or cheat sheet text.");
    }

    if (contentType === "studyGuide") {
      prompt += `Create a comprehensive study guide for the AWS Solutions Architect Associate Exam. The study guide should include:
- Key concepts and definitions
- Mnemonics, heuristics and/or memory aids to help remember information about the subject
- Simple diagrams or visual aids to illustrate important points
- If applicable, tables that compare and contrast key aspects of the service or topic
- Outlines of any processes involved with the topic
- Five practice questions about the service or topic
- Potential points of confusion about the subject

The study guide should be formatted in Markdown, using appropriate headings, lists, and tables where necessary. Do not include any additional text outside of the study guide.`;
    } else if (contentType === "quiz") {
      // Quiz generation logic
      prompt += `generate 10 ${difficulty} `;

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
    }

    let assistantMessage;
    const maxTokens = TOKEN_LIMITS[model] || 15000;

    // Handle different model types
    if (model.startsWith("claude")) {
      // For Claude models
      const response = await anthropic.completions.create({
        model: model,
        prompt: `\n\nHuman: ${prompt}\n\nAssistant:`,
        max_tokens_to_sample: maxTokens,
        temperature: 0.7,
        stop_sequences: ["\n\nHuman:"],
      });
      assistantMessage = response.completion.trim();

      // Additional cleanup for Claude's response
      if (assistantMessage.startsWith("```")) {
        assistantMessage = assistantMessage.replace(/```(?:json)?/g, "").trim();
      }
    } else {
      // For OpenAI models
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

    if (contentType === "studyGuide") {
      // Send the study guide back to the frontend
      res.json({ studyGuide: assistantMessage });
    } else if (contentType === "quiz") {
      // Parse and validate the JSON for quiz
      // Remove code block markers if they exist
      if (assistantMessage.startsWith("```")) {
        assistantMessage = assistantMessage.replace(/```(?:json)?/g, "").trim();
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
          if (
            !q.question ||
            !q.options ||
            !q.correctAnswers ||
            !q.explanation
          ) {
            console.error(`Question ${i} is missing required fields:`, q);
          }
          // Ensure correctAnswers is an array
          if (!Array.isArray(q.correctAnswers)) {
            q.correctAnswers = [q.correctAnswers];
          }
        });

        // Save the questions along with the service to a file
        const dataToSave =
          JSON.stringify(
            { service, cheatSheet, difficulty, questions },
            null,
            2
          ) + ",\n";
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
    }
  } catch (error) {
    console.error(
      "Error generating content:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send("Error generating content.");
  }
});

app.post("/check-answers", async (req, res) => {
  const { userAnswers, questions } = req.body;
  try {
    const results = questions.map((question, index) => {
      const userAnswer = userAnswers[index] || [];
      const correctAnswers = question.correctAnswers || [];

      // Ensure userAnswer and correctAnswers are arrays
      const userAnswerArray = Array.isArray(userAnswer)
        ? userAnswer
        : [userAnswer];
      const correctAnswerArray = Array.isArray(correctAnswers)
        ? correctAnswers
        : [correctAnswers];

      // Compare user's answers with correct answers
      const correct = arraysEqual(
        userAnswerArray.map((a) => a.trim().toUpperCase()).sort(),
        correctAnswerArray.map((a) => a.trim().toUpperCase()).sort()
      );

      // Get the full option texts for user's answers
      const userAnswerTexts = userAnswerArray.map((ua) =>
        question.options.find((opt) => opt.startsWith(ua))
      );

      // Get the full option texts for correct answers
      const correctAnswerTexts = correctAnswerArray.map((ca) =>
        question.options.find((opt) => opt.startsWith(ca))
      );

      // Get explanations for user's answers
      const userExplanations = {};
      userAnswerArray.forEach((ua) => {
        if (question.explanation[ua]) {
          userExplanations[ua] = question.explanation[ua];
        }
      });

      // Get explanations for correct answers
      const correctExplanations = {};
      correctAnswerArray.forEach((ca) => {
        if (question.explanation[ca]) {
          correctExplanations[ca] = question.explanation[ca];
        }
      });

      // Create result object
      const result = {
        question: question.question,
        userAnswer:
          userAnswerTexts.length > 0
            ? userAnswerTexts.join(", ")
            : "No answer provided",
        correctAnswer: correctAnswerTexts.join(", "),
        correct: correct,
        userExplanation: userExplanations,
        correctExplanation: correctExplanations,
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

app.post("/save-study-guide", async (req, res) => {
  const { studyGuide, service } = req.body;
  try {
    const fileName = `${service || "study_guide"}.md`;
    const studyGuidesDir = path.join(__dirname, "study guides");

    // Ensure the directory exists
    if (!fs.existsSync(studyGuidesDir)) {
      fs.mkdirSync(studyGuidesDir);
    }

    const filePath = path.join(studyGuidesDir, fileName);

    fs.writeFile(filePath, studyGuide, (err) => {
      if (err) {
        console.error("Error saving study guide:", err);
        res.status(500).send("Error saving study guide.");
      } else {
        res.send("Study guide saved successfully.");
      }
    });
  } catch (error) {
    console.error("Error in save-study-guide:", error);
    res.status(500).send("Error saving study guide.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
