import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  styled,
  FormLabel,
  OutlinedInput,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Tooltip,
  Breadcrumbs,
  List,
  ListItem,
  ListItemText,
  Collapse,
} from "@mui/material";
import {
  InfoOutlined as InfoIcon,
  ExpandMore,
  ExpandLess,
  Add as AddIcon,
  Close as CloseIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutline";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Grid from "@mui/material/Grid";
import RichTextEditor from "../../../../components/RichTextEditor";
import { httpClient } from "../../../../utils/httpClientSetup";
import { useNotification } from "../../../../hooks/useNotification";
import MediaFolderViewer from "../../../FileManager/FileManager";
import AddVideo from "./AddVideo";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));
const TagsContainer = styled(Box)(({ theme }) => ({
  border: "1px solid #d1d5db",
  borderRadius: 8,
  padding: "12px",
  minHeight: "48px",
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  alignItems: "center",
  "&:focus-within": {
    borderColor: "#667eea",
    boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
  },
}));
const TagInput = styled("input")(({ theme }) => ({
  border: "none",
  outline: "none",
  backgroundColor: "transparent",
  fontSize: "14px",
  minWidth: "120px",
  flex: 1,
  "&::placeholder": {
    color: "#9ca3af",
  },
}));

const LinkTableContainer = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(2),
  overflowX: "auto",
}));

const LinkTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },

  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const LinkTypeCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 500,
  width: "15%",
}));

const LinkNameCell = styled(TableCell)(({ theme }) => ({
  width: "60%",
}));

const LinkActionsCell = styled(TableCell)(({ theme }) => ({
  width: "25%",
  textAlign: "right",
}));

const FormFieldContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
}));

const SelectedPdfBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(1),
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(1),
}));

// Helper function to extract YouTube video ID
const getYoutubeVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// Helper function to extract Vimeo video ID
const getVimeoVideoId = (url) => {
  const regExp =
    /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_-]+)?/i;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

const PolicyDetails = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "<p>Hello Blue Wheelers!</p>",
  });
  const [tags, setTags] = useState([]);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const openDropdown = Boolean(anchorEl);

  const [videos, setVideos] = useState([]);

  const [selectedLinks, setSelectedLinks] = useState([]);
  const [showMediaViewer, setShowMediaViewer] = useState(false);

  const [showPolicyDialog, setPolicyDialogOpen] = useState(false);
  const [policies, setPolicies] = useState([]);
  const [loadingPolicies, setLoadingPolicies] = useState(false);
  const [selectedPolicyId, setSelectedPolicyId] = useState(null);
  const [policyLinkToEditIndex, setPolicyLinkToEditIndex] = useState(null);

  const [embeddedPdf, setEmbeddedPdf] = useState(null);
  const [showPdfMediaViewer, setShowPdfMediaViewer] = useState(false);

  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [navigationTree, setNavigationTree] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const [mappedMappings, setMappedMappings] = useState([]);

  const [previewVideo, setPreviewVideo] = useState(null);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);

  const [searchParams] = useSearchParams();
  const navigationId = searchParams.get("navigationId");
  const { id } = useParams();
  const navigate = useNavigate();
  const showNotification = useNotification();

  useEffect(() => {
    httpClient
      .get("/collections")
      .then((res) => {
        if (res.data.success) {
          setCollections(res.data.data);
        }
      })
      .catch((err) => console.error("Error fetching collections:", err));
  }, []);

  useEffect(() => {
    if (navigationId) {
      autoMapNavigation(navigationId);
    }
  }, [navigationId]);

  const autoMapNavigation = async (navId) => {
    try {
      const navRes = await httpClient.get(`/navigations/${navId}`);
      if (navRes.data.success) {
        const navItem = navRes.data.data;
        const collectionRes = await httpClient.get(
          `/collections/${navItem.collection_id}`
        );
        if (collectionRes.data.success) {
          const collection = collectionRes.data.data;
          setSelectedCollection(collection);
          const tree = await fetchNavigations(collection.id);
          if (tree) {
            const pathTitles = getPathToItem(tree, navItem.id);
            if (pathTitles) {
              const fullPath = [collection.title, ...pathTitles];
              setMappedMappings([{ navId: navItem.id, fullPath }]);
            }
          }
        }
      }
    } catch (err) {
      console.error("Error auto-mapping navigation:", err);
    }
  };

  useEffect(() => {
    if (navigationTree.length > 0) {
      const initialExpandedItems = {};
      const traverseAndSetExpanded = (items) => {
        items.forEach((item) => {
          if (item.children && item.children.length > 0) {
            initialExpandedItems[item.id] = true;
          }
          traverseAndSetExpanded(item.children);
        });
      };
      traverseAndSetExpanded(navigationTree);
      setExpandedItems(initialExpandedItems);
    }
  }, [navigationTree]);

  const fetchNavigations = async (colId) => {
    try {
      const res = await httpClient.get(`/navigations?collection_id=${colId}`);
      if (res.data.success) {
        const data = res.data.data;
        const tree = buildNavigationTree(data);
        setNavigationTree(tree);
        return tree;
      }
    } catch (err) {
      console.error("Error fetching navigations:", err);
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleContentChange = (content) => {
    setFormData((prev) => ({ ...prev, content }));
  };
  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };
  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    } else if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };
  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };
  const handleVideoAdd = (videoData) => {
    setVideos((prevVideos) => [...prevVideos, videoData]);
  };

  const handleVideoEdit = (index, updatedVideoData) => {
    setVideos((prevVideos) => {
      const updatedVideos = [...prevVideos];
      updatedVideos[index] = updatedVideoData;
      return updatedVideos;
    });
  };

  const handleVideoRemove = (index) => {
    setVideos((prevVideos) => prevVideos.filter((_, i) => i !== index));
  };

  const handleVideoPreview = (index) => {
    setPreviewVideo(videos[index]);
    setShowVideoPreview(true);
  };

  const handleClickCreateLinks = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseDropdown = () => {
    setAnchorEl(null);
  };

  const handleSelectFileLink = () => {
    handleCloseDropdown();
    setShowMediaViewer(true);
  };

  const handleSelectPolicyLink = () => {
    handleCloseDropdown();
    fetchPolicies();
    setPolicyLinkToEditIndex(null); // Indicate we are adding a new policy link
    setSelectedPolicyId(null);
    setPolicyDialogOpen(true);
  };

  const fetchPolicies = async () => {
    if (policies.length > 0) return; // Don't fetch if already loaded
    setLoadingPolicies(true);
    try {
      const response = await httpClient.get("/policies");
      console.log("Fetched policies:", response.data);
      const { data } = response;
      if (data.success) {
        setPolicies(data.data || []);
      } else {
        showNotification("error", data.message || "Failed to fetch policies");
      }
    } catch (err) {
      console.error("Error fetching policies:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch policies";
      showNotification("error", errorMessage);
    } finally {
      setLoadingPolicies(false);
    }
  };

  const handleMediaViewerClose = (selectedFiles = []) => {
    setShowMediaViewer(false);
    if (selectedFiles.length > 0) {
      // Check for duplicates before adding
      const newFileLinks = selectedFiles.map((file) => ({
        type: "file",
        data: file,
      }));
      const uniqueNewLinks = newFileLinks.filter(
        (newLink) =>
          !selectedLinks.some(
            (existingLink) =>
              existingLink.type === "file" &&
              existingLink.data.id === newLink.data.id
          )
      );

      if (uniqueNewLinks.length !== newFileLinks.length) {
        showNotification("warning", "Some selected files are already linked.");
      }

      if (uniqueNewLinks.length > 0) {
        setSelectedLinks((prevLinks) => [...prevLinks, ...uniqueNewLinks]);
        showNotification(
          "success",
          `${uniqueNewLinks.length} file(s) linked successfully.`
        );
      }
    }
  };

  const handlePolicyDialogClose = () => {
    setPolicyDialogOpen(false);
    setSelectedPolicyId(null);
    setPolicyLinkToEditIndex(null); // Reset edit index
  };

  const handlePolicySelectChange = (event, newValue) => {
    // newValue is the selected policy object or null
    setSelectedPolicyId(newValue ? newValue.id : null);
  };

  const handleAddPolicyLink = () => {
    if (selectedPolicyId) {
      const policyToAdd = policies.find((p) => p.id === selectedPolicyId);
      if (policyToAdd) {
        const isDuplicate = selectedLinks.some(
          (link, index) =>
            link.type === "policy" &&
            link.data.id === policyToAdd.id &&
            index !== policyLinkToEditIndex // Allow editing the same policy
        );

        if (isDuplicate) {
          showNotification("warning", "This policy is already linked.");
        } else {
          if (policyLinkToEditIndex !== null) {
            // Editing existing policy link
            const updatedLinks = [...selectedLinks];
            updatedLinks[policyLinkToEditIndex] = {
              type: "policy",
              data: policyToAdd,
            };
            setSelectedLinks(updatedLinks);
            showNotification("success", "Policy link updated.");
          } else {
            // Adding new policy link
            setSelectedLinks((prevLinks) => [
              ...prevLinks,
              { type: "policy", data: policyToAdd },
            ]);
            // showNotification("success", "Policy linked successfully.");
          }
        }
      }
    }
    handlePolicyDialogClose();
  };

  const handleRemoveLink = (indexToRemove) => {
    setSelectedLinks((prevLinks) =>
      prevLinks.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleEditPolicyLink = (indexToEdit) => {
    const linkToEdit = selectedLinks[indexToEdit];
    if (linkToEdit && linkToEdit.type === "policy") {
      fetchPolicies();
      setSelectedPolicyId(linkToEdit.data.id);
      setPolicyLinkToEditIndex(indexToEdit);
      setPolicyDialogOpen(true);
    }
  };

  const handleSelectEmbedPdf = () => {
    setShowPdfMediaViewer(true);
  };

  const handlePdfMediaViewerClose = (selectedPdfFiles = []) => {
    setShowPdfMediaViewer(false);
    if (selectedPdfFiles.length > 0) {
      // Only take the first selected PDF (enforce single selection)
      const selectedPdf = selectedPdfFiles[0];
      // Optional: Check if it's actually a PDF (based on type or name)
      if (
        selectedPdf.type === "application/pdf" ||
        selectedPdf.name.toLowerCase().endsWith(".pdf")
      ) {
        // Check if the same PDF is already embedded (optional)
        if (embeddedPdf && embeddedPdf.id === selectedPdf.id) {
          showNotification("info", "This PDF is already embedded.");
        } else {
          setEmbeddedPdf(selectedPdf);
          showNotification("success", "PDF embedded successfully.");
        }
      } else {
        showNotification("error", "Please select a PDF file.");
      }
    }
    // Note: If user cancels, selectedPdfFiles will be empty, and embeddedPdf remains unchanged.
  };

  const handleRemoveEmbeddedPdf = () => {
    setEmbeddedPdf(null);
  };

  const buildNavigationTree = (items) => {
    const itemMap = {};
    items.forEach((item) => {
      if (item.table === null) {
        itemMap[item.id] = { ...item, children: [] };
      }
    });

    const rootItems = [];
    items.forEach((item) => {
      if (item.table === null && item.parent_id === null) {
        rootItems.push(itemMap[item.id]);
      } else if (item.table === null && itemMap[item.parent_id]) {
        itemMap[item.parent_id].children.push(itemMap[item.id]);
      }
    });

    const sortItems = (items) => {
      return items
        .sort((a, b) => a.order - b.order)
        .map((item) => ({
          ...item,
          children: sortItems(item.children),
        }));
    };

    return sortItems(rootItems);
  };

  const toggleExpand = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getPathToItem = (items, targetId, path = []) => {
    for (let item of items) {
      if (item.id === targetId) {
        return [...path, item.title];
      }
      const childPath = getPathToItem(item.children, targetId, [
        ...path,
        item.title,
      ]);
      if (childPath) return childPath;
    }
    return null;
  };

  const addMapping = (item) => {
    const pathTitles = getPathToItem(navigationTree, item.id);
    if (pathTitles) {
      const fullPath = [selectedCollection.title, ...pathTitles];
      setMappedMappings((prev) => [...prev, { navId: item.id, fullPath }]);
    }
  };

  const removeMapping = (navId) => {
    setMappedMappings((prev) => prev.filter((m) => m.navId !== navId));
  };

  const isMapped = (id) => mappedMappings.some((m) => m.navId === id);

  const renderMappingItem = (item, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.id];

    return (
      <React.Fragment key={item.id}>
        <Box sx={{ ml: depth * 3, mb: 0.5 }}>
          <ListItem
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 1,
              backgroundColor: depth === 0 ? "#f5f5f5" : "#fafafa",
            }}
          >
            <ListItemText
              primary={item.title}
              primaryTypographyProps={{
                fontWeight: depth === 0 ? "bold" : "normal",
              }}
            />
            {hasChildren && (
              <IconButton size="small" onClick={() => toggleExpand(item.id)}>
                {isExpanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            )}
            {!isMapped(item.id) && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => addMapping(item)}
                sx={{ ml: 2 }}
              >
                Add
              </Button>
            )}
          </ListItem>
        </Box>
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child) =>
                renderMappingItem(child, depth + 1)
              )}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const handleSubmit = async (e) => {
    console.log("on submit");
    e.preventDefault();
    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("content", formData.content);
    tags.forEach((tag, index) => {
      submitData.append(`tags[${index}]`, tag);
    });

    // Append linked files and policies with new format
    selectedLinks.forEach((link, index) => {
      if (link.type === "file") {
        submitData.append(`links[${index}][type]`, "file");
        submitData.append(`links[${index}][type_id]`, link.data.id);
      } else if (link.type === "policy") {
        submitData.append(`links[${index}][type]`, "policy");
        submitData.append(`links[${index}][type_id]`, link.data.id);
      }
    });

    // Append video details in the required format
    videos.forEach((video, index) => {
      submitData.append(`videos[${index}][type]`, video.type);
      submitData.append(`videos[${index}][title]`, video.title);

      if (video.type === "upload" && video.file) {
        submitData.append(`videos[${index}][file]`, video.file);
      } else if (
        (video.type === "youtube" || video.type === "vimeo") &&
        video.reference_url
      ) {
        submitData.append(
          `videos[${index}][reference_url]`,
          video.reference_url
        );
      }
    });

    if (embeddedPdf) {
      submitData.append("embedded_pdf_id", embeddedPdf.id);
    }

    for (const [key, value] of Object.entries(submitData)) {
      console.log(key, value);
    }

    mappedMappings.forEach((mapping, index) => {
      submitData.append(`navigations[${index}]`, mapping.navId);
    });

    submitData.append("collection_id", id);

    try {
      setLoading(true);

      const response = await httpClient.post("/policies", submitData);
      console.log("Policy saved:", response.data);
      const { data } = response;
      if (data.success) {
        showNotification(
          "success",
          data.message || "Policy saved successfully"
        );
        // Optionally reset form
        setFormData({ title: "", content: "<p>Hello Blue Wheelers!</p>" });
        setTags([]);
        setSelectedLinks([]);
        setEmbeddedPdf(null);
        setIsVideoEnabled(false);
        setMappedMappings([]);
        setSelectedCollection(null);
        setNavigationTree([]);
        setVideos([]); // Reset videos
      }
    } catch (err) {
      console.error("Error saving policy:", err);
      const errorMessage =
        err.response?.data?.message || err.message || `Failed to save policy`;
      showNotification("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        py: 4,
        backgroundColor: "#f8fafc",
      }}
    >
      <Box
        sx={{
          width: "65%",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              mb: 2,
              textAlign: "center",
              color: "#2d3748",
              fontWeight: 700,
            }}
          >
            Policy Details
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </Box>

        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: "#ffffff",
            boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            {/* Title Field */}
            <FormGrid size={{ xs: 12, md: 6 }}>
              <FormLabel
                htmlFor="title"
                required
                sx={{ color: "#4a5568", fontWeight: 500, mb: 1 }}
              >
                Title
              </FormLabel>
              <OutlinedInput
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter policy title"
                autoComplete="title"
                required
                sx={{
                  borderRadius: 2,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#d1d5db",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#9ca3af",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#667eea",
                  },
                }}
              />
            </FormGrid>
            {/* Body Content Field */}
            <FormGrid size={{ xs: 12, md: 6 }}>
              <FormLabel
                htmlFor="content"
                required
                sx={{ color: "#4a5568", fontWeight: 500, mb: 1 }}
              >
                Body Content
              </FormLabel>

              <RichTextEditor
                value={formData.content}
                onChange={handleContentChange}
              />
            </FormGrid>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <FormLabel
                  sx={{
                    color: "#4a5568",
                    fontWeight: 500,
                    display: "block",
                    mr: 1,
                  }}
                >
                  Tags
                </FormLabel>
                <Tooltip
                  title="Use keywords to ensure this policy is easily searchable when people need it."
                  placement="top-start"
                  arrow
                >
                  <InfoOutlinedIcon
                    sx={{
                      color: "action.active",
                      fontSize: 18,
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>
              </Box>
              <TagsContainer>
                {tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleDeleteTag(tag)}
                    color="primary"
                    variant="outlined"
                    sx={{
                      backgroundColor: "#eff6ff",
                      borderColor: "#667eea",
                      color: "#667eea",
                      "& .MuiChip-deleteIcon": {
                        color: "#667eea",
                        "&:hover": {
                          color: "#5a6fd8",
                        },
                      },
                    }}
                  />
                ))}
                <TagInput
                  type="text"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder={
                    tags.length === 0
                      ? "Type and press Enter to add tags"
                      : "Add another tag..."
                  }
                />
              </TagsContainer>
              <Typography
                variant="caption"
                sx={{ color: "#718096", mt: 1, display: "block" }}
              >
                Type a tag and press Enter to add it. Press Backspace to remove
                the last tag.
              </Typography>
            </Box>
            {/* Video Component */}
            <AddVideo
              isEnabled={isVideoEnabled}
              onToggle={setIsVideoEnabled}
              onVideoAdd={handleVideoAdd}
              onVideoEdit={handleVideoEdit}
              onVideoRemove={handleVideoRemove}
              onVideoPreview={handleVideoPreview}
              videos={videos}
            />

            <FormFieldContainer>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <FormLabel sx={{ color: "#4a5568", fontWeight: 500, mr: 1 }}>
                  Links
                </FormLabel>
                <Tooltip
                  title="Link additional resources to this policy"
                  placement="top-start"
                  arrow
                >
                  <InfoOutlinedIcon
                    sx={{
                      color: "action.active",
                      fontSize: 18,
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                <Button
                  aria-controls={openDropdown ? "create-links-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={openDropdown ? "true" : undefined}
                  variant="outlined"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleClickCreateLinks}
                  sx={{ borderRadius: 2, mr: 1 }}
                >
                  Create Links
                </Button>

                <Menu
                  id="create-links-menu"
                  anchorEl={anchorEl}
                  open={openDropdown}
                  onClose={handleCloseDropdown}
                  MenuListProps={{
                    "aria-labelledby": "create-links-button",
                  }}
                >
                  <MenuItem onClick={handleSelectFileLink}>File</MenuItem>
                  <MenuItem onClick={handleSelectPolicyLink}>Policy</MenuItem>
                </Menu>
              </Box>
            </FormFieldContainer>

            {/* Selected Links Table/List */}
            {selectedLinks.length > 0 && (
              <LinkTableContainer>
                <TableContainer>
                  <Table size="small" aria-label="selected links table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Link Type</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedLinks.map((link, index) => (
                        <LinkTableRow
                          key={`${link.type}-${link.data.id || index}`}
                        >
                          <LinkTypeCell component="th" scope="row">
                            {link.type === "file" ? "File" : "Policy"}
                          </LinkTypeCell>
                          <LinkNameCell>
                            {link.type === "file"
                              ? link.data.name
                              : link.data.title}
                          </LinkNameCell>
                          <LinkActionsCell>
                            {link.type === "policy" && (
                              <IconButton
                                aria-label="edit"
                                size="small"
                                onClick={() => handleEditPolicyLink(index)}
                                sx={{ mr: 1 }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton
                              aria-label="remove"
                              size="small"
                              onClick={() => handleRemoveLink(index)}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </LinkActionsCell>
                        </LinkTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </LinkTableContainer>
            )}

            <FormFieldContainer>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <FormLabel sx={{ color: "#4a5568", fontWeight: 500, mr: 1 }}>
                  Embed PDF
                </FormLabel>
                <Tooltip
                  title={`Embedding a PDF will display the PDF to the user on screen, it will not be able to be downloaded. Only 1 PDF can be embedded. Choose "Links" instead if you want the PDF to be downloadable or multiple files.`}
                  placement="top-start"
                  arrow
                >
                  <InfoOutlinedIcon
                    sx={{
                      color: "action.active",
                      fontSize: 18,
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>
              </Box>

              {embeddedPdf ? (
                <SelectedPdfBox>
                  <Typography
                    variant="body2"
                    sx={{
                      flexGrow: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {embeddedPdf.name}
                  </Typography>
                  <IconButton
                    aria-label="remove embedded pdf"
                    size="small"
                    onClick={handleRemoveEmbeddedPdf}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </SelectedPdfBox>
              ) : (
                <Box sx={{ mt: 1 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleSelectEmbedPdf}
                    sx={{ borderRadius: 2 }}
                  >
                    Select file
                  </Button>
                </Box>
              )}
            </FormFieldContainer>

            {/* Mappings Field */}
            <FormGrid size={{ xs: 12 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <FormLabel sx={{ color: "#4a5568", fontWeight: 500, mb: 1 }}>
                  Mappings
                </FormLabel>
                <Tooltip
                  title="Select all of the manuals and sections where you want this policy to be displayed."
                  placement="top-start"
                >
                  <IconButton size="small" sx={{ ml: 1, mb: 1 }}>
                    <InfoIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Add to Manual/Section
                  </Typography>
                  <Autocomplete
                    options={collections}
                    getOptionLabel={(option) => option.title}
                    value={selectedCollection}
                    onChange={(event, newValue) => {
                      setSelectedCollection(newValue);
                      if (newValue) {
                        fetchNavigations(newValue.id);
                      } else {
                        setNavigationTree([]);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Manual"
                        variant="outlined"
                      />
                    )}
                    sx={{ width: "100%", mb: 2 }}
                  />
                  {navigationTree.length > 0 && (
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Select sections in {selectedCollection?.title}
                      </Typography>
                      <List sx={{ width: "100%" }}>
                        {navigationTree.map((item) => renderMappingItem(item))}
                      </List>
                    </Box>
                  )}
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Mapped Manual/Sections
                  </Typography>
                  {mappedMappings.length > 0 ? (
                    mappedMappings.map((mapping) => (
                      <Box
                        key={mapping.navId}
                        sx={{ display: "flex", alignItems: "center", my: 0.5 }}
                      >
                        <Breadcrumbs separator=" > " aria-label="breadcrumb">
                          {mapping.fullPath.map((title, index) => (
                            <Typography key={index} color="text.primary">
                              {title}
                            </Typography>
                          ))}
                        </Breadcrumbs>
                        <IconButton
                          size="small"
                          onClick={() => removeMapping(mapping.navId)}
                          sx={{ ml: 1 }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))
                  ) : (
                    <Typography sx={{ color: "gray" }}>
                      None mapped yet
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </FormGrid>
            {/* Media Folder Viewer Dialog (for Links) */}
            <Dialog
              fullScreen
              open={showMediaViewer}
              onClose={() => handleMediaViewerClose([])}
              maxWidth={false}
            >
              <DialogTitle sx={{ m: 0, p: 2 }}>
                Select Files
                <IconButton
                  aria-label="close"
                  onClick={() => handleMediaViewerClose([])}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent dividers sx={{ p: 0, height: "100%" }}>
                <MediaFolderViewer
                  selectionMode={true}
                  onSelectionConfirm={(selectedFiles) =>
                    handleMediaViewerClose(selectedFiles)
                  }
                  onCloseRequest={() => handleMediaViewerClose([])}
                  fileTypeFilter={null} // Show all files for general linking
                />
              </DialogContent>
            </Dialog>

            {/* Media Folder Viewer Dialog (for Embed PDF - PDF only) */}
            <Dialog
              fullScreen
              open={showPdfMediaViewer}
              onClose={() => handlePdfMediaViewerClose([])}
              maxWidth={false}
            >
              <DialogTitle sx={{ m: 0, p: 2 }}>
                Select PDF File
                <IconButton
                  aria-label="close"
                  onClick={() => handlePdfMediaViewerClose([])}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent dividers sx={{ p: 0, height: "100%" }}>
                <MediaFolderViewer
                  selectionMode={true}
                  onSelectionConfirm={(selectedFiles) =>
                    handlePdfMediaViewerClose(selectedFiles)
                  }
                  onCloseRequest={() => handlePdfMediaViewerClose([])}
                  fileTypeFilter="pdf"
                />
              </DialogContent>
            </Dialog>

            {/* Policy Selection Dialog */}
            <Dialog
              open={showPolicyDialog}
              onClose={handlePolicyDialogClose}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>
                {policyLinkToEditIndex !== null
                  ? "Edit Linked Policy"
                  : "Select Policy"}
              </DialogTitle>
              <DialogContent>
                {loadingPolicies ? (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", my: 2 }}
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  <Autocomplete
                    disablePortal
                    id="policy-autocomplete"
                    options={policies}
                    getOptionLabel={(option) => option.title || ""}
                    value={
                      policies.find((p) => p.id === selectedPolicyId) || null
                    }
                    onChange={handlePolicySelectChange}
                    renderInput={(params) => (
                      <TextField {...params} label="Policy" />
                    )}
                    fullWidth
                    sx={{ mt: 1 }}
                  />
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handlePolicyDialogClose}>Cancel</Button>
                <Button
                  onClick={handleAddPolicyLink}
                  disabled={!selectedPolicyId || loadingPolicies}
                  variant="contained"
                >
                  {policyLinkToEditIndex !== null ? "Update Link" : "Add Link"}
                </Button>
              </DialogActions>
            </Dialog>

            <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading} // Disable while submitting
                sx={{
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Save Details"
                )}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
      {/* Video Preview Dialog */}
      <Dialog
        open={showVideoPreview}
        onClose={() => setShowVideoPreview(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Video Preview
          <IconButton
            aria-label="close"
            onClick={() => setShowVideoPreview(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {previewVideo && (
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {previewVideo.title}
              </Typography>
              {previewVideo.type === "upload" ? (
                previewVideo.file ? (
                  <video
                    src={URL.createObjectURL(previewVideo.file)}
                    controls
                    style={{ width: "100%", maxHeight: "400px" }}
                  />
                ) : (
                  <Typography>No video file available</Typography>
                )
              ) : previewVideo.type === "youtube" ? (
                previewVideo.reference_url ? (
                  (() => {
                    const videoId = getYoutubeVideoId(
                      previewVideo.reference_url
                    );
                    return videoId ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={previewVideo.title}
                        allowFullScreen
                        style={{
                          width: "100%",
                          height: "400px",
                          border: "none",
                        }}
                      />
                    ) : (
                      <Typography>Invalid YouTube URL</Typography>
                    );
                  })()
                ) : (
                  <Typography>No YouTube URL provided</Typography>
                )
              ) : previewVideo.type === "vimeo" ? (
                previewVideo.reference_url ? (
                  (() => {
                    const videoId = getVimeoVideoId(previewVideo.reference_url);
                    return videoId ? (
                      <iframe
                        src={`https://player.vimeo.com/video/${videoId}`}
                        title={previewVideo.title}
                        allowFullScreen
                        style={{
                          width: "100%",
                          height: "400px",
                          border: "none",
                        }}
                      />
                    ) : (
                      <Typography>Invalid Vimeo URL</Typography>
                    );
                  })()
                ) : (
                  <Typography>No Vimeo URL provided</Typography>
                )
              ) : (
                <Typography>Unsupported video type</Typography>
              )}
              {previewVideo.description && (
                <Typography variant="body2" sx={{ mt: 2, textAlign: "left" }}>
                  {previewVideo.description}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowVideoPreview(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PolicyDetails;
