import React from "react";
import { Routes, Route } from "react-router";
import {
  Login,
  Register,
  Layout,
  Chat,
  Home,
  MyProfile,
} from "./constants/Imports";
import { ToastContainer } from "react-toast";
import "react-toastify/dist/ReactToastify.css";
import { useAuthContext } from "./hooks/authHooks";

const App: React.FC = () => {
  const { profileBar, setProfileBar } = useAuthContext();
  return (
    <div className="overflow-hidden h-full">
      {profileBar && (
        <div
          className={`fixed inset-0 w-full h-full bg-black/40 z-30 flxRowCenter items-center ${
            !profileBar && "hidden"
          }`}
        >
          <MyProfile />
          <button
            onClick={() => {
              setProfileBar(false);
            }}
            className="user-icon h-[2.5rem] bg-transparent border-[1px] translate-x-9 translate-y-9 aspect-square self-start"
          >
            X
          </button>
        </div>
      )}
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        ></Route>
        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        ></Route>
        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        ></Route>
        <Route path="/chat" element={<Chat />}></Route>
      </Routes>
    </div>
  );
};

export default App;
