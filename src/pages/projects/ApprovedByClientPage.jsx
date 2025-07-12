import React, { useState, useEffect, useRef } from "react";
import { usePaginatedProjects } from "../../api/usePaginatedProjects";
import axios from "../../api/axios";
import CustomProjectTable from "../../components/common/CustomProjectTable";
import StatusBadge from "../../components/dashboard/StatusBadge";

const ApprovedByClientPage = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const debounceTimeout = useRef();

  const { projects, total, loading } = usePaginatedProjects({
    status: "Approved by Client",
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

  const handleInvoiceRaised = async () => {
    if (selectedRowKeys.length === 0) return alert("Select at least one project");
    try {
      await Promise.all(
        selectedRowKeys.map(id =>
          axios.patch(`/projects/${id}`, { status: "Invoice Raised" })
        )
      );
      setSelectedRowKeys([]);
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const handleExport = () => {
    const headers = ["Project Name", "Type", "Category", "Contact", "Client", "Date", "Status"];
    const rows = projects.map(p => [
      p.projectName,
      p.projectType,
      p.category,
      p.contactPerson,
      p.endClient,
      p.dateReceived,
      p.status
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "approved_projects.csv";
    link.click();
  };

  const columnsExtras = [
    { title: 'Project Name', dataIndex: 'projectName', key: 'projectName' },
    { title: 'Project Type', dataIndex: 'projectType', key: 'projectType' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    // { title: 'Contact Person', dataIndex: 'contactPerson', key: 'contactPerson' },
    // { title: 'End Client', dataIndex: 'endClient', key: 'endClient' },
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
    <CustomProjectTable
      data={projects}
      loading={loading}
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
      searchValue={search}
      setSearchValue={setSearch}
      onExport={handleExport}
      columnsExtras={columnsExtras}
      extraActions={
        <button
          onClick={handleInvoiceRaised}
          disabled={selectedRowKeys.length === 0}
          className={`bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 ${selectedRowKeys.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Mark Invoice Raised
        </button>
      }
    />
  );
};

export default ApprovedByClientPage;










// // ✅ Updated ApprovedByClientPage.jsx
// import React, { useState, useEffect, useRef } from "react";
// import { usePaginatedProjects } from "../../api/usePaginatedProjects";
// import axios from "../../api/axios";
// import CustomProjectTable from "../../components/common/CustomProjectTable";

// const ApprovedByClientPage = () => {
//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [selectedRowKeys, setSelectedRowKeys] = useState([]);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const debounceTimeout = useRef();

//   const { projects, total, loading } = usePaginatedProjects({
//     status: "Approved by Client",
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

//   const handleInvoiceRaised = async () => {
//     if (selectedRowKeys.length === 0) return alert("Select at least one project");
//     await Promise.all(
//       selectedRowKeys.map(id => axios.patch(`/projects/${id}`, { status: "Invoice Raised" }))
//     );
//     setSelectedRowKeys([]);
//   };

//   const handleExport = () => {
//     const headers = ["Project Name", "Type", "Category", "Contact", "Client", "Date", "Status"];
//     const rows = projects.map(p => [p.projectName, p.projectType, p.category, p.contactPerson, p.endClient, p.dateReceived, p.status]);
//     const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
//     const blob = new Blob([csv], { type: "text/csv" });
//     const link = document.createElement("a");
//     link.href = window.URL.createObjectURL(blob);
//     link.download = "approved_projects.csv";
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
//           onClick={handleInvoiceRaised}
//           disabled={selectedRowKeys.length === 0}
//           className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
//         >
//           Mark Invoice Raised
//         </button>
//       }
//     />
//   );
// };

// export default ApprovedByClientPage;













// import React, { useState, useEffect, useRef } from 'react';
// import { usePaginatedProjects } from '../../api/usePaginatedProjects';
// import axios from '../../api/axios';
// import { Table, Typography, Button } from 'antd';
// import StatusBadge from '../../components/dashboard/StatusBadge';

// const { Title } = Typography;

// const ApprovedByClientPage = () => {
//   const [selectedRowKeys, setSelectedRowKeys] = useState([]);
//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");

//   console.log("search", search);
//   console.log("selectedRowKeys", selectedRowKeys)

//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);

//   const debounceTimeout = useRef();

// // Debounced search effect
//   useEffect(() => {
//     if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
//     debounceTimeout.current = setTimeout(() => {
//       setDebouncedSearch(search);
//       setPage(1);
//     }, 400); // 400ms debounce
//     return () => clearTimeout(debounceTimeout.current);
//   }, [search]);

// // Pagination
//   const { projects, total, loading } = usePaginatedProjects({ status: 'Approved by Client', search: debouncedSearch, page, pageSize });

//   const handleInvoiceRaised = async () => {
//     if (selectedRowKeys.length === 0) {
//       alert('Please select at least one project!');
//       return;
//     }
//     try {
//       await Promise.all(selectedRowKeys.map(id =>
//         axios.patch(`/projects/${id}`, { status: 'Invoice Raised' })
//       ));
//       // Refresh list
//       setSelectedRowKeys([]);
//     } catch (err) {
//       alert('Failed to update status');
//     }
//   };

//   const handleExport = () => {
//     const headers = [
//       'Project Name',
//       'Project Type',
//       'Category',
//       'Contact Person',
//       'End Client',
//       'Date Received',
//       'Status',
//     ];
//     const rows = projects.map((p) => [
//       p.projectName,
//       p.projectType,
//       p.category,
//       p.contactPerson,
//       p.endClient,
//       p.dateReceived ? new Date(p.dateReceived).toLocaleDateString() : '',
//       p.status,
//     ]);
//     const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
//     const blob = new Blob([csv], { type: 'text/csv' });
//     const link = document.createElement('a');
//     link.href = window.URL.createObjectURL(blob);
//     link.download = 'approved_by_client_projects.csv';
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

//   const rowSelection = {
//     selectedRowKeys,
//     onChange: setSelectedRowKeys,
//   };

// // Debounced search effect
//   useEffect(() => {
//     if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
//     debounceTimeout.current = setTimeout(() => {
//       setDebouncedSearch(search);
//       setPage(1);
//     }, 400); // 400ms debounce
//     return () => clearTimeout(debounceTimeout.current);
//   }, [search]);

//   return (
//     <div className="p-4">
//       <div className="flex justify-between items-center mb-4">
//         <input
//           type="text"
//           placeholder="Search by project name..."
//           value={search}
//           onChange={e => setSearch(e.target.value)}
//           className="border px-3 py-2 rounded w-full max-w-md mb-4"
//         />
//         <div className="flex space-x-4 pb-6">
//         <Button onClick={handleExport} className={`bg-purple-600 text-white px-6 py-5 rounded hover:bg-purple-700`}>
//           Export
//         </Button>
//         <Button onClick={handleInvoiceRaised} type="primary" className={`bg-purple-600 text-white px-4 py-5 rounded hover:bg-purple-700 ${selectedRowKeys.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={selectedRowKeys.length === 0}>
//           Mark Invoice Raised
//         </Button>
//       </div>
//       </div>
//       <Table

//       // Pagination
//         dataSource={projects}
//         columns={columns}
//         rowKey="_id"
//         rowSelection={rowSelection}
//         onChange={(pagination,) => {
//           setPage(pagination.current);
//           setPageSize(pagination.pageSize);

//         }}
//         pagination={{
//           current: page,
//           pageSize: ["10"],
//           total,
//           onChange: (page, pageSize) => {
//             setPage(page);
//             setPageSize(pageSize);
//           },
//         }}
//         loading={loading}
//       />
//     </div>
//   );
// };

// export default ApprovedByClientPage;