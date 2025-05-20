import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Entertainment } from "./pages/Entertainment";
import { Education } from "./pages/Education";
import { Religious } from "./pages/Religious";
import { Programming } from "./pages/Programming";
import { Dashboard } from "./pages/Dashboard";
import { Cursor } from "./components/Cursor";
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { YouTubeApiProvider } from "./contexts/YouTubeApiContext"; // Import the provider

// Component to handle route changes and scroll behavior
const RouteChangeTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
};

// Wrapper component that gets location from router
const AppRoutes = () => {
  const location = useLocation();

  return (
    <>
      <RouteChangeTracker />
      <Layout>
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/entertainment" element={<Entertainment />} />
            <Route path="/education" element={<Education />} />
            <Route path="/religious" element={<Religious />} />
            <Route path="/programming" element={<Programming />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </>
  );
};

function App() {
  return (
    // <React.StrictMode> // StrictMode can be added here if needed
    <YouTubeApiProvider>
      {" "}
      {/* Provider wraps Router */}
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Cursor />
        <AppRoutes />
      </Router>
    </YouTubeApiProvider>
    // </React.StrictMode>
  );
}

export default App;
