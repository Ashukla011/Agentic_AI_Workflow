
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { 
  GitBranch, 
  Search, 
  Filter,
  PlayCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Pause,
  RefreshCw,
  Eye,
  Calendar,
  TrendingUp
} from "lucide-react";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { processesAPI, workflowsAPI, agentsAPI } from "../lib/api";

interface Process {
  id: string;
  name: string;
  workflowId?: string;
  workflowName?: string;
  workflow?: string; // legacy support
  agentId?: string;
  agentName?: string;
  agent?: string; // legacy support
  status: 'running' | 'completed' | 'failed' | 'pending' | 'paused';
  progress: number;
  startTime: string;
  duration: string;
  tasksCompleted: number;
  totalTasks: number;
  output?: string;
}

const statusConfig: any = {
  running: { icon: PlayCircle, color: 'bg-blue-100 text-blue-700', label: 'Running' },
  completed: { icon: CheckCircle2, color: 'bg-green-100 text-green-700', label: 'Completed' },
  failed: { icon: XCircle, color: 'bg-red-100 text-red-700', label: 'Failed' },
  pending: { icon: Clock, color: 'bg-gray-100 text-gray-700', label: 'Pending' },
  paused: { icon: Pause, color: 'bg-yellow-100 text-yellow-700', label: 'Paused' },
};

export function Processes() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  // Details Modal State
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  useEffect(() => {
    loadProcesses();
  }, []);

  const loadProcesses = async () => {
    try {
      const response = await processesAPI.getAll();
      if (response.success) {
        // Reverse to show newest runs first!
        setProcesses((response.processes || []).reverse());
      }
    } catch (error) {
      console.error('Failed to load processes:', error);
      toast.error('Failed to load processes');
    }
  };

  const filteredProcesses = processes.filter(process => {
    const processName = process.name || '';
    const workflowName = process.workflowName || process.workflow || '';
    
    const matchesSearch = processName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          workflowName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || process.status === statusFilter;
    const matchesTab = activeTab === 'all' || 
                       (activeTab === 'active' && (process.status === 'running' || process.status === 'pending' || process.status === 'paused')) ||
                       (activeTab === 'completed' && process.status === 'completed') ||
                       (activeTab === 'failed' && process.status === 'failed');
    return matchesSearch && matchesStatus && matchesTab;
  });

  const stats = {
    total: processes.length,
    running: processes.filter(p => p.status === 'running').length,
    completed: processes.filter(p => p.status === 'completed').length,
    failed: processes.filter(p => p.status === 'failed').length,
  };

  const toggleProcessStatus = async (id: string) => {
    const p = processes.find(proc => proc.id === id);
    if (!p) return;
    const newStatus = p.status === 'running' ? 'paused' : 'running';
    try {
      await processesAPI.update(id, { status: newStatus });
      setProcesses(prev => prev.map(proc => proc.id === id ? { ...proc, status: newStatus } : proc));
      toast.success(`Process ${newStatus}`);
    } catch (e) {
      toast.error('Failed to update process status');
    }
  };

  const retryProcess = async (process: Process) => {
    if (!process.workflowId || !process.agentId) {
      toast.error('Original Workflow or Agent ID missing. Cannot retry.');
      return;
    }
    try {
      toast.info('Retrying process...');
      const response = await processesAPI.create({
        workflowId: process.workflowId,
        agentId: process.agentId
      });
      if (response && response.success) {
        toast.success(`Started retrying workflow!`);
        loadProcesses(); // Refresh the list
      } else {
        toast.error('Failed to retry process.');
      }
    } catch (e) {
      toast.error('Error starting retry.');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Process Executions</h1>
          <p className="text-gray-600 mt-1">Monitor and manage workflow executions</p>
        </div>
        <Button>
          <PlayCircle className="w-4 h-4 mr-2" />
          Run New Process
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Processes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <GitBranch className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">Running</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.running}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <PlayCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.failed}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search processes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({processes.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({stats.running})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
          <TabsTrigger value="failed">Failed ({stats.failed})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {filteredProcesses.map((process) => {
            const config = statusConfig[process.status];
            const StatusIcon = config.icon;

            return (
              <Card key={process.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Process Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.color}`}>
                          <StatusIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900">{process.name}</h3>
                          <p className="text-sm text-gray-600 mt-0.5">{process.workflowName || process.workflow}</p>
                          <div className="flex flex-wrap items-center gap-3 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {process.agentName || process.agent}
                            </Badge>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {process.startTime}
                            </span>
                            <span className="text-xs text-gray-500">Duration: {process.duration}</span>
                          </div>
                        </div>
                        <Badge className={config.color}>{config.label}</Badge>
                      </div>

                      {/* Progress */}
                      {process.status !== 'pending' && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Progress</span>
                            <span className="text-gray-900 font-medium">
                              {process.tasksCompleted}/{process.totalTasks} tasks
                            </span>
                          </div>
                          <Progress value={process.progress} className="h-2" />
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 lg:flex-col">
                      <Button variant="outline" size="sm" className="flex-1 lg:flex-none" onClick={() => { setSelectedProcess(process); setIsViewDialogOpen(true); }}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      {(process.status === 'running' || process.status === 'paused') && (
                        <Button variant="outline" size="sm" className="flex-1 lg:flex-none" onClick={() => toggleProcessStatus(process.id)}>
                          {process.status === 'running' ? (
                            <><Pause className="w-4 h-4 mr-2" /> Pause</>
                          ) : (
                            <><PlayCircle className="w-4 h-4 mr-2" /> Resume</>
                          )}
                        </Button>
                      )}
                      {(process.status === 'failed' || process.status === 'completed') && (
                        <Button variant="outline" size="sm" className="flex-1 lg:flex-none" onClick={() => retryProcess(process)}>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Retry
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {filteredProcesses.length === 0 && (
            <Card>
              <CardContent className="p-12">
                <div className="text-center">
                  <GitBranch className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">No processes found</p>
                  <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or search</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Process Details</DialogTitle>
            <DialogDescription>Full execution log and output</DialogDescription>
          </DialogHeader>
          {selectedProcess && (
            <div className="flex-1 overflow-y-auto space-y-4 pr-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Name</h4>
                  <p className="text-gray-600 break-words">{selectedProcess.name}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Status</h4>
                  <Badge className={statusConfig[selectedProcess.status]?.color}>{statusConfig[selectedProcess.status]?.label || selectedProcess.status}</Badge>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Agent</h4>
                  <p className="text-gray-600 break-words">{selectedProcess.agentName || selectedProcess.agent || 'Unknown'}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Workflow</h4>
                  <p className="text-gray-600 break-words">{selectedProcess.workflowName || selectedProcess.workflow || 'Unknown'}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Start Time</h4>
                  <p className="text-gray-600">{selectedProcess.startTime}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Duration</h4>
                  <p className="text-gray-600">{selectedProcess.duration}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-2">Progress</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tasks Completed</span>
                    <span className="text-gray-900 font-medium">{selectedProcess.tasksCompleted}/{selectedProcess.totalTasks}</span>
                  </div>
                  <Progress value={selectedProcess.progress} className="h-2" />
                  <p className="text-sm text-gray-600">{selectedProcess.progress}% complete</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-2">AI Engine Output</h4>
                <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm max-h-96 overflow-auto border border-gray-700">
                  <pre className="whitespace-pre-wrap break-words text-xs leading-relaxed">
                    {selectedProcess.output || 'No output generated. This workflow may have failed or never launched correctly.'}
                  </pre>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
