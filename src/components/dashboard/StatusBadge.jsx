import React from "react";

const statusStyles = {
  "New": "bg-purple-100 text-purple-800",
  "Sent to CEO": "bg-blue-100 text-blue-800",
  "Approved by Client": "bg-green-100 text-green-800",
  "Invoice Raised": "bg-amber-100 text-amber-800",
  "default": "bg-gray-100 text-gray-800"
};

const StatusBadge = ({ status }) => (
  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[status] || statusStyles.default}`}>
    {status}
  </span>
);

export default StatusBadge;
