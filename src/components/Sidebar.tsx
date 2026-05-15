import React from 'react';

const Sidebar: React.FC = () => {
    return (
        <div className="bg-gray-800 text-white w-64 h-full p-4">
            <h2 className="text-lg font-bold mb-4">เมนู</h2>
            <ul>
                <li className="mb-2">
                    <a href="/buyer" className="hover:text-gray-400">แดชบอร์ดผู้ซื้อ</a>
                </li>
                <li className="mb-2">
                    <a href="/seller" className="hover:text-gray-400">แดชบอร์ดผู้ขาย</a>
                </li>
                <li className="mb-2">
                    <a href="/admin" className="hover:text-gray-400">แดชบอร์ดผู้ดูแลระบบ</a>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;