import React, { useState } from 'react';
import { Button, Form, Input, Popconfirm, Tooltip, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { KhoiKienThuc } from './types';

interface TabKhoiKienThucProps {
	khoiKienThuc: KhoiKienThuc[];
	themKhoiKienThuc: (data: Omit<KhoiKienThuc, 'id'>) => boolean;
	suaKhoiKienThuc: (id: string, data: Partial<KhoiKienThuc>) => void;
	xoaKhoiKienThuc: (id: string) => void;
}

const TabKhoiKienThuc: React.FC<TabKhoiKienThucProps> = ({
	khoiKienThuc,
	themKhoiKienThuc,
	suaKhoiKienThuc,
	xoaKhoiKienThuc,
}) => {
	const [showForm, setShowForm] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [form] = Form.useForm();
	const [editForm] = Form.useForm();

	const handleThem = () => {
		const values = form.getFieldsValue();
		if (!values.ma || !values.ten) {
			alert('Vui lòng nhập đầy đủ Mã và Tên!');
			return;
		}
		const success = themKhoiKienThuc(values);
		if (success) {
			form.resetFields();
			setShowForm(false);
		}
	};

	const handleSua = (khoi: KhoiKienThuc) => {
		setEditingId(khoi.id);
		editForm.setFieldsValue(khoi);
	};

	const handleSuaSubmit = (id: string) => {
		const values = editForm.getFieldsValue();
		suaKhoiKienThuc(id, values);
		setEditingId(null);
	};

	return (
		<div>
			{/* Nút mở form thêm */}
			{!showForm && (
				<Button
					type="primary"
					icon={<PlusOutlined />}
					onClick={() => setShowForm(true)}
					style={{ marginBottom: 16 }}
				>
					Thêm khối kiến thức
				</Button>
			)}

			{/* Form thêm mới inline */}
			{showForm && (
				<div style={{
					background: '#f9f9f9',
					border: '1px solid #d9d9d9',
					borderRadius: 8,
					padding: 16,
					marginBottom: 16
				}}>
					<h3 style={{ marginTop: 0 }}>Thêm khối kiến thức mới</h3>
					<Form form={form} layout="vertical">
						<Form.Item label="Mã khối kiến thức" name="ma" required>
							<Input placeholder="VD: KKT01" style={{ maxWidth: 300 }} />
						</Form.Item>
						<Form.Item label="Tên khối kiến thức" name="ten" required>
							<Input placeholder="VD: Tổng quan" style={{ maxWidth: 400 }} />
						</Form.Item>
						<Form.Item label="Mô tả" name="moTa">
							<Input.TextArea rows={2} placeholder="Mô tả (không bắt buộc)" style={{ maxWidth: 500 }} />
						</Form.Item>
						<div>
							<Button
								type="primary"
								icon={<CheckOutlined />}
								onClick={handleThem}
								style={{ marginRight: 8 }}
							>
								Lưu
							</Button>
							<Button
								icon={<CloseOutlined />}
								onClick={() => { setShowForm(false); form.resetFields(); }}
							>
								Hủy
							</Button>
						</div>
					</Form>
				</div>
			)}

			{/* Table */}
			<table style={{ width: '100%', borderCollapse: 'collapse' }}>
				<thead>
					<tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
						<th style={{ padding: '12px', textAlign: 'left', width: '15%' }}>Mã</th>
						<th style={{ padding: '12px', textAlign: 'left', width: '25%' }}>Tên khối kiến thức</th>
						<th style={{ padding: '12px', textAlign: 'left', width: '40%' }}>Mô tả</th>
						<th style={{ padding: '12px', textAlign: 'center', width: '20%' }}>Thao tác</th>
					</tr>
				</thead>
				<tbody>
					{(khoiKienThuc ?? []).length === 0 ? (
						<tr>
							<td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#999' }}>
								Chưa có khối kiến thức nào. Hãy thêm mới!
							</td>
						</tr>
					) : (
						khoiKienThuc.map((khoi) => (
							<tr key={khoi.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
								{editingId === khoi.id ? (
									// Inline edit row
									<>
										<td style={{ padding: '8px' }}>
											<Tag color="blue">{khoi.ma}</Tag>
										</td>
										<td style={{ padding: '8px' }}>
											<Form form={editForm}>
												<Form.Item name="ten" style={{ marginBottom: 0 }}>
													<Input size="small" />
												</Form.Item>
											</Form>
										</td>
										<td style={{ padding: '8px' }}>
											<Form form={editForm}>
												<Form.Item name="moTa" style={{ marginBottom: 0 }}>
													<Input size="small" />
												</Form.Item>
											</Form>
										</td>
										<td style={{ padding: '8px', textAlign: 'center' }}>
											<Button
												type="link"
												icon={<CheckOutlined />}
												onClick={() => handleSuaSubmit(khoi.id)}
											/>
											<Button
												type="link"
												icon={<CloseOutlined />}
												onClick={() => setEditingId(null)}
											/>
										</td>
									</>
								) : (
									// Normal row
									<>
										<td style={{ padding: '12px' }}>{khoi.ma}</td>
										<td style={{ padding: '12px' }}>{khoi.ten}</td>
										<td style={{ padding: '12px', color: '#666' }}>{khoi.moTa || '-'}</td>
										<td style={{ padding: '12px', textAlign: 'center' }}>
											<Tooltip title="Chỉnh sửa">
												<Button
													type="link"
													icon={<EditOutlined />}
													onClick={() => handleSua(khoi)}
												/>
											</Tooltip>
											<Tooltip title="Xóa">
												<Popconfirm
													title="Bạn có chắc chắn muốn xóa?"
													onConfirm={() => xoaKhoiKienThuc(khoi.id)}
													okText="Xóa"
													cancelText="Hủy"
												>
													<Button type="link" danger icon={<DeleteOutlined />} />
												</Popconfirm>
											</Tooltip>
										</td>
									</>
								)}
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
};

export default TabKhoiKienThuc;