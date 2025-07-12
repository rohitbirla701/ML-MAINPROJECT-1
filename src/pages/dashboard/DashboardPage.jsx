import React, { useEffect, useState, useRef } from "react";
import axios from "../../api/axios";
import { Row, Col, Typography } from "antd";
import {
  PlusSquareOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  FileDoneOutlined,
  ProjectOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import StatsCard from "../../components/dashboard/StatsCard";
import CustomProjectTable from "../../components/common/CustomProjectTable";
import StatusBadge from "../../components/dashboard/StatusBadge";

const { Title } = Typography;

const DashboardPage = () => {
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    sentToCEO: 0,
    approved: 0,
    invoiceRaised: 0,
  });

  const [allProjects, setAllProjects] = useState([]);
  const [todayProjects, setTodayProjects] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: "10", total: 0 });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const debounceTimeout = useRef();

  const fetchDashboardStats = async () => {
    try {
      const res = await axios.get("/projects/dashboard-stats");
      const s = res.data.stats;
      setStats({
        total: s.totalProjects || 0,
        new: s.newProjects || 0,
        sentToCEO: s.sentToCEO || 0,
        approved: s.approvedByClient || 0,
        invoiceRaised: s.invoiceRaised || 0,
      });
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    }
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/projects", {
        params: {
          page: pagination.current,
          pageSize: pagination.pageSize,
          search: debouncedSearch,
        },
      });
      const projects = res.data.projects || [];
      setAllProjects(projects);
      setPagination((prev) => ({ ...prev, total: res.data.total || 0 }));
      updateTodayProjects(projects);
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateTodayProjects = (projects) => {
    const today = new Date();
    const filtered = projects.filter((p) => {
      const d = new Date(p.dateReceived);
      return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    });
    setTodayProjects(filtered.slice(0, 3));
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [pagination.current, pagination.pageSize, debouncedSearch]);

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination((prev) => ({ ...prev, current: 1 }));
    }, 400);
    return () => clearTimeout(debounceTimeout.current);
  }, [search]);

  const handleExport = () => {
    const headers = ["Project Name", "Date Received", "Status"];
    const rows = allProjects.map((p) => [
      p.projectName,
      p.dateReceived,
      p.status,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "dashboard_projects.csv";
    link.click();
  };

  const handleRowSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const summaryTypes = ["Mockups", "Proposals", "Presentations", "Credentials", "RFP", "AI Work", "Creative Work"];
  const summary = summaryTypes.map((type) => ({
    type,
    count: allProjects.filter((p) => p.projectType === type).length,
  }));

  const dashboardTableColumns = [
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName',
    },
    {
      title: 'Project Type',
      dataIndex: 'projectType',
      key: 'projectType',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Date Received',
      dataIndex: 'dateReceived',
      key: 'dateReceived',
      render: d => d ? new Date(d).toLocaleDateString() : ''
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <StatusBadge status={status} />
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <a
          className="text-purple-600 underline hover:text-purple-800"
          href={`/projects/${record._id}`}
        >
          View
        </a>
      )
    }
  ];

  return (
    <div className="p-4">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <StatsCard title="New Project" value={stats.new} icon={<PlusSquareOutlined />} iconBgColor="bg-purple-100" iconColor="text-purple-600" linkTo="/projects/new" />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <StatsCard title="Sent to CEO" value={stats.sentToCEO} icon={<SyncOutlined />} iconBgColor="bg-blue-100" iconColor="text-blue-600" linkTo="/projects/sent-to-ceo" />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <StatsCard title="Approved by Client" value={stats.approved} icon={<CheckCircleOutlined />} iconBgColor="bg-green-100" iconColor="text-green-600" linkTo="/projects/approved-by-client" />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <StatsCard title="Invoice Raised" value={stats.invoiceRaised} icon={<FileDoneOutlined />} iconBgColor="bg-amber-100" iconColor="text-amber-600" linkTo="/projects/invoice-raised" />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <StatsCard title="Total Projects" value={stats.total} icon={<ProjectOutlined />} iconBgColor="bg-indigo-100" iconColor="text-indigo-600" linkTo="/dashboard" />
        </Col>
      </Row>

      <div className="mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-y-2 mb-4">
          <Title level={4} className="m-0">Recent Projects</Title>
          <Link to="/projects/create" className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-3 py-2 rounded-md">
            <PlusOutlined />
            <span>New Project</span>
          </Link>
        </div>

        <CustomProjectTable
          data={allProjects}
          loading={loading}
          selectedRowKeys={selectedRowKeys}
          onRowSelectChange={handleRowSelectChange}
          pagination={pagination}
          onTableChange={({ current, pageSize }) => setPagination({ ...pagination, current, pageSize })}
          searchValue={search}
          setSearchValue={setSearch}
          onExport={handleExport}
          columnsExtras={dashboardTableColumns}
        />
      </div>

      <div className="flex flex-col xl:flex-row gap-6 mt-8">
        <div className="flex-1 bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Activity</h2>
          <div className="space-y-4">
            {todayProjects.length > 0 ? todayProjects.map((p, i) => (
              <div key={i} className="flex items-start space-x-3 p-3 rounded-md bg-gray-50">
                <div className={`p-2 rounded-full ${
                  p.status === 'New' ? 'bg-purple-100 text-purple-600' :
                    p.status === 'Sent to CEO' ? 'bg-blue-100 text-blue-600' :
                      p.status === 'Approved by Client' ? 'bg-green-100 text-green-600' :
                        'bg-amber-100 text-amber-600'}`}>
                  {p.status === 'New' ? <PlusSquareOutlined /> :
                    p.status === 'Sent to CEO' ? <SyncOutlined /> :
                      p.status === 'Approved by Client' ? <CheckCircleOutlined /> :
                        <FileDoneOutlined />}
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/projects/${p._id}`} className="text-sm font-medium text-gray-900 hover:text-purple-600 truncate block">
                    {p.projectName}
                  </Link>
                  <p className="text-xs text-gray-500 mt-1">Status updated to <span className="font-medium">{p.status}</span></p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(p.updatedAt).toLocaleTimeString()}</p>
                </div>
              </div>
            )) : <p className="text-gray-500 text-sm">No activity for today</p>}
          </div>
        </div>

        <div className="w-full xl:w-80 bg-white rounded-lg shadow p-4">
          <Title level={5} className="mb-4">Summary</Title>
          <div className="space-y-2">
            {summary.map(({ type, count }) => (
              <div key={type} className="flex justify-between text-sm">
                <span>{type}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
            <div className="flex justify-between border-t pt-2 mt-2 font-bold">
              <span>Total</span>
              <span>{allProjects.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;














// import React, { useEffect, useState, useRef } from "react";
// import axios from "../../api/axios";
// import { Row, Col, Typography } from "antd";
// import {
//   PlusSquareOutlined,
//   SyncOutlined,
//   CheckCircleOutlined,
//   FileDoneOutlined,
//   ProjectOutlined,
//   PlusOutlined,
// } from "@ant-design/icons";
// import { Link } from "react-router-dom";
// import StatsCard from "../../components/dashboard/StatsCard";
// import CustomProjectTable from "../../components/common/CustomProjectTable";
// import StatusBadge from "../../components/dashboard/StatusBadge";

// const { Title } = Typography;

// const DashboardPage = () => {
//   const [stats, setStats] = useState({
//     total: 0,
//     new: 0,
//     sentToCEO: 0,
//     approved: 0,
//     invoiceRaised: 0,
//   });

//   const [allProjects, setAllProjects] = useState([]);
//   const [todayProjects, setTodayProjects] = useState([]);
//   const [pagination, setPagination] = useState({ current: 1, pageSize: "10", total: 0 });
//   const [loading, setLoading] = useState(false);
//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const debounceTimeout = useRef();

//   const fetchDashboardStats = async () => {
//     try {
//       const res = await axios.get("/projects/dashboard-stats");
//       const s = res.data.stats;
//       setStats({
//         total: s.totalProjects || 0,
//         new: s.newProjects || 0,
//         sentToCEO: s.sentToCEO || 0,
//         approved: s.approvedByClient || 0,
//         invoiceRaised: s.invoiceRaised || 0,
//       });
//     } catch (err) {
//       console.error("Error fetching dashboard stats:", err);
//     }
//   };

//   const fetchProjects = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get("/projects", {
//         params: {
//           page: pagination.current,
//           pageSize: pagination.pageSize,
//           search: debouncedSearch,
//         },
//       });
//       const projects = res.data.projects || [];
//       setAllProjects(projects);
//       setPagination((prev) => ({ ...prev, total: res.data.total || 0 }));
//       updateTodayProjects(projects);
//     } catch (err) {
//       console.error("Error fetching projects:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateTodayProjects = (projects) => {
//     const today = new Date();
//     const filtered = projects.filter((p) => {
//       const d = new Date(p.dateReceived);
//       return (
//         d.getDate() === today.getDate() &&
//         d.getMonth() === today.getMonth() &&
//         d.getFullYear() === today.getFullYear()
//       );
//     });
//     setTodayProjects(filtered.slice(0, 3));
//   };

//   useEffect(() => {
//     fetchDashboardStats();
//   }, []);

//   useEffect(() => {
//     fetchProjects();
//   }, [pagination.current, pagination.pageSize, debouncedSearch]);

//   useEffect(() => {
//     if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
//     debounceTimeout.current = setTimeout(() => {
//       setDebouncedSearch(search);
//       setPagination((prev) => ({ ...prev, current: 1 }));
//     }, 400);
//     return () => clearTimeout(debounceTimeout.current);
//   }, [search]);

//   const handleExport = () => {
//     const headers = ["Project Name", "Date Received", "Status"];
//     const rows = allProjects.map((p) => [
//       p.projectName,
//       p.dateReceived,
//       p.status,
//     ]);
//     const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
//     const blob = new Blob([csv], { type: "text/csv" });
//     const link = document.createElement("a");
//     link.href = window.URL.createObjectURL(blob);
//     link.download = "dashboard_projects.csv";
//     link.click();
//   };

//   const summaryTypes = ["Mockups", "Proposals", "Presentations", "Credentials", "RFP", "AI Work", "Creative Work"];
//   const summary = summaryTypes.map((type) => ({
//     type,
//     count: allProjects.filter((p) => p.projectType === type).length,
//   }));

//   const dashboardTableColumns = [
//     { title: 'Project Name', dataIndex: 'projectName', key: 'projectName' },
//     { title: 'Project Type', dataIndex: 'projectType', key: 'projectType' },
//     { title: 'Category', dataIndex: 'category', key: 'category' },
//     // { title: 'Contact Person', dataIndex: 'contactPerson', key: 'contactPerson' },
//     // { title: 'End Client', dataIndex: 'endClient', key: 'endClient' },
//     {
//       title: 'Date Received',
//       dataIndex: 'dateReceived',
//       key: 'dateReceived',
//       render: d => d ? new Date(d).toLocaleDateString() : ''
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       key: 'status',
//       render: (status) => <StatusBadge status={status} />
//     },
//     {
//       title: 'Action',
//       key: 'action',
//       render: (_, record) => (
//         <a
//           className="text-purple-600 underline hover:text-purple-800"
//           href={`/projects/${record._id}`}
//         >
//           View
//         </a>
//       )
//     }
//   ];

//   return (
//     <div className="p-4">
//       {/* Stats Cards */}
//       <Row gutter={[16, 16]}>
//         <Col xs={24} sm={12} md={8} lg={6} xl={4}>
//           <StatsCard title="New Project" value={stats.new} icon={<PlusSquareOutlined />} iconBgColor="bg-purple-100" iconColor="text-purple-600" linkTo="/projects/new" />
//         </Col>
//         <Col xs={24} sm={12} md={8} lg={6} xl={4}>
//           <StatsCard title="Sent to CEO" value={stats.sentToCEO} icon={<SyncOutlined />} iconBgColor="bg-blue-100" iconColor="text-blue-600" linkTo="/projects/sent-to-ceo" />
//         </Col>
//         <Col xs={24} sm={12} md={8} lg={6} xl={4}>
//           <StatsCard title="Approved by Client" value={stats.approved} icon={<CheckCircleOutlined />} iconBgColor="bg-green-100" iconColor="text-green-600" linkTo="/projects/approved-by-client" />
//         </Col>
//         <Col xs={24} sm={12} md={8} lg={6} xl={4}>
//           <StatsCard title="Invoice Raised" value={stats.invoiceRaised} icon={<FileDoneOutlined />} iconBgColor="bg-amber-100" iconColor="text-amber-600" linkTo="/projects/invoice-raised" />
//         </Col>
//         <Col xs={24} sm={12} md={8} lg={6} xl={4}>
//           <StatsCard title="Total Projects" value={stats.total} icon={<ProjectOutlined />} iconBgColor="bg-indigo-100" iconColor="text-indigo-600" linkTo="/dashboard" />
//         </Col>
//       </Row>

//       {/* Recent Projects Table */}
//       <div className="mt-8">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-y-2 mb-4">
//           <Title level={4} className="m-0">Recent Projects</Title>
//           <Link to="/projects/create" className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-3 py-2 rounded-md">
//             <PlusOutlined />
//             <span>New Project</span>
//           </Link>
//         </div>

//         <CustomProjectTable
//           data={allProjects}
//           loading={loading}
//           selectedRowKeys={[]}
//           onRowSelectChange={() => {}}
//           pagination={pagination}
//           onTableChange={({ current, pageSize }) => setPagination({ ...pagination, current, pageSize })}
//           searchValue={search}
//           setSearchValue={setSearch}
//           onExport={handleExport}
//           columnsExtras={dashboardTableColumns}
//         />
//       </div>

//       {/* Today's Activity & Summary */}
//       <div className="flex flex-col xl:flex-row gap-6 mt-8">
//         {/* Today's Activity */}
//         <div className="flex-1 bg-white rounded-lg shadow p-4">
//           <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Activity</h2>
//           <div className="space-y-4">
//             {todayProjects.length > 0 ? todayProjects.map((p, i) => (
//               <div key={i} className="flex items-start space-x-3 p-3 rounded-md bg-gray-50">
//                 <div className={`p-2 rounded-full ${
//                   p.status === 'New' ? 'bg-purple-100 text-purple-600' :
//                   p.status === 'Sent to CEO' ? 'bg-blue-100 text-blue-600' :
//                   p.status === 'Approved by Client' ? 'bg-green-100 text-green-600' :
//                   'bg-amber-100 text-amber-600'}`}>
//                   {p.status === 'New' ? <PlusSquareOutlined /> :
//                     p.status === 'Sent to CEO' ? <SyncOutlined /> :
//                     p.status === 'Approved by Client' ? <CheckCircleOutlined /> :
//                     <FileDoneOutlined />}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <Link to={`/projects/${p._id}`} className="text-sm font-medium text-gray-900 hover:text-purple-600 truncate block">
//                     {p.projectName}
//                   </Link>
//                   <p className="text-xs text-gray-500 mt-1">Status updated to <span className="font-medium">{p.status}</span></p>
//                   <p className="text-xs text-gray-400 mt-1">{new Date(p.updatedAt).toLocaleTimeString()}</p>
//                 </div>
//               </div>
//             )) : <p className="text-gray-500 text-sm">No activity for today</p>}
//           </div>
//         </div>

//         {/* Summary */}
//         <div className="w-full xl:w-80 bg-white rounded-lg shadow p-4">
//           <Title level={5} className="mb-4">Summary</Title>
//           <div className="space-y-2">
//             {summary.map(({ type, count }) => (
//               <div key={type} className="flex justify-between text-sm">
//                 <span>{type}</span>
//                 <span className="font-semibold">{count}</span>
//               </div>
//             ))}
//             <div className="flex justify-between border-t pt-2 mt-2 font-bold">
//               <span>Total</span>
//               <span>{allProjects.length}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;
