import { Toaster } from "sonner"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from './lib/query-client'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import PageNotFound from './lib/pagenotfound';
import ErrorBoundary from './components/errorboundary';
import AdminLogin from './components/admin/adminlogin';
import AdminLayout from './components/admin/adminlayout';
import AdminDashboard from './components/admin/admindashboard';
import AdminPosts from './components/admin/adminposts';
import AdminPostEditor from './components/admin/adminposteditor';
import AdminAnalytics from './components/admin/adminanalytics';
import AdminUsers from './components/admin/adminusers';
import AdminSettings from './components/admin/adminsettings';
import AdminPortfolio from './components/admin/adminportfolio';
import AdminProjectEditor from './components/admin/adminprojecteditor';
import AdminInquiries from './components/admin/admininquiries'; // Added
import Maintenance from './components/maintenance';
import { adminAuth } from './lib/admin-auth';
import { appConfig, syncAppConfig } from './lib/config';
import { useState, useEffect } from 'react';
import CustomCursor from './components/CustomCursor';
import { useLocation } from 'react-router-dom';

const AnalyticsTracker = () => {
  const location = useLocation();
  useEffect(() => {
    // Unique Visitor ID for better accuracy
    let visitorId = localStorage.getItem('creatalab_visitor_id');
    if (!visitorId) {
      visitorId = 'v_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
      localStorage.setItem('creatalab_visitor_id', visitorId);
    }

    // Fire and forget page view tracking
    fetch(`${appConfig.api.base}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        path: location.pathname,
        visitorId,
        referrer: document.referrer || 'direct'
      })
    }).catch(() => {});
  }, [location]);
  return null;
};

// Reactive auth guard — re-checks localStorage on every render
const ProtectedAdminRoute = () => {
  const isAuth = adminAuth.isAuthenticated();
  return isAuth ? <AdminLayout /> : <Navigate to="/admin/login" replace />;
};

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

import PropTypes from 'prop-types';

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

LayoutWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  currentPageName: PropTypes.string,
};

function App() {
  const [maintenance, setMaintenance] = useState({ active: false, message: '' });
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    // Global error tracking for debugging on Vercel
    const handleError = (e) => console.error('Global Runtime Error:', e);
    const handleRejection = (e) => console.error('Unhandled Promise Rejection:', e);
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    
    console.log('App initialization - config:', { appConfig, pagesConfig });

    const syncSystem = async () => {
      try {
        const response = await fetch(`${appConfig.api.base}/settings`);
        if (response.ok) {
          const data = await response.json();
          if (data.maintenance_mode) setMaintenance(data.maintenance_mode);
          // Sync global config (branding, socials)
          syncAppConfig(data);
        } else {
          console.warn('System sync failed with status:', response.status);
        }
      } catch (err) {
        console.error('System synchronization failed:', err);
      } finally {
        setIsSyncing(false);
      }
    };
    
    // Initial sync
    syncSystem();
    
    // Poll every 5 seconds so updates reflect instantly without page refresh
    const syncInterval = setInterval(syncSystem, 5000);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
      clearInterval(syncInterval);
    };
  }, []);

  return (
    <ErrorBoundary>
      <CustomCursor />
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AnalyticsTracker />
          <Routes>
            <Route path="/" element={
              isSyncing ? (
                <div className="fixed inset-0 bg-[#050508] flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                </div>
              ) : maintenance.active ? (
                <Maintenance message={maintenance.message} />
              ) : (
                <LayoutWrapper currentPageName={mainPageKey}>
                  <MainPage />
                </LayoutWrapper>
              )
            } />
            {Object.entries(Pages).map(([path, Page]) => (
              <Route
                key={path}
                path={`/${path}`}
                element={
                  maintenance.active ? (
                    <Maintenance message={maintenance.message} />
                  ) : (
                    <LayoutWrapper currentPageName={path}>
                      <Page />
                    </LayoutWrapper>
                  )
                }
              />
            ))}

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedAdminRoute />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="inquiries" element={<AdminInquiries />} />
              <Route path="posts" element={<AdminPosts />} />
              <Route path="posts/new" element={<AdminPostEditor mode="create" />} />
              <Route path="posts/edit/:id" element={<AdminPostEditor mode="edit" />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="portfolio" element={<AdminPortfolio />} />
              <Route path="portfolio/new" element={<AdminProjectEditor mode="create" />} />
              <Route path="portfolio/edit/:id" element={<AdminProjectEditor mode="edit" />} />
            </Route>

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#111118',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
            },
          }}
        />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
