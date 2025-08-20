import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Paper, 
  Typography, 
  Divider, 
  Skeleton,
  Alert,
  IconButton,
  Container
} from '@mui/material';
import { PlayArrow, Pause } from '@mui/icons-material';
import { httpClient } from '../../../utils/httpClientSetup';
import { format } from 'date-fns';

const ViewPolicy = () => {
  const { id } = useParams();
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [utterance, setUtterance] = useState(null);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        setLoading(true);
        const response = await httpClient.get(`policies/${id}`);
        
        if (response.data.success) {
          setPolicy(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch policy');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching the policy');
      } finally {
        setLoading(false);
      }
    };

    fetchPolicy();

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [id]);

  const handleSpeech = () => {
    if (!policy) return;

    if (isSpeaking) {
      window.speechSynthesis.pause();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance();
      speech.text = `${policy.title}. ${policy.content}`;
      
      speech.onend = () => {
        setIsSpeaking(false);
        setUtterance(null);
      };
      
      speech.onerror = (e) => {
        console.error('Speech error:', e);
        setIsSpeaking(false);
        setUtterance(null);
      };
      
      speech.onboundary = () => {};
      
      setUtterance(speech);
      window.speechSynthesis.speak(speech);
      setIsSpeaking(true);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" width="100%" height={400} />
        <Box sx={{ mt: 2 }}>
          <Skeleton variant="text" width="60%" height={40} />
          <Skeleton variant="text" width="80%" height={60} />
          <Skeleton variant="text" width="100%" height={200} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!policy) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">Policy not found</Alert>
      </Container>
    );
  }

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        py: 4,
        width: '80%',
        maxWidth: { xs: '100%', sm: '90%', md: '80%' }
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 2, sm: 3 },
          width: '100%'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          mb: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 }
        }}>
          <Box sx={{ width: { xs: '100%', sm: 'calc(100% - 48px)' } }}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
            >
              {policy.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Last updated: {format(new Date(policy.updated_at), 'MMM dd, yyyy')}
            </Typography>
          </Box>
          
          <IconButton
            onClick={handleSpeech}
            aria-label={isSpeaking ? "Pause reading" : "Read aloud"}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              p: 1,
              '&:hover': {
                backgroundColor: 'action.hover'
              },
              alignSelf: { xs: 'flex-start', sm: 'center' }
            }}
            size="small"
          >
            {isSpeaking ? (
              <Pause fontSize="small" />
            ) : (
              <PlayArrow fontSize="small" />
            )}
          </IconButton>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="body1" 
            whiteSpace="pre-line"
            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            {policy.content}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ViewPolicy;