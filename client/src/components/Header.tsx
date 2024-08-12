import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="flxBtw fixed top-0 w-full py-4 px-7">
      <h1 className="tetx-xl font-bold highlightTextCol">DawgsChat</h1>
      <Link to={"/login"}>
        <button className="rounded-full w-[5rem] h-[2.3rem] text-center flxColCenter items-center primaryBgCol whiteText">
          Login
        </button>
      </Link>
    </header>
  );
};

export default Header;
