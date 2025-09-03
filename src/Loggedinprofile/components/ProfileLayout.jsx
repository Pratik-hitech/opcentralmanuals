import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider,
  CircularProgress,
  IconButton,
  TextField,
  Button,
  Box,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { httpClient } from '../../utils/httpClientSetup';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  width: '70%',
  margin: '3rem auto',
  padding: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    width: '85%',
    padding: theme.spacing(3),
  },
  [theme.breakpoints.down('sm')]: {
    width: '95%',
    padding: theme.spacing(2),
  },
}));

const SectionHeader = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: 600,
  letterSpacing: '0.5px',
  marginBottom: theme.spacing(2),
  textTransform: 'uppercase',
}));

const AvatarContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  width: 'fit-content',
  marginLeft: 'auto',
  marginBottom: theme.spacing(3),
  '&:hover .edit-button': {
    opacity: 1,
  },
}));

const EditButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: -8,
  bottom: -8,
  backgroundColor: theme.palette.background.paper,
  opacity: 0,
  transition: 'opacity 0.3s ease',
  boxShadow: theme.shadows[1],
  '&:hover': {
    backgroundColor: theme.palette.grey[200],
  },
}));

const DetailRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  marginBottom: theme.spacing(2),
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(0.5),
  },
}));

const DetailLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  color: theme.palette.text.secondary,
  minWidth: '220px',
}));

const DetailValue = styled(Typography)(({ theme }) => ({
  flex: 1,
}));

// Main Component
const ProfileLayout = () => {
  const { userid } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await httpClient.get("profile");
        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to fetch user data');
        }
        setUserData(response.data.data);
        setAvatarUrl(response.data.data.company?.logo || '');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userid]);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = () => {
    setEditMode(false);
    setUserData(prev => ({
      ...prev,
      company: {
        ...prev.company,
        logo: avatarUrl
      }
    }));
  };

  const handleCancelEdit = () => {
    setAvatarUrl(userData?.company?.logo || '');
    setEditMode(false);
  };

  // Loading State
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Error State
  if (error) {
    return (
      <StyledCard>
        <CardContent>
          <Typography color="error" variant="h6">Error: {error}</Typography>
        </CardContent>
      </StyledCard>
    );
  }

  // No Data State
  if (!userData) {
    return (
      <StyledCard>
        <CardContent>
          <Typography variant="h6">No user data found</Typography>
        </CardContent>
      </StyledCard>
    );
  }

  // Main Render
  return (
    <StyledCard elevation={4}>
      <CardContent>
        {/* Avatar Section */}
        <AvatarContainer>
          <Avatar
            src={avatarUrl}
            alt={`${userData.first_name} ${userData.last_name}`}
            sx={{ 
              width: 80, 
              height: 80,
              fontSize: '2rem',
              boxShadow: 2,
            }}
          />
          {!editMode && (
            <EditButton 
              className="edit-button" 
              onClick={handleEditClick}
              size="medium"
            >
              <EditIcon fontSize="small" />
            </EditButton>
          )}
        </AvatarContainer>

        {editMode && (
          <Box width="100%" mb={4} sx={{ textAlign: 'right' }}>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <Stack spacing={2} alignItems="flex-end">
              <Button
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                onClick={() => fileInputRef.current.click()}
                sx={{ width: 'fit-content' }}
              >
                Upload New Image
              </Button>
              <TextField
                label="Or enter image URL"
                variant="outlined"
                size="small"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                sx={{ width: '100%', maxWidth: '400px' }}
              />
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveAvatar}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Box>
        )}

        {/* User Details Section */}
        <DetailRow>
          <DetailLabel>Full Name</DetailLabel>
          <DetailValue>
            {userData.first_name} {userData.middle_name} {userData.last_name}
          </DetailValue>
        </DetailRow>

        <DetailRow>
          <DetailLabel>Role</DetailLabel>
          <DetailValue>{userData.role?.name || '-'}</DetailValue>
        </DetailRow>

        <SectionHeader variant="subtitle1">
          Personal Details
        </SectionHeader>
        <Divider sx={{ mb: 3 }} />

        <DetailRow>
          <DetailLabel>First Name</DetailLabel>
          <DetailValue>{userData.first_name || '-'}</DetailValue>
        </DetailRow>

        <DetailRow>
          <DetailLabel>Middle Name</DetailLabel>
          <DetailValue>{userData.middle_name || '-'}</DetailValue>
        </DetailRow>

        <DetailRow>
          <DetailLabel>Last Name</DetailLabel>
          <DetailValue>{userData.last_name || '-'}</DetailValue>
        </DetailRow>

        <DetailRow>
          <DetailLabel>Username</DetailLabel>
          <DetailValue>{userData.user_name || '-'}</DetailValue>
        </DetailRow>

        <DetailRow>
          <DetailLabel>Email Address</DetailLabel>
          <DetailValue>{userData.email || '-'}</DetailValue>
        </DetailRow>

        <DetailRow>
          <DetailLabel>Phone Number</DetailLabel>
          <DetailValue>{userData.phone_number || '-'}</DetailValue>
        </DetailRow>

        <DetailRow>
          <DetailLabel>Status</DetailLabel>
          <DetailValue color={userData.status === 1 ? 'success.main' : 'error.main'}>
            {userData.status === 1 ? 'Active' : 'Inactive'}
          </DetailValue>
        </DetailRow>
 <DetailRow>
          <DetailLabel>Job Title</DetailLabel>
          <DetailValue>{userData.job_title || '-'}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>Company</DetailLabel>
          <DetailValue>{userData.company?.name || '-'}</DetailValue>
        </DetailRow>

        <SectionHeader variant="subtitle1" sx={{ mt: 4 }}>
          Home Address
        </SectionHeader>
        <Divider sx={{ mb: 3 }} />

        <DetailRow>
          <DetailLabel>Address Line 1</DetailLabel>
          <DetailValue>{userData.company?.address1 || '-'}</DetailValue>
        </DetailRow>

        <DetailRow>
          <DetailLabel>Address Line 2</DetailLabel>
          <DetailValue>{userData.company?.address2 || '-'}</DetailValue>
        </DetailRow>

        <DetailRow>
          <DetailLabel>Suburb</DetailLabel>
          <DetailValue>{userData.company?.suburb || '-'}</DetailValue>
        </DetailRow>

        <DetailRow>
          <DetailLabel>State</DetailLabel>
          <DetailValue>{userData.location?.state || '-'}</DetailValue>
        </DetailRow>

        <DetailRow>
          <DetailLabel>Postcode</DetailLabel>
          <DetailValue>{userData.company?.postcode || '-'}</DetailValue>
        </DetailRow>

        <DetailRow>
          <DetailLabel>Country</DetailLabel>
          <DetailValue>{userData.location?.country|| '-'}</DetailValue>
        </DetailRow>

        <DetailRow>
          <DetailLabel>Location</DetailLabel>
          <DetailValue>{userData.location?.name || '-'}</DetailValue>
        </DetailRow>
      </CardContent>
    </StyledCard>
  );
};

export default ProfileLayout;


