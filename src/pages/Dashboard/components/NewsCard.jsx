
// import { useState, useTransition } from "react";
// import {
//   Box,
//   Button,
//   Divider,
//   Typography,
//   IconButton,
//   Menu,
//   MenuItem,
// CircularProgress,
//   Skeleton
// } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import { useNavigate, Link } from "react-router-dom";

// export default function NewsCard({ newsData }) {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [isPending, startTransition] = useTransition();
//   const [prefetching, setPrefetching] = useState(null);
//   const navigate = useNavigate();
//   const open = Boolean(anchorEl);

//   const handleMenuClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleMenuItemClick = (path) => {
//     handleClose();
//     startTransition(() => {
//       navigate(path);
//     });
//   };

//   const handleReadMore = (id) => {
//     startTransition(() => {
//       navigate(`/dashboardnews/${id}`);
//     });
//   };

//   const prefetchData = async (id) => {
//     if (!prefetching || prefetching !== id) {
//       setPrefetching(id);
//       // Simulate prefetch - replace with actual prefetch logic
//       await new Promise(resolve => setTimeout(resolve, 300));
//       setPrefetching(null);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         alignItems: "flex-start",
//         bgcolor: "inherit",
//         paddingLeft: "1rem",
//         paddingBottom: 0,
//         borderRadius: 2,
//         boxShadow: 1,
//         maxWidth: "100%",
//         mx: "auto",
//         position: "relative"
//       }}
//     >
//       {isPending && (
//         <Box sx={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundColor: 'rgba(255, 255, 255, 0.7)',
//           zIndex: 1,
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center'
//         }}>
//           {/* <CircularProgress /> */}
//         </Box>
//       )}

//       <div
//         style={{
//           textAlign: "center",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           paddingBottom: "8px",
//           marginTop: "2rem",
//         }}
//       >
//         <Typography
//           variant="overline"
//           sx={{
//             fontWeight: 450,
//             fontSize: "1.7rem",
//             display: "block",
//             color: "black",
//           }}
//         >
//           NEWS
//         </Typography>

//         <IconButton onClick={handleMenuClick}>
//           <MoreVertIcon />
//         </IconButton>

//         <Menu
//           anchorEl={anchorEl}
//           open={open}
//           onClose={handleClose}
//           anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//           transformOrigin={{ vertical: "top", horizontal: "right" }}
//         >
//           <MenuItem onClick={() => handleMenuItemClick("/manage/news")}>
//             Manage Articles
//           </MenuItem>
//           {/* <MenuItem onClick={() => handleMenuItemClick("/admin/news/delete")}>
//             View all articles
//           </MenuItem> */}
//         </Menu>
//       </div>

//       <Divider sx={{ mb: 2 }} />

//       {newsData.map((newsItem) => (
//         <Box
//           key={newsItem.id}
//           sx={{
//             mb: 2,
//             p: 2,
//             backgroundColor: "#fff",
//             borderRadius: 1,
//             boxShadow: 1,
//             position: "relative"
//           }}
//           onMouseEnter={() => prefetchData(newsItem.id)}
//         >
//           <Typography variant="h6">{newsItem.title}</Typography>
//           <Typography variant="body2" sx={{ mt: 1 }}>
//             {newsItem.content}
//           </Typography>
//           <Typography variant="caption" display="block" sx={{ mt: 1 }}>
//             {new Date(newsItem.created_at).toLocaleDateString()}
//           </Typography>
//           <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
//             <Button
//               onClick={() => handleReadMore(newsItem.id)}
//               variant="contained"
//               sx={{
//                 bgcolor: "#D8D80E",
//                 textTransform: "none",
//                 marginBottom: "1rem",
//                 marginRight: "1rem",
//                 position: "relative"
//               }}
//               disabled={isPending}
//             >
//               {prefetching === newsItem.id ? (
//                 <>
//                   Read More
//                   <CircularProgress 
//                     size={20} 
//                     sx={{ 
//                       position: 'absolute',
//                       right: 8,
//                       color: 'inherit'
//                     }} 
//                   />
//                 </>
//               ) : (
//                 "Read More"
//               )}
//             </Button>
//           </Box>
//         </Box>
//       ))}
//     </Box>
//   );
// }



// ********new layout ************
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
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext"

export default function NewsCard({ newsData }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [prefetching, setPrefetching] = useState(null);
  const { user } = useAuth();
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
      await new Promise((resolve) => setTimeout(resolve, 300));
      setPrefetching(null);
    }
  };

  // ✅ Truncate content to 150 characters
  const truncateContent = (text, limit) => {
    if (!text) return "";
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  // ✅ Sort: Featured news on top (FIXED: compare numbers instead of strings)
  const sortedNews = [...newsData].sort((a, b) => {
    if (a.featured === 1 && b.featured !== 1) return -1;
    if (a.featured !== 1 && b.featured === 1) return 1;
    return 0;
  });

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
        position: "relative",
      }}
    >
      {isPending && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        ></Box>
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
            color: "black", // Reverted to original black color
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
        </Menu>
      </div>

      <Divider sx={{ mb: 2 }} /> {/* Removed blue color */}

      {sortedNews.map((newsItem) => {
        const imageUrl =
          newsItem.primary_image &&
          `https://opmanual.franchise.care/uploaded/${user?.company_id}/news/${newsItem.primary_image}`;

        // FIXED: Compare with number 1 instead of string "1"
        const isFeatured = newsItem.featured === 1;

        return (
          <Box
            key={newsItem.id}
            sx={{
              mb: 2,
              p: 2,
              backgroundColor: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              boxShadow: 1,
              position: "relative",
            }}
            onMouseEnter={() => prefetchData(newsItem.id)}
          >
            {/* ✅ Featured Banner - Red banner on top right */}
            {isFeatured && (
              <Box
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  bgcolor: "#D32F2F",
                  color: "#fff",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "4px",
                  fontWeight: "bold",
                  fontSize: "0.75rem",
                  boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.2)",
                  zIndex: 2,
                }}
              >
                FEATURED
              </Box>
            )}

            {/* ✅ Updated Primary Image */}
            {imageUrl && (
              <Box
                component="img"
                src={imageUrl}
                alt="News"
                sx={{
                  width: "100%",
                  height: "320px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  mb: 1,
                }}
              />
            )}

            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
              }}
            >
              {newsItem.title}
            </Typography>

            <Typography
  variant="body2"
  sx={{ mt: 1, color: "#555" }}
  dangerouslySetInnerHTML={{
    __html: truncateContent(newsItem.content, 300),
  }}
/>

{/* 
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                color: "#555",
              }}
            >
              {truncateContent(newsItem.content, 150)}
            </Typography> */}

            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              {new Date(newsItem.created_at).toLocaleDateString()}
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                onClick={() => handleReadMore(newsItem.id)}
                variant="contained"
                sx={{
                  bgcolor: "#1976D2",
                  color: "#fff",
                  textTransform: "none",
                  marginBottom: "1rem",
                  marginRight: "1rem",
                  position: "relative",
                  '&:hover': {
                    bgcolor: '#1565C0',
                  },
                }}
                disabled={isPending}
              >
                {prefetching === newsItem.id ? (
                  <>
                    Read More
                    <CircularProgress
                      size={20}
                      sx={{
                        position: "absolute",
                        right: 8,
                        color: "inherit",
                      }}
                    />
                  </>
                ) : (
                  "Read More"
                )}
              </Button>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}