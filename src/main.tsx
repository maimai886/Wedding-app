import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, Navigate, RouterProvider } from "react-router";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import { AppProvider } from "./state/app";
import "./styles/global.css";

const page = (load: () => Promise<{ default: React.ComponentType }>) => {
  const C = lazy(load);
  return <Suspense fallback={<div className="page"><p className="muted">載入中…</p></div>}><C /></Suspense>;
};

const router = createHashRouter([{
  element: <Layout />,
  children: [
    { path: "/", element: <Home /> },
    { path: "/schedule", element: page(() => import("./pages/Schedule")) },
    { path: "/photos", element: page(() => import("./pages/PhotoWall")) },
    { path: "/wishes", element: page(() => import("./pages/Wishes")) },
    { path: "/ranking", element: page(() => import("./pages/Ranking")) },
    { path: "/mine", element: page(() => import("./pages/Mine")) },
    { path: "/host", element: page(() => import("./pages/Host")) },
    { path: "*", element: <Navigate to="/" replace /> },
  ],
}]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider><RouterProvider router={router} /></AppProvider>
  </StrictMode>,
);
