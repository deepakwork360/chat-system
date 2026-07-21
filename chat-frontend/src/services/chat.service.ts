import { api } from "@/lib/api";

export interface Conversation {
  id: number;
  created_at: string;
  updated_at: string;
  is_group?: boolean;
  group_name?: string | null;
  group_avatar_url?: string | null;
  group_description?: string | null;
  group_created_by?: number | null;
  other_user_id: number | null;
  other_user_name: string | null;
  other_user_email: string | null;
  other_user_avatar_url: string | null;
  latest_message: string | null;
  latest_message_created_at: string | null;
  unread_count?: number;
  member_count?: number;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  message_type: "text" | "image" | "file" | "location" | "audio" | "deleted";
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
  is_read: boolean;
  is_deleted?: boolean;
  created_at: string;
  sender_name: string;
  sender_email: string;
  sender_avatar_url?: string | null;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar_url?: string | null;
}

export const getConversations = async (): Promise<Conversation[]> => {
  const response = await api.get("/conversations");
  return response.data.conversations;
};

export const createConversation = async (otherUserId: number): Promise<{ conversation: { id: number }; otherUser: UserProfile }> => {
  const response = await api.post("/conversations", { otherUserId });
  return response.data;
};

export const getMessages = async (conversationId: number): Promise<Message[]> => {
  const response = await api.get(`/conversations/${conversationId}/messages`);
  return response.data.messages;
};

export const sendMessage = async (
  conversationId: number, 
  content: string, 
  file?: File | null,
  messageType?: string
): Promise<Message> => {
  if (file) {
    const formData = new FormData();
    formData.append("file", file);
    if (content) {
      formData.append("content", content);
    }
    if (messageType) {
      formData.append("messageType", messageType);
    }
    const response = await api.post(`/conversations/${conversationId}/messages`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.message;
  } else {
    const response = await api.post(`/conversations/${conversationId}/messages`, { 
      content, 
      messageType: messageType || "text" 
    });
    return response.data.message;
  }
};

export const searchUsers = async (search: string): Promise<UserProfile[]> => {
  const response = await api.get(`/users?search=${encodeURIComponent(search)}`);
  return response.data.users;
};

export const markConversationAsRead = async (conversationId: number): Promise<{ success: boolean }> => {
  const response = await api.patch(`/conversations/${conversationId}/read`);
  return response.data;
};

export const deleteMessage = async (messageId: number): Promise<{ success: boolean; messageId: number; conversationId: number }> => {
  const response = await api.delete(`/conversations/messages/${messageId}`);
  return response.data;
};

export const deleteMessagesBatch = async (messageIds: number[]): Promise<{ success: boolean; messageIds: number[]; conversationId: number }> => {
  const response = await api.post(`/conversations/messages/delete-batch`, { messageIds });
  return response.data;
};

export const createGroupConversation = async (name: string, description: string, userIds: number[]): Promise<{ success: boolean; conversation: Conversation }> => {
  const response = await api.post("/conversations/group", { name, description, userIds });
  return response.data;
};

export const getConversationMembers = async (conversationId: number): Promise<{ success: boolean; members: UserProfile[] }> => {
  const response = await api.get(`/conversations/${conversationId}/members`);
  return response.data;
};
