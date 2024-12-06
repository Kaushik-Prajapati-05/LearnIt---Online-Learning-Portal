import React, { useState } from 'react';
import { TextField, Typography, Button, Snackbar, Alert, MenuItem, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

// Wrapper for overall container with margin


const ENDPOINT= process.env.BACKEND_URL ||  "http://localhost:8000";


const Wrapper = styled('div')({
  backgroundColor: '#fff',
  padding: '40px',
});
const Section = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: '#1f3064',
  borderRadius: '8px',
}));
// Styled Container for the Feedback page with dark theme and consistent styling
const Container = styled('div')(({ theme }) => ({
  backgroundColor: "#0A1F44",
  color: "#ffffff",
  padding: '40px 20px 60px',
  borderRadius: '8px',
  width: '90%',
  margin: '0 auto',
  fontFamily: "'Poppins', sans-serif",
}));

const SubmitButton = styled(Button)({
  backgroundColor: '#FF8C00',
  color: '#fff',
  fontFamily: "'Poppins', sans-serif",
  '&:hover': {
    backgroundColor: '#FF7000',
  },
  marginTop: '20px',
});

// Styled TextField with unified styling for labels, input, and borders
const StyledTextField = styled(TextField)(({
  backgroundColor: '#0A1F44',
  borderRadius: 4,
  "& .MuiInputBase-input": {
    color: "#ffffff",
  },
  "& .MuiInputLabel-root": {
    color: "#aaaaaa",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#555555",
    },
    "&:hover fieldset": {
      borderColor: "#888888",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#ff9800",
    },
  },
  fontFamily: "'Poppins', sans-serif",
}));

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState({
    rating: '',
    comments: '',
  });
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    setFeedback({
      ...feedback,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    console.log("Feedback submitted:", feedback);
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
      <Container style={{marginTop: '30px', paddingTop: '30px', backgroundColor: '#1f3064'}}>
        <Typography variant="h4" gutterBottom style={{color: '#ff6600'}}>
          Course Feedback
        </Typography>
        <Section style={{backgroundColor: '#000e3dfb'}}>
        <StyledTextField
          fullWidth
          select
          label="Rating"
          name="rating"
          value={feedback.rating}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
          style={{backgroundColor: '#000e3dfb'}}
        >
          <MenuItem value="">Select Rating</MenuItem>
          <MenuItem value="1">1 - Poor</MenuItem>
          <MenuItem value="2">2 - Fair</MenuItem>
          <MenuItem value="3">3 - Good</MenuItem>
          <MenuItem value="4">4 - Very Good</MenuItem>
          <MenuItem value="5">5 - Excellent</MenuItem>
        </StyledTextField>

        <StyledTextField
          fullWidth
          label="Comments"
          name="comments"
          value={feedback.comments}
          onChange={handleChange}
          variant="outlined"
          multiline
          rows={4}
          margin="normal"
          style={{backgroundColor: '#000e3dfb'}}
        />

        <SubmitButton variant="contained" onClick={handleSubmit}>
          Submit Feedback
        </SubmitButton>

        <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Thank you for your feedback!
          </Alert>
        </Snackbar>
        </Section>
      </Container>
  );
};

export default FeedbackPage;
