import { useEffect } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router'
import { BuyerLayout } from './components/layout/BuyerLayout'
import { SellerLayout } from './components/layout/SellerLayout'
import { Toaster } from './components/ui/Toaster'
import { Cart } from './pages/buyer/Cart'
import { Catalog } from './pages/buyer/Catalog'
import { Checkout } from './pages/buyer/Checkout'
import { Confirmation } from './pages/buyer/Confirmation'
import { Home } from './pages/buyer/Home'
import { ProductPage } from './pages/buyer/ProductPage'
import { Dashboard } from './pages/seller/Dashboard'
import { Import } from './pages/seller/Import'
import { Products } from './pages/seller/Products'

/** Scroll to top on page change, but not when only the query string changes (filters, tabs). */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0 }) }, [pathname])
  return <Outlet />
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ScrollToTop />}>
          <Route element={<BuyerLayout />}>
            <Route index element={<Home />} />
            <Route path="catalogue" element={<Catalog />} />
            <Route path="produit/:id" element={<ProductPage />} />
            <Route path="panier" element={<Cart />} />
            <Route path="commande" element={<Checkout />} />
            <Route path="commande/confirmation" element={<Confirmation />} />
          </Route>
          <Route path="vendeur" element={<SellerLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="produits" element={<Products />} />
            <Route path="importer" element={<Import />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}
