import React, { useCallback, useState } from "react";
import { Form, Comment, Input, Button } from "antd";

import api from "../../services/api";

const { TextArea } = Input;

export default function Comments({ item, loadFeedbacks }) {
  const { id } = item;
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");

  const Editor = useCallback(({ onChange, onSubmit, submitting, value }) => {
    return (
      <>
        <Form.Item>
          <TextArea
            rows={4}
            onChange={onChange}
            value={value}
            placeholder="Digite aqui o seu feedback"
          />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            loading={submitting}
            onClick={onSubmit}
            type="primary"
          >
            Enviar
          </Button>
        </Form.Item>
      </>
    );
  }, []);

  const handleChange = useCallback((data) => {
    setText(data.target.value);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (text) {
      setLoading(true);
      await api.post(`/collaborator/${id}/feedback`, {
        collaboratorId: id,
        message: text,
        like: 0,
      });
      loadFeedbacks();
      setText("");
      setLoading(false);
    }
  }, [id, text, loadFeedbacks]);

  return (
    <Comment
      content={
        <Editor
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitting={loading}
          value={text}
        />
      }
    />
  );
}
