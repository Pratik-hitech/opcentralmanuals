import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutline";
import Grid from "@mui/material/Grid";
import RichTextEditor from "../../../../components/RichTextEditor";
import { httpClient } from "../../../../utils/httpClientSetup";
import { useNotification } from "../../../../hooks/useNotification";
import AddVideo from "./AddVideo";
import MediaFolderViewer from "../../../FileManager/FileManager";

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

const EmbedPdfContainer = styled(Box)(({ theme }) => ({
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

  const [selectedLinks, setSelectedLinks] = useState([]);
  const [showMediaViewer, setShowMediaViewer] = useState(false);

  const [showPolicyDialog, setPolicyDialogOpen] = useState(false);
  const [policies, setPolicies] = useState([]);
  const [loadingPolicies, setLoadingPolicies] = useState(false);
  const [selectedPolicyId, setSelectedPolicyId] = useState(null);
  const [policyLinkToEditIndex, setPolicyLinkToEditIndex] = useState(null);

  const [embeddedPdf, setEmbeddedPdf] = useState(null);
  const [showPdfMediaViewer, setShowPdfMediaViewer] = useState(false);

  const showNotification = useNotification();

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
    console.log("Video added:", videoData);
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
            showNotification("success", "Policy linked successfully.");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("content", formData.content);
    tags.forEach((tag, index) => {
      submitData.append(`tags[${index}]`, tag);
    });

    // Append linked files and policies
    selectedLinks.forEach((link, index) => {
      if (link.type === "file") {
        // If you need to send file IDs or names
        submitData.append(`linked_files[${index}]`, link.data.id); // Or link.data.name
      } else if (link.type === "policy") {
        submitData.append(`linked_policies[${index}]`, link.data.id);
      }
    });

    if (embeddedPdf) {
      submitData.append("embedded_pdf_id", embeddedPdf.id); //TODO: Adjust key as needed
    }

    try {
      const response = await httpClient.post("/policies", submitData); //TODO: Adjust endpoint
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
        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: 2, textAlign: "center", color: "#2d3748", fontWeight: 700 }}
        >
          Policy Details
        </Typography>
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
              <Paper
                sx={{
                  border: "1px solid #d1d5db",
                  borderRadius: 2,
                  minHeight: 200,
                  p: 3,
                  backgroundColor: "#f9fafb",
                }}
              >
                <RichTextEditor
                  value={formData.content}
                  onChange={handleContentChange}
                />
              </Paper>
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
            />

            <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
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
                <Tooltip
                  title="Link additional resources to this policy."
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

            <EmbedPdfContainer>
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
            </EmbedPdfContainer>

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
                  background:
                    "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: "0 4px 20px rgba(102, 126, 234, 0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #5a6fd8 30%, #6b46a3 90%)",
                    boxShadow: "0 6px 25px rgba(102, 126, 234, 0.4)",
                  },
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
    </Container>
  );
};

export default PolicyDetails;
