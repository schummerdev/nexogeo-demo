// ModernDashboardPage.jsx - Dashboard Principal com Todas as Melhorias Integradas
import React, { useState, useEffect } from 'react';
import Header from '../components/DashboardLayout/Header';
import { ThemeToggle } from '../components/ThemeProvider';
import { useNotifications } from '../components/ToastProvider';
import { 
  AnimatedKPICard, 
  ModernChart, 
  QuickActionButton, 
  LiveStatsWidget,
  CircularProgress 
} from '../components/ModernDashboard';
import { 
  InteractiveMap, 
  MapStatistics, 
  useUserLocation 
} from '../components/InteractiveMap';
import { 
  LoadingSpinner, 
  SkeletonDashboard, 
  WithLoading 
} from '../components/LoadingComponents';

export const ModernDashboardPage = () => {
  // Estados principais
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [mapVisible, setMapVisible] = useState(false);
  
  // Hooks
  const notify = useNotifications();
  const { location, getUserLocation } = useUserLocation();

  // Dados simulados (em produção viria da