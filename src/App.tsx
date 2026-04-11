import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { OrderCartProvider } from './contexts/OrderCartContext'
import HomePage from './pages/HomePage'
import CheckoutPage from './pages/CheckoutPage'
import OrderPage from './pages/OrderPage'
import RecommendationsPage from './pages/RecommendationsPage'
import ArticlesPage from './pages/ArticlesPage'
import ArticleDetailPage from './pages/ArticleDetailPage'

export default function App() {
  return (
    <BrowserRouter>
      <OrderCartProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/articles/:slug" element={<ArticleDetailPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </OrderCartProvider>
    </BrowserRouter>
  )
}
