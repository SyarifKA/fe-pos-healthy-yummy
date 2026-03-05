'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../lib/AppContext';
import RegistrationModal from './RegistrationModal';

export default function OrderMemberPage() {
  const router = useRouter();
  const { members, selectedMemberId, setSelectedMemberId, guestName, guestPhone, setGuestInfo } = useApp();
  
  const [isGuest, setIsGuest] = useState(!selectedMemberId && !guestName);
  const [search, setSearch] = useState('');
  const [showReg, setShowReg] = useState(false);
  const [tempGuestName, setTempGuestName] = useState(guestName);
  const [tempGuestPhone, setTempGuestPhone] = useState(guestPhone);

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.phone.includes(search)
  );

  const handleSelectMember = (memberId: number) => {
    setSelectedMemberId(memberId);
    setIsGuest(false);
    router.push('/pos');
  };

  const handleGuestContinue = () => {
    if (!tempGuestName.trim() || !tempGuestPhone.trim()) {
      alert('Mohon isi nama dan nomor WhatsApp');
      return;
    }
    setGuestInfo(tempGuestName, tempGuestPhone);
    setSelectedMemberId(null);
    setIsGuest(true);
    router.push('/pos');
  };

  const handleRegisterAndContinue = () => {
    setShowReg(true);
  };

  return (
    <div className="page-container">
      <div className="member-page">
        <div className="page-header">
          <button className="back-btn" onClick={() => router.back()}>← Kembali</button>
          <h1 className="page-title">👤 Data Pemesan</h1>
          <p className="page-subtitle">Pilih member atau lanjut sebagai tamu</p>
        </div>

        {/* Guest Toggle */}
        <div className="guest-toggle">
          <button
            className={`toggle-btn ${!isGuest ? 'active' : ''}`}
            onClick={() => setIsGuest(false)}
          >
            👥 Pilih Member
          </button>
          <button
            className={`toggle-btn ${isGuest ? 'active' : ''}`}
            onClick={() => setIsGuest(true)}
          >
            😐 Tamu
          </button>
        </div>

        {!isGuest ? (
          <>
            {/* Search */}
            <div className="search-wrap">
              <input
                className="search-input"
                placeholder="Cari nama atau nomor HP..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Member List */}
            <div className="member-list">
              {filtered.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <p>Tidak ada member ditemukan</p>
                </div>
              ) : (
                filtered.map(m => (
                  <button
                    key={m.id}
                    className={`member-card-select ${selectedMemberId === m.id ? 'selected' : ''}`}
                    onClick={() => handleSelectMember(m.id)}
                  >
                    <div className="member-avatar">{m.name[0].toUpperCase()}</div>
                    <div className="member-info">
                      <div className="member-name">{m.name}</div>
                      <div className="member-detail">📱 {m.phone}</div>
                    </div>
                    {selectedMemberId === m.id && <span className="check-icon">✓</span>}
                  </button>
                ))
              )}
            </div>

            {/* Register New Member */}
            <div className="register-section">
              <button className="btn btn-outline" onClick={() => setShowReg(true)}>
                + Daftar Member Baru
              </button>
            </div>
          </>
        ) : (
          <div className="guest-form">
            <p className="guest-info">
              Lanjut tanpa menjadi member. Isi data di bawah untuk struk pesanan.
            </p>
            
            <div className="form-group">
              <label className="form-label">Nama Pemesan *</label>
              <input
                className="form-input"
                placeholder="Masukkan nama pemesan"
                value={tempGuestName}
                onChange={e => setTempGuestName(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Nomor WhatsApp *</label>
              <input
                className="form-input"
                placeholder="Contoh: 081234567890"
                value={tempGuestPhone}
                onChange={e => setTempGuestPhone(e.target.value)}
              />
            </div>

            <button className="btn btn-primary btn-lg" onClick={handleGuestContinue}>
              Lanjut ke Menu →
            </button>
            
            <button className="btn btn-outline btn-lg" onClick={handleRegisterAndContinue} style={{ marginTop: 12 }}>
              + Daftar Member Sekarang
            </button>
          </div>
        )}
      </div>

      {showReg && <RegistrationModal onClose={() => setShowReg(false)} />}

      <style jsx>{`
        .page-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
        }
        .member-page {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 16px;
          overflow: hidden;
        }
        .page-header {
          margin-bottom: 20px;
        }
        .back-btn {
          background: none;
          border: none;
          color: var(--accent);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 12px;
          padding: 0;
        }
        .page-title {
          font-size: 22px;
          font-weight: 800;
          color: var(--text);
          margin-bottom: 4px;
        }
        .page-subtitle {
          font-size: 13px;
          color: var(--text2);
        }
        .guest-toggle {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
          background: var(--surface2);
          padding: 4px;
          border-radius: 10px;
        }
        .toggle-btn {
          flex: 1;
          padding: 10px;
          border: none;
          background: transparent;
          color: var(--text2);
          font-size: 14px;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .toggle-btn.active {
          background: var(--accent);
          color: white;
        }
        .search-wrap {
          margin-bottom: 12px;
        }
        .search-input {
          width: 100%;
          padding: 12px 14px;
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: 10px;
          color: var(--text);
          font-size: 14px;
        }
        .search-input:focus {
          outline: none;
          border-color: var(--accent);
        }
        .member-list {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .member-card-select {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }
        .member-card-select:hover {
          border-color: var(--accent);
        }
        .member-card-select.selected {
          border-color: var(--accent);
          background: var(--accent-bg);
        }
        .member-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--accent);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
          flex-shrink: 0;
        }
        .member-info {
          flex: 1;
          min-width: 0;
        }
        .member-name {
          font-weight: 600;
          color: var(--text);
          font-size: 14px;
        }
        .member-detail {
          font-size: 12px;
          color: var(--text2);
        }
        .check-icon {
          color: var(--accent);
          font-weight: 700;
          font-size: 18px;
        }
        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: var(--text2);
        }
        .empty-icon {
          font-size: 32px;
          margin-bottom: 8px;
        }
        .register-section {
          padding-top: 12px;
          border-top: 1px solid var(--border);
          margin-top: 12px;
        }
        .btn-outline {
          width: 100%;
          padding: 12px;
          background: transparent;
          border: 2px dashed var(--border);
          border-radius: 10px;
          color: var(--text2);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-outline:hover {
          border-color: var(--accent);
          color: var(--accent);
        }
        .guest-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 20px 0;
        }
        .guest-info {
          text-align: center;
          color: var(--text2);
          font-size: 14px;
        }
        .btn-lg {
          padding: 16px 24px;
          font-size: 16px;
        }
      `}</style>
    </div>
  );
}
