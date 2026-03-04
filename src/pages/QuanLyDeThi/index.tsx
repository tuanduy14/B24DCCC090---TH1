// src/pages/QuanLyDeThi/index.tsx
import React, { useState } from 'react';
import { Layout, Menu, Typography } from 'antd';
import { useModel } from 'umi';
import {
	BookOutlined,
	FileTextOutlined,
	QuestionCircleOutlined,
	ProfileOutlined,
	FolderOpenOutlined,
} from '@ant-design/icons';
import useCauHoi from './useCauHoi';
import useDeThi from './useDeThi';

import TabKhoiKienThuc from './TabKhoiKienThuc';
import TabMonHoc from './TabMonHoc';
import TabCauHoi from './TabCauHoi';
import TabCauTrucDeThi from './TabCauTrucDeThi';
import TabDeThi from './TabDeThi';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

type TabKey = 'khoi' | 'mon' | 'cau-hoi' | 'cau-truc' | 'de-thi';

const QuanLyDeThi: React.FC = () => {
	const [tabHienTai, setTabHienTai] = useState<TabKey>('khoi');

	// Dùng useModel thay vì useDanhMuc hook
	const danhMuc = useModel('danhMuc');
	const cauHoiHook = useCauHoi();
	const deThiHook = useDeThi({ cauHoi: cauHoiHook.cauHoi });

	const menuItems = [
		{ key: 'khoi', icon: <FolderOpenOutlined />, label: 'Khối kiến thức' },
		{ key: 'mon', icon: <BookOutlined />, label: 'Môn học' },
		{ key: 'cau-hoi', icon: <QuestionCircleOutlined />, label: 'Câu hỏi' },
		{ key: 'cau-truc', icon: <ProfileOutlined />, label: 'Cấu trúc đề thi' },
		{ key: 'de-thi', icon: <FileTextOutlined />, label: 'Đề thi' },
	];

	const renderContent = () => {
		switch (tabHienTai) {
			case 'khoi':
				return <TabKhoiKienThuc
					khoiKienThuc={danhMuc.khoiKienThuc}
					themKhoiKienThuc={danhMuc.themKhoiKienThuc}
					suaKhoiKienThuc={danhMuc.suaKhoiKienThuc}
					xoaKhoiKienThuc={danhMuc.xoaKhoiKienThuc}
				/>;
			case 'mon':
				return <TabMonHoc
					monHoc={danhMuc.monHoc}
					themMonHoc={danhMuc.themMonHoc}
					suaMonHoc={danhMuc.suaMonHoc}
					xoaMonHoc={danhMuc.xoaMonHoc}
				/>;
			case 'cau-hoi':
				return (
					<TabCauHoi
						{...cauHoiHook}
						monHoc={danhMuc.monHoc}
						khoiKienThuc={danhMuc.khoiKienThuc}
					/>
				);
			case 'cau-truc':
				return (
					<TabCauTrucDeThi
						{...deThiHook}
						monHoc={danhMuc.monHoc}
						khoiKienThuc={danhMuc.khoiKienThuc}
					/>
				);
			case 'de-thi':
				return (
					<TabDeThi
						{...deThiHook}
						{...cauHoiHook}
						monHoc={danhMuc.monHoc}
						khoiKienThuc={danhMuc.khoiKienThuc}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Header style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0' }}>
				<Title level={3} style={{ margin: '16px 0' }}>
					📚 Hệ thống Quản lý Đề thi
				</Title>
			</Header>
			<Layout>
				<Sider width={250} style={{ background: '#fff' }}>
					<Menu
						mode="inline"
						selectedKeys={[tabHienTai]}
						items={menuItems}
						style={{ height: '100%', borderRight: 0 }}
						onClick={({ key }) => setTabHienTai(key as TabKey)}
					/>
				</Sider>
				<Layout style={{ padding: '24px' }}>
					<Content
						style={{
							background: '#fff',
							padding: 24,
							margin: 0,
							minHeight: 280,
							borderRadius: '8px',
						}}
					>
						{renderContent()}
					</Content>
				</Layout>
			</Layout>
		</Layout>
	);
};

export default QuanLyDeThi;