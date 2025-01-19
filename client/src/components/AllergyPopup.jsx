import React, { useState } from 'react';
import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  Chip,
  FormControl,
  FormHelperText,
  RadioGroup,
  Radio,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { updateDietaryNeeds } from '../helpers/apiUtils';

const allergens = ['Peanuts', 'Tree Nuts', 'Milk', 'Eggs', 'Fish', 'Shellfish', 'Soy', 'Wheat', 'Veg', 'Non Veg', 'Organic', 'Non Organic'];

function AllergyPopup({ onClose }) {
  const [showAllergens, setShowAllergens] = useState(false);
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [isVeg, setIsVeg] = useState(null); // null for unselected, true for Veg, false for Non-Veg
  const [isOrganic, setIsOrganic] = useState(null);

  const handleYes = () => {
    setShowAllergens(true);
  };

  const handleNo = () => {
    onClose();
  };

  const handleAllergenChange = (event) => {
    const allergen = event.target.name;
    setSelectedAllergens(prev =>
      event.target.checked
        ? [...prev, allergen]
        : prev.filter(a => a !== allergen)
    );
  };

  const handleSaveAllergens = () => {
    let updatedDietaryNeeds = {};
    selectedAllergens.forEach((allergen, index) => {
        updatedDietaryNeeds[`allergen_${index + 1}`] = allergen;
    });
    if (isVeg !== null) {
        updatedDietaryNeeds["veg"] = isVeg ? "Veg" : "Non-Veg";
    }
    if (isOrganic !== null) {
        updatedDietaryNeeds["organic"] = isOrganic ? "Organic" : "Non-Organic";
    }
    updateDietaryNeeds(updatedDietaryNeeds);
    // console.log('Dietary needs after update:', updatedDietaryNeeds);
    onClose();
};


  const handleVegChange = (event) => {
    setIsVeg(event.target.value === 'veg');
  };

  const handleOrganicChange = (event) => {
    setIsOrganic(event.target.value === 'organic');
  };

  return (
    <Dialog 
      open={true} 
      onClose={onClose}
      PaperProps={{
        style: {
          borderRadius: 16,
          padding: 16,
          maxWidth: 400,
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <WarningIcon color="warning" sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
            Dietary Restrictions
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          We want to ensure your safety. Do you have any Dietary Restrictions?
        </DialogContentText>
        {!showAllergens ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
            <Button onClick={handleYes} variant="contained" color="primary" size="large">
              Yes
            </Button>
            <Button onClick={handleNo} variant="outlined" color="primary" size="large">
              No
            </Button>
          </Box>
        ) : (
          <>
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 500 }}>
              Please select your allergies:
            </Typography>
            <FormGroup>
              {allergens.map(allergen => (
                <FormControlLabel
                  key={allergen}
                  control={
                    <Checkbox
                      checked={selectedAllergens.includes(allergen)}
                      onChange={handleAllergenChange}
                      name={allergen}
                    />
                  }
                  label={allergen}
                />
              ))}
            </FormGroup>
            {/* Veg or Non-Veg Question */}
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 500 }}>
        Are you Veg or Non-Veg?
      </Typography>
      <FormControl>
        <RadioGroup
          aria-label="veg-non-veg"
          name="vegNonVeg"
          value={isVeg === null ? '' : isVeg ? 'veg' : 'nonVeg'}
          onChange={handleVegChange}
        >
          <FormControlLabel value="veg" control={<Radio />} label="Veg" />
          <FormControlLabel value="nonVeg" control={<Radio />} label="Non-Veg" />
        </RadioGroup>
      </FormControl>

      {/* Organic or Non-Organic Question */}
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 500 }}>
        Do you prefer Organic or Non-Organic products?
      </Typography>
      <FormControl>
        <RadioGroup
          aria-label="organic-non-organic"
          name="organicNonOrganic"
          value={isOrganic === null ? '' : isOrganic ? 'organic' : 'nonOrganic'}
          onChange={handleOrganicChange}
        >
          <FormControlLabel value="organic" control={<Radio />} label="Organic" />
          <FormControlLabel value="nonOrganic" control={<Radio />} label="Non-Organic" />
        </RadioGroup>
      </FormControl>
            
            
            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>Selected Allergies:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {selectedAllergens.map(allergen => (
                  <Chip key={allergen} label={allergen} color="primary" variant="outlined" />
                ))}
              </Box>
            </Box>
          </>
        )}
      </DialogContent>
      {showAllergens && (
        <DialogActions sx={{ justifyContent: 'center', mt: 2 }}>
          <Button onClick={handleSaveAllergens} variant="contained" color="primary" size="large">
            Save Restrictions
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}

export default AllergyPopup;
