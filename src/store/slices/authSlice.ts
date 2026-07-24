import { UserProfile, UserMode } from '../../types';

export interface AuthSlice {
  userProfile: UserProfile | null;
  userMode: UserMode;
  
  setUserMode: (mode: UserMode) => void;
  setUserProfile: (profile: UserProfile | null) => void;
}
