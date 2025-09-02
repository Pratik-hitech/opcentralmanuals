import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  IconButton,
  Paper,
  Divider,
  Button,
  Chip,
  Link as MuiLink,
  Container,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import {
  ExpandMore,
  ExpandLess,
  Article,
  PlayCircle,
  PauseCircle,
  Stop,
  Link as LinkIcon,
  Edit as EditIcon,
  UnfoldMore as UnfoldMoreIcon,
  UnfoldLess as UnfoldLessIcon,
} from "@mui/icons-material";
import ExpandIcon from "@mui/icons-material/Expand";
import TocIcon from "@mui/icons-material/Toc";
import { httpClient } from "../../../../utils/httpClientSetup";
import { useAuth } from "../../../../context/AuthContext";

const OperationsManual = () => {
  const { id, policyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const passedManualName = location.state?.manualName;
  const [manual, setManual] = useState(null);
  const [navigationTree, setNavigationTree] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [policyNavigationOrder, setPolicyNavigationOrder] = useState([]);
  const [breadcrumbPath, setBreadcrumbPath] = useState([]);
  const [isBreadcrumbExpanded, setIsBreadcrumbExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [policyLoading, setPolicyLoading] = useState(false);
  const [loadingPolicyName, setLoadingPolicyName] = useState("");
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const { user } = useAuth();
  const isAdmin = user?.role?.name === "admin";
  // Fetch manual data
  const fetchManual = async () => {
    try {
      const response = await httpClient.get(`/collections/${id}`);
      setManual(response.data.data);
    } catch (error) {
      console.error("Error fetching manual:", error);
      setError("Failed to load manual");
    }
  };

  // Fetch navigation tree
  const fetchNavigationTree = async () => {
    try {
      const response = await httpClient.get(`/navigations/tree/${id}`);
      const data = response.data.data || [];
      setNavigationTree(data);
      return data;
    } catch (error) {
      console.error("Error fetching navigation tree:", error);
      setError("Failed to load navigation tree");
      throw error;
    }
  };

  // Fetch policy data
  const fetchPolicy = async (policyId) => {
    try {
      setPolicyLoading(true);
      const response = await httpClient.get(`/policies/${policyId}`);
      setSelectedPolicy(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching policy:", error);
      setError("Failed to load policy");
      return null;
    } finally {
      setPolicyLoading(false);
    }
  };

  // Initialize component
  useEffect(() => {
    const initialize = async () => {
      try {
        await fetchManual();
        const navigationData = await fetchNavigationTree();

        // Since the data is already nested, we don't need to build the tree
        setNavigationTree(navigationData);

        // Preserve manually expanded items and ensure the section containing the current policy is expanded
        const updatedExpandedItems = { ...expandedItems };

        // Function to check if an item or its children contain the current policy
        const containsCurrentPolicy = (item) => {
          if (
            policyId &&
            item.table === "policies" &&
            item.primary_id === parseInt(policyId)
          ) {
            return true;
          }
          if (item.children) {
            return item.children.some((child) => containsCurrentPolicy(child));
          }
          return false;
        };

        // Function to traverse and expand items as needed
        const traverseAndSetExpanded = (items) => {
          items.forEach((item) => {
            // Expand sections that contain the current policy
            if (item.children && item.children.length > 0) {
              if (containsCurrentPolicy(item)) {
                updatedExpandedItems[item.id] = true;
              }
              // Expand first section by default if no sections are expanded and we're not viewing a specific policy
              if (
                !policyId &&
                Object.keys(updatedExpandedItems).length === 0 &&
                items.indexOf(item) === 0
              ) {
                updatedExpandedItems[item.id] = true;
              }
            }
            traverseAndSetExpanded(item.children || []);
          });
        };

        traverseAndSetExpanded(navigationData);
        setExpandedItems(updatedExpandedItems);

        // Build policy navigation order
        const policyOrder = [];
        const traverseForPolicyOrder = (items) => {
          items.forEach((item) => {
            if (item.table === "policies") {
              policyOrder.push(item);
            }
            traverseForPolicyOrder(item.children || []);
          });
        };
        traverseForPolicyOrder(navigationData);
        setPolicyNavigationOrder(policyOrder);

        // If policyId is provided, fetch the policy data
        if (policyId) {
          const policyData = await fetchPolicy(policyId);
          // Build breadcrumb path for the policy
          const policyItem = policyOrder.find(
            (item) => item.primary_id === parseInt(policyId)
          );
          if (policyItem) {
            // Fetch manual data if not already available
            let manualData = manual;
            if (!manualData) {
              const manualResponse = await httpClient.get(`/collections/${id}`);
              manualData = manualResponse.data.data;
            }
            buildBreadcrumbPath(policyItem, manualData);
          }
        }
      } catch (error) {
        console.error("Error initializing:", error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [id, policyId]);

  // Toggle expand/collapse for navigation items
  const toggleExpand = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // Handle policy click
  const handlePolicyClick = (item) => {
    if (item.table === "policies") {
      // Set policy loading state and policy name
      setPolicyLoading(true);
      setLoadingPolicyName(item.title);
      // Navigate to the policy route
      navigate(`/operations/manual/${id}/policy/${item.primary_id}`);
    }
  };

  // Build breadcrumb path for a policy
  const buildBreadcrumbPath = (policyItem, manualData) => {
    const path = [];

    // Add manual name
    if (manualData) {
      path.push({ title: manualData.title, type: "manual", id: manualData.id });
    }

    // Find the policy in the navigation tree and build the path
    const findPolicyPath = (items, policyId) => {
      for (const item of items) {
        if (item.table === "policies" && item.primary_id === policyId) {
          // Found the policy
          path.push({ title: item.title, type: "policy", id: item.primary_id });
          return true;
        }

        if (item.children && item.children.length > 0) {
          // Add section or subsection to path
          if (item.table === null) {
            path.push({
              title: item.title,
              type: item.parent_id === null ? "section" : "subsection",
              id: item.id,
            });
          }

          if (findPolicyPath(item.children, policyId)) {
            return true;
          }

          // Remove section or subsection from path if policy not found in this branch
          if (item.table === null) {
            path.pop();
          }
        }
      }
      return false;
    };

    findPolicyPath(navigationTree, policyItem.primary_id);
    setBreadcrumbPath(path);
  };

  // Handle manual title click (reset to initial state)
  const handleManualTitleClick = () => {
    setSelectedPolicy(null);
    setBreadcrumbPath([]);
  };

  // Text-to-speech functions
  const speakPolicyContent = () => {
    if (!selectedPolicy || !selectedPolicy.content) return;

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    // Create a new speech utterance
    const utterance = new SpeechSynthesisUtterance();

    // Strip HTML tags from content for speech
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = selectedPolicy.content;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";

    utterance.text = textContent;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const pauseSpeech = () => {
    window.speechSynthesis.pause();
    setIsPlaying(false);
    setIsPaused(true);
  };

  const resumeSpeech = () => {
    window.speechSynthesis.resume();
    setIsPlaying(true);
    setIsPaused(false);
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  // Render navigation item
  const renderNavigationItem = (item, depth = 0, numberingPath = []) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.id];
    const isPolicy = item.table === "policies";
    const currentNumber = numberingPath.join(".");
    const isActivePolicy =
      isPolicy && selectedPolicy && item.primary_id === selectedPolicy.id;

    return (
      <React.Fragment key={item.id}>
        <Box sx={{ ml: depth * 2, mb: 0.5 }}>
          <ListItem
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 1,
              backgroundColor: isActivePolicy
                ? "#e3f2fd" // Highlight color for active policy
                : depth === 0
                ? "#f5f5f5"
                : depth > 0 && !isPolicy
                ? "#fafafa"
                : "white",
              cursor: isPolicy ? "pointer" : "default",
              "&:hover": {
                backgroundColor: isPolicy ? "#e3f2fd" : "inherit",
              },
            }}
            onClick={() => isPolicy && handlePolicyClick(item)}
          >
            {isPolicy && (
              <ListItemIcon sx={{ minWidth: 30 }}>
                <Article sx={{ fontSize: 16 }} />
              </ListItemIcon>
            )}
            <ListItemText
              primary={`${currentNumber}${currentNumber ? ". " : ""}${
                item.title
              }`}
              sx={{
                fontWeight: depth === 0 ? "bold" : "normal",
                color: isPolicy ? "#1976d2" : "inherit",
              }}
            />
            {hasChildren && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(item.id);
                }}
              >
                {isExpanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            )}
          </ListItem>
        </Box>
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children
                .filter((child) => child && child.id)
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((child, index) =>
                  renderNavigationItem(child, depth + 1, [
                    ...numberingPath,
                    index + 1,
                  ])
                )}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  // Get next policy
  const getNextPolicy = () => {
    if (!selectedPolicy || policyNavigationOrder.length === 0) return null;

    const currentIndex = policyNavigationOrder.findIndex(
      (item) => item.primary_id === selectedPolicy.id
    );

    if (currentIndex < policyNavigationOrder.length - 1) {
      return policyNavigationOrder[currentIndex + 1];
    }

    return null;
  };

  // Get previous policy
  const getPreviousPolicy = () => {
    if (!selectedPolicy || policyNavigationOrder.length === 0) return null;

    const currentIndex = policyNavigationOrder.findIndex(
      (item) => item.primary_id === selectedPolicy.id
    );

    if (currentIndex > 0) {
      return policyNavigationOrder[currentIndex - 1];
    }

    return null;
  };

  // Handle next policy
  const handleNextPolicy = () => {
    const nextPolicy = getNextPolicy();
    if (nextPolicy) {
      handlePolicyClick(nextPolicy);
    }
  };

  // Handle previous policy
  const handlePreviousPolicy = () => {
    const previousPolicy = getPreviousPolicy();
    if (previousPolicy) {
      handlePolicyClick(previousPolicy);
    }
  };

  // Render video item
  const renderVideo = (video) => {
    // Function to extract YouTube video ID from URL
    const getYouTubeVideoId = (url) => {
      const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return match && match[2].length === 11 ? match[2] : null;
    };

    // Function to extract Vimeo video ID from URL
    const getVimeoVideoId = (url) => {
      const regExp = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
      const match = url.match(regExp);
      return match && match[1] ? match[1] : null;
    };

    // Render video preview based on type
    const renderVideoPreview = () => {
      if (video.type === "youtube") {
        const videoId = getYouTubeVideoId(video.reference_url);
        if (videoId) {
          return (
            <Box sx={{ mb: 2 }}>
              <iframe
                width="100%"
                height="400"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </Box>
          );
        }
      } else if (video.type === "vimeo") {
        const videoId = getVimeoVideoId(video.reference_url);
        if (videoId) {
          return (
            <Box sx={{ mb: 2 }}>
              <iframe
                src={`https://player.vimeo.com/video/${videoId}`}
                width="100%"
                height="400"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={video.title}
              ></iframe>
            </Box>
          );
        }
      } else if (video.type === "upload") {
        return (
          <Box sx={{ mb: 2 }}>
            <video controls width="100%">
              <source src={video.reference_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Box>
        );
      }
      return null;
    };

    return (
      <Paper key={video.id} elevation={2} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          {video.title}
        </Typography>
        {video.description && (
          <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
            {video.description}
          </Typography>
        )}
        {renderVideoPreview()}
        <Box sx={{ mb: 1 }}>
          <MuiLink href={video.reference_url} target="_blank" rel="noopener">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PlayCircle color="primary" />
              <Typography>
                {video.type === "youtube" && "Watch on YouTube"}
                {video.type === "vimeo" && "Watch on Vimeo"}
                {video.type === "upload" && "Play Video"}
              </Typography>
            </Box>
          </MuiLink>
        </Box>
        <Chip label={video.type} size="small" variant="outlined" />
      </Paper>
    );
  };

  // Render link item
  const renderLink = (link) => {
    return (
      <Paper key={link.id} elevation={2} sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <LinkIcon fontSize="small" />
          <MuiLink href={link.url} target="_blank" rel="noopener">
            <Typography>{link.url}</Typography>
          </MuiLink>
        </Box>
        <Chip label={link.type} size="small" variant="outlined" />
      </Paper>
    );
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <CircularProgress />
        <Typography mt={2}>
          Loading {passedManualName || "manual"}...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Grid container spacing={3}>
        {/* Left Column - Table of Contents */}
        {isSidebarExpanded && (
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Table of Contents
                </Typography>
                <Tooltip
                  title={
                    Object.values(expandedItems).every(Boolean)
                      ? "Collapse All"
                      : "Expand All"
                  }
                >
                  <IconButton
                    size="small"
                    onClick={() => {
                      const allExpanded =
                        Object.values(expandedItems).every(Boolean);
                      const newExpandedItems = {};
                      const traverseAndSetExpanded = (items, expand) => {
                        items.forEach((item) => {
                          if (item.children && item.children.length > 0) {
                            newExpandedItems[item.id] = !expand;
                          }
                          traverseAndSetExpanded(item.children || [], expand);
                        });
                      };
                      traverseAndSetExpanded(navigationTree, allExpanded);
                      setExpandedItems(newExpandedItems);
                    }}
                  >
                    {Object.values(expandedItems).every(Boolean) ? (
                      <UnfoldLessIcon />
                    ) : (
                      <UnfoldMoreIcon />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {navigationTree.length > 0 ? (
                <List sx={{ width: "100%" }}>
                  {[...navigationTree]
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((item, index) =>
                      renderNavigationItem(item, 0, [index + 1])
                    )}
                </List>
              ) : (
                <Typography>No navigation items found</Typography>
              )}
            </Paper>
          </Grid>
        )}

        {/* Right Column - Content */}
        <Grid size={{ xs: 12, md: isSidebarExpanded ? 9 : 12 }}>
          <Paper elevation={3} sx={{ p: 3, minHeight: "70vh", height: "100%" }}>
            {policyLoading ? (
              <Box
                sx={{
                  p: 3,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <CircularProgress />
                <Typography>Loading {loadingPolicyName}...</Typography>
              </Box>
            ) : selectedPolicy ? (
              <>
                {/* Breadcrumb and Edit Button */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  {/* Breadcrumb */}
                  <Box sx={{ width: "75%" }}>
                    {breadcrumbPath.length > 0 && (
                      <Box
                        sx={{
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          setIsBreadcrumbExpanded(!isBreadcrumbExpanded)
                        }
                      >
                        {isBreadcrumbExpanded ? (
                          // Show full path when expanded
                          <Box
                            sx={{
                              whiteSpace: "normal",
                              overflow: "visible",
                              textOverflow: "clip",
                            }}
                          >
                            {breadcrumbPath.map((item, index) => (
                              <span key={item.id}>
                                {item.type === "manual" ? (
                                  <MuiLink
                                    component="button"
                                    variant="body1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleManualTitleClick();
                                    }}
                                    sx={{ fontWeight: "bold" }}
                                  >
                                    {item.title}
                                  </MuiLink>
                                ) : (
                                  <Typography
                                    component="span"
                                    variant="body1"
                                    sx={{
                                      fontWeight:
                                        index === breadcrumbPath.length - 1
                                          ? "bold"
                                          : "normal",
                                    }}
                                  >
                                    {item.title}
                                  </Typography>
                                )}
                                {index < breadcrumbPath.length - 1 && (
                                  <Typography
                                    component="span"
                                    variant="body1"
                                    sx={{ mx: 1 }}
                                  >
                                    /
                                  </Typography>
                                )}
                              </span>
                            ))}
                          </Box>
                        ) : (
                          // Show simplified path when collapsed: Manual/.../Policy
                          <Box
                            sx={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            <MuiLink
                              component="button"
                              variant="body1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleManualTitleClick();
                              }}
                              sx={{ fontWeight: "bold" }}
                            >
                              {breadcrumbPath[0]?.title}
                            </MuiLink>
                            <Typography
                              component="span"
                              variant="body1"
                              sx={{ mx: 1 }}
                            >
                              /
                            </Typography>
                            <Typography
                              component="span"
                              variant="body1"
                              sx={{ color: "primary.main" }}
                            >
                              ...
                            </Typography>
                            <Typography
                              component="span"
                              variant="body1"
                              sx={{ mx: 1 }}
                            >
                              /
                            </Typography>
                            <Typography
                              component="span"
                              variant="body1"
                              sx={{ fontWeight: "bold" }}
                            >
                              {breadcrumbPath[breadcrumbPath.length - 1]?.title}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>

                  {/* Action Buttons */}
                  <Box sx={{ width: "25%", textAlign: "right" }}>
                    {/* Play/Pause Button */}
                    <Tooltip
                      title={isPlaying ? "Pause" : isPaused ? "Resume" : "Play"}
                    >
                      <IconButton
                        onClick={() => {
                          if (isPlaying) {
                            pauseSpeech();
                          } else if (isPaused) {
                            resumeSpeech();
                          } else {
                            speakPolicyContent();
                          }
                        }}
                        sx={{ border: "1px solid #ccc", mr: 1 }}
                      >
                        {isPlaying ? <PauseCircle /> : <PlayCircle />}
                      </IconButton>
                    </Tooltip>

                    {/* Stop Button */}
                    {isPlaying || isPaused ? (
                      <Tooltip title="Stop">
                        <IconButton
                          onClick={stopSpeech}
                          sx={{ border: "1px solid #ccc", mr: 1 }}
                        >
                          <Stop />
                        </IconButton>
                      </Tooltip>
                    ) : null}

                    {/* Expand Reading Area Button */}
                    <Tooltip
                      title={
                        isSidebarExpanded
                          ? "Hide Table of Contents"
                          : "Show Table of Contents"
                      }
                    >
                      <IconButton
                        onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                        sx={{ border: "1px solid #ccc", mr: 1 }}
                      >
                        {isSidebarExpanded ? (
                          <ExpandIcon sx={{ transform: "rotate(-90deg)" }} />
                        ) : (
                          <TocIcon />
                        )}
                      </IconButton>
                    </Tooltip>

                    {/* Edit Button */}
                    {isAdmin && (
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => {
                            // Find the navigation item for the selected policy
                            let policyNavigationItem = null;
                            const findPolicyNavigationItem = (items) => {
                              for (const item of items) {
                                if (
                                  item.table === "policies" &&
                                  item.primary_id === selectedPolicy.id
                                ) {
                                  policyNavigationItem = item;
                                  return true;
                                }
                                if (
                                  item.children &&
                                  findPolicyNavigationItem(item.children)
                                ) {
                                  return true;
                                }
                              }
                              return false;
                            };
                            findPolicyNavigationItem(navigationTree);

                            // Navigate to edit page with navigationId
                            const navigationId = policyNavigationItem
                              ? policyNavigationItem.parent_id
                              : "";
                            window.location.href = `/manuals/edit/${id}/policies/edit/${
                              selectedPolicy.id
                            }/details${
                              navigationId
                                ? `?navigationId=${navigationId}`
                                : ""
                            }`;
                          }}
                          sx={{ border: "1px solid #ccc" }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Box>

                {/* Separator */}
                <Divider sx={{ mb: 3 }} />

                {/* Policy Content */}
                {/* <Typography variant="h4" gutterBottom>
                  {selectedPolicy.title}
                </Typography> */}

                {selectedPolicy.content && (
                  <Box
                    sx={{ mt: 2, mb: 3 }}
                    dangerouslySetInnerHTML={{ __html: selectedPolicy.content }}
                  />
                )}

                {/* Videos */}
                {selectedPolicy.videos && selectedPolicy.videos.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    {selectedPolicy.videos.map((video) => renderVideo(video))}
                  </Box>
                )}

                {/* Tags */}
                {selectedPolicy.tags && selectedPolicy.tags.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Tags
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {selectedPolicy.tags.map((tag) => (
                        <Chip
                          key={tag.id}
                          label={tag.title}
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Links */}
                {selectedPolicy.links && selectedPolicy.links.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Links
                    </Typography>
                    {selectedPolicy.links.map((link) => renderLink(link))}
                  </Box>
                )}

                {/* Previous/Next Buttons */}
                <Box
                  sx={{
                    mt: 4,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={handlePreviousPolicy}
                    disabled={!getPreviousPolicy()}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleNextPolicy}
                    disabled={!getNextPolicy()}
                  >
                    Next
                  </Button>
                </Box>
              </>
            ) : (
              <>
                {/* Manual Info */}
                {manual && (
                  <>
                    <Typography variant="h4" gutterBottom>
                      {manual.title}
                    </Typography>
                    {navigationTree.length > 0 && (
                      <Typography variant="body1" sx={{ mb: 3 }}>
                        Please select a policy from the table of contents.
                      </Typography>
                    )}
                    {manual.thumbnail && (
                      <Box sx={{ textAlign: "center", my: 3 }}>
                        <img
                          src={manual.thumbnail}
                          alt={manual.title}
                          style={{ maxWidth: "100%", height: "auto" }}
                        />
                      </Box>
                    )}
                  </>
                )}
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OperationsManual;
