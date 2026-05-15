import React from 'react';
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => {
    return (
        <nav className="bg-blue-600 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-lg font-bold">FarmLink</div>
                <div className="space-x-4">
                    <Link to="/buyer" className="text-white hover:underline">ผู้ซื้อ</Link>
                    <Link to="/seller" className="text-white hover:underline">ผู้ขาย</Link>
                    <Link to="/admin" className="text-white hover:underline">ผู้ดูแลระบบ</Link>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;