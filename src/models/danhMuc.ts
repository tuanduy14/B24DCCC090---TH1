// src/models/danhMuc.ts
import { useState, useCallback } from 'react';
import { KhoiKienThuc, MonHoc } from '@/pages/QuanLyDeThi/types';

export default function useDanhMucModel() {
	const [khoiKienThuc, setKhoiKienThuc] = useState<KhoiKienThuc[]>(() => {
		try {
			const saved = localStorage.getItem('khoiKienThuc');
			return saved ? JSON.parse(saved) : [];
		} catch {
			return [];
		}
	});

	const [monHoc, setMonHoc] = useState<MonHoc[]>(() => {
		try {
			const saved = localStorage.getItem('monHoc');
			return saved ? JSON.parse(saved) : [];
		} catch {
			return [];
		}
	});

	const saveKhoi = (data: KhoiKienThuc[]) => {
		localStorage.setItem('khoiKienThuc', JSON.stringify(data));
		setKhoiKienThuc(data);
	};

	const saveMon = (data: MonHoc[]) => {
		localStorage.setItem('monHoc', JSON.stringify(data));
		setMonHoc(data);
	};

	// ===== KHỐI KIẾN THỨC =====
	const themKhoiKienThuc = useCallback((khoi: Omit<KhoiKienThuc, 'id'>) => {
		const current: KhoiKienThuc[] = (() => {
			try { return JSON.parse(localStorage.getItem('khoiKienThuc') || '[]'); } catch { return []; }
		})();

		if (current.some((k) => k.ma === khoi.ma)) {
			alert('Mã khối kiến thức đã tồn tại!');
			return false;
		}

		const khoiMoi: KhoiKienThuc = { ...khoi, id: Date.now().toString() };
		const next = [...current, khoiMoi];
		saveKhoi(next);
		return true;
	}, []);

	const suaKhoiKienThuc = useCallback((id: string, data: Partial<KhoiKienThuc>) => {
		setKhoiKienThuc((prev) => {
			const next = prev.map((k) => (k.id === id ? { ...k, ...data } : k));
			localStorage.setItem('khoiKienThuc', JSON.stringify(next));
			return next;
		});
	}, []);

	const xoaKhoiKienThuc = useCallback((id: string) => {
		setKhoiKienThuc((prev) => {
			const next = prev.filter((k) => k.id !== id);
			localStorage.setItem('khoiKienThuc', JSON.stringify(next));
			return next;
		});
	}, []);

	const timKhoiKienThuc = useCallback((id: string) => {
		const current: KhoiKienThuc[] = (() => {
			try { return JSON.parse(localStorage.getItem('khoiKienThuc') || '[]'); } catch { return []; }
		})();
		return current.find((k) => k.id === id);
	}, []);

	// ===== MÔN HỌC =====
	const themMonHoc = useCallback((mon: Omit<MonHoc, 'id'>) => {
		const current: MonHoc[] = (() => {
			try { return JSON.parse(localStorage.getItem('monHoc') || '[]'); } catch { return []; }
		})();

		if (current.some((m) => m.maMon === mon.maMon)) {
			alert('Mã môn học đã tồn tại!');
			return false;
		}

		const monMoi: MonHoc = { ...mon, id: Date.now().toString() };
		const next = [...current, monMoi];
		saveMon(next);
		return true;
	}, []);

	const suaMonHoc = useCallback((id: string, data: Partial<MonHoc>) => {
		setMonHoc((prev) => {
			const next = prev.map((m) => (m.id === id ? { ...m, ...data } : m));
			localStorage.setItem('monHoc', JSON.stringify(next));
			return next;
		});
	}, []);

	const xoaMonHoc = useCallback((id: string) => {
		setMonHoc((prev) => {
			const next = prev.filter((m) => m.id !== id);
			localStorage.setItem('monHoc', JSON.stringify(next));
			return next;
		});
	}, []);

	const timMonHoc = useCallback((id: string) => {
		const current: MonHoc[] = (() => {
			try { return JSON.parse(localStorage.getItem('monHoc') || '[]'); } catch { return []; }
		})();
		return current.find((m) => m.id === id);
	}, []);

	return {
		khoiKienThuc,
		monHoc,
		themKhoiKienThuc,
		suaKhoiKienThuc,
		xoaKhoiKienThuc,
		timKhoiKienThuc,
		themMonHoc,
		suaMonHoc,
		xoaMonHoc,
		timMonHoc,
	};
}