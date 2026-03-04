import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import { CauHoi, CauHoiFilter } from './types';

const STORAGE_KEY = 'cauHoi';

export default () => {
	const [cauHoi, setCauHoi] = useState<CauHoi[]>([]);

	// Load từ localStorage
	useEffect(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) {
			try {
				setCauHoi(JSON.parse(saved));
			} catch (error) {
				console.error('Lỗi load câu hỏi:', error);
			}
		}
	}, []);

	// Auto save
	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(cauHoi));
	}, [cauHoi]);

	// Thêm câu hỏi
	const themCauHoi = useCallback(
		(data: Omit<CauHoi, 'id' | 'ngayTao'>) => {
			// Kiểm tra trùng mã
			if (cauHoi.some((c) => c.maCauHoi === data.maCauHoi)) {
				message.error('Mã câu hỏi đã tồn tại!');
				return false;
			}

			const cauHoiMoi: CauHoi = {
				...data,
				id: Date.now().toString(),
				ngayTao: new Date().toISOString(),
			};

			setCauHoi((prev) => [...prev, cauHoiMoi]);
			message.success('Đã thêm câu hỏi');
			return true;
		},
		[cauHoi],
	);

	// Sửa câu hỏi
	const suaCauHoi = useCallback((id: string, data: Partial<CauHoi>) => {
		setCauHoi((prev) => prev.map((ch) => (ch.id === id ? { ...ch, ...data } : ch)));
		message.success('Đã cập nhật câu hỏi');
	}, []);

	// Xóa câu hỏi
	const xoaCauHoi = useCallback((id: string) => {
		setCauHoi((prev) => prev.filter((ch) => ch.id !== id));
		message.success('Đã xóa câu hỏi');
	}, []);

	// Tìm kiếm câu hỏi
	const timKiemCauHoi = useCallback(
		(filter: CauHoiFilter) => {
			let result = [...cauHoi];

			if (filter.monHocId) {
				result = result.filter((ch) => ch.monHocId === filter.monHocId);
			}

			if (filter.khoiKienThucId) {
				result = result.filter((ch) => ch.khoiKienThucId === filter.khoiKienThucId);
			}

			if (filter.mucDoKho) {
				result = result.filter((ch) => ch.mucDoKho === filter.mucDoKho);
			}

			if (filter.tuKhoa) {
				const keyword = filter.tuKhoa.toLowerCase();
				result = result.filter(
					(ch) =>
						ch.noiDung.toLowerCase().includes(keyword) ||
						ch.maCauHoi.toLowerCase().includes(keyword),
				);
			}

			return result;
		},
		[cauHoi],
	);

	// Lấy câu hỏi theo ID
	const layCauHoi = useCallback(
		(id: string) => {
			return cauHoi.find((ch) => ch.id === id);
		},
		[cauHoi],
	);

	// Lấy nhiều câu hỏi theo IDs
	const layCauHoiTheoIds = useCallback(
		(ids: string[]) => {
			return cauHoi.filter((ch) => ids.includes(ch.id));
		},
		[cauHoi],
	);

	// Thống kê
	const thongKeCauHoi = useCallback(() => {
		return {
			tongSo: cauHoi.length,
			theoMucDo: {
				de: cauHoi.filter((ch) => ch.mucDoKho === 'de').length,
				trungBinh: cauHoi.filter((ch) => ch.mucDoKho === 'trung-binh').length,
				kho: cauHoi.filter((ch) => ch.mucDoKho === 'kho').length,
				ratKho: cauHoi.filter((ch) => ch.mucDoKho === 'rat-kho').length,
			},
		};
	}, [cauHoi]);

	return {
		// State
		cauHoi,

		// Actions
		themCauHoi,
		suaCauHoi,
		xoaCauHoi,
		timKiemCauHoi,
		layCauHoi,
		layCauHoiTheoIds,
		thongKeCauHoi,
	};
};