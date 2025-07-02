import { DeleteIcon, ForumIcon, PencilIcon } from "@icons/material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  Tooltip,
  TextField,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { useAuthCtx } from "../../contexts/AuthContext";

const EventList = () => {
  const { auth } = useAuthCtx();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

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
      toast.success("Event deleted successfully!", { position: "bottom-left" });
      setIsDeleteDialogOpen(false); // Close delete confirmation dialog
    },
    onError() {
      toast.error("Failed to delete event", { position: "bottom-left" });
    },
  });

  const handleDeleteEvent = (id) => {
    setEventToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      deleteEvent(eventToDelete);
    }
  };

  // Filter events based on the search query, including searching in `opts`
  const filteredEvents = (events ?? []).filter(event => {
    // Search in the title
    const titleMatch = event.title.toLowerCase().includes(searchQuery.toLowerCase());

    // Search in the opts object if the value is true
    const optsMatch = Object.keys(event.opts).some(
      key => event.opts[key] && key.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // If either title or opts match, include this event
    return titleMatch || optsMatch;
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
        {auth?.role === "ADMIN" && (
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
          </Stack>
        )}
      </Stack>

      {/* Search Bar */}
      <Box sx={{ px: 2, py: 2 }}>
        <TextField
          label="Search Events"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by event title or options (e.g., paperPresentation)"
        />
      </Box>

      {/* Card View */}
      <Stack direction="row" flexWrap="wrap" spacing={2} justifyContent="flex-start">
        {filteredEvents.map(({ title, _id, cust, date, opts, link }) => (
          <Card key={_id} sx={{ width: 300, maxWidth: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {dayjs(date).format("DD MMM YY")}
              </Typography>

              <Stack sx={{ gap: ".25rem", flexDirection: "row", marginTop: "1rem" }}>
                {Object.keys(opts).map((el, i) => (
                  <Chip
                    key={i}
                    label={`${el}`.toUpperCase()}
                    color={opts[el] ? "success" : "default"}
                    sx={{ borderRadius: "3px" }}
                  />
                ))}
              </Stack>

              {/* Display Link Button if link exists */}
              {link && (
                <Box sx={{ marginTop: "1rem" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => window.open(link, "_blank")} // Open link in a new tab
                  >
                    Open Link
                  </Button>
                </Box>
              )}
            </CardContent>
            <CardActions>
              {auth?.role === "ADMIN" && (
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Edit">
                    <IconButton
                      sx={{ fontSize: "1.5rem" }}
                      onClick={() => navigate(`./${_id}/edit`)}
                    >
                      <PencilIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      sx={{ fontSize: "1.5rem" }}
                      onClick={() => handleDeleteEvent(_id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                  {/* Link to Feedback page */}
                  <Tooltip title="View Feedback">
                    <IconButton
                      sx={{ fontSize: "1.5rem" }}
                      component={Link}
                      to={`/events/${_id}/feedback`} // Assuming the feedback page URL pattern
                    >
                      <ForumIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              )}
            </CardActions>
          </Card>
        ))}
      </Stack>

      {/* Delete Confirmation Dialog */}
      <Dialog
        sx={{
          width: "100%",
          maxWidth: "md",
          margin: "auto",
          "& .MuiPaper-root": { width: "100%" },
          "& .MuiDialogActions-root .MuiButton-root": { width: "auto" },
        }}
        open={isDeleteDialogOpen}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this event? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Dialog */}
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
            placeholder="How can we improve?"
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
