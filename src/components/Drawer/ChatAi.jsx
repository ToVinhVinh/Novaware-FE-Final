import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  Drawer,
  TextField,
  Typography,
  CircularProgress,
  Box,
  MenuItem,
  Select,
} from "@material-ui/core";
import { marked } from "marked";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { closeChatDrawer } from "../../actions/chatActions";
import { toast } from "react-toastify";
import CloseIcon from "@material-ui/icons/Close";
import SendIcon from "@material-ui/icons/Send";
import axios from "axios";
import gpticon from "../../assets/icons/chat-gpt-icon.png";
import geminiicon from "../../assets/icons/google-gemini-icon.png";
import novawareicon from "../../assets/icons/novaware-icon.png";
import { generateAIResponse } from "../../lib/api/gemini";

const useStyles = makeStyles((theme) => ({
  drawerContent: {
    width: 600,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    [theme.breakpoints.down("xs")]: {
      width: "100vw",
    },
  },
  image: {
    maxWidth: "200px", // Adjust size as needed
    maxHeight: "200px",
    display: "block", // Makes the image a block element
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  closeButton: {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1),
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
    "&::-webkit-scrollbar": {
      width: "8px",
    },
    "&::-webkit-scrollbar-track": {
      background: "#f1f1f1",
      borderRadius: "10px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#888",
      borderRadius: "10px",
      border: "3px solid #f1f1f1",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "#555",
    },
  },
  messageItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: theme.spacing(1),
  },
  messageBubble: {
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
    maxWidth: "70%",
    wordBreak: "break-word",
    overflowWrap: "break-word",
    animation: "fadeIn 0.5s ease-in-out",
    overflowY: "visible",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#f50057",
    color: theme.palette.common.white,
    borderRadius: "18px 18px 2px 18px",
  },
  aiMessage: {
    alignSelf: "flex-start",
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.text.primary,
    borderRadius: "18px 18px 18px 2px",
    "& p": {
      marginBottom: theme.spacing(1),
      lineHeight: 1.5,
    },
    "& ul, & ol": {
      marginBottom: theme.spacing(1),
      paddingLeft: theme.spacing(2.5),
    },
    "& li": {
      marginBottom: theme.spacing(0.625),
    },
    "& strong": {
      fontWeight: "bold",
    },
    "& em": {
      fontStyle: "italic",
    },
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(1),
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    transition: "height 0.3s ease",
  },
  selectAI: {
    minWidth: 120,
    maxHeight: 40,
    borderRadius: theme.shape.borderRadius * 2,
    overflow: "hidden",
    marginRight: theme.spacing(1),
    "& .MuiSelect-root": {
      display: "flex",
      alignItems: "center",
    },
  },
  avatarDropdownItem: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
  },
  avatarSmall: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  input: {
    flex: 1,
    borderRadius: 30,
    "& .MuiOutlinedInput-root": {
      borderRadius: 30,
      padding: "5px 10px",
      "& fieldset": {
        borderColor: "#f50057",
      },
      "&:hover fieldset": {
        borderColor: "#f50057",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#f50057",
        borderWidth: "2px",
      },
    },
    "& .MuiInputBase-input": {
      padding: "6px",
    },
  },
  sendButton: {
    marginLeft: theme.spacing(1),
    transition: "transform 0.2s ease-in-out",
    "&:hover": {
      transform: "scale(1.1)",
    },
  },
}));

const ChatPreview = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const openChatDrawer = useSelector((state) => state.chat.openChatDrawer);

  // trang thai tn
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedAI, setSelectedAI] = useState("gpt");
  const messageEndRef = useRef(null);
  const inputRef = useRef(null);

  // lich su tn
  const currentMessages = useMemo(() => {
    return messages.filter((msg) => msg.ai === selectedAI);
  }, [messages, selectedAI]);

  // gui tn
  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    const newMessage = { role: "user", content: inputMessage, ai: selectedAI };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setLoading(true);
    setInputMessage("");
    inputRef.current.blur();

    try {
      if (selectedAI === "gemini") {
        const text = await generateAIResponse(inputMessage);
        const aiResponse = {
          role: "assistant",
          content: text,
          ai: selectedAI,
          imageLinks: [],
        };
        setMessages((prevMessages) => [...prevMessages, aiResponse]);
      } else {
        const endpoint = selectedAI === "gpt" ? "/api/chatgpt" : "/api/chatnovaware";
        const response = await axios.post(`http://localhost:5000${endpoint}`, {
          prompt: inputMessage,
        });
        const aiResponse = {
          role: "assistant",
          content: response.data.text,
          ai: selectedAI,
          imageLinks: response.data.imageLinks || [],
        };
        setMessages((prevMessages) => [...prevMessages, aiResponse]);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi!");
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: "Oops! Something went wrong.",
          ai: selectedAI,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseChatDrawer = useCallback(() => {
    dispatch(closeChatDrawer());
  }, [dispatch]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSendMessage();
      setInputMessage("");
    }
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentMessages, loading]);

  return (
    <Drawer
      anchor="right"
      open={openChatDrawer}
      onClose={handleCloseChatDrawer}
    >
      <div className={classes.drawerContent}>
        <div className={classes.titleContainer}>
          <IconButton
            color="secondary"
            className={classes.closeButton}
            onClick={handleCloseChatDrawer}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Chat with{" "}
            {selectedAI === "gpt"
              ? "GPT"
              : selectedAI === "gemini"
              ? "Gemini"
              : "NovaWare"}
          </Typography>
        </div>

        {/* Message List */}
        <List className={classes.messageList}>
          <TransitionGroup className={classes.transitionWrapper}>
            {currentMessages.map((msg, index) => (
              <CSSTransition
                key={index}
                timeout={500}
                classNames={{
                  enter: classes.transitionEnter,
                  enterActive: classes.transitionEnterActive,
                  exit: classes.transitionExit,
                  exitActive: classes.transitionExitActive,
                }}
              >
                <ListItem
                  className={classes.messageItem}
                  style={{
                    justifyContent:
                      msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  {msg.role === "assistant" && (
                    <Avatar
                      alt="AI"
                      src={
                        selectedAI === "gpt"
                          ? gpticon
                          : selectedAI === "gemini"
                          ? geminiicon
                          : novawareicon
                      }
                      style={{ marginRight: 8 }}
                    />
                  )}
                  <div
                    className={`${classes.messageBubble} ${
                      msg.role === "user"
                        ? classes.userMessage
                        : classes.aiMessage
                    }`}
                  >
                    <Typography variant="body2">
                      {msg.role === "assistant" ? (
                        // Render HTML từ marked thay vì dùng dangerouslySetInnerHTML
                        <div
                          dangerouslySetInnerHTML={{
                            __html: marked(msg.content),
                          }}
                        />
                      ) : (
                        msg.content
                      )}
                    </Typography>

                    {/* Hiển thị hình ảnh nếu có */}
                    {msg.imageLinks &&
                      msg.imageLinks.length > 0 &&
                      msg.imageLinks.map((link, index) => (
                        <img
                          key={index}
                          src={link}
                          alt={`${
                            msg.content.split(":")[0].split("about")[1]
                          } - ${index + 1}`}
                          style={{
                            maxWidth: "100%",
                            height: "auto",
                            marginTop: "10px",
                          }}
                        />
                      ))}
                  </div>
                </ListItem>
              </CSSTransition>
            ))}
          </TransitionGroup>
          <div ref={messageEndRef} />
        </List>

        {/* chon ai vs input */}
        <div
          className={classes.inputContainer}
          style={{ height: inputMessage ? "50px" : "50px" }}
        >
          {!inputMessage && (
            <Select
              value={selectedAI}
              onChange={(e) => setSelectedAI(e.target.value)}
              displayEmpty
              variant="outlined"
              className={classes.selectAI}
            >
              <MenuItem value="gpt">
                <Box className={classes.avatarDropdownItem}>
                  <Avatar
                    alt="GPT"
                    src={gpticon}
                    className={classes.avatarSmall}
                  />
                  <Typography>GPT</Typography>
                </Box>
              </MenuItem>
              <MenuItem value="gemini">
                <Box className={classes.avatarDropdownItem}>
                  <Avatar
                    alt="Gemini"
                    src={geminiicon}
                    className={classes.avatarSmall}
                  />
                  <Typography>Gemini</Typography>
                </Box>
              </MenuItem>
              <MenuItem value="novaware">
                <Box className={classes.avatarDropdownItem}>
                  <Avatar
                    alt="NovaWare"
                    src={novawareicon}
                    className={classes.avatarSmall}
                  />
                  <Typography>NovaWare</Typography>
                </Box>
              </MenuItem>
            </Select>
          )}

          <TextField
            variant="outlined"
            color="secondary"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            fullWidth
            inputRef={inputRef}
            className={classes.input}
            multiline
          />
          <IconButton
            color="secondary"
            onClick={handleSendMessage}
            disabled={loading}
            className={classes.sendButton}
          >
            {loading ? (
              <CircularProgress color="#f50057" size={24} />
            ) : (
              <SendIcon />
            )}
          </IconButton>
        </div>
      </div>
    </Drawer>
  );
};

export default ChatPreview;
