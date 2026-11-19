import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Container from './components/Common/Container';

const Home = lazy(() => import('./pages/Home/Home'));
const Shop = lazy(() => import('./pages/Shop/Shop'));
const ProductDetails = lazy(() => import('./pages/ProductDetails/ProductDetails'));
const About = lazy(() => import('./pages/About/About'));
const Artists = lazy(() => import('./pages/Artists/Artists'));
const CustomArtwork = lazy(() => import('./pages/CustomArtwork/CustomArtwork'));
const Contact = lazy(() => import('./pages/Contact/Contact'));
const Cart = lazy(() => import('./pages/Cart/Cart'));
const Wishlist = lazy(() => import('./pages/Wishlist/Wishlist'));
const Checkout = lazy(() => import('./pages/Checkout/Checkout'));
const OrderSuccess = lazy(() => import('./pages/Checkout/OrderSuccess'));
const SearchResults = lazy(() => import('./pages/Search/SearchResults'));
const FAQ = lazy(() => import('./pages/Policies/FAQ'));
const Policy = lazy(() => import('./pages/Policies/Policy'));
const ImageCredits = lazy(() => import('./pages/Policies/ImageCredits'));
const Admin = lazy(() => import('./pages/Admin/Admin'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-5">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo/20 border-t-vermilion" />
      <p className="font-sans text-[10px] uppercase tracking-luxe text-charcoal/50">Preparing the gallery</p>
    </Container>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:slug" element={<ProductDetails />} />
          <Route path="about" element={<About />} />
          <Route path="artists" element={<Artists />} />
          <Route path="custom" element={<CustomArtwork />} />
          <Route path="contact" element={<Contact />} />
          <Route path="cart" element={<Cart />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-success" element={<OrderSuccess />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="policies/:policy" element={<Policy />} />
          <Route path="image-credits" element={<ImageCredits />} />
          <Route path="admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
