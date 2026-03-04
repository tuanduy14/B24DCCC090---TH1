import React, { useState } from 'react';
import { Button, Form, Input, InputNumber, Popconfirm, Tooltip, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { MonHoc } from './types';

interface TabMonHocProps {
	monHoc: MonHoc[];
	themMonHoc: (data: Omit<MonHoc, 'id'>) => boolean;
	suaMonHoc: (id: string, data: Partial<MonHoc>) => void;
	xoaMonHoc: (id: string) => void;
}

const TabMonHoc: React.FC<TabMonHocProps> = ({
	monHoc,
	themMonHoc,
	suaMonHoc,
	xoaMonHoc,
}) => {
	const [showForm, setShowForm] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [form] = Form.useForm();
	const [editForm] = Form.useForm();

	const handleThem = () => {
		const values = form.getFieldsValue();
		if (!values.maMon || !values.tenMon || !values.soTinChi) {
			alert('Vui lòng nhập đầy đủ thông tin bắt buộc!');
			return;
		}
		const success = themMonHoc(values);
		if (success) {
			form.resetFields();
			setShowForm(false);
		}
	};

	const handleSua = (mon: MonHoc) => {
		setEditingId(mon.id);
		editForm.setFieldsValue(mon);
	};

	const handleSuaSubmit = (id: string) => {
		const values = editForm.getFieldsValue();
		suaMonHoc(id, values);
		setEditingId(null);
	};

	return (
		<div>
			{!showForm && (
				<Button
					type="primary"
					icon={<PlusOutlined />}
					onClick={() => setShowForm(true)}
					style={{ marginBottom: 16 }}
				>
					Thêm môn học
				</Button>
			)}

			{showForm && (
				<div style={{
					background: '#f9f9f9',
					border: '1px solid #d9d9d9',
					borderRadius: 8,
					padding: 16,
					marginBottom: 16
				}}>
					<h3 style={{ marginTop: 0 }}>Thêm môn học mới</h3>
					<Form form={form} layout="vertical">
						<Form.Item label="Mã môn học" name="maMon" required>
							<Input placeholder="VD: MATH101" style={{ maxWidth: 300 }} />
						</Form.Item>
						<Form.Item label="Tên môn học" name="tenMon" required>
							<Input placeholder="VD: Toán cao cấp" style={{ maxWidth: 400 }} />
						</Form.Item>
						<Form.Item label="Số tín chỉ" name="soTinChi" required>
							<InputNumber min={1} max={10} placeholder="VD: 3" />
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

			<table style={{ width: '100%', borderCollapse: 'collapse' }}>
				<thead>
					<tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
						<th style={{ padding: '12px', textAlign: 'left', width: '15%' }}>Mã môn</th>
						<th style={{ padding: '12px', textAlign: 'left', width: '30%' }}>Tên môn học</th>
						<th style={{ padding: '12px', textAlign: 'center', width: '10%' }}>Số TC</th>
						<th style={{ padding: '12px', textAlign: 'left', width: '28%' }}>Mô tả</th>
						<th style={{ padding: '12px', textAlign: 'center', width: '17%' }}>Thao tác</th>
					</tr>
				</thead>
				<tbody>
					{(monHoc ?? []).length === 0 ? (
						<tr>
							<td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#999' }}>
								Chưa có môn học nào. Hãy thêm mới!
							</td>
						</tr>
					) : (
						monHoc.map((mon) => (
							<tr key={mon.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
								{editingId === mon.id ? (
									<>
										<td style={{ padding: '8px' }}>
											<Tag color="blue">{mon.maMon}</Tag>
										</td>
										<td style={{ padding: '8px' }}>
											<Form form={editForm}>
												<Form.Item name="tenMon" style={{ marginBottom: 0 }}>
													<Input size="small" />
												</Form.Item>
											</Form>
										</td>
										<td style={{ padding: '8px' }}>
											<Form form={editForm}>
												<Form.Item name="soTinChi" style={{ marginBottom: 0 }}>
													<InputNumber size="small" min={1} max={10} style={{ width: 60 }} />
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
											<Button type="link" icon={<CheckOutlined />} onClick={() => handleSuaSubmit(mon.id)} />
											<Button type="link" icon={<CloseOutlined />} onClick={() => setEditingId(null)} />
										</td>
									</>
								) : (
									<>
										<td style={{ padding: '12px' }}>
											<Tag color="blue">{mon.maMon}</Tag>
										</td>
										<td style={{ padding: '12px', fontWeight: 500 }}>{mon.tenMon}</td>
										<td style={{ padding: '12px', textAlign: 'center' }}>
											<Tag color="green">{mon.soTinChi} TC</Tag>
										</td>
										<td style={{ padding: '12px', color: '#666' }}>{mon.moTa || '-'}</td>
										<td style={{ padding: '12px', textAlign: 'center' }}>
											<Tooltip title="Chỉnh sửa">
												<Button type="link" icon={<EditOutlined />} onClick={() => handleSua(mon)} />
											</Tooltip>
											<Tooltip title="Xóa">
												<Popconfirm
													title="Bạn có chắc chắn muốn xóa môn học này?"
													onConfirm={() => xoaMonHoc(mon.id)}
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

export default TabMonHoc;