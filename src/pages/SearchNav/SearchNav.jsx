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
} from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ArticleIcon from "@mui/icons-material/Article";
import PeopleIcon from "@mui/icons-material/People";
import FolderIcon from "@mui/icons-material/Folder";
import FeedIcon from "@mui/icons-material/Feed";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { httpClient } from "../../utils/httpClientSetup";

const categories = [
  { key: "policies", label: "Operations Manuals", icon: ArticleIcon, color: "#1976d2" },
  { key: "users", label: "Users", icon: PeopleIcon, color: "#d32f2f" },
  { key: "files", label: "File Manager", icon: FolderIcon, color: "#ed6c02" },
  { key: "news", label: "News", icon: FeedIcon, color: "#2e7d32" },
  { key: "events", label: "Events", icon: DescriptionOutlinedIcon, color: "#9c27b0" },
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
        
        // Initialize current pages for each category
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

  const handleItemClick = (link, event) => {
    // Open in new tab if Ctrl/Cmd clicked or middle mouse button
    if (event.ctrlKey || event.metaKey || event.button === 1) {
      window.open(link, '_blank');
    } else {
      navigate(link);
    }
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
    } else if (categoryKey === "users" || categoryKey === "events") {
      link = `/users/profile/${item.id}`;
      title = item.name;
      content = item.email;
    } else if (categoryKey === "files") {
      link = `/file-manager/${item.id}`;
      title = item.label || item.name;
      content = item.file_type;
    }

    return (
      <ListItem
        button
        key={item.id}
        alignItems="flex-start"
        onClick={(e) => handleItemClick(link, e)}
        sx={{
          cursor: "pointer",
          "&:hover": { backgroundColor: "action.hover" },
          minHeight: '88px',
        }}
      >
        <ListItemAvatar>
          <Avatar sx={{ 
            bgcolor: "transparent", 
            border: `1px solid ${categoryInfo.color}`,
            color: categoryInfo.color
          }}>
            <IconComponent />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography variant="subtitle1" fontWeight={600}>
              {title}
            </Typography>
          }
          secondary={
            content ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {typeof content === 'string' && content.length > 250
                  ? content.replace(/<[^>]*>/g, '').slice(0, 250) + "..."
                  : content}
              </Typography>
            ) : null
          }
        />
      </ListItem>
    );
  };

  // Calculate pagination details for current category
  const paginationInfo = results[selectedCategory]?.pagination || {};
  const totalPages = paginationInfo.last_page || 1;
  const totalItems = paginationInfo.total || 0;
  const itemsPerPage = paginationInfo.per_page || 10;
  const currentPage = currentPages[selectedCategory] || 1;
  const startItem = ((currentPage - 1) * itemsPerPage) + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const categoryInfo = getCategoryInfo(selectedCategory);

  return (
    <Box sx={{ display: "flex", maxWidth: 1200, mx: "auto", my: 4, minHeight: '600px' }}>
      {/* Left Panel */}
      <Paper sx={{ width: 250, p: 2, mr: 3, alignSelf: 'flex-start' }} elevation={2}>
        <Typography variant="h6" gutterBottom>
          SEARCH ALL
        </Typography>
        <List>
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <ListItem
                key={cat.key}
                button
                selected={selectedCategory === cat.key}
                onClick={() => handleCategoryChange(cat.key)}
                sx={{
                  backgroundColor: selectedCategory === cat.key ? "#f5f5f5" : "transparent",
                  color: selectedCategory === cat.key ? "text.primary" : "text.primary",
                  borderRadius: 1,
                  mb: 0.5,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: selectedCategory === cat.key ? "#e0e0e0" : "action.hover",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mr: 1, color: cat.color }}>
                  <IconComponent />
                </Box>
                <ListItemText
                  primary={`${cat.label} (${results[cat.key]?.count || 0})`}
                  sx={{
                    "& .MuiTypography-root": {
                      fontWeight: selectedCategory === cat.key ? 600 : 400,
                    }
                  }}
                />
              </ListItem>
            );
          })}
        </List>
      </Paper>

      {/* Right Panel - Fixed container to prevent layout shifts */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2, flexWrap: 'wrap' }}>
          <Typography variant="h5">
            SEARCH RESULTS FOR: <strong>"{query}"</strong>
          </Typography>
          <Box sx={{ ml: 2, display: "flex", alignItems: "center", color: categoryInfo.color }}>
            <categoryInfo.icon />
            <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 600 }}>
              {categoryInfo.label}
            </Typography>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: 'center', height: '400px' }}>
            <CircularProgress size={28} />
          </Box>
        ) : !results[selectedCategory]?.data?.length ? (
          <Paper sx={{ p: 3, mt: 3, textAlign: "center", height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} elevation={2}>
            <Typography variant="body1">No results found in this category.</Typography>
          </Paper>
        ) : (
          <>
            <Paper sx={{ mt: 3, minHeight: '400px' }} elevation={3}>
              <List>
                {results[selectedCategory].data.map((item, index) => (
                  <React.Fragment key={item.id}>
                    {renderListItem(item, selectedCategory)}
                    {index !== results[selectedCategory].data.length - 1 && (
                      <Divider />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3, alignItems: 'center', minHeight: '40px' }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  renderItem={(item) => (
                    <PaginationItem
                      slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                      {...item}
                      disabled={loadingPages[selectedCategory]}
                    />
                  )}
                />
                {loadingPages[selectedCategory] && (
                  <CircularProgress size={24} sx={{ ml: 2 }} />
                )}
              </Box>
            )}
            
            {/* Results count */}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: "center", minHeight: '24px' }}>
              {totalItems > 0 ? `Showing ${startItem} to ${endItem} of ${totalItems} results` : ''}
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
};

export default SearchNav;