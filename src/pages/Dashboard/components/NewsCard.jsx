import { useState, useTransition } from "react";
import {
  Box,
  Button,
  Divider,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Chip
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";

export default function NewsCard({ newsData }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [prefetching, setPrefetching] = useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  // Check if newsData exists and has items
  if (!newsData || !Array.isArray(newsData) || newsData.length === 0) {
    return (
      <Box
        sx={{
          alignItems: "flex-start",
          bgcolor: "inherit",
          padding: "1rem",
          borderRadius: 2,
          boxShadow: 1,
          maxWidth: "100%",
          mx: "auto",
        }}
      >
        <Typography variant="h6">No news available</Typography>
      </Box>
    );
  }

  // Separate featured news from regular news
  const featuredNews = newsData.find(item => item.featured === 1);
  const regularNews = newsData.filter(item => item !== featuredNews);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path) => {
    handleClose();
    startTransition(() => {
      navigate(path);
    });
  };

  const handleReadMore = (id) => {
    startTransition(() => {
      navigate(`/dashboardnews/${id}`);
    });
  };

  const prefetchData = async (id) => {
    if (!prefetching || prefetching !== id) {
      setPrefetching(id);
      // Simulate prefetch - replace with actual prefetch logic
      await new Promise(resolve => setTimeout(resolve, 300));
      setPrefetching(null);
    }
  };

  return (
    <Box
      sx={{
        alignItems: "flex-start",
        bgcolor: "inherit",
        paddingLeft: "1rem",
        paddingBottom: 0,
        borderRadius: 2,
        boxShadow: 1,
        maxWidth: "100%",
        mx: "auto",
        position: "relative"
      }}
    >
      {isPending && (
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* <CircularProgress /> */}
        </Box>
      )}

      <div
        style={{
          textAlign: "center",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "8px",
          marginTop: "2rem",
        }}
      >
        <Typography
          variant="overline"
          sx={{
            fontWeight: 450,
            fontSize: "1.7rem",
            display: "block",
            color: "black",
          }}
        >
          NEWS
        </Typography>

        <IconButton onClick={handleMenuClick}>
          <MoreVertIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={() => handleMenuItemClick("/manage/news")}>
            Manage Articles
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("/admin/news/delete")}>
            View all articles
          </MenuItem>
        </Menu>
      </div>

      <Divider sx={{ mb: 2 }} />

      {/* Featured News Banner */}
      {featuredNews && (
        <Box
          sx={{
            mb: 3,
            p: 0,
            backgroundColor: "#fff",
            borderRadius: 1,
            boxShadow: 3,
            position: "relative",
            overflow: "hidden"
          }}
          onMouseEnter={() => prefetchData(featuredNews.id)}
        >
          {/* Featured Tag */}
          <Chip 
            label="FEATURED" 
            sx={{ 
              position: "absolute", 
              top: 16, 
              left: 16, 
              backgroundColor: "primary.main", 
              color: "white",
              fontWeight: "bold",
              zIndex: 2
            }} 
          />
          
          {/* Featured Image - Only show if featured_image exists */}
          {featuredNews.featured_image && (
            <Box 
              component="img"
              src={featuredNews.featured_image}
              alt={featuredNews.title}
              sx={{
                width: "100%",
                height: 200,
                objectFit: "cover",
                display: "block"
              }}
            />
          )}
          
          <Box sx={{ p: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
              {featuredNews.title}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {featuredNews.content}
            </Typography>
            <Typography variant="caption" display="block" sx={{ mb: 2 }}>
              {new Date(featuredNews.created_at).toLocaleDateString()}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                onClick={() => handleReadMore(featuredNews.id)}
                variant="contained"
                sx={{
                  bgcolor: "#D8D80E",
                  textTransform: "none",
                  position: "relative"
                }}
                disabled={isPending}
              >
                {prefetching === featuredNews.id ? (
                  <>
                    Read More
                    <CircularProgress 
                      size={20} 
                      sx={{ 
                        position: 'absolute',
                        right: 8,
                        color: 'inherit'
                      }} 
                    />
                  </>
                ) : (
                  "Read More"
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* Regular News Items */}
      {regularNews.map((newsItem) => (
        <Box
          key={newsItem.id}
          sx={{
            mb: 2,
            p: 2,
            backgroundColor: "#fff",
            borderRadius: 1,
            boxShadow: 1,
            position: "relative"
          }}
          onMouseEnter={() => prefetchData(newsItem.id)}
        >
          <Typography variant="h6">{newsItem.title}</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {newsItem.content}
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            {new Date(newsItem.created_at).toLocaleDateString()}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={() => handleReadMore(newsItem.id)}
              variant="contained"
              sx={{
                bgcolor: "#D8D80E",
                textTransform: "none",
                marginBottom: "1rem",
                marginRight: "1rem",
                position: "relative"
              }}
              disabled={isPending}
            >
              {prefetching === newsItem.id ? (
                <>
                  Read More
                  <CircularProgress 
                    size={20} 
                    sx={{ 
                      position: 'absolute',
                      right: 8,
                      color: 'inherit'
                    }} 
                  />
                </>
              ) : (
                "Read More"
              )}
            </Button>
          </Box>
        </Box>
      ))}
    </Box>
  );
}