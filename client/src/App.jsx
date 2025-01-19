import React, { useState, useEffect } from 'react';
import {Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import RecipeForm from './components/RecipeForm';
import AllergyPopup from './components/AllergyPopup';
import gifImage from './assets/teddy.png'; // Import your video
import { Box } from '@mui/material';
import Logo from './components/Logo'
import { TourProvider, useTour } from '@reactour/tour';
import { steps } from './components/steps';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff6b6b', // A vibrant red
    },
    secondary: {
      main: '#4ecdc4', // A fresh teal
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

function OpenTourButton() {
  const { setIsOpen } = useTour();
  useEffect(() => {
    setIsOpen(true); // Open the tour when the component mounts
  }, [setIsOpen]);
  return (
    <button
      onClick={() => setIsOpen(true)}
      style={{
        // position: 'absolute',
        display: "inline-block",
        top: '10px',
        right: '10px',
        marginTop: '10px',
        marginBottom: '10px',
        padding: '10px 15px',
        backgroundColor: '#50C878',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
    >
      How do I use tedAI!
    </button>
  );
}

function App() {
  const [showAllergyPopup, setShowAllergyPopup] = useState(false);
  const toggleAllergyPopup = () => setShowAllergyPopup(!showAllergyPopup);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TourProvider
        steps={steps} // Provide steps here
        badgeContent={({ totalSteps, currentStep }) => `${currentStep + 1} / ${totalSteps}`}
      >
      
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Logo className="logo" />
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',  // Align buttons to the right
            // position: 'relative',
            gap: "2rem"
          }}>
        <OpenTourButton />
        <button
            onClick={toggleAllergyPopup}
            style={{
              display: "inline-block",
              padding: '10px 20px',
              backgroundColor: '#ff6b6b',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              // marginTop: '20px',
              position: 'absolute',   // Absolute positioning
              // right: '20px',
            }}
          >
            Edit Dietary Restrictions
          </button>
          {showAllergyPopup && (
            <div >
              <AllergyPopup onClose={() => setShowAllergyPopup(false)} />
            </div>
          )}
          </div>
          <Routes>
            <Route path="/recipe-form" element={<div className="recipe-form"><RecipeForm /></div>} />
            <Route path="*" element={<Navigate to="/recipe-form" replace />} />
          </Routes>
        </div>
        </TourProvider>
    </ThemeProvider>
  );
}

export default App;
