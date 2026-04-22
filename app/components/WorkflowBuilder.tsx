import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { 
  Play, 
  Save, 
  Plus, 
  Trash2, 
  Settings,
  Bot,
  Mail,
  Database,
  Code,
  FileText,
  GitBranch,
  Zap,
  CheckCircle,
  XCircle
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { workflowsAPI, agentsAPI, processesAPI } from "../lib/api";

interface WorkflowNode {
  id: string;
  type: string;
  label: string;
  icon: any;
  x: number;
  y: number;
  config?: any;
}

const nodeTypes = [
  { type: 'trigger', label: 'Trigger', icon: Zap, color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  { type: 'ai-agent', label: 'AI Agent', icon: Bot, color: 'bg-purple-100 text-purple-700 border-purple-300' },
  { type: 'condition', label: 'Condition', icon: GitBranch, color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { type: 'email', label: 'Send Email', icon: Mail, color: 'bg-green-100 text-green-700 border-green-300' },
  { type: 'database', label: 'Database', icon: Database, color: 'bg-orange-100 text-orange-700 border-orange-300' },
  { type: 'code', label: 'Custom Code', icon: Code, color: 'bg-gray-100 text-gray-700 border-gray-300' },
  { type: 'document', label: 'Process Doc', icon: FileText, color: 'bg-indigo-100 text-indigo-700 border-indigo-300' },
];

function NodePalette() {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Workflow Nodes</CardTitle>
        <CardDescription>Drag nodes to the canvas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {nodeTypes.map((nodeType) => (
            <DraggableNode key={nodeType.type} nodeType={nodeType} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function DraggableNode({ nodeType }: { nodeType: any }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'node',
    item: { nodeType },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag as any}
      className={`
        flex items-center gap-3 p-3 border-2 rounded-lg cursor-move transition-all
        ${nodeType.color}
        ${isDragging ? 'opacity-50' : 'opacity-100 hover:shadow-md'}
      `}
    >
      <nodeType.icon className="w-5 h-5" />
      <span className="font-medium text-sm">{nodeType.label}</span>
    </div>
  );
}

function WorkflowCanvas({ nodes, onAddNode, onRemoveNode }: any) {
  const [, drop] = useDrop(() => ({
    accept: 'node',
    drop: (item: any, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset) {
        const canvas = document.getElementById('workflow-canvas');
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          onAddNode(item.nodeType, offset.x - rect.left, offset.y - rect.top);
        }
      }
    },
  }));

  return (
    <div
      id="workflow-canvas"
      ref={drop as any}
      className="relative w-full h-[600px] bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"
      style={{
        backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}
    >
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Zap className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">Drag nodes here to build your workflow</p>
            <p className="text-sm text-gray-500 mt-1">Connect nodes to create intelligent automation</p>
          </div>
        </div>
      )}

      {nodes.map((node: WorkflowNode) => (
        <WorkflowNodeComponent key={node.id} node={node} onRemove={onRemoveNode} />
      ))}
    </div>
  );
}

function WorkflowNodeComponent({ node, onRemove }: any) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'existing-node',
    item: { id: node.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const nodeTypeInfo = nodeTypes.find(nt => nt.type === node.type);

  return (
    <div
      ref={drag as any}
      className={`
        absolute p-4 border-2 rounded-lg bg-white shadow-lg cursor-move
        ${nodeTypeInfo?.color || 'border-gray-300'}
        ${isDragging ? 'opacity-50' : 'opacity-100'}
      `}
      style={{ left: node.x, top: node.y }}
    >
      <div className="flex items-start gap-3 min-w-[200px]">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${nodeTypeInfo?.color}`}>
          <node.icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-sm text-gray-900">{node.label}</h4>
          <p className="text-xs text-gray-500 mt-0.5">{node.type}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 -mt-1 -mr-1"
          onClick={() => onRemove(node.id)}
        >
          <Trash2 className="w-4 h-4 text-gray-500" />
        </Button>
      </div>
      
      {/* Connection points */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
    </div>
  );
}

export function WorkflowBuilder() {
  const [workflowName, setWorkflowName] = useState("New Workflow");
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [isRunDialogOpen, setIsRunDialogOpen] = useState(false);
  const [availableAgents, setAvailableAgents] = useState<any[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [taskInput, setTaskInput] = useState("");

  const addNode = (nodeType: any, x: number, y: number) => {
    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type: nodeType.type,
      label: nodeType.label,
      icon: nodeType.icon,
      x,
      y,
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
    toast.success(`Added ${nodeType.label} node`);
  };

  const removeNode = (id: string) => {
    setNodes((prevNodes) => prevNodes.filter(node => node.id !== id));
    toast.success('Node removed');
  };

  const saveWorkflow = async () => {
    try {
      const workflowData = {
        name: workflowName,
        nodes: nodes.map(node => ({
          id: node.id,
          type: node.type,
          label: node.label,
          x: node.x,
          y: node.y,
          config: node.config
        })),
        description: `Workflow with ${nodes.length} nodes`
      };
      
      const response = await workflowsAPI.create(workflowData);
      if (response.success) {
        toast.success(`Workflow "${workflowName}" saved successfully`);
      }
    } catch (error) {
      console.error('Error saving workflow:', error);
      toast.error('Failed to save workflow');
    }
  };

  const runWorkflow = async () => {
    if (nodes.length === 0) {
      toast.error('Add nodes to your workflow first');
      return;
    }
    try {
      const response = await agentsAPI.getAll();
      if (response.success) {
        setAvailableAgents(response.agents || []);
      }
      setIsRunDialogOpen(true);
    } catch (error) {
       toast.error('Failed to load agents');
    }
  };

  const confirmRun = async () => {
    console.log('[DEBUG] confirmRun called. Selected Agent:', selectedAgentId);
    if (!selectedAgentId) {
      toast.error('Please select an agent to run the workflow');
      return;
    }

    try {
      setIsExecuting(true);
      const workflowData = {
        name: workflowName,
        nodes: nodes.map(node => ({
          id: node.id,
          type: node.type,
          label: node.label,
          x: node.x,
          y: node.y,
          config: node.config
        })),
        description: `Workflow with ${nodes.length} nodes`
      };
      
      console.log('[DEBUG] Creating Workflow:', workflowData);
      const wfResponse = await workflowsAPI.create(workflowData);
      console.log('[DEBUG] Workflow Created:', wfResponse);
      
      if (wfResponse.success && wfResponse.workflow) {
        console.log('[DEBUG] Calling processesAPI.create...');
        const processResponse = await processesAPI.create({
          workflowId: wfResponse.workflow.id,
          agentId: selectedAgentId,
          taskInput
        });
        
        console.log('[DEBUG] processesAPI.create returned:', processResponse);
        if (processResponse && processResponse.success) {
          toast.success(`Started executing workflow "${workflowName}"`);
          setIsRunDialogOpen(false);
          setSelectedAgentId("");
          setTaskInput("");
        } else {
          console.error('[DEBUG] processResponse evaluated to false or missing success:', processResponse);
          toast.error('Execution returned an unsuccessful state.');
        }
      } else {
        console.error('[DEBUG] wfResponse failed or missing workflow:', wfResponse);
        toast.error('Workflow saving failed.');
      }
    } catch (error: any) {
      console.error('[CRITICAL DEBUG] Error starting workflow:', error);
      toast.error(`Execution failed: ${error?.message || 'Unknown error'}`);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <Input
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="text-2xl font-bold border-0 px-0 focus-visible:ring-0"
            />
            <p className="text-gray-600 mt-1">Design and configure your workflow</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={saveWorkflow}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button onClick={runWorkflow}>
              <Play className="w-4 h-4 mr-2" />
              Run Workflow
            </Button>
          </div>
        </div>

        {/* Workflow Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{nodes.length}</p>
                  <p className="text-xs text-gray-500">Nodes Added</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                  <p className="text-xs text-gray-500">Executions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">Draft</p>
                  <p className="text-xs text-gray-500">Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">Auto</p>
                  <p className="text-xs text-gray-500">Trigger Type</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Node Palette */}
          <div className="lg:col-span-1">
            <NodePalette />
          </div>

          {/* Canvas */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Canvas</CardTitle>
                <CardDescription>Design your automation flow</CardDescription>
              </CardHeader>
              <CardContent>
                <WorkflowCanvas 
                  nodes={nodes} 
                  onAddNode={addNode} 
                  onRemoveNode={removeNode} 
                />
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Run Configuration Dialog */}
        <Dialog open={isRunDialogOpen} onOpenChange={setIsRunDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Run Workflow</DialogTitle>
              <DialogDescription>Select an AI Agent to execute this workflow</DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-4">
              <div className="space-y-2">
                <Label htmlFor="agent">Assigned Agent *</Label>
                <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an active agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAgents.map(agent => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name} ({agent.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="taskInput">Task Input / Data (Optional)</Label>
                <Textarea 
                  id="taskInput" 
                  placeholder="Paste the text or data you want the AI to process..."
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  className="min-h-[200px] max-h-96 resize-vertical"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsRunDialogOpen(false)} disabled={isExecuting}>Cancel</Button>
              <Button onClick={confirmRun} disabled={isExecuting}>
                {isExecuting ? 'Running AI Engine...' : 'Start Execution'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DndProvider>
  );
}