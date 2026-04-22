import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { 
  TrendingUp, 
  Bot, 
  Workflow, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Activity,
  Zap,
  ArrowUpRight
} from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Link } from "react-router";

const stats = [
  {
    title: "Active Workflows",
    value: "24",
    change: "+12%",
    trend: "up",
    icon: Workflow,
    color: "text-blue-600 bg-blue-100"
  },
  {
    title: "AI Agents",
    value: "18",
    change: "+3",
    trend: "up",
    icon: Bot,
    color: "text-purple-600 bg-purple-100"
  },
  {
    title: "Tasks Completed",
    value: "1,247",
    change: "+23%",
    trend: "up",
    icon: CheckCircle2,
    color: "text-green-600 bg-green-100"
  },
  {
    title: "Avg. Processing Time",
    value: "2.4s",
    change: "-18%",
    trend: "down",
    icon: Clock,
    color: "text-orange-600 bg-orange-100"
  },
];

const recentProcesses = [
  {
    id: 1,
    name: "Customer Onboarding Flow",
    agent: "GPT-4 Agent",
    status: "running",
    progress: 65,
    tasksCompleted: 13,
    totalTasks: 20
  },
  {
    id: 2,
    name: "Data Analysis Pipeline",
    agent: "Claude Analyst",
    status: "running",
    progress: 42,
    tasksCompleted: 8,
    totalTasks: 19
  },
  {
    id: 3,
    name: "Email Response Automation",
    agent: "Multi-Agent System",
    status: "completed",
    progress: 100,
    tasksCompleted: 45,
    totalTasks: 45
  },
  {
    id: 4,
    name: "Invoice Processing",
    agent: "Document AI",
    status: "running",
    progress: 28,
    tasksCompleted: 7,
    totalTasks: 25
  },
];

const activeAgents = [
  {
    name: "GPT-4 Agent",
    type: "Language Model",
    tasks: 12,
    efficiency: 98,
    status: "active"
  },
  {
    name: "Claude Analyst",
    type: "Data Analysis",
    tasks: 8,
    efficiency: 95,
    status: "active"
  },
  {
    name: "Document AI",
    type: "Document Processing",
    tasks: 5,
    efficiency: 92,
    status: "active"
  },
  {
    name: "Customer Support Bot",
    type: "Support Assistant",
    tasks: 23,
    efficiency: 89,
    status: "active"
  },
];

export function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor your AI-powered workflows and agents</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Activity className="w-4 h-4 mr-2" />
            View Logs
          </Button>
          <Link to="/workflows">
            <Button>
              <Zap className="w-4 h-4 mr-2" />
              Create Workflow
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className={`w-4 h-4 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                    <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500">vs last week</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Processes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Processes</CardTitle>
            <CardDescription>Active and recently completed workflow executions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProcesses.map((process) => (
                <div key={process.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{process.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">Agent: {process.agent}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      process.status === 'completed' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {process.status === 'completed' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Activity className="w-3 h-3 animate-pulse" />
                      )}
                      {process.status === 'completed' ? 'Completed' : 'Running'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="text-gray-900 font-medium">
                        {process.tasksCompleted}/{process.totalTasks} tasks
                      </span>
                    </div>
                    <Progress value={process.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
            <Link to="/processes">
              <Button variant="outline" className="w-full mt-4">
                View All Processes
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Active Agents */}
        <Card>
          <CardHeader>
            <CardTitle>Active Agents</CardTitle>
            <CardDescription>Currently running AI agents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeAgents.map((agent) => (
                <div key={agent.name} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{agent.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{agent.type}</p>
                    </div>
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  </div>
                  <div className="space-y-1.5 mt-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">{agent.tasks} active tasks</span>
                      <span className="text-gray-900 font-medium">{agent.efficiency}% efficiency</span>
                    </div>
                    <Progress value={agent.efficiency} className="h-1.5" />
                  </div>
                </div>
              ))}
            </div>
            <Link to="/agents">
              <Button variant="outline" className="w-full mt-4">
                Manage Agents
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
          <CardDescription>Platform performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Response Time</span>
                <span className="text-sm font-medium text-gray-900">245ms</span>
              </div>
              <Progress value={92} className="h-2" />
              <p className="text-xs text-green-600">Excellent</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="text-sm font-medium text-gray-900">98.7%</span>
              </div>
              <Progress value={98.7} className="h-2" />
              <p className="text-xs text-green-600">Optimal</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Resource Usage</span>
                <span className="text-sm font-medium text-gray-900">64%</span>
              </div>
              <Progress value={64} className="h-2" />
              <p className="text-xs text-gray-600">Normal</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
