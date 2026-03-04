// Types cho hệ thống quản lý đề thi

export type MucDoKho = 'de' | 'trung-binh' | 'kho' | 'rat-kho';

// 1. Khối kiến thức
export interface KhoiKienThuc {
	id: string;
	ma: string;
	ten: string;
	moTa?: string;
}

// 2. Môn học
export interface MonHoc {
	id: string;
	maMon: string;
	tenMon: string;
	soTinChi: number;
	moTa?: string;
}

// 3. Câu hỏi
export interface CauHoi {
	id: string;
	maCauHoi: string;
	monHocId: string;
	khoiKienThucId: string;
	noiDung: string;
	mucDoKho: MucDoKho;
	dapAn?: string;
	diemToiDa?: number;
	ngayTao: string;
}

// 4. Cấu trúc đề thi (template)
export interface CauTrucDeThi {
	id: string;
	ten: string;
	monHocId: string;
	moTa?: string;
	cacYeuCau: YeuCauCauHoi[];
	ngayTao: string;
}

export interface YeuCauCauHoi {
	khoiKienThucId: string;
	mucDoKho: MucDoKho;
	soLuong: number;
}

// 5. Đề thi
export interface DeThi {
	id: string;
	maDeThi: string;
	tenDeThi: string;
	monHocId: string;
	cauTrucDeThiId?: string;
	cacCauHoi: string[]; // Mảng ID câu hỏi
	tongDiem: number;
	thoiGianLamBai?: number; // phút
	ngayTao: string;
	ngaySuDung?: string;
	trangThai: 'nhap' | 'hoan-thanh' | 'da-su-dung';
}

// Filter cho tìm kiếm
export interface CauHoiFilter {
	monHocId?: string;
	khoiKienThucId?: string;
	mucDoKho?: MucDoKho;
	tuKhoa?: string;
}

// Kết quả tạo đề thi
export interface KetQuaTaoDeThi {
	thanhCong: boolean;
	deThi?: DeThi;
	loi?: string[];
	thongBao?: string;
}

// Config màu sắc theo mức độ khó
export const MUC_DO_KHO_CONFIG = {
	'de': { label: 'Dễ', color: '#52c41a' },
	'trung-binh': { label: 'Trung bình', color: '#1890ff' },
	'kho': { label: 'Khó', color: '#faad14' },
	'rat-kho': { label: 'Rất khó', color: '#ff4d4f' },
} as const;

// Config trạng thái đề thi
export const TRANG_THAI_DE_THI_CONFIG = {
	'nhap': { label: 'Nháp', color: 'default' },
	'hoan-thanh': { label: 'Hoàn thành', color: 'success' },
	'da-su-dung': { label: 'Đã sử dụng', color: 'warning' },
} as const;