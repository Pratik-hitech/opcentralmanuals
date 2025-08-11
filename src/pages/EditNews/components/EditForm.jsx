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

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import {
  Box, TextField, FormControl, InputLabel, Select, MenuItem,
  Switch, FormControlLabel, Button, Typography,
  Paper, Divider, Alert, CircularProgress, IconButton, Stack,
  Chip
} from "@mui/material";
import {
  FormatBold as FormatBoldIcon,
  FormatUnderlined as FormatUnderlinedIcon,
  FormatListNumbered as FormatListNumberedIcon,
  FormatListBulleted as FormatListBulletedIcon,
  FormatQuote as FormatQuoteIcon,
  Link as LinkIcon,
  Image as ImageIcon
} from "@mui/icons-material";
import { httpClient } from "../../../utils/httpClientSetup";

const NewsArticleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    categories: [],
    pinned: false,
    featured: false,
    status: "",
    schedule: "",
    videos: [], // array to hold video files or URLs
  });

  const [showVideosSection, setShowVideosSection] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEditMode) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await httpClient.get(`news/${id}`);
        if (response.data.success) {
          const { data } = response.data;
          setFormData({
            title: data.title || "",
            slug: data.slug || "",
            content: data.content || "",
            categories: data.categories || [],
            pinned: data.pinned === 1,
            featured: data.featured === 1,
            status: data.status || "draft",
            schedule: data.schedule || "",
            videos: data.videos || [],
          });
          setShowVideosSection((data.videos?.length ?? 0) > 0);
        }
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load article");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Categories multiple select handler
  const handleCategoryChange = (e) => {
    const { value } = e.target;
    // Always keep an array of strings
    setFormData(prev => ({
      ...prev,
      categories: typeof value === "string" ? value.split(",") : value,
    }));
  };

  // Video upload handler - for example purpose, we just store file names
  const handleVideoUpload = (e) => {
    const files = e.target.files;
    if (!files.length) return;
    const newVideos = Array.from(files).map(file => file.name);
    setFormData(prev => ({
      ...prev,
      videos: [...prev.videos, ...newVideos],
    }));
  };

  // Toggle videos section
  const toggleVideosSection = (e) => {
    setShowVideosSection(e.target.checked);
    if (!e.target.checked) {
      setFormData(prev => ({ ...prev, videos: [] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
    
      const payload = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        categories: formData.categories,
        pinned: formData.pinned ? 1 : 0,
        featured: formData.featured ? 1 : 0,
        status: formData.status,
        schedule: formData.schedule || null,
        videos: showVideosSection ? formData.videos : [],
      };

      const response = isEditMode
        ? await httpClient.put(`news/${id}`, payload)
        : await httpClient.post("news", payload);

      if (response.data.success) {
        navigate(`/manage/newsarticle/${response.data.data.id}/details`);
      } else {
        setError(response.data.message || "Validation failed");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save article");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit}
      sx={{
        maxWidth: '70%',
        margin: '0 auto',
        '@media (max-width: 900px)': { maxWidth: '90%' }
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        {isEditMode ? "Edit News Article" : "Create New Article"}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>DETAILS</Typography>
        <Divider sx={{ mb: 3 }} />

        {/* Title */}
        <TextField
          fullWidth
          label="Title *"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          sx={{ mb: 3 }}
        />

        {/* Slug */}
        <TextField
          fullWidth
          label="Slug *"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          required
          sx={{ mb: 3 }}
          helperText="URL-friendly version of the title"
        />

        {/* Content */}
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Content *</Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <IconButton size="small"><FormatBoldIcon fontSize="small" /></IconButton>
          <IconButton size="small"><FormatUnderlinedIcon fontSize="small" /></IconButton>
          <IconButton size="small"><FormatListNumberedIcon fontSize="small" /></IconButton>
          <IconButton size="small"><FormatListBulletedIcon fontSize="small" /></IconButton>
          <IconButton size="small"><FormatQuoteIcon fontSize="small" /></IconButton>
          <IconButton size="small"><LinkIcon fontSize="small" /></IconButton>
          <IconButton size="small"><ImageIcon fontSize="small" /></IconButton>
        </Stack>
        <MDEditor
          value={formData.content}
          onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
          height={400}
          sx={{ mb: 3 }}
        />

        {/* Categories */}
        <Typography variant="subtitle1" sx={{ mb: 1, mt: 3 }}>News Categories</Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="categories-label">Select News Categories</InputLabel>
          <Select
            labelId="categories-label"
            name="categories"
            multiple
            value={formData.categories}
            onChange={handleCategoryChange}
            label="Select News Categories"
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            <MenuItem value="current">Current Affairs</MenuItem>
            <MenuItem value="sports">Sports</MenuItem>
            <MenuItem value="business">Business</MenuItem>
            <MenuItem value="entertainment">Entertainment</MenuItem>
            <MenuItem value="technology">Technology</MenuItem>
            <MenuItem value="health">Health & Wellness</MenuItem>
          </Select>
        </FormControl>

        {/* Pinned */}
        <FormControlLabel
          control={
            <Switch
              name="pinned"
              checked={formData.pinned}
              onChange={handleChange}
            />
          }
          label="Pinned Article"
          sx={{ mb: 2, display: 'block' }}
        />

        {/* Featured */}
        <FormControlLabel
          control={
            <Switch
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
            />
          }
          label="Featured Article"
          sx={{ mb: 3, display: 'block' }}
        />

        {/* Videos toggle */}
        <FormControlLabel
          control={
            <Switch
              checked={showVideosSection}
              onChange={toggleVideosSection}
            />
          }
          label="Add Videos"
          sx={{ mb: 3 }}
        />

        {/* Videos upload section */}
        {showVideosSection && (
          <Box sx={{ mb: 3 }}>
            <input
              type="file"
              multiple
              accept="video/*"
              onChange={handleVideoUpload}
              style={{ marginBottom: 8 }}
            />
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {formData.videos.map((video, idx) => (
                <Chip
                  key={idx}
                  label={video}
                  onDelete={() => {
                    setFormData(prev => ({
                      ...prev,
                      videos: prev.videos.filter((_, i) => i !== idx)
                    }));
                  }}
                  sx={{ mb: 1 }}
                />
              ))}
            </Stack>
          </Box>
        )}

        {/* Schedule */}
        <TextField
          fullWidth
          label="Schedule Date"
          type="datetime-local"
          name="schedule"
          value={formData.schedule || ""}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 3 }}
        />

        {/* Status */}
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Status</Typography>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
            label="Status"
          >
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="published">Published</MenuItem>
            <MenuItem value="archived">Archived</MenuItem>
          </Select>
        </FormControl>

        {/* Submit */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {isEditMode ? "Update Article" : "Create Article"}
        </Button>
      </Paper>
    </Box>
  );
};

export default NewsArticleForm;
