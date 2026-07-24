export interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface ChatSlice {
  chatMessages: ChatMessage[];
  isChatSending: boolean;
  setChatMessages: (messages: ChatMessage[]) => void;
  setIsChatSending: (sending: boolean) => void;
}
