import React, { useState } from 'react';
import { 
  Button, 
  TextField, 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Snackbar, 
  IconButton,
  InputAdornment
} from '@mui/material';

import gifImage from '../assets/teddy.png'; // Import your video


function RecipeForm() {
  const [recipe, setRecipe] = useState({
    name: '',
    prepTime: '',
    servings: '',
    ingredients: '',
    instructions: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Recipe submitted:', recipe);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#ffffff' }}>
      {/* Content Area */}
      <Box sx={{ flex: 1, p: 4 }}>
        <Paper elevation={3} sx={{ maxWidth: 800, width: '100%', mx: 'auto', p: 4, borderRadius: 4 }}>
          {/* <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}> */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 4 }}>
            {/* <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, color: '#2e7d32' }}>
              Your Personalized Recipe
            </Typography> */}
            <img 
        src={gifImage}  // Path to your GIF
        alt="Descriptive Text"
        style={{ width: '50%'}}  // Optional styling
      />
            {/* <RestaurantMenuIcon sx={{ fontSize: 60, color: '#4caf50' }} /> */}
        <TextField
          fullWidth
          placeholder="Search..."
          variant="outlined"
          sx={{ backgroundColor: '#ffffff', borderRadius: 1 }}
        />
        <Button variant="contained" color="success" fullWidth sx={{ mb: 1 }}>
          Need ideas for meals?
        </Button>
          </Box>
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
            message="Recipe submitted successfully!"
          />
        </Paper>
      </Box>
    </Box>
  );
}

export default RecipeForm;