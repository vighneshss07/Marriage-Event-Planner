import { Button, Stack, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import {
  Navigate,
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./App.css";
import cover from "./assets/images/11582499_21034617.jpg";
import About from "../src/contexts/components/About.jsx";
import AddEventForm from "../src/contexts/components/AddEventForm.jsx";
import AdminLoginForm from "../src/contexts/components/AdminLoginForm.jsx";
import AdminRegistrationForm from "../src/contexts/components/AdminRegistration.jsx";
import AppHeader from "../src/contexts/components/AppHeader.jsx";
import Contact from "../src/contexts/components/Contact.jsx";
import CustomerLoginForm from "../src/contexts/components/CustomerLoginForm.jsx";
import CustomerRegistrationForm from "../src/contexts/components/CustomerRegistration.jsx";
import EventList from "../src/contexts/components/EventList.jsx";
import Home from "../src/contexts/components/Home.jsx";
import AuthCtxProvider, { useAuthCtx } from "./contexts/AuthContext";
import theme from "./theme.jsx";
import SearchBar from "./contexts/components/Search.jsx";



const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <AuthCtxProvider>
            <AppHeader />
            <AppRoutes />
          </AuthCtxProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </Router>
  );
}

const AppRoutes = () => {
  const { isLoading, setAuth, setIsLoading, auth } = useAuthCtx();

  useEffect(() => {
    axios
      .get("/api/auth", { withCredentials: true })
      .then((data) => {
        setAuth(data.data);
        // navigate("/events");
      })
      .catch((err) => {
        // navigate("/login");
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <>Loading</>;

  return (
    <>
      <Routes>
        <Route
          path="/"
          index
          element={
            auth && !isLoading ? <Navigate to="/events" replace /> : <Home />
          }
        />
        <Route path="/login" element={<NonAuthRoute />}>
          <Route
            index
            element={
              <>
                <Stack
                  sx={{
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: "1rem",
                    width: "100%",
                    minHeight: "100vh",
                    background: "url(" + cover + ") center center no-repeat",
                    backgroundSize: "cover",
                  }}
                >
                  <Button
                    variant="contained"
                    href="./admin"
                    sx={{
                      width: "15rem",
                      background: "rgba(255, 255, 255, .5)",
                      padding: "1rem",
                    }}
                  >
                    Admin Login
                  </Button>
                  <Button
                    variant="contained"
                    href="./customer"
                    sx={{
                      width: "15rem",
                      background: "rgba(255, 255, 255, .5)",
                      padding: "1rem",
                    }}
                  >
                    customer Login
                  </Button>
                </Stack>
              </>
            }
          />
          <Route path="admin" element={<AdminLoginForm />} />
          <Route path="customer" element={<CustomerLoginForm />} />
        </Route>
        <Route path="/register" element={<NonAuthRoute />}>
          <Route
            index
            element={
              <>
                <Stack
                  sx={{
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: "1rem",
                    width: "100%",
                    minHeight: "100vh",
                    background: "url(" + cover + ") center center no-repeat",
                    backgroundSize: "cover",
                  }}
                >
                  <Button
                    variant="contained"
                    href="./admin"
                    sx={{
                      width: "15rem",
                      background: "rgba(255, 255, 255, .5)",
                      padding: "1rem",
                    }}
                  >
                    Admin Registration
                  </Button>
                  <Button
                    variant="contained"
                    href="./customer"
                    sx={{
                      width: "15rem",
                      background: "rgba(255, 255, 255, .5)",
                      padding: "1rem",
                    }}
                  >
                    customer Registration
                  </Button>
                </Stack>
              </>
            }
          />
          <Route path="admin" element={<AdminRegistrationForm />} />
          <Route path="customer" element={<CustomerRegistrationForm />} />
        </Route>
        <Route path="/events" element={<ProtectedRoute />}>
          <Route index element={<EventList />} />
          <Route path="new" element={<AddEventForm />} />
          <Route path=":id/edit" element={<AddEventForm />} />
        </Route>
        <Route path="/customer" element={<ProtectedRoute />}>
          {/* <Route index element={<EventList />} /> */}
          <Route path="new" element={<CustomerRegistrationForm />} />
        </Route>
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/search" element={<SearchBar />} />
      </Routes>
    </>
  );
};

const ProtectedRoute = () => {
  const { auth, isLoading } = useAuthCtx();

  if (!auth && !isLoading) return <Navigate to="/login" />;
  return <Outlet />;
};
const NonAuthRoute = () => {
  const { auth, isLoading } = useAuthCtx();

  if (auth && !isLoading) return <Navigate to="/events" replace />;
  return <Outlet />;
};

export default App;
