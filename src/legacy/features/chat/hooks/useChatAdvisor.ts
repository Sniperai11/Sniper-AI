import { useChatStore } from '../../../stores/chatStore';

export const useChatAdvisor = () => {
  const chatMessages = useChatStore((state) => state.chatMessages);
  const isChatSending = useChatStore((state) => state.isChatSending);
  const sendChatMessage = useChatStore((state) => state.sendChatMessage);

  return {
    chatMessages,
    isChatSending,
    sendChatMessage,
  };
};
