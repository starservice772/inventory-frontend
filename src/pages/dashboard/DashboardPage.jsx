import { Package, ShoppingBag, IndianRupee, AlertTriangle } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";

const monthlyData = [
  { name: "Jan", purchases: 40, sales: 24 },
  { name: "Feb", purchases: 30, sales: 20 },
  { name: "Mar", purchases: 55, sales: 32 },
  { name: "Apr", purchases: 70, sales: 40 },
];

const stockData = [
  { name: "Office", value: 60 },
  { name: "Engineers", value: 40 },
];

const colors = ["#2563eb", "#16a34a"];

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-5 border">
      <div className="flex items-center justify-between mb-3">
        <p className="text-slate-500">{title}</p>
        <div className={`p-2 rounded-xl ${color}`}>
          <Icon className="text-white" size={18} />
        </div>
      </div>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Inventory Dashboard</h2>
        <p className="text-slate-500">Overview of stock, sales, purchases and alerts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Items" value="1,248" icon={Package} color="bg-blue-600" />
        <StatCard title="Purchases" value="342" icon={ShoppingBag} color="bg-green-600" />
        <StatCard title="Sales Value" value="₹2,45,000" icon={IndianRupee} color="bg-orange-500" />
        <StatCard title="Low Stock Alerts" value="12" icon={AlertTriangle} color="bg-red-600" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white border rounded-2xl p-5">
          <h3 className="font-semibold mb-4">Monthly Purchase vs Sales</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="purchases" fill="#2563eb" radius={[8, 8, 0, 0]} />
                <Bar dataKey="sales" fill="#16a34a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-5">
          <h3 className="font-semibold mb-4">Stock Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stockData} dataKey="value" outerRadius={90} label>
                  {stockData.map((entry, index) => (
                    <Cell key={index} fill={colors[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}