// Local Storage API Mock implementation
// Replaces the remote Supabase edge function to make the prototype work locally seamlessly.

const simulateNetworkDelay = () => new Promise(resolve => setTimeout(resolve, 300));
const generateId = (prefix: string) => `${prefix}-${Date.now()}`;

const getCollection = (key: string) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};
const setCollection = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));

const getObject = (key: string) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : {};
};
const setObject = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));

// Base CRUD generator
const createCrudAPI = (collectionKey: string, itemName: string, pluralName: string, idPrefix: string) => ({
  getAll: async () => {
    await simulateNetworkDelay();
    return { success: true, [pluralName]: getCollection(collectionKey) };
  },
  getOne: async (id: string) => {
    await simulateNetworkDelay();
    const item = getCollection(collectionKey).find((i: any) => i.id === id);
    if (!item) throw new Error(`${itemName} not found`);
    return { success: true, [itemName]: item };
  },
  create: async (data: any) => {
    await simulateNetworkDelay();
    const collection = getCollection(collectionKey);
    const newItem = {
      ...data,
      id: data.id || generateId(idPrefix),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Add default fields based on type
    if (collectionKey === 'agents') {
      newItem.status = 'idle';
      newItem.tasks = 0;
      newItem.efficiency = 100;
    } else if (collectionKey === 'workflows') {
      newItem.status = 'draft';
      newItem.executions = 0;
    }
    
    collection.push(newItem);
    setCollection(collectionKey, collection);
    return { success: true, [itemName]: newItem };
  },
  update: async (id: string, data: any) => {
    await simulateNetworkDelay();
    const collection = getCollection(collectionKey);
    const index = collection.findIndex((i: any) => i.id === id);
    if (index === -1) throw new Error(`${itemName} not found`);
    
    collection[index] = { ...collection[index], ...data, updatedAt: new Date().toISOString() };
    setCollection(collectionKey, collection);
    return { success: true, [itemName]: collection[index] };
  },
  delete: async (id: string) => {
    await simulateNetworkDelay();
    const collection = getCollection(collectionKey);
    setCollection(collectionKey, collection.filter((i: any) => i.id !== id));
    return { success: true };
  }
});

export const workflowsAPI = createCrudAPI('workflows', 'workflow', 'workflows', 'wf');
export const agentsAPI = createCrudAPI('agents', 'agent', 'agents', 'agent');
export const processesAPI = createCrudAPI('processes', 'process', 'processes', 'process');

// The backend endpoint also did some custom logic for process creation, let's override processesAPI.create
processesAPI.create = async (data: any) => {
  await simulateNetworkDelay();
  const { workflowId, agentId, taskInput } = data;
  
  if (!workflowId || !agentId) throw new Error('Workflow ID and Agent ID required');
  
  const workflows = getCollection('workflows');
  const workflow = workflows.find((w: any) => w.id === workflowId);
  if (!workflow) throw new Error('Workflow not found');
  
  const agents = getCollection('agents');
  const agent = agents.find((a: any) => a.id === agentId);
  if (!agent) throw new Error('Agent not found');
  
  const id = generateId('process');
  const process: any = {
    id,
    name: `${workflow.name} #${id}`,
    workflowId,
    workflowName: workflow.name,
    agentId,
    agentName: agent.name,
    status: 'running',
    progress: 0,
    tasksCompleted: 0,
    totalTasks: workflow.nodes?.length || 1,
    startTime: new Date().toISOString(),
    duration: '0s',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    output: ''
  };
  
  // Call the actual Execution Engine running locally!
  try {
    const response = await fetch('http://localhost:3001/api/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workflow, agent, taskInput })
    });
    
    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = { error: 'Invalid response format from server.' };
    }
    
    if (response.ok && data.success) {
      process.output = data.output;
      process.status = 'completed';
      process.progress = 100;
      process.tasksCompleted = process.totalTasks;
    } else {
      process.output = `Engine Error: ${data.error || 'Request to execution engine failed.'}\n\n(Tip: Check your terminal running the backend for more details!)`;
      process.status = 'failed';
    }
  } catch (error: any) {
    console.error('Execution Engine Error:', error);
    process.output = `Could not reach execution engine: ${error.message}\nMake sure http://localhost:3001 is running!`;
    process.status = 'failed';
  }
  
  const processes = getCollection('processes');
  processes.push(process);
  setCollection('processes', processes);
  
  // Update workflow stats
  workflow.executions = (workflow.executions || 0) + 1;
  const wIndex = workflows.findIndex((w: any) => w.id === workflowId);
  workflows[wIndex] = workflow;
  setCollection('workflows', workflows);

  // Update agent stats
  agent.tasks = (agent.tasks || 0) + 1;
  agent.status = 'active';
  const aIndex = agents.findIndex((a: any) => a.id === agentId);
  agents[aIndex] = agent;
  setCollection('agents', agents);
  
  return { success: true, process };
};

// Analytics API
export const analyticsAPI = {
  get: async () => {
    await simulateNetworkDelay();
    const processes = getCollection('processes');
    const agents = getCollection('agents');
    const workflows = getCollection('workflows');
    
    const totalExecutions = processes.length;
    const completedProcesses = processes.filter((p: any) => p.status === 'completed').length;
    const failedProcesses = processes.filter((p: any) => p.status === 'failed').length;
    const runningProcesses = processes.filter((p: any) => p.status === 'running').length;
    
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
      activeAgents: agents.filter((a: any) => a.status === 'active').length,
      totalWorkflows: workflows.length,
      processes: processes.slice(0, 50),
    };
    
    return { success: true, analytics };
  }
};

// Settings API
export const settingsAPI = {
  get: async () => {
    await simulateNetworkDelay();
    const settings = getObject('settings');
    return { success: true, settings };
  },
  update: async (settingsData: any) => {
    await simulateNetworkDelay();
    const settings = getObject('settings');
    setObject('settings', { ...settings, ...settingsData, updatedAt: new Date().toISOString() });
    return { success: true };
  }
};
