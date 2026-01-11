import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { closeAdminChatDrawer } from "../../actions/chatActions";
import { toast } from "react-toastify";
import {
  IconButton,
  Drawer,
  TextField,
  Typography,
  CircularProgress,
  Box,
  List,
  ListItem,
} from "@material-ui/core";
import moment from "moment";
import CloseIcon from "@material-ui/icons/Close";
import SendIcon from "@material-ui/icons/Send";
import AdminChatScreen from "../../screens/admin/AdminChatScreen";

const useStyles = makeStyles((theme) => ({
  drawerContent: {
    width: 400,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    [theme.breakpoints.down("xs")]: {
      width: "100vw",
    },
  },
  closeButton: {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1),
    zIndex: 2,
  },
  titleContainer: {
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  title: {
    fontWeight: "bold",
    color: theme.palette.text.primary,
    textAlign: "center",
  },
  messageList: {
    flex: 1,
    overflowY: "auto",
    padding: theme.spacing(2),
  },
  messageItem: {
    display: "flex",
    alignItems: "flex-start",
    marginBottom: theme.spacing(1),
    justifyContent: (props) =>
      props.isUserMessage ? "flex-end" : "flex-start", // Sửa lại justify-content
  },
  messageContent: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "70%",
  },
  messageMeta: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(0.5),
    justifyContent: (props) =>
      props.isUserMessage ? "flex-end" : "flex-start",
  },
  messageBubble: {
    padding: theme.spacing(1.5),
    maxWidth: "100%",
    wordBreak: "break-word",
    overflowWrap: "break-word",
    borderRadius: (props) =>
      props.isUserMessage ? "15px 15px 2px 15px" : "15px 15px 15px 2px", // Sửa lại border radius
    backgroundColor: (props) => (props.isUserMessage ? "lightgray" : "#f50057"), // Sửa lại màu nền
    color: (props) => (props.isUserMessage ? "black" : "white"), // Sửa lại màu chữ
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(1),
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    transition: "height 0.3s ease",
  },
  input: {
    flex: 1,
    borderRadius: 20,
    "& .MuiOutlinedInput-root": {
      borderRadius: 20,
      padding: "5px 10px",
      "& fieldset": { borderColor: "#f50057" },
      "&:hover fieldset": { borderColor: "#f50057" },
      "&.Mui-focused fieldset": {
        borderColor: "#f50057",
        borderWidth: "2px",
      },
    },
    "& .MuiInputBase-input": { padding: "8px" },
  },
  sendButton: {
    marginLeft: theme.spacing(1),
  },
}));

const Chat = ({ setHasNewMessageRef }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const openAdminChatDrawer = useSelector(
    (state) => state.chat.openAdminChatDrawer
  );
  const userInfo = useSelector((state) => state.userLogin.userInfo);


  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const userId = userInfo && userInfo._id;
  const messageEndRef = useRef(null);

  const handleCloseChatDrawer = useCallback(() => {
    dispatch(closeAdminChatDrawer());
  }, [dispatch]);

  // Lấy tin nhắn cho user thường - Removed API call

  // cuon xuong cuoi
  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);


  // Gửi tin nhắn (user)
  const handleSendMessage = useCallback(async () => {
    if (inputMessage.trim() === "" || !userId) return;

    const sender = userId;
    const chatId = userId;
    const room = `admin-${userId}`; // Tạo room ID

    if (!chatId) return;

    const newMessage = {
      sender,
      content: inputMessage,
      timestamp: new Date(),
      room,
    }; // Thêm timestamp và room
    setLoading(true);
    setInputMessage("");

    // Cập nhật state messages ngay lập tức cho phía user
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      // Socket removed
    } catch (error) {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.timestamp !== newMessage.timestamp)
      );
    } finally {
      setLoading(false);
    }
  }, [inputMessage, userId]);



  if (!userInfo) {
    return <div></div>;
  }

  return (
    <Drawer
      anchor="right"
      open={openAdminChatDrawer}
      onClose={handleCloseChatDrawer}
    >
      <div className={classes.drawerContent}>
        {userInfo.isAdmin && (
          <AdminChatScreen
            setHasNewMessageRef={setHasNewMessageRef}
            handleCloseChatDrawer={handleCloseChatDrawer}
          />
        )}

        {!userInfo.isAdmin && (
          <>
            <div className={classes.titleContainer}>
              <IconButton
                color="secondary"
                className={classes.closeButton}
                onClick={handleCloseChatDrawer}
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                Chat with Admin
              </Typography>
            </div>
            <List className={classes.messageList}>
              {messages.map((msg, index) => {
                const isUserMessage = msg.sender === userId;
                const senderName = isUserMessage ? "You" : "Admin";

                return (
                  <ListItem
                    key={index}
                    className={classes.messageItem}
                    style={{
                      justifyContent: isUserMessage ? "flex-end" : "flex-start",
                    }}
                    isUserMessage={isUserMessage}
                  >
                    <div
                      className={classes.messageContent}
                      style={{
                        alignItems: isUserMessage ? "flex-end" : "flex-start",
                      }}
                    >
                      <div className={classes.messageMeta}>
                        <Typography variant="caption" color="textSecondary">
                          {senderName}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          style={{ marginLeft: 8 }}
                        >
                          {moment(msg.timestamp).format("LT")}
                        </Typography>
                      </div>
                      <div
                        className={classes.messageBubble}
                        isUserMessage={isUserMessage}
                      >
                        <Typography variant="body2">{msg.content}</Typography>
                      </div>
                    </div>
                  </ListItem>
                );
              })}
              <div ref={messageEndRef} />
            </List>
            <Box className={classes.inputContainer}>
              <TextField
                variant="outlined"
                color="secondary"
                placeholder="Type a message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                fullWidth
                multiline
                className={classes.input}
              />
              <IconButton
                color="secondary"
                onClick={handleSendMessage}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : <SendIcon />}
              </IconButton>
            </Box>
          </>
        )}
      </div>
    </Drawer>
  );
};

export default Chat;
