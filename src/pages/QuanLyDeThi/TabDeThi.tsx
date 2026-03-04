import React, { useState } from 'react';
import {
	Button,
	Modal,
	Form,
	Input,
	Select,
	Card,
	Space,
	Tag,
	List,
	InputNumber,
	Alert,
	Descriptions,
	Divider,
	message as antdMessage,
} from 'antd';
import {
	PlusOutlined,
	FileTextOutlined,
	EyeOutlined,
	MinusCircleOutlined,
	CheckCircleOutlined,
	WarningOutlined,
} from '@ant-design/icons';
import {
	DeThi,
	CauTrucDeThi,
	MonHoc,
	KhoiKienThuc,
	CauHoi,
	YeuCauCauHoi,
	TRANG_THAI_DE_THI_CONFIG,
	MUC_DO_KHO_CONFIG,
} from './types';

interface TabDeThiProps {
	deThi: DeThi[];
	cauTrucDeThi: CauTrucDeThi[];
	monHoc: MonHoc[];
	khoiKienThuc: KhoiKienThuc[];
	cauHoi: CauHoi[];
	taoDeThi: (
		tenDeThi: string,
		monHocId: string,
		cacYeuCau: YeuCauCauHoi[],
		cauTrucDeThiId?: string,
	) => any;
	suaDeThi: (id: string, data: Partial<DeThi>) => void;
	xoaDeThi: (id: string) => void;
	layCauHoiTheoIds: (ids: string[]) => CauHoi[];
}

const TabDeThi: React.FC<TabDeThiProps> = ({
	deThi,
	cauTrucDeThi,
	monHoc,
	khoiKienThuc,
	cauHoi,
	taoDeThi,
	suaDeThi,
	xoaDeThi,
	layCauHoiTheoIds,
}) => {
	const [modalTaoVisible, setModalTaoVisible] = useState(false);
	const [modalXemVisible, setModalXemVisible] = useState(false);
	const [deThiDangXem, setDeThiDangXem] = useState<DeThi | null>(null);
	const [form] = Form.useForm();
	const [cheDo, setCheDo] = useState<'thu-cong' | 'tu-template'>('thu-cong');

	const handleTaoDeThi = async () => {
		try {
			const values = await form.validateFields();

			let cacYeuCau: YeuCauCauHoi[] = [];
			let cauTrucId: string | undefined = undefined;

			if (cheDo === 'tu-template') {
				// Lấy yêu cầu từ template
				const cauTruc = cauTrucDeThi.find((ct) => ct.id === values.cauTrucDeThiId);
				if (!cauTruc) {
					antdMessage.error('Không tìm thấy cấu trúc đề thi!');
					return;
				}
				cacYeuCau = cauTruc.cacYeuCau;
				cauTrucId = cauTruc.id;
			} else {
				// Lấy yêu cầu từ form
				cacYeuCau = values.cacYeuCau || [];
			}

			const ketQua = taoDeThi(values.tenDeThi, values.monHocId, cacYeuCau, cauTrucId);

			if (ketQua.thanhCong) {
				setModalTaoVisible(false);
				form.resetFields();
			} else {
				// Hiển thị lỗi
				Modal.error({
					title: 'Không thể tạo đề thi',
					content: (
						<div>
							{ketQua.loi?.map((loi: string, index: number) => (
								<div key={index} style={{ marginBottom: '8px' }}>
									• {loi}
								</div>
							))}
						</div>
					),
				});
			}
		} catch (error) {
			console.error('Validation failed:', error);
		}
	};

	const handleXemChiTiet = (deThi: DeThi) => {
		setDeThiDangXem(deThi);
		setModalXemVisible(true);
	};

	const layTenMonHoc = (monHocId: string) => {
		return monHoc.find((m) => m.id === monHocId)?.tenMon || 'N/A';
	};

	const layTenKhoiKienThuc = (khoiId: string) => {
		return khoiKienThuc.find((k) => k.id === khoiId)?.ten || 'N/A';
	};

	return (
		<div>
			<div style={{ marginBottom: 16 }}>
				<Button
					type="primary"
					icon={<PlusOutlined />}
					onClick={() => {
						form.resetFields();
						setCheDo('thu-cong');
						setModalTaoVisible(true);
					}}
				>
					Tạo đề thi mới
				</Button>
				<span style={{ marginLeft: 16, color: '#666' }}>Tổng số: {(deThi ?? []).length} đề thi</span>
			</div>

			{(deThi ?? []).length === 0 ? (
				<Card>
					<div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
						<FileTextOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
						<p>Chưa có đề thi nào. Tạo đề thi từ ngân hàng câu hỏi!</p>
					</div>
				</Card>
			) : (
				<List
					grid={{ gutter: 16, column: 2 }}
					dataSource={deThi}
					renderItem={(dt) => (
						<List.Item>
							<Card
								title={
									<Space>
										<FileTextOutlined />
										{dt.tenDeThi}
									</Space>
								}
								extra={
									<Tag color={TRANG_THAI_DE_THI_CONFIG[dt.trangThai].color}>
										{TRANG_THAI_DE_THI_CONFIG[dt.trangThai].label}
									</Tag>
								}
								actions={[
									<Button
										key="view"
										type="link"
										icon={<EyeOutlined />}
										onClick={() => handleXemChiTiet(dt)}
									>
										Xem chi tiết
									</Button>,
								]}
							>
								<Space direction="vertical" style={{ width: '100%' }}>
									<div>
										<strong>Mã đề:</strong> <Tag color="blue">{dt.maDeThi}</Tag>
									</div>
									<div>
										<strong>Môn học:</strong> {layTenMonHoc(dt.monHocId)}
									</div>
									<div>
										<strong>Số câu hỏi:</strong>{' '}
										<Tag color="green">{dt.cacCauHoi.length} câu</Tag>
									</div>
									<div>
										<strong>Tổng điểm:</strong> <Tag color="orange">{dt.tongDiem}</Tag>
									</div>
									{dt.thoiGianLamBai && (
										<div>
											<strong>Thời gian:</strong> {dt.thoiGianLamBai} phút
										</div>
									)}
									<div style={{ color: '#999', fontSize: '12px', marginTop: '8px' }}>
										Tạo lúc: {new Date(dt.ngayTao).toLocaleString('vi-VN')}
									</div>
								</Space>
							</Card>
						</List.Item>
					)}
				/>
			)}

			{/* Modal tạo đề thi */}
			<Modal
				title="Tạo đề thi mới"
				visible={modalTaoVisible}
				onOk={handleTaoDeThi}
				onCancel={() => {
					setModalTaoVisible(false);
					form.resetFields();
				}}
				okText="Tạo đề thi"
				cancelText="Hủy"
				width={700}
			>
				<Form form={form} layout="vertical">
					<Form.Item
						label="Tên đề thi"
						name="tenDeThi"
						rules={[{ required: true, message: 'Vui lòng nhập tên đề thi!' }]}
					>
						<Input placeholder="VD: Đề thi giữa kỳ môn Toán" />
					</Form.Item>

					<Form.Item
						label="Môn học"
						name="monHocId"
						rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}
					>
						<Select placeholder="Chọn môn học">
							{(monHoc ?? []).map((mon) => (
								<Select.Option key={mon.id} value={mon.id}>
									{mon.tenMon}
								</Select.Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item label="Chế độ tạo đề">
						<Select value={cheDo} onChange={setCheDo}>
							<Select.Option value="thu-cong">Nhập thủ công</Select.Option>
							<Select.Option value="tu-template">Dùng cấu trúc có sẵn</Select.Option>
						</Select>
					</Form.Item>

					{cheDo === 'tu-template' ? (
						<Form.Item
							label="Chọn cấu trúc đề thi"
							name="cauTrucDeThiId"
							rules={[{ required: true, message: 'Vui lòng chọn cấu trúc!' }]}
						>
							<Select placeholder="Chọn cấu trúc">
								{cauTrucDeThi.map((ct) => (
									<Select.Option key={ct.id} value={ct.id}>
										{ct.ten} ({layTenMonHoc(ct.monHocId)})
									</Select.Option>
								))}
							</Select>
						</Form.Item>
					) : (
						<Form.Item label="Yêu cầu câu hỏi" required>
							<Form.List name="cacYeuCau">
								{(fields, { add, remove }) => (
									<>
										{fields.map(({ key, name, ...restField }) => (
											<Card
												key={key}
												size="small"
												style={{ marginBottom: '8px' }}
												extra={
													<Button
														type="link"
														danger
														icon={<MinusCircleOutlined />}
														onClick={() => remove(name)}
													>
														Xóa
													</Button>
												}
											>
												<Space direction="vertical" style={{ width: '100%' }}>
													<Form.Item
														{...restField}
														name={[name, 'khoiKienThucId']}
														rules={[{ required: true }]}
														style={{ marginBottom: '8px' }}
													>
														<Select placeholder="Chọn khối kiến thức">
															{khoiKienThuc.map((khoi) => (
																<Select.Option key={khoi.id} value={khoi.id}>
																	{khoi.ten}
																</Select.Option>
															))}
														</Select>
													</Form.Item>

													<Space style={{ width: '100%' }}>
														<Form.Item
															{...restField}
															name={[name, 'mucDoKho']}
															rules={[{ required: true }]}
															style={{ marginBottom: 0, flex: 1 }}
														>
															<Select placeholder="Mức độ">
																{Object.entries(MUC_DO_KHO_CONFIG).map(
																	([key, config]) => (
																		<Select.Option key={key} value={key}>
																			{config.label}
																		</Select.Option>
																	),
																)}
															</Select>
														</Form.Item>

														<Form.Item
															{...restField}
															name={[name, 'soLuong']}
															rules={[{ required: true }]}
															style={{ marginBottom: 0 }}
														>
															<InputNumber
																min={1}
																placeholder="Số câu"
																style={{ width: '100px' }}
															/>
														</Form.Item>
													</Space>
												</Space>
											</Card>
										))}
										<Button
											type="dashed"
											onClick={() => add()}
											block
											icon={<PlusOutlined />}
										>
											Thêm yêu cầu
										</Button>
									</>
								)}
							</Form.List>
						</Form.Item>
					)}

					<Alert
						message="Lưu ý"
						description="Hệ thống sẽ tự động chọn ngẫu nhiên câu hỏi từ ngân hàng theo yêu cầu. Nếu không đủ câu hỏi, sẽ báo lỗi chi tiết."
						type="info"
						showIcon
						icon={<WarningOutlined />}
					/>
				</Form>
			</Modal>

			{/* Modal xem chi tiết đề thi */}
			<Modal
				title="Chi tiết đề thi"
				visible={modalXemVisible}
				onCancel={() => setModalXemVisible(false)}
				footer={[
					<Button key="close" onClick={() => setModalXemVisible(false)}>
						Đóng
					</Button>,
				]}
				width={900}
			>
				{deThiDangXem && (
					<div>
						<Descriptions bordered column={2}>
							<Descriptions.Item label="Mã đề">{deThiDangXem.maDeThi}</Descriptions.Item>
							<Descriptions.Item label="Tên đề">{deThiDangXem.tenDeThi}</Descriptions.Item>
							<Descriptions.Item label="Môn học">
								{layTenMonHoc(deThiDangXem.monHocId)}
							</Descriptions.Item>
							<Descriptions.Item label="Số câu hỏi">
								{deThiDangXem.cacCauHoi.length}
							</Descriptions.Item>
							<Descriptions.Item label="Tổng điểm">
								{deThiDangXem.tongDiem}
							</Descriptions.Item>
							<Descriptions.Item label="Trạng thái">
								<Tag color={TRANG_THAI_DE_THI_CONFIG[deThiDangXem.trangThai].color}>
									{TRANG_THAI_DE_THI_CONFIG[deThiDangXem.trangThai].label}
								</Tag>
							</Descriptions.Item>
						</Descriptions>

						<Divider orientation="left">Danh sách câu hỏi</Divider>

						{layCauHoiTheoIds(deThiDangXem.cacCauHoi).map((ch, index) => (
							<Card key={ch.id} size="small" style={{ marginBottom: '12px' }}>
								<Space direction="vertical" style={{ width: '100%' }}>
									<div>
										<strong>Câu {index + 1}:</strong>{' '}
										<Tag color="blue">{ch.maCauHoi}</Tag>
										<Tag color={MUC_DO_KHO_CONFIG[ch.mucDoKho].color}>
											{MUC_DO_KHO_CONFIG[ch.mucDoKho].label}
										</Tag>
										<Tag>{layTenKhoiKienThuc(ch.khoiKienThucId)}</Tag>
									</div>
									<div>{ch.noiDung}</div>
									{ch.dapAn && (
										<div style={{ color: '#52c41a', marginTop: '8px' }}>
											<CheckCircleOutlined /> <strong>Đáp án:</strong> {ch.dapAn}
										</div>
									)}
								</Space>
							</Card>
						))}
					</div>
				)}
			</Modal>
		</div>
	);
};

export default TabDeThi;