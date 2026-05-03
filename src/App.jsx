import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import PurchasesPage from "./pages/purchases/PurchasesPage";
import SalesPage from "./pages/sales/SalesPage";
import TransferPage from "./pages/transfers/TransferPage";
import StockSearchPage from "./pages/stock/StockSearchPage";
import ReportsPage from "./pages/reports/ReportsPage";
import AdminPage from "./pages/admin/AdminPage";

import ProtectedRoute from "./components/protectedRoute";

import { Toaster } from "react-hot-toast";



export default function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 5000 }} reverseOrder={false} />

      <Routes>

        <Route path="/login" element={<LoginPage />}/>

        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
        >

          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="purchases" element={<PurchasesPage />} />
          <Route path="sales" element={<SalesPage />} />
          <Route path="transfers" element={<TransferPage />} />
          <Route path="stock-search" element={<StockSearchPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </>
  );
}