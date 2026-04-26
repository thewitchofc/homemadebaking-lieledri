import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Layout } from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import { OrderCartProvider } from './contexts/OrderCartContext'
import HomePage from './pages/HomePage'
import CheckoutPage from './pages/CheckoutPage'
import OrderPage from './pages/OrderPage'
import RecommendationsPage from './pages/RecommendationsPage'
import ArticlesPage from './pages/ArticlesPage'
import ArticleDetailPage from './pages/ArticleDetailPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsPage from './pages/TermsPage'
import AllergensPage from './pages/AllergensPage'
import NotFoundPage from './pages/NotFoundPage'

function AppRoutes() {
  const location = useLocation()

  return (
    <div key={location.pathname} className="animate-pageFade">
      <Routes location={location}>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:slug" element={<ArticleDetailPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/allergens" element={<AllergensPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <OrderCartProvider>
        <AppRoutes />
      </OrderCartProvider>
    </BrowserRouter>
  )
}
