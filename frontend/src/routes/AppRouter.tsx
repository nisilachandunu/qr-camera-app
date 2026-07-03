import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { FloralBackground } from '../components/FloralBackground';
import { AppLayout } from '../layouts/AppLayout';

const LandingPage = lazy(() =>
  import('../pages/LandingPage').then((m) => ({ default: m.LandingPage })),
);
const CameraPage = lazy(() =>
  import('../pages/CameraPage').then((m) => ({ default: m.CameraPage })),
);
const PreviewPage = lazy(() =>
  import('../pages/PreviewPage').then((m) => ({ default: m.PreviewPage })),
);
const UploadingPage = lazy(() =>
  import('../pages/UploadingPage').then((m) => ({ default: m.UploadingPage })),
);
const SuccessPage = lazy(() =>
  import('../pages/SuccessPage').then((m) => ({ default: m.SuccessPage })),
);
const ErrorPage = lazy(() =>
  import('../pages/ErrorPage').then((m) => ({ default: m.ErrorPage })),
);

function AnimatedRoutes() {
  const location = useLocation();
  const isCamera = location.pathname === '/camera';

  return (
    <>
      {!isCamera && <FloralBackground />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route element={<AppLayout />}>
            <Route
              path="/"
              element={
                <Suspense fallback={<LoadingOverlay />}>
                  <LandingPage />
                </Suspense>
              }
            />
            <Route
              path="/camera"
              element={
                <Suspense fallback={<LoadingOverlay />}>
                  <CameraPage />
                </Suspense>
              }
            />
            <Route
              path="/preview"
              element={
                <Suspense fallback={<LoadingOverlay />}>
                  <PreviewPage />
                </Suspense>
              }
            />
            <Route
              path="/uploading"
              element={
                <Suspense fallback={<LoadingOverlay />}>
                  <UploadingPage />
                </Suspense>
              }
            />
            <Route
              path="/success"
              element={
                <Suspense fallback={<LoadingOverlay />}>
                  <SuccessPage />
                </Suspense>
              }
            />
            <Route
              path="/error"
              element={
                <Suspense fallback={<LoadingOverlay />}>
                  <ErrorPage />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </AnimatePresence>
    </>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
