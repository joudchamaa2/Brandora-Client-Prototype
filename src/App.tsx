import { AnimatePresence, motion } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import { PresentationBar, rememberPath } from './components/shared/PresentationBar'
import { useBusiness } from './context/BusinessContext'
import { BusinessDashboardLayout } from './layouts/BusinessDashboardLayout'
import { BusinessOnboardingLayout } from './layouts/BusinessOnboardingLayout'
import { CustomerLayout } from './layouts/CustomerLayout'
import { NotFound } from './pages/NotFound'

import { AccountScreen } from './pages/customer/AccountScreen'
import { AccountSectionScreen } from './pages/customer/AccountSectionScreen'
import { CartScreen } from './pages/customer/CartScreen'
import { CategoryScreen } from './pages/customer/CategoryScreen'
import { CheckoutScreen } from './pages/customer/CheckoutScreen'
import { ConfirmationScreen } from './pages/customer/ConfirmationScreen'
import { FavoritesScreen } from './pages/customer/FavoritesScreen'
import { HomeScreen } from './pages/customer/HomeScreen'
import { IntroScreen } from './pages/customer/IntroScreen'
import { OrdersScreen } from './pages/customer/OrdersScreen'
import { ProductScreen } from './pages/customer/ProductScreen'
import { SearchScreen } from './pages/customer/SearchScreen'
import { SplashScreen } from './pages/customer/SplashScreen'
import { StoreScreen } from './pages/customer/StoreScreen'
import { TrackingScreen } from './pages/customer/TrackingScreen'

import { AnalyticsPage } from './pages/business/dashboard/AnalyticsPage'
import { BuilderPage } from './pages/business/dashboard/BuilderPage'
import { InventoryPage } from './pages/business/dashboard/InventoryPage'
import { OffersPage } from './pages/business/dashboard/OffersPage'
import { OrdersAdminPage } from './pages/business/dashboard/OrdersAdminPage'
import { OverviewPage } from './pages/business/dashboard/OverviewPage'
import { ProductsAdminPage } from './pages/business/dashboard/ProductsAdminPage'
import { StaffPage } from './pages/business/dashboard/StaffPage'
import { SubscriptionPage } from './pages/business/dashboard/SubscriptionPage'
import { BrandingPage } from './pages/business/onboarding/BrandingPage'
import { GeneratePage } from './pages/business/onboarding/GeneratePage'
import { OnboardingPage } from './pages/business/onboarding/OnboardingPage'
import { PaymentPage } from './pages/business/onboarding/PaymentPage'
import { PlansPage } from './pages/business/onboarding/PlansPage'
import { PreviewPage } from './pages/business/onboarding/PreviewPage'
import { SubmittedPage } from './pages/business/onboarding/SubmittedPage'
import { ThemePage } from './pages/business/onboarding/ThemePage'

/** /business → resume where the presenter left off */
function BusinessIndex() {
  const { submitted } = useBusiness()
  return <Navigate to={submitted ? '/business/dashboard' : '/business/onboarding'} replace />
}

export default function App() {
  const location = useLocation()
  const experience = location.pathname.startsWith('/business') ? 'business' : 'customer'
  rememberPath(experience, location.pathname)

  return (
    <div className="app-backdrop flex min-h-dvh flex-col">
      <PresentationBar experience={experience} />
      <AnimatePresence mode="wait">
        <motion.div
          key={experience}
          className="flex min-h-0 flex-1 flex-col"
          initial={{ opacity: 0, y: 14, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
          exit={{ opacity: 0, y: -8, scale: 0.99, transition: { duration: 0.2 } }}
        >
          <Routes location={location}>
            <Route path="/" element={<Navigate to="/customer" replace />} />

            {/* ---------------------------- Customer app ---------------------------- */}
            <Route path="/customer" element={<CustomerLayout />}>
              <Route index element={<SplashScreen />} />
              <Route path="intro" element={<IntroScreen />} />
              <Route path="category" element={<CategoryScreen />} />
              <Route path="home" element={<HomeScreen />} />
              <Route path="search" element={<SearchScreen />} />
              <Route path="store/:id" element={<StoreScreen />} />
              <Route path="product/:id" element={<ProductScreen />} />
              <Route path="cart" element={<CartScreen />} />
              <Route path="checkout" element={<CheckoutScreen />} />
              <Route path="confirmation/:id" element={<ConfirmationScreen />} />
              <Route path="order/:id" element={<TrackingScreen />} />
              <Route path="orders" element={<OrdersScreen />} />
              <Route path="favorites" element={<FavoritesScreen />} />
              <Route path="account" element={<AccountScreen />} />
              <Route path="account/:section" element={<AccountSectionScreen />} />
              <Route path="*" element={<Navigate to="/customer/home" replace />} />
            </Route>

            {/* -------------------------- Business experience -------------------------- */}
            <Route path="/business">
              <Route index element={<BusinessIndex />} />
              <Route element={<BusinessOnboardingLayout />}>
                <Route path="onboarding" element={<OnboardingPage />} />
                <Route path="plans" element={<PlansPage />} />
                <Route path="payment" element={<PaymentPage />} />
                <Route path="branding" element={<BrandingPage />} />
                <Route path="theme" element={<ThemePage />} />
                <Route path="generate" element={<GeneratePage />} />
                <Route path="preview" element={<PreviewPage />} />
                <Route path="submitted" element={<SubmittedPage />} />
              </Route>
              <Route element={<BusinessDashboardLayout />}>
                <Route path="dashboard" element={<OverviewPage />} />
                <Route path="orders" element={<OrdersAdminPage />} />
                <Route path="products" element={<ProductsAdminPage />} />
                <Route path="inventory" element={<InventoryPage />} />
                <Route path="builder" element={<BuilderPage />} />
                <Route path="offers" element={<OffersPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="staff" element={<StaffPage />} />
                <Route path="subscription" element={<SubscriptionPage />} />
              </Route>
              <Route path="*" element={<BusinessIndex />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
