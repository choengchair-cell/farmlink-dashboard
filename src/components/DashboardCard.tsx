import React from 'react';

interface DashboardCardProps {
    title: string;
    content?: string;
    description?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, content, description }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-bold text-gray-800">{title}</h2>
            {(content || description) && <p className="text-gray-600">{content || description}</p>}
        </div>
    );
};

export default DashboardCard;
