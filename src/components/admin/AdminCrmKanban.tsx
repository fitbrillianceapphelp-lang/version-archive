import React, { useState, useMemo } from "react";
import {
  Users,
  Search,
  Filter,
  Plus,
  ArrowRight,
  ArrowLeft,
  Phone,
  MessageSquare,
  DollarSign,
  Calendar,
  Briefcase,
  FileText,
  Sparkles,
  CheckCircle2,
  Clock,
  MoreVertical,
  Trash2,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  X,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  CrmLead,
  CrmFunnelStage,
  CRM_STAGES,
  updateLeadStage,
  createCrmLead,
  removeCrmLead,
} from "../../lib/crmFirestore";

interface AdminCrmKanbanProps {
  leads: CrmLead[];
  isLiveFirestore: boolean;
  onRefresh?: () => void;
  onNavigateToContracts?: (clientName: string, budget: string) => void;
}

export const AdminCrmKanban: React.FC<AdminCrmKanbanProps> = ({
  leads,
  isLiveFirestore,
  onRefresh,
  onNavigateToContracts,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServiceFilter, setSelectedServiceFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<CrmLead | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [dragOverStage, setDragOverStage] = useState<CrmFunnelStage | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // New Deal Form State
  const [newDeal, setNewDeal] = useState({
    customerName: "",
    phone: "",
    email: "",
    businessName: "",
    serviceType: "تطوير وتشغيل منظومة الـ 90 يوماً",
    stage: "Lead" as CrmFunnelStage,
    budget: "$25,000",
    roasGoal: "4.5x",
    notes: "",
  });

  // Filter leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        lead.customerName.toLowerCase().includes(q) ||
        lead.businessName.toLowerCase().includes(q) ||
        lead.phone.includes(q) ||
        (lead.membershipCode && lead.membershipCode.toLowerCase().includes(q));

      const matchesService =
        selectedServiceFilter === "all" || lead.serviceType.includes(selectedServiceFilter);

      return matchesSearch && matchesService;
    });
  }, [leads, searchQuery, selectedServiceFilter]);

  // Group leads by 5 canonical stages: Lead, Discovery, Proposal, In-Production, Completed
  const stageColumns = useMemo(() => {
    const map: Record<CrmFunnelStage, CrmLead[]> = {
      Lead: [],
      Discovery: [],
      Proposal: [],
      "In-Production": [],
      Completed: [],
    };
    filteredLeads.forEach((l) => {
      if (map[l.stage]) {
        map[l.stage].push(l);
      } else {
        map.Lead.push(l);
      }
    });
    return map;
  }, [filteredLeads]);

  // Handle Drag & Drop
  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData("text/plain", leadId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, stageId: CrmFunnelStage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverStage !== stageId) {
      setDragOverStage(stageId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverStage(null);
  };

  const handleDrop = async (e: React.DragEvent, targetStage: CrmFunnelStage) => {
    e.preventDefault();
    setDragOverStage(null);
    const leadId = e.dataTransfer.getData("text/plain");
    if (!leadId) return;

    const lead = leads.find((l) => l.id === leadId);
    if (!lead || lead.stage === targetStage) return;

    setIsUpdating(true);
    await updateLeadStage(leadId, targetStage);
    setIsUpdating(false);
  };

  // Move forward/backward via buttons
  const moveLeadToNextStage = async (lead: CrmLead, direction: "next" | "prev") => {
    const currentIndex = CRM_STAGES.findIndex((s) => s.id === lead.stage);
    if (currentIndex === -1) return;

    const targetIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    if (targetIndex < 0 || targetIndex >= CRM_STAGES.length) return;

    const nextStage = CRM_STAGES[targetIndex].id;
    setIsUpdating(true);
    await updateLeadStage(lead.id, nextStage);
    if (selectedLead && selectedLead.id === lead.id) {
      setSelectedLead({ ...selectedLead, stage: nextStage });
    }
    setIsUpdating(false);
  };

  // Quick WhatsApp Launcher
  const openWhatsApp = (lead: CrmLead) => {
    const cleanPhone = lead.phone.replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      `مرحباً بك أستاذ ${lead.customerName}، معك كوتش مصطفى سراج من Fit Brilliance.\nبخصوص طلبك الخاص بنشاط (${lead.businessName}) وتطوير (${lead.serviceType})، يسعدنا مراجعة أولويات التشخيص ومسار التنفيذ معك.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
  };

  // Handle Add New Deal Submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeal.customerName.trim() || !newDeal.phone.trim()) return;

    const budgetVal = parseInt(newDeal.budget.replace(/[^0-9]/g, ""), 10) || 25000;

    await createCrmLead({
      customerName: newDeal.customerName,
      phone: newDeal.phone,
      email: newDeal.email,
      businessName: newDeal.businessName || "نشاط استراتيجي",
      serviceType: newDeal.serviceType,
      stage: newDeal.stage,
      budget: newDeal.budget,
      budgetValue: budgetVal,
      roasGoal: newDeal.roasGoal,
      notes: newDeal.notes,
      diagnosticScore: 85,
    });

    setIsAddModalOpen(false);
    setNewDeal({
      customerName: "",
      phone: "",
      email: "",
      businessName: "",
      serviceType: "تطوير وتشغيل منظومة الـ 90 يوماً",
      stage: "Lead",
      budget: "$25,000",
      roasGoal: "4.5x",
      notes: "",
    });
  };

  // Handle Delete
  const handleDeleteLead = async (leadId: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذه الصفقة نهائياً من قاعدة بيانات CRM؟")) {
      await removeCrmLead(leadId);
      if (selectedLead?.id === leadId) setSelectedLead(null);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Top Header & Search Controls */}
      <div className="bg-[#0a0f18]/90 border border-slate-800/80 p-4 rounded-2xl backdrop-blur-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              <span>لوحة إدارة العملاء وقمع الصفقات (CRM Pipeline Kanban)</span>
            </h2>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border font-mono ${
                isLiveFirestore
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                  : "bg-amber-500/15 text-amber-400 border-amber-500/30"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isLiveFirestore ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                }`}
              />
              {isLiveFirestore ? "Firestore Live" : "Local Sync"}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            اسحب البطاقات بين المراحل أو اضغط عليها لإدارة التواصل المباشر، صياغة خطط الـ 90 يوماً، وتوليد العقود.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search Input */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث بالعميل أو الهاتف..."
              className="w-full bg-[#05080c] border border-slate-800 text-xs text-white rounded-xl pr-9 pl-3 py-2 focus:border-red-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Service Filter */}
          <select
            value={selectedServiceFilter}
            onChange={(e) => setSelectedServiceFilter(e.target.value)}
            className="bg-[#05080c] border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:border-red-500 focus:outline-none cursor-pointer"
          >
            <option value="all">كل الخدمات</option>
            <option value="90">منظومة الـ 90 يوماً</option>
            <option value="سينمائي">إنتاج سينمائي 4K</option>
            <option value="تشخيص">تشخيص استراتيجي</option>
            <option value="استحواذ">استحواذ مباشر</option>
          </select>

          {/* Add New Deal Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-black flex items-center gap-1.5 shadow-lg shadow-red-600/30 transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة صفقة / استشارة</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Horizontal Scroll Container */}
      <div className="overflow-x-auto pb-4 pt-1">
        <div className="flex items-start gap-3 min-w-[1400px]">
          {CRM_STAGES.map((stage) => {
            const stageLeads = stageColumns[stage.id] || [];
            const stageTotalValue = stageLeads.reduce(
              (acc, curr) => acc + (curr.budgetValue || 20000),
              0
            );
            const isTarget = dragOverStage === stage.id;

            return (
              <div
                key={stage.id}
                onDragOver={(e) => handleDragOver(e, stage.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, stage.id)}
                className={`w-[270px] shrink-0 bg-[#090e17]/90 rounded-2xl border transition-all duration-200 flex flex-col max-h-[750px] shadow-lg ${
                  isTarget
                    ? "border-[#ef4444] bg-[#160d11] shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                    : "border-slate-800/80"
                }`}
              >
                {/* Column Header */}
                <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    <div>
                      <h3 className="text-xs font-black text-white">{stage.title}</h3>
                      <p className="text-[10px] text-slate-400">{stage.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-200 font-mono">
                      {stageLeads.length}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 mt-0.5">
                      ${Math.round(stageTotalValue / 1000)}k
                    </span>
                  </div>
                </div>

                {/* Column Cards List */}
                <div className="p-2.5 space-y-2.5 overflow-y-auto flex-1 min-h-[300px]">
                  {stageLeads.length === 0 ? (
                    <div className="h-40 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-500 text-xs text-center p-3">
                      <span>لا توجد صفقات هنا</span>
                      <span className="text-[10px] mt-1 text-slate-600">
                        اسحب بطاقة إلى هنا لإدراجها
                      </span>
                    </div>
                  ) : (
                    stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, lead.id)}
                        onClick={() => setSelectedLead(lead)}
                        className="bg-[#0d1420] border border-slate-800 hover:border-slate-600 p-3 rounded-xl shadow-md transition-all cursor-pointer hover:shadow-xl group relative"
                      >
                        {/* Top Line: Client & Code */}
                        <div className="flex items-start justify-between gap-1.5 mb-1.5">
                          <h4 className="text-xs font-black text-white group-hover:text-red-400 transition-colors">
                            {lead.customerName}
                          </h4>
                          {lead.membershipCode && (
                            <span className="px-1.5 py-0.2 bg-emerald-500/15 text-emerald-400 text-[9px] font-bold font-mono rounded">
                              {lead.membershipCode}
                            </span>
                          )}
                        </div>

                        {/* Business name */}
                        <p className="text-[11px] text-slate-300 font-medium truncate mb-2">
                          {lead.businessName}
                        </p>

                        {/* Service badge */}
                        <div className="inline-block px-2 py-0.5 rounded-md bg-slate-800/80 text-[10px] text-slate-300 font-medium mb-2.5 max-w-full truncate">
                          {lead.serviceType}
                        </div>

                        {/* Budget & ROAS goal */}
                        <div className="flex items-center justify-between text-[11px] font-mono border-t border-slate-800/80 pt-2 mb-2">
                          <span className="text-white font-bold">{lead.budget}</span>
                          <span className="text-amber-400 font-bold">ROAS {lead.roasGoal}</span>
                        </div>

                        {/* Card Footer Actions */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openWhatsApp(lead);
                              }}
                              title="محادثة واتساب مباشرة"
                              className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/20 transition-all cursor-pointer"
                            >
                              <MessageSquare className="w-3 h-3" />
                            </button>
                            {lead.phone && (
                              <a
                                href={`tel:${lead.phone}`}
                                onClick={(e) => e.stopPropagation()}
                                title="اتصال هاتفي"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                              >
                                <Phone className="w-3 h-3" />
                              </a>
                            )}
                          </div>

                          {/* Quick Stage Shifters */}
                          <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                            {stage.id !== "Lead" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveLeadToNextStage(lead, "prev");
                                }}
                                title="إرجاع للمرحلة السابقة"
                                className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
                              >
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                            {stage.id !== "Completed" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveLeadToNextStage(lead, "next");
                                }}
                                title="تقديم للمرحلة التالية"
                                className="p-1 rounded-md bg-[#dc2626] hover:bg-[#b91c1c] text-white transition-all cursor-pointer"
                              >
                                <ChevronLeft className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lead Detail & Strategic Drawer Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-[100000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0b1018] border border-slate-700 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 text-right">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#dc2626]/20 to-black border border-[#ef4444]/40 flex items-center justify-center text-[#ef4444]">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    {selectedLead.customerName}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {selectedLead.businessName} • كود: {selectedLead.id}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stage Selector Bar */}
            <div className="mb-6 bg-[#06090e] p-3 rounded-2xl border border-slate-800">
              <label className="text-[11px] font-bold text-slate-400 block mb-2">
                المرحلة التنفيذية الحالية في القمع:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CRM_STAGES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      updateLeadStage(selectedLead.id, s.id);
                      setSelectedLead({ ...selectedLead, stage: s.id });
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      selectedLead.stage === s.id
                        ? "bg-[#dc2626] text-white shadow-md shadow-red-600/30 font-black"
                        : "bg-slate-800/60 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                    <span>{s.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs">
              <div className="bg-[#080d14] p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">بيانات الاتصال:</span>
                <p className="font-mono text-white font-bold">{selectedLead.phone}</p>
                {selectedLead.email && (
                  <p className="font-mono text-slate-400 text-[11px]">{selectedLead.email}</p>
                )}
              </div>

              <div className="bg-[#080d14] p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">الميزانية ومستهدف الـ ROAS:</span>
                <p className="font-mono text-emerald-400 font-bold text-sm">
                  {selectedLead.budget} • ROAS: {selectedLead.roasGoal}
                </p>
                <p className="text-[10px] text-slate-500">تم التقدير بناءً على مخرجات تدقيق الهدر</p>
              </div>

              <div className="bg-[#080d14] p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">باقة الخدمة المطلوبة:</span>
                <p className="text-white font-bold">{selectedLead.serviceType}</p>
              </div>

              <div className="bg-[#080d14] p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">تاريخ التسجيل والمصدر:</span>
                <p className="font-mono text-slate-300">
                  {new Date(selectedLead.createdAt).toLocaleDateString("ar-EG")} •{" "}
                  <span className="text-emerald-400">
                    {selectedLead.source === "firestore" ? "Firestore Cloud" : "Direct Intake"}
                  </span>
                </p>
              </div>
            </div>

            {/* Notes / Pain Points */}
            <div className="bg-[#080d14] p-4 rounded-xl border border-slate-800 mb-6">
              <span className="text-xs font-bold text-slate-300 block mb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>ملاحظات التشخيص وأولويات التطوير الميداني:</span>
              </span>
              <p className="text-xs text-slate-300 leading-relaxed bg-[#05080c] p-3 rounded-lg border border-slate-800/80">
                {selectedLead.notes || "لا توجد ملاحظات تفصيلية مسجلة حتى الآن."}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-3 flex-wrap border-t border-slate-800 pt-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openWhatsApp(selectedLead)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-600/20"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>مراسلة واتساب فورية</span>
                </button>

                {onNavigateToContracts && (
                  <button
                    onClick={() => {
                      onNavigateToContracts(
                        selectedLead.customerName,
                        selectedLead.budget || "$25,000"
                      );
                      setSelectedLead(null);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>توليد مسودة العقد</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => handleDeleteLead(selectedLead.id)}
                className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>حذف الصفقة</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Deal Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0b1018] border border-slate-700 rounded-3xl w-full max-w-lg p-6 text-right shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#ef4444]" />
                <span>إضافة صفقة أو استشارة جديدة إلى CRM</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-bold">اسم العميل / المستثمر:</label>
                <input
                  type="text"
                  required
                  value={newDeal.customerName}
                  onChange={(e) => setNewDeal({ ...newDeal, customerName: e.target.value })}
                  placeholder="مثال: م. أحمد منصور"
                  className="w-full bg-[#05080c] border border-slate-800 text-white rounded-xl p-2.5 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">رقم الهاتف / الواتساب:</label>
                  <input
                    type="text"
                    required
                    value={newDeal.phone}
                    onChange={(e) => setNewDeal({ ...newDeal, phone: e.target.value })}
                    placeholder="+966 / +20..."
                    className="w-full bg-[#05080c] border border-slate-800 text-white rounded-xl p-2.5 focus:border-red-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">اسم النشاط التجاري:</label>
                  <input
                    type="text"
                    value={newDeal.businessName}
                    onChange={(e) => setNewDeal({ ...newDeal, businessName: e.target.value })}
                    placeholder="مثال: مطاعم السرايا"
                    className="w-full bg-[#05080c] border border-slate-800 text-white rounded-xl p-2.5 focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">الميزانية المتوقعة:</label>
                  <input
                    type="text"
                    value={newDeal.budget}
                    onChange={(e) => setNewDeal({ ...newDeal, budget: e.target.value })}
                    placeholder="$25,000"
                    className="w-full bg-[#05080c] border border-slate-800 text-white rounded-xl p-2.5 focus:border-red-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">المرحلة الابتدائية:</label>
                  <select
                    value={newDeal.stage}
                    onChange={(e) =>
                      setNewDeal({ ...newDeal, stage: e.target.value as CrmFunnelStage })
                    }
                    className="w-full bg-[#05080c] border border-slate-800 text-white rounded-xl p-2.5 focus:border-red-500 focus:outline-none cursor-pointer"
                  >
                    {CRM_STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-bold">نوع الخدمة المعتمدة:</label>
                <select
                  value={newDeal.serviceType}
                  onChange={(e) => setNewDeal({ ...newDeal, serviceType: e.target.value })}
                  className="w-full bg-[#05080c] border border-slate-800 text-white rounded-xl p-2.5 focus:border-red-500 focus:outline-none cursor-pointer"
                >
                  <option value="تطوير وتشغيل منظومة الـ 90 يوماً">
                    تطوير وتشغيل منظومة الـ 90 يوماً
                  </option>
                  <option value="إنتاج سينمائي 4K للفعاليات وإعادة هندسة المحتوى">
                    إنتاج سينمائي 4K للفعاليات وإعادة هندسة المحتوى
                  </option>
                  <option value="تشخيص استراتيجي وتحول رقمي">تشخيص استراتيجي وتحول رقمي</option>
                  <option value="هندسة الاستحواذ المباشر وتقليل تكلفة العميل">
                    هندسة الاستحواذ المباشر وتقليل تكلفة العميل
                  </option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-bold">
                  ملاحظات أو تحديات النشاط:
                </label>
                <textarea
                  rows={3}
                  value={newDeal.notes}
                  onChange={(e) => setNewDeal({ ...newDeal, notes: e.target.value })}
                  placeholder="سجل أي تفاصيل عن الهدر الإعلاني أو أهداف العميل..."
                  className="w-full bg-[#05080c] border border-slate-800 text-white rounded-xl p-2.5 focus:border-red-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] text-white font-black shadow-lg shadow-red-600/30 cursor-pointer"
                >
                  حفظ في CRM وFirestore
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
