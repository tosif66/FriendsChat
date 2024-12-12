import React, { useEffect, useRef, useState } from "react";
import userConversation from "../../Zustand/userConversation.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { TiMessages } from "react-icons/ti";
import { IoArrowBackSharp, IoSend } from "react-icons/io5";
import axios from "axios";
import { useSocketContext } from "../../context/SocketContext.jsx";
import notify from "../../assets/sound/friendsound.mp3";
import "./MessageContainer.css";

const MessageContainer = ({ onUserBack }) => {
  const {
    messages,
    setMessages,
    selectedConversation,
    setSelectedConversation,
  } = userConversation();
  const { socket } = useSocketContext();
  const { authUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendData, setSendData] = useState("");
  const lastMessageRef = useRef();
  // const soundRef = useRef(null);

  // const playSound = () => {
  //     if (soundRef.current) {
  //         soundRef.current.play().catch((e) => console.log("Sound play error: ", e));
  //     }
  // };

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      const sound = new Audio(notify);
      sound.play();
      setMessages([...messages, newMessage]);
    });
    return () => socket?.off("newMessage");
  }, [socket, setMessages, messages]);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const get = await axios.get(
          `/api/message/${selectedConversation?._id}`
        );
        const data = await get.data;

        if (data.success === false) {
          setLoading(false);
          console.log(data.message);
        }
        setLoading(false);
        setMessages(data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessages]);

  const handleMessage = (e) => {
    setSendData(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await axios.post(
        `/api/message/send/${selectedConversation?._id}`,
        { message: sendData }
      );
      const data = await res.data;

      if (data.success === false) {
        setSending(false);
        console.log(data.message);
      }
      setSending(false);
      setSendData("");
      setMessages([...messages, data]);
    } catch (error) {
      setSending(false);
      console.log(error);
    }
  };

  return (
    <div className="message-container">
      {" "}
      {selectedConversation === null ? (
        <div className="no-conversation">
          {" "}
          <div className="welcome-message">
            {" "}
            <p className="welcome-text">
              Welcome!!👋 {authUser.username}😎
            </p>{" "}
            <p className="start-chat-text">
              {" "}
              Select a chat to start messaging.
            </p>{" "}
            <TiMessages className="welcome-icon" />{" "}
          </div>{" "}
        </div>
      ) : (
        <>
          {" "}
          <div className="message-header">
            {" "}
            <div className="header-content">
              {" "}
              <div className="back-button-wrapper">
                {" "}
                <button
                  onClick={() => onUserBack(true)}
                  className="back-button"
                >
                  {" "}
                  <IoArrowBackSharp size={25} />{" "}
                </button>{" "}
              </div>{" "}
              <div className="conversation-info">
                {" "}
                <img
                  className="profile-pic"
                  src={selectedConversation?.profilepic}
                  alt="profile pic"
                />{" "}
                <span className="username">
                  {" "}
                  {selectedConversation?.username}{" "}
                </span>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <div className="message-list">
            {" "}
            {loading && (
              <div className="loading-container">
                {" "}
                <div className="loading-spinner"></div>{" "}
              </div>
            )}{" "}
            {!loading && messages?.length === 0 && (
              <p className="no-messages-text">
                Send a message to start conversation
              </p>
            )}{" "}
            {!loading &&
              messages?.length > 0 &&
              messages?.map((message) => (
                <div
                  className="message-item"
                  key={message?._id}
                  ref={lastMessageRef}
                >
                  {" "}
                  <div
                    className={`chat-message ${
                      message.senderId === authUser._id
                        ? "chat-end"
                        : "chat-start"
                    }`}
                  >
                    {" "}
                    <div className="chat-avatar"></div>{" "}
                    <div
                      className={`chat-bubble ${
                        message.senderId === authUser?._id
                          ? "chat-bubble-end"
                          : "chat-bubble-start"
                      }`}
                    >
                      {" "}
                      {message?.message}{" "}
                    </div>{" "}
                    <div className="message-timestamp">
                      {" "}
                      {new Date(message?.createdAt).toLocaleDateString(
                        "en-IN",
                        { hour: "numeric", minute: "numeric" }
                      )}{" "}
                    </div>{" "}
                  </div>{" "}
                </div>
              ))}{" "}
          </div>{" "}
          <form onSubmit={handleSubmit} className="message-input-form">
            {" "}
            <div className="message-input-container">
              {" "}
              <input
                value={sendData}
                onChange={handleMessage}
                required
                id="message"
                type="text"
                className="message-input"
                placeholder="Type a message..."
              />{" "}
              <button type="submit" className="send-button">
                {" "}
                {sending ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <IoSend size={20} />
                )}{" "}
              </button>{" "}
            </div>{" "}
          </form>{" "}
        </>
      )}{" "}
    </div>
  );
};

export default MessageContainer;
