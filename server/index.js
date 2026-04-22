import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Initialize Gemini API conditionally
// So the app doesn't crash if the user hasn't set their key yet!
let gemini = null;
if (process.env.GEMINI_API_KEY) {
  gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
} else {
  console.warn(
    "GEMINI_API_KEY is missing from environment. Starting in Simulation mode.",
  );
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

app.post("/api/execute", async (req, res) => {
  const { workflow, agent, taskInput } = req.body;

  if (!workflow || !agent) {
    return res
      .status(400)
      .json({
        success: false,
        error: "Workflow and Agent are required to execute.",
      });
  }

  console.log(`\n========================================`);
  console.log(
    ` [EXECUTION START] Workflow: "${workflow.name}" 
    | Agent: "${agent.name}"`,
  );
  console.log(`========================================\n`);

  try {
    const nodes = workflow.nodes || [];
    let finalOutput = "";

    // If an AI Agent node exists, let's process it
    const aiNode = nodes.find((n) => n.type === "ai-agent");

    if (aiNode) {
      console.log(`[Processing AI Agent Step] Persona:
         ${agent.type}`);
      const systemPrompt = `You are a helpful AI agent
       named ${agent.name}. Your role is:
       ${agent.description}. Provide a professional, 
       concise response to the user's workflow task.`;
      const userPrompt = taskInput
        ? `Task Input Data:\n${taskInput}`
        : `Please execute your primary workflow task 
        based on your configured persona.`;

      if (gemini) {
        // Real Gemini API Execution
        let modelName = agent.model || "gemini-1.5-flash";
        // Map friendly names to actual model IDs (use
        //  models available in current API)
        const modelMap = {
          "gemini-1.5-flash": "gemini-1.5-flash",
          "gemini-1.5-pro": "gemini-1.5-pro",
          "gemini-2.0-flash": "gemini-2.0-flash",
          "gemini-pro": "gemini-1.5-flash", 
          // Map
          //  legacy name to current stable
          "Gemini 1.5 Flash": "gemini-1.5-flash",
          "Gemini 1.5 Pro": "gemini-1.5-pro",
          "Gemini 2.0 Flash": "gemini-2.0-flash",
          "Gemini Pro": "gemini-1.5-flash",
          // Map alternative model names to Gemini equivalents
          "GPT-4": "gemini-1.5-flash",
          "GPT-3.5": "gemini-1.5-flash",
          "Claude 3": "gemini-1.5-flash",
          "Claude 2": "gemini-1.5-flash",
          Claude: "gemini-1.5-flash",
        };
        console.log(
          `[Agent Config] Model requested: "${agent.model || "default"}"`,
        );
        modelName = modelMap[modelName] || "gemini-1.5-flash";
        console.log(`[Gemini Call] Using mapped model: ${modelName}`);
        try {
          const model = gemini.getGenerativeModel({ model: modelName });
          const combinedPrompt = `${systemPrompt}\n\n${userPrompt}`;
          const result = await model.generateContent(combinedPrompt);
          const response = await result.response;
          finalOutput = response.text();
        } catch (apiError) {
          console.error("[Gemini API Error Details]", {
            message: apiError.message,
            model: modelName,
            statusCode: apiError.status,
          });
          // Fallback to simulation mode if API fails
          await delay(2000);
          finalOutput = `[FALLBACK MODE]\n${apiError.message}\n\nThe
           Gemini API had an issue. Please check:\n1. Your API key is valid\n2. 
           The model name is supported\n3. Your network connection\n\nFallback Response: 
           As ${agent.name}, your workflow has been queued for processing.`;
        }
      } else {
        // Simulation Mode execution
        await delay(2000); // simulate thinking
        finalOutput = `[SIMULATED RESPONSE]\nAs ${agent.name} (a ${agent.type} model),
         I have successfully analyzed the workflow intent and processed the documents.
          \n\n(To see real AI output, start this backend server with a GEMINI_API_KEY!)`;
      }
    } else {
      // Just a simple workflow without an AI Step
      await delay(1000);
      finalOutput = `Workflow executed successfully through ${nodes.length} standard nodes.
       No specific AI generation step was found!`;
    }

    console.log(`[EXECUTION SUCCESS] Result generated.`);
    console.log(`========================================\n`);

    res.json({ success: true, output: finalOutput });
  } catch (error) {
    console.error("[EXECUTION ERROR] ", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Agent Execution Engine running at http://localhost:${PORT}`);
});
