// Import các action type constants
import { OPEN_CHAT_DRAWER, CLOSE_CHAT_DRAWER } from '../constants/chatConstants';

// Mở Drawer chat
export const openChatDrawer = () => async (dispatch) => {
  dispatch({
    type: OPEN_CHAT_DRAWER,
  });
};

// Đóng Drawer chat
export const closeChatDrawer = () => async (dispatch) => {
  dispatch({
    type: CLOSE_CHAT_DRAWER,
  });
};
export const openAdminChatDrawer = () => async (dispatch) => {
  dispatch({
    type: 'OPEN_ADMIN_CHAT_DRAWER',
  });
};

export const closeAdminChatDrawer = () => async (dispatch) => {
  dispatch({
    type: 'CLOSE_ADMIN_CHAT_DRAWER',
  });
};
