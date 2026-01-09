import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import { UserProvider } from "./context/usercontext";
import { PageProvider } from "./context/pagecontext";
import { GroupProvider } from "./context/groupcontext";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import Home from "./pages/Home";
function App() {
  //wrap in other context
  return (
    <>
      <UserProvider>
        <GroupProvider>
          <PageProvider>
            <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/signup" element={<Signup />}></Route>
              <Route path="/chat" element={<Chat />}></Route>
              <Route path="/admin" element = {<AdminLogin/>}></Route>
              <Route path="/admin/home" element = {<Admin/>}></Route>
            </Routes>
          </PageProvider>
        </GroupProvider>
      </UserProvider>
    </>
  );
}

export default App;
