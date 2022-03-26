import "./App.css";
import ChatWidget from "./Components/ChatWidget";
import Content from "./Components/Content";
import Navbar from "./Components/Navbar";
import Signup from "./Components/Signup";
import Dashboard from "./Components/Dashboard";
import DashboardContent from "./Components/DashboardContent";
import Chat from "./Components/Dashboard/Chat";
import Home from "./Components/Home";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PrivateRoute from "./Components/PrivateRoute";
import PublicRoute from "./Components/PublicRoute";
import {
  Route,
  Routes,
} from "react-router-dom";
import Login from "./Components/Login";
import Layout from "./hocs/Layout";
import ChatWindow from "./Components/Dashboard/ChatWindow";
import ErrorPage from "./Components/ErrorPage";

function App() {
  const [expanded, setExpanded] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isLoading = useSelector((state) => state.auth.isLoading);
  useEffect(() => {
    document.title = "Live Chat";
  });

   // const DefaultContainer = () => (
  //   <div className="">
  //     <Navbar />
  //     <PublicRoute exact path="/" isAuthenticated={isAuthenticated}><Home/></PublicRoute>
  //   </div>
  // );
  return (
    <div className="App">
      <Layout>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute
                isAuthenticated={isAuthenticated}
                isLoading={isLoading}
              />
            }
          >
            <Route path="" element={<Login />} />{" "}
          </Route>
          <Route
            path="/signup"
            element={
              <PublicRoute
                isAuthenticated={isAuthenticated}
                isLoading={isLoading}
              />
            }
          >
            <Route path="" element={<Signup />} />{" "}
          </Route>

          <Route
            path="/dashboard"
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                isLoading={isLoading}
              />
            }
          >
            <Route path="" element={<Dashboard />}>
              <Route path="" element={<DashboardContent />} />
              <Route path="chat" element={<Chat />}>
                <Route path=":chatID" element={<ChatWindow />} />
              </Route>
            </Route>
          </Route>

          <Route exact path="/" element={<Home />} /> 
          <Route path="*" element={<ErrorPage />} /> 
        </Routes>

        <ChatWidget setExpanded={setExpanded} expanded={expanded} />
        <Content setExpanded={setExpanded} expanded={expanded} />
      </Layout>
    </div>
  );
}

export default App;
