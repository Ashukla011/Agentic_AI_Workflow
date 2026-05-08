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
      const systemPrompt = `You are a professional AI analyst and agent named ${agent.name}. 
Your role is: ${agent.description}

RESPONSE GUIDELINES:
- Be direct and professional (avoid "has been received", "provided", "processed successfully")
- Keep responses compact: 1-3 lines maximum
- Use action verbs: analyzed, synced, imported, validated, completed, insights generated
- Structure responses as: [Status] → [What happened with context] → [Business insight/metric]
- Include specific business metrics and context from the data
- Add business impact details (categories, channels, totals, trends)

Example format:
"Analysis complete. Processed 5 sales transactions across 4 product categories with multiple payment methods. Electronics showed 25% growth."`;
      const userPrompt = taskInput
        ? `ANALYZE THIS DATA:\n${taskInput}\n\nRespond in format: [Status]. [What you found with specifics and business context]. [Key insight or metric].\nBe concise, professional, and data-driven.`
        : `Please execute your primary workflow task 
        based on your configured persona.`;

      if (gemini) {
        // Real Gemini API Execution
        const requestedModel = (agent.model || "gemini-2.5-pro").trim();
        const modelMap = {
          "gemini-1.5-flash": "gemini-2.5-flash",
          "gemini-1.5-pro": "gemini-2.5-pro",
          "gemini-2.0-flash": "gemini-2.0-flash",
          "gemini-2.0-flash-001": "gemini-2.0-flash-001",
          "gemini-2.0-flash-lite": "gemini-2.0-flash-lite",
          "gemini-2.0-flash-lite-001": "gemini-2.0-flash-lite-001",
          "gemini-2.5-flash": "gemini-2.5-flash",
          "gemini-2.5-pro": "gemini-2.5-pro",
          "gemini-2.5-flash-lite": "gemini-2.5-flash-lite",
          "gemini-pro": "gemini-2.5-pro",
          "Custom Model": "gemini-2.5-pro",
          // Legacy labels
          "Gemini 1.5 Flash": "gemini-2.5-flash",
          "Gemini 1.5 Pro": "gemini-2.5-pro",
          "Gemini 2.0 Flash": "gemini-2.0-flash",
          "Gemini Pro": "gemini-2.5-pro",
          // Alternative labels
          "GPT-4": "gemini-2.5-pro",
          "GPT-3.5": "gemini-2.5-pro",
          "Claude 3": "gemini-2.5-pro",
          "Claude 2": "gemini-2.5-pro",
          Claude: "gemini-2.5-pro",
        };

        const knownModels = [
          "gemini-2.5-pro",
          "gemini-2.5-flash",
          "gemini-2.5-flash-lite",
          "gemini-2.0-flash",
          "gemini-2.0-flash-001",
          "gemini-2.0-flash-lite-001",
          "gemini-2.0-flash-lite",
        ];

        const primaryModel = modelMap[requestedModel] || requestedModel || "gemini-2.5-pro";
        const candidateModels = [
          primaryModel,
          ...knownModels.filter((m) => m !== primaryModel),
        ];

        console.log(`[Agent Config] Model requested: "${requestedModel}"`);
        console.log(`[Gemini Call] Candidate models: ${candidateModels.join(', ')}`);

        const combinedPrompt = `${systemPrompt}\n\n${userPrompt}`;
        let usedModel = primaryModel;
        let lastError = null;

        for (const candidate of candidateModels) {
          for (const apiVersion of ["v1", "v1beta"]) {
            try {
              const model = gemini.getGenerativeModel({ model: candidate });
              console.log(`[Gemini Call] Trying model: ${candidate} on API version: ${apiVersion}`);
              const result = await model.generateContent(combinedPrompt, { apiVersion });
              const response = await result.response;
              finalOutput = response.text();
              usedModel = candidate;
              console.log(`[Gemini Success] Model ${candidate} returned a response on ${apiVersion}.`);
              break;
            } catch (apiError) {
              lastError = apiError;
              console.warn("[Gemini API Model Failure]", {
                message: apiError.message,
                model: candidate,
                apiVersion,
                statusCode: apiError.status,
              });

              const shouldFallback =
                apiError.status === 404 ||
                /not found|unsupported|not supported/i.test(apiError.message);
              if (!shouldFallback) {
                break;
              }

              console.log(`[Gemini Call] Model ${candidate} unsupported on ${apiVersion}, trying next version/fallback...`);
            }
          }
          if (finalOutput) break;
        }

        if (!finalOutput) {
          console.error("[Gemini API Error Details]", {
            message: lastError?.message || "Unknown error",
            model: usedModel,
            statusCode: lastError?.status,
          });
          await delay(2000);
          finalOutput = `[FALLBACK MODE]\n${lastError?.message || "Gemini API had an unknown error."}\n\nThe Gemini API had an issue. Please check:\n1. Your API key is valid\n2. The model name is supported\n3. Your network connection\n\nFallback Response: As ${agent.name}, your workflow has been queued for processing.`;
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
