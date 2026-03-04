import React, { useState } from 'react';
import {
	Button, Form, Input, Select, Card, Space, Popconfirm, Tooltip, InputNumber, Tag, List,
} from 'antd';
import {
	PlusOutlined, EditOutlined, DeleteOutlined, FileTextOutlined,
	MinusCircleOutlined, CheckOutlined, CloseOutlined,
} from '@ant-design/icons';
import { CauTrucDeThi, MonHoc, KhoiKienThuc, YeuCauCauHoi, MUC_DO_KHO_CONFIG } from './types';

interface TabCauTrucDeThiProps {
	cauTrucDeThi: CauTrucDeThi[];
	monHoc: MonHoc[];
	khoiKienThuc: KhoiKienThuc[];
	themCauTrucDeThi: (data: Omit<CauTrucDeThi, 'id' | 'ngayTao'>) => boolean;
	suaCauTrucDeThi: (id: string, data: Partial<CauTrucDeThi>) => void;
	xoaCauTrucDeThi: (id: string) => void;
}

const TabCauTrucDeThi: React.FC<TabCauTrucDeThiProps> = ({
	cauTrucDeThi = [],
	monHoc = [],
	khoiKienThuc = [],
	themCauTrucDeThi,
	suaCauTrucDeThi,
	xoaCauTrucDeThi,
}) => {
	const [showForm, setShowForm] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [form] = Form.useForm();
	const [editForm] = Form.useForm();

	const handleThem = () => {
		const values = form.getFieldsValue();
		if (!values.ten || !values.monHocId) {
			alert('Vui lòng nhập tên và chọn môn học!');
			return;
		}
		if (!values.cacYeuCau || values.cacYeuCau.length === 0) {
			alert('Vui lòng thêm ít nhất một yêu cầu câu hỏi!');
			return;
		}
		const success = themCauTrucDeThi(values);
		if (success) {
			form.resetFields();
			setShowForm(false);
		}
	};

	const handleSua = (cauTruc: CauTrucDeThi) => {
		setEditingId(cauTruc.id);
		editForm.setFieldsValue(cauTruc);
	};

	const handleSuaSubmit = (id: string) => {
		const values = editForm.getFieldsValue();
		suaCauTrucDeThi(id, values);
		setEditingId(null);
	};

	const layTenMonHoc = (monHocId: string) => monHoc.find((m) => m.id === monHocId)?.tenMon || 'N/A';
	const layTenKhoiKienThuc = (khoiId: string) => khoiKienThuc.find((k) => k.id === khoiId)?.ten || 'N/A';
	const tinhTongCauHoi = (cacYeuCau: YeuCauCauHoi[]) => cacYeuCau.reduce((total, yc) => total + yc.soLuong, 0);

	const renderYeuCauForm = (formInstance: any) => (
		<Form.List name="cacYeuCau">
			{(fields, { add, remove }) => (
				<>
					{fields.map(({ key, name, ...restField }) => (
						<Card key={key} size="small" style={{ marginBottom: 8 }}
							extra={
								<Button type="link" danger icon={<MinusCircleOutlined />} onClick={() => remove(name)}>Xóa</Button>
							}
						>
							<Space direction="vertical" style={{ width: '100%' }}>
								<Form.Item {...restField} name={[name, 'khoiKienThucId']} style={{ marginBottom: 8 }}>
									<Select placeholder="Chọn khối kiến thức">
										{khoiKienThuc.map((khoi) => (
											<Select.Option key={khoi.id} value={khoi.id}>{khoi.ten}</Select.Option>
										))}
									</Select>
								</Form.Item>
								<Space>
									<Form.Item {...restField} name={[name, 'mucDoKho']} style={{ marginBottom: 0 }}>
										<Select placeholder="Mức độ khó" style={{ width: 150 }}>
											{Object.entries(MUC_DO_KHO_CONFIG).map(([key, config]) => (
												<Select.Option key={key} value={key}>{config.label}</Select.Option>
											))}
										</Select>
									</Form.Item>
									<Form.Item {...restField} name={[name, 'soLuong']} style={{ marginBottom: 0 }}>
										<InputNumber min={1} placeholder="Số câu" style={{ width: 100 }} />
									</Form.Item>
								</Space>
							</Space>
						</Card>
					))}
					<Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
						Thêm yêu cầu
					</Button>
				</>
			)}
		</Form.List>
	);

	return (
		<div>
			{/* Nút thêm */}
			{!showForm && (
				<div style={{ marginBottom: 16 }}>
					<Button type="primary" icon={<PlusOutlined />} onClick={() => setShowForm(true)}>
						Tạo cấu trúc đề thi mới
					</Button>
				</div>
			)}

			{/* Form thêm mới inline */}
			{showForm && (
				<div style={{ background: '#f9f9f9', border: '1px solid #d9d9d9', borderRadius: 8, padding: 16, marginBottom: 16 }}>
					<h3 style={{ marginTop: 0 }}>Tạo cấu trúc đề thi mới</h3>
					<Form form={form} layout="vertical">
						<Form.Item label="Tên cấu trúc" name="ten" required>
							<Input placeholder="VD: Đề kiểm tra giữa kỳ" style={{ maxWidth: 400 }} />
						</Form.Item>
						<Form.Item label="Môn học" name="monHocId" required>
							<Select placeholder="Chọn môn học" style={{ maxWidth: 300 }}>
								{monHoc.map((mon) => (
									<Select.Option key={mon.id} value={mon.id}>{mon.tenMon}</Select.Option>
								))}
							</Select>
						</Form.Item>
						<Form.Item label="Mô tả" name="moTa">
							<Input.TextArea rows={2} placeholder="Mô tả (không bắt buộc)" style={{ maxWidth: 500 }} />
						</Form.Item>
						<Form.Item label="Cấu trúc câu hỏi">
							{renderYeuCauForm(form)}
						</Form.Item>
						<div>
							<Button type="primary" icon={<CheckOutlined />} onClick={handleThem} style={{ marginRight: 8 }}>Lưu</Button>
							<Button icon={<CloseOutlined />} onClick={() => { setShowForm(false); form.resetFields(); }}>Hủy</Button>
						</div>
					</Form>
				</div>
			)}

			{/* Form sửa inline */}
			{editingId && (
				<div style={{ background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 8, padding: 16, marginBottom: 16 }}>
					<h3 style={{ marginTop: 0 }}>Chỉnh sửa cấu trúc đề thi</h3>
					<Form form={editForm} layout="vertical">
						<Form.Item label="Tên cấu trúc" name="ten" required>
							<Input style={{ maxWidth: 400 }} />
						</Form.Item>
						<Form.Item label="Môn học" name="monHocId" required>
							<Select style={{ maxWidth: 300 }}>
								{monHoc.map((mon) => (
									<Select.Option key={mon.id} value={mon.id}>{mon.tenMon}</Select.Option>
								))}
							</Select>
						</Form.Item>
						<Form.Item label="Mô tả" name="moTa">
							<Input.TextArea rows={2} style={{ maxWidth: 500 }} />
						</Form.Item>
						<Form.Item label="Cấu trúc câu hỏi">
							{renderYeuCauForm(editForm)}
						</Form.Item>
						<div>
							<Button type="primary" icon={<CheckOutlined />} onClick={() => handleSuaSubmit(editingId)} style={{ marginRight: 8 }}>Lưu</Button>
							<Button icon={<CloseOutlined />} onClick={() => setEditingId(null)}>Hủy</Button>
						</div>
					</Form>
				</div>
			)}

			{/* Danh sách */}
			{cauTrucDeThi.length === 0 ? (
				<Card>
					<div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
						<FileTextOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
						<p>Chưa có cấu trúc đề thi nào. Tạo template để dùng lại nhiều lần!</p>
					</div>
				</Card>
			) : (
				<List
					grid={{ gutter: 16, column: 2 }}
					dataSource={cauTrucDeThi}
					renderItem={(cauTruc) => (
						<List.Item>
							<Card
								title={<Space><FileTextOutlined />{cauTruc.ten}</Space>}
								extra={
									<Space>
										<Tooltip title="Chỉnh sửa">
											<Button type="link" icon={<EditOutlined />} onClick={() => handleSua(cauTruc)} />
										</Tooltip>
										<Tooltip title="Xóa">
											<Popconfirm title="Bạn có chắc chắn muốn xóa cấu trúc này?"
												onConfirm={() => xoaCauTrucDeThi(cauTruc.id)} okText="Xóa" cancelText="Hủy">
												<Button type="link" danger icon={<DeleteOutlined />} />
											</Popconfirm>
										</Tooltip>
									</Space>
								}
							>
								<Space direction="vertical" style={{ width: '100%' }}>
									<div><strong>Môn học:</strong> {layTenMonHoc(cauTruc.monHocId)}</div>
									{cauTruc.moTa && <div style={{ color: '#666' }}>{cauTruc.moTa}</div>}
									<div><strong>Tổng câu hỏi:</strong> <Tag color="blue">{tinhTongCauHoi(cauTruc.cacYeuCau)} câu</Tag></div>
									<div style={{ marginTop: 8 }}>
										<strong>Cấu trúc:</strong>
										<ul style={{ marginTop: 8, paddingLeft: 20 }}>
											{cauTruc.cacYeuCau.map((yc, index) => (
												<li key={index} style={{ marginBottom: 4 }}>
													<Tag color={MUC_DO_KHO_CONFIG[yc.mucDoKho].color}>{MUC_DO_KHO_CONFIG[yc.mucDoKho].label}</Tag>
													{' - '}{layTenKhoiKienThuc(yc.khoiKienThucId)}{' - '}
													<strong>{yc.soLuong} câu</strong>
												</li>
											))}
										</ul>
									</div>
									<div style={{ color: '#999', fontSize: 12, marginTop: 8 }}>
										Tạo lúc: {new Date(cauTruc.ngayTao).toLocaleString('vi-VN')}
									</div>
								</Space>
							</Card>
						</List.Item>
					)}
				/>
			)}
		</div>
	);
};

export default TabCauTrucDeThi;