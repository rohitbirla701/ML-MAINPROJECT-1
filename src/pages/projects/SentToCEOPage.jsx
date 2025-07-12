import React, { useState, useEffect, useRef } from "react";
import { Button } from "antd";
import CustomProjectTable from "../../components/common/CustomProjectTable";
import { usePaginatedProjects } from "../../api/usePaginatedProjects";
import axios from "../../api/axios";
import StatusBadge from "../../components/dashboard/StatusBadge";

const SentToCeoPage = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const debounceRef = useRef();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  const { projects, total, loading } = usePaginatedProjects({
    status: "Sent to CEO",
    search: debouncedSearch,
    page,
    pageSize,
  });

  const handleApprove = async () => {
    if (!selectedRowKeys.length) return;
    try {
      await Promise.all(
        selectedRowKeys.map((id) =>
          axios.patch(`/projects/${id}`, { status: "Approved by Client" })
        )
      );
      setSelectedRowKeys([]);
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleExport = () => {
    const headers = ["Project Name", "Project Type", "Category", "Contact Person", "End Client", "Date Received", "Status"];
    const rows = projects.map(p => [
      p.projectName,
      p.projectType,
      p.category,
      p.contactPerson,
      p.endClient,
      p.dateReceived,
      p.status,
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "sent_to_ceo_projects.csv";
    link.click();
  };

  const columnsExtras = [
    { title: "Project Name", dataIndex: "projectName", key: "projectName" },
    { title: "Project Type", dataIndex: "projectType", key: "projectType" },
    { title: "Category", dataIndex: "category", key: "category" },
    // { title: "Contact Person", dataIndex: "contactPerson", key: "contactPerson" },
    // { title: "End Client", dataIndex: "endClient", key: "endClient" },
    {
      title: "Date Received",
      dataIndex: "dateReceived",
      key: "dateReceived",
      render: (d) => (d ? new Date(d).toLocaleDateString() : ""),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <StatusBadge status={status} />,
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
      searchValue={search}
      setSearchValue={setSearch}
      selectedRowKeys={selectedRowKeys}
      onRowSelectChange={setSelectedRowKeys}
      pagination={{
        current: page,
        pageSize,
        total,
        onChange: (p, ps) => {
          setPage(p);
          setPageSize(ps);
        },
      }}
      onTableChange={({ current, pageSize }) => {
        setPage(current);
        setPageSize(pageSize);
      }}
      onExport={handleExport}
      columnsExtras={columnsExtras}
      showProjectId={true} // 👈 optional: remove if you don't want project ID column
      extraActions={
        <Button
          type="primary"
          disabled={!selectedRowKeys.length}
          onClick={handleApprove}
        >
          Approve By Client
        </Button>
      }
    />
  );
};

export default SentToCeoPage;









// import React, { useState, useEffect, useRef } from "react";
// import { Button } from "antd";
// import CustomProjectTable from "../../components/common/CustomProjectTable";
// import { usePaginatedProjects } from "../../api/usePaginatedProjects";
// import axios from "../../api/axios";

// const SentToCeoPage = () => {
//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [selectedRowKeys, setSelectedRowKeys] = useState([]);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const debounceRef = useRef();

//   useEffect(() => {
//     if (debounceRef.current) clearTimeout(debounceRef.current);
//     debounceRef.current = setTimeout(() => {
//       setDebouncedSearch(search);
//       setPage(1);
//     }, 400);
//     return () => clearTimeout(debounceRef.current);
//   }, [search]);

//   const { projects, total, loading } = usePaginatedProjects({
//     status: "Sent to CEO",
//     search: debouncedSearch,
//     page,
//     pageSize,
//   });

//   const handleApprove = async () => {
//     if (!selectedRowKeys.length) return;
//     try {
//       await Promise.all(
//         selectedRowKeys.map((id) =>
//           axios.patch(`/projects/${id}`, { status: "Approved by Client" })
//         )
//       );
//       setSelectedRowKeys([]);
//     } catch (err) {
//       alert("Failed to update status");
//     }
//   };

//   const handleExport = () => {
//     const headers = ["Project Name", "Project Type", "Category", "Contact Person", "End Client", "Date Received", "Status"];
//     const rows = projects.map(p => [
//       p.projectName,
//       p.projectType,
//       p.category,
//       p.contactPerson,
//       p.endClient,
//       p.dateReceived,
//       p.status,
//     ]);
//     const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
//     const blob = new Blob([csv], { type: "text/csv" });
//     const link = document.createElement("a");
//     link.href = window.URL.createObjectURL(blob);
//     link.download = "sent_to_ceo_projects.csv";
//     link.click();
//   };

//   return (
//     <CustomProjectTable
//       data={projects}
//       loading={loading}
//       searchValue={search}
//       setSearchValue={setSearch}
//       selectedRowKeys={selectedRowKeys}
//       onRowSelectChange={setSelectedRowKeys}
//       pagination={{
//         current: page,
//         pageSize,
//         total,
//         onChange: (p, ps) => {
//           setPage(p);
//           setPageSize(ps);
//         },
//       }}
//       onTableChange={({ current, pageSize }) => {
//         setPage(current);
//         setPageSize(pageSize);
//       }}
//       onExport={handleExport}
//       extraActions={
//         <Button
//           type="primary"
//           disabled={!selectedRowKeys.length}
//           onClick={handleApprove}
//         >
//           Approve By Client
//         </Button>
//       }
//     />
//   );
// };

// export default SentToCeoPage;























// import React, { useState, useEffect, useRef } from "react";
// import { usePaginatedProjects } from "../../api/usePaginatedProjects";
// import { Table, Typography, Button } from "antd";
// import StatusBadge from "../../components/dashboard/StatusBadge";
// import axios from "../../api/axios";

// // const { Title } = Typography;

// const SentToCeoPage = () => {
//   const [selectedRowKeys, setSelectedRowKeys] = useState([]);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [debouncedSearch, setDebouncedSearch] = useState("");

//   const debounceTimeout = useRef();

//   //Pagination
//   const { projects, total, loading } = usePaginatedProjects({ status: 'Sent to CEO', search: debouncedSearch, page, pageSize });

//   useEffect(() => {
//     if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
//     debounceTimeout.current = setTimeout(() => {
//       setDebouncedSearch(search);
//       setPage(1);
//     }, 400);
//     return () => clearTimeout(debounceTimeout.current);
//   }, [search]);

//   const handleApprove = async () => {
//     if (selectedRowKeys.length === 0) {
//       alert("Please select at least one project!");
//       return;
//     }
//     try {
//       await Promise.all(
//         selectedRowKeys.map((id) =>
//           axios.patch(`/projects/${id}`, {
//             status: "Approved by Client",
//           })
//         )
//       );
//       setSelectedRowKeys([]);
//     } catch (err) {
//       alert("Failed to update status");
//     }
//   };

//   const handleExport = () => {
//     const headers = [
//       "Project Name",
//       "Project Type",
//       "Category",
//       "Contact Person",
//       "End Client",
//       "Date Received",
//       "Status",
//     ];
//     const rows = projects.map((p) => [
//       p.projectName,
//       p.projectType,
//       p.category,
//       p.contactPerson,
//       p.endClient,
//       p.dateReceived,
//       p.status,
//     ]);
//     const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
//     const blob = new Blob([csv], { type: "text/csv" });
//     const link = document.createElement("a");
//     link.href = window.URL.createObjectURL(blob);
//     link.download = "sent_to_ceo_projects.csv";
//     link.click();
//   };

//   const columns = [
//     { title: 'Project Name', dataIndex: 'projectName', key: 'projectName' },
//     { title: 'Project Type', dataIndex: 'projectType', key: 'projectType' },
//     { title: 'Category', dataIndex: 'category', key: 'category' },
//     { title: 'Contact Person', dataIndex: 'contactPerson', key: 'contactPerson' },
//     { title: 'End Client', dataIndex: 'endClient', key: 'endClient' },
//     { title: 'Date Received', dataIndex: 'dateReceived', key: 'dateReceived', render: d => d ? new Date(d).toLocaleDateString() : '' },
//     { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <StatusBadge status={status} /> },
//     {
//       title: 'Action',
//       key: 'action',
//       render: (_, record) => (
//         <button
//           className="text-purple-600 underline hover:text-purple-800"
//           onClick={() => window.location.href = `/projects/${record._id}`}
//         >
//           View
//         </button>
//       ),
//     },
//   ];

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
//           <button onClick={handleExport} className={"bg-purple-600 text-white px-5 py-2 rounded hover:bg-white hover:text-blue-500 "}>Export</button>
//           <Button
//             onClick={handleApprove}
//             disabled={selectedRowKeys.length === 0}
//             className="bg-green-600 text-white px-5 py-5 rounded hover:bg-green-700"
//           >
//             Approve
//           </Button>
//         </div>
//       </div>
//       <Table

//       //pagination
//         rowKey="_id"
//         columns={columns}
//         dataSource={projects}
//         loading={loading}
//         rowSelection={{
//           selectedRowKeys,
//           onChange: setSelectedRowKeys,
//         }}
//         pagination={{
//           current: page,
//           pageSize,
//           total,
//           onChange: (p, ps) => {
//             setPage(p);
//             setPageSize(ps);
//           },
//         }}
//       />
//     </div>
//   );
// };

// export default SentToCeoPage;
