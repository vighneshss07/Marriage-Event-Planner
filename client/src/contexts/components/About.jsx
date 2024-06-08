import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";

const EVENTS_DATA = [
  {
    title: "MSFM",
    image: "https://picsum.photos/380/220",
  },
  {
    title: "MSFM",
    image: "https://picsum.photos/380/220",
  },
  {
    title: "MSFM",
    image: "https://picsum.photos/320/180",
  },
];

const About = () => {
  return (
    <Box sx={{ py: 2 }}>
      <Typography
        variant="h4"
        sx={{
          textTransform: "uppercase",
          fontWeight: 700,
          my: 2,
          textAlign: "center",
        }}
      >
        Events
      </Typography>

      <CardsGrid data={EVENTS_DATA} />

      <Typography
        variant="h4"
        sx={{
          textTransform: "uppercase",
          fontWeight: 700,
          my: 2,
          textAlign: "center",
        }}
      >
        Decorations
      </Typography>

      <CardsGrid data={EVENTS_DATA} />

      <Typography
        variant="h4"
        sx={{
          textTransform: "uppercase",
          fontWeight: 700,
          my: 2,
          textAlign: "center",
        }}
      >
        Venues
      </Typography>

      <CardsGrid data={EVENTS_DATA} />
    </Box>
  );
};

const CardsGrid = ({ data = [] }) => (
  <Grid
    container
    spacing={1}
    px="2.5rem"
    my="2.5rem"
    justifyContent="space-between"
  >
    {data.map(({ title, image }, i) => (
      <Grid key={i} item>
        <Card>
          <CardMedia
            image={image}
            sx={{
              height: 220,
              width: 380,
              "&:hover": { transform: "scale(1.1)" },
              transition: "1s",
            }}
          />
          <CardContent sx={{ "&:last-child": { p: 1 } }}>
            <Typography textAlign="center">{title}</Typography>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);

export default About;
