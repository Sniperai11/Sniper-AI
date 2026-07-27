import React, { useState } from 'react';
import { Users, UserPlus, Trash2, Search, Filter } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useTeamMembers, useAddTeamMember, useDeleteTeamMember } from '../hooks/api/useTeam';

export const TeamManagement = () => {
  const { data: teamMembers = [], isLoading } = useTeamMembers();
  const { mutate: addMember } = useAddTeamMember();
  const { mutate: removeMember } = useDeleteTeamMember();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Admin' | 'Security Analyst' | 'Viewer'>('Security Analyst');
  const [search, setSearch] = useState('');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    addMember({ name: name.trim() || email.split('@')[0], email: email.trim(), role });
    setName('');
    setEmail('');
    setShowInviteModal(false);
  };

  const handleRemoveMember = (id: string) => {
    removeMember(id);
  };

  const filteredMembers = teamMembers.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan-400" />
            إدارة أعضاء الفريق والصلاحيات
          </h1>
          <p className="text-sm text-slate-400 mt-1">دعوة مهندسي الأمن والمدراء وتحديد الأدوار لضمان الأمان والخصوصية في المؤسسة</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ابحث عن أعضاء الفريق..." 
              className="h-10 w-full sm:w-64 rounded-md border border-slate-800 bg-slate-900/50 pr-9 pl-4 text-sm text-slate-200 placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none text-right"
            />
          </div>
          <Button 
            onClick={() => setShowInviteModal(true)}
            className="h-10 bg-cyan-600 hover:bg-cyan-500 text-white shrink-0 font-bold flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>دعوة عضو جديد</span>
          </Button>
        </div>
      </div>

      {/* MEMBERS TABLE */}
      <Card className="bg-slate-900/40 border-slate-800/60 overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800">
          <table className="w-full text-sm text-right" dir="rtl">
            <thead className="text-xs text-slate-400 uppercase bg-slate-950/50 border-b border-slate-800">
              <tr>
                <th className="px-4 py-4 font-medium text-right">الاسم / العضو</th>
                <th className="px-4 py-4 font-medium text-right">البريد الإلكتروني</th>
                <th className="px-4 py-4 font-medium text-right">الدور والصلاحية</th>
                <th className="px-4 py-4 font-medium hidden sm:table-cell text-right">تاريخ الانضمام</th>
                <th className="px-4 py-4 font-medium text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">لا يوجد أعضاء يطابقون البحث.</td>
                </tr>
              ) : filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-400">
                        {member.name.charAt(0)}
                      </div>
                      <span className="font-medium text-slate-200">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-mono text-slate-400 text-xs">{member.email}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Badge variant={member.role === 'Admin' ? 'destructive' : member.role === 'Security Analyst' ? 'warning' : 'secondary'} className="border-0">
                      {member.role === 'Admin' ? 'مسؤول النظام' : member.role === 'Security Analyst' ? 'محلل أمني' : 'مستعرض'}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-slate-400 hidden sm:table-cell text-xs font-mono">
                    {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString('ar-SA') : 'غير محدد'}
                  </td>
                  <td className="px-4 py-4 text-left">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemoveMember(member.id)}
                      className="h-8 w-8 p-0 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                      title="حذف العضو"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* INVITE MODAL */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in text-right" dir="rtl">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">دعوة عضو جديد لفريق الأمان السيبراني</h3>
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">اسم العضو</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="مثال: مهندس أحمد" 
                  className="w-full h-10 px-3 rounded-lg border border-slate-800 bg-slate-950 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none text-right"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">البريد الإلكتروني *</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="engineer@digitaltech.sa" 
                  className="w-full h-10 px-3 rounded-lg border border-slate-800 bg-slate-950 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none text-right"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">دور الصلاحية</label>
                <select 
                  value={role}
                  onChange={e => setRole(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-800 bg-slate-950 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none text-right"
                >
                  <option value="Security Analyst">محلل أمني (Security Analyst)</option>
                  <option value="Admin">مسؤول النظام (Admin)</option>
                  <option value="Viewer">مستعرض فقط (Viewer)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowInviteModal(false)} className="border-slate-800">
                  إلغاء
                </Button>
                <Button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold">
                  إرسال الدعوة
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
