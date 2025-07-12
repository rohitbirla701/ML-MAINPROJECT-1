import React, { useState, useEffect, useRef } from "react";
import { usePaginatedProjects } from "../../api/usePaginatedProjects";
import CustomProjectTable from "../../components/common/CustomProjectTable";
import StatusBadge from "../../components/dashboard/StatusBadge";

const InvoiceRaisedPage = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const debounceTimeout = useRef();

  const { projects, total, loading } = usePaginatedProjects({
    status: "Invoice Raised",
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

  const handleExport = () => {
    const headers = [
      "Project Name",
      "Project Type",
      "Category",
      "Contact Person",
      "End Client",
      "Date Received",
      "Status",
    ];
    const rows = projects.map((p) => [
      p.projectName,
      p.projectType,
      p.category,
      p.contactPerson,
      p.endClient,
      p.dateReceived,
      p.status,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "invoice_projects.csv";
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
      showProjectId={true}
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
    />
  );
};

export default InvoiceRaisedPage;


















// // ✅ Updated InvoiceRaisedPage.jsx
// import React, { useState, useEffect, useRef } from "react";
// import { usePaginatedProjects } from "../../api/usePaginatedProjects";
// import CustomProjectTable from "../../components/common/CustomProjectTable";

// const InvoiceRaisedPage = () => {
//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [selectedRowKeys, setSelectedRowKeys] = useState([]);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const debounceTimeout = useRef();

//   const { projects, total, loading } = usePaginatedProjects({
//     status: "Invoice Raised",
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

//   const handleExport = () => {
//     const headers = ["Project Name", "Type", "Category", "Contact", "Client", "Date", "Status", ];
//     const rows = projects.map(p => [p.projectName, p.projectType, p.category, p.contactPerson, p.endClient, p.dateReceived, p.status]);
//     const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
//     const blob = new Blob([csv], { type: "text/csv" });
//     const link = document.createElement("a");
//     link.href = window.URL.createObjectURL(blob);
//     link.download = "invoice_projects.csv";
//     link.click();
//   };

//   return (
//     <CustomProjectTable
//     // data={invoiceData}
//       showProjectId={true}
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
//     />
//   );
// };

// export default InvoiceRaisedPage;

















// // import React, { useState, useEffect, useRef } from 'react';
// // import { usePaginatedProjects } from '../../api/usePaginatedProjects';
// // import { Table, Typography } from 'antd';
// // import StatusBadge from '../../components/dashboard/StatusBadge';

// // const { Title } = Typography;

// // const InvoiceRaisedPage = () => {
// //   const [search, setSearch] = useState("");
// //   const [debouncedSearch, setDebouncedSearch] = useState("");
// //   const [page, setPage] = useState(1);
// //   const [pageSize, setPageSize] = useState(10);
// //   const [selectedRowKeys, setSelectedRowKeys] = useState([]);

// //   const debounceTimeout = useRef();

// //   useEffect(() => {
// //     if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
// //     debounceTimeout.current = setTimeout(() => {
// //       setDebouncedSearch(search);
// //       setPage(1);
// //     }, 400);
// //     return () => clearTimeout(debounceTimeout.current);
// //   }, [search]);

// //   //Pagination
// //   const { projects, total, loading } = usePaginatedProjects({ status: 'Invoice Raised', search: debouncedSearch, page, pageSize });

// //   const columns = [
// //     { title: 'Project Name', dataIndex: 'projectName', key: 'projectName' },
// //     { title: 'Project Type', dataIndex: 'projectType', key: 'projectType' },
// //     { title: 'Category', dataIndex: 'category', key: 'category' },
// //     { title: 'Contact Person', dataIndex: 'contactPerson', key: 'contactPerson' },
// //     { title: 'End Client', dataIndex: 'endClient', key: 'endClient' },
// //     { title: 'Date Received', dataIndex: 'dateReceived', key: 'dateReceived', render: d => d ? new Date(d).toLocaleDateString() : '' },
// //     { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <StatusBadge status={status} /> },
// //     {
// //       title: 'Action',
// //       key: 'action',
// //       render: (_, record) => (
// //         <button
// //           className="text-purple-600 underline hover:text-purple-800"
// //           onClick={() => window.location.href = `/projects/${record._id}`}
// //         >
// //           View
// //         </button>
// //       ),
// //     },
// //   ];

// //   const handleExport = () => {
// //     const headers = [
// //       'Project Name',
// //       'Project Type',
// //       'Category',
// //       'Contact Person',
// //       'End Client',
// //       'Date Received',
// //       'Status',
// //     ];
// //     const rows = projects.map((p) => [
// //       p.projectName,
// //       p.projectType,
// //       p.category,
// //       p.contactPerson,
// //       p.endClient,
// //       p.dateReceived,
// //       p.status,
// //     ]);
// //     const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
// //     const blob = new Blob([csv], { type: 'text/csv' });
// //     const link = document.createElement('a');
// //     link.href = window.URL.createObjectURL(blob);
// //     link.download = 'invoice_raised_projects.csv';
// //     link.click();
// //   };

// //   return (
// //     <div className="p-4 bg-gray-100 min-h-screen">
// //       <div className="flex justify-between items-center mb-4">
// //         <input
// //           type="text"
// //           placeholder="Search by project name..."
// //           value={search}
// //           onChange={e => setSearch(e.target.value)}
// //           className="border px-3 py-2 rounded w-full max-w-md mb-4"
// //         />
// //         <button onClick={handleExport} className={"bg-purple-600 text-white px-4 py-2 rounded hover:bg-white hover:text-blue-500 "}>Export</button>
// //       </div>
// //       <Table
// //         dataSource={projects}
// //         columns={columns}
// //         rowKey="_id"
// //         rowSelection={{
// //           selectedRowKeys,
// //           onChange: setSelectedRowKeys,
// //         }}
// //         // Pagination
// //         pagination={{
// //           current: page,
// //           pageSize: ["10"],
// //           total,
// //           onChange: (page, pageSize) => {
// //             setPage(page);
// //             setPageSize(pageSize);
// //           },
// //         }}
// //         loading={loading}
// //       />
// //     </div>
// //   );
// // };

// // export default InvoiceRaisedPage;

