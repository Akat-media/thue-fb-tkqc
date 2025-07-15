import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import MarketplacePage from './pages/marketplace/MarketplacePage';
import RentalsPage from './pages/rentals/RentalsPage';
import PaymentPage from './pages/payment/PaymentPage';
import AddAccountPage from './pages/marketplace/AddAccountPage.tsx';
import PaymentForm from './pages/marketplace/PaymentForm.tsx';
import ManageAdsAccount from './pages/admin/ManageAdsAccount';
import AdminTransactionsPage from './pages/admin/AdminTransactionsPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import ProfilePage from './pages/profile/Profile.tsx';
import ProtectedRoute from './routes/ProtectedRoute';
import Policy from './pages/policy/Policy.tsx';
import AdminProfilePage from './pages/profile/AdminProfilePage.tsx';
import AdminSupport from './pages/support/AdminSupport';
import NotificationOverlay from './pages/notify/NotificationOverlay.tsx';
import Account from './pages/admin/account/Account.tsx';
import PasswordResetForm from './pages/auth/PasswordResetForm.tsx';
import CreateBotPage from './pages/bot/CreateBotPage';
import PolicyManagement from './pages/admin/PolicyManagement';
import ListSupport from './pages/support/ListSupport.tsx';
import RequestForm from './pages/support/RequestForm.tsx';
import SupportTicketDetail from './pages/support/SupportTicketDetail.tsx';
import PricingPage from './pages/Princing.tsx';
import PricingManagement from './pages/admin/manager/budget/PricingManagement.tsx';
import Layout from './components/layout/Layout.tsx';
import { useUserStore } from './stores/useUserStore.ts';
import RentalsManagement from './pages/admin/RentalsManagement';
import VoucherManager from './pages/admin/manager/voucher/VoucherManager.tsx';
import TicketPage from './pages/profile/Ticket.tsx';
import PriceList from './pages/pricelist/PriceList.tsx';
import SettingsPage from './pages/admin/Settings.tsx';
import Navbar from './components/layout/Navbar.tsx';
import Paypal from './pages/paypal/index.tsx';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import NotFoundPage from './pages/404/NotFoundPage.tsx';
import { usePageStore } from './stores/usePageStore.ts';
import PopupWelcome from './components/layout/PopupWelcome.tsx';
import CashBackManagement from './pages/admin/CashBackManagement.tsx';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};
function AppRoutes() {
  const userobj = useUserStore((state) => state.user);
  const { i18n } = useTranslation();
  const location = useLocation();
  const is404 = usePageStore((state) => state.is404);
  const hideNavbarRoutes = ['/', '/dashboard', '/login', '/register'];
  const isHideNavbar = hideNavbarRoutes.includes(location.pathname) || is404;

  useEffect(() => {
    const savedLang = localStorage.getItem('languageChoose');
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
    AOS.init({
      duration: 800, // thời gian hiệu ứng (ms)
      once: false,
    });
  }, []);
  return (
    <NotificationProvider>
      <PopupWelcome />
      {!isHideNavbar && <Navbar />}
      <Layout role={userobj?.role}>
        <ScrollToTop />
        <Routes>
          {/* Route công khai: Không yêu cầu đăng nhập */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<HomePage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/reset-password" element={<PasswordResetForm />} />
          <Route path="/princing" element={<PricingPage />} />
          <Route path="/price" element={<PriceList />} />
          {/* Route yêu cầu đăng nhập */}
          <Route element={<ProtectedRoute />}>
            <Route path="/add-account" element={<AddAccountPage />} />
            <Route path="/rentals" element={<RentalsPage />} />
            <Route path="/payments" element={<PaymentPage />} />
            <Route path="/deposit" element={<PaymentForm />} />
            <Route path="/adsaccountmanager" element={<ManageAdsAccount />} />
            <Route
              path="/admintransaction"
              element={<AdminTransactionsPage />}
            />
            <Route path="/usermanage" element={<UserManagementPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin/profile" element={<AdminProfilePage />} />
            <Route path="/admin/support" element={<AdminSupport />} />
            <Route path="/admin/policy" element={<PolicyManagement />} />
            <Route path="/admin/princing" element={<PricingManagement />} />
            <Route path="/admin/rentals" element={<RentalsManagement />} />
            <Route path="/admin/voucher" element={<VoucherManager />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
            <Route
              path="/admin/notifications"
              element={<NotificationOverlay />}
            />
            <Route path="/admin/account" element={<Account />} />
            <Route path="/create-bot" element={<CreateBotPage />} />
            <Route path="/admin-cashback" element={<CashBackManagement />} />
            <Route path="/support">
              <Route index element={<ListSupport />} />
              <Route path="create" element={<RequestForm />} />
              <Route path=":id" element={<SupportTicketDetail />} />
            </Route>

            <Route path="/ticket" element={<TicketPage />} />
            <Route path="/paypal-verify" element={<Paypal />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </NotificationProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
