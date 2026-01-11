import { OPEN_CHAT_DRAWER, CLOSE_CHAT_DRAWER, OPEN_ADMIN_CHAT_DRAWER, CLOSE_ADMIN_CHAT_DRAWER } from '../constants/chatConstants';

const initialState = {
  openChatDrawer: false,
  openAdminChatDrawer: false,
};

export const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_CHAT_DRAWER:
      return { ...state, openChatDrawer: true };  
    case CLOSE_CHAT_DRAWER:
      return { ...state, openChatDrawer: false }; 
    case OPEN_ADMIN_CHAT_DRAWER:
      return { ...state, openAdminChatDrawer: true };
    case CLOSE_ADMIN_CHAT_DRAWER:
      return { ...state, openAdminChatDrawer: false };
    default:
      return state;
  }
};
