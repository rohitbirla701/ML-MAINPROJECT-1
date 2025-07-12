import React from 'react';
import { Link } from 'react-router-dom';

const StatsCard = ({ title, value, icon, linkTo, iconBgColor, iconColor }) => {
  return (
    <Link to={linkTo}>
      <div className="flex  items-center bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        <div className={`p-3 rounded-full mr-4 ${iconBgColor} ${iconColor}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h1 className="text-xl font-bold">{value}</h1>
        </div>
      </div>
    </Link>
  );
};

export default StatsCard;
