import { useLocation, useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/PageContainer';
import { ErrorScreen } from '../components/ErrorScreen';
import { Footer } from '../components/Footer';
import type { ErrorType } from '../types';

interface ErrorLocationState {
  type?: ErrorType;
  message?: string;
}

export function ErrorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ErrorLocationState | null;
  const errorType = state?.type ?? 'unknown';

  const handleRetry = () => {
    if (errorType === 'camera_denied' || errorType === 'no_camera') {
      navigate('/camera');
    } else if (errorType === 'upload_failed' || errorType === 'network') {
      navigate(-1);
    } else {
      navigate('/camera');
    }
  };

  return (
    <PageContainer sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <ErrorScreen
          type={errorType}
          message={state?.message}
          onRetry={handleRetry}
          onHome={() => navigate('/')}
        />
      </div>
      <Footer />
    </PageContainer>
  );
}
