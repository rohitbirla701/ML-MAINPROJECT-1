import React, { useState, useEffect, useRef } from "react";
import { Button } from "antd";
import { usePaginatedProjects } from "../../api/usePaginatedProjects";
import axios from "../../api/axios";
import CustomProjectTable from "../../components/common/CustomProjectTable";
import StatusBadge from "../../components/dashboard/StatusBadge";

const NewProjectPage = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const debounceTimeout = useRef();

  const { projects, total, loading } = usePaginatedProjects({
    status: "New",
    search: debouncedSearch,
    page,
    pageSize,
  });

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(debounceTimeout.current);
  }, [search]);

  const handleSendToCEO = async () => {
    if (!selectedRowKeys.length) return alert("Select at least one project");
    try {
      await Promise.all(
        selectedRowKeys.map(id =>
          axios.patch(`/projects/${id}`, { status: "Sent to CEO" })
        )
      );
      setSelectedRowKeys([]);
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const handleExport = () => {
    const headers = ["Project Name", "Type", "Category", "Client", "Date Received", "Status"];
    const rows = projects.map(p => [
      p.projectName,
      p.projectType,
      p.category,
      p.endClient,
      p.dateReceived,
      p.status
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "new_projects.csv";
    link.click();
  };

  const columnsExtras = [
    { title: "Project Name", dataIndex: "projectName", key: "projectName" },
    { title: "Project Type", dataIndex: "projectType", key: "projectType" },
    { title: "Category", dataIndex: "category", key: "category" },
    // { title: "End Client", dataIndex: "endClient", key: "endClient" },
    {
      title: "Date Received",
      dataIndex: "dateReceived",
      key: "dateReceived",
      render: d => d ? new Date(d).toLocaleDateString() : "",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: status => <StatusBadge status={status} />,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <a
          className="text-purple-600 underline hover:text-purple-800"
          href={`/projects/${record._id}`}
        >
          View
        </a>
      ),
    },
  ];

  return (
    <CustomProjectTable
      data={projects}
      loading={loading}
      selectedRowKeys={selectedRowKeys}
      onRowSelectChange={setSelectedRowKeys}
      pagination={{
        current: page,
        pageSize,
        total,
        onChange: (current, size) => {
          setPage(current);
          setPageSize(size);
        },
      }}
      onTableChange={({ current, pageSize }) => {
        setPage(current);
        setPageSize(pageSize);
      }}
      searchValue={search}
      setSearchValue={setSearch}
      onExport={handleExport}
      columnsExtras={columnsExtras}
      showProjectId={false} // 👈 remove project ID column completely
      extraActions={
        <Button
          onClick={handleSendToCEO}
          disabled={!selectedRowKeys.length}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Send to CEO
        </Button>
      }
    />
  );
};

export default NewProjectPage;
















// // ✅ Updated NewProjectPage.jsx
// import React, { useState, useEffect, useRef } from "react";
// import { usePaginatedProjects } from "../../api/usePaginatedProjects";
// import axios from "../../api/axios";
// import CustomProjectTable from "../../components/common/CustomProjectTable";

// const NewProjectPage = () => {
//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [selectedRowKeys, setSelectedRowKeys] = useState([]);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const debounceTimeout = useRef();

//   const { projects, total, loading } = usePaginatedProjects({
//     status: "New",
//     search: debouncedSearch,
//     page,
//     pageSize,
//   });

//   useEffect(() => {
//     if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
//     debounceTimeout.current = setTimeout(() => {
//       setDebouncedSearch(search);
//       setPage(1);
//     }, 400);
//     return () => clearTimeout(debounceTimeout.current);
//   }, [search]);

//   const handleSendToCEO = async () => {
//     if (selectedRowKeys.length === 0) return alert("Select at least one project");
//     await Promise.all(
//       selectedRowKeys.map(id => axios.patch(`/projects/${id}`, { status: "Sent to CEO" }))
//     );
//     setSelectedRowKeys([]);
//   };

//   const handleExport = () => {
//     const headers = ["Project Name", "Type", "Category", "Client", "Date Received", "Status"];
//     const rows = projects.map(p => [p.projectName, p.projectType, p.category, p.endClient, p.dateReceived, p.status]);
//     const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
//     const blob = new Blob([csv], { type: "text/csv" });
//     const link = document.createElement("a");
//     link.href = window.URL.createObjectURL(blob);
//     link.download = "new_projects.csv";
//     link.click();
//   };

//   return (
//     <CustomProjectTable
//       data={projects}
//       loading={loading}
//       selectedRowKeys={selectedRowKeys}
//       onRowSelectChange={setSelectedRowKeys}
//       pagination={{ current: page, pageSize, total, onChange: setPage }}
//       onTableChange={({ current, pageSize }) => {
//         setPage(current);
//         setPageSize(pageSize);
//       }}
//       searchValue={search}
//       setSearchValue={setSearch}
//       onExport={handleExport}
//       extraActions={
//         <button
//           onClick={handleSendToCEO}
//           disabled={selectedRowKeys.length === 0}
//           className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
//         >
//           Send to CEO
//         </button>
//       }
//     />
//   );
// };

// export default NewProjectPage;










// // src/pages/NewProjectPage.jsx
// import React, { useState, useEffect, useRef } from 'react';
// import { usePaginatedProjects } from '../../api/usePaginatedProjects';
// import axios from '../../api/axios';
// import StatusBadge from '../../components/dashboard/StatusBadge';

// const NewProjectPage = () => {
//   const [selectedProjects, setSelectedProjects] = useState([]);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const debounceTimeout = useRef();

//   useEffect(() => {
//     if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
//     debounceTimeout.current = setTimeout(() => {
//       setDebouncedSearch(search);
//       setPage(1);
//     }, 400);
//     return () => clearTimeout(debounceTimeout.current);
//   }, [search]);

//   //Pagination
//   const { projects, total, loading } = usePaginatedProjects({ status: 'New', search: debouncedSearch, page, pageSize });

//   const handleSelect = (projectId) => {
//     setSelectedProjects((prev) =>
//       prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId]
//     );
//   };

//   const handleSelectAll = () => {
//     setSelectedProjects(
//       selectedProjects.length === projects.length ? [] : projects.map((p) => p._id)
//     );
//   };

//   const handleSendToCEO = async () => {
//     if (selectedProjects.length === 0) {
//       alert("Please select at least one project!");
//       return;
//     }
//     try {
//       await Promise.all(selectedProjects.map(id =>
//         axios.patch(`/projects/${id}`, { status: 'Sent to CEO' })
//       ));
//       setSelectedProjects([]);
//     } catch (err) {
//       alert("Failed to update status");
//     }
//   };

//   const exportToCSV = () => {
//     const headers = ['Project Name', 'Type', 'Category', 'Client', 'Date Received', 'Status'];
//     const rows = projects.map(p => [
//       p.projectName,
//       p.projectType,
//       p.category,
//       p.endClient,
//       p.dateReceived,
//       p.status
//     ]);

//     const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
//     const blob = new Blob([csv], { type: 'text/csv' });
//     const link = document.createElement('a');
//     link.href = window.URL.createObjectURL(blob);
//     link.download = 'projects.csv';
//     link.click();
//   };

//   return (
//     <div className="p-4 bg-gray-100 min-h-screen">
//       <div className="flex justify-between items-center mb-4">
//         <input
//           type="text"
//           placeholder="Search by project name..."
//           value={search}
//           onChange={e => setSearch(e.target.value)}
//           className="border px-3 py-2 rounded w-full max-w-md mb-4"
//         />
//         <div className="flex gap-4">
//           <button onClick={exportToCSV} className={"bg-purple-600 text-white px-4 py-2 rounded hover:bg-white hover:text-blue-500 "}>Export</button>
//           <button
//             onClick={handleSendToCEO}
//             className={`bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 ${selectedProjects.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
//             disabled={selectedProjects.length === 0}
//           >
//             Sent to CEO
//           </button>
//         </div>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white  border text-gray-500  border-gray-200 rounded-lg">
//           <thead className="bg-white">
//             <tr>
//               <th className="px-4 py-2 ">
//                 <input
//                   type="checkbox"
//                   checked={selectedProjects.length === projects.length && projects.length > 0}
//                   onChange={handleSelectAll}
//                 />
//               </th>
//               <th className="px-6 py-3 text-left">Project Name</th>
//               <th className="px-6 py-3 text-left">Type</th>
//               <th className="px-6 py-3 text-left">Category</th>
//               <th className="px-6 py-3 text-left">Client</th>
//               <th className="px-6 py-3 text-left">Date Received</th>
//               <th className="px-6 py-3 text-left">Status</th>
//               <th className="px-6 py-3 text-left">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {projects.filter(p => p.projectName.toLowerCase().includes(search.toLowerCase())).map(project => (
//               <tr key={project._id} className="border-t">
//                 <td className="px-4 py-2">
//                   <input
//                     type="checkbox"
//                     checked={selectedProjects.includes(project._id)}
//                     onChange={() => handleSelect(project._id)}
//                   />
//                 </td>
//                 <td className="px-6 py-2">{project.projectName}</td>
//                 <td className="px-6 py-2">{project.projectType}</td>
//                 <td className="px-6 py-2">{project.category}</td>
//                 <td className="px-6 py-2">{project.endClient}</td>
//                 <td className="px-6 py-2">{project.dateReceived ? new Date(project.dateReceived).toLocaleDateString() : ''}</td>
//                 <td className="px-6 py-2"><StatusBadge status={project.status} /></td>
//                 <td className="px-6 py-2">
//                   <button
//                     className="text-purple-600 underline hover:text-purple-800"
//                     onClick={() => window.location.href = `/projects/${project._id}`}
//                   >
//                     View
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default NewProjectPage;
