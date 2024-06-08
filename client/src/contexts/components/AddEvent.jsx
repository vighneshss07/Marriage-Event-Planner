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
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { useAuthCtx } from "../contexts/AuthContext";

const eventSchema = yup.object({
  title: yup.string().required().label("Event title"),
  date: yup
    .date()
    .required()
    .min(dayjs().startOf("date").toDate(), "date must not be past")
    .transform((val, oVal) => (oVal === "" ? undefined : val))
    .label("Date"),
  opts: yup.object({
    hall: yup.bool().default(false),
    dining: yup.bool().default(false),
    decorations: yup.bool().default(false),
  }),
  cust: yup.object().required().label("Customer"),
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
  } = useForm({
    defaultValues: {
      title: "",
      date: dayjs().format("YYYY-MM-DD"),
      opts: { hall: true, dining: true, decorations: true },
      cust: null,
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
    if (id && eventDetails)
      reset({
        ...eventDetails,
        date: dayjs(eventDetails.date).format("YYYY-MM-DD"),
      });
  }, [id, eventDetails]);

  useEffect(() => {
    setFocus("title");
  }, []);

  useEffect(() => {
    if (auth?.role === "CUSTOMER")
      resetField("cust", { defaultValue: data?.[0] ?? null });
  }, [auth, data]);

  const createEvent = async (formData) => {
    try {
      const response = await axios.post("/api/event/create", formData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
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

  const onSubmit = (data) => mutation.mutate(data);

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
        <Controller
          name="cust"
          control={control}
          render={({
            field: { onChange, onBlur, ref, value },
            fieldState: { error },
          }) => (
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
                isOptionEqualToValue={(opt, val) =>
                  opt.c_id === (val.c_id || val._id)
                }
                onChange={(e, val) => {
                  console.log(val);
                  onChange(val);
                }}
                onBlur={onBlur}
              />
              <FormHelperText>{error?.message ?? ""}</FormHelperText>
            </FormControl>
          )}
        />
        <FormGroup sx={{ my: 2 }} row>
          <FormControlLabel
            control={
              <Controller
                name="opts.hall"
                control={control}
                render={({ field: { value, ...field } }) => (
                  <Checkbox checked={value} {...field} />
                )}
              />
            }
            label="Hall"
          />

          <FormControlLabel
            control={
              <Controller
                name="opts.dining"
                control={control}
                render={({ field: { value, ...field } }) => (
                  <Checkbox checked={value} {...field} />
                )}
              />
            }
            label="Dining"
          />

          <FormControlLabel
            control={
              <Controller
                name="opts.decorations"
                control={control}
                render={({ field: { value, ...field } }) => (
                  <Checkbox checked={value} {...field} />
                )}
              />
            }
            label="Decorations"
          />
        </FormGroup>
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
