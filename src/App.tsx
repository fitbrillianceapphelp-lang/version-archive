import React, { useEffect, useState, Component, ErrorInfo, ReactNode } from 'react';
import { HomeSection } from './components/HomeSection';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
// Standalone container stubs for platform analytics
const SpeedInsights: React.FC = () => null;
const Analytics: React.FC = () => null;
import { useAnalyticsTracker } from './lib/analytics';
import { useSecurityShield } from './lib/security';
import { ConsultationOption, UserAccount, Language } from './types';
import { getTranslation } from './i18n/translations';

// Direct synchronous imports for instant 0ms tab switching and zero chunk-loading stalls
import { PioneerMediaHub } from './modules/pioneers';
import { BalancedSafeSpace } from './modules/balanced';
import { FamilyIdentitySection } from './components/FamilyIdentitySection';
import { FreeConsultationForm } from './components/FreeConsultationForm';
import { ClientAssessmentForm } from './components/ClientAssessmentForm';
import { TeamApplicationForm } from './components/TeamApplicationForm';
import { ClientAccountPortal } from './components/ClientAccountPortal';
import { PlansSection } from './components/PlansSection';
import { ContactCenter } from './components/ContactCenter';
import { ReviewsSection } from './components/ReviewsSection';
import { SovereignCommandCenter } from './components/SovereignCommandCenter';
import { SovereignAuthGate } from './components/SovereignAuthGate';
import { isSovereignAuthorized, revokeSovereignAuth } from './lib/cryptoAuth';
import { ProjectViewerModal } from './components/ProjectViewerModal';
import { WhosSerag } from './components/WhosSerag';
import { ProjectDiagnostic99 } from './components/ProjectDiagnostic99';
import { SquadPartnerVetting } from './components/SquadPartnerVetting';
import { GovernancePoliciesView } from './components/GovernancePoliciesView';
import { FloatingAudioJourney } from './components/FloatingAudioJourney';
import { SiteOnboardingTour } from './components/SiteOnboardingTour';
import { OfflineIndicator } from './components/OfflineIndicator';
import { GhostSecurityTrigger } from './components/GhostSecurityTrigger';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class SectionErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Section Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 font-bold text-xl">
            !
          </div>
          <h3 className="text-lg font-bold text-white">حدث خطأ في تحميل هذا القسم</h3>
          <p className="text-xs text-slate-400 max-w-md">
            تم تسجيل الخطأ، يرجى تحديث الصفحة أو العودة إلى الصفحة الرئيسية.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            تحديث الصفحة الآن
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  useAnalyticsTracker();
  useSecurityShield();

  const [activeTab, setActiveTab] = useState<string>('home');
  const [lang, setLang] = useState<Language>('ar');
  const [consultationOption, setConsultationOption] = useState<ConsultationOption>('improvement_plan');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [viewingProjectCode, setViewingProjectCode] = useState<string | null>(null);
  const [isHqAuthorized, setIsHqAuthorized] = useState<boolean>(() => isSovereignAuthorized());

  const t = getTranslation(lang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    const savedUser = localStorage.getItem('fitbrilliance_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('fitbrilliance_user');
      }
    }
  }, []);

  useEffect(() => {
    const handleUrlRoute = () => {
      const hash = window.location.hash.replace('#', '').trim();
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      const target = hash || tabParam;

      const validTabs = [
        'home',
        'whos-serag',
        'diagnostic-99',
        'squad-vetting',
        'family-identity',
        'plans',
        'policies',
        'consultation',
        'assessment',
        'team-app',
        'reviews',
        'contact',
        'account',
        'pioneers',
        'balanced',
        'hq',
        'admin',
      ];

      if (target && validTabs.includes(target)) {
        setActiveTab(target);
      }
    };

    handleUrlRoute();
    window.addEventListener('hashchange', handleUrlRoute);
    window.addEventListener('popstate', handleUrlRoute);

    return () => {
      window.removeEventListener('hashchange', handleUrlRoute);
      window.removeEventListener('popstate', handleUrlRoute);
    };
  }, []);

  const handleTabChange = (tab: string, option?: string) => {
    setActiveTab(tab);
    if (tab === 'home') {
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname);
      }
    } else {
      window.location.hash = tab;
    }

    // Report navigation visit to real-time analytics audit
    fetch("/api/analytics/log-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: tab === 'home' ? '/' : `#${tab}`,
        eventType: tab === 'hq' || tab === 'admin' ? 'hq_tab_open' : 'tab_navigate',
      }),
    }).catch(() => {});

    if (
      option === 'activity_analysis' ||
      option === 'improvement_plan' ||
      option === 'event_filming' ||
      option === 'academic_research'
    ) {
      setConsultationOption(option as ConsultationOption);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const handleToggleLanguage = () => setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    localStorage.setItem('fitbrilliance_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('fitbrilliance_user');
    setActiveTab('home');
  };

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#090d0e] text-[#f4f0e7] font-sans select-none flex flex-col justify-between relative overflow-x-hidden"
    >
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        currentUser={currentUser}
        onLogout={handleLogout}
        lang={lang}
        onToggleLanguage={handleToggleLanguage}
      />

      <main className="max-w-7xl mx-auto px-4 md:px-8 w-full flex-1">
        <SectionErrorBoundary>
          {activeTab === 'home' && (
            <HomeSection
              setActiveTab={handleTabChange}
              onOpenProjectCode={(code) => setViewingProjectCode(code)}
              lang={lang}
            />
          )}

          {viewingProjectCode && (
            <ProjectViewerModal
              initialCode={viewingProjectCode}
              onClose={() => setViewingProjectCode(null)}
              lang={lang}
            />
          )}

          {activeTab === 'family-identity' && <FamilyIdentitySection lang={lang} setActiveTab={handleTabChange} />}
          {activeTab === 'assessment' && <ClientAssessmentForm setActiveTab={handleTabChange} lang={lang} />}
          {activeTab === 'consultation' && (
            <FreeConsultationForm initialOption={consultationOption} setActiveTab={handleTabChange} lang={lang} />
          )}
          {activeTab === 'team-app' && <TeamApplicationForm onSuccessSubmitted={() => { }} lang={lang} />}
          {activeTab === 'plans' && <PlansSection setActiveTab={handleTabChange} lang={lang} />}
          {activeTab === 'account' && (
            <ClientAccountPortal
              currentUser={currentUser}
              onLoginSuccess={handleLoginSuccess}
              setActiveTab={handleTabChange}
              lang={lang}
            />
          )}
          {activeTab === 'reviews' && <ReviewsSection lang={lang} />}
          {activeTab === 'contact' && <ContactCenter lang={lang} />}
          {activeTab === 'pioneers' && <PioneerMediaHub lang={lang} onBackToHub={() => handleTabChange('home')} />}
          {activeTab === 'balanced' && <BalancedSafeSpace lang={lang} onBackToHub={() => handleTabChange('home')} />}
          {activeTab === 'whos-serag' && <WhosSerag lang={lang} setActiveTab={handleTabChange} />}
          {activeTab === 'diagnostic-99' && <ProjectDiagnostic99 setActiveTab={handleTabChange} lang={lang} />}
          {activeTab === 'squad-vetting' && <SquadPartnerVetting setActiveTab={handleTabChange} lang={lang} />}
          {activeTab === 'policies' && <GovernancePoliciesView setActiveTab={handleTabChange} lang={lang} />}
          {(activeTab === 'hq' || activeTab === 'admin') && (
            !isHqAuthorized ? (
              <SovereignAuthGate
                onAuthenticated={() => setIsHqAuthorized(true)}
                onCancel={() => handleTabChange('home')}
              />
            ) : (
              <SovereignCommandCenter
                onClose={() => {
                  revokeSovereignAuth();
                  setIsHqAuthorized(false);
                  handleTabChange('home');
                }}
              />
            )
          )}
        </SectionErrorBoundary>
      </main>

      <Footer setActiveTab={handleTabChange} lang={lang} />
      <FloatingAudioJourney />
      <SiteOnboardingTour lang={lang} onNavigateTab={handleTabChange} />
      <OfflineIndicator />
      <GhostSecurityTrigger lang={lang} />
      <SpeedInsights />
      <Analytics />
    </div>
  );
}
