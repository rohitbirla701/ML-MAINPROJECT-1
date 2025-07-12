import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Spin, message } from 'antd';
import StatusBadge from '../../components/dashboard/StatusBadge';
import api from '../../api/axios';

const { Title } = Typography;

const ProjectDetailPage = () => {
  const { id } = useParams(); // id is project _id
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/projects/${id}`);
        setProject(res.data);
      } catch (error) {
        message.error('Failed to load project');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: '40px auto' }} />;
  }
  if (!project) {
    return <div className="p-8 text-center text-gray-500">Project not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 mt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">{project.projectName}</h2>
          <StatusBadge status={project.status} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <div className="text-xs text-gray-400 mb-1">Project Type</div>
          <div className="font-semibold">{project.projectType}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">Category</div>
          <div className="font-semibold">{project.category}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">Date Received</div>
          <div className="font-semibold">{project.dateReceived ? new Date(project.dateReceived).toLocaleDateString() : ''}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">Expected Delivery Date</div>
          <div className="font-semibold">{project.expectedDeliveryDate ? new Date(project.expectedDeliveryDate).toLocaleDateString() : ''}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">End Client</div>
          <div className="font-semibold">{project.endClient}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">Contact Person</div>
          <div className="font-semibold">{project.contactPerson}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">Status</div>
          <div className="font-semibold"><StatusBadge status={project.status} /></div>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-bold mb-2">Activity Timeline</h3>
        {/* Placeholder for timeline, can be replaced with real data if available */}
        <div className="text-gray-500 text-sm">No timeline data available.</div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
