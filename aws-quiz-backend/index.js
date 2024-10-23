const express = require("express");
const cors = require("cors");
require("dotenv").config();
const OpenAI = require("openai");
const fs = require('fs');
const path = require('path');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
const PORT = process.env.PORT || 5050;

app.post("/generate-questions", async (req, res) => {
  const { service, model } = req.body;
  try {
    const prompt = `Generate 20 multiple-choice questions with 5 options each on AWS ${service} for the Solutions Architect Associate Exam. Provide the correct answer and explanations for each option without revealing the correct answer upfront. Format the response as a JSON array where each question object has the following structure:
    {
      "question": "Question text",
      "options": ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4", "E. Option 5"],
      "correctAnswer": "A/B/C/D/E",
      "explanation": {
        "A": "Explanation for option A",
        "B": "Explanation for option B",
        "C": "Explanation for option C",
        "D": "Explanation for option D",
        "E": "Explanation for option E"
      }
    }`;

    const response = await openai.chat.completions.create({
      model: model || "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 10000,
      temperature: 0.7,
    });

    let assistantMessage = response.choices[0].message.content;
    
    // Clean up the response
    assistantMessage = assistantMessage.trim();
    if (assistantMessage.startsWith("```json")) {
      assistantMessage = assistantMessage.substring(assistantMessage.indexOf("\n") + 1);
    }
    if (assistantMessage.endsWith("```")) {
      assistantMessage = assistantMessage.substring(0, assistantMessage.lastIndexOf("```"));
    }

    // Parse and validate the JSON
    const questions = JSON.parse(assistantMessage);

    // Validate question format
    questions.forEach((q, i) => {
      if (!q.question || !q.options || !q.correctAnswer || !q.explanation) {
        console.error(`Question ${i} is missing required fields:`, q);
      }
    });

    res.json({ questions });
  } catch (error) {
    console.error("Error generating questions:", error.response ? error.response.data : error.message);
    res.status(500).send("Error generating questions.");
  }
});

app.post("/check-answers", async (req, res) => {
  const { userAnswers, questions, model } = req.body;
  try {
    // Inside app.post("/check-answers", ...)
  const results = questions.map((question, index) => {
    const userAnswer = userAnswers[index];
    const correct = userAnswer === question.correctAnswer;

    // Get the full option text for user's answer
    const userAnswerText = question.options.find(opt => opt.startsWith(userAnswer));
    
    // Get the full option text for correct answer
    const correctAnswerText = question.options.find(opt => opt.startsWith(question.correctAnswer));

    // Create result object with error checking and proper explanation access
    const result = {
      question: question.question,
      userAnswer: userAnswerText || 'No answer provided',
      correctAnswer: correctAnswerText || 'Answer not available',
      correct: correct,
      // Get explanation for correct answer
      explanation: question.explanation && question.correctAnswer ? 
        question.explanation[question.correctAnswer] : 
        'Explanation not available',
      // Get explanation for user's answer if one was provided
      userExplanation: userAnswer && question.explanation ? 
        question.explanation[userAnswer] : 
        'No answer provided'
    };

    return result;
  });
    res.json({ results });
  } catch (error) {
    console.error('Error in check-answers:', error);
    console.error('Questions:', JSON.stringify(questions, null, 2)); // Add this for debugging
    res.status(500).send("Error checking answers.");
  }
});

app.post("/save-results", async (req, res) => {
  const { results } = req.body;
  try {
    const dataToSave = JSON.stringify(results, null, 2) + ',\n';
    const filePath = path.join(__dirname, 'results.txt');

    fs.appendFile(filePath, dataToSave, (err) => {
      if (err) {
        console.error('Error saving results:', err);
        res.status(500).send("Error saving results.");
      } else {
        res.send("Results saved successfully.");
      }
    });
  } catch (error) {
    console.error('Error in save-results:', error);
    res.status(500).send("Error saving results.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
