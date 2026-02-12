import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner'; 
import ScrollToTop from "./Config/ScrollToTop";
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

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <Layout>
          <Home />
        </Layout>
      )
    },
    {
      path: '/login',
      element: (
        <Layout>
          <Login />
        </Layout>
      )
    },
    {
      path: '/contact',
      element: (
        <Layout>
          <Contact />
        </Layout>
      )
    },
    {
      path: '/sport',
      element: (
        <Layout>
          <Sport />
        </Layout>
      )
    },
    {
      path: '/catalog',
      element: (
        <Layout>
          <ProductCatalog />
        </Layout>
      )
    },
    {
      path: '/religion',
      element: (
        <Layout>
          <Religion />
        </Layout>
      )
    },
    {
      path: '/checkout',
      element: (
        <Layout>
          <Checkout />
        </Layout>
      )
    },
    {
      path: '/Admin-Panel/Creating-New-Product',
      element: (
        <ProtectedRoute>
          <AdminLayout>
            <NewProduct />
          </AdminLayout>
        </ProtectedRoute>
      )
    },
    {
      path: '/Admin-Panel/Manage-Products',
      element: (
        <ProtectedRoute>
          <AdminLayout>
            <ManageProducts />
          </AdminLayout>
        </ProtectedRoute>
      )
    },
    {
      path: '/Admin-Panel/Sold-Out-Products',
      element: (
        <ProtectedRoute>
          <AdminLayout>
            <SoldoutProduct />
          </AdminLayout>
        </ProtectedRoute>
      )
    },
    {
      path: '*',
      element: (
        <Layout>
          <NotFound />
        </Layout>
      )
    }
  ]);

  return (
    <>
      {/* Global Toaster - Must be at root level */}
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

      {/* Router & Scroll */}
      <RouterProvider router={router} />
      <ScrollToTop />
    </>
  );
}

export default App;