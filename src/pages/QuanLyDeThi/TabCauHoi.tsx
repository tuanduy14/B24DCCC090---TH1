import React, { useState } from 'react';
import { Button, Form, Input, Select, Popconfirm, Tooltip, Tag, Row, Col, Card, Statistic } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { CauHoi, CauHoiFilter, MonHoc, KhoiKienThuc, MUC_DO_KHO_CONFIG } from './types';

interface TabCauHoiProps {
	cauHoi: CauHoi[];
	monHoc: MonHoc[];
	khoiKienThuc: KhoiKienThuc[];
	themCauHoi: (data: Omit<CauHoi, 'id' | 'ngayTao'>) => boolean;
	suaCauHoi: (id: string, data: Partial<CauHoi>) => void;
	xoaCauHoi: (id: string) => void;
	timKiemCauHoi: (filter: CauHoiFilter) => CauHoi[];
	thongKeCauHoi: () => any;
}

const TabCauHoi: React.FC<TabCauHoiProps> = ({
	cauHoi = [],
	monHoc = [],
	khoiKienThuc = [],
	themCauHoi,
	suaCauHoi,
	xoaCauHoi,
	timKiemCauHoi,
	thongKeCauHoi,
}) => {
	const [showForm, setShowForm] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [form] = Form.useForm();
	const [editForm] = Form.useForm();
	const [filter, setFilter] = useState<CauHoiFilter>({});

	const thongKe = thongKeCauHoi();

	const danhSachHienThi = timKiemCauHoi(filter) || [];

	const handleThem = () => {
		const values = form.getFieldsValue();
		if (!values.maCauHoi || !values.monHocId || !values.khoiKienThucId || !values.mucDoKho || !values.noiDung) {
			alert('Vui lòng nhập đầy đủ các trường bắt buộc!');
			return;
		}
		const success = themCauHoi(values);
		if (success) {
			form.resetFields();
			setShowForm(false);
		}
	};

	const handleSua = (ch: CauHoi) => {
		setEditingId(ch.id);
		editForm.setFieldsValue(ch);
	};

	const handleSuaSubmit = (id: string) => {
		const values = editForm.getFieldsValue();
		suaCauHoi(id, values);
		setEditingId(null);
	};

	const layTenMonHoc = (monHocId: string) => monHoc.find((m) => m.id === monHocId)?.tenMon || 'N/A';
	const layTenKhoiKienThuc = (khoiId: string) => khoiKienThuc.find((k) => k.id === khoiId)?.ten || 'N/A';

	return (
		<div>
			{/* Thống kê */}
			<Row gutter={16} style={{ marginBottom: 16 }}>
				<Col span={6}><Card><Statistic title="Tổng số câu hỏi" value={thongKe.tongSo} /></Card></Col>
				<Col span={4}><Card><Statistic title="Dễ" value={thongKe.theoMucDo.de} valueStyle={{ color: MUC_DO_KHO_CONFIG.de.color }} /></Card></Col>
				<Col span={5}><Card><Statistic title="Trung bình" value={thongKe.theoMucDo.trungBinh} valueStyle={{ color: MUC_DO_KHO_CONFIG['trung-binh'].color }} /></Card></Col>
				<Col span={4}><Card><Statistic title="Khó" value={thongKe.theoMucDo.kho} valueStyle={{ color: MUC_DO_KHO_CONFIG.kho.color }} /></Card></Col>
				<Col span={5}><Card><Statistic title="Rất khó" value={thongKe.theoMucDo.ratKho} valueStyle={{ color: MUC_DO_KHO_CONFIG['rat-kho'].color }} /></Card></Col>
			</Row>

			{/* Filter */}
			<Card style={{ marginBottom: 16 }}>
				<Row gutter={16}>
					<Col span={6}>
						<Select placeholder="Lọc theo môn học" allowClear style={{ width: '100%' }}
							onChange={(value) => setFilter({ ...filter, monHocId: value })}>
							{monHoc.map((mon) => <Select.Option key={mon.id} value={mon.id}>{mon.tenMon}</Select.Option>)}
						</Select>
					</Col>
					<Col span={6}>
						<Select placeholder="Lọc theo khối kiến thức" allowClear style={{ width: '100%' }}
							onChange={(value) => setFilter({ ...filter, khoiKienThucId: value })}>
							{khoiKienThuc.map((khoi) => <Select.Option key={khoi.id} value={khoi.id}>{khoi.ten}</Select.Option>)}
						</Select>
					</Col>
					<Col span={6}>
						<Select placeholder="Lọc theo mức độ khó" allowClear style={{ width: '100%' }}
							onChange={(value) => setFilter({ ...filter, mucDoKho: value })}>
							{Object.entries(MUC_DO_KHO_CONFIG).map(([key, config]) => (
								<Select.Option key={key} value={key}>{config.label}</Select.Option>
							))}
						</Select>
					</Col>
					<Col span={6}>
						<Input placeholder="Tìm kiếm theo nội dung..." prefix={<SearchOutlined />} allowClear
							onChange={(e) => setFilter({ ...filter, tuKhoa: e.target.value })} />
					</Col>
				</Row>
			</Card>

			{/* Nút thêm */}
			<div style={{ marginBottom: 16 }}>
				{!showForm && (
					<Button type="primary" icon={<PlusOutlined />} onClick={() => setShowForm(true)}>
						Thêm câu hỏi
					</Button>
				)}
				<span style={{ marginLeft: 16, color: '#666' }}>
					Hiển thị {danhSachHienThi.length} / {cauHoi.length} câu hỏi
				</span>
			</div>

			{/* Form thêm mới inline */}
			{showForm && (
				<div style={{ background: '#f9f9f9', border: '1px solid #d9d9d9', borderRadius: 8, padding: 16, marginBottom: 16 }}>
					<h3 style={{ marginTop: 0 }}>Thêm câu hỏi mới</h3>
					<Form form={form} layout="vertical">
						<Row gutter={16}>
							<Col span={8}>
								<Form.Item label="Mã câu hỏi" name="maCauHoi" required>
									<Input placeholder="VD: CH001" />
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item label="Môn học" name="monHocId" required>
									<Select placeholder="Chọn môn học">
										{monHoc.map((mon) => <Select.Option key={mon.id} value={mon.id}>{mon.tenMon}</Select.Option>)}
									</Select>
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item label="Khối kiến thức" name="khoiKienThucId" required>
									<Select placeholder="Chọn khối kiến thức">
										{khoiKienThuc.map((khoi) => <Select.Option key={khoi.id} value={khoi.id}>{khoi.ten}</Select.Option>)}
									</Select>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col span={8}>
								<Form.Item label="Mức độ khó" name="mucDoKho" required>
									<Select placeholder="Chọn mức độ">
										{Object.entries(MUC_DO_KHO_CONFIG).map(([key, config]) => (
											<Select.Option key={key} value={key}>
												<Tag color={config.color}>{config.label}</Tag>
											</Select.Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item label="Điểm tối đa" name="diemToiDa">
									<Input type="number" placeholder="VD: 10" />
								</Form.Item>
							</Col>
						</Row>
						<Form.Item label="Nội dung câu hỏi" name="noiDung" required>
							<Input.TextArea rows={4} placeholder="Nhập nội dung câu hỏi..." />
						</Form.Item>
						<Form.Item label="Đáp án (không bắt buộc)" name="dapAn">
							<Input.TextArea rows={3} placeholder="Nhập đáp án hoặc hướng dẫn chấm điểm..." />
						</Form.Item>
						<div>
							<Button type="primary" icon={<CheckOutlined />} onClick={handleThem} style={{ marginRight: 8 }}>Lưu</Button>
							<Button icon={<CloseOutlined />} onClick={() => { setShowForm(false); form.resetFields(); }}>Hủy</Button>
						</div>
					</Form>
				</div>
			)}

			{/* Table */}
			<table style={{ width: '100%', borderCollapse: 'collapse' }}>
				<thead>
					<tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
						<th style={{ padding: '12px', textAlign: 'left', width: '10%' }}>Mã câu hỏi</th>
						<th style={{ padding: '12px', textAlign: 'left', width: '15%' }}>Môn học</th>
						<th style={{ padding: '12px', textAlign: 'left', width: '30%' }}>Nội dung</th>
						<th style={{ padding: '12px', textAlign: 'left', width: '15%' }}>Khối KT</th>
						<th style={{ padding: '12px', textAlign: 'center', width: '10%' }}>Mức độ</th>
						<th style={{ padding: '12px', textAlign: 'center', width: '10%' }}>Điểm</th>
						<th style={{ padding: '12px', textAlign: 'center', width: '10%' }}>Thao tác</th>
					</tr>
				</thead>
				<tbody>
					{danhSachHienThi.length === 0 ? (
						<tr>
							<td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: '#999' }}>
								{cauHoi.length === 0 ? 'Chưa có câu hỏi nào' : 'Không tìm thấy câu hỏi phù hợp'}
							</td>
						</tr>
					) : (
						danhSachHienThi.map((ch) => (
							editingId === ch.id ? (
								<tr key={ch.id} style={{ borderBottom: '1px solid #f0f0f0', background: '#fffbe6' }}>
									<td colSpan={7} style={{ padding: '12px' }}>
										<Form form={editForm} layout="inline">
											<Form.Item name="noiDung" label="Nội dung">
												<Input.TextArea rows={2} style={{ width: 300 }} />
											</Form.Item>
											<Form.Item name="mucDoKho" label="Mức độ">
												<Select style={{ width: 120 }}>
													{Object.entries(MUC_DO_KHO_CONFIG).map(([key, config]) => (
														<Select.Option key={key} value={key}>{config.label}</Select.Option>
													))}
												</Select>
											</Form.Item>
											<Form.Item name="diemToiDa" label="Điểm">
												<Input type="number" style={{ width: 80 }} />
											</Form.Item>
											<Form.Item>
												<Button type="link" icon={<CheckOutlined />} onClick={() => handleSuaSubmit(ch.id)} />
												<Button type="link" icon={<CloseOutlined />} onClick={() => setEditingId(null)} />
											</Form.Item>
										</Form>
									</td>
								</tr>
							) : (
								<tr key={ch.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
									<td style={{ padding: '12px' }}><Tag color="blue">{ch.maCauHoi}</Tag></td>
									<td style={{ padding: '12px' }}>{layTenMonHoc(ch.monHocId)}</td>
									<td style={{ padding: '12px' }}>{ch.noiDung.length > 80 ? `${ch.noiDung.substring(0, 80)}...` : ch.noiDung}</td>
									<td style={{ padding: '12px' }}>{layTenKhoiKienThuc(ch.khoiKienThucId)}</td>
									<td style={{ padding: '12px', textAlign: 'center' }}>
										<Tag color={MUC_DO_KHO_CONFIG[ch.mucDoKho].color}>{MUC_DO_KHO_CONFIG[ch.mucDoKho].label}</Tag>
									</td>
									<td style={{ padding: '12px', textAlign: 'center' }}>{ch.diemToiDa || '-'}</td>
									<td style={{ padding: '12px', textAlign: 'center' }}>
										<Tooltip title="Chỉnh sửa">
											<Button type="link" icon={<EditOutlined />} onClick={() => handleSua(ch)} />
										</Tooltip>
										<Tooltip title="Xóa">
											<Popconfirm title="Bạn có chắc chắn muốn xóa câu hỏi này?"
												onConfirm={() => xoaCauHoi(ch.id)} okText="Xóa" cancelText="Hủy">
												<Button type="link" danger icon={<DeleteOutlined />} />
											</Popconfirm>
										</Tooltip>
									</td>
								</tr>
							)
						))
					)}
				</tbody>
			</table>
		</div>
	);
};

export default TabCauHoi;