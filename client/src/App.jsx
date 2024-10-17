import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/user/home/Home";
import Signin from "./pages/user/signin/Signin";
import Signup from "./pages/user/signup/Signup";
import Profile from "./pages/user/profile/Profile";
import AdminLogin from "./pages/admin/AdminLogin/adminLogin";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/admin/Dashboard/Dashboard";
import AdminLoginProtector from "./pages/admin/adminProtecter/AdminLoginProtector";
import AdminRouteProtecter from "./pages/admin/adminProtecter/AdminRouteProtecter";
import EditUser from "./pages/admin/EditUser/EditUser";
import CreateUser from "./pages/admin/CreateUser/CreateUser";

function App() {
  return (
    <BrowserRouter>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route element={<PrivateRoute/>}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route element={<AdminLoginProtector/>}>
          <Route path="/admin/login" element={<AdminLogin/>} />
        </Route>
        
        <Route element={< AdminRouteProtecter />}>
          <Route path="/admin/dashboard" element={<Dashboard />}/>
          <Route path="/admin/edit-user/:userId" element={<EditUser />}/>
          <Route path="/admin/create-user" element={<CreateUser/>}/>
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
