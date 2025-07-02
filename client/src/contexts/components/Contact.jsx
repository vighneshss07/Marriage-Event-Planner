import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Grid,
  Paper,
} from "@mui/material";

const Contact = () => {
  return (
    <Box
      sx={{
        backgroundImage:
          'url("https://t3.ftcdn.net/jpg/03/38/79/70/360_F_338797073_CsO0jjvg8f8E9WqPJJn072tBwYrsFOcH.jpg")',
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        py: 6,
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            fontWeight: 700,
            textTransform: "uppercase",
            mb: 4,
            textShadow: "2px 2px 6px rgba(0,0,0,0.6)",
          }}
        >
          Contact Us
        </Typography>

        <Grid container spacing={4}>
          {/* Contact Info */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={6}
              sx={{
                p: 3,
                backgroundColor: "rgba(255,255,255,0.85)",
                color: "#333",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                },
              }}
            >
              <Typography variant="h6" gutterBottom>
                Get in touch
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                We'd love to hear from you! Reach out using any of the methods below.
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                📧 Email: <strong>We@planwedding.com</strong>
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                📞 Phone: <strong>+91 12345 67890</strong>
              </Typography>
              <Typography variant="body2">
                📍 Address: 123, Wedding Lane, Erode, India
              </Typography>
            </Paper>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={6}
              sx={{
                p: 3,
                backgroundColor: "rgba(255,255,255,0.85)",
                color: "#333",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                },
              }}
            >
              <Typography variant="h6" gutterBottom>
                Send us a message
              </Typography>
              <Box
                component="form"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <TextField label="Your Name" fullWidth required />
                <TextField label="Your Email" type="email" fullWidth required />
                <TextField
                  label="Message"
                  multiline
                  rows={4}
                  fullWidth
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: "#6a1b9a",
                    "&:hover": {
                      backgroundColor: "#9c27b0",
                    },
                  }}
                >
                  Submit
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Contact;
