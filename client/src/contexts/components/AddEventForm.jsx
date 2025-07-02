import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { useAuthCtx } from "../AuthContext";

// Updated schema with new options and link field
const eventSchema = yup.object({
  title: yup.string().required().label("Event title"),
  date: yup
    .date()
    .required()
    .min(dayjs().startOf("date").toDate(), "date must not be past")
    .transform((val, oVal) => (oVal === "" ? undefined : val))
    .label("Date"),
  opts: yup.object({
    paperPresentation: yup.bool().default(false),
    quiz: yup.bool().default(false),
    coding: yup.bool().default(false),
    customize: yup.bool().default(false),
    customEvent: yup.string().when("opts.customize", {
      is: true,
      then: yup.string().required("Please enter a custom event"),
    }),
  }),
  cust: yup.object().nullable().required().label("Customer"),
  link: yup.string().url().nullable().label("Event link"), // Link validation
});

const AddEventForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { auth } = useAuthCtx();
  const {
    register,
    handleSubmit,
    control,
    reset,
    setFocus,
    resetField,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      title: "",
      date: dayjs().format("YYYY-MM-DD"),
      opts: { paperPresentation: true, quiz: true, coding: true, customize: false },
      cust: null,
      link: "", // Default link value
    },
    resolver: yupResolver(eventSchema),
  });
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["combo-cust"],
    queryFn: () => axios.get("/api/customer/combo"),
    select: (res) => res.data?.data,
  });

  const { data: eventDetails } = useQuery({
    queryKey: ["events", id],
    queryFn: () => axios.get("/api/event/" + id),
    select: (res) => res.data?.data,
    enabled: !!id,
  });

  useEffect(() => {
    if (id && eventDetails) {
      reset({
        ...eventDetails,
        date: dayjs(eventDetails.date).format("YYYY-MM-DD"),
      });
    }
  }, [id, eventDetails]);

  useEffect(() => {
    setFocus("title");
  }, []);

  useEffect(() => {
    if (auth?.role === "CUSTOMER") {
      resetField("cust", { defaultValue: data?.[0] ?? null });
    }
  }, [auth, data]);

  const createEvent = async (formData) => {
    if (!formData.cust || !formData.cust.c_id) {
      throw new Error("Customer is required.");
    }

    try {
      const response = await axios.post("/api/event/create", formData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Internal Server Error");
    }
  };

  const mutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries(["events"]);
      setFocus("title");
      reset();
    },
  });

  const onSubmit = (data) => {
    // Ensure the customer is properly defined before submission
    if (!data.cust) {
      return alert("Customer is required.");
    }
    mutation.mutate(data); // Send the link field with the form data
  };

  // Watch the customize option to trigger conditional rendering
  const customizeSelected = watch("opts.customize");

  return (
    <Box
      sx={{
        padding: "5rem",
        "& form": { display: "flex", flexDirection: "column", gap: "1rem" },
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography
          component="h2"
          sx={{
            fontSize: "1.25rem",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          Create Event
        </Typography>
        <TextField
          label="Title"
          fullWidth
          error={!!errors?.title?.message}
          helperText={errors?.title?.message ?? ""}
          {...register("title")}
        />
        <TextField
          {...register("date")}
          type="date"
          fullWidth
          error={!!errors?.date?.message}
          helperText={errors?.date?.message ?? ""}
        />
        <TextField
          label="Event Link"
          fullWidth
          error={!!errors?.link?.message}
          helperText={errors?.link?.message ?? ""}
          {...register("link")}
        />
        <Controller
          name="cust"
          control={control}
          render={({ field: { onChange, onBlur, ref, value }, fieldState: { error } }) => (
            <FormControl error={!!error?.message} fullWidth>
              <Autocomplete
                value={value}
                options={data ?? []}
                renderInput={(params) => (
                  <TextField {...params} inputRef={ref} />
                )}
                renderOption={(props, opt) => (
                  <div {...props} key={opt.c_id}>
                    {opt.mobileNo}
                  </div>
                )}
                disabled={auth?.role === "CUSTOMER"}
                getOptionLabel={(opt) => `${opt.mobileNo}`}
                isOptionEqualToValue={(opt, val) => opt.c_id === (val?.c_id || val?._id)}
                onChange={(e, val) => {
                  onChange(val); // Update the cust field in the form
                }}
                onBlur={onBlur}
              />
              <FormHelperText>{error?.message ?? ""}</FormHelperText>
            </FormControl>
          )}
        />
        {/* Render opts checkboxes */}
        <FormGroup sx={{ display: "flex", flexDirection: "column" }}>
          <FormControlLabel
            control={
              <Controller
                name="opts.paperPresentation"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    {...field}
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
            }
            label="Paper Presentation"
          />
          <FormControlLabel
            control={
              <Controller
                name="opts.quiz"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    {...field}
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
            }
            label="Quiz"
          />
          <FormControlLabel
            control={
              <Controller
                name="opts.coding"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    {...field}
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
            }
            label="Coding"
          />
          <FormControlLabel
            control={
              <Controller
                name="opts.customize"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    {...field}
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
            }
            label="Customize"
          />
        </FormGroup>

        {/* Show Custom Event field if 'customize' is selected */}
        {customizeSelected && (
          <TextField
            label="Custom Event"
            fullWidth
            error={!!errors?.opts?.customEvent?.message}
            helperText={errors?.opts?.customEvent?.message ?? ""}
            {...register("opts.customEvent")}
          />
        )}

        <Stack sx={{ flexDirection: "row", gap: ".25rem" }}>
          <Button
            type="button"
            variant="contained"
            disabled={mutation.isLoading}
            onClick={() => navigate("/events")}
          >
            Back To Events
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={mutation.isLoading}
          >
            {id ? "Update" : "Create"}
          </Button>
        </Stack>
        {mutation.isError && (
          <Alert severity="error">{mutation.error.message}</Alert>
        )}
      </form>
    </Box>
  );
};

export default AddEventForm;
