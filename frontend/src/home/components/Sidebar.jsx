import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import userConversation from "../../Zustand/userConversation.js";
import { useSocketContext } from "../../context/SocketContext";
import "../components/MessageContainer.css";

const Sidebar = ({ onSelectUser }) => {
  const navigate = useNavigate();
  const { authUser, setAuthUser } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [searchUser, setSearchUser] = useState([]);
  const [chatUser, setChatUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageUsers, setNewMessageUsers] = useState("");
  const {
    messages,
    setMessages,
    selectedConversation,
    setSelectedConversation,
  } = userConversation();
  const { onlineUser, socket } = useSocketContext();

  const nowOnline = chatUser.map((user) => user._id);
  const isOnline = nowOnline.map((userId) => onlineUser.includes(userId));

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      setNewMessageUsers(newMessage);
      bringUserToTop(newMessage.senderId);
    });
    return () => socket?.off("newMessage");
  }, [socket, messages]);

  useEffect(() => {
    const chatUserHandler = async () => {
      setLoading(true);
      try {
        const chatters = await axios.get(`/api/user/currentchatters`);
        const data = chatters.data;
        if (data.success === false) {
          setLoading(false);
          console.log(data.message);
        }
        setLoading(false);
        setChatUser(data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    chatUserHandler();
  }, []);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const search = await axios.get(`/api/user/search?search=${searchInput}`);
      const data = search.data;
      if (data.success === false) {
        setLoading(false);
        console.log(data.message);
      }
      setLoading(false);
      if (data.length === 0) {
        toast.info("User Not Found");
      } else {
        setSearchUser(data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleUserClick = (user) => {
    onSelectUser(user);
    setSelectedConversation(user);
    setSelectedUserId(user._id);
    setNewMessageUsers("");
    bringUserToTop(user._id);
  };

  const handleSearchback = () => {
    setSearchUser([]);
    setSearchInput("");
  };

  const handleLogOut = async () => {
    const confirmlogout = window.prompt("type 'UserName' To LOGOUT");
    if (confirmlogout === authUser.username) {
      setLoading(true);
      try {
        const logout = await axios.post("/api/auth/logout");
        const data = logout.data;
        if (data?.success === false) {
          setLoading(false);
          console.log(data?.message);
        }
        toast.info(data?.message);
        localStorage.removeItem("friendsapp");
        setAuthUser(null);
        setLoading(false);
        navigate("/login");
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    } else {
      toast.info("LogOut Cancelled");
    }
  };

  const bringUserToTop = (userId) => {
    const updatedChatUsers = chatUser.filter((user) => user._id !== userId);
    const userToMove = chatUser.find((user) => user._id === userId);
    if (userToMove) {
      setChatUser([userToMove, ...updatedChatUsers]);
    }
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <form onSubmit={handleSearchSubmit} className="sidebar-search">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            className="sidebar-search-input"
            placeholder="search user"
          />
          <button className="sidebar-search-button">
            <FaSearch />
          </button>
        </form>
        <img
          onClick={() => navigate(`/profile/${authUser?._id}`)}
          src={authUser?.profilepic}
          className="profile-pic"
        />
      </div>
      <div className="divider"></div>
      {searchUser?.length > 0 ? (
        <>
          {" "}
          <div className="sidebar-user-list">
            <div className="user-list-wrapper">
              {" "}
              {searchUser.map((user, index) => (
                <div key={user._id}>
                  {" "}
                  <div
                    onClick={() => handleUserClick(user)}
                    className={`user-item ${
                      selectedUserId === user?._id ? "selected" : ""
                    }`}
                  >
                    <div
                      className={`avatar ${isOnline[index] ? "online" : ""}`}
                    >
                      <div className="avatar-img">
                        {" "}
                        <img src={user.profilepic} alt="user.img" />
                      </div>
                    </div>
                    <div className="user-details">
                      {" "}
                      <p className="user-name">{user.username}</p>
                    </div>
                  </div>
                  <div className="divider"></div>
                </div>
              ))}
            </div>
          </div>{" "}
          <div className="back-button-container">
            <button onClick={handleSearchback} className="back-button">
              {" "}
              <IoArrowBackSharp size={25} />{" "}
            </button>{" "}
          </div>{" "}
        </>
      ) : (
        <>
          {" "}
          <div className="sidebar-user-list">
            {" "}
            <div className="user-list-wrapper">
              {chatUser.length === 0 ? (
                <div className="no-chat-users">
                  <h1>Why are you Alone!!🤔</h1>
                  <h1>Search username to chat</h1>
                </div>
              ) : (
                chatUser.map((user, index) => (
                  <div key={user._id}>
                    <div
                      onClick={() => handleUserClick(user)}
                      className={`user-item ${
                        selectedUserId === user?._id ? "selected" : ""
                      }`}
                    >
                      <div
                        className={`avatar ${isOnline[index] ? "online" : ""}`}
                      >
                        <div className="avatar-img">
                          {" "}
                          <img src={user.profilepic} alt="user.img" />
                        </div>
                      </div>
                      <div className="user-details">
                        {" "}
                        <p className="user-name">{user.username}</p>
                      </div>
                      <div>
                        {" "}
                        {newMessageUsers.receiverId === authUser._id &&
                          newMessageUsers.senderId === user._id && (
                            <div className="new-message-indicator"> +1 </div>
                          )}{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className="divider"></div>{" "}
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="logout-button-container">
            <button onClick={handleLogOut} className="logout-button">
              {" "}
              <BiLogOut size={25} />
            </button>{" "}
            <p className="logout-text">Logout</p>{" "}
          </div>{" "}
        </>
      )}
    </div>
  );
};

export default Sidebar;
