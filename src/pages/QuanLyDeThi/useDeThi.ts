import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import { CauTrucDeThi, DeThi, CauHoi, YeuCauCauHoi, KetQuaTaoDeThi } from './types';

const STORAGE_KEY_CAU_TRUC = 'cauTrucDeThi';
const STORAGE_KEY_DE_THI = 'deThi';

interface UseDeThiProps {
	cauHoi: CauHoi[];
}

export default ({ cauHoi }: UseDeThiProps) => {
	const [cauTrucDeThi, setCauTrucDeThi] = useState<CauTrucDeThi[]>([]);
	const [deThi, setDeThi] = useState<DeThi[]>([]);

	// Load từ localStorage
	useEffect(() => {
		const savedCauTruc = localStorage.getItem(STORAGE_KEY_CAU_TRUC);
		const savedDeThi = localStorage.getItem(STORAGE_KEY_DE_THI);

		if (savedCauTruc) {
			try {
				setCauTrucDeThi(JSON.parse(savedCauTruc));
			} catch (error) {
				console.error('Lỗi load cấu trúc đề thi:', error);
			}
		}

		if (savedDeThi) {
			try {
				setDeThi(JSON.parse(savedDeThi));
			} catch (error) {
				console.error('Lỗi load đề thi:', error);
			}
		}
	}, []);

	// Auto save
	useEffect(() => {
		localStorage.setItem(STORAGE_KEY_CAU_TRUC, JSON.stringify(cauTrucDeThi));
	}, [cauTrucDeThi]);

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY_DE_THI, JSON.stringify(deThi));
	}, [deThi]);

	// ===== CẤU TRÚC ĐỀ THI =====
	const themCauTrucDeThi = useCallback((data: Omit<CauTrucDeThi, 'id' | 'ngayTao'>) => {
		const cauTrucMoi: CauTrucDeThi = {
			...data,
			id: Date.now().toString(),
			ngayTao: new Date().toISOString(),
		};

		setCauTrucDeThi((prev) => [...prev, cauTrucMoi]);
		message.success('Đã lưu cấu trúc đề thi');
		return true;
	}, []);

	const suaCauTrucDeThi = useCallback((id: string, data: Partial<CauTrucDeThi>) => {
		setCauTrucDeThi((prev) => prev.map((ct) => (ct.id === id ? { ...ct, ...data } : ct)));
		message.success('Đã cập nhật cấu trúc đề thi');
	}, []);

	const xoaCauTrucDeThi = useCallback((id: string) => {
		setCauTrucDeThi((prev) => prev.filter((ct) => ct.id !== id));
		message.success('Đã xóa cấu trúc đề thi');
	}, []);

	// ===== TẠO ĐỀ THI =====
	const taoDeThi = useCallback(
		(
			tenDeThi: string,
			monHocId: string,
			cacYeuCau: YeuCauCauHoi[],
			cauTrucDeThiId?: string,
		): KetQuaTaoDeThi => {
			const loi: string[] = [];
			const cauHoiDaChon: string[] = [];

			// Lọc câu hỏi theo môn học
			const cauHoiMonHoc = cauHoi.filter((ch) => ch.monHocId === monHocId);

			// Duyệt qua từng yêu cầu
			for (const yeuCau of cacYeuCau) {
				// Lọc câu hỏi phù hợp
				const cauHoiPhuHop = cauHoiMonHoc.filter(
					(ch) =>
						ch.khoiKienThucId === yeuCau.khoiKienThucId &&
						ch.mucDoKho === yeuCau.mucDoKho &&
						!cauHoiDaChon.includes(ch.id), // Chưa được chọn
				);

				// Kiểm tra đủ số lượng không
				if (cauHoiPhuHop.length < yeuCau.soLuong) {
					loi.push(
						`Không đủ câu hỏi cho khối kiến thức ID: ${yeuCau.khoiKienThucId}, ` +
							`mức độ: ${yeuCau.mucDoKho}. ` +
							`Cần ${yeuCau.soLuong} câu, chỉ có ${cauHoiPhuHop.length} câu.`,
					);
					continue;
				}

				// Chọn ngẫu nhiên câu hỏi
				const cauHoiDuocChon = cauHoiPhuHop
					.sort(() => Math.random() - 0.5) // Shuffle
					.slice(0, yeuCau.soLuong);

				cauHoiDaChon.push(...cauHoiDuocChon.map((ch) => ch.id));
			}

			// Nếu có lỗi
			if (loi.length > 0) {
				return {
					thanhCong: false,
					loi,
				};
			}

			// Tạo đề thi
			const deThiMoi: DeThi = {
				id: Date.now().toString(),
				maDeThi: `DT${Date.now()}`,
				tenDeThi,
				monHocId,
				cauTrucDeThiId,
				cacCauHoi: cauHoiDaChon,
				tongDiem: cauHoiDaChon.length * 10, // Giả sử mỗi câu 10 điểm
				ngayTao: new Date().toISOString(),
				trangThai: 'nhap',
			};

			setDeThi((prev) => [...prev, deThiMoi]);
			message.success('Đã tạo đề thi thành công!');

			return {
				thanhCong: true,
				deThi: deThiMoi,
				thongBao: `Đã tạo đề thi với ${cauHoiDaChon.length} câu hỏi`,
			};
		},
		[cauHoi],
	);

	// Sửa đề thi
	const suaDeThi = useCallback((id: string, data: Partial<DeThi>) => {
		setDeThi((prev) => prev.map((dt) => (dt.id === id ? { ...dt, ...data } : dt)));
		message.success('Đã cập nhật đề thi');
	}, []);

	// Xóa đề thi
	const xoaDeThi = useCallback((id: string) => {
		setDeThi((prev) => prev.filter((dt) => dt.id !== id));
		message.success('Đã xóa đề thi');
	}, []);

	// Lấy đề thi
	const layDeThi = useCallback(
		(id: string) => {
			return deThi.find((dt) => dt.id === id);
		},
		[deThi],
	);

	// Lấy cấu trúc đề thi
	const layCauTrucDeThi = useCallback(
		(id: string) => {
			return cauTrucDeThi.find((ct) => ct.id === id);
		},
		[cauTrucDeThi],
	);

	return {
		// State
		cauTrucDeThi,
		deThi,

		// Cấu trúc đề thi actions
		themCauTrucDeThi,
		suaCauTrucDeThi,
		xoaCauTrucDeThi,
		layCauTrucDeThi,

		// Đề thi actions
		taoDeThi,
		suaDeThi,
		xoaDeThi,
		layDeThi,
	};
};