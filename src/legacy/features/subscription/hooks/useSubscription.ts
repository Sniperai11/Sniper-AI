import { useAuthStore } from '../../../stores/authStore';
import { useUIStore } from '../../../stores/uiStore';

export const useSubscription = () => {
  const userProfile = useAuthStore((state) => state.userProfile);
  const actionLoading = useUIStore((state) => state.actionLoading);
  const upgradeSubscription = useAuthStore((state) => state.upgradeSubscription);

  return {
    userProfile,
    actionLoading,
    upgradeSubscription,
  };
};
