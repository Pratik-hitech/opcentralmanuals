import { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";

function NewsCard({newsData}) {
  
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path) => {
    handleClose();
    navigate(path); // Go to the specified route
  };

  return (
    <Box
      sx={{
        alignItems:"flex-start",
        bgcolor: "inherit",
        paddingLeft: "1rem",
        paddingBottom: 0,
        borderRadius: 2,
        boxShadow: 1,
        maxWidth: "100%",
        mx: "auto",
      }}
    >
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

      {newsData.map((newsItem)=>{
        return (
          <Box
            key={newsItem.id}
            sx={{
              mb: 2,
              p: 2,
              backgroundColor: "#fff",
              borderRadius: 1,
              boxShadow: 1,
            }}
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
          variant="contained"
          sx={{
            bgcolor: "#D8D80E",
            textTransform: "none",
            marginBottom: "1rem",
            marginRight: "1rem",
          }}
        >
          Read More
        </Button>
        
      </Box>
          </Box>
          
        );
      })
      }

      {/* <Typography
        variant="subtitle1"
        gutterBottom
        sx={{
          fontWeight: 450,
          fontSize: "1.3rem",
          mb: 1,
          display: "block",
          color: "black",
          textDecoration: "underline",
        }}
      >
        Welcome to your Operations Manual
      </Typography>

      <Typography variant="body2" sx={{ mb: 2, fontSize: "1.2rem" }}>
        Please click the side menu button or the Quick Link to access the
        Manual. If you have any issues, please contact Support Office 03 9826
        5266 or office@bluewheelers.com.au
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          sx={{
            bgcolor: "#D8D80E",
            textTransform: "none",
            marginBottom: "1rem",
            marginRight: "1rem",
          }}
        >
          Read More
        </Button>
        
      </Box>
       <Typography
        variant="subtitle1"
        gutterBottom
        sx={{
          fontWeight: 450,
          fontSize: "1.3rem",
          mb: 1,
          display: "block",
          color: "black",
          textDecoration: "underline",
        }}
      >
        Welcome to your Operations Manual
      </Typography>

      <Typography variant="body2" sx={{ mb: 2, fontSize: "1.2rem" }}>
        Please click the side menu button or the Quick Link to access the
        Manual. If you have any issues, please contact Support Office 03 9826
        5266 or office@bluewheelers.com.au
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          sx={{
            bgcolor: "#D8D80E",
            textTransform: "none",
            marginBottom: "1rem",
            marginRight: "1rem",
          }}
        >
          Read More
        </Button>
        
      </Box>

      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{
          fontWeight: 450,
          fontSize: "1.3rem",
          mb: 1,
          display: "block",
          color: "black",
          textDecoration: "underline",
        }}
      >
        Welcome to your Operations Manual
      </Typography>

      <Typography variant="body2" sx={{ mb: 2, fontSize: "1.2rem" }}>
        Please click the side menu button or the Quick Link to access the
        Manual. If you have any issues, please contact Support Office 03 9826
        5266 or office@bluewheelers.com.au
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          sx={{
            bgcolor: "#D8D80E",
            textTransform: "none",
            marginBottom: "1rem",
            marginRight: "1rem",
          }}
        >
          Read More
        </Button>
        
      </Box>
       <Typography
        variant="subtitle1"
        gutterBottom
        sx={{
          fontWeight: 450,
          fontSize: "1.3rem",
          mb: 1,
          display: "block",
          color: "black",
          textDecoration: "underline",
        }}
      >
        Welcome to your Operations Manual
      </Typography>

      <Typography variant="body2" sx={{ mb: 2, fontSize: "1.2rem" }}>
        Please click the side menu button or the Quick Link to access the
        Manual. If you have any issues, please contact Support Office 03 9826
        5266 or office@bluewheelers.com.au
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          sx={{
            bgcolor: "#D8D80E",
            textTransform: "none",
            marginBottom: "1rem",
            marginRight: "1rem",
          }}
        >
          Read More
        </Button>
        
      </Box> */}
      

    </Box>
  );
}

export default NewsCard;
