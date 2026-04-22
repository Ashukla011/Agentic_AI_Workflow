import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { 
  Bot, 
  Plus, 
  Play, 
  Pause, 
  Settings, 
  Trash2, 
  TrendingUp,
  Cpu,
  Zap,
  Brain,
  FileText,
  MessageSquare,
  BarChart,
  Search
} from "lucide-react";
import { toast } from "sonner";
import { Progress } from "./ui/progress";
import { agentsAPI } from "../lib/api";

interface Agent {
  id: string;
  name: string;
  type: string;
  model: string;
  status: 'active' | 'idle' | 'paused';
  tasks: number;
  efficiency: number;
  description: string;
  icon?: any;
  color?: string;
}

const iconMap: Record<string, any> = {
  'Language Model': Brain,
  'Data Analysis': BarChart,
  'Document Processing': FileText,
  'Support Assistant': MessageSquare,
  'Research & Analysis': Search,
  'Development': Cpu,
};

const colorMap: Record<string, string> = {
  'Language Model': 'bg-purple-100 text-purple-700 border-purple-300',
  'Data Analysis': 'bg-blue-100 text-blue-700 border-blue-300',
  'Document Processing': 'bg-green-100 text-green-700 border-green-300',
  'Support Assistant': 'bg-orange-100 text-orange-700 border-orange-300',
  'Research & Analysis': 'bg-indigo-100 text-indigo-700 border-indigo-300',
  'Development': 'bg-gray-100 text-gray-700 border-gray-300',
};

export function Agents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: '',
    type: '',
    model: '',
    description: ''
  });

  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      setLoading(true);
      const response = await agentsAPI.getAll();
      if (response.success) {
        setAgents(response.agents || []);
      }
    } catch (error) {
      console.error('Error loading agents:', error);
      toast.error('Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeAgents = agents.filter(a => a.status === 'active').length;
  const totalTasks = agents.reduce((sum, a) => sum + a.tasks, 0);
  const avgEfficiency = Math.round(agents.reduce((sum, a) => sum + a.efficiency, 0) / (agents.length || 1));

  const toggleAgentStatus = async (id: string) => {
    const agent = agents.find(a => a.id === id);
    if (!agent) return;
    
    const newStatus = agent.status === 'active' ? 'paused' : 'active';
    
    try {
      await agentsAPI.update(id, { status: newStatus });
      setAgents(agents.map(a => a.id === id ? { ...a, status: newStatus } : a));
      toast.success(`Agent ${newStatus === 'active' ? 'activated' : 'paused'}`);
    } catch (error) {
      console.error('Error updating agent status:', error);
      toast.error('Failed to update agent status');
    }
  };

  const deleteAgent = async (id: string) => {
    try {
      await agentsAPI.delete(id);
      setAgents(agents.filter(agent => agent.id !== id));
      toast.success('Agent deleted successfully');
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast.error('Failed to delete agent');
    }
  };

  const createAgent = async () => {
    if (!newAgent.name || !newAgent.type || !newAgent.model) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await agentsAPI.create(newAgent);
      if (response.success) {
        await loadAgents();
        toast.success('Agent created successfully');
        setIsDialogOpen(false);
        setNewAgent({ name: '', type: '', model: '', description: '' });
      }
    } catch (error) {
      console.error('Error creating agent:', error);
      toast.error('Failed to create agent');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Agents</h1>
          <p className="text-gray-600 mt-1">Manage and monitor your AI agents</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Create New Agent</DialogTitle>
              <DialogDescription>Configure your AI agent settings</DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-4">
              <div className="space-y-2">
                <Label htmlFor="name">Agent Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Customer Support Bot"
                  value={newAgent.name}
                  onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Agent Type *</Label>
                <Select value={newAgent.type} onValueChange={(value) => setNewAgent({ ...newAgent, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select agent type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Language Model">Language Model</SelectItem>
                    <SelectItem value="Data Analysis">Data Analysis</SelectItem>
                    <SelectItem value="Document Processing">Document Processing</SelectItem>
                    <SelectItem value="Support Assistant">Support Assistant</SelectItem>
                    <SelectItem value="Research & Analysis">Research & Analysis</SelectItem>
                    <SelectItem value="Development">Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">AI Model *</Label>
                <Select value={newAgent.model} onValueChange={(value) => setNewAgent({ ...newAgent, model: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
                    <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                    <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash</SelectItem>
                    <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                    <SelectItem value="Custom Model">Custom Model</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this agent does..."
                  value={newAgent.description}
                  onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={createAgent}>Create Agent</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Agent Details</DialogTitle>
              <DialogDescription>Detailed view of this AI Agent</DialogDescription>
            </DialogHeader>
            {selectedAgent && (
              <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-4">
                <div className="space-y-1">
                  <p className="font-semibold text-gray-900">Name</p>
                  <p className="text-gray-600 break-words">{selectedAgent.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-900">Type</p>
                    <p className="text-gray-600">{selectedAgent.type}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-900">Model</p>
                    <p className="text-gray-600">{selectedAgent.model}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-900">Status</p>
                    <Badge variant={selectedAgent.status === 'active' ? 'default' : 'secondary'}>
                      {selectedAgent.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-900">Tasks Completed</p>
                    <p className="text-gray-600">{selectedAgent.tasks}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-gray-900">Efficiency ({selectedAgent.efficiency}%)</p>
                  <Progress value={selectedAgent.efficiency} className="h-2" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-gray-900">Description</p>
                  <p className="text-gray-600 break-words">{selectedAgent.description || 'No description provided.'}</p>
                </div>
              </div>
            )}
            <div className="flex justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Agents</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{agents.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Agents</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{activeAgents}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalTasks}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Efficiency</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{avgEfficiency}%</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Cpu className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map((agent) => {
          const Icon = iconMap[agent.type] || Bot;
          const color = colorMap[agent.type] || 'bg-blue-100 text-blue-700 border-blue-300';
          
          return (
          <Card key={agent.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                  {agent.status}
                </Badge>
              </div>
              <CardTitle className="mt-4">{agent.name}</CardTitle>
              <CardDescription>{agent.type} • {agent.model}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{agent.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Active Tasks</span>
                  <span className="font-medium text-gray-900">{agent.tasks}</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Efficiency</span>
                    <span className="font-medium text-gray-900">{agent.efficiency}%</span>
                  </div>
                  <Progress value={agent.efficiency} className="h-2" />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => toggleAgentStatus(agent.id)}
                >
                  {agent.status === 'active' ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Activate
                    </>
                  )}
                </Button>
                <Button variant="outline" size="icon" onClick={() => { setSelectedAgent(agent); setIsViewDialogOpen(true); }}>
                  <Settings className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => deleteAgent(agent.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );})}
      </div>

      {filteredAgents.length === 0 && (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <Bot className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No agents found</p>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your search or create a new agent</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}