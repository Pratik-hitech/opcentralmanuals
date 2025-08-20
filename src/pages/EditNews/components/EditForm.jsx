// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import MDEditor from "@uiw/react-md-editor";
// import {
//   Box, TextField, FormControl, InputLabel, Select, MenuItem,
//   Switch, FormControlLabel, Button, Typography,
//   Paper, Divider, Alert, CircularProgress, IconButton, Stack
// } from "@mui/material";
// import { httpClient } from "../../../utils/httpClientSetup";
// import {
//   FormatBold as FormatBoldIcon,
//   FormatUnderlined as FormatUnderlinedIcon,
//   FormatListNumbered as FormatListNumberedIcon,
//   FormatListBulleted as FormatListBulletedIcon,
//   FormatQuote as FormatQuoteIcon,
//   Link as LinkIcon,
//   Image as ImageIcon
// } from "@mui/icons-material";

// const NewsArticleForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const isEditMode = Boolean(id);
  
//   const [formData, setFormData] = useState({
//     title: "",
//     content: "",
//     category: "",
//     hasVideo: false,
//     primaryImage: null,
//     attachments: [],
//     privateUrl: "",
//     featured: false,
//     autoArchive: false,
//     status: "draft"
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!isEditMode) return;

//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         const response = await httpClient.get(`news/${id}`);
//         if (response.data.success) {
//           setFormData(response.data.data);
//         }
//       } catch (error) {
//         setError(error.response?.data?.message || "Failed to load article");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [id, isEditMode]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
    
//     try {
//       const response = isEditMode
//         ? await httpClient.put(`news/${id}`, formData)
//         : await httpClient.post("news", formData);

//       if (response.data.success) {
//         navigate(`/manage/newsarticle/${response.data.data.id}/details`);
//       }
//     } catch (error) {
//       setError(error.response?.data?.message || "Failed to save article");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value
//     }));
//   };

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: files[0]
//     }));
//   };

//   return (
//     <Box 
//       component="form" 
//       onSubmit={handleSubmit}
//       sx={{
//         maxWidth: '70%',
//         margin: '0 auto',
//         '@media (max-width: 900px)': {
//           maxWidth: '90%'
//         }
//       }}
//     >
//       <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
//         {isEditMode ? "Edit News Article" : "Create New Article"}
//       </Typography>

//       {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

//       <Paper elevation={3} sx={{ p: 3 }}>
//         <Typography variant="h6" sx={{ mb: 2 }}>DETAILS</Typography>
//         <Divider sx={{ mb: 3 }} />

//         {/* Title */}
//         <TextField
//           fullWidth
//           label="Title *"
//           name="title"
//           value={formData.title}
//           onChange={handleChange}
//           required
//           sx={{ mb: 3 }}
//         />

//         {/* Content */}
//         <Typography variant="subtitle2" sx={{ mb: 1 }}>Content *</Typography>
//         <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
//           <IconButton size="small">
//             <FormatBoldIcon fontSize="small" />
//           </IconButton>
//           <IconButton size="small">
//             <FormatUnderlinedIcon fontSize="small" />
//           </IconButton>
//           <IconButton size="small">
//             <FormatListNumberedIcon fontSize="small" />
//           </IconButton>
//           <IconButton size="small">
//             <FormatListBulletedIcon fontSize="small" />
//           </IconButton>
//           <IconButton size="small">
//             <FormatQuoteIcon fontSize="small" />
//           </IconButton>
//           <IconButton size="small">
//             <LinkIcon fontSize="small" />
//           </IconButton>
//           <IconButton size="small">
//             <ImageIcon fontSize="small" />
//           </IconButton>
//         </Stack>
//         <MDEditor
//           value={formData.content}
//           onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
//           height={400}
//           sx={{ mb: 3 }}
//         />

//         {/* News Category */}
//         <Typography variant="subtitle1" sx={{ mb: 1, mt: 3 }}>News Category(s)</Typography>
//         <FormControl fullWidth sx={{ mb: 2 }}>
//           <InputLabel>Select News Category</InputLabel>
//           <Select
//             name="category"
//             value={formData.category}
//             onChange={handleChange}
//             label="Select News Category"
//           >
//             <MenuItem value="current">Current Affairs</MenuItem>
//             <MenuItem value="sports">Sports</MenuItem>
//             <MenuItem value="business">Business</MenuItem>
//             <MenuItem value="entertainment">Entertainment</MenuItem>
//             <MenuItem value="technology">Technology</MenuItem>
//             <MenuItem value="health">Health & Wellness</MenuItem>
//           </Select>
//         </FormControl>

//         {/* Video Switch */}
//         <FormControlLabel
//           control={
//             <Switch
//               name="hasVideo"
//               checked={formData.hasVideo}
//               onChange={handleChange}
//               color="primary"
//             />
//           }
//           label="Includes Video Content"
//           sx={{ mb: 3, display: 'block' }}
//         />

//         {/* Primary Image */}
//         <Typography variant="subtitle1" sx={{ mb: 1 }}>Primary Image</Typography>
//         <Button
//           variant="outlined"
//           component="label"
//           sx={{ mb: 3 }}
//         >
//           Upload File
//           <input
//             type="file"
//             name="primaryImage"
//             hidden
//             onChange={handleFileChange}
//           />
//         </Button>

//         {/* Attachments */}
//         <Typography variant="subtitle1" sx={{ mb: 1 }}>Attachments</Typography>
//         <Button
//           variant="outlined"
//           component="label"
//           sx={{ mb: 3 }}
//         >
//           Upload File
//           <input
//             type="file"
//             name="attachments"
//             hidden
//             multiple
//             onChange={handleFileChange}
//           />
//         </Button>

//         {/* Private URL */}
//         <Typography variant="subtitle1" sx={{ mb: 1 }}>Private URL</Typography>
//         <TextField
//           fullWidth
//           name="privateUrl"
//           value={formData.privateUrl}
//           onChange={handleChange}
//           placeholder="https://bluewheelers.opcentral.com.au/#/news/article/reference/2ed948"
//           sx={{ mb: 3 }}
//         />

//         {/* Featured Article */}
//         <FormControlLabel
//           control={
//             <Switch
//               name="featured"
//               checked={formData.featured}
//               onChange={handleChange}
//             />
//           }
//           label="Featured Article"
//           sx={{ mb: 2, display: 'block' }}
//         />

//         {/* Auto Archive */}
//         <FormControlLabel
//           control={
//             <Switch
//               name="autoArchive"
//               checked={formData.autoArchive}
//               onChange={handleChange}
//             />
//           }
//           label="Auto Archive"
//           sx={{ mb: 3, display: 'block' }}
//         />

//         {/* Status (Edit Mode Only) */}
//         {isEditMode && (
//           <>
//             <Typography variant="subtitle1" sx={{ mb: 1 }}>Status</Typography>
//             <FormControl fullWidth sx={{ mb: 3 }}>
//               <InputLabel>Status</InputLabel>
//               <Select
//                 name="status"
//                 value={formData.status}
//                 onChange={handleChange}
//                 label="Status"
//               >
//                 <MenuItem value="draft">Draft</MenuItem>
//                 <MenuItem value="published">Published</MenuItem>
//                 <MenuItem value="archived">Archived</MenuItem>
//               </Select>
//             </FormControl>
//           </>
//         )}

//         {/* Submit Button */}
//         <Button
//           type="submit"
//           variant="contained"
//           color="primary"
//           fullWidth
//           size="large"
//           disabled={isLoading}
//           startIcon={isLoading ? <CircularProgress size={20} /> : null}
//         >
//           {isEditMode ? "Update Article" : "Create Article"}
//         </Button>
//       </Paper>
//     </Box>
//   );
// };

// export default NewsArticleForm;

// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import MDEditor from "@uiw/react-md-editor";
// import {
//   Box, TextField, FormControl, InputLabel, Select, MenuItem,
//   Switch, FormControlLabel, Button, Typography,
//   Paper, Divider, Alert, CircularProgress, IconButton, Stack,
//   Chip
// } from "@mui/material";
// import {
//   FormatBold as FormatBoldIcon,
//   FormatUnderlined as FormatUnderlinedIcon,
//   FormatListNumbered as FormatListNumberedIcon,
//   FormatListBulleted as FormatListBulletedIcon,
//   FormatQuote as FormatQuoteIcon,
//   Link as LinkIcon,
//   Image as ImageIcon
// } from "@mui/icons-material";
// import { httpClient } from "../../../utils/httpClientSetup";

// const NewsArticleForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const isEditMode = Boolean(id);
  
//   const [formData, setFormData] = useState({
//     title: "",
//     slug: "",
//     content: "",
//     categories: [],
//     pinned: false,
//     featured: false,
//     status: "draft",
//     schedule: "",
//     videos: [], // array to hold video objects
//   });

//   const [showVideosSection, setShowVideosSection] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!isEditMode) return;

//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         const response = await httpClient.get(`news/${id}`);
//         if (response.data.success) {
//           const { data } = response.data;
//           setFormData({
//             title: data.title || "",
//             slug: data.slug || "",
//             content: data.content || "",
//             categories: data.categories || [],
//             pinned: data.pinned === 1,
//             featured: data.featured === 1,
//             status: data.status || "draft",
//             schedule: data.schedule || "",
//             videos: Array.isArray(data.videos) ? data.videos : [],
//           });
//           setShowVideosSection((data.videos?.length ?? 0) > 0);
//         }
//       } catch (error) {
//         setError(error.response?.data?.message || "Failed to load article");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [id, isEditMode]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value
//     }));
//   };

//   const handleCategoryChange = (e) => {
//     const { value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       categories: typeof value === "string" ? value.split(",") : value,
//     }));
//   };

//   const handleVideoUpload = (e) => {
//     const files = e.target.files;
//     if (!files.length) return;
    
//     const newVideos = Array.from(files).map(file => ({
//       name: file.name,
//       type: file.type,
//       size: file.size,
//       // You might want to upload the file and store the URL instead
//       url: URL.createObjectURL(file)
//     }));
    
//     setFormData(prev => ({
//       ...prev,
//       videos: [...prev.videos, ...newVideos],
//     }));
//   };

//   const toggleVideosSection = (e) => {
//     setShowVideosSection(e.target.checked);
//     if (!e.target.checked) {
//       setFormData(prev => ({ ...prev, videos: [] }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);

//     try {
//       const payload = {
//         title: formData.title,
//         // slug: formData.slug,
//         content: formData.content,
//         // categories: formData.categories,
//         pinned: formData.pinned ? 1 : 0,
//         featured: formData.featured ? 1 : 0,
//         status: formData.status,
//         // schedule: formData.schedule || null,
//         videos: showVideosSection ? formData.videos.map(v => v.url) : [],
//       };

//       const response = isEditMode
//         ? await httpClient.put(`news/${id}`, payload)
//         : await httpClient.post("news", payload);

//       if (response.data.success) {
//         navigate(`/manage/newsarticle/${response.data.data.id}/details`);
//       } else {
//         setError(response.data.message || "Validation failed");
//       }
//     } catch (error) {
//       setError(error.response?.data?.message || "Failed to save article");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Box 
//       component="form" 
//       onSubmit={handleSubmit}
//       sx={{
//         maxWidth: '70%',
//         margin: '0 auto',
//         '@media (max-width: 900px)': { maxWidth: '90%' }
//       }}
//     >
//       <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
//         {isEditMode ? "Edit News Article" : "Create New Article"}
//       </Typography>

//       {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

//       <Paper elevation={3} sx={{ p: 3 }}>
//         <Typography variant="h6" sx={{ mb: 2 }}>DETAILS</Typography>
//         <Divider sx={{ mb: 3 }} />

//         {/* Title */}
//         <TextField
//           fullWidth
//           label="Title *"
//           name="title"
//           value={formData.title}
//           onChange={handleChange}
//           required
//           sx={{ mb: 3 }}
//         />

//         {/* Slug */}
//         <TextField
//           fullWidth
//           label="Slug *"
//           name="slug"
//           value={formData.slug}
//           onChange={handleChange}
//           required
//           sx={{ mb: 3 }}
//           helperText="URL-friendly version of the title"
//         />

//         {/* Content */}
//         <Typography variant="subtitle2" sx={{ mb: 1 }}>Content *</Typography>
//         <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
//           <IconButton size="small"><FormatBoldIcon fontSize="small" /></IconButton>
//           <IconButton size="small"><FormatUnderlinedIcon fontSize="small" /></IconButton>
//           <IconButton size="small"><FormatListNumberedIcon fontSize="small" /></IconButton>
//           <IconButton size="small"><FormatListBulletedIcon fontSize="small" /></IconButton>
//           <IconButton size="small"><FormatQuoteIcon fontSize="small" /></IconButton>
//           <IconButton size="small"><LinkIcon fontSize="small" /></IconButton>
//           <IconButton size="small"><ImageIcon fontSize="small" /></IconButton>
//         </Stack>
//         <MDEditor
//           value={formData.content}
//           onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
//           height={400}
//           sx={{ mb: 3 }}
//         />

//         {/* Categories */}
//         <Typography variant="subtitle1" sx={{ mb: 1, mt: 3 }}>News Categories</Typography>
//         <FormControl fullWidth sx={{ mb: 2 }}>
//           <InputLabel id="categories-label">Select News Categories</InputLabel>
//           <Select
//             labelId="categories-label"
//             name="categories"
//             multiple
//             value={formData.categories}
//             onChange={handleCategoryChange}
//             label="Select News Categories"
//             renderValue={(selected) => (
//               <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                 {selected.map((value) => (
//                   <Chip key={value} label={value} />
//                 ))}
//               </Box>
//             )}
//           >
//             <MenuItem value="current">Current Affairs</MenuItem>
//             <MenuItem value="sports">Sports</MenuItem>
//             <MenuItem value="business">Business</MenuItem>
//             <MenuItem value="entertainment">Entertainment</MenuItem>
//             <MenuItem value="technology">Technology</MenuItem>
//             <MenuItem value="health">Health & Wellness</MenuItem>
//           </Select>
//         </FormControl>

//         {/* Pinned */}
//         <FormControlLabel
//           control={
//             <Switch
//               name="pinned"
//               checked={formData.pinned}
//               onChange={handleChange}
//             />
//           }
//           label="Pinned Article"
//           sx={{ mb: 2, display: 'block' }}
//         />

//         {/* Featured */}
//         <FormControlLabel
//           control={
//             <Switch
//               name="featured"
//               checked={formData.featured}
//               onChange={handleChange}
//             />
//           }
//           label="Featured Article"
//           sx={{ mb: 3, display: 'block' }}
//         />

//         {/* Videos toggle */}
//         <FormControlLabel
//           control={
//             <Switch
//               checked={showVideosSection}
//               onChange={toggleVideosSection}
//             />
//           }
//           label="Add Videos"
//           sx={{ mb: 3 }}
//         />

//         {/* Videos upload section */}
//         {showVideosSection && (
//           <Box sx={{ mb: 3 }}>
//             <input
//               type="file"
//               multiple
//               accept="video/*"
//               onChange={handleVideoUpload}
//               style={{ marginBottom: 8 }}
//             />
//             <Stack direction="row" spacing={1} flexWrap="wrap">
//               {formData.videos.map((video, idx) => (
//                 <Chip
//                   key={idx}
//                   label={video.name || video.url || `Video ${idx + 1}`}
//                   onDelete={() => {
//                     setFormData(prev => ({
//                       ...prev,
//                       videos: prev.videos.filter((_, i) => i !== idx)
//                     }));
//                   }}
//                   sx={{ mb: 1 }}
//                 />
//               ))}
//             </Stack>
//           </Box>
//         )}

//         {/* Schedule */}
//         <TextField
//           fullWidth
//           label="Schedule Date"
//           type="datetime-local"
//           name="schedule"
//           value={formData.schedule || ""}
//           onChange={handleChange}
//           InputLabelProps={{ shrink: true }}
//           sx={{ mb: 3 }}
//         />

//         {/* Status */}
//         <Typography variant="subtitle1" sx={{ mb: 1 }}>Status</Typography>
//         <FormControl fullWidth sx={{ mb: 3 }}>
//           <InputLabel>Status</InputLabel>
//           <Select
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//             label="Status"
//           >
//             <MenuItem value="draft">Draft</MenuItem>
//             <MenuItem value="published">Published</MenuItem>
//             <MenuItem value="archived">Archived</MenuItem>
//           </Select>
//         </FormControl>

//         {/* Submit */}
//         <Button
//           type="submit"
//           variant="contained"
//           color="primary"
//           fullWidth
//           size="large"
//           disabled={isLoading}
//           startIcon={isLoading ? <CircularProgress size={20} /> : null}
//         >
//           {isEditMode ? "Update Article" : "Create Article"}
//         </Button>
//       </Paper>
//     </Box>
//   );
// };

// export default NewsArticleForm;


// **********************************************
// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import MDEditor from "@uiw/react-md-editor";
// import slugify from "slugify";
// import {
//   Box, TextField, FormControl, InputLabel, Select, MenuItem,
//   Switch, FormControlLabel, Button, Typography,
//   Paper, Divider, Alert, CircularProgress, IconButton, Stack,
//   Chip, Snackbar, Autocomplete
// } from "@mui/material";
// import {
//   FormatBold as FormatBoldIcon,
//   FormatUnderlined as FormatUnderlinedIcon,
//   FormatListNumbered as FormatListNumberedIcon,
//   FormatListBulleted as FormatListBulletedIcon,
//   FormatQuote as FormatQuoteIcon,
//   Link as LinkIcon,
//   Image as ImageIcon,
//   CheckCircleOutline,
//   ErrorOutline
// } from "@mui/icons-material";
// import { httpClient } from "../../../utils/httpClientSetup";
// import { useAuth } from "../../../context/AuthContext"

// const NewsArticleForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const isEditMode = Boolean(id);
  
//   const [formData, setFormData] = useState({
//     title: "",
//     slug: "",
//     content: "",
//     categories: [],
//     displayCategories: [],
//     pinned: false,
//     featured: false,
//     status: "draft",
//     schedule: "",
//     videos: [],
//   });

//   const [categories, setCategories] = useState([]);
//   const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
//   const [isSlugManual, setIsSlugManual] = useState(false);
//   const [showVideosSection, setShowVideosSection] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success"
//   });

//   const fetchCategories = async () => {
//     setIsCategoriesLoading(true);
//     try {
//       const response = await httpClient.get("categories/list");
//       if (response.data.success) {
//         setCategories(response.data.data.map(c => ({ id: c.id, title: c.title })));
//       }
//     } catch (error) {
//       showSnackbar("Failed to load categories", "error");
//     } finally {
//       setIsCategoriesLoading(false);
//     }
//   };

//   // Fetch categories on component mount
//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     if (!isSlugManual && formData.title) {
//       setFormData(prev => ({
//         ...prev,
//         slug: slugify(prev.title, { lower: true, strict: true, trim: true })
//       }));
//     }
//   }, [formData.title, isSlugManual]);

//   useEffect(() => {
//     if (!isEditMode) return;

//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         const response = await httpClient.get(`news/${id}`);
//         if (response.data.success) {
//           const { data } = response.data;
          
//           setFormData({
//             title: data.title || "",
//             slug: data.slug || "",
//             content: data.content || "",
//             categories: data.categories || [],
//             displayCategories: data.categories
//               .map(id => categories.find(c => c.id === id))
//               .filter(Boolean),
//             pinned: data.pinned === 1,
//             featured: data.featured === 1,
//             status: data.status || "draft",
//             schedule: data.schedule || "",
//             videos: Array.isArray(data.videos) ? data.videos : [],
//           });
//           setShowVideosSection((data.videos?.length ?? 0) > 0);
//           setIsSlugManual(true);
//         }
//       } catch (error) {
//         setError(error.response?.data?.message || "Failed to load article");
//         showSnackbar(error.response?.data?.message || "Failed to load article", "error");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [id, isEditMode, categories]);

//   const handleCategoryChange = (event, newValue) => {
//     setFormData(prev => ({
//       ...prev,
//       displayCategories: newValue,
//       categories: newValue.map(item => item.id)
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);

//     try {
//       const payload = {
//         title: formData.title,
//         slug: formData.slug,
//         content: formData.content,
//         categories: formData.categories,
//         pinned: formData.pinned ? 1 : 0,
//         featured: formData.featured ? 1 : 0,
//         status: formData.schedule ? "draft" : formData.status,
//         company_id: user.company_id
//       };

//       const response = isEditMode
//         ? await httpClient.put(`news/${id}`, payload)
//         : await httpClient.post("news", payload);

//       if (response.data.success) {
//         showSnackbar(
//           isEditMode ? "Article updated" : 
//           formData.schedule ? "Article scheduled" : "Article published",
//           "success"
//         );
//         setTimeout(() => navigate("/manage/news"), 1500);
//       }
//     } catch (error) {
//       setError(error.response?.data?.message || "Failed to save article");
//       showSnackbar(error.response?.data?.message || "Failed to save article", "error");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const showSnackbar = (message, severity) => {
//     setSnackbar({ open: true, message, severity });
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar(prev => ({ ...prev, open: false }));
//   };

//   return (
//     <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: '70%', margin: '0 auto', '@media (max-width: 900px)': { maxWidth: '90%' }}}>
//       <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
//         {isEditMode ? "Edit News Article" : "Create New Article"}
//       </Typography>

//       {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

//       <Paper elevation={3} sx={{ p: 3 }}>
//         <Typography variant="h6" sx={{ mb: 2 }}>DETAILS</Typography>
//         <Divider sx={{ mb: 3 }} />

//         <TextField
//           fullWidth
//           label="Title *"
//           value={formData.title}
//           onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
//           required
//           sx={{ mb: 3 }}
//         />

//         <Box sx={{ mb: 3 }}>
//           <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
//             <Typography variant="subtitle2">Slug *</Typography>
//             {isSlugManual && (
//               <Button size="small" onClick={() => setIsSlugManual(false)} sx={{ textTransform: 'none' }}>
//                 Reset to auto-generated
//               </Button>
//             )}
//           </Box>
//           <TextField
//             fullWidth
//             value={formData.slug}
//             onChange={(e) => {
//               setFormData(prev => ({ ...prev, slug: e.target.value }));
//               setIsSlugManual(true);
//             }}
//             required
//             helperText="URL-friendly version of the title"
//           />
//         </Box>

//         <Typography variant="subtitle2" sx={{ mb: 1 }}>Content *</Typography>
//         <MDEditor
//           value={formData.content}
//           onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
//           height={400}
//           preview="edit"
//           visibleDragbar={false}
//           style={{ border: '1px solid #ddd', borderRadius: '4px', marginBottom: '24px' }}
//         />

//         <Typography variant="subtitle1" sx={{ mb: 1 }}>News Categories</Typography>
//         <Autocomplete
//           multiple
//           options={categories}
//           getOptionLabel={(option) => option.title}
//           value={formData.displayCategories}
//           onChange={handleCategoryChange}
//           loading={isCategoriesLoading}
//           isOptionEqualToValue={(option, value) => option.id === value.id}
//           renderInput={(params) => (
//             <TextField {...params} label="Select categories" placeholder="Start typing to search categories" />
//           )}
//           renderTags={(value, getTagProps) =>
//             value.map((option, index) => (
//               <Chip label={option.title} {...getTagProps({ index })} key={option.id} />
//             ))
//           }
//           sx={{ mb: 3 }}
//         />

//         <FormControlLabel
//           control={<Switch checked={formData.pinned} onChange={(e) => setFormData(prev => ({ ...prev, pinned: e.target.checked }))} />}
//           label="Pinned Article"
//           sx={{ mb: 2, display: 'block' }}
//         />

//         <FormControlLabel
//           control={<Switch checked={formData.featured} onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))} />}
//           label="Featured Article"
//           sx={{ mb: 3, display: 'block' }}
//         />

//         <TextField
//           fullWidth
//           label="Schedule Date"
//           type="datetime-local"
//           value={formData.schedule || ""}
//           onChange={(e) => {
//             setFormData(prev => ({ ...prev, schedule: e.target.value, status: e.target.value ? "draft" : prev.status }));
//           }}
//           InputLabelProps={{ shrink: true }}
//           sx={{ mb: 3 }}
//         />

//         <FormControl fullWidth sx={{ mb: 3 }}>
//           <InputLabel>Status</InputLabel>
//           <Select
//             value={formData.status}
//             onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
//             label="Status"
//             disabled={!!formData.schedule}
//           >
//             <MenuItem value="draft">Draft</MenuItem>
//             <MenuItem value="published">Published</MenuItem>
//             <MenuItem value="archived">Archived</MenuItem>
//           </Select>
//           {formData.schedule && (
//             <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
//               Status will automatically change to "Published" on the scheduled date
//             </Typography>
//           )}
//         </FormControl>

//         <Button
//           type="submit"
//           variant="contained"
//           color="primary"
//           fullWidth
//           size="large"
//           disabled={isLoading}
//           startIcon={isLoading ? <CircularProgress size={20} /> : null}
//         >
//           {isEditMode ? "Update Article" : formData.schedule ? "Schedule Article" : "Publish Article"}
//         </Button>
//       </Paper>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={2000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <Alert 
//           onClose={handleCloseSnackbar} 
//           severity={snackbar.severity}
//           sx={{ width: '100%' }}
//           variant= "filled"
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default NewsArticleForm;



// video section added 
// src/pages/manage/news/NewsArticleForm.jsx
// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import MDEditor from "@uiw/react-md-editor";
// import slugify from "slugify";
// import {
//   Box, TextField, FormControl, InputLabel, Select, MenuItem,
//   Switch, FormControlLabel, Button, Typography,
//   Paper, Divider, Alert, CircularProgress, IconButton, Stack,
//   Chip, Snackbar, Autocomplete
// } from "@mui/material";
// import {
//   FormatBold as FormatBoldIcon,
//   FormatUnderlined as FormatUnderlinedIcon,
//   FormatListNumbered as FormatListNumberedIcon,
//   FormatListBulleted as FormatListBulletedIcon,
//   FormatQuote as FormatQuoteIcon,
//   Link as LinkIcon,
//   Image as ImageIcon,
//   CheckCircleOutline,
//   ErrorOutline,
//   Add as AddIcon,
//   Delete as DeleteIcon,
// } from "@mui/icons-material";
// import { httpClient } from "../../../utils/httpClientSetup";
// import { useAuth } from "../../../context/AuthContext";
// import VideoModal from "./VideoModal";

// const NewsArticleForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const isEditMode = Boolean(id);
  
//   const [formData, setFormData] = useState({
//     title: "",
//     slug: "",
//     content: "",
//     categories: [],
//     displayCategories: [],
//     pinned: false,
//     featured: false,
//     status: "draft",
//     schedule: "",
//     videos: [],
//   });

//   const [categories, setCategories] = useState([]);
//   const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
//   const [isSlugManual, setIsSlugManual] = useState(false);
//   const [showVideosSection, setShowVideosSection] = useState(false); // switch off by default
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success"
//   });

//   const [videoModalOpen, setVideoModalOpen] = useState(false);

//   const fetchCategories = async () => {
//     setIsCategoriesLoading(true);
//     try {
//       const response = await httpClient.get("categories/list");
//       if (response.data.success) {
//         setCategories(response.data.data.map(c => ({ id: c.id, title: c.title })));
//       }
//     } catch (error) {
//       showSnackbar("Failed to load categories", "error");
//     } finally {
//       setIsCategoriesLoading(false);
//     }
//   };

//   // Fetch categories on component mount
//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     if (!isSlugManual && formData.title) {
//       setFormData(prev => ({
//         ...prev,
//         slug: slugify(prev.title, { lower: true, strict: true, trim: true })
//       }));
//     }
//   }, [formData.title, isSlugManual]);

//   useEffect(() => {
//     if (!isEditMode) return;

//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         const response = await httpClient.get(`news/${id}`);
        
//         if (response.data.success) {
//           const { data } = response.data;

//           // Normalize incoming videos (ensure shape the modal/list understands)
//           const normalizedVideos = Array.isArray(data.videos)
//             ? data.videos.map(v => ({
//                 type: v.type ?? "upload",
//                 title: v.title ?? "",
//                 description: v.description ?? "",
//                 reference_url: v.reference_url ?? v.url ?? v.path ?? "",
//                 file: null, // never hydrate file from server response
//               }))
//             : [];

//           setFormData({
//             title: data.title || "",
//             slug: data.slug || "",
//             content: data.content || "",
//             categories: data.categories || [],
//             displayCategories: (data.categories || [])
//               .map(cid => categories.find(c => c.id === cid))
//               .filter(Boolean),
//             pinned: data.pinned === 1,
//             featured: data.featured === 1,
//             status: data.status || "draft",
//             schedule: data.schedule || "",
//             videos: normalizedVideos,
//           });
//           setShowVideosSection((normalizedVideos?.length ?? 0) > 0);
//           setIsSlugManual(true);
//         }
//       } catch (error) {
//         setError(error.response?.data?.message || "Failed to load article");
//         showSnackbar(error.response?.data?.message || "Failed to load article", "error");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [id, isEditMode, categories]);

//   const handleCategoryChange = (event, newValue) => {
//     setFormData(prev => ({
//       ...prev,
//       displayCategories: newValue,
//       categories: newValue.map(item => item.id)
//     }));
//   };

//   const handleAddVideo = (video) => {
//     setFormData(prev => ({
//       ...prev,
//       videos: [...prev.videos, video],
//     }));
//     if (!showVideosSection) setShowVideosSection(true);
//   };

//   const handleDeleteVideo = (idx) => {
//     setFormData(prev => ({
//       ...prev,
//       videos: prev.videos.filter((_, i) => i !== idx),
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);

//     try {
//       // Build FormData to support files + text and match your API schema
//       const fd = new FormData();

//       fd.append("title", formData.title);
//       fd.append("slug", formData.slug);
//       fd.append("content", formData.content);
//       formData.categories.forEach((cid, i) => fd.append(`categories[${i}]`, cid));
//       fd.append("pinned", formData.pinned ? 1 : 0);
//       fd.append("featured", formData.featured ? 1 : 0);
//       fd.append("status", formData.schedule ? "draft" : formData.status);
//       fd.append("company_id", user.company_id);
//       if (formData.schedule) fd.append("schedule", formData.schedule);

//       // Only include videos if the section is on and there are entries
//       if (showVideosSection && formData.videos.length > 0) {
//         formData.videos.forEach((v, i) => {
//           fd.append(`videos[${i}][type]`, v.type);
//           fd.append(`videos[${i}][title]`, v.title);
//           // API rules:
//           // - If type=upload, send file OR reference_url (required_without each other)
//           // - If youtube/vimeo, send reference_url
//           if (v.type === "upload") {
//             if (v.file) {
//               fd.append(`videos[${i}][file]`, v.file);
//             }
//             if (v.reference_url) {
//               fd.append(`videos[${i}][reference_url]`, v.reference_url);
//             }
//           } else {
//             if (v.reference_url) {
//               fd.append(`videos[${i}][reference_url]`, v.reference_url);
//             }
//           }
//           // NOTE: v.description collected but NOT sent since your schema doesn't require it
//         });
//       }

//       const config = { headers: { "Content-Type": "multipart/form-data" } };

//       const response = isEditMode
//         ? await httpClient.put(`news/${id}`, fd, config)
//         : await httpClient.post("news", fd, config);

//       if (response.data.success) {
//         showSnackbar(
//           isEditMode ? "Article updated" :
//           formData.schedule ? "Article scheduled" : "Article published",
//           "success"
//         );
//         setTimeout(() => navigate("/manage/news"), 1500);
//       }
//     } catch (error) {
//       setError(error.response?.data?.message || "Failed to save article");
//       showSnackbar(error.response?.data?.message || "Failed to save article", "error");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const showSnackbar = (message, severity) => {
//     setSnackbar({ open: true, message, severity });
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar(prev => ({ ...prev, open: false }));
//   };

//   return (
//     <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: '70%', margin: '0 auto', '@media (max-width: 900px)': { maxWidth: '90%' }}}>
//       <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
//         {isEditMode ? "Edit News Article" : "Create New Article"}
//       </Typography>

//       {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

//       <Paper elevation={3} sx={{ p: 3 }}>
//         <Typography variant="h6" sx={{ mb: 2 }}>DETAILS</Typography>
//         <Divider sx={{ mb: 3 }} />

//         <TextField
//           fullWidth
//           label="Title *"
//           value={formData.title}
//           onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
//           required
//           sx={{ mb: 3 }}
//         />

//         <Box sx={{ mb: 3 }}>
//           <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
//             <Typography variant="subtitle2">Slug *</Typography>
//             {isSlugManual && (
//               <Button size="small" onClick={() => setIsSlugManual(false)} sx={{ textTransform: 'none' }}>
//                 Reset to auto-generated
//               </Button>
//             )}
//           </Box>
//           <TextField
//             fullWidth
//             value={formData.slug}
//             onChange={(e) => {
//               setFormData(prev => ({ ...prev, slug: e.target.value }));
//               setIsSlugManual(true);
//             }}
//             required
//             helperText="URL-friendly version of the title"
//           />
//         </Box>

//         <Typography variant="subtitle2" sx={{ mb: 1 }}>Content *</Typography>
//         <MDEditor
//           value={formData.content}
//           onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
//           height={400}
//           preview="edit"
//           visibleDragbar={false}
//           style={{ border: '1px solid #ddd', borderRadius: '4px', marginBottom: '24px' }}
//         />

//         {/* News Categories (kept exactly as you had) */}
//         <Typography variant="subtitle1" sx={{ mb: 1 }}>News Categories</Typography>
//         <Autocomplete
//           multiple
//           options={categories}
//           getOptionLabel={(option) => option.title}
//           value={formData.displayCategories}
//           onChange={handleCategoryChange}
//           loading={isCategoriesLoading}
//           isOptionEqualToValue={(option, value) => option.id === value.id}
//           renderInput={(params) => (
//             <TextField {...params} label="Select categories" placeholder="Start typing to search categories" />
//           )}
//           renderTags={(value, getTagProps) =>
//             value.map((option, index) => (
//               <Chip label={option.title} {...getTagProps({ index })} key={option.id} />
//             ))
//           }
//           sx={{ mb: 3 }}
//         />

//         {/* VIDEOS — above Featured & Pinned, switch OFF by default */}
//         <Box sx={{ mb: 2 }}>
//           <FormControlLabel
//             control={
//               <Switch
//                 checked={showVideosSection}
//                 onChange={(e) => setShowVideosSection(e.target.checked)}
//               />
//             }
//             label="Include Videos"
//           />
//         </Box>

//         {showVideosSection && (
//           <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
//             <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
//               <Typography variant="subtitle1">Videos</Typography>
//               <Button
//                 variant="outlined"
//                 startIcon={<AddIcon />}
//                 onClick={() => setVideoModalOpen(true)}
//               >
//                 Add Video
//               </Button>
//             </Box>
//             <Divider sx={{ mb: 2 }} />
//             {formData.videos.length === 0 ? (
//               <Typography variant="body2" color="text.secondary">
//                 No videos added yet.
//               </Typography>
//             ) : (
//               <Stack spacing={1.5}>
//                 {formData.videos.map((v, idx) => (
//                   <Paper
//                     key={idx}
//                     sx={{ p: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}
//                     variant="outlined"
//                   >
//                     <Box sx={{ pr: 2, overflow: "hidden" }}>
//                       <Typography variant="subtitle2" noWrap title={v.title}>{v.title}</Typography>
//                       <Typography variant="caption" color="text.secondary">
//                         {v.type.toUpperCase()} •{" "}
//                         {v.type === "upload"
//                           ? (v.file?.name || v.reference_url || "File selected")
//                           : (v.reference_url || "-")}
//                       </Typography>
//                     </Box>
//                     <IconButton onClick={() => handleDeleteVideo(idx)} color="error" size="small">
//                       <DeleteIcon fontSize="small" />
//                     </IconButton>
//                   </Paper>
//                 ))}
//               </Stack>
//             )}
//           </Paper>
//         )}

//         {/* Featured / Pinned (stay below Videos as requested) */}
//         <FormControlLabel
//           control={<Switch checked={formData.pinned} onChange={(e) => setFormData(prev => ({ ...prev, pinned: e.target.checked }))} />}
//           label="Pinned Article"
//           sx={{ mb: 2, display: 'block' }}
//         />

//         <FormControlLabel
//           control={<Switch checked={formData.featured} onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))} />}
//           label="Featured Article"
//           sx={{ mb: 3, display: 'block' }}
//         />

//         <TextField
//           fullWidth
//           label="Schedule Date"
//           type="datetime-local"
//           value={formData.schedule || ""}
//           onChange={(e) => {
//             setFormData(prev => ({ ...prev, schedule: e.target.value, status: e.target.value ? "draft" : prev.status }));
//           }}
//           InputLabelProps={{ shrink: true }}
//           sx={{ mb: 3 }}
//         />

//         <FormControl fullWidth sx={{ mb: 3 }}>
//           <InputLabel>Status</InputLabel>
//           <Select
//             value={formData.status}
//             onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
//             label="Status"
//             disabled={!!formData.schedule}
//           >
//             <MenuItem value="draft">Draft</MenuItem>
//             <MenuItem value="published">Published</MenuItem>
//             <MenuItem value="archived">Archived</MenuItem>
//           </Select>
//           {formData.schedule && (
//             <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
//               Status will automatically change to "Published" on the scheduled date
//             </Typography>
//           )}
//         </FormControl>

//         <Button
//           type="submit"
//           variant="contained"
//           color="primary"
//           fullWidth
//           size="large"
//           disabled={isLoading}
//           startIcon={isLoading ? <CircularProgress size={20} /> : null}
//         >
//           {isEditMode ? "Update Article" : formData.schedule ? "Schedule Article" : "Publish Article"}
//         </Button>
//       </Paper>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={2000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <Alert 
//           onClose={handleCloseSnackbar} 
//           severity={snackbar.severity} 
//           sx={{ width: '100%' }}
//           variant= "filled"
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>

//       {/* Video modal */}
//       <VideoModal
//         open={videoModalOpen}
//         onClose={() => setVideoModalOpen(false)}
//         onSave={handleAddVideo}
//       />
//     </Box>
//   );
// };

// export default NewsArticleForm;
// ******************************************************
// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import MDEditor from "@uiw/react-md-editor";
// import slugify from "slugify";
// import {
//   Box, TextField, FormControl, InputLabel, Select, MenuItem,
//   Switch, FormControlLabel, Button, Typography,
//   Paper, Divider, Alert, CircularProgress, IconButton, Stack,
//   Chip, Snackbar, Autocomplete
// } from "@mui/material";
// import {
//   Add as AddIcon,
//   Delete as DeleteIcon,
// } from "@mui/icons-material";
// import { httpClient } from "../../../utils/httpClientSetup";
// import { useAuth } from "../../../context/AuthContext";
// import VideoModal from "./VideoModal";

// const NewsArticleForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const isEditMode = Boolean(id);

//   const [formData, setFormData] = useState({
//     title: "",
//     slug: "",
//     content: "",
//     categories: [],
//     displayCategories: [],
//     pinned: false,
//     featured: false,
//     primary_image: null,
//     featured_image: null,
//     status: "draft",
//     schedule: "",
//     videos: [],
//     attachments: [],
//   });

//   const [imageFiles, setImageFiles] = useState({
//     primary: null,
//     featured: null
//   });

//   const [videoFiles, setVideoFiles] = useState([]);
//   const [attachmentFiles, setAttachmentFiles] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
//   const [isSlugManual, setIsSlugManual] = useState(false);
//   const [showVideosSection, setShowVideosSection] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
//   const [videoModalOpen, setVideoModalOpen] = useState(false);

//   // Fetch categories
//   const fetchCategories = async () => {
//     setIsCategoriesLoading(true);
//     try {
//       const response = await httpClient.get("categories/list");
//       if (response.data.success) {
//         setCategories(response.data.data.map(c => ({ id: c.id, title: c.title })));
//       }
//     } catch (error) {
//       showSnackbar("Failed to load categories", "error");
//     } finally {
//       setIsCategoriesLoading(false);
//     }
//   };

//   useEffect(() => { fetchCategories(); }, []);

//   // Auto-generate slug
//   useEffect(() => {
//     if (!isSlugManual && formData.title) {
//       setFormData(prev => ({ ...prev, slug: slugify(prev.title, { lower: true, strict: true, trim: true }) }));
//     }
//   }, [formData.title, isSlugManual]);

//   // Format date for datetime-local input
//   const formatDateForInput = (dateString) => {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     return date.toISOString().slice(0, 16);
//   };

//   // Format date for API (Y-m-d H:i:s)
//   const formatDateForAPI = (dateString) => {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     const pad = (n) => n.toString().padStart(2, '0');
//     return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
//   };

//   // Fetch article data in edit mode
//   useEffect(() => {
//     if (!isEditMode) return;

//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         const response = await httpClient.get(`news/${id}`);
//         if (response.data.success) {
//           const data = response.data.data;

//           const normalizedVideos = Array.isArray(data.videos)
//             ? data.videos.map(v => ({
//                 id: v.id,
//                 type: v.type ?? "upload",
//                 title: v.title ?? "",
//                 reference_url: v.reference_url ?? v.url ?? v.path ?? "",
//                 // Store file information if available
//                 file: v.file || null
//               }))
//             : [];

//           setFormData({
//             title: data.title || "",
//             slug: data.slug || "",
//             content: data.content || "",
//             categories: data.categories || [],
//             displayCategories: (data.categories || []).map(cid => categories.find(c => c.id === cid)).filter(Boolean),
//             pinned: data.pinned === 1,
//             featured: data.featured === 1,
//             primary_image: data.primary_image || null,
//             featured_image: data.featured_image || null,
//             status: data.status || "draft",
//             schedule: formatDateForInput(data.schedule),
//             videos: normalizedVideos,
//             attachments: data.attachments || [],
//           });
//           setShowVideosSection((normalizedVideos?.length ?? 0) > 0);
//           setIsSlugManual(true);
//         }
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to load article");
//         showSnackbar(err.response?.data?.message || "Failed to load article", "error");
//       } finally { setIsLoading(false); }
//     };

//     fetchData();
//   }, [id, isEditMode, categories]);

//   const handleCategoryChange = (event, newValue) => {
//     setFormData(prev => ({
//       ...prev,
//       displayCategories: newValue,
//       categories: newValue.map(item => item.id)
//     }));
//   };

//   const handleAddVideo = (video) => {
//     // If it's an uploaded video file, add it to videoFiles state
//     if (video.file) {
//       setVideoFiles(prev => [...prev, video.file]);
//       // Create a reference URL for preview if needed
//       video.reference_url = URL.createObjectURL(video.file);
//     }
    
//     setFormData(prev => ({ ...prev, videos: [...prev.videos, video] }));
//     if (!showVideosSection) setShowVideosSection(true);
//   };

//   const handleDeleteVideo = (idx) => {
//     // Remove the associated file if it exists
//     if (formData.videos[idx].file) {
//       setVideoFiles(prev => prev.filter((_, i) => i !== idx));
//     }
//     setFormData(prev => ({ ...prev, videos: prev.videos.filter((_, i) => i !== idx) }));
//   };

//   // Handle image file selection
//   const handleImageFileSelect = (e, type) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // Create a preview URL for the image
//     const previewUrl = URL.createObjectURL(file);
    
//     setImageFiles(prev => ({ ...prev, [type]: file }));
    
//     setFormData(prev => ({
//       ...prev,
//       [type === "primary" ? "primary_image" : "featured_image"]: previewUrl,
//     }));
//   };

//   // Handle attachment file selection
//   const handleAttachmentSelect = (e) => {
//     const files = Array.from(e.target.files);
//     if (!files.length) return;

//     const newAttachments = files.map(file => ({
//       file,
//       name: file.name,
//       size: file.size,
//       type: file.type,
//       // For existing attachments in edit mode, we keep the URL
//       url: URL.createObjectURL(file),
//       isNew: true
//     }));

//     setAttachmentFiles(prev => [...prev, ...newAttachments]);
    
//     setFormData(prev => ({
//       ...prev,
//       attachments: [...prev.attachments, ...newAttachments],
//     }));
//   };

//   // Delete attachment
//   const handleDeleteAttachment = (idx) => {
//     setAttachmentFiles(prev => prev.filter((_, i) => i !== idx));
//     setFormData(prev => ({ 
//       ...prev, 
//       attachments: prev.attachments.filter((_, i) => i !== idx) 
//     }));
//   };

//   // Form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);

//     try {
//       // Format schedule date for API in Y-m-d H:i:s format
//       const formattedSchedule = formData.schedule 
//         ? formatDateForAPI(formData.schedule)
//         : "";

//       // Create FormData for the request (must use multipart/form-data for files)
//       const formDataObj = new FormData();
      
//       // Append all form fields
//       formDataObj.append("title", formData.title);
//       formDataObj.append("slug", formData.slug);
//       formDataObj.append("content", formData.content);
//       formDataObj.append("pinned", formData.pinned ? 1 : 0);
//       formDataObj.append("featured", formData.featured ? 1 : 0);
//       formDataObj.append("status", formData.schedule ? "draft" : formData.status);
//       formDataObj.append("company_id", user.company_id);
      
//       if (formData.schedule) {
//         formDataObj.append("schedule", formattedSchedule);
//       }
      
//       // Append categories
//       formData.categories.forEach(categoryId => {
//         formDataObj.append("categories[]", categoryId);
//       });
      
//       // Append images if they are new files
//       if (imageFiles.primary) {
//         formDataObj.append("primary_image", imageFiles.primary);
//       } else if (formData.primary_image && typeof formData.primary_image === "string") {
//         // If it's an existing image URL, pass it as is
//         formDataObj.append("primary_image_url", formData.primary_image);
//       }
      
//       if (formData.featured && imageFiles.featured) {
//         formDataObj.append("featured_image", imageFiles.featured);
//       } else if (formData.featured && formData.featured_image && typeof formData.featured_image === "string") {
//         // If it's an existing featured image URL, pass it as is
//         formDataObj.append("featured_image_url", formData.featured_image);
//       }
      
//       // Append videos - handle both URL references and file uploads
//       if (showVideosSection) {
//         formData.videos.forEach((video, index) => {
//           formDataObj.append(`videos[${index}][type]`, video.type);
//           formDataObj.append(`videos[${index}][title]`, video.title);
          
//           if (video.type === "upload" && video.file) {
//             // Append the video file
//             formDataObj.append(`videos[${index}][file]`, video.file);
//           } else {
//             // Append the reference URL for external videos
//             formDataObj.append(`videos[${index}][reference_url]`, video.reference_url || "");
//           }
//         });
//       }
      
//       // Append attachments
//       attachmentFiles.forEach((attachment, index) => {
//         if (attachment.isNew) {
//           formDataObj.append(`attachments[${index}]`, attachment.file);
//         } else if (attachment.url) {
//           // For existing attachments, pass the URL
//           formDataObj.append(`attachment_urls[${index}]`, attachment.url);
//         }
//       });

//       // For edit mode, we need to handle the case where we're updating existing videos
//       // if (isEditMode) {
//       //   formDataObj.append("_method", "PUT"); // For Laravel or similar frameworks that need this
//       // }

//       // const config = { 
//       //   headers: { 
//       //     "Content-Type": "application/x-www-form-urlencoded",
//       //   } 
//       // };

//       //   const config = { 
//       //   headers: { 
//       //     "Content-Type": "application/x-www-form-urlencoded",
//       //   } 
//       // };

//       const endpoint = isEditMode ? `news/${id}` : "news";
//       const method = isEditMode ? "post" : "post";

//       const response = await httpClient[method](endpoint, formDataObj);

//       if (response.data.success) {
//         showSnackbar(
//           isEditMode ? "Article updated" : formData.schedule ? "Article scheduled" : "Article published",
//           "success"
//         );
//         setTimeout(() => navigate("/manage/news"), 1500);
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to save article");
//       showSnackbar(err.response?.data?.message || "Failed to save article", "error");
//     } finally { setIsLoading(false); }
//   };

//   const showSnackbar = (message, severity) => {
//     setSnackbar({ open: true, message, severity });
//   };
//   const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

//   if (isLoading) return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;

//   return (
//     <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: '70%', margin: '0 auto', '@media (max-width: 900px)': { maxWidth: '90%' } }}>
//       <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
//         {isEditMode ? "Edit News Article" : "Create New Article"}
//       </Typography>

//       {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

//       <Paper elevation={3} sx={{ p: 3 }}>
//         <Typography variant="h6" sx={{ mb: 2 }}>DETAILS</Typography>
//         <Divider sx={{ mb: 3 }} />

//         <TextField
//           fullWidth label="Title *"
//           value={formData.title}
//           onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
//           required sx={{ mb: 3 }}
//         />

//         <Box sx={{ mb: 3 }}>
//           <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
//             <Typography variant="subtitle2">Slug *</Typography>
//             {isSlugManual && (
//               <Button size="small" onClick={() => setIsSlugManual(false)} sx={{ textTransform: 'none' }}>
//                 Reset to auto-generated
//               </Button>
//             )}
//           </Box>
//           <TextField
//             fullWidth
//             value={formData.slug}
//             onChange={(e) => { setFormData(prev => ({ ...prev, slug: e.target.value })); setIsSlugManual(true); }}
//             required helperText="URL-friendly version of the title"
//           />
//         </Box>

//         {/* Primary Image Upload */}
//         <Box sx={{ mb: 3 }}>
//           <Typography variant="subtitle2" sx={{ mb: 1 }}>Primary Image</Typography>
//           <Button variant="outlined" component="label">
//             Upload Primary Image
//             <input type="file" hidden accept="image/*" onChange={(e) => handleImageFileSelect(e, "primary")} />
//           </Button>
//           {formData.primary_image && (
//             <Box mt={1}>
//               <img src={formData.primary_image} alt="Primary" width="180" style={{ borderRadius: 6, marginTop: 8 }} />
//             </Box>
//           )}
//         </Box>

//         {/* Featured Article Switch */}
//         <FormControlLabel 
//           control={
//             <Switch 
//               checked={formData.featured} 
//               onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))} 
//             />
//           } 
//           label="Featured Article" 
//           sx={{ mb: formData.featured ? 2 : 3, display: 'block' }} 
//         />
        
//         {/* Featured Image Upload - Only show when featured is enabled */}
//         {formData.featured && (
//           <Box sx={{ mb: 3 }}>
//             <Typography variant="subtitle2" sx={{ mb: 1 }}>Featured Banner Image</Typography>
//             <Button variant="outlined" component="label">
//               Upload Featured Banner
//               <input type="file" hidden accept="image/*" onChange={(e) => handleImageFileSelect(e, "featured")} />
//             </Button>
//             {formData.featured_image && (
//               <Box mt={1}>
//                 <img src={formData.featured_image} alt="Featured" width="180" style={{ borderRadius: 6, marginTop: 8 }} />
//               </Box>
//             )}
//           </Box>
//         )}

//         <Typography variant="subtitle2" sx={{ mb: 1 }}>Content *</Typography>
//         <MDEditor
//           value={formData.content}
//           onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
//           height={400} preview="edit" visibleDragbar={false}
//           style={{ border: '1px solid #ddd', borderRadius: '4px', marginBottom: '24px' }}
//         />

//         {/* Categories */}
//         <Typography variant="subtitle1" sx={{ mb: 1 }}>News Categories</Typography>
//         <Autocomplete
//           multiple
//           options={categories}
//           getOptionLabel={(option) => option.title}
//           value={formData.displayCategories}
//           onChange={handleCategoryChange}
//           loading={isCategoriesLoading}
//           isOptionEqualToValue={(option, value) => option.id === value.id}
//           renderInput={(params) => <TextField {...params} label="Select categories" placeholder="Start typing to search categories" />}
//           renderTags={(value, getTagProps) => value.map((option, index) => <Chip label={option.title} {...getTagProps({ index })} key={option.id} />)}
//           sx={{ mb: 3 }}
//         />

//         {/* Video Section */}
//         <Box sx={{ mb: 2 }}>
//           <FormControlLabel
//             control={<Switch checked={showVideosSection} onChange={(e) => setShowVideosSection(e.target.checked)} />}
//             label="Include Videos"
//           />
//         </Box>

//         {showVideosSection && (
//           <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
//             <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
//               <Typography variant="subtitle1">Videos</Typography>
//               <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setVideoModalOpen(true)}>Add Video</Button>
//             </Box>
//             <Divider sx={{ mb: 2 }} />
//             {formData.videos.length === 0 ? (
//               <Typography variant="body2" color="text.secondary">No videos added yet.</Typography>
//             ) : (
//               <Stack spacing={1.5}>
//                 {formData.videos.map((v, idx) => (
//                   <Paper key={idx} sx={{ p: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between" }} variant="outlined">
//                     <Box sx={{ pr: 2, overflow: "hidden" }}>
//                       <Typography variant="subtitle2" noWrap title={v.title}>{v.title}</Typography>
//                       <Typography variant="caption" color="text.secondary">
//                         {v.type.toUpperCase()} • {v.type === "upload" ? (v.file ? v.file.name : "File uploaded") : v.reference_url}
//                       </Typography>
//                     </Box>
//                     <IconButton onClick={() => handleDeleteVideo(idx)} color="error" size="small">
//                       <DeleteIcon fontSize="small" />
//                     </IconButton>
//                   </Paper>
//                 ))}
//               </Stack>
//             )}
//           </Paper>
//         )}

//         {/* Attachments Section */}
//         <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
//           <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
//             <Typography variant="subtitle1">Attachments</Typography>
//             <Button variant="outlined" component="label" startIcon={<AddIcon />}>
//               Add Attachment
//               <input type="file" hidden multiple onChange={handleAttachmentSelect} />
//             </Button>
//           </Box>
//           <Divider sx={{ mb: 2 }} />
//           {formData.attachments.length === 0 ? (
//             <Typography variant="body2" color="text.secondary">No attachments added yet.</Typography>
//           ) : (
//             <Stack spacing={1.5}>
//               {formData.attachments.map((attachment, idx) => (
//                 <Paper key={idx} sx={{ p: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between" }} variant="outlined">
//                   <Box sx={{ pr: 2, overflow: "hidden" }}>
//                     <Typography variant="subtitle2" noWrap title={attachment.name}>
//                       {attachment.name}
//                     </Typography>
//                     <Typography variant="caption" color="text.secondary">
//                       {attachment.type} • {Math.round(attachment.size / 1024)} KB
//                     </Typography>
//                   </Box>
//                   <IconButton onClick={() => handleDeleteAttachment(idx)} color="error" size="small">
//                     <DeleteIcon fontSize="small" />
//                   </IconButton>
//                 </Paper>
//               ))}
//             </Stack>
//           )}
//         </Paper>

//         <FormControlLabel control={<Switch checked={formData.pinned} onChange={(e) => setFormData(prev => ({ ...prev, pinned: e.target.checked }))} />} label="Pinned Article" sx={{ mb: 3, display: 'block' }} />

//         {/* Schedule */}
//         <TextField
//           fullWidth 
//           label="Schedule Date" 
//           type="datetime-local"
//           value={formData.schedule}
//           onChange={(e) => { 
//             setFormData(prev => ({ 
//               ...prev, 
//               schedule: e.target.value, 
//               status: e.target.value ? "draft" : prev.status 
//             })); 
//           }}
//           InputLabelProps={{ shrink: true }}
//           sx={{ mb: 3 }}
//         />

//         {/* Status */}
//         <FormControl fullWidth sx={{ mb: 3 }}>
//           <InputLabel>Status</InputLabel>
//           <Select
//             value={formData.status}
//             onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
//             label="Status"
//             disabled={!!formData.schedule}
//           >
//             <MenuItem value="draft">Draft</MenuItem>
//             <MenuItem value="published">Published</MenuItem>
//             <MenuItem value="archived">Archived</MenuItem>
//           </Select>
//           {formData.schedule && <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>Status will automatically change to "Published" on the scheduled date</Typography>}
//         </FormControl>

//         {/* Submit Button */}
//         <Button type="submit" variant="contained" color="primary" fullWidth size="large" disabled={isLoading} startIcon={isLoading ? <CircularProgress size={20} /> : null}>
//           {isEditMode ? "Update Article" : formData.schedule ? "Schedule Article" : "Publish Article"}
//         </Button>
//       </Paper>

//       <Snackbar open={snackbar.open} autoHideDuration={2000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
//         <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">{snackbar.message}</Alert>
//       </Snackbar>

//       <VideoModal open={videoModalOpen} onClose={() => setVideoModalOpen(false)} onSave={handleAddVideo} />
//     </Box>
//   );
// };

// export default NewsArticleForm;



// ********************************************************

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import slugify from "slugify";
import {
  Box, TextField, FormControl, InputLabel, Select, MenuItem,
  Switch, FormControlLabel, Button, Typography,
  Paper, Divider, Alert, CircularProgress, IconButton, Stack,
  Chip, Snackbar, Autocomplete, Collapse
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { httpClient } from "../../../utils/httpClientSetup";
import { useAuth } from "../../../context/AuthContext";
import VideoModal from "./VideoModal";

const NewsArticleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    categories: [],
    displayCategories: [],
    pinned: false,
    featured: false,
    primary_image: null,
    featured_image: null,
    status: "draft",
    schedule: "",
    videos: [],
    attachments: [],
  });

  const [imageFiles, setImageFiles] = useState({
    primary: null,
    featured: null
  });

  const [videoFiles, setVideoFiles] = useState([]);
  const [attachmentFiles, setAttachmentFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [showVideosSection, setShowVideosSection] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);

  // Fetch categories
  const fetchCategories = async () => {
    setIsCategoriesLoading(true);
    try {
      const response = await httpClient.get("categories/list");
      if (response.data.success) {
        setCategories(response.data.data.map(c => ({ id: c.id, title: c.title })));
      }
    } catch (error) {
      showSnackbar("Failed to load categories", "error");
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  // Auto-generate slug
  useEffect(() => {
    if (!isSlugManual && formData.title) {
      setFormData(prev => ({ ...prev, slug: slugify(prev.title, { lower: true, strict: true, trim: true }) }));
    }
  }, [formData.title, isSlugManual]);

  // Format date for datetime-local input
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  // Format date for API (Y-m-d H:i:s)
  const formatDateForAPI = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const pad = (n) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
  };

  // Fetch article data in edit mode
  useEffect(() => {
    if (!isEditMode) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await httpClient.get(`news/${id}`);
        if (response.data.success) {
          const data = response.data.data;

          const normalizedVideos = Array.isArray(data.videos)
            ? data.videos.map(v => ({
                id: v.id,
                type: v.type ?? "upload",
                title: v.title ?? "",
                reference_url: v.reference_url ?? v.url ?? v.path ?? "",
                // Store file information if available
                file: v.file || null
              }))
            : [];

          // Initialize archived and scheduled states
          const isArticleArchived = data.status === "archived";
          const hasSchedule = Boolean(data.schedule);
          
          setIsArchived(isArticleArchived);
          setIsScheduled(hasSchedule);

          setFormData({
            title: data.title || "",
            slug: data.slug || "",
            content: data.content || "",
            categories: data.categories || [],
            displayCategories: (data.categories || []).map(cid => categories.find(c => c.id === cid)).filter(Boolean),
            pinned: data.pinned === 1,
            featured: data.featured === 1,
            primary_image: data.primary_image || null,
            featured_image: data.featured_image || null,
            status: data.status || "draft",
            schedule: formatDateForInput(data.schedule),
            videos: normalizedVideos,
            attachments: data.attachments || [],
          });
          setShowVideosSection((normalizedVideos?.length ?? 0) > 0);
          setIsSlugManual(true);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load article");
        showSnackbar(err.response?.data?.message || "Failed to load article", "error");
      } finally { setIsLoading(false); }
    };

    fetchData();
  }, [id, isEditMode, categories]);

  const handleCategoryChange = (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      displayCategories: newValue,
      categories: newValue.map(item => item.id)
    }));
  };

  const handleAddVideo = (video) => {
    // If it's an uploaded video file, add it to videoFiles state
    if (video.file) {
      setVideoFiles(prev => [...prev, video.file]);
      // Create a reference URL for preview if needed
      video.reference_url = URL.createObjectURL(video.file);
    }
    
    setFormData(prev => ({ ...prev, videos: [...prev.videos, video] }));
    if (!showVideosSection) setShowVideosSection(true);
  };

  const handleDeleteVideo = (idx) => {
    // Remove the associated file if it exists
    if (formData.videos[idx].file) {
      setVideoFiles(prev => prev.filter((_, i) => i !== idx));
    }
    setFormData(prev => ({ ...prev, videos: prev.videos.filter((_, i) => i !== idx) }));
  };

  // Handle image file selection
  const handleImageFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create a preview URL for the image
    const previewUrl = URL.createObjectURL(file);
    
    setImageFiles(prev => ({ ...prev, [type]: file }));
    
    setFormData(prev => ({
      ...prev,
      [type === "primary" ? "primary_image" : "featured_image"]: previewUrl,
    }));
  };

  // Handle attachment file selection
  const handleAttachmentSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newAttachments = files.map(file => ({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      // For existing attachments in edit mode, we keep the URL
      url: URL.createObjectURL(file),
      isNew: true
    }));

    setAttachmentFiles(prev => [...prev, ...newAttachments]);
    
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments],
    }));
  };

  // Delete attachment
  const handleDeleteAttachment = (idx) => {
    setAttachmentFiles(prev => prev.filter((_, i) => i !== idx));
    setFormData(prev => ({ 
      ...prev, 
      attachments: prev.attachments.filter((_, i) => i !== idx) 
    }));
  };

  // Handle archived status change
  const handleArchivedChange = (e) => {
    const isArchived = e.target.checked;
    setIsArchived(isArchived);
    
    if (isArchived) {
      // If setting to archived, clear any schedule
      setIsScheduled(false);
      setFormData(prev => ({ 
        ...prev, 
        status: "archived",
        schedule: ""
      }));
    } else {
      // If unarchiving, set back to draft
      setFormData(prev => ({ ...prev, status: "draft" }));
    }
  };

  // Handle scheduled status change
  const handleScheduledChange = (e) => {
    const isScheduled = e.target.checked;
    setIsScheduled(isScheduled);
    
    if (isScheduled) {
      // If scheduling, set status to draft and clear archived status
      setIsArchived(false);
      setFormData(prev => ({ 
        ...prev, 
        status: "draft",
        schedule: prev.schedule || formatDateForInput(new Date())
      }));
    } else {
      // If unscheduling, clear the schedule date
      setFormData(prev => ({ ...prev, schedule: "" }));
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Format schedule date for API in Y-m-d H:i:s format
      const formattedSchedule = formData.schedule 
        ? formatDateForAPI(formData.schedule)
        : "";

      // Create FormData for the request (must use multipart/form-data for files)
      const formDataObj = new FormData();
      
      // Append all form fields
      formDataObj.append("title", formData.title);
      formDataObj.append("slug", formData.slug);
      formDataObj.append("content", formData.content);
      formDataObj.append("pinned", formData.pinned ? 1 : 0);
      formDataObj.append("featured", formData.featured ? 1 : 0);
      
      // Set status based on archived state or schedule
      if (isArchived) {
        formDataObj.append("status", "archived");
      } else if (isScheduled) {
        formDataObj.append("status", "draft");
        formDataObj.append("schedule", formattedSchedule);
      } else {
        formDataObj.append("status", formData.status);
      }
      
      formDataObj.append("company_id", user.company_id);
      
      // Append categories
      formData.categories.forEach(categoryId => {
        formDataObj.append("categories[]", categoryId);
      });
      
      // Append images if they are new files
      if (imageFiles.primary) {
        formDataObj.append("primary_image", imageFiles.primary);
      } else if (formData.primary_image && typeof formData.primary_image === "string") {
        // If it's an existing image URL, pass it as is
        formDataObj.append("primary_image_url", formData.primary_image);
      }
      
      if (formData.featured && imageFiles.featured) {
        formDataObj.append("featured_image", imageFiles.featured);
      } else if (formData.featured && formData.featured_image && typeof formData.featured_image === "string") {
        // If it's an existing featured image URL, pass it as is
        formDataObj.append("featured_image_url", formData.featured_image);
      }
      
      // Append videos - handle both URL references and file uploads
      if (showVideosSection) {
        formData.videos.forEach((video, index) => {
          formDataObj.append(`videos[${index}][type]`, video.type);
          formDataObj.append(`videos[${index}][title]`, video.title);
          
          if (video.type === "upload" && video.file) {
            // Append the video file
            formDataObj.append(`videos[${index}][file]`, video.file);
          } else {
            // Append the reference URL for external videos
            formDataObj.append(`videos[${index}][reference_url]`, video.reference_url || "");
          }
        });
      }
      
      // Append attachments
      attachmentFiles.forEach((attachment, index) => {
        if (attachment.isNew) {
          formDataObj.append(`attachments[${index}]`, attachment.file);
        } else if (attachment.url) {
          // For existing attachments, pass the URL
          formDataObj.append(`attachment_urls[${index}]`, attachment.url);
        }
      });

      const endpoint = isEditMode ? `news/${id}` : "news";
      const method = isEditMode ? "post" : "post";

      const response = await httpClient[method](endpoint, formDataObj);

      if (response.data.success) {
        let message = "";
        if (isArchived) {
          message = "Article archived";
        } else if (isScheduled) {
          message = "Article scheduled";
        } else {
          message = isEditMode ? "Article updated" : "Article published";
        }
        
        showSnackbar(message, "success");
        setTimeout(() => navigate("/manage/news"), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save article");
      showSnackbar(err.response?.data?.message || "Failed to save article", "error");
    } finally { setIsLoading(false); }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };
  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  if (isLoading) return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: '70%', margin: '0 auto', '@media (max-width: 900px)': { maxWidth: '90%' } }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        {isEditMode ? "Edit News Article" : "Create New Article"}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>DETAILS</Typography>
        <Divider sx={{ mb: 3 }} />

        <TextField
          fullWidth label="Title *"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required sx={{ mb: 3 }}
        />

        <Box sx={{ mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="subtitle2">Slug *</Typography>
            {isSlugManual && (
              <Button size="small" onClick={() => setIsSlugManual(false)} sx={{ textTransform: 'none' }}>
                Reset to auto-generated
              </Button>
            )}
          </Box>
          <TextField
            fullWidth
            value={formData.slug}
            onChange={(e) => { setFormData(prev => ({ ...prev, slug: e.target.value })); setIsSlugManual(true); }}
            required helperText="URL-friendly version of the title"
          />
        </Box>

        {/* Primary Image Upload */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Primary Image</Typography>
          <Button variant="outlined" component="label">
            Upload Primary Image
            <input type="file" hidden accept="image/*" onChange={(e) => handleImageFileSelect(e, "primary")} />
          </Button>
          {formData.primary_image && (
            <Box mt={1}>
              <img src={formData.primary_image} alt="Primary" width="180" style={{ borderRadius: 6, marginTop: 8 }} />
            </Box>
          )}
        </Box>

        {/* Featured Article Switch */}
        <FormControlLabel 
          control={
            <Switch 
              checked={formData.featured} 
              onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))} 
            />
          } 
          label="Featured Article" 
          sx={{ mb: formData.featured ? 2 : 3, display: 'block' }} 
        />
        
        {/* Featured Image Upload - Only show when featured is enabled */}
        {formData.featured && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Featured Banner Image</Typography>
            <Button variant="outlined" component="label">
              Upload Featured Banner
              <input type="file" hidden accept="image/*" onChange={(e) => handleImageFileSelect(e, "featured")} />
            </Button>
            {formData.featured_image && (
              <Box mt={1}>
                <img src={formData.featured_image} alt="Featured" width="180" style={{ borderRadius: 6, marginTop: 8 }} />
              </Box>
            )}
          </Box>
        )}

        <Typography variant="subtitle2" sx={{ mb: 1 }}>Content *</Typography>
        <MDEditor
          value={formData.content}
          onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
          height={400} preview="edit" visibleDragbar={false}
          style={{ border: '1px solid #ddd', borderRadius: '4px', marginBottom: '24px' }}
        />

        {/* Categories */}
        <Typography variant="subtitle1" sx={{ mb: 1 }}>News Categories</Typography>
        <Autocomplete
          multiple
          options={categories}
          getOptionLabel={(option) => option.title}
          value={formData.displayCategories}
          onChange={handleCategoryChange}
          loading={isCategoriesLoading}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => <TextField {...params} label="Select categories" placeholder="Start typing to search categories" />}
          renderTags={(value, getTagProps) => value.map((option, index) => <Chip label={option.title} {...getTagProps({ index })} key={option.id} />)}
          sx={{ mb: 3 }}
        />

        {/* Video Section */}
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={<Switch checked={showVideosSection} onChange={(e) => setShowVideosSection(e.target.checked)} />}
            label="Include Videos"
          />
        </Box>

        {showVideosSection && (
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
              <Typography variant="subtitle1">Videos</Typography>
              <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setVideoModalOpen(true)}>Add Video</Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {formData.videos.length === 0 ? (
              <Typography variant="body2" color="text.secondary">No videos added yet.</Typography>
            ) : (
              <Stack spacing={1.5}>
                {formData.videos.map((v, idx) => (
                  <Paper key={idx} sx={{ p: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between" }} variant="outlined">
                    <Box sx={{ pr: 2, overflow: "hidden" }}>
                      <Typography variant="subtitle2" noWrap title={v.title}>{v.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {v.type.toUpperCase()} • {v.type === "upload" ? (v.file ? v.file.name : "File uploaded") : v.reference_url}
                      </Typography>
                    </Box>
                    <IconButton onClick={() => handleDeleteVideo(idx)} color="error" size="small">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Paper>
                ))}
              </Stack>
            )}
          </Paper>
        )}

        {/* Attachments Section */}
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
            <Typography variant="subtitle1">Attachments</Typography>
            <Button variant="outlined" component="label" startIcon={<AddIcon />}>
              Add Attachment
              <input type="file" hidden multiple onChange={handleAttachmentSelect} />
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {formData.attachments.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No attachments added yet.</Typography>
          ) : (
            <Stack spacing={1.5}>
              {formData.attachments.map((attachment, idx) => (
                <Paper key={idx} sx={{ p: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between" }} variant="outlined">
                  <Box sx={{ pr: 2, overflow: "hidden" }}>
                    <Typography variant="subtitle2" noWrap title={attachment.name}>
                      {attachment.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {attachment.type} • {Math.round(attachment.size / 1024)} KB
                    </Typography>
                  </Box>
                  <IconButton onClick={() => handleDeleteAttachment(idx)} color="error" size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Paper>
              ))}
            </Stack>
          )}
        </Paper>

        <FormControlLabel 
          control={<Switch checked={formData.pinned} onChange={(e) => setFormData(prev => ({ ...prev, pinned: e.target.checked }))} />} 
          label="Pinned Article" 
          sx={{ mb: 3, display: 'block' }} 
        />

        {/* Archived Status Switch */}
        <FormControlLabel 
          control={<Switch checked={isArchived} onChange={handleArchivedChange} />} 
          label="Archived Article" 
          sx={{ mb: 2, display: 'block' }} 
        />

        {/* Schedule Switch */}
        <FormControlLabel 
          control={<Switch checked={isScheduled} onChange={handleScheduledChange} disabled={isArchived} />} 
          label="Schedule Article" 
          sx={{ mb: 1, display: 'block' }} 
        />
        
        {/* Schedule Date Input - Only show when schedule switch is on */}
        <Collapse in={isScheduled && !isArchived}>
          <TextField
            fullWidth 
            label="Schedule Date & Time" 
            type="datetime-local"
            value={formData.schedule}
            onChange={(e) => setFormData(prev => ({ ...prev, schedule: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 3 }}
          />
        </Collapse>

        {/* Status - Only show when not archived and not scheduled */}
        <Collapse in={!isArchived && !isScheduled}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              label="Status"
            >
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="published">Published</MenuItem>
            </Select>
          </FormControl>
        </Collapse>

        {/* Submit Button */}
        <Button type="submit" variant="contained" color="primary" fullWidth size="large" disabled={isLoading} startIcon={isLoading ? <CircularProgress size={20} /> : null}>
          {isArchived ? "Archive Article" : 
           isScheduled ? "Schedule Article" : 
           isEditMode ? "Update Article" : "Publish Article"}
        </Button>
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={2000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">{snackbar.message}</Alert>
      </Snackbar>

      <VideoModal open={videoModalOpen} onClose={() => setVideoModalOpen(false)} onSave={handleAddVideo} />
    </Box>
  );
};

export default NewsArticleForm;


