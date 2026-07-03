import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageContainer } from '../components/PageContainer';
import { PrimaryButton } from '../components/PrimaryButton';
import { SuccessCard } from '../components/SuccessCard';
import { Footer } from '../components/Footer';
import { weddingConfig } from '../config/wedding.config';

export function SuccessPage() {
  const navigate = useNavigate();

  return (
    <PageContainer sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
      >
        <SuccessCard
          title={weddingConfig.successTitle}
          message={weddingConfig.successMessage}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ marginTop: 24 }}
        >
          <PrimaryButton onClick={() => navigate('/camera')}>
            {weddingConfig.takeAnotherLabel}
          </PrimaryButton>
        </motion.div>
      </motion.div>
      <Footer />
    </PageContainer>
  );
}
