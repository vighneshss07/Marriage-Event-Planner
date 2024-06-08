import { DeleteIcon, ForumIcon, PencilIcon } from "@icons/material";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthCtx } from "../contexts/AuthContext";

const EventList = () => {
  const { auth } = useAuthCtx();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const {
    data: events,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const response = await axios.get("/api/event/all");
      return response.data;
    },
  });

  const { mutateAsync: deleteEvent } = useMutation({
    mutationFn: (id) => axios.delete("/api/event?id=" + id),
    onSuccess() {
      queryClient.invalidateQueries(["events"]);
    },
  });

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return (
      <Typography variant="body1" color="error">
        Error fetching events
      </Typography>
    );
  }

  return (
    <div>
      <Toaster />
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        px={2}
        py={1}
      >
        <Box>
          <Typography
            component="h1"
            sx={{
              fontSize: "2rem",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Events
          </Typography>
        </Box>
        <Stack
          sx={{
            flexDirection: "row",
            alignItems: "center",
            gap: ".5rem",
          }}
        >
          <Box>
            <Button variant="contained" href="./new" disableElevation>
              Add Event
            </Button>
          </Box>
          {auth?.role === "ADMIN" && (
            <Box>
              <Button variant="contained" href="/customer/new" disableElevation>
                Add Customer
              </Button>
            </Box>
          )}
        </Stack>
      </Stack>
      <TableContainer sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ "& .MuiTableCell-root": { fontWeight: 600 } }}>
              <TableCell>Title</TableCell>
              <TableCell>Date</TableCell>
              {auth?.role === "ADMIN" ? <TableCell>Customer</TableCell> : null}
              <TableCell>Options</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(events ?? []).map(({ title, _id, cust, date, opts }) => (
              <TableRow key={_id}>
                <TableCell>{title}</TableCell>
                <TableCell>{dayjs(date).format("DD MMM YY")}</TableCell>
                {auth?.role === "ADMIN" && (
                  <TableCell>{cust.mobileNo}</TableCell>
                )}
                <TableCell>
                  <Stack sx={{ gap: ".25rem", flexDirection: "row" }}>
                    {Object.keys(opts).map((el, i) => (
                      <Chip
                        key={i}
                        label={`${el}`.toUpperCase()}
                        color={opts[el] ? "success" : "default"}
                        sx={{ borderRadius: "3px" }}
                      />
                    ))}
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack sx={{ flexDirection: "row" }}>
                    <Tooltip title="Edit">
                      <IconButton
                        sx={{ width: 50, height: 50, fontSize: "0.85rem" }}
                        onClick={() => navigate(`./${_id}/edit`)}
                      >
                        <PencilIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        sx={{ width: 50, height: 50, fontSize: "0.85rem" }}
                        onClick={() => {
                          toast.promise(
                            deleteEvent(_id),
                            {
                              loading: "loading",
                              error: "error",
                              success: "success",
                            },
                            { position: "bottom-left" }
                          );
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    {auth?.role === "CUSTOMER" && (
                      <Tooltip title="Feedback">
                        <IconButton
                          sx={{ width: 50, height: 50, fontSize: "0.85rem" }}
                          onClick={() => setIsFeedbackOpen(true)}
                        >
                          <ForumIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        sx={{
          width: "100%",
          maxWidth: "md",
          margin: "auto",
          "& .MuiPaper-root": { width: "100%" },
          "& .MuiDialogActions-root .MuiButton-root": { width: "auto" },
        }}
        open={isFeedbackOpen}
      >
        <DialogTitle>Feedback</DialogTitle>
        <DialogContent>
          <TextField
            placeholder="How can we improve ?"
            rows={5}
            multiline
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsFeedbackOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              toast.success("Thank you for your valuable feedback", {
                position: "bottom-left",
              });
              setIsFeedbackOpen(false);
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EventList;
