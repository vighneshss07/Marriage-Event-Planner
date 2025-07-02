// src/schemas/schema.js
import * as yup from "yup";

export const eventSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters long"),
  date: yup.date().required("Date is required"),
  time: yup.string().required("Time is required"),
  department: yup.string().required("Department is required"),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters long"),
  opts: yup.object({
    hall: yup.boolean(),
    dining: yup.boolean(),
    decorations: yup.boolean(),
  }),
  cust: yup.object().nullable(), // You can adjust this based on how 'cust' data is handled
});
