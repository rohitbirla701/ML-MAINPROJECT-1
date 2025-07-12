import React, { useRef, useState } from "react";
import { Table, Button, Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const CustomProjectTable = ({
  data,
  columnsExtras = [],
  selectedRowKeys = [],
  onRowSelectChange,
  loading,
  pagination,
  onTableChange,
  searchValue,
  setSearchValue,
  onExport,
  extraActions = null,
}) => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    setSearchText("");
    confirm();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters, confirm)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    filterDropdownProps: {
      onOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : "",
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  // ✅ Safe column merge with render preservation
  const columns = columnsExtras.map((col) => {
    if (!col.key || col.key === "action") return col;

    const isDate = col.dataIndex === "dateReceived";

    const base = {
      ...col,
      sorter: isDate
        ? (a, b) => new Date(a[col.dataIndex]) - new Date(b[col.dataIndex])
        : (a, b) =>
            a[col.dataIndex]?.toString().localeCompare(b[col.dataIndex]?.toString()),
    };

    // Only apply search if there's no custom render (like StatusBadge)
    return col.render ? base : { ...base, ...getColumnSearchProps(col.dataIndex) };
  });

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow overflow-x-auto">
      {/* Top bar: Search and Actions */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <Input
          placeholder="Search by project name..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="max-w-md"
          allowClear
        />
        <div className="flex gap-2 flex-wrap">
          {onExport && (
            <Button type="primary" onClick={onExport}>
              Export
            </Button>
          )}
          {extraActions}
        </div>
      </div>

      <Table
        dataSource={data}
        columns={columns}
        rowKey="_id"
        loading={loading}
        rowSelection={
          onRowSelectChange
            ? { selectedRowKeys, onChange: onRowSelectChange }
            : null
        }
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          pageSizeOptions: ["10", "15", "20", "25"],
        }}
        onChange={onTableChange}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default CustomProjectTable;





















// import React from "react";
// import { Table, Button, Input } from "antd";

// const CustomProjectTable = ({
//   data,
//   columnsExtras = [],
//   selectedRowKeys = [],
//   onRowSelectChange,
//   loading,
//   pagination,
//   onTableChange,
//   searchValue,
//   setSearchValue,
//   onExport,
//   extraActions = null,
// }) => {
//   const columns = [...columnsExtras]; // ✅ Only external columns

//   return (
//     <div className="p-4 bg-gray-50 rounded-lg shadow overflow-x-auto">
//       {/* Search and action buttons */}
//       <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
//         <Input
//           placeholder="Search by project name..."
//           value={searchValue}
//           onChange={(e) => setSearchValue(e.target.value)}
//           className="max-w-md"
//           allowClear
//         />

//         <div className="flex gap-2 flex-wrap">
//           {onExport && (
//             <Button type="primary" onClick={onExport}>
//               Export
//             </Button>
//           )}
//           {extraActions}
//         </div>
//       </div>

//       {/* Table */}
//       <Table
//         dataSource={data}
//         columns={columns}
//         rowKey="_id"
//         loading={loading}
//         rowSelection={
//           onRowSelectChange
//             ? { selectedRowKeys, onChange: onRowSelectChange }
//             : null
//         }
//         pagination={{
//           current: pagination.current,
//           pageSize: pagination.pageSize,
//           total: pagination.total,
//           showSizeChanger: true,
//           pageSizeOptions: ["10", "15", "20", "25"],
//         }}
//         onChange={onTableChange}
//         scroll={{ x: "max-content" }}
//       />
//     </div>
//   );
// };

// export default CustomProjectTable;












// import React from "react";
// import { Table, Button, Input } from "antd";
// import StatusBadge from "../dashboard/StatusBadge";

// const CustomProjectTable = ({
//   data,
//   columnsExtras = [],
//   selectedRowKeys = [],
//   onRowSelectChange,
//   loading,
//   pagination,
//   onTableChange,
//   searchValue,
//   setSearchValue,
//   onExport,
//   extraActions = null,
//   showProjectId = false,
// }) => {
//   const baseColumns = [
//     ...(showProjectId
//     ? [
//         {
//           title: "Project ID",
//           dataIndex: "_id",
//           key: "projectId",
//         },
//       ]
//     : []),
//     {
//       title: "Project Name",
//       dataIndex: "projectName",
//       key: "projectName",
//     },
//     {
//       title: "Project Type",
//       dataIndex: "projectType",
//       key: "projectType",
//     },
//     // {
//     //   title: "Category",
//     //   dataIndex: "category",
//     //   key: "category",
//     // },
//     // {
//     //   title: "Contact Person",
//     //   dataIndex: "contactPerson",
//     //   key: "contactPerson",
//     // },
//     {
//       title: "End Client",
//       dataIndex: "endClient",
//       key: "endClient",
//     },
//     {
//       title: "Date Received",
//       dataIndex: "dateReceived",
//       key: "dateReceived",
//       render: (d) => (d ? new Date(d).toLocaleDateString() : ""),
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       render: (status) => <StatusBadge status={status} />,
//     },
//     {
//       title: "Action",
//       key: "action",
//       render: (_, record) => (
//         <a
//           className="text-purple-600 underline hover:text-purple-800"
//           href={`/projects/${record._id}`}
//         >
//           View
//         </a>
//       ),
//     },
//     ...columnsExtras,
//   ];

//   return (
//     <div className="p-4 bg-gray-50 rounded-lg shadow overflow-x-auto">
//       {/* Top search and buttons */}
//       <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
//         <Input
//           placeholder="Search by project name..."
//           value={searchValue}
//           onChange={(e) => setSearchValue(e.target.value)}
//           className="max-w-md"
//           allowClear
//         />

//         <div className="flex gap-2 flex-wrap">
//           {onExport && (
//             <Button type="primary" onClick={onExport}>
//               Export
//             </Button>
//           )}
//           {extraActions}
//         </div>
//       </div>

//       {/* Ant Design Table with scroll fix */}
//       <Table
//         dataSource={data}
//         columns={baseColumns}
//         rowKey="_id"
//         loading={loading}
//         rowSelection={
//           onRowSelectChange
//             ? { selectedRowKeys, onChange: onRowSelectChange }
//             : null
//         }
//         pagination={{
//             current: pagination.current,
//             pageSize: pagination.pageSize,
//             total: pagination.total,
//             showSizeChanger: true,
//             pageSizeOptions: ['5', '10', '15', '20'],
//           }}
//         onChange={onTableChange}
//         scroll={{ x: "max-content" }} // ✅ Makes table scrollable on small screens
//       />
//     </div>
//   );
// };

// export default CustomProjectTable;
