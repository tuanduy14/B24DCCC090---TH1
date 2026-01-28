import React, { useState, useEffect } from 'react';
import { Card, Input, Button, List, Space, Typography, Checkbox, Popconfirm, Tag, message } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  // Load todos từ localStorage khi component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todoList');
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos);
        setTodos(parsedTodos);
      } catch (error) {
        console.error('Lỗi khi đọc dữ liệu từ localStorage:', error);
        message.error('Không thể tải danh sách công việc');
      }
    }
  }, []);

  // Lưu todos vào localStorage mỗi khi thay đổi
  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem('todoList', JSON.stringify(todos));
    } else {
      localStorage.removeItem('todoList');
    }
  }, [todos]);

  // Thêm todo mới
  const handleAddTodo = () => {
    if (!inputValue.trim()) {
      message.warning('Vui lòng nhập nội dung công việc');
      return;
    }

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTodos([...todos, newTodo]);
    setInputValue('');
    message.success('Đã thêm công việc mới');
  };

  // Xóa todo
  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
    message.success('Đã xóa công việc');
  };

  // Toggle trạng thái hoàn thành
  const handleToggleComplete = (id: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Bắt đầu chỉnh sửa
  const handleStartEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
  };

  // Lưu chỉnh sửa
  const handleSaveEdit = (id: string) => {
    if (!editingText.trim()) {
      message.warning('Nội dung không được để trống');
      return;
    }

    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, text: editingText.trim() } : todo
      )
    );
    setEditingId(null);
    setEditingText('');
    message.success('Đã cập nhật công việc');
  };

  // Hủy chỉnh sửa
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  // Xóa tất cả
  const handleClearAll = () => {
    setTodos([]);
    localStorage.removeItem('todoList');
    message.success('Đã xóa tất cả công việc');
  };

  // Xóa các todo đã hoàn thành
  const handleClearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
    message.success('Đã xóa các công việc đã hoàn thành');
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center' }}>
           Todo List
        </Title>

        {/* Input thêm todo */}
        <div style={{ width: '100%', marginBottom: '24px', display: 'flex', gap: '8px' }}>
          <Input
            size="large"
            placeholder="Nhập công việc cần làm..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onPressEnter={handleAddTodo}
            style={{ flex: 1 }}
          />
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleAddTodo}
          >
            Thêm
          </Button>
        </div>

        {/* Thống kê */}
        <div style={{ marginBottom: '16px', textAlign: 'center' }}>
          <Space size="large">
            <Tag color="blue">Tổng số: {totalCount}</Tag>
            <Tag color="green">Hoàn thành: {completedCount}</Tag>
            <Tag color="orange">Chưa hoàn thành: {totalCount - completedCount}</Tag>
          </Space>
        </div>

        {/* Danh sách todo */}
        <List
          dataSource={todos}
          locale={{ emptyText: 'Chưa có công việc nào. Hãy thêm công việc mới!' }}
          renderItem={(todo) => (
            <List.Item
              style={{
                background: todo.completed ? '#f0f0f0' : 'white',
                marginBottom: '8px',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #d9d9d9',
              }}
              actions={[
                editingId === todo.id ? (
                  <Button
                    type="link"
                    icon={<SaveOutlined />}
                    onClick={() => handleSaveEdit(todo.id)}
                  >
                    Lưu
                  </Button>
                ) : (
                  <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => handleStartEdit(todo)}
                  >
                    Sửa
                  </Button>
                ),
                editingId === todo.id ? (
                  <Button
                    type="link"
                    danger
                    icon={<CloseOutlined />}
                    onClick={handleCancelEdit}
                  >
                    Hủy
                  </Button>
                ) : (
                  <Popconfirm
                    title="Bạn có chắc muốn xóa công việc này?"
                    onConfirm={() => handleDeleteTodo(todo.id)}
                    okText="Xóa"
                    cancelText="Hủy"
                  >
                    <Button
                      type="link"
                      danger
                      icon={<DeleteOutlined />}
                    >
                      Xóa
                    </Button>
                  </Popconfirm>
                ),
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Checkbox
                    checked={todo.completed}
                    onChange={() => handleToggleComplete(todo.id)}
                  />
                }
                title={
                  editingId === todo.id ? (
                    <Input
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onPressEnter={() => handleSaveEdit(todo.id)}
                      autoFocus
                    />
                  ) : (
                    <span
                      style={{
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        color: todo.completed ? '#999' : '#000',
                      }}
                    >
                      {todo.text}
                    </span>
                  )
                }
                description={
                  <span style={{ fontSize: '12px', color: '#999' }}>
                    Tạo lúc: {new Date(todo.createdAt).toLocaleString('vi-VN')}
                  </span>
                }
              />
            </List.Item>
          )}
        />

        {/* Các nút hành động */}
        {todos.length > 0 && (
          <Space style={{ marginTop: '16px', width: '100%', justifyContent: 'center' }}>
            <Popconfirm
              title="Bạn có chắc muốn xóa toàn bộ danh sách?"
              onConfirm={handleClearAll}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button danger>Xóa tất cả</Button>
            </Popconfirm>
            
            {completedCount > 0 && (
              <Popconfirm
                title="Bạn có chắc muốn xóa các công việc đã hoàn thành?"
                onConfirm={handleClearCompleted}
                okText="Xóa"
                cancelText="Hủy"
              >
                <Button>Xóa đã hoàn thành</Button>
              </Popconfirm>
            )}
          </Space>
        )}
      </Card>
    </div>
  );
};

export default TodoList;