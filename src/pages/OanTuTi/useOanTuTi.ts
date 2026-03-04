import { useState, useCallback } from 'react';

export type LuaChon = 'keo' | 'bua' | 'bao';
export type KetQua = 'thang' | 'thua' | 'hoa';

export interface LichSuVan {
	id: string;
	nguoiChoi: LuaChon;
	mayTinh: LuaChon;
	ketQua: KetQua;
	thoiGian: string;
}

export interface ThongKe {
	tongVan: number;
	thang: number;
	thua: number;
	hoa: number;
	tiLeThang: number;
}

const LAY_LUA_CHON_NGAU_NHIEN = (): LuaChon => {
	const cacLuaChon: LuaChon[] = ['keo', 'bua', 'bao'];
	const index = Math.floor(Math.random() * 3);
	return cacLuaChon[index];
};

const KIEM_TRA_KET_QUA = (nguoiChoi: LuaChon, mayTinh: LuaChon): KetQua => {
	if (nguoiChoi === mayTinh) return 'hoa';

	if (
		(nguoiChoi === 'keo' && mayTinh === 'bao') ||
		(nguoiChoi === 'bua' && mayTinh === 'keo') ||
		(nguoiChoi === 'bao' && mayTinh === 'bua')
	) {
		return 'thang';
	}

	return 'thua';
};

export default () => {
	const [lichSu, setLichSu] = useState<LichSuVan[]>([]);
	const [luaChonNguoiChoi, setLuaChonNguoiChoi] = useState<LuaChon | null>(null);
	const [luaChonMayTinh, setLuaChonMayTinh] = useState<LuaChon | null>(null);
	const [ketQua, setKetQua] = useState<KetQua | null>(null);
	const [dangChoi, setDangChoi] = useState<boolean>(false);

	// Chơi một ván
	const choi = useCallback(
		(luaChon: LuaChon) => {
			setDangChoi(true);
			setLuaChonNguoiChoi(luaChon);

			// Delay để tạo hiệu ứng
			setTimeout(() => {
				const luaChonMay = LAY_LUA_CHON_NGAU_NHIEN();
				setLuaChonMayTinh(luaChonMay);

				const ketQuaVan = KIEM_TRA_KET_QUA(luaChon, luaChonMay);
				setKetQua(ketQuaVan);

				// Lưu vào lịch sử
				const vanMoi: LichSuVan = {
					id: Date.now().toString(),
					nguoiChoi: luaChon,
					mayTinh: luaChonMay,
					ketQua: ketQuaVan,
					thoiGian: new Date().toISOString(),
				};

				setLichSu((prev) => [vanMoi, ...prev]); // Thêm vào đầu mảng
				setDangChoi(false);
			}, 500);
		},
		[],
	);

	// Chơi lại
	const choiLai = useCallback(() => {
		setLuaChonNguoiChoi(null);
		setLuaChonMayTinh(null);
		setKetQua(null);
	}, []);

	// Xóa lịch sử
	const xoaLichSu = useCallback(() => {
		setLichSu([]);
	}, []);

	// Tính thống kê
	const thongKe: ThongKe = {
		tongVan: lichSu.length,
		thang: lichSu.filter((van) => van.ketQua === 'thang').length,
		thua: lichSu.filter((van) => van.ketQua === 'thua').length,
		hoa: lichSu.filter((van) => van.ketQua === 'hoa').length,
		tiLeThang: lichSu.length > 0 
			? Math.round((lichSu.filter((van) => van.ketQua === 'thang').length / lichSu.length) * 100)
			: 0,
	};

	return {
		// State
		lichSu,
		luaChonNguoiChoi,
		luaChonMayTinh,
		ketQua,
		dangChoi,
		thongKe,

		// Actions
		choi,
		choiLai,
		xoaLichSu,
	};
};