import React from "react";
import StatusBadge from "./StatusBadge";
import { Link } from "react-router-dom";

const RecentProjectsList = ({ projects, showActions = false }) => {
  if (!projects || projects.length === 0) {
    return <p>No recent projects.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Project Name</th>
            <th className="px-4 py-2 text-left">Client</th>
            <th className="px-4 py-2 text-left">Category</th>
            <th className="px-4 py-2 text-left">Date Received</th>
            <th className="px-4 py-2 text-left">Status</th>
            {showActions && <th className="px-4 py-2 text-left">Action</th>}
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project._id} className="border-t">
              <td className="px-4 py-2">{project.projectName}</td>
              <td className="px-4 py-2">{project.endClient}</td>
              <td className="px-4 py-2">{project.category}</td>
              <td className="px-4 py-2">{project.dateReceived ? new Date(project.dateReceived).toLocaleDateString() : ''}</td>
              <td className="px-4 py-2"><StatusBadge status={project.status} /></td>
              {showActions && (
                <td className="px-4 py-2">
                  <Link to={`/projects/${project._id}`} className="text-purple-600 underline hover:text-purple-800">View</Link>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentProjectsList;
