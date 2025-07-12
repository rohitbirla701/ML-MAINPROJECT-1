import React, { useState, useEffect } from "react";
import { Layout, Drawer } from "antd";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const { Sider, Content } = Layout;

const AppLayout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Detect screen size change
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle drawer in mobile
  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar for desktop */}
      {!isMobile && (
        <Sider width={250} style={{ background: "#fff" }}>
          <Sidebar />
        </Sider>
      )}

      {/* Drawer for mobile */}
      <Drawer
        title="Menu"
        placement="left"
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        Styles={{ padding: 0 }}
      >
        <Sidebar />
      </Drawer>

      {/* Main Layout */}
      <Layout>
        <Header onToggleSidebar={toggleDrawer} />
        <Content style={{ margin: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;















// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import { Layout as AntLayout, Drawer, Button } from "antd";
// import { MenuOutlined } from "@ant-design/icons";
// import Sidebar from './Sidebar';
// import Header from './Header';

// const { Header: AntHeader, Sider, Content } = AntLayout;

// const Layout = ({ children }) => {
//   const [isMobile, setIsMobile] = useState(false);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const location = useLocation();

//   useEffect(() => {
//     setDrawerOpen(false);
//   }, [location]);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 1024);
//     };
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <AntLayout style={{ minHeight: "100vh" }}>
//       <AntHeader
//         style={{
//           background: "#fff",
//           padding: "0 16px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           position: "sticky",
//           top: 0,
//           zIndex: 1000,
//           height: 64,
//           boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
//         }}
//       >
//         {isMobile && (
//           <Button
//             type="text"
//             icon={<MenuOutlined />}
//             onClick={() => setDrawerOpen(true)}
//           />
//         )}
//         <Header />
//       </AntHeader>

//       <AntLayout>
//         {!isMobile && (
//           <Sider
//             width={256}
//             style={{
//               background: "#fff",
//               height: "calc(100vh - 64px)",
//               position: "sticky",
//               top: 64,
//               overflow: "auto",
//             }}
//           >
//             <Sidebar />
//           </Sider>
//         )}

//         {isMobile && (
//           <Drawer
//             placement="left"
//             onClose={() => setDrawerOpen(false)}
//             open={drawerOpen}
//             bodyStyle={{ padding: 0 }}
//             width={256}
//             style={{ zIndex: 1100 }}
//           >
//             <Sidebar />
//           </Drawer>
//         )}

//         <Content style={{ padding: 16 }}>{children}</Content>
//       </AntLayout>
//     </AntLayout>
//   );
// };

// export default Layout;












// // import { useEffect, useState } from 'react';
// // import { useLocation } from 'react-router-dom';
// // import { Layout as AntLayout, Button, Drawer } from 'antd';
// // import { MenuOutlined } from '@ant-design/icons';

// // import Sidebar from './Sidebar';
// // import Header from './Header';

// // const { Header: AntHeader, Sider, Content } = AntLayout;

// // const Layout = ({ children }) => {
// //   const [sidebarOpen, setSidebarOpen] = useState(false);
// //   const location = useLocation();

// //   // Close sidebar drawer on route change (for mobile)
// //   useEffect(() => {
// //     setSidebarOpen(false);
// //   }, [location]);

// //   return (
// //     <AntLayout style={{ minHeight: '100vh' }}>
// //       {/* Desktop Sidebar - fixed on left */}
// //       <Sider
// //         breakpoint="lg"
// //         collapsedWidth="0"
// //         width={240}
// //         style={{
// //           position: 'fixed',
// //           height: '100vh',
// //           left: 0,
// //           top: 0,
// //           bottom: 0,
// //           zIndex: 1000,
// //           background: '#fff',
// //           boxShadow: '2px 0 6px rgba(0,0,0,0.1)',
// //         }}
// //         className="hidden lg:block"
// //       >
// //         <Sidebar />
// //       </Sider>

// //       {/* Mobile Sidebar Drawer */}
// //       <Drawer
// //   visible={sidebarOpen}
// //   placement="left"
// //   onClose={() => setSidebarOpen(false)}
// //   bodyStyle={{ padding: 0 }}
// //   width={240}
// //   className="lg:hidden"
// //   getContainer={false}
// //   style={{
// //     position: 'fixed',
// //     height: '100vh',
// //     maxHeight: '100vh',
// //     overflow: 'hidden',
// //   }}
// // >
// //   <Sidebar />
// // </Drawer>



// //       {/* Main Layout */}
// //       <AntLayout
// //         style={{
// //           marginLeft: 0,
// //           minHeight: '100vh',
// //           transition: 'margin-left 0.2s',
// //         }}
// //         className="lg:ml-[240px]" // push content right on large screens
// //       >
// //         {/* Header */}
// //         <AntHeader
// //           style={{
// //             background: '#fff',
// //             padding: '0 16px',
// //             display: 'flex',
// //             alignItems: 'center',
// //             justifyContent: 'space-between',
// //             boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
// //             position: 'sticky',
// //             top: 0,
// //             zIndex: 999,
// //           }}
// //         >
// //           {/* Mobile Sidebar Toggle Button */}
// //           <Button
// //             type="text"
// //             icon={<MenuOutlined />}
// //             className="lg:hidden"
// //             onClick={() => setSidebarOpen(true)}
// //           />

// //           {/* Your custom header content */}
// //           <Header />
// //         </AntHeader>

// //         {/* Content */}
// //         <Content
// //           style={{
// //             margin: '16px',
// //             padding: '16px',
// //             background: '#fff',
// //             minHeight: 'calc(100vh - 64px - 32px)', // header + margin compensation
// //           }}
// //         >
// //           {children}
// //         </Content>
// //       </AntLayout>
// //     </AntLayout>
// //   );
// // };

// // export default Layout;
