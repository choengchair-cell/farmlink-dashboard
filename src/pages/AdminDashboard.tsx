import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";

function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-4">
        <NavBar />

        <h1 className="text-2xl font-bold mb-4">แดชบอร์ดผู้ดูแลระบบ</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DashboardCard title="ผู้ใช้ทั้งหมด" />
          <DashboardCard title="คำสั่งซื้อทั้งหมด" />
          <DashboardCard title="รายงานระบบ" />
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;