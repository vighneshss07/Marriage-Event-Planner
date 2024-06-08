import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthCtx } from "../contexts/AuthContext";

function AppHeader() {
  const navigate = useNavigate();
  const { setAuth, auth } = useAuthCtx();

  const { mutate: logout } = useMutation({
    mutationFn: async () => await axios.get("/api/auth/logout"),
    onSuccess() {
      setAuth();
      navigate("/login");
    },
  });

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href={auth ? "/events" : "/"}
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              textTransform: "uppercase",
              fontWeight: 700,
              letterSpacing: ".05rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Marriage Events Planer
          </Typography>

          <Typography
            variant="h5"
            noWrap
            component="a"
            href={auth ? "/events" : "/"}
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              textTransform: "uppercase",
              fontWeight: 700,
              letterSpacing: ".05rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Marriage Events Planner
          </Typography>

          <Box>
            <Button sx={{ color: "#fff" }} href="/about">
              About
            </Button>
            <Button sx={{ color: "#fff" }} href="/contact">
              Contact
            </Button>
          </Box>

          {!!auth && (
            <Box sx={{ ml: "auto", mr: 0 }}>
              <Button
                sx={{ background: "#fff", "&:hover": { background: "#fff" } }}
                onClick={logout}
              >
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default AppHeader;
