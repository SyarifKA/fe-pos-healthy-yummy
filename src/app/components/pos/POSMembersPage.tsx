'use client';
import { useState } from 'react';
import { useApp } from '../../lib/AppContext';
import RegistrationModal from './RegistrationModal';

export default function POSMembersPage() {
  const { members } = useApp();
  const [regOpen, setRegOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.phone.includes(search)
  );

  return (
    <>
      <div className="topbar">
        <div className="topbar-title">👥 Pelanggan Member</div>
        <div className="topbar-right">
          <div className="search-wrap">
            <input
              className="search-input"
              placeholder="Cari member…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setRegOpen(true)}>
            + Daftar Member
          </button>
        </div>
      </div>

      <div className="page-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div className="section-title" style={{ marginBottom: 0 }}>
            Total {filtered.length} Member
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Belum ada member</div>
            <div style={{ fontSize: 13, margin: '6px 0 16px' }}>Daftarkan pelanggan sebagai member</div>
            <button className="btn btn-primary" onClick={() => setRegOpen(true)}>+ Daftar Member Baru</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {filtered.map(m => (
              <div key={m.id} className="member-card">
                <div className="member-avatar">{m.name[0].toUpperCase()}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="member-name">{m.name}</div>
                  <div className="member-detail">📱 {m.phone}</div>
                  {m.address && <div className="member-detail">📍 {m.address}</div>}
                  {m.socmed && <div className="member-detail">🔗 {m.socmed}</div>}
                  <div className="member-detail" style={{ marginTop: 4 }}>
                    <span style={{ background: 'var(--accent-bg)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 700 }}>
                      Member sejak {m.joinedAt}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {regOpen && <RegistrationModal onClose={() => setRegOpen(false)} />}
    </>
  );
}
