import React, { useState } from "react";
import MessageContainer from "./components/MessageContainer";
import Sidebar from "./components/Sidebar";
import "../home/Home.css";

const Home = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setIsSidebarVisible(false);
  };
  const handleShowSidebar = () => {
    setIsSidebarVisible(true);
    setSelectedUser(null);
  };

  return (
    <div className="home-container">
      <div className={`sidebar-container${isSidebarVisible ? "" : "hidden"}`}>
        <Sidebar onSelectUser={handleUserSelect} />
      </div>
      <div
        className={`divider divider-horizontal px-3 md:flex ${
          isSidebarVisible ? "" : "hidden"
        } ${selectedUser ? "block" : "hidden"}`}
      ></div>
      <div
        className={`message-container${selectedUser ? "" : "hidden md:flex"} `}
      >
        <MessageContainer onUserBack={handleShowSidebar} />
      </div>
    </div>
  );
};

export default Home;
