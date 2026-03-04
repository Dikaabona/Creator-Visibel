
import React, { useState, useMemo, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import CreatorTable from './components/CreatorTable';
import CampaignTable from './components/CampaignTable';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import CreatorDashboard from './components/CreatorDashboard';
import BrandDashboard from './components/BrandDashboard';
import ProfileEditor from './components/ProfileEditor';
import CreatorHome from './components/CreatorHome';
import { UserRole, CreatorTier, SearchFilters, Creator, Campaign, CampaignStatus, Application, ApplicationStatus } from './types';
import { MOCK_CREATORS, MOCK_CAMPAIGNS, getTier } from './data';
import { parseUserQuery } from './services/geminiService';
import { upsertCreators, deleteCreators, fetchCreators, getSupabase, fetchCampaigns, fetchApplications, applyToCampaign, updateApplicationStatus, upsertCampaign, updateCampaign } from './services/supabase';
import * as XLSX from 'xlsx';

const ITEMS_PER_PAGE = 10;
const STORAGE_KEY = 'visibel_creators_data';
const CAMPAIGN_STORAGE_KEY = 'visibel_campaigns_data';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'landing' | 'auth' | 'app'>('landing');
  const [activeView, setActiveView] = useState<'home' | 'creators' | 'campaigns' | 'analytics' | 'profile' | 'my-campaigns' | 'system'>('creators');
  const [session, setSession] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Creators State
  const [creators, setCreators] = useState<Creator[]>(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try { return JSON.parse(savedData); } catch (e) { return MOCK_CREATORS; }
    }
    return MOCK_CREATORS;
  });

  // Campaigns State
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const savedData = localStorage.getItem(CAMPAIGN_STORAGE_KEY);
    if (savedData) {
      try { return JSON.parse(savedData); } catch (e) { return MOCK_CAMPAIGNS; }
    }
    return MOCK_CAMPAIGNS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isAddCreatorToCampaignModalOpen, setIsAddCreatorToCampaignModalOpen] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState('');
  const [selectedModalCreatorIds, setSelectedModalCreatorIds] = useState<string[]>([]);
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null);
  const [editingCreator, setEditingCreator] = useState<Creator | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCreatorIds, setSelectedCreatorIds] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '', followers: '', tiktokUrl: '', instagramUrl: '', domicile: '', category: '', rateCard: ''
  });

  const [campaignFormData, setCampaignFormData] = useState({
    name: '', brand: '', budget: '', startDate: '', endDate: '', category: '', brief: ''
  });

  const [applications, setApplications] = useState<Application[]>([]);

  const role = useMemo(() => {
    if (!session?.user?.user_metadata?.role) return UserRole.CREATOR;
    return session.user.user_metadata.role as UserRole;
  }, [session]);

  const currentCreator = useMemo(() => {
    if (role !== UserRole.CREATOR || !session?.user?.id) return null;
    return creators.find(c => c.userId === session.user.id) || {
      id: session.user.id,
      userId: session.user.id,
      name: session.user.user_metadata.name || 'New Creator',
      followers: 0,
      engagementRate: 0,
      tier: CreatorTier.NANO,
      tiktokUrl: '',
      instagramUrl: '',
      domicile: '',
      category: ''
    } as Creator;
  }, [creators, session, role]);

  const currentBrand = useMemo(() => {
    if (role !== UserRole.BRAND || !session?.user?.id) return null;
    return {
      id: session.user.id,
      userId: session.user.id,
      name: session.user.user_metadata.name || 'New Brand',
      companyName: session.user.user_metadata.companyName || 'New Company'
    };
  }, [session, role]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabase = getSupabase();
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        if (session) setViewMode('app');
        
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
          if (session) setViewMode('app');
          else setViewMode('landing');
        });

        return () => {
          authListener.subscription.unsubscribe();
        };
      } catch (err) {
        console.error('Auth error:', err);
      } finally {
        setIsAuthLoading(false);
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    if (session) {
      if (role === UserRole.CREATOR) {
        setActiveView('home');
      } else if (role === UserRole.BRAND) {
        setActiveView('creators');
      } else if (role === UserRole.ADMIN) {
        setActiveView('creators');
      }
    }
  }, [session, role]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [creatorsData, campaignsData, appsData] = await Promise.all([
          fetchCreators(),
          fetchCampaigns(),
          fetchApplications()
        ]);
        if (creatorsData) setCreators(creatorsData);
        if (campaignsData) setCampaigns(campaignsData);
        if (appsData) setApplications(appsData);
      } catch (err) {
        console.error('Failed to load data from Supabase:', err);
      }
    };

    if (session) {
      loadData();

      // Real-time listeners
      const supabase = getSupabase();
      
      const campaignSubscription = supabase
        .channel('campaigns_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'campaigns' }, (payload) => {
          if (payload.eventType === 'INSERT') {
            setCampaigns(prev => [payload.new as Campaign, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setCampaigns(prev => prev.map(c => c.id === payload.new.id ? payload.new as Campaign : c));
          } else if (payload.eventType === 'DELETE') {
            setCampaigns(prev => prev.filter(c => c.id !== payload.old.id));
          }
        })
        .subscribe();

      const applicationSubscription = supabase
        .channel('applications_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, (payload) => {
          if (payload.eventType === 'INSERT') {
            setApplications(prev => [payload.new as Application, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setApplications(prev => prev.map(a => a.id === payload.new.id ? payload.new as Application : a));
          } else if (payload.eventType === 'DELETE') {
            setApplications(prev => prev.filter(a => a.id !== payload.old.id));
          }
        })
        .subscribe();

      const creatorSubscription = supabase
        .channel('creators_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'creators' }, (payload) => {
          if (payload.eventType === 'INSERT') {
            setCreators(prev => [payload.new as Creator, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setCreators(prev => prev.map(c => c.id === payload.new.id ? payload.new as Creator : c));
          } else if (payload.eventType === 'DELETE') {
            setCreators(prev => prev.filter(c => c.id !== payload.old.id));
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(campaignSubscription);
        supabase.removeChannel(applicationSubscription);
        supabase.removeChannel(creatorSubscription);
      };
    }
  }, [session]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(creators));
  }, [creators]);

  useEffect(() => {
    localStorage.setItem(CAMPAIGN_STORAGE_KEY, JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedCreatorIds([]);
  }, [searchQuery, activeFilters, activeView]);

  const filteredCreators = useMemo(() => {
    return creators.filter((creator) => {
      const matchTier = !activeFilters.tier || creator.tier === activeFilters.tier;
      const matchDomicile = !activeFilters.domicile || 
        creator.domicile.toLowerCase().includes(activeFilters.domicile.toLowerCase());
      const matchFollowers = !activeFilters.minFollowers || 
        creator.followers >= activeFilters.minFollowers;
      const matchQuery = !searchQuery || 
        creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTier && matchDomicile && matchFollowers && matchQuery;
    });
  }, [creators, activeFilters, searchQuery]);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(c => 
      !searchQuery || 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [campaigns, searchQuery]);

  const totalItems = activeView === 'creators' ? filteredCreators.length : filteredCampaigns.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  
  const paginatedCreators = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCreators.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCreators, currentPage]);

  const paginatedCampaigns = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCampaigns.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCampaigns, currentPage]);

  const handleAiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || activeView !== 'creators') return;
    setIsAiLoading(true);
    setAiMessage('Sedang menganalisis permintaan Anda...');
    try {
      const result = await parseUserQuery(searchQuery);
      if (result) {
        setActiveFilters({
          domicile: result.domicile || undefined,
          tier: (result.tier?.toUpperCase() as CreatorTier) || undefined,
          minFollowers: result.minFollowers || undefined
        });
        setAiMessage(result.explanation || "Berikut adalah hasil yang saya temukan.");
      }
    } catch (err) {
      setAiMessage("Maaf, terjadi kesalahan saat memproses AI search.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingCreator(null);
    setFormData({ name: '', followers: '', tiktokUrl: '', instagramUrl: '', domicile: '', category: '', rateCard: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (creator: Creator) => {
    setEditingCreator(creator);
    setFormData({
      name: creator.name, followers: creator.followers.toString(), tiktokUrl: creator.tiktokUrl, instagramUrl: creator.instagramUrl, domicile: creator.domicile, category: creator.category, rateCard: (creator.rateCard || 0).toString()
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const followersNum = parseInt(formData.followers);
    const rateCardNum = parseInt(formData.rateCard) || 0;
    let updatedCreator: Creator;
    
    if (editingCreator) {
      updatedCreator = { ...editingCreator, name: formData.name, followers: followersNum, tier: getTier(followersNum), tiktokUrl: formData.tiktokUrl, instagramUrl: formData.instagramUrl, domicile: formData.domicile, category: formData.category || 'General', rateCard: rateCardNum };
      setCreators(creators.map(c => c.id === editingCreator.id ? updatedCreator : c));
    } else {
      updatedCreator = { 
        id: Date.now().toString(), 
        userId: 'admin',
        name: formData.name, 
        followers: followersNum, 
        engagementRate: 0,
        tier: getTier(followersNum), 
        tiktokUrl: formData.tiktokUrl, 
        instagramUrl: formData.instagramUrl, 
        domicile: formData.domicile, 
        category: formData.category || 'General', 
        agencyId: 'agency_user', 
        rateCard: rateCardNum 
      };
      setCreators([updatedCreator, ...creators]);
    }

    try {
      await upsertCreators([updatedCreator]);
    } catch (err) {
      console.error('Failed to sync with Supabase:', err);
    }
    
    setIsModalOpen(false);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws) as any[];

      const newCreators: Creator[] = data.map((item, index) => {
        const followers = parseInt(item.followers || item.Followers || 0);
        return {
          id: item.id || `imported_${Date.now()}_${index}`,
          userId: 'imported',
          name: item.name || item.Name || 'Unknown',
          followers: followers,
          engagementRate: parseFloat(item.engagementRate || item['Engagement Rate'] || 0),
          tier: getTier(followers),
          tiktokUrl: item.tiktokUrl || item['TikTok URL'] || '',
          instagramUrl: item.instagramUrl || item['Instagram URL'] || '',
          domicile: item.domicile || item.Domicile || 'Unknown',
          category: item.category || item.Category || 'General',
          agencyId: 'agency_user',
          rateCard: parseInt(item.rateCard || item['Rate Card'] || 0)
        };
      });

      setCreators(prev => [...newCreators, ...prev]);
      
      try {
        await upsertCreators(newCreators);
        alert(`Berhasil mengimpor ${newCreators.length} data ke Supabase!`);
      } catch (err) {
        alert('Gagal menyimpan data ke Supabase. Pastikan tabel "creators" sudah dibuat.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        'Name': 'Contoh Creator',
        'Followers': 50000,
        'TikTok URL': 'https://tiktok.com/@username',
        'Instagram URL': 'https://instagram.com/username',
        'Domicile': 'Jakarta',
        'Category': 'Beauty',
        'Rate Card': 1500000
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template Import");
    XLSX.writeFile(wb, "Template_Import_Visibel.xlsx");
  };

  const handleDeleteSelected = async () => {
    if (selectedCreatorIds.length === 0) return;
    
    if (!window.confirm(`Hapus ${selectedCreatorIds.length} creator terpilih?`)) return;

    const originalCreators = [...creators];
    setCreators(creators.filter(c => !selectedCreatorIds.includes(c.id)));
    
    try {
      await deleteCreators(selectedCreatorIds);
      setSelectedCreatorIds([]);
    } catch (err) {
      console.error('Failed to delete from Supabase:', err);
      setCreators(originalCreators); // Rollback
      alert('Gagal menghapus data dari Supabase.');
    }
  };

  const handleDeleteAll = async () => {
    if (creators.length === 0) return;
    if (!window.confirm('PERINGATAN: Apakah Anda yakin ingin menghapus SEMUA data creator? Tindakan ini tidak dapat dibatalkan.')) return;
    
    const originalCreators = [...creators];
    const allIds = creators.map(c => c.id);
    setCreators([]);
    setSelectedCreatorIds([]);
    
    try {
      await deleteCreators(allIds);
    } catch (err) {
      console.error('Failed to delete all from Supabase:', err);
      setCreators(originalCreators); // Rollback
      alert('Gagal menghapus semua data dari Supabase.');
    }
  };

  const handleDeleteCampaign = (id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
  };

  const handleAddCreatorToCampaign = (campaignId: string) => {
    setActiveCampaignId(campaignId);
    setModalSearchQuery('');
    setSelectedModalCreatorIds([]);
    setIsAddCreatorToCampaignModalOpen(true);
  };

  const confirmAddCreatorToCampaign = (creatorId: string) => {
    if (!activeCampaignId) return;
    setCampaigns(prev => prev.map(c => 
      c.id === activeCampaignId ? { ...c, creatorCount: c.creatorCount + 1 } : c
    ));
    setIsAddCreatorToCampaignModalOpen(false);
    setActiveCampaignId(null);
    alert('Creator berhasil ditambahkan ke campaign!');
  };

  const confirmAddMultipleCreatorsToCampaign = () => {
    if (!activeCampaignId || selectedModalCreatorIds.length === 0) return;
    setCampaigns(prev => prev.map(c => 
      c.id === activeCampaignId ? { ...c, creatorCount: c.creatorCount + selectedModalCreatorIds.length } : c
    ));
    setIsAddCreatorToCampaignModalOpen(false);
    setActiveCampaignId(null);
    alert(`${selectedModalCreatorIds.length} Creator berhasil ditambahkan ke campaign!`);
  };

  const handleCampaignFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newCampaign: Partial<Campaign> = {
      id: editingCampaign ? editingCampaign.id : `c-${Math.random().toString(36).substr(2, 9)}`,
      name: campaignFormData.name,
      brandId: role === UserRole.BRAND ? currentBrand!.id : 'admin',
      brandName: role === UserRole.BRAND ? currentBrand!.name : campaignFormData.brand,
      brief: campaignFormData.brief || campaignFormData.brand,
      status: editingCampaign ? editingCampaign.status : CampaignStatus.ACTIVE,
      budget: parseInt(campaignFormData.budget) || 0,
      creatorCount: editingCampaign ? editingCampaign.creatorCount : 0,
      startDate: campaignFormData.startDate,
      endDate: campaignFormData.endDate,
      deadline: campaignFormData.endDate, // Default deadline to end date
      targetNiche: campaignFormData.category,
      targetFollowers: editingCampaign ? editingCampaign.targetFollowers : 0
    };
    
    try {
      const saved = await upsertCampaign(newCampaign);
      if (saved) {
        if (editingCampaign) {
          setCampaigns(campaigns.map(c => c.id === editingCampaign.id ? saved as Campaign : c));
          alert('Campaign berhasil diperbarui!');
        } else {
          setCampaigns([saved, ...campaigns]);
          alert('Campaign berhasil dibuat!');
        }
        setIsCampaignModalOpen(false);
        setEditingCampaign(null);
        setCampaignFormData({ name: '', brand: '', budget: '', startDate: '', endDate: '', category: '', brief: '' });
      }
    } catch (err) {
      console.error('Failed to save campaign:', err);
      alert('Gagal menyimpan campaign.');
    }
  };

  if (viewMode === 'landing') {
    return <LandingPage onEnterApp={() => setViewMode('auth')} />;
  }

  if (viewMode === 'auth') {
    return <AuthPage onAuthSuccess={(session) => {
      setSession(session);
      setViewMode('app');
    }} />;
  }

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Memuat Sesi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        activeView={activeView} 
        onNavigate={setActiveView} 
        onBackToLanding={() => setViewMode('landing')}
        userEmail={session?.user?.email}
        userRole={role}
      />
      
      <main className="flex-1 p-8">
        {role === UserRole.CREATOR && (activeView === 'creators' || activeView === 'my-campaigns') && (
          <CreatorDashboard 
            creator={currentCreator!} 
            campaigns={campaigns} 
            applications={applications}
            onApply={async (campaignId) => {
              const newApp = await applyToCampaign({ 
                id: `app-${Math.random().toString(36).substr(2, 9)}`,
                campaignId, 
                creatorId: currentCreator!.id, 
                status: ApplicationStatus.PENDING,
                paymentStatus: 'UNPAID'
              });
              if (newApp) setApplications([...applications, newApp]);
            }}
            onAcceptBrief={async (id) => {
              const updated = await updateApplicationStatus(id, ApplicationStatus.BRIEF_ACCEPTED);
              if (updated) setApplications(applications.map(a => a.id === id ? updated : a));
            }}
            onRejectBrief={async (id) => {
              const updated = await updateApplicationStatus(id, ApplicationStatus.BRIEF_REJECTED);
              if (updated) setApplications(applications.map(a => a.id === id ? updated : a));
            }}
            onUploadContent={async (id, url) => {
              const updated = await updateApplicationStatus(id, ApplicationStatus.CONTENT_UPLOADED, { submissionUrl: url });
              if (updated) setApplications(applications.map(a => a.id === id ? updated : a));
            }}
          />
        )}

        {role === UserRole.BRAND && (activeView === 'creators' || activeView === 'my-campaigns') && (
          <BrandDashboard 
            brand={currentBrand!}
            campaigns={campaigns.filter(c => c.brandId === currentBrand!.id)}
            applications={applications.filter(a => campaigns.find(c => c.id === a.campaignId && c.brandId === currentBrand!.id))}
            creators={creators}
            onCreateCampaign={() => setIsCampaignModalOpen(true)}
            onAcceptApplication={async (id) => {
              const updated = await updateApplicationStatus(id, ApplicationStatus.ACCEPTED);
              if (updated) setApplications(applications.map(a => a.id === id ? updated : a));
            }}
            onRejectApplication={async (id) => {
              const updated = await updateApplicationStatus(id, ApplicationStatus.REJECTED);
              if (updated) setApplications(applications.map(a => a.id === id ? updated : a));
            }}
            onSendBrief={async (id) => {
              const updated = await updateApplicationStatus(id, ApplicationStatus.BRIEF_SENT);
              if (updated) setApplications(applications.map(a => a.id === id ? updated : a));
            }}
            onApproveContent={async (id) => {
              const updated = await updateApplicationStatus(id, ApplicationStatus.CONTENT_APPROVED);
              if (updated) setApplications(applications.map(a => a.id === id ? updated : a));
            }}
            onRejectContent={async (id) => {
              const updated = await updateApplicationStatus(id, ApplicationStatus.PENDING);
              if (updated) setApplications(applications.map(a => a.id === id ? updated : a));
            }}
            onRateCreator={async (id, rating, feedback) => {
              const updated = await updateApplicationStatus(id, ApplicationStatus.PAID, { rating, feedback });
              if (updated) setApplications(applications.map(a => a.id === id ? updated : a));
            }}
            onPublishCampaign={async (id) => {
              try {
                const updated = await updateCampaign(id, { status: CampaignStatus.ACTIVE });
                if (updated) {
                  setCampaigns(campaigns.map(c => c.id === id ? { ...c, status: CampaignStatus.ACTIVE } : c));
                  alert('Campaign berhasil diaktifkan!');
                }
              } catch (err) {
                console.error('Failed to publish campaign:', err);
                alert('Gagal mengaktifkan campaign. Pastikan semua data wajib terisi.');
              }
            }}
            onEditCampaign={(campaign) => {
              setEditingCampaign(campaign);
              setCampaignFormData({
                name: campaign.name,
                brand: campaign.brandName,
                budget: campaign.budget.toString(),
                startDate: campaign.startDate,
                endDate: campaign.endDate,
                category: campaign.targetNiche,
                brief: campaign.brief
              });
              setIsCampaignModalOpen(true);
            }}
          />
        )}

        {role === UserRole.CREATOR && activeView === 'home' && (
          <CreatorHome 
            creator={currentCreator!} 
            campaigns={campaigns} 
            applications={applications} 
            onNavigate={setActiveView}
            onApply={async (campaignId) => {
              const newApp = await applyToCampaign({ 
                id: `app-${Math.random().toString(36).substr(2, 9)}`,
                campaignId, 
                creatorId: currentCreator!.id, 
                status: ApplicationStatus.PENDING,
                paymentStatus: 'UNPAID'
              });
              if (newApp) {
                setApplications([...applications, newApp]);
                alert('Berhasil apply ke campaign!');
              }
            }}
          />
        )}

        {role === UserRole.CREATOR && activeView === 'profile' && (
          <ProfileEditor 
            creator={currentCreator!} 
            onSave={async (data) => {
              const updated = await upsertCreators([{ ...currentCreator!, ...data }]);
              if (updated) setCreators(creators.map(c => c.id === currentCreator!.id ? updated[0] : c));
              alert('Profil berhasil disimpan!');
            }}
          />
        )}

        {role === UserRole.ADMIN && (
          <>
            <header className="mb-8 flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {activeView === 'creators' ? 'List Creator' : activeView === 'campaigns' ? 'Campaigns Database' : 'Analytics'}
                </h2>
                <p className="text-slate-500 text-sm">
                  {activeView === 'creators' 
                    ? 'Hubungkan brand dengan creator terbaik melalui data cerdas.' 
                    : 'Kelola dan pantau performa kampanye influencer Anda secara menyeluruh.'}
                </p>
              </div>
              <div className="flex flex-col items-end space-y-4">
                <div className="flex items-center space-x-2">
                  {activeView === 'creators' && (
                    <>
                      {selectedCreatorIds.length > 0 && (
                        <button onClick={handleDeleteSelected} className="px-4 py-2 bg-red-50 text-red-600 border border-red-100 text-xs font-bold rounded-lg hover:bg-red-100 transition-all flex items-center space-x-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                          <span>Hapus ({selectedCreatorIds.length})</span>
                        </button>
                      )}
                      {role === UserRole.ADMIN && creators.length > 0 && (
                        <button onClick={handleDeleteAll} className="px-4 py-2 bg-white text-red-600 border border-red-100 text-xs font-bold rounded-lg hover:bg-red-50 transition-all flex items-center space-x-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                          <span>Hapus Semua</span>
                        </button>
                      )}
                      <button onClick={openAddModal} className="px-4 py-2 bg-yellow-400 text-black text-xs font-black rounded-lg hover:bg-yellow-500 transition-colors shadow-sm flex items-center space-x-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path>
                        </svg>
                        <span>Tambah</span>
                      </button>
                      <button onClick={handleDownloadTemplate} className="px-4 py-2 bg-white text-slate-700 border border-slate-200 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors flex items-center space-x-1"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg><span>Template</span></button>
                      <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-white text-slate-700 border border-slate-200 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors flex items-center space-x-1"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg><span>Import</span></button>
                      <input type="file" ref={fileInputRef} onChange={handleImport} accept=".xlsx, .xls, .csv" className="hidden" />
                    </>
                  )}
                  {activeView === 'campaigns' && (
                    <button onClick={() => setIsCampaignModalOpen(true)} className="px-4 py-2 bg-yellow-400 text-black text-xs font-black rounded-lg hover:bg-yellow-500 transition-colors shadow-sm flex items-center space-x-1"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg><span>Buat Campaign</span></button>
                  )}
                </div>
              </div>
            </header>

            <section className="mb-10">
              <form onSubmit={handleAiSearch} className="relative group">
                <div className="flex items-stretch bg-white border border-slate-200 rounded-2xl shadow-xl shadow-yellow-100/20 focus-within:ring-2 focus-within:ring-yellow-400 transition-all overflow-hidden">
                  {activeView === 'creators' && (
                    <div className="relative border-r border-slate-100 bg-slate-50/50">
                      <select value={activeFilters.tier || ''} onChange={(e) => setActiveFilters(prev => ({...prev, tier: e.target.value as CreatorTier || undefined}))} className="appearance-none bg-transparent pl-4 pr-10 py-4 text-sm font-bold text-slate-700 focus:outline-none cursor-pointer h-full"><option value="">Semua Tier</option><option value="NANO">Nano</option><option value="MIKRO">Mikro</option><option value="MAKRO">Makro</option><option value="MEGA">Mega</option></select>
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></div>
                    </div>
                  )}
                  <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><svg className="h-5 w-5 text-yellow-500 group-focus-within:text-yellow-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div>
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={activeView === 'creators' ? "Cari cerdas: 'Creator di Jakarta'..." : "Cari campaign atau brand..."} className="block w-full pl-12 pr-32 py-4 bg-transparent focus:outline-none" />
                    <div className="absolute inset-y-0 right-0 p-2 flex space-x-2">
                      <button type="submit" disabled={isAiLoading || activeView !== 'creators'} className="bg-black text-yellow-400 px-6 py-2 rounded-xl font-black text-sm hover:bg-slate-800 transition-all disabled:opacity-50">{isAiLoading ? 'Wait...' : 'AI Search'}</button>
                    </div>
                  </div>
                </div>
              </form>
            </section>

            {activeView === 'creators' ? (
              <CreatorTable creators={paginatedCreators} userRole={role} selectedCreatorIds={selectedCreatorIds} onSelectionChange={setSelectedCreatorIds} onEdit={openEditModal} />
            ) : activeView === 'campaigns' ? (
              <CampaignTable campaigns={paginatedCampaigns} onDelete={handleDeleteCampaign} onAddCreator={handleAddCreatorToCampaign} />
            ) : (
              <div className="text-center py-20 text-slate-400 font-bold">Analytics is coming soon!</div>
            )}

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between bg-white px-8 py-5 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50">
                <div className="text-sm text-slate-500">Halaman <span className="font-bold text-slate-900">{currentPage}</span> dari <span className="font-bold text-slate-900">{totalPages}</span></div>
                <div className="flex items-center space-x-3">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-yellow-600 border border-slate-100 disabled:opacity-30 transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg></button>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-yellow-600 border border-slate-100 disabled:opacity-30 transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg></button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50"><h3 className="text-xl font-black text-slate-900 tracking-tight">{editingCreator ? 'Edit Data Creator' : 'Tambah Creator Baru'}</h3><button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>
            <form onSubmit={handleFormSubmit} className="p-8 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nama Creator</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-yellow-100 focus:border-yellow-400 transition-all" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Followers</label>
                  <input required type="number" value={formData.followers} onChange={e => setFormData({...formData, followers: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-yellow-100 focus:border-yellow-400 transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Domisili</label>
                  <input required type="text" value={formData.domicile} onChange={e => setFormData({...formData, domicile: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-yellow-100 focus:border-yellow-400 transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Kategori / Niche</label>
                <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g. Beauty, Tech, Food" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-yellow-100 focus:border-yellow-400 transition-all" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">TikTok URL</label>
                  <input type="url" value={formData.tiktokUrl} onChange={e => setFormData({...formData, tiktokUrl: e.target.value})} placeholder="https://..." className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-yellow-100 focus:border-yellow-400 transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Instagram URL</label>
                  <input type="url" value={formData.instagramUrl} onChange={e => setFormData({...formData, instagramUrl: e.target.value})} placeholder="https://..." className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-yellow-100 focus:border-yellow-400 transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Rate Card (Opsional)</label>
                <input type="number" value={formData.rateCard} onChange={e => setFormData({...formData, rateCard: e.target.value})} placeholder="Masukkan nominal (boleh dikosongkan)" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-yellow-100 focus:border-yellow-400 transition-all" />
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full py-4 bg-yellow-400 text-black font-black rounded-2xl shadow-xl hover:bg-yellow-500 active:scale-[0.97] transition-all uppercase text-xs tracking-widest">
                  {editingCreator ? 'Update Creator' : 'Simpan Creator'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isCampaignModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                {editingCampaign ? 'Edit Campaign' : 'Buat Campaign Baru'}
              </h3>
              <button 
                onClick={() => {
                  setIsCampaignModalOpen(false);
                  setEditingCampaign(null);
                  setCampaignFormData({ name: '', brand: '', budget: '', startDate: '', endDate: '', category: '', brief: '' });
                }} 
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <form onSubmit={handleCampaignFormSubmit} className="p-8 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nama Campaign</label>
                <input required type="text" value={campaignFormData.name} onChange={e => setCampaignFormData({...campaignFormData, name: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-yellow-100 focus:border-yellow-400 transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Brand</label>
                <input required type="text" value={campaignFormData.brand} onChange={e => setCampaignFormData({...campaignFormData, brand: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-yellow-100 focus:border-yellow-400 transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Brief / Deskripsi</label>
                <textarea required value={campaignFormData.brief} onChange={e => setCampaignFormData({...campaignFormData, brief: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-yellow-100 focus:border-yellow-400 transition-all min-h-[100px]" placeholder="Jelaskan detail campaign Anda..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Budget</label>
                  <input required type="number" value={campaignFormData.budget} onChange={e => setCampaignFormData({...campaignFormData, budget: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-yellow-100 focus:border-yellow-400 transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Kategori</label>
                  <input required type="text" value={campaignFormData.category} onChange={e => setCampaignFormData({...campaignFormData, category: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-yellow-100 focus:border-yellow-400 transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Mulai</label>
                  <input required type="date" value={campaignFormData.startDate} onChange={e => setCampaignFormData({...campaignFormData, startDate: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-yellow-100 focus:border-yellow-400 transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Selesai</label>
                  <input required type="date" value={campaignFormData.endDate} onChange={e => setCampaignFormData({...campaignFormData, endDate: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-yellow-100 focus:border-yellow-400 transition-all" />
                </div>
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full py-4 bg-yellow-400 text-black font-black rounded-2xl shadow-xl hover:bg-yellow-500 active:scale-[0.97] transition-all uppercase text-xs tracking-widest">
                  {editingCampaign ? 'Update Campaign' : 'Buat Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isAddCreatorToCampaignModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Pilih Creator untuk Campaign</h3>
              <button onClick={() => setIsAddCreatorToCampaignModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="px-8 py-4 border-b border-slate-50 bg-white sticky top-0 z-10 space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  placeholder="Cari nama atau kategori..." 
                  value={modalSearchQuery}
                  onChange={(e) => setModalSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 transition-all text-sm"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-500">
                  {selectedModalCreatorIds.length} Creator terpilih
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      const filtered = creators.filter(c => 
                        c.name.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
                        c.category.toLowerCase().includes(modalSearchQuery.toLowerCase())
                      );
                      if (selectedModalCreatorIds.length === filtered.length) {
                        setSelectedModalCreatorIds([]);
                      } else {
                        setSelectedModalCreatorIds(filtered.map(c => c.id));
                      }
                    }}
                    className="text-[10px] font-black uppercase tracking-widest text-yellow-600 hover:text-yellow-700"
                  >
                    {selectedModalCreatorIds.length === creators.filter(c => 
                      c.name.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
                      c.category.toLowerCase().includes(modalSearchQuery.toLowerCase())
                    ).length ? 'Batal Semua' : 'Pilih Semua'}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-8 max-h-[50vh] overflow-y-auto">
              <div className="grid grid-cols-1 gap-4">
                {creators
                  .filter(c => 
                    c.name.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
                    c.category.toLowerCase().includes(modalSearchQuery.toLowerCase())
                  )
                  .map(creator => (
                    <div 
                      key={creator.id} 
                      onClick={() => {
                        if (selectedModalCreatorIds.includes(creator.id)) {
                          setSelectedModalCreatorIds(prev => prev.filter(id => id !== creator.id));
                        } else {
                          setSelectedModalCreatorIds(prev => [...prev, creator.id]);
                        }
                      }}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group
                        ${selectedModalCreatorIds.includes(creator.id) 
                          ? 'bg-yellow-50 border-yellow-400 shadow-md shadow-yellow-100' 
                          : 'bg-slate-50 border-slate-100 hover:border-yellow-200'}`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors
                          ${selectedModalCreatorIds.includes(creator.id) ? 'bg-yellow-400 border-yellow-400' : 'bg-white border-slate-200'}`}
                        >
                          {selectedModalCreatorIds.includes(creator.id) && (
                            <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className={`px-2 py-1 rounded-md text-[10px] font-black border uppercase tracking-tighter w-16 text-center
                          ${creator.tier === CreatorTier.MEGA ? 'bg-purple-100 text-purple-800 border-purple-200' : 
                            creator.tier === CreatorTier.MAKRO ? 'bg-blue-100 text-blue-800 border-blue-200' : 
                            creator.tier === CreatorTier.MIKRO ? 'bg-green-100 text-green-800 border-green-200' : 
                            'bg-gray-100 text-gray-800 border-gray-200'}`}
                        >
                          {creator.tier}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{creator.name}</div>
                          <div className="text-xs text-slate-500">{creator.category} • {creator.followers.toLocaleString()} Followers</div>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmAddCreatorToCampaign(creator.id);
                        }}
                        className="px-4 py-2 bg-white border border-slate-200 text-black text-[10px] font-black rounded-xl hover:bg-yellow-400 hover:border-yellow-400 transition-all uppercase tracking-widest"
                      >
                        Pilih
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {selectedModalCreatorIds.length > 0 && (
              <div className="p-8 border-t border-slate-50 bg-slate-50/50">
                <button 
                  onClick={confirmAddMultipleCreatorsToCampaign}
                  className="w-full py-4 bg-yellow-400 text-black font-black rounded-2xl shadow-xl hover:bg-yellow-500 active:scale-[0.97] transition-all uppercase text-xs tracking-widest"
                >
                  Konfirmasi Tambah {selectedModalCreatorIds.length} Creator
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
