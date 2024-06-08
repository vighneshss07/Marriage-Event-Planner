import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import cover from "../assets/images/andrew-seaman-GSnMWuCbov8-unsplash.jpg";

const adminRegistratinoSchema = yup.object({
  email: yup.string().email().required().label("Email"),
  password: yup
    .string()
    .required()
    .min(8)
    .matches(/\d/, {
      excludeEmptyString: true,
      message: "${label} must includes a number",
    })
    .label("Password"),
});

const AdminRegistrationForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(adminRegistratinoSchema),
  });

  const registerAdmin = async (formData) => {
    try {
      const response = await axios.post("/api/admin/register", formData);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  };

  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: registerAdmin,
  });

  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <Box
      sx={{
        background: "url(" + cover + ") center center no-repeat",
        backgroundSize: "cover",
        display: "grid",
        placeItems: "center",
        minHeight: "100vh",
        "& form": {
          background: "#fff",
          padding: "1rem",
          borderRadius: "3px",
          boxShadow: "2px 3px 5px rgba(0,0,0,.25)",
          minHeight: "350px",
          width: "50%",
          maxWidth: "670px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
        },
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h4">Admin Registration</Typography>
        <TextField
          {...register("email")}
          label="Email"
          fullWidth
          error={!!errors?.email?.message}
          helperText={errors?.email?.message ?? ""}
        />
        <TextField
          {...register("password")}
          label="Password"
          type="password"
          fullWidth
          error={!!errors?.password?.message}
          helperText={errors?.password?.message ?? ""}
        />
        <Button type="submit" variant="contained" disabled={isLoading}>
          Register
        </Button>
        {isError && <Alert severity="error">{error.message}</Alert>}
      </form>
    </Box>
  );
};

export default AdminRegistrationForm;
