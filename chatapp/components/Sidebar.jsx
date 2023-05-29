import React from "react";
import Navbar from "./Navbar";
import Search from "./Search";
import Chats from "./Chats";

const Sidebar = () => {
  return (
    <div className=" relative  h-full overflow-x-hidden overflow-y-auto">
      <Navbar />
      <Search />
      <Chats />
    </div>
  );
};

export default Sidebar;
