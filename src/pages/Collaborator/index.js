import React, { useState, useCallback, useEffect } from "react";
import {
  Row,
  Col,
  List,
  Avatar,
  Space,
  Divider,
  Descriptions,
  Spin,
} from "antd";
import { useHistory, useParams } from "react-router-dom";
import { LikeOutlined, LoadingOutlined } from "@ant-design/icons";
import { FiTrash, FiArrowLeft } from "react-icons/fi";
import { format, formatDistance, addMinutes, isAfter } from "date-fns";
import pt from "date-fns/locale/pt-BR";

import api from "../../services/api";
import Comments from "../../components/Comments";

const antIcon = <LoadingOutlined style={{ fontSize: 11 }} spin />;

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const getUTCDate = (dateString = Date.now()) => {
  const date = new Date(dateString);

  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
};

export default function Collaborator() {
  const { id } = useParams();
  const history = useHistory();

  const [collaborator, setCollaborator] = useState({});
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadFeed, setLoadFeed] = useState(false);
  const [loadLike, setLoadLike] = useState(false);

  const loadFeedbacks = useCallback(
    async (load) => {
      setLoadFeed(load);
      await api.get(`/collaborator/${id}/feedback`).then((response) => {
        setFeedbacks(response.data);
      });
      setLoadLike(false);
      setLoadFeed(false);
    },
    [id]
  );

  const loadCollaborator = useCallback(async () => {
    setLoading(true);
    await api.get(`/collaborator/${id}`).then((response) => {
      setCollaborator(response.data);
    });
    setLoading(false);
  }, [id]);

  useEffect(() => {
    loadCollaborator();
  }, [loadCollaborator]);

  useEffect(() => {
    loadFeedbacks(true);
  }, [loadFeedbacks]);

  const handleLike = useCallback(
    async (item) => {
      setLoadLike(true);
      await api.put(`/collaborator/${id}/feedback/${item.id}`, {
        like: item.like + 1,
      });
      loadFeedbacks(false);
    },
    [id, loadFeedbacks]
  );

  const handleDelete = useCallback(
    async (item) => {
      setLoadFeed(true);
      await api.delete(`/collaborator/${id}/feedback/${item.id}`);
      loadFeedbacks(true);
    },
    [id, loadFeedbacks]
  );

  return (
    <Row justify="center" gutter={[8, 24]}>
      <Col span={24}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <FiArrowLeft
            onClick={() => history.goBack()}
            size={25}
            style={{ cursor: "pointer", marginRight: 10 }}
          />
          Informações do colaborador
        </div>
      </Col>
      <Col span={2}>
        {collaborator.id && <Avatar size={100} src={collaborator.avatar} />}
      </Col>
      <Col span={24}>
        <Spin spinning={loading}>
          <Descriptions bordered>
            <Descriptions.Item label="Id" span={3}>
              {collaborator.id}
            </Descriptions.Item>
            <Descriptions.Item label="Nome" span={3}>
              {collaborator.name}
            </Descriptions.Item>
            <Descriptions.Item label="Cargo" span={3}>
              {collaborator.role}
            </Descriptions.Item>
            <Descriptions.Item label="Empresa" span={3}>
              {collaborator.company}
            </Descriptions.Item>
            <Descriptions.Item label="Criado em" span={3}>
              {format(getUTCDate(collaborator.createdAt), "d/MM/yyyy")}
            </Descriptions.Item>
          </Descriptions>
        </Spin>
      </Col>
      <Col span={24}>
        <Divider orientation="left">Feedbacks</Divider>
        <div style={{ height: 400, overflow: "auto" }}>
          <List
            loading={loadFeed}
            itemLayout="vertical"
            size="small"
            pagination={{
              pageSize: 20,
              position: "top",
            }}
            locale={{ emptyText: "Nenhum registro encontrado" }}
            dataSource={feedbacks}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                actions={[
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => handleLike(item)}
                  >
                    <IconText
                      icon={LikeOutlined}
                      text={loadLike ? antIcon : item.like}
                      key="list-vertical-like-o"
                    />
                  </div>,
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDelete(item)}
                  >
                    {isAfter(
                      addMinutes(getUTCDate(item.createdAt), 5),
                      getUTCDate()
                    ) ? (
                      <IconText icon={FiTrash} key="list-vertical-like-o" />
                    ) : null}
                  </div>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.avatar} />}
                  title={item.message}
                  description={formatDistance(
                    getUTCDate(item.createdAt),
                    getUTCDate(),
                    {
                      locale: pt,
                      includeSeconds: true,
                    }
                  )}
                />
                {item.content}
              </List.Item>
            )}
          />
        </div>
      </Col>
      <Col span={24}>
        <Comments item={collaborator} loadFeedbacks={loadFeedbacks} />
      </Col>
    </Row>
  );
}
