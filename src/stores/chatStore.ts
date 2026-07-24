import { create } from 'zustand';
import { reportApi, chatApi } from '../services/api/reportApi';
import { useUIStore } from './uiStore';

export interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface ChatState {
  chatMessages: ChatMessage[];
  isChatSending: boolean;
  sendChatMessage: (message: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  chatMessages: [
    {
      sender: 'assistant',
      text: 'مرحباً بك في مستشار الأمن السيبراني الذكي لمنصة Sniper AI Security. كيف يمكنني مساعدتك في تدقيق الأكواد أو تقييم الثغرات الآن؟',
      timestamp: new Date().toISOString()
    }
  ],
  isChatSending: false,

  sendChatMessage: async (message: string) => {
    const { addToast } = useUIStore.getState();
    const currentMessages = Array.isArray(get().chatMessages) ? get().chatMessages : [];
    set({
      isChatSending: true,
      chatMessages: [
        ...currentMessages,
        { sender: 'user', text: message, timestamp: new Date().toISOString() }
      ]
    });

    try {
      const answer = await chatApi.sendMessageToAdvisor(message, currentMessages);
      const reply = answer.data?.reply || answer.message || 'تم استلام الاستفسار وسيتم التدقيق السيبراني.';
      set((state) => ({
        chatMessages: [
          ...(Array.isArray(state.chatMessages) ? state.chatMessages : []),
          { sender: 'assistant', text: reply, timestamp: new Date().toISOString() }
        ]
      }));
    } catch (err: any) {
      addToast(err.message || 'فشل الاتصال بالمستشار السيبراني', 'error');
    } finally {
      set({ isChatSending: false });
    }
  },
}));
