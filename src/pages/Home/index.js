import React, { useState, useCallback, useEffect } from "react";
import { List, Skeleton, Avatar } from "antd";
import { Link } from "react-router-dom";

import api from "../../services/api";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const onLoadMore = useCallback(async () => {
    setLoading(true);
    await api.get(`/collaborator`).then((response) => {
      setData(response.data);
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    onLoadMore();
  }, [onLoadMore]);

  return (
    <List
      loading={loading}
      itemLayout="horizontal"
      pagination={{
        showTotal: (total) => `Total ${total} colaboradores`,
        pageSize: 10,
        defaultPageSize: 10,
        showSizeChanger: false,
      }}
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <Skeleton avatar title={false} loading={item.loading} active>
            <List.Item.Meta
              avatar={<Avatar src={item.avatar} />}
              title={<Link to={`/collaborator/${item.id}`}>{item.name}</Link>}
              description={item.role}
            />
            <div>{item.company}</div>
          </Skeleton>
        </List.Item>
      )}
    />
  );
}
