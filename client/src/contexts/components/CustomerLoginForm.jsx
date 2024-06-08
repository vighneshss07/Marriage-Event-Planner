import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import cover from "../assets/images/admin-login-cover.jpg";
import { useAuthCtx } from "../contexts/AuthContext";

const customerLoginSchema = yup.object({
  mobileNo: yup.string().required().length(10).label("Mobile No."),
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

const CustomerLoginForm = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthCtx();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(customerLoginSchema),
  });

  const loginCustomer = async (formData) => {
    try {
      const response = await axios.post("/api/customer/login", formData);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const mutation = useMutation({
    mutationFn: loginCustomer,
    onSuccess(data) {
      setAuth(data);
      navigate("/events");
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
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
        <Typography
          component="h1"
          sx={{
            fontSize: "1.5rem",
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          Customer Login
        </Typography>
        <TextField
          {...register("mobileNo")}
          label="Mobile Number"
          fullWidth
          error={!!errors?.mobileNo?.message}
          helperText={errors?.mobileNo?.message ?? ""}
        />
        <TextField
          {...register("password")}
          label="Password"
          type="password"
          fullWidth
          error={!!errors?.password?.message}
          helperText={errors?.password?.message ?? ""}
        />
        <Button type="submit" variant="contained" disabled={mutation.isLoading}>
          Login
        </Button>
        {mutation.isError && (
          <Alert severity="error">{mutation.error.message}</Alert>
        )}
      </form>
    </Box>
  );
};

export default CustomerLoginForm;
