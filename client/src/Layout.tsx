import { ConfigProvider, theme } from "antd";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <ConfigProvider
    theme={{
      token: {
        borderRadius: 8,
      },
      algorithm: theme.darkAlgorithm,
    }}
    >
      <Outlet />
    </ConfigProvider>
    </>
  )
};

export default Layout;