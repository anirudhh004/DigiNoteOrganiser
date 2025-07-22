import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Timetable from './pages/Timetable';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from "sonner";
import { ModeToggle } from "@/components/mode-toggle";
import Navbar from "@/components/Navbar"; 

function AppContent() {
  const location = useLocation();
  const [authReady, setAuthReady] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setToken(token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setToken(null);
    }
    setAuthReady(true);
  }, []);

  const noNavbarRoutes = ["/", "/register"];
  const showNavbar = !noNavbarRoutes.includes(location.pathname);

  if (!authReady) return <p>Loading...</p>;

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      
      {showNavbar && <Navbar />}
      {!showNavbar && <div className="absolute top-4 right-4"><ModeToggle /></div>}
      <main className="min-h-screen bg-background text-foreground">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/timetable" element={<Timetable />} />
        </Routes>
      </main>
      <Toaster />
    </ThemeProvider>
  );
}

export default AppContent;
