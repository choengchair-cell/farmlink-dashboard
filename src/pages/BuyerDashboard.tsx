import React from 'react';
import NavBar from '../components/NavBar';
import Sidebar from '../components/Sidebar';
import DashboardCard from '../components/DashboardCard';
import { buyers } from '../data/buyers';
import { orders } from '../data/orders';

const BuyerDashboard: React.FC = () => {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-4">
                <NavBar />
                <h1 className="text-2xl font-bold mb-4">แดชบอร์ดผู้ซื้อ</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {buyers.map(buyer => (
                        <DashboardCard key={buyer.id} title={buyer.name} description={`คำสั่งซื้อ: ${orders.filter(order => order.buyerId === buyer.id).length}`} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BuyerDashboard;