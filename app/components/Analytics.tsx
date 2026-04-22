import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown,
  Activity,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const executionData = [
  { date: 'Mon', executions: 45, successful: 42, failed: 3 },
  { date: 'Tue', executions: 52, successful: 50, failed: 2 },
  { date: 'Wed', executions: 48, successful: 45, failed: 3 },
  { date: 'Thu', executions: 61, successful: 58, failed: 3 },
  { date: 'Fri', executions: 55, successful: 52, failed: 3 },
  { date: 'Sat', executions: 38, successful: 37, failed: 1 },
  { date: 'Sun', executions: 42, successful: 40, failed: 2 },
];

const performanceData = [
  { time: '00:00', avgTime: 2.1, efficiency: 94 },
  { time: '04:00', avgTime: 1.8, efficiency: 96 },
  { time: '08:00', avgTime: 2.4, efficiency: 92 },
  { time: '12:00', avgTime: 2.8, efficiency: 89 },
  { time: '16:00', avgTime: 2.5, efficiency: 91 },
  { time: '20:00', avgTime: 2.2, efficiency: 93 },
];

const agentUsageData = [
  { name: 'GPT-4 Agent', value: 35, color: '#8b5cf6' },
  { name: 'Claude Analyst', value: 25, color: '#3b82f6' },
  { name: 'Document AI', value: 20, color: '#10b981' },
  { name: 'Support Bot', value: 15, color: '#f59e0b' },
  { name: 'Others', value: 5, color: '#6b7280' },
];

const workflowStats = [
  { workflow: 'Customer Onboarding', executions: 145, avgTime: '2.3s', successRate: 98 },
  { workflow: 'Data Analysis', executions: 98, avgTime: '4.1s', successRate: 96 },
  { workflow: 'Email Automation', executions: 267, avgTime: '1.8s', successRate: 99 },
  { workflow: 'Invoice Processing', executions: 76, avgTime: '3.2s', successRate: 94 },
  { workflow: 'Report Generation', executions: 54, avgTime: '5.6s', successRate: 97 },
];

export function Analytics() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Performance insights and metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Executions</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">341</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">+12.5%</span>
                  <span className="text-sm text-gray-500">vs last week</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">97.2%</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">+2.1%</span>
                  <span className="text-sm text-gray-500">vs last week</span>
                </div>
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
                <p className="text-sm text-gray-600">Avg. Processing Time</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">2.4s</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingDown className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">-18.2%</span>
                  <span className="text-sm text-gray-500">faster</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed Executions</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">9</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingDown className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">-45%</span>
                  <span className="text-sm text-gray-500">vs last week</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="executions">
        <TabsList>
          <TabsTrigger value="executions">Execution Trends</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="agents">Agent Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="executions" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Execution Trends</CardTitle>
              <CardDescription>Total executions and success rate over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={executionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#888888" fontSize={12} />
                  <YAxis stroke="#888888" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '12px'
                    }}
                  />
                  <Bar dataKey="successful" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="failed" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Average processing time and efficiency throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" stroke="#888888" fontSize={12} />
                  <YAxis yAxisId="left" stroke="#888888" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="#888888" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '12px'
                    }}
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="avgTime" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', r: 4 }}
                    name="Avg Time (s)"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="efficiency" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 4 }}
                    name="Efficiency (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Agent Usage Distribution</CardTitle>
                <CardDescription>Breakdown of executions by AI agent</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={agentUsageData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {agentUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Agent Statistics</CardTitle>
                <CardDescription>Detailed agent usage metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agentUsageData.map((agent) => (
                    <div key={agent.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: agent.color }}
                          />
                          <span className="text-sm font-medium text-gray-900">{agent.name}</span>
                        </div>
                        <span className="text-sm text-gray-600">{agent.value}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ 
                            width: `${agent.value}%`,
                            backgroundColor: agent.color
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Workflow Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Performance</CardTitle>
          <CardDescription>Detailed metrics for each workflow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Workflow</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Executions</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Avg. Time</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Success Rate</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Performance</th>
                </tr>
              </thead>
              <tbody>
                {workflowStats.map((workflow, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">{workflow.workflow}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-600">{workflow.executions}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-600">{workflow.avgTime}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`font-medium ${
                        workflow.successRate >= 97 ? 'text-green-600' : 
                        workflow.successRate >= 95 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {workflow.successRate}%
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="w-full max-w-[120px] h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            workflow.successRate >= 97 ? 'bg-green-500' : 
                            workflow.successRate >= 95 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${workflow.successRate}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
