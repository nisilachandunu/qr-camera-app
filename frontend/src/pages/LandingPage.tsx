import { Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/PageContainer';
import { PrimaryButton } from '../components/PrimaryButton';
import { AnimatedCard } from '../components/AnimatedCard';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { weddingConfig } from '../config/wedding.config';
import { colors } from '../theme';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <PageContainer sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <Header />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <AnimatedCard delay={0.1} sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            component={motion.h1}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            variant="h4"
            sx={{ mb: 1, color: colors.textPrimary }}
          >
            {weddingConfig.coupleNames}
          </Typography>
          <Typography
            component={motion.p}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            variant="body2"
            sx={{ color: colors.gold, letterSpacing: '0.15em', mb: 3 }}
          >
            {weddingConfig.weddingDate}
          </Typography>

          <Box sx={{ width: 48, height: 1, bgcolor: colors.gold, mx: 'auto', mb: 3, opacity: 0.5 }} />

          <Typography
            component={motion.h2}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            variant="h5"
            sx={{ mb: 2 }}
          >
            {weddingConfig.welcomeTitle}
          </Typography>
          <Typography
            component={motion.p}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            variant="body1"
            sx={{ color: colors.textSecondary, lineHeight: 1.8, mb: 1 }}
          >
            {weddingConfig.welcomeMessage}
          </Typography>
          <Typography
            component={motion.p}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            variant="body2"
            sx={{ color: colors.textSecondary, lineHeight: 1.8 }}
          >
            {weddingConfig.welcomeSubtext}
          </Typography>
        </AnimatedCard>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <PrimaryButton onClick={() => navigate('/camera')}>
            {weddingConfig.takePhotoLabel}
          </PrimaryButton>
        </motion.div>
      </Box>

      <Footer />
    </PageContainer>
  );
}
