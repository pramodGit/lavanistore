import React from "react";
import "../../assets/admin.css"; // import the CSS file
import ProtectedRoute from "../../components/ProtectedRoute";
import { Link } from "react-router-dom";
import { DollarSign, Wallet, Users, TrendingUp } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

const widgetData = [
  { title: "Total Direct", value: "120", icon: <Users size={20} /> },
  { title: "Ewallet Balance", value: "$4,500", icon: <Wallet size={20} /> },
  { title: "Main Wallet", value: "$12,340", icon: <Wallet size={20} /> },
  { title: "Total Income", value: "$25,000", icon: <TrendingUp size={20} /> },
  { title: "Direct Income", value: "$8,500", icon: <DollarSign size={20} /> },
  { title: "Matrix Income", value: "$5,200", icon: <TrendingUp size={20} /> },
  { title: "Matrix Income", value: "$3,100", icon: <TrendingUp size={20} /> },
];

const activeData = [
  { name: "Active", value: 85 },
  { name: "Inactive", value: 15 },
];
const COLORS = ["#4CAF50", "#FF5252"];

const months = ["Mar", "Apr", "May", "Jun", "Jul", "Aug"];
const growthData = months.map((m, i) => ({ month: m, value: (i % 5) + 1 }));
const salesData = months.map((m, i) => ({
  month: m,
  value: ((i + 2) % 5) + 1,
}));

const AdminDashboard: React.FC = () => {
  return (
    <div className="admin">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <h1>
            <Link to="/">
              <img
                alt="Lavani Wellness"
                src="/images/logo.png"
                width="100"
                height="40"
              />
            </Link>
          </h1>
        </div>
        <nav className="nav">
          <a href="#" className="active">
            Dashboard
          </a>
          <a href="#">Users</a>
          <a href="#">Reports</a>
          <a href="#">Settings</a>
        </nav>
      </aside>

      {/* Main */}
      <main className="main">
        <div className="header">
          <h2>Dashboard</h2>
          <button className="btn">Logout</button>
        </div>
        <div className="content">
          {/* <h3>Welcome, Admin</h3>
          <p>This is your control panel. Use the sidebar to navigate.</p> */}
          {/* Widgets grid */}
          <div className="widgets-grid">
            {widgetData.map((w, i) => (
              <div key={i} className="widget">
                <div className="widget-header">
                  <h4>{w.title}</h4>
                  <span className="widget-icon">{w.icon}</span>
                </div>
                <p className="widget-value">{w.value}</p>
              </div>
            ))}

            {/* Pie Chart Widget */}
            <div className="widget pie-widget">
              <div className="members-grid">
                <div className="members-title">
                  <h4>Members</h4>
                </div>
                <div className="members-status active">● Active</div>
                <div className="members-status inactive">● Inactive</div>
              </div>
              <div className="pie-container">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={activeData}
                      innerRadius={30}
                      outerRadius={50}
                      dataKey="value"
                      paddingAngle={4}
                    >
                      {activeData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Row of 2 charts */}
          <div className="charts-row">
            <div className="chart-card">
              <h4>Team Growth (Last 6 Months)</h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[1, 5]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#4CAF50" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h4>Total Sales (Last 6 Months)</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[1, 5]} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2196F3" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// 👇 wrap the dashboard in ProtectedRoute
export default function ProtectedDashboard() {
  return (
    // <ProtectedRoute role="admin">
    <AdminDashboard />
    // </ProtectedRoute>
  );
}
