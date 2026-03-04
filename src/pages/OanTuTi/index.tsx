import React from 'react';
import { Card, Button, Space, Typography, Tag, List, Statistic, Row, Col, Empty } from 'antd';
import {
	TrophyOutlined,
	CloseCircleOutlined,
	MinusCircleOutlined,
	DeleteOutlined,
	ReloadOutlined,
} from '@ant-design/icons';
import useOanTuTi, { LuaChon, KetQua } from './useOanTuTi';

const { Title, Text } = Typography;

// Icon và tên cho mỗi lựa chọn
const LUA_CHON_CONFIG: Record<LuaChon, { icon: string; ten: string; mau: string }> = {
	keo: { icon: '✌️', ten: 'Kéo', mau: '#1890ff' },
	bua: { icon: '✊', ten: 'Búa', mau: '#722ed1' },
	bao: { icon: '✋', ten: 'Bao', mau: '#52c41a' },
};

// Màu sắc theo kết quả
const KET_QUA_CONFIG = {
	thang: { mau: '#52c41a', icon: <TrophyOutlined />, text: 'Bạn Thắng!' },
	thua: { mau: '#ff4d4f', icon: <CloseCircleOutlined />, text: 'Bạn Thua!' },
	hoa: { mau: '#faad14', icon: <MinusCircleOutlined />, text: 'Hòa!' },
};

const OanTuTi: React.FC = () => {
	const {
		lichSu,
		luaChonNguoiChoi,
		luaChonMayTinh,
		ketQua,
		dangChoi,
		thongKe,
		choi,
		choiLai,
		xoaLichSu,
	} = useOanTuTi();

	const renderLuaChonButton = (luaChon: LuaChon) => {
		const config = LUA_CHON_CONFIG[luaChon];
		return (
			<Button
				size="large"
				style={{
					height: '120px',
					width: '120px',
					fontSize: '48px',
					borderColor: config.mau,
					borderWidth: '2px',
				}}
				onClick={() => choi(luaChon)}
				disabled={dangChoi || ketQua !== null}
			>
				<div>
					<div>{config.icon}</div>
					<div style={{ fontSize: '14px', marginTop: '8px' }}>{config.ten}</div>
				</div>
			</Button>
		);
	};

	const renderKetQua = () => {
		if (!ketQua || !luaChonNguoiChoi || !luaChonMayTinh) return null;

		const ketQuaConfig = KET_QUA_CONFIG[ketQua];

		return (
			<Card
				style={{
					marginTop: '24px',
					background: `${ketQuaConfig.mau}15`,
					borderColor: ketQuaConfig.mau,
				}}
			>
				<Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
					<Title level={3} style={{ margin: 0, color: ketQuaConfig.mau }}>
						{ketQuaConfig.icon} {ketQuaConfig.text}
					</Title>

					<Row gutter={16} justify="center">
						<Col>
							<Card>
								<Space direction="vertical" align="center">
									<Text strong>Bạn chọn</Text>
									<div style={{ fontSize: '64px' }}>
										{LUA_CHON_CONFIG[luaChonNguoiChoi].icon}
									</div>
									<Text>{LUA_CHON_CONFIG[luaChonNguoiChoi].ten}</Text>
								</Space>
							</Card>
						</Col>

						<Col>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									height: '100%',
									fontSize: '32px',
								}}
							>
								VS
							</div>
						</Col>

						<Col>
							<Card>
								<Space direction="vertical" align="center">
									<Text strong>Máy chọn</Text>
									<div style={{ fontSize: '64px' }}>
										{LUA_CHON_CONFIG[luaChonMayTinh].icon}
									</div>
									<Text>{LUA_CHON_CONFIG[luaChonMayTinh].ten}</Text>
								</Space>
							</Card>
						</Col>
					</Row>

					<Button type="primary" size="large" icon={<ReloadOutlined />} onClick={choiLai}>
						Chơi lại
					</Button>
				</Space>
			</Card>
		);
	};

	return (
		<div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
			<Row gutter={24}>
				{/* Cột trái - Game */}
				<Col xs={24} lg={14}>
					<Card>
						<Title level={2} style={{ textAlign: 'center' }}>
							🎮 Oẳn Tù Tì
						</Title>

						<div style={{ textAlign: 'center', marginBottom: '24px' }}>
							<Text type="secondary">Chọn Kéo, Búa, hoặc Bao để chơi với máy tính!</Text>
						</div>

						{/* Nút chọn */}
						<Space
							size="large"
							style={{ width: '100%', justifyContent: 'center', marginBottom: '24px' }}
						>
							{renderLuaChonButton('keo')}
							{renderLuaChonButton('bua')}
							{renderLuaChonButton('bao')}
						</Space>

						{/* Hiển thị đang chơi */}
						{dangChoi && (
							<div style={{ textAlign: 'center', fontSize: '24px', marginTop: '24px' }}>
								⏳ Đang xử lý...
							</div>
						)}

						{/* Hiển thị kết quả */}
						{renderKetQua()}

						{/* Thống kê */}
						<Card style={{ marginTop: '24px' }} title="📊 Thống kê">
							<Row gutter={16}>
								<Col span={8}>
									<Statistic
										title="Tổng ván"
										value={thongKe.tongVan}
										valueStyle={{ color: '#1890ff' }}
									/>
								</Col>
								<Col span={8}>
									<Statistic
										title="Thắng"
										value={thongKe.thang}
										valueStyle={{ color: '#52c41a' }}
										prefix={<TrophyOutlined />}
									/>
								</Col>
								<Col span={8}>
									<Statistic
										title="Tỷ lệ thắng"
										value={thongKe.tiLeThang}
										suffix="%"
										valueStyle={{ color: '#722ed1' }}
									/>
								</Col>
							</Row>
							<Row gutter={16} style={{ marginTop: '16px' }}>
								<Col span={12}>
									<Statistic
										title="Thua"
										value={thongKe.thua}
										valueStyle={{ color: '#ff4d4f' }}
									/>
								</Col>
								<Col span={12}>
									<Statistic
										title="Hòa"
										value={thongKe.hoa}
										valueStyle={{ color: '#faad14' }}
									/>
								</Col>
							</Row>
						</Card>
					</Card>
				</Col>

				{/* Cột phải - Lịch sử */}
				<Col xs={24} lg={10}>
					<Card
						title="📜 Lịch sử"
						extra={
							lichSu.length > 0 && (
								<Button
									danger
									size="small"
									icon={<DeleteOutlined />}
									onClick={xoaLichSu}
								>
									Xóa
								</Button>
							)
						}
						style={{ height: '100%' }}
					>
						{lichSu.length === 0 ? (
							<Empty description="Chưa có ván nào" />
						) : (
							<List
								dataSource={lichSu}
								style={{ maxHeight: '600px', overflow: 'auto' }}
								renderItem={(van: any, index) => {
									const ketQuaConfig = KET_QUA_CONFIG[van.ketQua as KetQua];
									return (
										<List.Item
											style={{
												background: index === 0 ? '#f0f0f0' : 'transparent',
												padding: '12px',
												borderRadius: '8px',
												marginBottom: '8px',
											}}
										>
											<Space direction="vertical" style={{ width: '100%' }}>
												<Space>
													<Tag color={ketQuaConfig.mau}>
														{ketQuaConfig.icon} {ketQuaConfig.text}
													</Tag>
													{index === 0 && <Tag color="blue">Mới nhất</Tag>}
												</Space>
												<Space size="large">
													<Text>
														Bạn: {LUA_CHON_CONFIG[van.nguoiChoi].icon}{' '}
														{LUA_CHON_CONFIG[van.nguoiChoi].ten}
													</Text>
													<Text type="secondary">vs</Text>
													<Text>
														Máy: {LUA_CHON_CONFIG[van.mayTinh].icon}{' '}
														{LUA_CHON_CONFIG[van.mayTinh].ten}
													</Text>
												</Space>
												<Text type="secondary" style={{ fontSize: '12px' }}>
													{new Date(van.thoiGian).toLocaleString('vi-VN')}
												</Text>
											</Space>
										</List.Item>
									);
								}}
							/>
						)}
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default OanTuTi;