import React, { useState, useEffect, useRef, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { withStyles } from "@material-ui/styles";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { toast } from "react-toastify";
import {
  TextField,
  Typography,
  CircularProgress,
  Box,
  List,
  ListItem,
  IconButton,
  ListItemAvatar,
  Avatar,
  Divider,
  ListItemText,
  Badge,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import moment from "moment";
import SendIcon from "@material-ui/icons/Send";
import axios from "axios";

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: (props) =>
      props.isOnline ? "#44b700" : theme.palette.grey[400],
    color: (props) => (props.isOnline ? "#44b700" : theme.palette.grey[400]),
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    display: "flex",
    border: `2px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(-1),
    marginLeft: theme.spacing(25),
    height: "calc(92vh - 50px)",
    width: theme.spacing(150),
  },
  backButton: {
    position: "relative",
    zIndex: 2,
  },
  sidebar: {
    width: "300px",
    borderRight: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    overflowY: "auto",
  },
  chatContainer: {
    flex: 1,
    display: "flex",
    width: "100px",
    flexDirection: "column",
  },
  userList: {
    padding: theme.spacing(2),
  },
  userItem: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(1.5),
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  activeUser: {
    backgroundColor: theme.palette.action.selected,
  },
  userBadge: {
    marginRight: theme.spacing(2),
  },
  titleContainer: {
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    marginTop: theme.spacing(-3.5),
    fontWeight: "bold",
    textAlign: "center",
  },
  messageList: {
    flex: 1,
    overflowY: "auto",
    padding: theme.spacing(2),
  },
  messageItem: {
    display: "flex",
    marginBottom: theme.spacing(1),
  },
  messageBubble: {
    padding: theme.spacing(1.5),
    borderRadius: "15px",
    backgroundColor: "#f50057",
    color: "white",
    maxWidth: "350px",
    wordWrap: "break-word",
  },
  messageBubbleUser: {
    padding: theme.spacing(1.5),
    borderRadius: "15px",
    backgroundColor: "lightgray",
    color: "black",
    maxWidth: "350px",
    wordWrap: "break-word",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(1),
    borderTop: `1px solid ${theme.palette.divider}`,
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
  noUserSelected: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
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
  lastMessage: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  userListItem: {
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    padding: theme.spacing(1),
    display: "flex",
    alignItems: "center",
  },
  userListItemActive: {
    backgroundColor: theme.palette.action.selected,
  },
}));

const AdminChatScreen = ({ setHasNewMessageRef }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const userInfo = useSelector((state) => state.userLogin.userInfo);

  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef(null);
  const userStatusesRef = useRef({});

  const token = userInfo && userInfo.token;

  // Hàm check tin nhan - Removed API call
  const fetchLastMessage = useCallback(
    async (userId) => {
      // API call removed
      return { content: "No messages yet", isUnread: false, timestamp: null };
    },
    []
  );

  // Hàm chọn user
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u._id === user._id
          ? { ...u, lastMessage: { ...u.lastMessage, isUnread: false } }
          : u
      )
    );
  };

  // Lấy danh sách users
  useEffect(() => {
    const fetchUsers = async () => {
      if (!userInfo || !userInfo.isAdmin) return;
      try {
        if (users.length === 0) {
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const { data } = await axios.get("/api/users", config);
          const usersWithLastMessage = await Promise.all(
            data.map(async (user) => {
              const lastMessage = await fetchLastMessage(user._id);
              return { ...user, lastMessage };
            })
          );
          setUsers(usersWithLastMessage);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [userInfo, token, fetchLastMessage, users.length]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Gửi tin nhắn (admin)
  const handleSendMessage = useCallback(async () => {
    if (newMessage.trim() === "" || !selectedUser) return;

    const room = `admin-${selectedUser._id}`;
    const msg = {
      sender: "admin",
      content: newMessage,
      timestamp: new Date(),
      room,
    };
    setLoading(true);
    setNewMessage("");

    // Cập nhật state messages ngay lập tức
    setMessages((prevMessages) => [...prevMessages, msg]);

    try {
      // Socket removed
    } catch (error) {
      setMessages((prevMessages) =>
        prevMessages.filter((m) => m.timestamp !== msg.timestamp)
      );
    } finally {
      setLoading(false);
    }
  }, [newMessage, selectedUser]);





  // Chỉ hiển thị component cho admin
  if (!userInfo || !userInfo.isAdmin) {
    return <div>You are not authorized to view this page.</div>;
  }

  const handleBack = () => {
    history.goBack();
  };

  return (
    <Box className={classes.pageContainer}>
      <div className={classes.sidebar}>
        <IconButton
          color="secondary"
          className={classes.backButton}
          onClick={handleBack}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          Users
        </Typography>
        <List className={classes.userList}>
          {users.map((user) => {
            return (
              <React.Fragment key={user._id}>
                <Divider />
                <ListItem
                  button
                  className={classes.userListItem}
                  onClick={() => handleSelectUser(user)}
                >
                  <ListItemAvatar>
                    <Avatar alt={user.name} src={user.avatar} />
                  </ListItemAvatar>
                  <Box
                    display="flex"
                    alignItems="center"
                    width="100%"
                    justifyContent="space-between"
                  >
                    <ListItemText
                      primary={
                        <Typography
                          component="span"
                          variant="body1"
                          style={{
                            fontWeight: user.lastMessage?.isUnread
                              ? "bold"
                              : "normal",
                          }}
                        >
                          {user.name}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          component="span"
                          variant="body2"
                          className={classes.lastMessage}
                          color="textPrimary"
                          style={{
                            fontWeight: user.lastMessage?.isUnread
                              ? "bold"
                              : "normal",
                          }}
                        >
                          <br />
                          {user.lastMessage?.content}
                        </Typography>
                      }
                    />
                    <StyledBadge
                      overlap="rectangular"
                      variant="dot"
                      isOnline={userStatusesRef.current[user._id]}
                    />
                  </Box>
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            );
          })}
        </List>
      </div>
      <Box className={classes.chatContainer}>
        {selectedUser ? (
          <>
            <List className={classes.messageList}>
              {messages.map((msg, index) => {
                const isUserMessage = msg.sender !== "admin";
                const user = users.find((u) => u._id === msg.sender);
                const senderName = isUserMessage
                  ? user?.name || "User"
                  : "Admin";

                return (
                  <ListItem
                    key={index}
                    className={classes.messageItem}
                    style={{
                      justifyContent: isUserMessage ? "flex-start" : "flex-end",
                    }}
                  >
                    <div
                      className={classes.messageContent}
                      style={{
                        alignItems: isUserMessage ? "flex-start" : "flex-end",
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
                        style={{
                          backgroundColor: isUserMessage
                            ? "lightgray"
                            : "#f50057",
                          color: isUserMessage ? "black" : "white",
                          borderRadius: isUserMessage
                            ? "15px 15px 15px 2px"
                            : "15px 15px 2px 15px",
                        }}
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
                className={classes.input}
                variant="outlined"
                color="secondary"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                fullWidth
                multiline
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
        ) : (
          <div className={classes.noUserSelected}>
            <Typography variant="subtitle1">
              Select a user to start chatting
            </Typography>
          </div>
        )}
      </Box>
    </Box>
  );
};

export default AdminChatScreen;
