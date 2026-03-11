import { Toaster } from "sonner"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from './Lib/Query-Client'
import { pagesConfig } from './Pages.config'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './Lib/PageNotFound';
import ErrorBoundary from './Components/ErrorBoundary';
import AdminLogin from './Components/Admin/AdminLogin';
import AdminLayout from './Components/Admin/AdminLayout';
import AdminDashboard from './Components/Admin/AdminDashboard';
import AdminPosts from './Components/Admin/AdminPosts';
import AdminPostEditor from './Components/Admin/AdminPostEditor';
import AdminAnalytics from './Components/Admin/AdminAnalytics';
import AdminUsers from './Components/Admin/AdminUsers';
import AdminSettings from './Components/Admin/AdminSettings';
import AdminPortfolio from './Components/Admin/AdminPortfolio';
import AdminProjectEditor from './Components/Admin/AdminProjectEditor';
import { adminAuth } from './Lib/admin-auth';

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

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <Routes>
            <Route path="/" element={
              <LayoutWrapper currentPageName={mainPageKey}>
                <MainPage />
              </LayoutWrapper>
            } />
            {Object.entries(Pages).map(([path, Page]) => (
              <Route
                key={path}
                path={`/${path}`}
                element={
                  <LayoutWrapper currentPageName={path}>
                    <Page />
                  </LayoutWrapper>
                }
              />
            ))}

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                adminAuth.isAuthenticated() ? (
                  <AdminLayout />
                ) : (
                  <Navigate to="/admin/login" replace />
                )
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
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
