import React, { useState, useEffect } from 'react';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { TourProvider, useTour } from '@reactour/tour';
import { steps } from '../components/steps';
import { sendPrompt, getNext } from '../helpers/apiUtils';
import { textToSpeech } from '../helpers/textToSpeech';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { 
  Button, 
  TextField, 
  Box, 
  Typography, 
  Paper, 
  Grid2, 
  Snackbar, 
  IconButton,
  InputAdornment
} from '@mui/material';
import '../App.css';
import gifImage from '../assets/teddy.png'; // Import your video

import SideWindow from './SideWindow';


function RecipeForm() {
    
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    
    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    const [res, setRes] = useState("");
    const [list, setList] = useState([]);

    const [img, setImg] = useState("");

    const [manual, setManual] = useState("");

    const [prevTranscript, setPrevTranscript] = useState("");

    const updateTranscript = (newTranscript) => {
        let tempTranscript = newTranscript.slice(prevTranscript.length);
        setPrevTranscript(newTranscript);
        setManual((prevManual) => prevManual + tempTranscript);
    };

    const handleReset = () => {
        setManual("");
        resetTranscript();
    };

    const queryIdeas = (meal) => {
        setPressed(false);
        let query = "Give me ideas for " + meal;
        sendPrompt(query).then(response => {
            console.log('Response from backend:', response);
            textToSpeech(response.response);
            setRes(response.response);
            setList([response.response]);
        }
        ).catch(error => {
            console.error('Error sending prompt:', error);
        }
        );
    };

    useEffect(() => {
        updateTranscript(transcript);
        if(transcript.toLowerCase().includes('next')) {
            console.log(transcript);
            handleReset();
            getNext().then(response => {
                console.log('Response from backend:', response);
                textToSpeech(response.response);
                setRes(response.response);
                setList([...list, response.response]);
            }).catch(error => {
                console.error('Error getting next:', error);
            });
        }
        if(transcript.toLowerCase().includes('stop')) {
            console.log(transcript);
            SpeechRecognition.stopListening();
            handleReset();
        }

        if (transcript.toLowerCase().includes('send')) {
            console.log(transcript); // Logic for sending to backend.
            let copy = manual;
            handleReset();
            sendPrompt(copy).then(response => {
                console.log('Response from backend:', response);
                textToSpeech(response.response);
                setRes(response.response);
                if (response.flag === "alternate"){
                    let tempList = [...list];
                    tempList.pop();
                    setList([...tempList, response.response]);
                    setImg("");
                }
                else if(response.flag === "image"){
                    setList([response.response]); // buggy line
                    setImg(response["image_url"]);
                }
                else{
                    setList([response.response]);
                    setImg("");
                }
            }).catch(error => {
                console.error('Error sending prompt:', error);
            });
        }
    }, [transcript]);


  const [recipe, setRecipe] = useState({
    name: '',
    prepTime: '',
    servings: '',
    ingredients: '',
    instructions: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isVibrating, setIsVibrating] = useState(false); // State to control vibration class

  const [pressed, setPressed] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true });
    textToSpeech("Microphone is on");
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    textToSpeech("Microphone is off");
  };

  // Sync the local state with the SpeechRecognition listening state
  useEffect(() => {
    setIsListening(listening); // Update the vibration state based on `listening`
  }, [listening]);

return (
<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
  <TourProvider
          steps={steps} // Provide steps here
          badgeContent={({ totalSteps, currentStep }) => `${currentStep + 1} / ${totalSteps}`}
        >
            <Grid2 container spacing={3} sx={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {/* Recipe Form Section */}
                <Grid2 item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 4, height: '100%', marginTop: '6rem', backgroundColor: "hsl(36, 81%, 94%);" }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 4 }}>
                            <img
                                src={gifImage}
                                alt="Descriptive Text"
                                style={{ width: '50%' }}
                                className={`${isListening ? 'vibrate' : ''} tedAI`}
                                onClick={() => {
                                    if (listening) {
                                        stopListening();
                                    } else {
                                        startListening();
                                    }
                                }}
                            />
                            <TextField
                                fullWidth
                                placeholder="What can I help you cook?"
                                className='helpGuide'
                                variant="outlined"
                                value={manual}
                                onChange={(e) => setManual(e.target.value)} 
                                sx={{ backgroundColor: '#ffffff', borderRadius: 10 }}
                            />
                            {!pressed && (
                            <Button
                              onClick={() => setPressed(true)}
                              variant="contained"
                              color="success"
                              fullWidth
                              sx={{
                                mb: 1,
                                borderRadius: 20, // Rounded corners
                                fontWeight: 'bold', // Bold text for emphasis
                                '&:hover': {
                                  backgroundColor: '#388e3c', // Darker green on hover
                                },
                                transition: 'background-color 0.3s ease', // Smooth hover transition
                              }}
                            >
                              Need ideas for meals?
                              <RestaurantIcon sx={{ mr: 1 }} />
                            </Button>
                          )}

                          {pressed && (
                            <>
                              <Button
                                onClick={() => queryIdeas("Breakfast")}
                                variant="contained"
                                color="success"
                                fullWidth
                                sx={{
                                  mb: 1,
                                  borderRadius: 20,
                                  fontWeight: 'bold',
                                  minWidth: 'auto',
                                  '&:hover': {
                                    backgroundColor: '#388e3c',
                                  },
                                  transition: 'background-color 0.3s ease',
                                }}
                              >
                                Breakfast
                              </Button>

                              <Button
                                onClick={() => queryIdeas("Lunch")}
                                variant="contained"
                                color="success"
                                fullWidth
                                sx={{
                                  mb: 1,
                                  borderRadius: 20,
                                  fontWeight: 'bold',
                                  '&:hover': {
                                    backgroundColor: '#388e3c',
                                  },
                                  transition: 'background-color 0.3s ease',
                                }}
                              >
                                Lunch
                              </Button>

                              <Button
                                onClick={() => queryIdeas("Dinner")}
                                variant="contained"
                                color="success"
                                fullWidth
                                sx={{
                                  mb: 1,
                                  borderRadius: 20,
                                  fontWeight: 'bold',
                                  '&:hover': {
                                    backgroundColor: '#388e3c',
                                  },
                                  transition: 'background-color 0.3s ease',
                                }}
                              >
                                Dinner
                              </Button>
                            </>
                          )}

                                </Box>
                            </Paper>
                        </Grid2>

                                          {/* Side Window Section */}
                                          <Grid2 item xs={12} md={6}>
                                              {list.length > 0 && <SideWindow list={list} setRes={setRes} img={img} setList={setList} />}
                                          </Grid2>
                                      </Grid2>
                                      </TourProvider>
                          </Box>
                          );
                          }

export default RecipeForm;