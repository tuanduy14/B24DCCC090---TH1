import React, { useState } from 'react';
import { Card, Input, Button, Space, Typography, Alert, Statistic } from 'antd';
import { SmileOutlined, FrownOutlined, TrophyOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const DoanSo: React.FC = () => {
  const [soNgauNhien, setSoNgauNhien] = useState<number>(Math.floor(Math.random() * 100) + 1);
  const [duDoan, setDuDoan] = useState<string>('');
  const [lichSuDuDoan, setLichSuDuDoan] = useState<number[]>([]);
  const [soLanDoan, setSoLanDoan] = useState<number>(0);
  const [thongBao, setThongBao] = useState<string>('');
  const [loaiThongBao, setLoaiThongBao] = useState<'success' | 'info' | 'warning' | 'error'>('info');
  const [daKetThuc, setDaKetThuc] = useState<boolean>(false);

  const batDauChoiMoi = () => {
    setSoNgauNhien(Math.floor(Math.random() * 100) + 1);
    setDuDoan('');
    setLichSuDuDoan([]);
    setSoLanDoan(0);
    setThongBao('Hãy đoán một số từ 1 đến 100!');
    setLoaiThongBao('info');
    setDaKetThuc(false);
  };

  const xuLyDuDoan = () => {
    const soDuDoan = parseInt(duDoan);

    // Kiểm tra đầu vào
    if (isNaN(soDuDoan) || soDuDoan < 1 || soDuDoan > 100) {
      setThongBao('Vui lòng nhập một số từ 1 đến 100!');
      setLoaiThongBao('error');
      return;
    }

    // Kiểm tra trùng lặp
    if (lichSuDuDoan.includes(soDuDoan)) {
      setThongBao('Bạn đã đoán số này rồi! Hãy thử số khác.');
      setLoaiThongBao('warning');
      return;
    }

    // Thêm vào lịch sử
    const lichSuMoi = [...lichSuDuDoan, soDuDoan];
    setLichSuDuDoan(lichSuMoi);
    setSoLanDoan(soLanDoan + 1);

    // Kiểm tra kết quả
    if (soDuDoan === soNgauNhien) {
      setThongBao(`🎉 Chúc mừng! Bạn đã đoán đúng số ${soNgauNhien} sau ${soLanDoan + 1} lần thử!`);
      setLoaiThongBao('success');
      setDaKetThuc(true);
    } else if (soDuDoan < soNgauNhien) {
      setThongBao('Bạn đoán quá thấp! Hãy thử số lớn hơn.');
      setLoaiThongBao('info');
    } else {
      setThongBao('Bạn đoán quá cao! Hãy thử số nhỏ hơn.');
      setLoaiThongBao('warning');
    }

    // Kiểm tra số lần đoán
    if (lichSuMoi.length >= 10 && soDuDoan !== soNgauNhien) {
      setThongBao(`Bạn đã hết lượt! Số đúng là ${soNgauNhien}.`);
      setLoaiThongBao('error');
      setDaKetThuc(true);
    }

    setDuDoan('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !daKetThuc) {
      xuLyDuDoan();
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center' }}>
           Trò Chơi Đoán Số
        </Title>
        
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Text type="secondary">
            Đoán số ngẫu nhiên từ 1 đến 100. Bạn có tối đa 10 lần đoán!
          </Text>
        </div>

        {thongBao && (
          <Alert
            message={thongBao}
            type={loaiThongBao}
            showIcon
            icon={
              loaiThongBao === 'success' ? <TrophyOutlined /> :
              loaiThongBao === 'error' ? <FrownOutlined /> :
              <SmileOutlined />
            }
            style={{ marginBottom: '24px' }}
          />
        )}

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Statistic
              title="Số lần đã đoán"
              value={soLanDoan}
              suffix="/ 10"
              style={{ textAlign: 'center' }}
            />
          </div>

          <div style={{ display: 'flex', width: '100%', gap: '8px' }}>
            <Input
              size="large"
              type="number"
              placeholder="Nhập số dự đoán của bạn..."
              value={duDoan}
              onChange={(e) => setDuDoan(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={daKetThuc}
              min={1}
              max={100}
              style={{ flex: 1 }}
            />
            <Button
              type="primary"
              size="large"
              onClick={xuLyDuDoan}
              disabled={daKetThuc}
            >
              Đoán
            </Button>
          </div>

          {lichSuDuDoan.length > 0 && (
            <Card type="inner" title="Lịch sử đoán">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {lichSuDuDoan.map((so, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '8px 12px',
                      background: so < soNgauNhien ? '#e6f7ff' : so > soNgauNhien ? '#fff7e6' : '#f6ffed',
                      border: `1px solid ${so < soNgauNhien ? '#91d5ff' : so > soNgauNhien ? '#ffd591' : '#b7eb8f'}`,
                      borderRadius: '4px',
                      fontWeight: 'bold',
                    }}
                  >
                    {so}
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Button
            type="dashed"
            block
            size="large"
            onClick={batDauChoiMoi}
          >
            {daKetThuc ? 'Chơi lại' : 'Bắt đầu lại'}
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default DoanSo;