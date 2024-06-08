// Feedback.jsx
import React from 'react';
import { Grid, TextField, Button } from '@mui/material';

const Feedback = () => {
  return (
    <div>
      <h2>Feedback Module</h2>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Report"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Drawbacks"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Review"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary">
            Submit
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Feedback;
