import React, { useState, useRef, useEffect } from "react";
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
  ListItemButton,
  Checkbox,
  FormControlLabel,
  Drawer,
} from "@mui/material";
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
  Edit as EditIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import DescriptionIcon from "@mui/icons-material/Description";
import { styled } from "@mui/material/styles";
import { httpClient } from "../../utils/httpClientSetup";

// Updated color palette with cream gradient background
const colors = {
  background: "linear-gradient(135deg, #f5f5dc 0%, #ffffff 100%)",
  paper: "#ffffff",
  primary: "#616161",
  secondary: "#e0e0e0",
  text: "#212121",
  divider: "#bdbdbd",
  cardHover: "#f5f5f5",
  folderYellow: "#ffc107", // Windows folder yellow color
};

const StyledTreeItem = styled(Box)(({ theme }) => ({
  width: "100%",
  borderRadius: theme.shape.borderRadius,
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const MediaCardOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  opacity: 0,
  transition: "opacity 0.3s ease",
  borderRadius: theme.shape.borderRadius,
  "&:hover": {
    opacity: 1,
  },
}));

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const MediaFolderViewer = ({
  selectionMode = false,
  onSelectionConfirm,
  onCloseRequest,
  fileTypeFilter = null, // Prop for file type filtering (e.g., 'pdf')
}) => {
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [currentContents, setCurrentContents] = useState({
    subfolders: [],
    media: [],
  });
  const [loadingContents, setLoadingContents] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [fileDetails, setFileDetails] = useState(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [infoLoading, setInfoLoading] = useState(false); // Add loading state for file info
  const [viewMode, setViewMode] = useState("folder");
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [renameDialog, setRenameDialog] = useState({
    open: false,
    folderId: "",
    newName: "",
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    folderId: "",
  });
  const [viewType, setViewType] = useState("grid"); // 'grid' or 'list'
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [createParent, setCreateParent] = useState(null);
  const [uploadToFolder, setUploadToFolder] = useState(null);

  const fileInputRef = useRef(null);

  // Recursive function to map API folder data
  const mapFolder = (f) => ({
    id: f.id,
    name: f.name,
    parent_id: f.parent_id,
    path: f.path,
    isOpen: f.parent_id === null, // Open top-level folders by default
    subfolders: f.folders ? f.folders.map(mapFolder) : [],
  });

  // Load folder tree from API
  const loadFolders = async () => {
    try {
      const response = await httpClient.get("/files/tree");
      const apiFolders = response.data.data;
      const mappedFolders = apiFolders.map(mapFolder);
      setFolders(mappedFolders);
    } catch (error) {
      console.error("Error fetching folder tree:", error);
    }
  };

  useEffect(() => {
    loadFolders();
    setCurrentFolder({
      id: null,
      name: "Media Library",
      parent_id: null,
      path: "",
    });
  }, []);

  // Fetch contents when currentFolder changes
  useEffect(() => {
    if (currentFolder) {
      loadContents();
    }
  }, [currentFolder]);

  const loadContents = async () => {
    setLoadingContents(true);
    try {
      const id = currentFolder.id;
      const url = id == null ? "/files" : `/files?parent_id=${id}`;
      const response = await httpClient.get(url);
      const items = response.data.data;
      const subfolders = items
        .filter((i) => i.file_type === "folder")
        .map((i) => ({
          id: i.id,
          company_id: i.company_id,
          name: i.name,
          parent_id: i.parent_id,
          path: i.path,
        }));
      const media = items
        .filter((i) => i.file_type !== "folder")
        .map((i) => ({
          id: i.id,
          company_id: i.company_id,
          name: i.name,
          type: i.file_type,
          url: `/${i.path}`,
        }));
      setCurrentContents({ subfolders, media });
    } catch (error) {
      console.error("Error fetching folder contents:", error);
    }
    setLoadingContents(false);
  };

  const toggleFolder = (folderId) => {
    const updatedFolders = updateFolderState(folders, folderId, (folder) => ({
      ...folder,
      isOpen: !folder.isOpen,
    }));
    setFolders(updatedFolders);
  };

  const updateFolderState = (foldersList, folderId, updateFn) => {
    return foldersList.map((folder) => {
      if (folder.id === folderId) {
        return updateFn(folder);
      }
      if (folder.subfolders?.length > 0) {
        return {
          ...folder,
          subfolders: updateFolderState(folder.subfolders, folderId, updateFn),
        };
      }
      return folder;
    });
  };

  const findFolderById = (foldersList, id) => {
    for (const folder of foldersList) {
      if (folder.id === id) return folder;
      if (folder.subfolders.length > 0) {
        const found = findFolderById(folder.subfolders, id);
        if (found) return found;
      }
    }
    return null;
  };

  const handleBack = () => {
    if (currentFolder.parent_id == null) return;
    const parent = findFolderById(folders, currentFolder.parent_id) || {
      id: null,
      name: "Media Library",
      parent_id: null,
      path: "",
    };
    setCurrentFolder(parent);
    setViewMode("folder");
  };

  const handleFolderClick = (folder) => {
    setCurrentFolder(folder);
    setSelectedMedia(null);
    setViewMode("folder");
  };

  const handleSubfolderClick = (subfolder) => {
    setCurrentFolder(subfolder);
    setSelectedMedia(null);
    setViewMode("folder");
  };

  const handleFileSelect = (file, isChecked) => {
    if (isChecked) {
      setSelectedFiles((prev) => [...prev, file]);
    } else {
      setSelectedFiles((prev) => prev.filter((f) => f.id !== file.id));
    }
  };

  const handleSelectAllInFolder = (isChecked) => {
    if (isChecked) {
      const newFilesToAdd = currentContents.media.filter(
        (file) => !selectedFiles.some((selected) => selected.id === file.id)
      );
      setSelectedFiles((prev) => [...prev, ...newFilesToAdd]);
    } else {
      const currentFolderFileIds = new Set(
        currentContents.media.map((f) => f.id)
      );
      setSelectedFiles((prev) =>
        prev.filter((f) => !currentFolderFileIds.has(f.id))
      );
    }
  };

  const confirmSelection = () => {
    if (onSelectionConfirm) {
      onSelectionConfirm(selectedFiles);
    }
  };

  const cancelSelection = () => {
    setSelectedFiles([]);
    if (onCloseRequest) {
      onCloseRequest();
    }
  };

  const handlePreview = (media) => {
    setSelectedMedia(media);
    setViewMode("media");
  };

  const handleInfo = async (media) => {
    setInfoLoading(true); // Set loading state
    setInfoOpen(true);
    try {
      const response = await httpClient.get(`/files/${media.id}`);
      setFileDetails(response.data.data);
    } catch (error) {
      console.error("Error fetching file details:", error);
    } finally {
      setInfoLoading(false); // Reset loading state
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      const formData = new FormData();
      formData.append("path", createParent?.path || "");
      formData.append("name", newFolderName.trim());
      await httpClient.post("/files", formData);
      setNewFolderName("");
      setShowNewFolderDialog(false);
      await loadFolders(); // Refresh tree
      if (createParent?.id === currentFolder?.id) {
        await loadContents(); // Refresh contents if created in current folder
      }
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  const handleCreateSubfolder = () => {
    if (!contextMenu) return;
    setCreateParent(contextMenu.folder);
    setShowNewFolderDialog(true);
    handleCloseContextMenu();
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (files.length === 0) return;
    setIsUploading(true);
    setUploadProgress(0);
    // Simulate progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);
    try {
      const formData = new FormData();

      const getPathForFolder = (folder) => {
        if (!folder) return "";
        // Check if path exists and is not empty
        return folder.path && folder.path.trim() !== "" ? folder.path : "";
      };

      const uploadPath =
        getPathForFolder(uploadToFolder) ||
        getPathForFolder(currentFolder) ||
        "";

      formData.append("path", uploadPath);
      formData.append("file", files[0]);
      await httpClient.post("/files", formData);
      clearInterval(interval);
      setUploadProgress(100);
      if (
        uploadToFolder?.id === currentFolder?.id ||
        (!uploadToFolder && currentFolder)
      ) {
        await loadContents();
      }
      setTimeout(() => {
        setUploadProgress(0);
        setIsUploading(false);
        setUploadToFolder(null);
      }, 500);
    } catch (error) {
      console.error("Upload failed:", error);
      clearInterval(interval);
      setIsUploading(false);
      setUploadProgress(0);
      setUploadToFolder(null);
    }
  };

  const handleUploadToFolder = () => {
    if (!contextMenu) return;
    setUploadToFolder(contextMenu.folder);
    handleCloseContextMenu();
    fileInputRef.current.click();
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
      newName: contextMenu.folder.name,
    });
    handleCloseContextMenu();
  };

  const handleDeleteFolder = () => {
    if (!contextMenu) return;
    setDeleteDialog({
      open: true,
      folderId: contextMenu.folder.id,
    });
    handleCloseContextMenu();
  };

  const confirmRenameFolder = () => {
    // Mock implementation - not synced with API
    const { folderId, newName } = renameDialog;
    if (newName.trim()) {
      const updatedFolders = updateFolderState(folders, folderId, (folder) => ({
        ...folder,
        name: newName.trim(),
      }));
      setFolders(updatedFolders);
      if (currentFolder.id === folderId) {
        setCurrentFolder({ ...currentFolder, name: newName.trim() });
      }
      setRenameDialog({ open: false, folderId: "", newName: "" });
    }
  };

  const confirmDeleteFolder = () => {
    // Mock implementation - not synced with API
    const { folderId } = deleteDialog;

    const deleteFolder = (foldersList, targetId) => {
      return foldersList.reduce((acc, folder) => {
        if (folder.id === targetId) return acc;
        if (folder.subfolders?.length > 0) {
          return [
            ...acc,
            {
              ...folder,
              subfolders: deleteFolder(folder.subfolders, targetId),
            },
          ];
        }
        return [...acc, folder];
      }, []);
    };

    const updatedFolders = deleteFolder(folders, folderId);
    setFolders(updatedFolders);

    // If we deleted the current folder, go back to parent or root
    if (currentFolder?.id === folderId) {
      handleBack();
    }

    setDeleteDialog({ open: false, folderId: "" });
  };

  const handleDownload = async (media) => {
    const url = `https://opmanual.franchise.care/uploaded/${media.company_id}/${media.url}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        credentials: "include", // Includes cookies for auth
      });

      if (!response.ok) {
        throw new Error(
          `Download failed: ${response.status} ${response.statusText}`
        );
      }

      // Optional: Validate Content-Type to avoid downloading error pages (HTML)
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("text/html")) {
        throw new Error(
          "Received HTML instead of file (likely an auth or redirect issue)"
        );
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = media.name; // e.g., 'file.pdf', 'video.mp4'
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(objectUrl); // Cleanup
    } catch (error) {
      console.error("Download failed:", error);
    }
  };
  const renderFolderTree = (folder, depth = 0) => {
    return (
      <StyledTreeItem key={folder.id}>
        <ListItem
          sx={{
            pl: depth * 2 + 2,
            pr: 4,
            borderRadius: 1,
            backgroundColor:
              currentFolder?.id === folder.id ? "action.selected" : "inherit",
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
                  fontWeight: depth === 0 ? "medium" : "normal",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 200 - depth * 20,
                }}
              >
                {folder.name}
              </Typography>
            }
            sx={{ cursor: "pointer" }}
          />
        </ListItem>

        <Collapse in={folder.isOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {folder.subfolders?.map((subfolder) =>
              renderFolderTree(subfolder, depth + 1)
            )}
          </List>
        </Collapse>
      </StyledTreeItem>
    );
  };

  // Apply filter when rendering media items
  const filterMedia = (mediaList) => {
    if (!fileTypeFilter) return mediaList;
    return mediaList.filter((media) => {
      if (fileTypeFilter === "pdf") {
        return (
          media.type === "application/pdf" ||
          media.name.toLowerCase().endsWith(".pdf")
        );
      } else if (fileTypeFilter === "image") {
        // Filter for image files
        const imageTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/svg+xml",
          "image/webp",
          "image/bmp",
        ];
        return (
          imageTypes.includes(media.type) ||
          media.name.toLowerCase().match(/\.(jpg|jpeg|png|gif|svg|webp|bmp)$/)
        );
      }
      return true;
    });
  };

  const renderMediaCard = (media) => {
    const isSelected = selectedFiles.some((f) => f.id === media.id);

    // Check if the file is a PDF or DOCX
    const isPdf =
      media.type === "application/pdf" ||
      media.name.toLowerCase().endsWith(".pdf");
    const isDocx =
      media.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      media.name.toLowerCase().endsWith(".docx");

    return (
      <Card
        sx={{
          cursor: selectionMode ? "pointer" : "default",
          position: "relative",
          width: 250,
          height: 250,
          backgroundColor: colors.paper,
          borderRadius: 2,
          ...(isSelected && { border: `2px solid ${colors.primary}` }),
          "&:hover": {
            boxShadow: 3,
            transform: "translateY(-2px)",
            transition: "all 0.2s ease",
          },
        }}
        onClick={() => {
          if (selectionMode) {
            handleFileSelect(media, !isSelected);
          } else {
            handlePreview(media);
          }
        }}
      >
        {selectionMode && (
          <Checkbox
            checked={isSelected}
            onChange={(e) => handleFileSelect(media, e.target.checked)}
            onClick={(e) => e.stopPropagation()}
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              zIndex: 10,
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              "&.Mui-checked": {
                color: colors.primary,
              },
            }}
          />
        )}
        {isPdf || isDocx ? (
          // Render thumbnail for PDF or DOCX files
          <>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isPdf ? "#f5f5f5" : "#e3f2fd",
                borderRadius: 2,
              }}
            >
              <DescriptionIcon
                sx={{
                  fontSize: 64,
                  color: isPdf ? "#d22d2d" : "#1976d2",
                }}
              />
            </Box>
            {!selectionMode && (
              <MediaCardOverlay>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Tooltip title="Preview">
                    <IconButton
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(media);
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
                        handleDownload(media);
                      }}
                      sx={{ backgroundColor: colors.paper }}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Info">
                    <IconButton
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInfo(media);
                      }}
                      sx={{ backgroundColor: colors.paper }}
                    >
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </MediaCardOverlay>
            )}
          </>
        ) : media.type === "video" ? (
          <>
            <CardMedia
              component="video"
              image={`https://opmanual.franchise.care/uploaded/${media.company_id}${media.url}`}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 2,
                opacity: selectionMode && isSelected ? 0.7 : 1,
              }}
            />
            {!selectionMode && (
              <MediaCardOverlay>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Tooltip title="Preview">
                    <IconButton
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(media);
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
                        handleDownload(media);
                      }}
                      sx={{ backgroundColor: colors.paper }}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Info">
                    <IconButton
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInfo(media);
                      }}
                      sx={{ backgroundColor: colors.paper }}
                    >
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </MediaCardOverlay>
            )}
          </>
        ) : (
          <>
            <CardMedia
              component="img"
              image={`https://opmanual.franchise.care/uploaded/${media.company_id}/${media.url}`}
              alt={media.name}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 2,
                opacity: selectionMode && isSelected ? 0.7 : 1,
              }}
            />
            {!selectionMode && (
              <MediaCardOverlay>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Tooltip title="Preview">
                    <IconButton
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(media);
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
                        handleDownload(media);
                      }}
                      sx={{ backgroundColor: colors.paper }}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Info">
                    <IconButton
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInfo(media);
                      }}
                      sx={{ backgroundColor: colors.paper }}
                    >
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </MediaCardOverlay>
            )}
          </>
        )}
        <CardContent
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            py: 0.5,
            px: 1,
          }}
        >
          <Typography
            variant="body2"
            noWrap
            sx={{ fontWeight: selectionMode && isSelected ? "bold" : "normal" }}
          >
            {media.name}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  const renderMediaListItem = (media) => {
    const isSelected = selectedFiles.some((f) => f.id === media.id);

    return (
      <ListItemButton
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          backgroundColor: colors.paper,
          borderRadius: 1,
          mb: 1,
          ...(isSelected && { backgroundColor: "action.selected" }),
          "&:hover": {
            backgroundColor: colors.cardHover,
          },
        }}
        onClick={() => {
          if (selectionMode) {
            handleFileSelect(media, !isSelected);
          } else {
            handlePreview(media);
          }
        }}
      >
        {selectionMode && (
          <Checkbox
            checked={isSelected}
            onChange={(e) => handleFileSelect(media, e.target.checked)}
            onClick={(e) => e.stopPropagation()}
          />
        )}
        {media.type === "video" ? (
          <VideoIcon sx={{ color: colors.primary }} />
        ) : (
          <ImageIcon sx={{ color: colors.primary }} />
        )}
        <Typography
          variant="body1"
          sx={{
            flexGrow: 1,
            color: colors.text,
            fontWeight: selectionMode && isSelected ? "bold" : "normal",
          }}
        >
          {media.name}
        </Typography>
        {!selectionMode && (
          <>
            <Tooltip title="Download">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(media);
                }}
              >
                <DownloadIcon sx={{ color: colors.primary }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Info">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleInfo(media);
                }}
              >
                <InfoIcon sx={{ color: colors.primary }} />
              </IconButton>
            </Tooltip>
          </>
        )}
      </ListItemButton>
    );
  };

  const renderFolderView = () => {
    const parent =
      currentFolder.id !== null
        ? findFolderById(folders, currentFolder.parent_id) || {
            name: "Media Library",
          }
        : null;

    return (
      <>
        {currentFolder.id !== null && (
          <Box sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<FolderIcon sx={{ color: colors.folderYellow }} />}
              onClick={handleBack}
              sx={{ color: colors.text, borderColor: colors.divider }}
            >
              Back to {parent.name}
            </Button>
          </Box>
        )}

        <Box sx={{ mb: 4 }}>
          {loadingContents ? (
            <CircularProgress sx={{ m: "auto", display: "block" }} />
          ) : currentContents.subfolders.length > 0 ? (
            <Grid container spacing={2}>
              {currentContents.subfolders.map((subfolder) => (
                <Grid item xs={12} sm={6} md={4} key={subfolder.id}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      backgroundColor: colors.paper,
                      "&:hover": {
                        boxShadow: 3,
                        transform: "translateY(-2px)",
                        transition: "all 0.2s ease",
                      },
                    }}
                    onClick={() => handleSubfolderClick(subfolder)}
                    onContextMenu={(e) => handleContextMenu(e, subfolder)}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        minHeight: 80,
                      }}
                    >
                      <FolderIcon
                        sx={{ mr: 2, fontSize: 40, color: colors.folderYellow }}
                      />
                      <Typography
                        variant="body1"
                        sx={{
                          color: colors.text,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: 200,
                          fontWeight: "normal",
                        }}
                      >
                        {subfolder.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : null}
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ color: colors.text, mb: 2 }}>
            Media
          </Typography>

          {uploadProgress > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <CircularProgress
                variant="determinate"
                value={uploadProgress}
                size={24}
              />
              <Typography variant="body2" sx={{ color: colors.text }}>
                {uploadProgress}%
              </Typography>
            </Box>
          )}

          {loadingContents ? (
            <CircularProgress sx={{ m: "auto", display: "block" }} />
          ) : filterMedia(currentContents.media).length > 0 ? (
            viewType === "grid" ? (
              <Grid container spacing={3}>
                {filterMedia(currentContents.media).map((media) => (
                  <Grid item key={media.id}>
                    {renderMediaCard(media)}
                  </Grid>
                ))}
              </Grid>
            ) : (
              <List>
                {filterMedia(currentContents.media).map((media) => (
                  <React.Fragment key={media.id}>
                    {renderMediaListItem(media)}
                  </React.Fragment>
                ))}
              </List>
            )
          ) : (
            <Paper
              sx={{
                p: 4,
                textAlign: "center",
                backgroundColor: colors.secondary,
              }}
            >
              <Typography variant="body1" sx={{ color: colors.text }}>
                No media files in this folder yet.
              </Typography>
            </Paper>
          )}
        </Box>
      </>
    );
  };

  const renderMediaView = () => {
    // Check if the file is a PDF or DOCX
    const isPdf =
      selectedMedia.type === "application/pdf" ||
      selectedMedia.name.toLowerCase().endsWith(".pdf");
    const isDocx =
      selectedMedia.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      selectedMedia.name.toLowerCase().endsWith(".docx");

    return (
      <>
        <Button
          variant="outlined"
          startIcon={<FolderIcon sx={{ color: colors.folderYellow }} />}
          onClick={() => setViewMode("folder")}
          sx={{ mb: 3, color: colors.text, borderColor: colors.divider }}
        >
          Back to {currentFolder.name}
        </Button>

        <Paper
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            backgroundColor: colors.paper,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h5" sx={{ color: colors.text }}>
              {selectedMedia.name}
            </Typography>
            <Button
              variant="contained"
              startIcon={<DownloadIcon sx={{ color: colors.paper }} />}
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(selectedMedia);
              }}
              sx={{
                backgroundColor: colors.primary,
                "&:hover": { backgroundColor: colors.secondary },
              }}
            >
              <Typography sx={{ color: colors.paper }}>Download</Typography>
            </Button>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 2,
              overflow: "hidden",
              backgroundColor: colors.secondary,
            }}
          >
            {isPdf ? (
              // PDF Preview using iframe
              <iframe
                src={`https://opmanual.franchise.care/uploaded/${selectedMedia.company_id}/${selectedMedia.url}`}
                title={selectedMedia.name}
                style={{
                  width: "100%",
                  height: "70vh",
                  border: "none",
                  borderRadius: 8,
                }}
              />
            ) : isDocx ? (
              // DOCX files cannot be previewed in browser, show message with download option
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  p: 4,
                  backgroundColor: colors.paper,
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              >
                <DescriptionIcon
                  sx={{ fontSize: 64, color: "#1976d2", mb: 2 }}
                />
                <Typography variant="h6" sx={{ mb: 2, color: colors.text }}>
                  Document Preview
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: colors.text }}>
                  This document cannot be previewed directly in the browser.
                  Please download the file to view it.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = `https://opmanual.franchise.care/uploaded/${selectedMedia.company_id}/${selectedMedia.url}`;
                    link.download = selectedMedia.name;
                    link.click();
                  }}
                  sx={{
                    backgroundColor: colors.primary,
                    "&:hover": { backgroundColor: colors.secondary },
                  }}
                >
                  <Typography sx={{ color: colors.paper }}>
                    Download Now
                  </Typography>
                </Button>
              </Box>
            ) : selectedMedia.type === "video" ? (
              <video
                src={`https://opmanual.franchise.care/uploaded/${selectedMedia.company_id}${selectedMedia.url}`}
                controls
                style={{
                  maxWidth: "100%",
                  maxHeight: "70vh",
                  borderRadius: 8,
                }}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={`https://opmanual.franchise.care/uploaded/${selectedMedia.company_id}/${selectedMedia.url}`}
                alt={selectedMedia.name}
                style={{
                  maxWidth: "100%",
                  maxHeight: "70vh",
                  objectFit: "contain",
                  borderRadius: 8,
                  boxShadow: 3,
                }}
              />
            )}
          </Box>
        </Paper>
      </>
    );
  };

  if (!currentFolder) return <CircularProgress sx={{ m: "auto" }} />;

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        p: 2,
        background: colors.background,
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      {/* Left Sidebar - Folder Tree */}
      <Paper
        elevation={3}
        sx={{
          maxWidth: { xs: "100%", md: 300 },
          width: "100%",
          p: 2,
          display: "flex",
          flexDirection: "column",
          mr: { xs: 0, md: 2 },
          mb: { xs: 2, md: 0 },
          borderRadius: 2,
          overflow: "hidden",
          backgroundColor: colors.paper,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: colors.text,
              cursor: "pointer",
              backgroundColor:
                currentFolder.id === null ? "action.selected" : "transparent",
              p: 1,
              borderRadius: 1,
            }}
            onClick={() =>
              setCurrentFolder({
                id: null,
                name: "Media Library",
                parent_id: null,
                path: "",
              })
            }
          >
            <FolderOpenIcon sx={{ color: colors.folderYellow }} />
            Media Library
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Add folder">
              <IconButton
                onClick={() => {
                  setCreateParent(currentFolder);
                  setShowNewFolderDialog(true);
                }}
                size="small"
                sx={{ color: colors.primary }}
              >
                <CreateNewFolderIcon />
              </IconButton>
            </Tooltip>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*,video/*"
              onChange={handleFileUpload}
            />
          </Box>
        </Box>
        <Divider sx={{ backgroundColor: colors.divider, mb: 2 }} />
        <Box sx={{ flexGrow: 1, overflow: "auto", pr: 1 }}>
          <List>{folders.map((folder) => renderFolderTree(folder))}</List>
        </Box>
      </Paper>

      {/* Right Side - Content Viewer */}
      <Paper
        elevation={3}
        sx={{
          flexGrow: 1,
          p: 3,
          display: "flex",
          flexDirection: "column",
          borderRadius: 2,
          overflow: "auto",
          backgroundColor: colors.paper,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: colors.text,
            }}
          >
            {currentFolder?.name || "Select a folder"}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {selectionMode &&
              currentContents.media &&
              currentContents.media.length > 0 && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        currentContents.media.length > 0 &&
                        currentContents.media.every((file) =>
                          selectedFiles.some(
                            (selected) => selected.id === file.id
                          )
                        )
                      }
                      indeterminate={
                        currentContents.media.some((file) =>
                          selectedFiles.some(
                            (selected) => selected.id === file.id
                          )
                        ) &&
                        !currentContents.media.every((file) =>
                          selectedFiles.some(
                            (selected) => selected.id === file.id
                          )
                        )
                      }
                      onChange={(e) =>
                        handleSelectAllInFolder(e.target.checked)
                      }
                    />
                  }
                  label="Select All"
                  sx={{ mr: 1 }}
                />
              )}
            <Tooltip title="Upload media">
              <IconButton
                onClick={() => {
                  setUploadToFolder(currentFolder);
                  fileInputRef.current.click();
                }}
                disabled={isUploading}
                sx={{ color: colors.primary }}
              >
                <UploadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={viewType === "grid" ? "List view" : "Grid view"}>
              <IconButton
                onClick={() =>
                  setViewType(viewType === "grid" ? "list" : "grid")
                }
                sx={{ color: colors.primary }}
              >
                {viewType === "grid" ? <ListViewIcon /> : <GridViewIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Divider sx={{ backgroundColor: colors.divider, mb: 3 }} />

        {selectionMode && (
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mb: 2 }}
          >
            <Button
              variant="outlined"
              onClick={cancelSelection}
              sx={{ borderRadius: 1 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={confirmSelection}
              disabled={selectedFiles.length === 0}
              sx={{
                borderRadius: 1,
                backgroundColor: colors.primary,
                "&:hover": { backgroundColor: colors.secondary },
              }}
            >
              Confirm Selection ({selectedFiles.length})
            </Button>
          </Box>
        )}

        <Box sx={{ flexGrow: 1 }}>
          {viewMode === "folder" && renderFolderView()}
          {viewMode === "media" && renderMediaView()}
        </Box>
      </Paper>

      {/* Info Drawer */}
      <Drawer
        anchor="right"
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        {infoLoading ? (
          <Box
            sx={{
              width: { xs: "100vw", sm: 480 },
              maxWidth: "100%",
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <CircularProgress sx={{ mb: 2 }} />
            <Typography>Loading file information...</Typography>
          </Box>
        ) : (
          fileDetails && (
            <Box
              sx={{ width: { xs: "100vw", sm: 480 }, maxWidth: "100%", p: 0 }}
            >
              {/* Header */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2.5,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  backgroundColor: "background.paper",
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    pr: 1,
                  }}
                >
                  {fileDetails.name}
                </Typography>
                <IconButton
                  onClick={() => setInfoOpen(false)}
                  sx={{
                    color: "text.secondary",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* Content */}
              <Box
                sx={{
                  p: 3,
                  overflowY: "auto",
                  maxHeight: "calc(100vh - 64px)",
                }}
              >
                {/* Media Preview */}
                {fileDetails.file_type === "image" ? (
                  <Box
                    sx={{
                      mb: 3,
                      borderRadius: 1,
                      overflow: "hidden",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    }}
                  >
                    <img
                      src={`https://opmanual.franchise.care/uploaded/${fileDetails.company_id}/${fileDetails.path}`}
                      alt={fileDetails.name}
                      style={{
                        width: "100%",
                        display: "block",
                        maxHeight: "300px",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                ) : fileDetails.file_type === "video" ? (
                  <Box
                    sx={{
                      mb: 3,
                      borderRadius: 1,
                      overflow: "hidden",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    }}
                  >
                    <video
                      src={`https://opmanual.franchise.care/uploaded/${fileDetails.company_id}/${fileDetails.path}`}
                      controls
                      style={{
                        width: "100%",
                        display: "block",
                        maxHeight: "300px",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      mb: 3,
                      borderRadius: 1,
                      overflow: "hidden",
                      backgroundColor: "grey.50",
                      height: 120,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px dashed",
                      borderColor: "divider",
                    }}
                  >
                    <Box sx={{ textAlign: "center", color: "text.secondary" }}>
                      <DescriptionIcon sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="body2">
                        {fileDetails.name}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* File Details */}
                <Box
                  sx={{
                    backgroundColor: "grey.50",
                    borderRadius: 1,
                    p: 2.5,
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 2,
                      color: "text.secondary",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <InfoIcon sx={{ fontSize: 18, mr: 1 }} /> File Information
                  </Typography>

                  <Box sx={{ "& > div": { mb: 1.5 } }}>
                    <Box sx={{ display: "flex" }}>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", minWidth: 100 }}
                      >
                        Size:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {formatFileSize(fileDetails.size)}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex" }}>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", minWidth: 100 }}
                      >
                        Updated Date:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {new Date(fileDetails.updated_at).toLocaleString()}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex" }}>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", minWidth: 100 }}
                      >
                        Created Date:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {new Date(fileDetails.created_at).toLocaleString()}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex" }}>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", minWidth: 100 }}
                      >
                        Created By:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {fileDetails.created_by}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Path Information */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 1,
                      color: "text.secondary",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FolderIcon sx={{ fontSize: 18, mr: 1 }} /> Location
                  </Typography>
                  <Box
                    sx={{
                      backgroundColor: "grey.50",
                      borderRadius: 1,
                      p: 2,
                      wordBreak: "break-all",
                      fontFamily: "monospace",
                      fontSize: "0.85rem",
                    }}
                  >
                    /{fileDetails.path}
                  </Box>
                </Box>
              </Box>
            </Box>
          )
        )}
      </Drawer>

      {/* New Folder Dialog */}
      <Dialog
        open={showNewFolderDialog}
        onClose={() => setShowNewFolderDialog(false)}
        PaperProps={{
          sx: {
            minWidth: 400,
            borderRadius: 2,
            backgroundColor: colors.paper,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: colors.text,
          }}
        >
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
              borderColor: colors.divider,
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
              "&:hover": { backgroundColor: colors.secondary },
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
        PaperProps={{
          sx: {
            borderRadius: 2,
            backgroundColor: colors.paper,
          },
        }}
      >
        <DialogTitle sx={{ color: colors.text }}>Rename Folder</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Folder Name"
            fullWidth
            variant="outlined"
            value={renameDialog.newName}
            onChange={(e) =>
              setRenameDialog({ ...renameDialog, newName: e.target.value })
            }
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setRenameDialog({ ...renameDialog, open: false })}
            sx={{
              borderRadius: 1,
              color: colors.text,
              borderColor: colors.divider,
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
              "&:hover": { backgroundColor: colors.secondary },
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
        PaperProps={{
          sx: {
            borderRadius: 2,
            backgroundColor: colors.paper,
          },
        }}
      >
        <DialogTitle sx={{ color: colors.text }}>Delete Folder</DialogTitle>
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
              borderColor: colors.divider,
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
              backgroundColor: "#d32f2f",
              "&:hover": { backgroundColor: "#b71c1c" },
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
            boxShadow: "0px 2px 8px rgba(0,0,0,0.2)",
          },
        }}
      >
        <MenuItem onClick={handleRenameFolder} sx={{ color: colors.text }}>
          <ListItemIcon>
            <EditIcon sx={{ color: colors.primary }} />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCreateSubfolder} sx={{ color: colors.text }}>
          <ListItemIcon>
            <CreateNewFolderIcon sx={{ color: colors.primary }} />
          </ListItemIcon>
          <ListItemText>Create Folder</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleUploadToFolder} sx={{ color: colors.text }}>
          <ListItemIcon>
            <UploadIcon sx={{ color: colors.primary }} />
          </ListItemIcon>
          <ListItemText>Upload Files</ListItemText>
        </MenuItem>
        <Divider sx={{ backgroundColor: colors.divider }} />
        <MenuItem onClick={handleDeleteFolder} sx={{ color: "#d32f2f" }}>
          <ListItemIcon>
            <DeleteIcon sx={{ color: "#d32f2f" }} />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default MediaFolderViewer;
