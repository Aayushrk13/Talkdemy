import {Routes,Route} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import { UserProvider } from "./context/usercontext";
function App() {
//wrap in other context
  return (<>
        <UserProvider>
          <Routes>
            <Route path="/" element={<Login/>}></Route>
            <Route path="/signup" element={<Signup/>}></Route>
            <Route path="/chat" element={<Chat/>}></Route> 
          </Routes>
        </UserProvider>
  </>);
}

export default App
