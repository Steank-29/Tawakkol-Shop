import React, { useEffect } from 'react'; // Add useEffect here
import { createBrowserRouter, RouterProvider, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner'; 
import Login from './Components/Pages/Login';
import Home from './Components/Pages/Home';
import Contact from './Components/Pages/Contact'; 
import Layout from './Config/Layout';
import NotFound from './Config/Notfound';
import Sport from './Components/Links/Sport';
import ProductCatalog from './Components/Links/ProductsCatalog';
import Religion from './Components/Links/Religion';
import AdminLayout from './Config/AdminLayout';
import NewProduct from './Admin/NewProduct';
import ProtectedRoute from './Config/ProtectedRoute';
import ManageProducts from './Admin/ManageProducts';
import SoldoutProduct from './Admin/SoldoutProduct';
import Checkout from './Components/Pages/Checkout';
import Order from './Admin/Order'
import Messagerie from './Admin/Messagerie'
import Facture from './Admin/Facture';
import ScrollToTop from './Config/ScrollToTop'; // Import the ScrollToTop component

// ScrollToTop component that uses useLocation - MUST be inside Router context
const RefreshToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  return null;
};

// Layout wrapper that includes ScrollToTop
const RootLayout = ({ children }) => {
  return (
    <>
      <RefreshToTop />
      {children}
    </>
  );
};

// Create router with RootLayout wrapper
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <RootLayout>
        <Layout>
          <Home />
        </Layout>
      </RootLayout>
    )
  },
  {
    path: '/login',
    element: (
      <RootLayout>
        <Layout>
          <Login />
        </Layout>
      </RootLayout>
    )
  },
  {
    path: '/contact',
    element: (
      <RootLayout>
        <Layout>
          <Contact />
        </Layout>
      </RootLayout>
    )
  },
  {
    path: '/sport',
    element: (
      <RootLayout>
        <Layout>
          <Sport />
        </Layout>
      </RootLayout>
    )
  },
  {
    path: '/catalog',
    element: (
      <RootLayout>
        <Layout>
          <ProductCatalog />
        </Layout>
      </RootLayout>
    )
  },
  {
    path: '/religion',
    element: (
      <RootLayout>
        <Layout>
          <Religion />
        </Layout>
      </RootLayout>
    )
  },
  {
    path: '/checkout',
    element: (
      <RootLayout>
        <Layout>
          <Checkout />
        </Layout>
      </RootLayout>
    )
  },
  {
    path: '/Admin-Panel/Creating-New-Product',
    element: (
      <RootLayout>
        <ProtectedRoute>
          <AdminLayout>
            <NewProduct />
          </AdminLayout>
        </ProtectedRoute>
      </RootLayout>
    )
  },
  {
    path: '/Admin-Panel/Manage-Products',
    element: (
      <RootLayout>
        <ProtectedRoute>
          <AdminLayout>
            <ManageProducts />
          </AdminLayout>
        </ProtectedRoute>
      </RootLayout>
    )
  },
  {
    path: '/Admin-Panel/Sold-Out-Products',
    element: (
      <RootLayout>
        <ProtectedRoute>
          <AdminLayout>
            <SoldoutProduct />
          </AdminLayout>
        </ProtectedRoute>
      </RootLayout>
    )
  },
  {
    path: '/Admin-Panel/Orders',
    element: (
      <RootLayout>
        <ProtectedRoute>
          <AdminLayout>
            <Order />
          </AdminLayout>
        </ProtectedRoute>
      </RootLayout>
    )
  },
  {
    path: '/Admin-Panel/Contact',
    element: (
      <RootLayout>
        <ProtectedRoute>
          <AdminLayout>
            <Messagerie />
          </AdminLayout>
        </ProtectedRoute>
      </RootLayout>
    )
  },
  {
    path: '/Admin-Panel/Facture',
    element: (
      <RootLayout>
        <ProtectedRoute>
          <AdminLayout>
            <Facture />
          </AdminLayout>
        </ProtectedRoute>
      </RootLayout>
    )
  },
  {
    path: '*',
    element: (
      <RootLayout>
        <Layout>
          <NotFound />
        </Layout>
      </RootLayout>
    )
  }
]);

// Main App component
function App() {
  return (
    <>
      <Toaster
        position="top-right"
        expand={true}
        richColors
        closeButton={false}
        toastOptions={{
          style: {
            background: 'transparent',
            border: 'none',
            boxShadow: 'none',
            padding: 0,
          },
          duration: 5000,
        }}
      />

      <RouterProvider router={router} />
      <ScrollToTop />
    </>
  );
}

export default App;