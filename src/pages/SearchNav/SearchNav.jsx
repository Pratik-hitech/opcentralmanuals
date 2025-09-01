// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   Box,
//   Typography,
//   CircularProgress,
//   Paper,
//   List,
//   ListItem,
//   ListItemAvatar,
//   ListItemText,
//   Avatar,
//   Divider,
// } from "@mui/material";
// import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
// import { httpClient } from "../../utils/httpClientSetup"

// const SearchNav = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const query = new URLSearchParams(location.search).get("q") || "";

//   const [policies, setPolicies] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Fetch search results when query changes
//   useEffect(() => {
//     const fetchResults = async () => {
//       if (!query) {
//         setPolicies([]);
//         return;
//       }

//       setLoading(true);
//       try {
//         const res = await httpClient(`/search?q=${query}`);
//         const fetchedPolicies = res?.data?.data?.policies?.data || [];
//         setPolicies(fetchedPolicies);
//       } catch (error) {
//         console.error("Error fetching search results:", error);
//       }
//       setLoading(false);
//     };

//     fetchResults();
//   }, [query]);

//   return (
//     <Box
//       sx={{
//         maxWidth: 800,
//         mx: "auto",
//         my: 4,
//         px: 2,
//       }}
//     >
//       <Typography variant="h5" gutterBottom>
//         Search results for: <strong>{query}</strong>
//       </Typography>

//       {loading ? (
//         <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//           <CircularProgress size={28} />
//         </Box>
//       ) : policies.length === 0 ? (
//         <Paper sx={{ p: 3, mt: 3, textAlign: "center" }} elevation={2}>
//           <Typography variant="body1">No policies found.</Typography>
//         </Paper>
//       ) : (
//         <Paper sx={{ mt: 3 }} elevation={3}>
//           <List>
//             {policies.map((policy, index) => (
//               <React.Fragment key={policy.id}>
//                 <ListItem
//                   button
//                   alignItems="flex-start"
//                   onClick={() =>
//                     navigate(`/operations/manual/5/policy/${policy.id}`)
//                   }
//                   sx={{
//                     cursor: "pointer", // 👈 Added pointer cursor here
//                     "&:hover": {
//                       backgroundColor: "action.hover",
//                     },
//                   }}
//                 >
//                   {/* Manual Icon */}
//                   <ListItemAvatar>
//                     <Avatar
//                       sx={{
//                         bgcolor: "transparent",
//                         border: "1px solid #ccc",
//                       }}
//                     >
//                       <DescriptionOutlinedIcon color="action" />
//                     </Avatar>
//                   </ListItemAvatar>

//                   {/* Title + Content Preview */}
//                   <ListItemText
//                     primary={
//                       <Typography variant="subtitle1" fontWeight={600}>
//                         {policy.title}
//                       </Typography>
//                     }
//                     secondary={
//                       <Typography
//                         variant="body2"
//                         color="text.secondary"
//                         sx={{
//                           mt: 0.5,
//                           display: "-webkit-box",
//                           WebkitLineClamp: 2,
//                           WebkitBoxOrient: "vertical",
//                           overflow: "hidden",
//                         }}
//                         dangerouslySetInnerHTML={{
//                           __html:
//                             policy.content?.length > 250
//                               ? policy.content.slice(0, 250) + "..."
//                               : policy.content,
//                         }}
//                       />
//                     }
//                   />
//                 </ListItem>

//                 {index !== policies.length - 1 && <Divider />}
//               </React.Fragment>
//             ))}
//           </List>
//         </Paper>
//       )}
//     </Box>
//   );
// };

// export default SearchNav;
// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   Box,
//   Typography,
//   CircularProgress,
//   Paper,
//   List,
//   ListItem,
//   ListItemAvatar,
//   ListItemText,
//   Avatar,
//   Divider,
//   Pagination,
//   PaginationItem,
// } from "@mui/material";
// import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
// import ArticleIcon from "@mui/icons-material/Article";
// import PeopleIcon from "@mui/icons-material/People";
// import FolderIcon from "@mui/icons-material/Folder";
// import FeedIcon from "@mui/icons-material/Feed";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// import { httpClient } from "../../utils/httpClientSetup";

// const categories = [
//   { key: "policies", label: "Operations Manuals", icon: ArticleIcon, color: "#1976d2" },
//   { key: "users", label: "Users", icon: PeopleIcon, color: "#d32f2f" },
//   { key: "files", label: "File Manager", icon: FolderIcon, color: "#ed6c02" },
//   { key: "news", label: "News", icon: FeedIcon, color: "#2e7d32" },
//   { key: "events", label: "Events", icon: DescriptionOutlinedIcon, color: "#9c27b0" },
// ];

// const SearchNav = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const query = new URLSearchParams(location.search).get("q") || "";

//   const [results, setResults] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState("policies");
//   const [currentPages, setCurrentPages] = useState({});
//   const [loadingPages, setLoadingPages] = useState({});

//   useEffect(() => {
//     const fetchResults = async () => {
//       if (!query) {
//         setResults({});
//         setCurrentPages({});
//         return;
//       }

//       setLoading(true);
//       try {
//         const res = await httpClient(`/search?q=${query}`);
//         setResults(res?.data?.data || {});
        
//         // Initialize current pages for each category
//         const initialPages = {};
//         categories.forEach(cat => {
//           initialPages[cat.key] = res?.data?.data[cat.key]?.pagination?.current_page || 1;
//         });
//         setCurrentPages(initialPages);
//       } catch (error) {
//         console.error("Error fetching search results:", error);
//       }
//       setLoading(false);
//     };

//     fetchResults();
//   }, [query]);

//   const fetchPage = async (categoryKey, pageNumber) => {
//     if (loadingPages[categoryKey]) return;
    
//     setLoadingPages(prev => ({ ...prev, [categoryKey]: true }));
//     try {
//       const res = await httpClient(`/search?q=${query}&category=${categoryKey}&page=${pageNumber}`);
//       if (res?.data?.data?.[categoryKey]) {
//         setResults(prev => ({
//           ...prev,
//           [categoryKey]: res.data.data[categoryKey]
//         }));
        
//         setCurrentPages(prev => ({
//           ...prev,
//           [categoryKey]: pageNumber
//         }));
//       }
//     } catch (error) {
//       console.error(`Error fetching page ${pageNumber} for ${categoryKey}:`, error);
//     }
//     setLoadingPages(prev => ({ ...prev, [categoryKey]: false }));
//   };

//   const handleCategoryChange = (categoryKey) => {
//     setSelectedCategory(categoryKey);
//   };

//   const handlePageChange = (event, value) => {
//     fetchPage(selectedCategory, value);
//   };

//   const getCategoryInfo = (categoryKey) => {
//     return categories.find(cat => cat.key === categoryKey) || categories[0];
//   };

//   const handleItemClick = (link, event) => {
//     // Open in new tab if Ctrl/Cmd clicked or middle mouse button
//     if (event.ctrlKey || event.metaKey || event.button === 1) {
//       window.open(link, '_blank');
//     } else {
//       navigate(link);
//     }
//   };

//   const renderListItem = (item, categoryKey) => {
//     const categoryInfo = getCategoryInfo(categoryKey);
//     const IconComponent = categoryInfo.icon;
    
//     let link = "#";
//     let title = "";
//     let content = "";
    
//     if (categoryKey === "policies") {
//       link = `/operations/manual/5/policy/${item.id}`;
//       title = item.title;
//       content = item.content;
//     } else if (categoryKey === "news") {
//       link = `/dashboardnews/${item.id}`;
//       title = item.title;
//       content = item.content;
//     } else if (categoryKey === "users") {
//       link = `/users/profile/${item.id}`;
//       title = item.name;
//       content = item.email;
//     } 
    
//     else if ( categoryKey === "events") {
//       // link = `/users/profile/${item.id}`;
//       title = item.title;
//       content = item.description;
//     }
    
//     else if (categoryKey === "files") {
//       link = `/file-manager/${item.id}`;
//       title = item.label || item.name;
//       content = item.file_type;
//     }

//     return (
//       <ListItem
//         button
//         key={item.id}
//         alignItems="flex-start"
//         onClick={(e) => handleItemClick(link, e)}
//         sx={{
//           cursor: "pointer",
//           "&:hover": { backgroundColor: "action.hover" },
//           minHeight: '88px',
//         }}
//       >
//         <ListItemAvatar>
//           <Avatar sx={{ 
//             bgcolor: "transparent", 
//             border: `1px solid ${categoryInfo.color}`,
//             color: categoryInfo.color
//           }}>
//             <IconComponent />
//           </Avatar>
//         </ListItemAvatar>
//         <ListItemText
//           primary={
//             <Typography variant="subtitle1" fontWeight={600}>
//               {title}
//             </Typography>
//           }
//           secondary={
//             content ? (
//               <Typography
//                 variant="body2"
//                 color="text.secondary"
//                 sx={{
//                   mt: 0.5,
//                   display: "-webkit-box",
//                   WebkitLineClamp: 2,
//                   WebkitBoxOrient: "vertical",
//                   overflow: "hidden",
//                 }}
//               >
//                 {typeof content === 'string' && content.length > 250
//                   ? content.replace(/<[^>]*>/g, '').slice(0, 250) + "..."
//                   : content}
//               </Typography>
//             ) : null
//           }
//         />
//       </ListItem>
//     );
//   };

//   // Calculate pagination details for current category
//   const paginationInfo = results[selectedCategory]?.pagination || {};
//   const totalPages = paginationInfo.last_page || 1;
//   const totalItems = paginationInfo.total || 0;
//   const itemsPerPage = paginationInfo.per_page || 10;
//   const currentPage = currentPages[selectedCategory] || 1;
//   const startItem = ((currentPage - 1) * itemsPerPage) + 1;
//   const endItem = Math.min(currentPage * itemsPerPage, totalItems);
//   const categoryInfo = getCategoryInfo(selectedCategory);

//   return (
//     <Box sx={{ display: "flex", maxWidth: 1200, mx: "auto", my: 4, minHeight: '600px' }}>
//       {/* Left Panel */}
//       <Paper sx={{ width: 250, p: 2, mr: 3, alignSelf: 'flex-start' }} elevation={2}>
//         <Typography variant="h6" gutterBottom>
//           SEARCH ALL
//         </Typography>
//         <List>
//           {categories.map((cat) => {
//             const IconComponent = cat.icon;
//             return (
//               <ListItem
//                 key={cat.key}
//                 button
//                 selected={selectedCategory === cat.key}
//                 onClick={() => handleCategoryChange(cat.key)}
//                 sx={{
//                   backgroundColor: selectedCategory === cat.key ? "#f5f5f5" : "transparent",
//                   color: selectedCategory === cat.key ? "text.primary" : "text.primary",
//                   borderRadius: 1,
//                   mb: 0.5,
//                   cursor: "pointer",
//                   "&:hover": {
//                     backgroundColor: selectedCategory === cat.key ? "#e0e0e0" : "action.hover",
//                   },
//                 }}
//               >
//                 <Box sx={{ display: "flex", alignItems: "center", mr: 1, color: cat.color }}>
//                   <IconComponent />
//                 </Box>
//                 <ListItemText
//                   primary={`${cat.label} (${results[cat.key]?.count || 0})`}
//                   sx={{
//                     "& .MuiTypography-root": {
//                       fontWeight: selectedCategory === cat.key ? 600 : 400,
//                     }
//                   }}
//                 />
//               </ListItem>
//             );
//           })}
//         </List>
//       </Paper>

//       {/* Right Panel - Fixed container to prevent layout shifts */}
//       <Box sx={{ flex: 1, minWidth: 0 }}>
//         <Box sx={{ display: "flex", alignItems: "center", mb: 2, flexWrap: 'wrap' }}>
//           <Typography variant="h5">
//             SEARCH RESULTS FOR: <strong>"{query}"</strong>
//           </Typography>
//           <Box sx={{ ml: 2, display: "flex", alignItems: "center", color: categoryInfo.color }}>
//             <categoryInfo.icon />
//             <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 600 }}>
//               {categoryInfo.label}
//             </Typography>
//           </Box>
//         </Box>

//         {loading ? (
//           <Box sx={{ display: "flex", justifyContent: "center", alignItems: 'center', height: '400px' }}>
//             <CircularProgress size={28} />
//           </Box>
//         ) : !results[selectedCategory]?.data?.length ? (
//           <Paper sx={{ p: 3, mt: 3, textAlign: "center", height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} elevation={2}>
//             <Typography variant="body1">No results found in this category.</Typography>
//           </Paper>
//         ) : (
//           <>
//             <Paper sx={{ mt: 3, minHeight: '400px' }} elevation={3}>
//               <List>
//                 {results[selectedCategory].data.map((item, index) => (
//                   <React.Fragment key={item.id}>
//                     {renderListItem(item, selectedCategory)}
//                     {index !== results[selectedCategory].data.length - 1 && (
//                       <Divider />
//                     )}
//                   </React.Fragment>
//                 ))}
//               </List>
//             </Paper>
            
//             {/* Pagination */}
//             {totalPages > 1 && (
//               <Box sx={{ display: "flex", justifyContent: "center", mt: 3, alignItems: 'center', minHeight: '40px' }}>
//                 <Pagination
//                   count={totalPages}
//                   page={currentPage}
//                   onChange={handlePageChange}
//                   renderItem={(item) => (
//                     <PaginationItem
//                       slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
//                       {...item}
//                       disabled={loadingPages[selectedCategory]}
//                     />
//                   )}
//                 />
//                 {loadingPages[selectedCategory] && (
//                   <CircularProgress size={24} sx={{ ml: 2 }} />
//                 )}
//               </Box>
//             )}
            
//             {/* Results count */}
//             <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: "center", minHeight: '24px' }}>
//               {totalItems > 0 ? `Showing ${startItem} to ${endItem} of ${totalItems} results` : ''}
//             </Typography>
//           </>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default SearchNav;



// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   Box,
//   Typography,
//   CircularProgress,
//   Paper,
//   List,
//   ListItem,
//   ListItemAvatar,
//   ListItemText,
//   Avatar,
//   Divider,
//   Pagination,
//   PaginationItem,
//   Modal,
//   Button,
//   Snackbar,
//   Alert,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
//   TextField,
//   Link,
// } from "@mui/material";
// import {
//   LocalizationProvider,
//   DateTimePicker
// } from '@mui/x-date-pickers';
// import { format } from "date-fns";
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
// import ArticleIcon from "@mui/icons-material/Article";
// import PeopleIcon from "@mui/icons-material/People";
// import FolderIcon from "@mui/icons-material/Folder";
// import FeedIcon from "@mui/icons-material/Feed";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// import { httpClient } from "../../utils/httpClientSetup";

// const categories = [
//   { key: "policies", label: "Operations Manuals", icon: ArticleIcon, color: "#1976d2" },
//   { key: "users", label: "Users", icon: PeopleIcon, color: "#d32f2f" },
//   { key: "files", label: "File Manager", icon: FolderIcon, color: "#ed6c02" },
//   { key: "news", label: "News", icon: FeedIcon, color: "#2e7d32" },
//   { key: "events", label: "Events", icon: DescriptionOutlinedIcon, color: "#9c27b0" },
// ];

// const SearchNav = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const query = new URLSearchParams(location.search).get("q") || "";

//   const [results, setResults] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState("policies");
//   const [currentPages, setCurrentPages] = useState({});
//   const [loadingPages, setLoadingPages] = useState({});

//   // Modal states
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedEventId, setSelectedEventId] = useState(null);
//   const [eventDetails, setEventDetails] = useState(null);
//   const [eventLoading, setEventLoading] = useState(false);
//   const [eventError, setEventError] = useState(null);

//   // Edit mode and edited event state
//   const [editMode, setEditMode] = useState(false);
//   const [editedEvent, setEditedEvent] = useState(null);

//   // Delete confirmation dialog state
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

//   // Snackbar for feedback messages
//   const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

//   useEffect(() => {
//     const fetchResults = async () => {
//       if (!query) {
//         setResults({});
//         setCurrentPages({});
//         return;
//       }
//       setLoading(true);
//       try {
//         const res = await httpClient(`/search?q=${query}`);
//         setResults(res?.data?.data || {});
//         const initialPages = {};
//         categories.forEach(cat => {
//           initialPages[cat.key] = res?.data?.data[cat.key]?.pagination?.current_page || 1;
//         });
//         setCurrentPages(initialPages);
//       } catch (error) {
//         console.error("Error fetching search results:", error);
//       }
//       setLoading(false);
//     };
//     fetchResults();
//   }, [query]);

//   const fetchPage = async (categoryKey, pageNumber) => {
//     if (loadingPages[categoryKey]) return;
//     setLoadingPages(prev => ({ ...prev, [categoryKey]: true }));
//     try {
//       const res = await httpClient(`/search?q=${query}&category=${categoryKey}&page=${pageNumber}`);
//       if (res?.data?.data?.[categoryKey]) {
//         setResults(prev => ({
//           ...prev,
//           [categoryKey]: res.data.data[categoryKey]
//         }));
//         setCurrentPages(prev => ({
//           ...prev,
//           [categoryKey]: pageNumber
//         }));
//       }
//     } catch (error) {
//       console.error(`Error fetching page ${pageNumber} for ${categoryKey}:`, error);
//     }
//     setLoadingPages(prev => ({ ...prev, [categoryKey]: false }));
//   };

//   const handleCategoryChange = (categoryKey) => {
//     setSelectedCategory(categoryKey);
//   };

//   const handlePageChange = (event, value) => {
//     fetchPage(selectedCategory, value);
//   };

//   const getCategoryInfo = (categoryKey) => {
//     return categories.find(cat => cat.key === categoryKey) || categories[0];
//   };

//   const handleItemClick = (link, e, categoryKey, item) => {
//     if (categoryKey === "events") {
//       openEventModal(item.id);
//       return;
//     }
//     if (e.ctrlKey || e.metaKey || e.button === 1) {
//       window.open(link, '_blank');
//     } else {
//       navigate(link);
//     }
//   };

//   const openEventModal = async (eventId) => {
//     setModalOpen(true);
//     setSelectedEventId(eventId);
//     setEventLoading(true);
//     setEventError(null);
//     setEventDetails(null);
//     setEditMode(false);
//     try {
//       const res = await httpClient(`events`);
//       if (res?.data?.success && Array.isArray(res.data.data)) {
//         const event = res.data.data.find(e => e.id === eventId);
//         if (event) {
//           setEventDetails(event);
//           setEditedEvent(event);
//         } else {
//           setEventError("Event not found");
//         }
//       } else {
//         setEventError("Failed to fetch event details");
//       }
//     } catch (error) {
//       setEventError("Error fetching event details");
//       console.error(error);
//     }
//     setEventLoading(false);
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     setSelectedEventId(null);
//     setEventDetails(null);
//     setEventError(null);
//     setEditMode(false);
//     setDeleteDialogOpen(false);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleString(undefined, { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
//   };

//   const handleInputChange = (field, value) => {
//     setEditedEvent(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleSaveEdit = async () => {
//   try {
//     // Format dates to Y-m-d H:i:s before sending to the backend
//     const formattedEvent = {
//       ...editedEvent,
//       start_date: editedEvent.start_date ? format(new Date(editedEvent.start_date), "yyyy-MM-dd HH:mm:ss") : null,
//       end_date: editedEvent.end_date ? format(new Date(editedEvent.end_date), "yyyy-MM-dd HH:mm:ss") : null,
//     };

//     await httpClient.put(`/events/${selectedEventId}`, formattedEvent);
//     setEventDetails(editedEvent);
//     setEditMode(false);
//     setSnackbar({ open: true, message: "Event updated successfully", severity: "success" });
//     const res = await httpClient(`/search?q=${query}`);
//     setResults(res?.data?.data || {});
//   } catch (error) {
//     console.error("Error updating event:", error);
//     setSnackbar({ open: true, message: "Failed to update event", severity: "error" });
//   }
// };

//   const handleCancelEdit = () => {
//     setEditMode(false);
//     setEditedEvent(eventDetails);
//   };

//   const handleDeleteClick = () => {
//     setDeleteDialogOpen(true);
//   };

//   const handleDeleteConfirm = async () => {
//     try {
//       await httpClient.delete(`/events/${selectedEventId}`);
//       setDeleteDialogOpen(false);
//       closeModal();
//       setSnackbar({ open: true, message: "Event deleted successfully", severity: "success" });
//       const res = await httpClient(`/search?q=${query}`);
//       setResults(res?.data?.data || {});
//     } catch (error) {
//       console.error("Error deleting event:", error);
//       setSnackbar({ open: true, message: "Failed to delete event", severity: "error" });
//     }
//   };

//   const handleDeleteCancel = () => {
//     setDeleteDialogOpen(false);
//   };

//   const renderListItem = (item, categoryKey) => {
//     const categoryInfo = getCategoryInfo(categoryKey);
//     const IconComponent = categoryInfo.icon;

//     let link = "#";
//     let title = "";
//     let content = "";

//     if (categoryKey === "policies") {
//       link = `/operations/manual/5/policy/${item.id}`;
//       title = item.title;
//       content = item.content;
//     } else if (categoryKey === "news") {
//       link = `/dashboardnews/${item.id}`;
//       title = item.title;
//       content = item.content;
//     } else if (categoryKey === "users") {
//       link = `/users/profile/${item.id}`;
//       title = item.name;
//       content = item.email;
//     } else if (categoryKey === "events") {
//       title = item.title;
//       content = item.description;
//     } else if (categoryKey === "files") {
//       link = `/file-manager/${item.id}`;
//       title = item.label || item.name;
//       content = item.file_type;
//     }

//     return (
//       <ListItem
//         button
//         key={item.id}
//         alignItems="flex-start"
//         onClick={(e) => handleItemClick(link, e, categoryKey, item)}
//         sx={{ cursor: "pointer", "&:hover": { backgroundColor: "action.hover" }, minHeight: "88px" }}
//       >
//         <ListItemAvatar>
//           <Avatar sx={{ bgcolor: "transparent", border: `1px solid ${categoryInfo.color}`, color: categoryInfo.color }}>
//             <IconComponent />
//           </Avatar>
//         </ListItemAvatar>
//         <ListItemText
//           primary={<Typography variant="subtitle1" fontWeight={600}>{title}</Typography>}
//           secondary={
//             content ? <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
//               {typeof content === "string" && content.length > 250 ? content.replace(/<[^>]*>/g, "").slice(0, 250) + "..." : content}
//             </Typography> : null
//           }
//         />
//       </ListItem>
//     );
//   };

//   const paginationInfo = results[selectedCategory]?.pagination || {};
//   const totalPages = paginationInfo.last_page || 1;
//   const totalItems = paginationInfo.total || 0;
//   const itemsPerPage = paginationInfo.per_page || 10;
//   const currentPage = currentPages[selectedCategory] || 1;
//   const startItem = (currentPage - 1) * itemsPerPage + 1;
//   const endItem = Math.min(currentPage * itemsPerPage, totalItems);
//   const categoryInfo = getCategoryInfo(selectedCategory);

//   return (
//     <LocalizationProvider dateAdapter={AdapterDateFns}>
//       <Box sx={{ display: "flex", maxWidth: 1200, mx: "auto", my: 4, minHeight: "600px" }}>
//         {/* Left Panel */}
//         <Paper sx={{ width: 250, p: 2, mr: 3, alignSelf: "flex-start" }} elevation={2}>
//           <Typography variant="h6" gutterBottom>SEARCH ALL</Typography>
//           <List>
//             {categories.map((cat) => {
//               const IconComponent = cat.icon;
//               return (
//                 <ListItem key={cat.key} button selected={selectedCategory === cat.key} onClick={() => handleCategoryChange(cat.key)} sx={{ backgroundColor: selectedCategory === cat.key ? "#f5f5f5" : "transparent", cursor: "pointer", borderRadius: 1, mb: 0.5, "&:hover": { backgroundColor: selectedCategory === cat.key ? "#e0e0e0" : "action.hover" } }}>
//                   <Box sx={{ display: "flex", alignItems: "center", mr: 1, color: cat.color }}>
//                     <IconComponent />
//                   </Box>
//                   <ListItemText primary={`${cat.label} (${results[cat.key]?.count || 0})`} sx={{ "& .MuiTypography-root": { fontWeight: selectedCategory === cat.key ? 600 : 400 } }} />
//                 </ListItem>
//               );
//             })}
//           </List>
//         </Paper>

//         {/* Right Panel */}
//         <Box sx={{ flex: 1, minWidth: 0 }}>
//           <Box sx={{ display: "flex", alignItems: "center", mb: 2, flexWrap: "wrap" }}>
//             <Typography variant="h5">SEARCH RESULTS FOR: <strong>"{query}"</strong></Typography>
//             <Box sx={{ ml: 2, display: "flex", alignItems: "center", color: categoryInfo.color }}>
//               <categoryInfo.icon />
//               <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 600 }}>{categoryInfo.label}</Typography>
//             </Box>
//           </Box>

//           {loading ? (
//             <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
//               <CircularProgress size={28} />
//             </Box>
//           ) : !results[selectedCategory]?.data?.length ? (
//             <Paper sx={{ p: 3, mt: 3, textAlign: "center", height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }} elevation={2}>
//               <Typography variant="body1">No results found in this category.</Typography>
//             </Paper>
//           ) : (
//             <>
//               <Paper sx={{ mt: 3, minHeight: "400px" }} elevation={3}>
//                 <List>
//                   {results[selectedCategory].data.map((item, index) => (
//                     <React.Fragment key={item.id}>
//                       {renderListItem(item, selectedCategory)}
//                       {index !== results[selectedCategory].data.length - 1 && <Divider />}
//                     </React.Fragment>
//                   ))}
//                 </List>
//               </Paper>

//               {totalPages > 1 && (
//                 <Box sx={{ display: "flex", justifyContent: "center", mt: 3, alignItems: "center", minHeight: "40px" }}>
//                   <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} renderItem={(item) => (
//                     <PaginationItem slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} disabled={loadingPages[selectedCategory]} />
//                   )} />
//                   {loadingPages[selectedCategory] && <CircularProgress size={24} sx={{ ml: 2 }} />}
//                 </Box>
//               )}

//               <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: "center", minHeight: "24px" }}>
//                 {totalItems > 0 ? `Showing ${startItem} to ${endItem} of ${totalItems} results` : ""}
//               </Typography>
//             </>
//           )}
//         </Box>

//         {/* Modal */}
//         <Modal open={modalOpen} onClose={closeModal}>
//           <Box sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: "90%",
//             maxWidth: 600,
//             bgcolor: "background.paper",
//             boxShadow: 24,
//             p: 3,
//             borderRadius: 2,
//             maxHeight: "90vh",
//             overflowY: "auto",
//             outline: "none",
//           }}>
//             {eventLoading ? (
//               <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
//                 <CircularProgress />
//               </Box>
//             ) : eventError ? (
//               <Typography variant="body1" color="error">{eventError}</Typography>
//             ) : eventDetails ? (
//               <>
//                 <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//                   <Typography variant="h5">{editMode ? "Edit Event" : eventDetails.title}</Typography>
//                   <Box>
//                     {!editMode && (
//                       <>
//                         <Button variant="outlined" size="small" sx={{ mr: 1 }} onClick={() => setEditMode(true)}>Edit</Button>
//                         <Button variant="outlined" color="error" size="small" onClick={handleDeleteClick}>Delete</Button>
//                       </>
//                     )}
//                     <Button variant="text" size="small" onClick={closeModal}>Close</Button>
//                   </Box>
//                 </Box>

//                 {editMode ? (
//                   <>
//                     <TextField fullWidth label="Title" value={editedEvent.title || ""} onChange={(e) => handleInputChange("title", e.target.value)} margin="normal" variant="outlined" />
//                     <TextField fullWidth label="Description" value={editedEvent.description || ""} onChange={(e) => handleInputChange("description", e.target.value)} margin="normal" variant="outlined" multiline rows={4} />
//                     <DateTimePicker
//                       label="Start Date & Time"
//                       value={editedEvent.start_date ? new Date(editedEvent.start_date) : null}
//                       onChange={(newValue) => handleInputChange("start_date", newValue ? newValue.toISOString() : "")}
//                       renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
//                     />
//                     <DateTimePicker
//                       label="End Date & Time"
//                       value={editedEvent.end_date ? new Date(editedEvent.end_date) : null}
//                       onChange={(newValue) => handleInputChange("end_date", newValue ? newValue.toISOString() : "")}
//                       renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
//                     />
//                     <TextField fullWidth label="Location" value={editedEvent.location || ""} onChange={(e) => handleInputChange("location", e.target.value)} margin="normal" variant="outlined" />
//                     <TextField fullWidth label="Timezone" value={editedEvent.timezone || ""} onChange={(e) => handleInputChange("timezone", e.target.value)} margin="normal" variant="outlined" />
//                     <TextField fullWidth label="URL" value={editedEvent.url || ""} onChange={(e) => handleInputChange("url", e.target.value)} margin="normal" variant="outlined" />

//                     <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 1 }}>
//                       <Button onClick={handleCancelEdit} variant="outlined">Cancel</Button>
//                       <Button onClick={handleSaveEdit} variant="contained">Save</Button>
//                     </Box>
//                   </>
//                 ) : (
//                   <>
//                     <Typography variant="subtitle1" gutterBottom>{eventDetails.description}</Typography>
//                     <Box sx={{ mt: 2, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
//                       <Box>
//                         <Typography variant="subtitle2" color="text.secondary">Start Date</Typography>
//                         <Typography>{formatDate(eventDetails.start_date)}</Typography>
//                       </Box>
//                       <Box>
//                         <Typography variant="subtitle2" color="text.secondary">End Date</Typography>
//                         <Typography>{formatDate(eventDetails.end_date)}</Typography>
//                       </Box>
//                       <Box>
//                         <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Location</Typography>
//                         <Typography>{eventDetails.location || "N/A"}</Typography>
//                       </Box>
//                       <Box>
//                         <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Timezone</Typography>
//                         <Typography>{eventDetails.timezone || "N/A"}</Typography>
//                       </Box>
//                       <Box sx={{ gridColumn: "span 2", mt: 2 }}>
//                         <Typography variant="subtitle2" color="text.secondary">URL</Typography>
//                         {eventDetails.url ? (
//                           <Link href={eventDetails.url} target="_blank" rel="noopener noreferrer">{eventDetails.url}</Link>
//                         ) : (
//                           <Typography>N/A</Typography>
//                         )}
//                       </Box>
//                     </Box>
//                   </>
//                 )}
//               </>
//             ) : (
//               <Typography>No event selected</Typography>
//             )}

//             {/* Delete Confirmation Dialog */}
//             <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
//               <DialogTitle>Confirm Delete</DialogTitle>
//               <DialogContent>
//                 <DialogContentText>Are you sure you want to delete the event "{eventDetails?.title}"? This action cannot be undone.</DialogContentText>
//               </DialogContent>
//               <DialogActions>
//                 <Button onClick={handleDeleteCancel}>Cancel</Button>
//                 <Button onClick={handleDeleteConfirm} color="error" autoFocus>Delete</Button>
//               </DialogActions>
//             </Dialog>

//             {/* Snackbar */}
//             <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
//               <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity} 
//               variant="filled"
//               sx={{ width: "100%" }}>
//                 {snackbar.message}
//               </Alert>
//             </Snackbar>
//           </Box>
//         </Modal>
//       </Box>
//     </LocalizationProvider>
//   );
// };

// export default SearchNav;

// ***********************************

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Pagination,
  PaginationItem,
  Modal,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Link,
} from "@mui/material";
import {
  LocalizationProvider,
  DateTimePicker
} from '@mui/x-date-pickers';
import { format } from "date-fns";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ArticleIcon from "@mui/icons-material/Article";
import PeopleIcon from "@mui/icons-material/People";
import FolderIcon from "@mui/icons-material/Folder";
import FeedIcon from "@mui/icons-material/Feed";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { httpClient } from "../../utils/httpClientSetup";
import DOMPurify from 'dompurify';

// HTML Renderer Component
const HtmlRenderer = ({ htmlContent, className = '' }) => {
  if (!htmlContent) return null;
  
  // Sanitize the HTML content
  const cleanHtml = DOMPurify.sanitize(htmlContent);
  
  return (
    <div 
      className={`rendered-html-content ${className}`}
      dangerouslySetInnerHTML={{ __html: cleanHtml }} 
    />
  );
};

const categories = [
  { key: "policies", label: "Operations Manuals", icon: ArticleIcon, color: "#1976d2" },
  { key: "users", label: "Users", icon: PeopleIcon, color: "#d32f2f" },
  { key: "files", label: "File Manager", icon: FolderIcon, color: "#ed6c02" },
  { key: "news", label: "News", icon: FeedIcon, color: "#2e7d32" },
  // { key: "events", label: "Events", icon: DescriptionOutlinedIcon, color: "#9c27b0" },
];

const SearchNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("q") || "";

  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("policies");
  const [currentPages, setCurrentPages] = useState({});
  const [loadingPages, setLoadingPages] = useState({});

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [eventLoading, setEventLoading] = useState(false);
  const [eventError, setEventError] = useState(null);

  // Edit mode and edited event state
  const [editMode, setEditMode] = useState(false);
  const [editedEvent, setEditedEvent] = useState(null);

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Snackbar for feedback messages - MOVED OUTSIDE MODAL
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults({});
        setCurrentPages({});
        return;
      }
      setLoading(true);
      try {
        const res = await httpClient(`/search?q=${query}`);
        setResults(res?.data?.data || {});
        const initialPages = {};
        categories.forEach(cat => {
          initialPages[cat.key] = res?.data?.data[cat.key]?.pagination?.current_page || 1;
        });
        setCurrentPages(initialPages);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
      setLoading(false);
    };
    fetchResults();
  }, [query]);

  const fetchPage = async (categoryKey, pageNumber) => {
    if (loadingPages[categoryKey]) return;
    setLoadingPages(prev => ({ ...prev, [categoryKey]: true }));
    try {
      const res = await httpClient(`/search?q=${query}&category=${categoryKey}&page=${pageNumber}`);
      if (res?.data?.data?.[categoryKey]) {
        setResults(prev => ({
          ...prev,
          [categoryKey]: res.data.data[categoryKey]
        }));
        setCurrentPages(prev => ({
          ...prev,
          [categoryKey]: pageNumber
        }));
      }
    } catch (error) {
      console.error(`Error fetching page ${pageNumber} for ${categoryKey}:`, error);
    }
    setLoadingPages(prev => ({ ...prev, [categoryKey]: false }));
  };

  const handleCategoryChange = (categoryKey) => {
    setSelectedCategory(categoryKey);
  };

  const handlePageChange = (event, value) => {
    fetchPage(selectedCategory, value);
  };

  const getCategoryInfo = (categoryKey) => {
    return categories.find(cat => cat.key === categoryKey) || categories[0];
  };

  const handleItemClick = (link, e, categoryKey, item) => {
    if (categoryKey === "events") {
      openEventModal(item.id);
      return;
    }
    if (e.ctrlKey || e.metaKey || e.button === 1) {
      window.open(link, '_blank');
    } else {
      navigate(link);
    }
  };

  const openEventModal = async (eventId) => {
    setModalOpen(true);
    setSelectedEventId(eventId);
    setEventLoading(true);
    setEventError(null);
    setEventDetails(null);
    setEditMode(false);
    try {
      const res = await httpClient(`events`);
      if (res?.data?.success && Array.isArray(res.data.data)) {
        const event = res.data.data.find(e => e.id === eventId);
        if (event) {
          setEventDetails(event);
          setEditedEvent(event);
        } else {
          setEventError("Event not found");
        }
      } else {
        setEventError("Failed to fetch event details");
      }
    } catch (error) {
      setEventError("Error fetching event details");
      console.error(error);
    }
    setEventLoading(false);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedEventId(null);
    setEventDetails(null);
    setEventError(null);
    setEditMode(false);
    setDeleteDialogOpen(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString(undefined, { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const handleInputChange = (field, value) => {
    setEditedEvent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveEdit = async () => {
    try {
      // Format dates to Y-m-d H:i:s before sending to the backend
      const formattedEvent = {
        ...editedEvent,
        start_date: editedEvent.start_date ? format(new Date(editedEvent.start_date), "yyyy-MM-dd HH:mm:ss") : null,
        end_date: editedEvent.end_date ? format(new Date(editedEvent.end_date), "yyyy-MM-dd HH:mm:ss") : null,
      };

      await httpClient.put(`/events/${selectedEventId}`, formattedEvent);
      setEventDetails(editedEvent);
      setEditMode(false);
      setSnackbar({ open: true, message: "Event updated successfully", severity: "success" });
      const res = await httpClient(`/search?q=${query}`);
      setResults(res?.data?.data || {});
    } catch (error) {
      console.error("Error updating event:", error);
      setSnackbar({ open: true, message: "Failed to update event", severity: "error" });
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedEvent(eventDetails);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await httpClient.delete(`/events/${selectedEventId}`);
      setDeleteDialogOpen(false);
      setSnackbar({ open: true, message: "Event deleted successfully", severity: "success" });
      
      // Close the modal after a short delay to allow the snackbar to be seen
      setTimeout(() => {
        closeModal();
      }, 500);
      
      // Refresh search results
      const res = await httpClient(`/search?q=${query}`);
      setResults(res?.data?.data || {});
    } catch (error) {
      console.error("Error deleting event:", error);
      setSnackbar({ open: true, message: "Failed to delete event", severity: "error" });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const renderListItem = (item, categoryKey) => {
    const categoryInfo = getCategoryInfo(categoryKey);
    const IconComponent = categoryInfo.icon;

    let link = "#";
    let title = "";
    let content = "";

    if (categoryKey === "policies") {
      link = `/operations/manual/5/policy/${item.id}`;
      title = item.title;
      content = item.content;
    } else if (categoryKey === "news") {
      link = `/dashboardnews/${item.id}`;
      title = item.title;
      content = item.content;
    } else if (categoryKey === "users") {
      link = `/users/profile/${item.id}`;
      title = item.name;
      content = item.email;
    } else if (categoryKey === "events") {
      title = item.title;
      content = item.description;
    } else if (categoryKey === "files") {
      // link = `/file-manager/${item.id}`;
      link = `/file-manager`;
      title = item.label || item.name;
      content = item.file_type;
    }

    return (
      <ListItem
        button
        key={item.id}
        alignItems="flex-start"
        onClick={(e) => handleItemClick(link, e, categoryKey, item)}
        sx={{ cursor: "pointer", "&:hover": { backgroundColor: "action.hover" }, minHeight: "88px" }}
      >
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: "transparent", border: `1px solid ${categoryInfo.color}`, color: categoryInfo.color }}>
            <IconComponent />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={<Typography variant="subtitle1" fontWeight={600}>{title}</Typography>}
          secondary={
            content ? (
              <Box sx={{ mt: 0.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                <HtmlRenderer 
                  htmlContent={
                    typeof content === "string" && content.length > 250 
                      ? content.slice(0, 250) + "..." 
                      : content
                  } 
                />
              </Box>
            ) : null
          }
        />
      </ListItem>
    );
  };

  const paginationInfo = results[selectedCategory]?.pagination || {};
  const totalPages = paginationInfo.last_page || 1;
  const totalItems = paginationInfo.total || 0;
  const itemsPerPage = paginationInfo.per_page || 10;
  const currentPage = currentPages[selectedCategory] || 1;
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const categoryInfo = getCategoryInfo(selectedCategory);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ display: "flex", maxWidth: 1200, mx: "auto", my: 4, minHeight: "600px" }}>
        {/* Left Panel */}
        <Paper sx={{ width: 250, p: 2, mr: 3, alignSelf: "flex-start" }} elevation={2}>
          <Typography variant="h6" gutterBottom>SEARCH ALL</Typography>
          <List>
            {categories.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <ListItem key={cat.key} button selected={selectedCategory === cat.key} onClick={() => handleCategoryChange(cat.key)} sx={{ backgroundColor: selectedCategory === cat.key ? "#f5f5f5" : "transparent", cursor: "pointer", borderRadius: 1, mb: 0.5, "&:hover": { backgroundColor: selectedCategory === cat.key ? "#e0e0e0" : "action.hover" } }}>
                  <Box sx={{ display: "flex", alignItems: "center", mr: 1, color: cat.color }}>
                    <IconComponent />
                  </Box>
                  <ListItemText primary={`${cat.label} (${results[cat.key]?.count || 0})`} sx={{ "& .MuiTypography-root": { fontWeight: selectedCategory === cat.key ? 600 : 400 } }} />
                </ListItem>
              );
            })}
          </List>
        </Paper>

        {/* Right Panel */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2, flexWrap: "wrap" }}>
            <Typography variant="h5">SEARCH RESULTS FOR: <strong>"{query}"</strong></Typography>
            <Box sx={{ ml: 2, display: "flex", alignItems: "center", color: categoryInfo.color }}>
              <categoryInfo.icon />
              <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 600 }}>{categoryInfo.label}</Typography>
            </Box>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
              <CircularProgress size={28} />
            </Box>
          ) : !results[selectedCategory]?.data?.length ? (
            <Paper sx={{ p: 3, mt: 3, textAlign: "center", height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }} elevation={2}>
              <Typography variant="body1">No results found in this category.</Typography>
            </Paper>
          ) : (
            <>
              <Paper sx={{ mt: 3, minHeight: "400px" }} elevation={3}>
                <List>
                  {results[selectedCategory].data.map((item, index) => (
                    <React.Fragment key={item.id}>
                      {renderListItem(item, selectedCategory)}
                      {index !== results[selectedCategory].data.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>

              {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3, alignItems: "center", minHeight: "40px" }}>
                  <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} renderItem={(item) => (
                    <PaginationItem slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} disabled={loadingPages[selectedCategory]} />
                  )} />
                  {loadingPages[selectedCategory] && <CircularProgress size={24} sx={{ ml: 2 }} />}
                </Box>
              )}

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: "center", minHeight: "24px" }}>
                {totalItems > 0 ? `Showing ${startItem} to ${endItem} of ${totalItems} results` : ""}
              </Typography>
            </>
          )}
        </Box>

        {/* Modal */}
        <Modal open={modalOpen} onClose={closeModal}>
          <Box sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
            maxHeight: "90vh",
            overflowY: "auto",
            outline: "none",
          }}>
            {eventLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress />
              </Box>
            ) : eventError ? (
              <Typography variant="body1" color="error">{eventError}</Typography>
            ) : eventDetails ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h5">{editMode ? "Edit Event" : eventDetails.title}</Typography>
                  <Box>
                    {!editMode && (
                      <>
                        <Button variant="outlined" size="small" sx={{ mr: 1 }} onClick={() => setEditMode(true)}>Edit</Button>
                        <Button variant="outlined" color="error" size="small" onClick={handleDeleteClick}>Delete</Button>
                      </>
                    )}
                    <Button variant="text" size="small" onClick={closeModal}>Close</Button>
                  </Box>
                </Box>

                {editMode ? (
                  <>
                    <TextField fullWidth label="Title" value={editedEvent.title || ""} onChange={(e) => handleInputChange("title", e.target.value)} margin="normal" variant="outlined" />
                    <TextField fullWidth label="Description" value={editedEvent.description || ""} onChange={(e) => handleInputChange("description", e.target.value)} margin="normal" variant="outlined" multiline rows={4} />
                    <DateTimePicker
                      label="Start Date & Time"
                      value={editedEvent.start_date ? new Date(editedEvent.start_date) : null}
                      onChange={(newValue) => handleInputChange("start_date", newValue ? newValue.toISOString() : "")}
                      renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                    />
                    <DateTimePicker
                      label="End Date & Time"
                      value={editedEvent.end_date ? new Date(editedEvent.end_date) : null}
                      onChange={(newValue) => handleInputChange("end_date", newValue ? newValue.toISOString() : "")}
                      renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                    />
                    <TextField fullWidth label="Location" value={editedEvent.location || ""} onChange={(e) => handleInputChange("location", e.target.value)} margin="normal" variant="outlined" />
                    <TextField fullWidth label="Timezone" value={editedEvent.timezone || ""} onChange={(e) => handleInputChange("timezone", e.target.value)} margin="normal" variant="outlined" />
                    <TextField fullWidth label="URL" value={editedEvent.url || ""} onChange={(e) => handleInputChange("url", e.target.value)} margin="normal" variant="outlined" />

                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 1 }}>
                      <Button onClick={handleCancelEdit} variant="outlined">Cancel</Button>
                      <Button onClick={handleSaveEdit} variant="contained">Save</Button>
                    </Box>
                  </>
                ) : (
                  <>
                    <Typography variant="subtitle1" gutterBottom>{eventDetails.description}</Typography>
                    <Box sx={{ mt: 2, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">Start Date</Typography>
                        <Typography>{formatDate(eventDetails.start_date)}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">End Date</Typography>
                        <Typography>{formatDate(eventDetails.end_date)}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Location</Typography>
                        <Typography>{eventDetails.location || "N/A"}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Timezone</Typography>
                        <Typography>{eventDetails.timezone || "N/A"}</Typography>
                      </Box>
                      <Box sx={{ gridColumn: "span 2", mt: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">URL</Typography>
                        {eventDetails.url ? (
                          <Link href={eventDetails.url} target="_blank" rel="noopener noreferrer">{eventDetails.url}</Link>
                        ) : (
                          <Typography>N/A</Typography>
                        )}
                      </Box>
                    </Box>
                  </>
                )}
              </>
            ) : (
              <Typography>No event selected</Typography>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogContent>
                <DialogContentText>Are you sure you want to delete the event "{eventDetails?.title}"? This action cannot be undone.</DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDeleteCancel}>Cancel</Button>
                <Button onClick={handleDeleteConfirm} color="error" autoFocus>Delete</Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Modal>

        {/* Snackbar - MOVED OUTSIDE THE MODAL */}
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={3000} 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert 
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
            severity={snackbar.severity} 
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default SearchNav;