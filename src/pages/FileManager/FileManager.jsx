import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Paper,
  Divider,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Tooltip,
  Menu,
  MenuItem,
  ListItemButton
} from '@mui/material';
import {
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Videocam as VideoIcon,
  Image as ImageIcon,
  CreateNewFolder as CreateNewFolderIcon,
  CloudUpload as UploadIcon,
  Close as CloseIcon,
  GetApp as DownloadIcon,
  Visibility as PreviewIcon,
  MoreVert as MoreVertIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Updated color palette with cream gradient background
const colors = {
  background: 'linear-gradient(135deg, #f5f5dc 0%, #ffffff 100%)',
  paper: '#ffffff',
  primary: '#616161',
  secondary: '#e0e0e0',
  text: '#212121',
  divider: '#bdbdbd',
  cardHover: '#f5f5f5',
  folderYellow: '#ffc107' // Windows folder yellow color
};

// Sample media data
const sampleMedia = {
  home: [
    { id: 'img1', name: 'welcome.jpg', type: 'image', url: 'https://source.unsplash.com/random/300x300?nature' },
    { id: 'vid1', name: 'intro.mp4', type: 'video', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }
  ],
  operations: [
    { id: 'img2', name: 'safety.jpg', type: 'image', url: 'https://source.unsplash.com/random/300x300?safety' },
    { id: 'vid2', name: 'procedure.mp4', type: 'video', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' }
  ],
  breeds: [
    { id: 'img3', name: 'breed1.jpg', type: 'image', url: 'https://source.unsplash.com/random/300x300?dog' },
    { id: 'img4', name: 'breed2.jpg', type: 'image', url: 'https://source.unsplash.com/random/300x300?cat' }
  ]
};

// Mock API functions
const api = {
  getFolders: () => {
    const savedFolders = localStorage.getItem('mediaFolders');
    return savedFolders ? JSON.parse(savedFolders) : null;
  },
  saveFolders: (folders) => {
    localStorage.setItem('mediaFolders', JSON.stringify(folders));
  },
  uploadFile: (file) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const url = URL.createObjectURL(file);
        resolve({
          id: `file-${Date.now()}`,
          name: file.name,
          type: file.type.startsWith('video') ? 'video' : 'image',
          url
        });
      }, 1000);
    });
  }
};

const StyledTreeItem = styled(Box)(({ theme }) => ({
  width: '100%',
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const MediaCardOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    opacity: 1,
  },
}));

const MediaFolderViewer = () => {
  const [folders, setFolders] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [viewMode, setViewMode] = useState('home');
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [renameDialog, setRenameDialog] = useState({ open: false, folderId: '', newName: '' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, folderId: '' });
  const [viewType, setViewType] = useState('grid'); // 'grid' or 'list'
  const fileInputRef = useRef(null);

  // Initialize folders from API/localStorage
  useEffect(() => {
    const loadFolders = () => {
      const savedFolders = api.getFolders();
      if (savedFolders) {
        setFolders(savedFolders);
        setCurrentFolder(savedFolders[0]);
      } else {
        // Initialize with sample data
        const initialFolders = [
          {
            id: 'home',
            name: 'Home',
            isOpen: true,
            media: [...sampleMedia.home],
            subfolders: [
              {
                id: 'operations',
                name: 'Operations Manual',
                isOpen: false,
                media: [...sampleMedia.operations],
                subfolders: []
              },
              {
                id: 'breeds',
                name: 'Restricted Breeds',
                isOpen: false,
                media: [...sampleMedia.breeds],
                subfolders: []
              }
            ]
          }
        ];
        setFolders(initialFolders);
        setCurrentFolder(initialFolders[0]);
        api.saveFolders(initialFolders);
      }
    };

    loadFolders();
  }, []);

  const toggleFolder = (folderId) => {
    const updatedFolders = updateFolderState(folders, folderId, folder => ({
      ...folder,
      isOpen: !folder.isOpen
    }));
    setFolders(updatedFolders);
    api.saveFolders(updatedFolders);
  };

  const updateFolderState = (folders, folderId, updateFn) => {
    return folders.map(folder => {
      if (folder.id === folderId) {
        return updateFn(folder);
      }
      if (folder.subfolders?.length > 0) {
        return {
          ...folder,
          subfolders: updateFolderState(folder.subfolders, folderId, updateFn)
        };
      }
      return folder;
    });
  };

  const handleFolderClick = (folder) => {
    setCurrentFolder(folder);
    setSelectedMedia(null);
    setViewMode(folder.id === 'home' ? 'home' : 'subfolder');
  };

  const handleSubfolderClick = (subfolder) => {
    setCurrentFolder(subfolder);
    setSelectedMedia(null);
    setViewMode('subfolder');
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder = {
        id: `folder-${Date.now()}`,
        name: newFolderName.trim(),
        isOpen: false,
        media: [],
        subfolders: []
      };
      
      const updatedFolders = updateFolderState(folders, currentFolder.id, folder => ({
        ...folder,
        subfolders: [...folder.subfolders, newFolder]
      }));
      
      setFolders(updatedFolders);
      api.saveFolders(updatedFolders);
      setNewFolderName('');
      setShowNewFolderDialog(false);
    }
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setIsUploading(true);
      setUploadProgress(0);
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      try {
        const uploadedMedia = await api.uploadFile(files[0]);
        clearInterval(interval);
        setUploadProgress(100);
        
        const updatedFolders = updateFolderState(folders, currentFolder.id, folder => ({
          ...folder,
          media: [...folder.media, uploadedMedia]
        }));
        
        setFolders(updatedFolders);
        api.saveFolders(updatedFolders);
        
        setTimeout(() => {
          setUploadProgress(0);
          setIsUploading(false);
        }, 500);
      } catch (error) {
        console.error('Upload failed:', error);
        clearInterval(interval);
        setIsUploading(false);
        setUploadProgress(0);
      }
    }
  };

  const handleContextMenu = (event, folder) => {
    event.preventDefault();
    setContextMenu({
      folder,
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleRenameFolder = () => {
    if (!contextMenu) return;
    setRenameDialog({
      open: true,
      folderId: contextMenu.folder.id,
      newName: contextMenu.folder.name
    });
    handleCloseContextMenu();
  };

  const handleDeleteFolder = () => {
    if (!contextMenu) return;
    setDeleteDialog({
      open: true,
      folderId: contextMenu.folder.id
    });
    handleCloseContextMenu();
  };

  const confirmRenameFolder = () => {
    const { folderId, newName } = renameDialog;
    if (newName.trim()) {
      const updatedFolders = updateFolderState(folders, folderId, folder => ({
        ...folder,
        name: newName.trim()
      }));
      setFolders(updatedFolders);
      api.saveFolders(updatedFolders);
      setRenameDialog({ open: false, folderId: '', newName: '' });
    }
  };

  const confirmDeleteFolder = () => {
    const { folderId } = deleteDialog;
    
    const deleteFolder = (folders, targetId) => {
      return folders.reduce((acc, folder) => {
        if (folder.id === targetId) return acc;
        if (folder.subfolders?.length > 0) {
          return [...acc, {
            ...folder,
            subfolders: deleteFolder(folder.subfolders, targetId)
          }];
        }
        return [...acc, folder];
      }, []);
    };
    
    const updatedFolders = deleteFolder(folders, folderId);
    setFolders(updatedFolders);
    api.saveFolders(updatedFolders);
    
    // If we deleted the current folder, go back to home
    if (currentFolder?.id === folderId) {
      setCurrentFolder(folders[0]);
      setViewMode('home');
    }
    
    setDeleteDialog({ open: false, folderId: '' });
  };

  const renderFolderTree = (folder, depth = 0) => {
    return (
      <StyledTreeItem key={folder.id}>
        <ListItem 
          sx={{ 
            pl: depth * 2 + 2,
            pr: 4, // Added right padding to prevent crowding
            borderRadius: 1,
            backgroundColor: currentFolder?.id === folder.id ? 'action.selected' : 'inherit',
          }}
          onClick={() => handleFolderClick(folder)}
          onContextMenu={(e) => handleContextMenu(e, folder)}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            {folder.subfolders?.length > 0 && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFolder(folder.id);
                }}
              >
                {folder.isOpen ? (
                  <ExpandMoreIcon fontSize="small" />
                ) : (
                  <ChevronRightIcon fontSize="small" />
                )}
              </IconButton>
            )}
          </ListItemIcon>
          <ListItemIcon sx={{ minWidth: 32 }}>
            {folder.isOpen ? (
              <FolderOpenIcon sx={{ color: colors.folderYellow }} />
            ) : (
              <FolderIcon sx={{ color: colors.folderYellow }} />
            )}
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: depth === 0 ? 'medium' : 'normal',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: 200 - (depth * 20) // Adjust based on depth
                }}
              >
                {folder.name}
              </Typography>
            }
            sx={{ cursor: 'pointer' }}
          />
        </ListItem>

        <Collapse in={folder.isOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {folder.subfolders?.map(subfolder => renderFolderTree(subfolder, depth + 1))}
          </List>
        </Collapse>
      </StyledTreeItem>
    );
  };

  const renderMediaCard = (media) => {
    return (
      <Card 
        sx={{ 
          cursor: 'pointer',
          position: 'relative',
          width: 250,
          height: 250,
          backgroundColor: colors.paper,
          borderRadius: 2, // Added border radius
          '&:hover': { 
            boxShadow: 3,
            transform: 'translateY(-2px)',
            transition: 'all 0.2s ease'
          }
        }}
      >
        {media.type === 'video' ? (
          <>
            <CardMedia
              component="video"
              image={media.url}
              sx={{ 
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 2 // Added border radius
              }}
            />
            <MediaCardOverlay>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Preview">
                  <IconButton 
                    color="primary" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMedia(media);
                      setViewMode('media');
                    }}
                    sx={{ backgroundColor: colors.paper }}
                  >
                    <PreviewIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download">
                  <IconButton 
                    color="primary" 
                    onClick={(e) => {
                      e.stopPropagation();
                      const link = document.createElement('a');
                      link.href = media.url;
                      link.download = media.name;
                      link.click();
                    }}
                    sx={{ backgroundColor: colors.paper }}
                  >
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </MediaCardOverlay>
          </>
        ) : (
          <>
            <CardMedia
              component="img"
              image={media.url}
              alt={media.name}
              sx={{ 
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 2 // Added border radius
              }}
            />
            <MediaCardOverlay>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Preview">
                  <IconButton 
                    color="primary" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMedia(media);
                      setViewMode('media');
                    }}
                    sx={{ backgroundColor: colors.paper }}
                  >
                    <PreviewIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download">
                  <IconButton 
                    color="primary" 
                    onClick={(e) => {
                      e.stopPropagation();
                      const link = document.createElement('a');
                      link.href = media.url;
                      link.download = media.name;
                      link.click();
                    }}
                    sx={{ backgroundColor: colors.paper }}
                  >
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </MediaCardOverlay>
          </>
        )}
      </Card>
    );
  };

  const renderMediaListItem = (media) => {
    return (
      <ListItemButton
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          backgroundColor: colors.paper,
          borderRadius: 1,
          mb: 1,
          '&:hover': {
            backgroundColor: colors.cardHover
          }
        }}
        onClick={() => {
          setSelectedMedia(media);
          setViewMode('media');
        }}
      >
        {media.type === 'video' ? (
          <VideoIcon sx={{ color: colors.primary }} />
        ) : (
          <ImageIcon sx={{ color: colors.primary }} />
        )}
        <Typography variant="body1" sx={{ flexGrow: 1, color: colors.text }}>
          {media.name}
        </Typography>
        <Tooltip title="Download">
          <IconButton 
            onClick={(e) => {
              e.stopPropagation();
              const link = document.createElement('a');
              link.href = media.url;
              link.download = media.name;
              link.click();
            }}
          >
            <DownloadIcon sx={{ color: colors.primary }} />
          </IconButton>
        </Tooltip>
      </ListItemButton>
    );
  };

  const renderHomeView = () => {
    return (
      <>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: colors.text, fontWeight: 'normal' }}> {/* Reduced boldness */}
            Subfolders
          </Typography>
        </Box>
        
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {currentFolder.subfolders.map(subfolder => (
            <Grid item xs={12} sm={6} md={4} key={subfolder.id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  backgroundColor: colors.paper,
                  '&:hover': { 
                    boxShadow: 3,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease'
                  }
                }}
                onClick={() => handleSubfolderClick(subfolder)}
              >
                <CardContent sx={{ display: 'flex', alignItems: 'center', minHeight: 80 }}>
                  <FolderIcon sx={{ mr: 2, fontSize: 40, color: colors.folderYellow }} /> {/* Yellow folder icon */}
                  <Typography 
                    variant="body1" // Changed from h6 to body1 for smaller size
                    sx={{ 
                      color: colors.text,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: 200,
                      fontWeight: 'normal' // Reduced boldness
                    }}
                  >
                    {subfolder.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ color: colors.text }}>
              Home Media
            </Typography>
          </Box>
          
          {uploadProgress > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <CircularProgress variant="determinate" value={uploadProgress} size={24} />
              <Typography variant="body2" sx={{ color: colors.text }}>{uploadProgress}%</Typography>
            </Box>
          )}
          
          {currentFolder.media.length > 0 ? (
            viewType === 'grid' ? (
              <Grid container spacing={3}>
                {currentFolder.media.map(media => (
                  <Grid item key={media.id}>
                    {renderMediaCard(media)}
                  </Grid>
                ))}
              </Grid>
            ) : (
              <List>
                {currentFolder.media.map(media => (
                  <React.Fragment key={media.id}>
                    {renderMediaListItem(media)}
                  </React.Fragment>
                ))}
              </List>
            )
          ) : (
            <Paper sx={{ 
              p: 4, 
              textAlign: 'center',
              backgroundColor: colors.secondary
            }}>
              <Typography variant="body1" sx={{ color: colors.text }}>
                No media files in this folder yet.
              </Typography>
            </Paper>
          )}
        </Box>
      </>
    );
  };

  const renderSubfolderView = () => {
    return (
      <>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Button 
            variant="outlined" 
            startIcon={<FolderIcon sx={{ color: colors.folderYellow }} />} // Yellow folder icon
            onClick={() => handleFolderClick(folders[0])}
            sx={{ color: colors.text, borderColor: colors.divider }}
          >
            Back to Home
          </Button>
        </Box>
        
        {uploadProgress > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <CircularProgress variant="determinate" value={uploadProgress} size={24} />
            <Typography variant="body2" sx={{ color: colors.text }}>{uploadProgress}%</Typography>
          </Box>
        )}
        
        <Typography variant="h6" sx={{ mb: 2, color: colors.text }}>
          {currentFolder.name} Media
        </Typography>
        
        {currentFolder.media.length > 0 ? (
          viewType === 'grid' ? (
            <Grid container spacing={3}>
              {currentFolder.media.map(media => (
                <Grid item key={media.id}>
                  {renderMediaCard(media)}
                </Grid>
              ))}
            </Grid>
          ) : (
            <List>
              {currentFolder.media.map(media => (
                <React.Fragment key={media.id}>
                  {renderMediaListItem(media)}
                </React.Fragment>
              ))}
            </List>
          )
        ) : (
          <Paper sx={{ 
            p: 4, 
            textAlign: 'center',
            backgroundColor: colors.secondary
          }}>
            <Typography variant="body1" sx={{ color: colors.text }}>
              No media files in this folder yet.
            </Typography>
          </Paper>
        )}
      </>
    );
  };

  const renderMediaView = () => {
    return (
      <>
        <Button 
          variant="outlined" 
          startIcon={<FolderIcon sx={{ color: colors.folderYellow }} />} // Yellow folder icon
          onClick={() => setViewMode(currentFolder.id === 'home' ? 'home' : 'subfolder')}
          sx={{ mb: 3, color: colors.text, borderColor: colors.divider }}
        >
          Back to {currentFolder.id === 'home' ? 'Home' : currentFolder.name}
        </Button>
        
        <Paper sx={{ 
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          backgroundColor: colors.paper
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3
          }}>
            <Typography variant="h5" sx={{ color: colors.text }}>
              {selectedMedia.name}
            </Typography>
            <Button
              variant="contained"
              startIcon={<DownloadIcon sx={{ color: colors.paper }} />}
              onClick={() => {
                const link = document.createElement('a');
                link.href = selectedMedia.url;
                link.download = selectedMedia.name;
                link.click();
              }}
              sx={{ backgroundColor: colors.primary, '&:hover': { backgroundColor: colors.secondary } }}
            >
              <Typography sx={{ color: colors.paper }}>Download</Typography>
            </Button>
          </Box>
          
          <Box sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            borderRadius: 2,
            overflow: 'hidden',
            backgroundColor: colors.secondary
          }}>
            {selectedMedia.type === 'video' ? (
              <video 
                controls 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '70vh',
                  borderRadius: 8
                }}
              >
                <source src={selectedMedia.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img 
                src={selectedMedia.url} 
                alt={selectedMedia.name} 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '70vh', 
                  objectFit: 'contain',
                  borderRadius: 8,
                  boxShadow: 3
                }}
              />
            )}
          </Box>
        </Paper>
      </>
    );
  };

  if (!currentFolder) return <CircularProgress sx={{ m: 'auto' }} />;

  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100vh', 
      p: 2, 
      background: colors.background,
      flexDirection: { xs: 'column', md: 'row' }
    }}>
      {/* Left Sidebar - Folder Tree */}
      <Paper elevation={3} sx={{ 
        width: { xs: '100%', md: 300 }, 
        p: 2, 
        display: 'flex', 
        flexDirection: 'column', 
        mr: { xs: 0, md: 2 },
        mb: { xs: 2, md: 0 },
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: colors.paper
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 'bold', 
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: colors.text
          }}>
            <FolderOpenIcon sx={{ color: colors.folderYellow }} /> {/* Yellow folder icon */}
            Media Library
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Add folder">
              <IconButton 
                onClick={() => setShowNewFolderDialog(true)}
                size="small"
                sx={{ color: colors.primary }}
              >
                <CreateNewFolderIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Upload media">
              <IconButton 
                onClick={() => fileInputRef.current.click()}
                disabled={isUploading}
                size="small"
                sx={{ color: colors.primary }}
              >
                <UploadIcon />
              </IconButton>
            </Tooltip>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*,video/*"
              onChange={handleFileUpload}
            />
          </Box>
        </Box>
        <Divider sx={{ backgroundColor: colors.divider, mb: 2 }} />
        <Box sx={{ flexGrow: 1, overflow: 'auto', pr: 1 }}> {/* Added right padding */}
          <List>
            {folders.map(folder => renderFolderTree(folder))}
          </List>
        </Box>
      </Paper>

      {/* Right Side - Content Viewer */}
      <Paper elevation={3} sx={{ 
        flexGrow: 1, 
        p: 3, 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'auto',
        backgroundColor: colors.paper
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 'bold',
            color: colors.text
          }}>
            {currentFolder?.name || 'Select a folder'}
          </Typography>
          <Tooltip title={viewType === 'grid' ? 'List view' : 'Grid view'}>
            <IconButton
              onClick={() => setViewType(viewType === 'grid' ? 'list' : 'grid')}
              sx={{ color: colors.primary }}
            >
              {viewType === 'grid' ? <ListViewIcon /> : <GridViewIcon />}
            </IconButton>
          </Tooltip>
        </Box>
        <Divider sx={{ backgroundColor: colors.divider, mb: 3 }} />
        
        <Box sx={{ flexGrow: 1 }}>
          {viewMode === 'home' && renderHomeView()}
          {viewMode === 'subfolder' && renderSubfolderView()}
          {viewMode === 'media' && renderMediaView()}
        </Box>
      </Paper>

      {/* New Folder Dialog */}
      <Dialog 
        open={showNewFolderDialog} 
        onClose={() => setShowNewFolderDialog(false)}
        PaperProps={{ sx: { 
          borderRadius: 2,
          backgroundColor: colors.paper
        }}}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          color: colors.text
        }}>
          Create New Folder
          <IconButton 
            onClick={() => setShowNewFolderDialog(false)}
            sx={{ color: colors.primary }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Folder Name"
            fullWidth
            variant="outlined"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setShowNewFolderDialog(false)}
            sx={{ 
              borderRadius: 1,
              color: colors.text,
              borderColor: colors.divider
            }}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateFolder}
            variant="contained"
            sx={{ 
              borderRadius: 1,
              backgroundColor: colors.primary,
              '&:hover': { backgroundColor: colors.secondary }
            }}
            disabled={!newFolderName.trim()}
          >
            <Typography sx={{ color: colors.paper }}>Create</Typography>
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rename Folder Dialog */}
      <Dialog 
        open={renameDialog.open} 
        onClose={() => setRenameDialog({ ...renameDialog, open: false })}
        PaperProps={{ sx: { 
          borderRadius: 2,
          backgroundColor: colors.paper
        }}}
      >
        <DialogTitle sx={{ color: colors.text }}>
          Rename Folder
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Folder Name"
            fullWidth
            variant="outlined"
            value={renameDialog.newName}
            onChange={(e) => setRenameDialog({ ...renameDialog, newName: e.target.value })}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setRenameDialog({ ...renameDialog, open: false })}
            sx={{ 
              borderRadius: 1,
              color: colors.text,
              borderColor: colors.divider
            }}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmRenameFolder}
            variant="contained"
            sx={{ 
              borderRadius: 1,
              backgroundColor: colors.primary,
              '&:hover': { backgroundColor: colors.secondary }
            }}
            disabled={!renameDialog.newName.trim()}
          >
            <Typography sx={{ color: colors.paper }}>Rename</Typography>
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Folder Dialog */}
      <Dialog 
        open={deleteDialog.open} 
        onClose={() => setDeleteDialog({ ...deleteDialog, open: false })}
        PaperProps={{ sx: { 
          borderRadius: 2,
          backgroundColor: colors.paper
        }}}
      >
        <DialogTitle sx={{ color: colors.text }}>
          Delete Folder
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: colors.text }}>
            Are you sure you want to delete this folder and all its contents?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setDeleteDialog({ ...deleteDialog, open: false })}
            sx={{ 
              borderRadius: 1,
              color: colors.text,
              borderColor: colors.divider
            }}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDeleteFolder}
            variant="contained"
            sx={{ 
              borderRadius: 1,
              backgroundColor: '#d32f2f',
              '&:hover': { backgroundColor: '#b71c1c' }
            }}
          >
            <Typography sx={{ color: colors.paper }}>Delete</Typography>
          </Button>
        </DialogActions>
      </Dialog>

      {/* Context Menu */}
      <Menu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
        PaperProps={{
          sx: {
            backgroundColor: colors.paper,
            boxShadow: '0px 2px 8px rgba(0,0,0,0.2)'
          }
        }}
      >
        <MenuItem onClick={handleRenameFolder} sx={{ color: colors.text }}>
          <ListItemIcon>
            <EditIcon sx={{ color: colors.primary }} />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => fileInputRef.current.click()} sx={{ color: colors.text }}>
          <ListItemIcon>
            <UploadIcon sx={{ color: colors.primary }} />
          </ListItemIcon>
          <ListItemText>Upload Files</ListItemText>
        </MenuItem>
        <Divider sx={{ backgroundColor: colors.divider }} />
        <MenuItem onClick={handleDeleteFolder} sx={{ color: '#d32f2f' }}>
          <ListItemIcon>
            <DeleteIcon sx={{ color: '#d32f2f' }} />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default MediaFolderViewer;