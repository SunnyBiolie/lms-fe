import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import AppLayout from "@/layouts/app-layout";
import AuthLayout from "@/layouts/auth-layout";
import WithNavBarLayout from "@/layouts/with-navbar-layout";
import AdminLayout from "@/layouts/admin-layout";
import UserLayout from "@/layouts/user-layout";
import LogInPage from "@/pages/log-in";
import SignUpPage from "@/pages/sign-up";
import BookManagementPage from "@/pages/book-management";
import DashboardPage from "@/pages/dashboard";
import HistoryPage from "@/pages/history";
import ProfilePage from "@/pages/profile";
import TestPage from "@/pages/test";
import StatisticPage from "@/pages/statistic";
import AccountManagementPage from "@/pages/account-management";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<AppLayout />}>
        <Route path="auth" element={<AuthLayout />}>
          <Route path="sign-up" element={<SignUpPage />} />
          <Route path="log-in" element={<LogInPage />} />
        </Route>
        <Route path="/" element={<WithNavBarLayout />}>
          <Route path="admin" element={<AdminLayout />}>
            <Route path="book-management" element={<BookManagementPage />} />
            <Route path="user-management" element={<AccountManagementPage />} />
            <Route path="statistic" element={<StatisticPage />} />
          </Route>
          <Route path="/" element={<UserLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Route>
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path="/test" element={<TestPage />} />
      </Route>
      <Route path="*" element={<>404</>}></Route>
    </Route>
  )
);

export default router;
