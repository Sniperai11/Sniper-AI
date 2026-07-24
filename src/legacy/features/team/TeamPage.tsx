import React, { useState } from 'react';
import { Users, UserPlus, Shield, Mail, CheckCircle, Trash2 } from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { Badge } from '../../shared/components/Badge';

export const TeamPage: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState([
    { id: 'm-1', name: 'أحمد محمود', email: 'ahmed@company.com', role: 'Admin', status: 'Active' },
    { id: 'm-2', name: 'سارة خالد', email: 'sara@company.com', role: 'Security Engineer', status: 'Active' },
    { id: 'm-3', name: 'محمد علي', email: 'm.ali@company.com', role: 'Viewer', status: 'Active' },
  ]);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Security Engineer');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setTeamMembers(prev => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        name: email.split('@')[0],
        email,
        role,
        status: 'Invited'
      }
    ]);
    setEmail('');
    setShowInviteModal(false);
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            Team & Permissions Management (إدارة أعضاء الفريق والصلاحيات)
          </h2>
          <p className="text-xs text-slate-400 mt-1">دعوة مهندسي الأمن والمدراء وتحديد الأدوار لضمان الأمان والخصوصية</p>
        </div>

        <Button 
          onClick={() => setShowInviteModal(true)}
          className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold text-xs flex items-center gap-1.5"
        >
          <UserPlus className="w-4 h-4" /> دعوة عضو جديد (Invite Member)
        </Button>
      </div>

      {/* MEMBERS TABLE */}
      <Card variant="cyber" className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#070B14] border-b border-slate-800 text-slate-400 font-bold uppercase">
              <tr>
                <th className="p-4">Name (الاسم)</th>
                <th className="p-4">Email (البريد)</th>
                <th className="p-4">Role (الدور)</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-[#0D111C]">
              {teamMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="p-4 font-bold text-white">{member.name}</td>
                  <td className="p-4 font-mono text-slate-300">{member.email}</td>
                  <td className="p-4 font-mono text-cyan-400 font-bold">{member.role}</td>
                  <td className="p-4">
                    <Badge variant={member.status === 'Active' ? 'success' : 'warning'}>
                      {member.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => setTeamMembers(teamMembers.filter(m => m.id !== member.id))}
                      className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* INVITE MODAL */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0D111C] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">دعوة عضو جديد لفريق الأمان</h3>
            <form onSubmit={handleInvite} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="engineer@company.com"
                  className="w-full p-3 bg-[#070B14] border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">الدور والصلاحية (Role)</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full p-3 bg-[#070B14] border border-slate-800 rounded-xl text-white focus:outline-none"
                >
                  <option value="Admin">Admin (مسؤول)</option>
                  <option value="Security Engineer">Security Engineer (مهندس أمن)</option>
                  <option value="Viewer">Viewer (مراقب فقط)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <Button type="button" variant="ghost" onClick={() => setShowInviteModal(false)} className="text-xs">إلغاء</Button>
                <Button type="submit" className="bg-purple-600 text-white font-bold text-xs">إرسال الدعوة</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
