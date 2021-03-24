import React from "react";
import { Layout } from "antd";

const { Header, Content } = Layout;

export default function Headers({ children }) {
  return (
    <Layout>
      <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}></Header>
      <Content style={{ padding: "0 50px", marginTop: 64 }}>
        <div
          style={{
            padding: 24,
            minHeight: 380,
            marginTop: 20,
            background: "#fff",
          }}
        >
          {children}
        </div>
      </Content>
    </Layout>
  );
}
