import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-64983ccf/health", (c) => {
  return c.json({ status: "ok" });
});

// ==================== WORKFLOWS ====================

// Get all workflows
app.get("/make-server-64983ccf/workflows", async (c) => {
  try {
    const workflows = await kv.getByPrefix("workflow:");
    return c.json({ success: true, workflows });
  } catch (error) {
    console.log("Error fetching workflows:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get single workflow
app.get("/make-server-64983ccf/workflows/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const workflow = await kv.get(`workflow:${id}`);
    
    if (!workflow) {
      return c.json({ success: false, error: "Workflow not found" }, 404);
    }
    
    return c.json({ success: true, workflow });
  } catch (error) {
    console.log("Error fetching workflow:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create workflow
app.post("/make-server-64983ccf/workflows", async (c) => {
  try {
    const body = await c.req.json();
    const { name, nodes, description } = body;
    
    if (!name) {
      return c.json({ success: false, error: "Workflow name is required" }, 400);
    }
    
    const id = `wf-${Date.now()}`;
    const workflow = {
      id,
      name,
      nodes: nodes || [],
      description: description || "",
      status: "draft",
      executions: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`workflow:${id}`, workflow);
    return c.json({ success: true, workflow });
  } catch (error) {
    console.log("Error creating workflow:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update workflow
app.put("/make-server-64983ccf/workflows/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    
    const existing = await kv.get(`workflow:${id}`);
    if (!existing) {
      return c.json({ success: false, error: "Workflow not found" }, 404);
    }
    
    const workflow = {
      ...existing,
      ...body,
      id,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`workflow:${id}`, workflow);
    return c.json({ success: true, workflow });
  } catch (error) {
    console.log("Error updating workflow:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete workflow
app.delete("/make-server-64983ccf/workflows/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`workflow:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting workflow:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==================== AGENTS ====================

// Get all agents
app.get("/make-server-64983ccf/agents", async (c) => {
  try {
    const agents = await kv.getByPrefix("agent:");
    return c.json({ success: true, agents });
  } catch (error) {
    console.log("Error fetching agents:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get single agent
app.get("/make-server-64983ccf/agents/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const agent = await kv.get(`agent:${id}`);
    
    if (!agent) {
      return c.json({ success: false, error: "Agent not found" }, 404);
    }
    
    return c.json({ success: true, agent });
  } catch (error) {
    console.log("Error fetching agent:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create agent
app.post("/make-server-64983ccf/agents", async (c) => {
  try {
    const body = await c.req.json();
    const { name, type, model, description } = body;
    
    if (!name || !type || !model) {
      return c.json({ success: false, error: "Name, type, and model are required" }, 400);
    }
    
    const id = `agent-${Date.now()}`;
    const agent = {
      id,
      name,
      type,
      model,
      description: description || "",
      status: "idle",
      tasks: 0,
      efficiency: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`agent:${id}`, agent);
    return c.json({ success: true, agent });
  } catch (error) {
    console.log("Error creating agent:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update agent
app.put("/make-server-64983ccf/agents/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    
    const existing = await kv.get(`agent:${id}`);
    if (!existing) {
      return c.json({ success: false, error: "Agent not found" }, 404);
    }
    
    const agent = {
      ...existing,
      ...body,
      id,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`agent:${id}`, agent);
    return c.json({ success: true, agent });
  } catch (error) {
    console.log("Error updating agent:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete agent
app.delete("/make-server-64983ccf/agents/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`agent:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting agent:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==================== PROCESSES ====================

// Get all processes
app.get("/make-server-64983ccf/processes", async (c) => {
  try {
    const processes = await kv.getByPrefix("process:");
    return c.json({ success: true, processes });
  } catch (error) {
    console.log("Error fetching processes:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get single process
app.get("/make-server-64983ccf/processes/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const process = await kv.get(`process:${id}`);
    
    if (!process) {
      return c.json({ success: false, error: "Process not found" }, 404);
    }
    
    return c.json({ success: true, process });
  } catch (error) {
    console.log("Error fetching process:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create/Run process
app.post("/make-server-64983ccf/processes", async (c) => {
  try {
    const body = await c.req.json();
    const { workflowId, agentId } = body;
    
    if (!workflowId || !agentId) {
      return c.json({ success: false, error: "Workflow ID and Agent ID are required" }, 400);
    }
    
    // Get workflow and agent
    const workflow = await kv.get(`workflow:${workflowId}`);
    const agent = await kv.get(`agent:${agentId}`);
    
    if (!workflow) {
      return c.json({ success: false, error: "Workflow not found" }, 404);
    }
    if (!agent) {
      return c.json({ success: false, error: "Agent not found" }, 404);
    }
    
    const id = `process-${Date.now()}`;
    const process = {
      id,
      name: `${workflow.name} #${id}`,
      workflowId,
      workflowName: workflow.name,
      agentId,
      agentName: agent.name,
      status: "running",
      progress: 0,
      tasksCompleted: 0,
      totalTasks: workflow.nodes?.length || 1,
      startTime: new Date().toISOString(),
      duration: "0s",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`process:${id}`, process);
    
    // Update workflow execution count
    await kv.set(`workflow:${workflowId}`, {
      ...workflow,
      executions: (workflow.executions || 0) + 1,
    });
    
    // Update agent tasks
    await kv.set(`agent:${agentId}`, {
      ...agent,
      tasks: (agent.tasks || 0) + 1,
      status: "active",
    });
    
    return c.json({ success: true, process });
  } catch (error) {
    console.log("Error creating process:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update process
app.put("/make-server-64983ccf/processes/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    
    const existing = await kv.get(`process:${id}`);
    if (!existing) {
      return c.json({ success: false, error: "Process not found" }, 404);
    }
    
    const process = {
      ...existing,
      ...body,
      id,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`process:${id}`, process);
    return c.json({ success: true, process });
  } catch (error) {
    console.log("Error updating process:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==================== ANALYTICS ====================

// Get analytics data
app.get("/make-server-64983ccf/analytics", async (c) => {
  try {
    const processes = await kv.getByPrefix("process:");
    const agents = await kv.getByPrefix("agent:");
    const workflows = await kv.getByPrefix("workflow:");
    
    // Calculate stats
    const totalExecutions = processes.length;
    const completedProcesses = processes.filter((p: any) => p.status === "completed").length;
    const failedProcesses = processes.filter((p: any) => p.status === "failed").length;
    const runningProcesses = processes.filter((p: any) => p.status === "running").length;
    
    const successRate = totalExecutions > 0 
      ? ((completedProcesses / totalExecutions) * 100).toFixed(1)
      : 0;
    
    const analytics = {
      totalExecutions,
      completedProcesses,
      failedProcesses,
      runningProcesses,
      successRate,
      totalAgents: agents.length,
      activeAgents: agents.filter((a: any) => a.status === "active").length,
      totalWorkflows: workflows.length,
      processes: processes.slice(0, 50), // Return latest 50 processes
    };
    
    return c.json({ success: true, analytics });
  } catch (error) {
    console.log("Error fetching analytics:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==================== SETTINGS ====================

// Get settings
app.get("/make-server-64983ccf/settings", async (c) => {
  try {
    const settings = await kv.get("settings:platform");
    return c.json({ success: true, settings: settings || {} });
  } catch (error) {
    console.log("Error fetching settings:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update settings
app.put("/make-server-64983ccf/settings", async (c) => {
  try {
    const body = await c.req.json();
    await kv.set("settings:platform", {
      ...body,
      updatedAt: new Date().toISOString(),
    });
    return c.json({ success: true });
  } catch (error) {
    console.log("Error updating settings:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);