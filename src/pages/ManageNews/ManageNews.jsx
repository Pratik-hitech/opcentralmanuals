// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Box,
//   Typography,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   Checkbox,
//   IconButton,
//   Button,
//   Menu,
//   MenuItem,
//   TextField,
//   InputAdornment,
//   TablePagination,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
// } from "@mui/material";
// import {
//   MoreVert,
//   Search,
//   BarChart,
//   FilterList,
//   Download,
//   ExpandMore,
// } from "@mui/icons-material";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

// const ManageArticles = () => {
//   const navigate = useNavigate();

//   const [articles, setArticles] = useState([]);
//   const [selected, setSelected] = useState([]);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [bulkAnchorEl, setBulkAnchorEl] = useState(null);
//   const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);
//   const [rowMenuAnchorEl, setRowMenuAnchorEl] = useState(null);
//   const [activeRowId, setActiveRowId] = useState(null);
//   const [tab, setTab] = useState("active");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [openArchiveModal, setOpenArchiveModal] = useState(false);
//   const [openDeleteModal, setOpenDeleteModal] = useState(false);
//   const [articleToDelete, setArticleToDelete] = useState(null);

//   useEffect(() => {
//     const endpoint =
//       tab === "active"
//         ? "https://688981714c55d5c7395288f0.mockapi.io/news/news?archived=false"
//         : "https://688981714c55d5c7395288f0.mockapi.io/news/news?archived=true";

//     fetch(endpoint)
//       .then((res) => res.json())
//       .then((data) => {
//         if (Array.isArray(data)) {
//           setArticles(data);
//         } else {
//           console.error("Fetched data is not an array", data);
//           setArticles([]);
//         }
//       })
//       .catch((err) => {
//         console.error("Failed to fetch articles", err);
//         setArticles([]);
//       });
//   }, [tab]);
//   // console.log("article data", articles[0].id);
//   const handleSelectAll = (e) => {
//     setSelected(e.target.checked ? articles.map((a) => a.id) : []);
//   };

//   const handleSelect = (id) => {
//     setSelected((prev) =>
//       prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
//     );
//   };

//   const openMenu = Boolean(anchorEl);
//   const openBulkMenu = Boolean(bulkAnchorEl);
//   const openDownloadMenu = Boolean(downloadAnchorEl);
//   const openRowMenu = Boolean(rowMenuAnchorEl);

//   const filteredArticles = articles.filter(
//     (a) =>
//       a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       a.publishedBy?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleChangePage = (event, newPage) => setPage(newPage);
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const exportData = (type) => {
//     const data = filteredArticles.map(({ id, ...rest }) => rest);
//     const ws = XLSX.utils.json_to_sheet(data);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Articles");

//     const fileType = type === "csv" ? "csv" : "xlsx";
//     const wbout =
//       type === "csv"
//         ? XLSX.utils.sheet_to_csv(ws)
//         : XLSX.write(wb, { bookType: fileType, type: "array" });
//     const blob = new Blob([wbout], {
//       type:
//         type === "csv" ? "text/csv;charset=utf-8;" : "application/octet-stream",
//     });
//     saveAs(blob, `articles_export.${fileType}`);
//     setDownloadAnchorEl(null);
//   };

//   const handleArchiveSelected = async () => {
//     const updatedArticles = await Promise.all(
//       selected.map(async (id) => {
//         try {
//           const res = await fetch(
//             `https://688981714c55d5c7395288f0.mockapi.io/news/news/${id}`,
//             {
//               method: "PUT",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({ archived: "true" }),
//             }
//           );
//           return res.json();
//         } catch (error) {
//           console.error(`Failed to archive article ${id}`, error);
//           return null;
//         }
//       })
//     );

//     const successfulArchivedIds = updatedArticles
//       .filter((a) => a && a.archived === "true")
//       .map((a) => a.id);

//     setArticles((prev) =>
//       prev.filter((a) => !successfulArchivedIds.includes(a.id))
//     );
//     setSelected([]);
//     setBulkAnchorEl(null);
//   };

//   const handleRowMenuOpen = (event, id) => {
//     setRowMenuAnchorEl(event.currentTarget);
//     setActiveRowId(id);
//   };

//   const handleRowMenuClose = () => {
//     setRowMenuAnchorEl(null);
//     setActiveRowId(null);
//   };

//   const handleDeleteClick = (articleId) => {
//     setArticleToDelete(articleId);
//     setOpenDeleteModal(true);
//     handleRowMenuClose();
//   };

//   const confirmDelete = async () => {
//     try {
//       const response = await fetch(
//         `https://688981714c55d5c7395288f0.mockapi.io/news/news/${articleToDelete}`,
//         {
//           method: "DELETE",
//         }
//       );

//       if (response.ok) {
//         setArticles((prev) =>
//           prev.filter((article) => article.id !== articleToDelete)
//         );
//         setSelected((prev) => prev.filter((id) => id !== articleToDelete));
//       } else {
//         console.error("Failed to delete article");
//       }
//     } catch (error) {
//       console.error("Error deleting article:", error);
//     } finally {
//       setOpenDeleteModal(false);
//       setArticleToDelete(null);
//     }
//   };

//   return (
//     <Box p={2}>
//       <Box
//         display="flex"
//         justifyContent="space-between"
//         alignItems="center"
//         mb={2}
//       >
//         <Box display="flex" gap={1}>
//           {selected.length > 0 && (
//             <Button
//               variant="contained"
//               color="primary"
//               endIcon={<ExpandMore />}
//               onClick={(e) => setBulkAnchorEl(e.currentTarget)}
//             >
//               Bulk Actions
//             </Button>
//           )}
//           <IconButton>
//             <BarChart />
//           </IconButton>
//           <Button variant="contained" color="warning">
//             Create Article
//           </Button>
//           <Button
//             variant="text"
//             onClick={() => setTab("active")}
//             style={{
//               borderBottom: tab === "active" ? "2px solid #ccc" : "none",
//             }}
//           >
//             Active
//           </Button>
//           <Button
//             variant="text"
//             onClick={() => setTab("archived")}
//             style={{
//               borderBottom: tab === "archived" ? "2px solid #ccc" : "none",
//             }}
//           >
//             Archived
//           </Button>
//         </Box>

//         <Box display="flex" alignItems="center" gap={1}>
//           <TextField
//             size="small"
//             placeholder="Search by title or publisher..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <Search />
//                 </InputAdornment>
//               ),
//             }}
//           />
//           <IconButton onClick={(e) => setDownloadAnchorEl(e.currentTarget)}>
//             <Download />
//           </IconButton>
//           <IconButton>
//             <FilterList />
//           </IconButton>
//           <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
//             <MoreVert />
//           </IconButton>
//         </Box>
//       </Box>

//       <Table size="small">
//         <TableHead>
//           <TableRow>
//             <TableCell>
//               <Checkbox
//                 onChange={handleSelectAll}
//                 checked={
//                   selected.length === filteredArticles.length &&
//                   filteredArticles.length > 0
//                 }
//               />
//             </TableCell>
//             <TableCell>Title</TableCell>
//             <TableCell>News Category(s)</TableCell>
//             <TableCell>Views</TableCell>
//             <TableCell>% Viewed</TableCell>
//             <TableCell>Created On</TableCell>
//             <TableCell>Published By</TableCell>
//             <TableCell>Featured</TableCell>
//             <TableCell>Pinned</TableCell>
//             <TableCell>Status</TableCell>
//             <TableCell>Archive On</TableCell>
//             <TableCell>Scheduled</TableCell>
//             <TableCell>Actions</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {filteredArticles
//             .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//             .map((article) => (
//               <TableRow key={article.id}>
//                 <TableCell>
//                   <Checkbox
//                     checked={selected.includes(article.id)}
//                     onChange={() => handleSelect(article.id)}
//                   />
//                 </TableCell>
//                 <TableCell>{article.title}</TableCell>
//                 <TableCell>{article.category || "-"}</TableCell>
//                 <TableCell>{article.views || 0}</TableCell>
//                 <TableCell>{article.viewedPercentage || "0.0%"}</TableCell>
//                 <TableCell>{article.createdAt || "-"}</TableCell>
//                 <TableCell>{article.createdBy || "-"}</TableCell>
//                 <TableCell>{article.featured ? "Yes" : "No"}</TableCell>
//                 <TableCell>{article.pinned ? "Yes" : "No"}</TableCell>
//                 <TableCell>{article.status || "-"}</TableCell>
//                 <TableCell>{article.archivedOn || "-"}</TableCell>
//                 <TableCell>{article.scheduled || "-"}</TableCell>
//                 <TableCell>
//                   <IconButton onClick={(e) => handleRowMenuOpen(e, article.id)}>
//                     <MoreVert />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//         </TableBody>
//       </Table>

//       <TablePagination
//         rowsPerPageOptions={[5, 10, 25]}
//         component="div"
//         count={filteredArticles.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />

//       <Menu
//         anchorEl={bulkAnchorEl}
//         open={openBulkMenu}
//         onClose={() => setBulkAnchorEl(null)}
//       >
//         <MenuItem>Change Permissions</MenuItem>
//         <MenuItem>Download Viewer Lists</MenuItem>
//         <MenuItem onClick={() => setOpenArchiveModal(true)}>Archive</MenuItem>
//         <MenuItem>Remove Featured</MenuItem>
//         <MenuItem>Remove Pinned</MenuItem>
//         <MenuItem>Export</MenuItem>
//       </Menu>

//       <Menu
//         anchorEl={anchorEl}
//         open={openMenu}
//         onClose={() => setAnchorEl(null)}
//       >
//         <MenuItem>Manage News Categories</MenuItem>
//       </Menu>

//       <Menu
//         anchorEl={downloadAnchorEl}
//         open={openDownloadMenu}
//         onClose={() => setDownloadAnchorEl(null)}
//       >
//         <MenuItem onClick={() => exportData("csv")}>Export as CSV</MenuItem>
//         <MenuItem onClick={() => exportData("xlsx")}>Export as Excel</MenuItem>
//       </Menu>

//       <Menu
//         anchorEl={rowMenuAnchorEl}
//         open={openRowMenu}
//         onClose={handleRowMenuClose}
//       >
//         <MenuItem
//           onClick={() => navigate(`/manage/newsarticle/${activeRowId}/details`)}
//         >
//           Edit
//         </MenuItem>

//         <MenuItem>Clone</MenuItem>
//         <MenuItem onClick={() => handleDeleteClick(activeRowId)}>
//           Delete
//         </MenuItem>
//         <MenuItem>Viewer List</MenuItem>
//         <MenuItem>Export</MenuItem>
//       </Menu>

//       <Dialog
//         open={openArchiveModal}
//         onClose={() => setOpenArchiveModal(false)}
//       >
//         <DialogTitle>Confirm Archive</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to archive the selected content?
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenArchiveModal(false)} color="primary">
//             No
//           </Button>
//           <Button
//             onClick={async () => {
//               await handleArchiveSelected();
//               setOpenArchiveModal(false);
//             }}
//             color="error"
//             autoFocus
//           >
//             Yes, Archive
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
//         <DialogTitle>Confirm Delete</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to delete this article? This action cannot be
//             undone.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDeleteModal(false)} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={confirmDelete} color="error" autoFocus>
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default ManageArticles;

import React, { useState, useEffect } from "react";
import { useNavigate, useLoaderData } from "react-router-dom";
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  IconButton,
  Button,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Skeleton,
  Snackbar,
  Alert,
  CircularProgress,
  Switch,
  Tooltip,
} from "@mui/material";
import {
  MoreVert,
  Search,
  BarChart,
  FilterList,
  Download,
  ExpandMore,
} from "@mui/icons-material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { httpClient } from "../../utils/httpClientSetup";

// Loader function to be used in route configuration
export async function loader({ request }) {
  const url = new URL(request.url);
  const tab = url.searchParams.get("tab") || "active";
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Unauthenticated");
  }
  
  try {
    const response = await httpClient.get("news");
    
    if (response.data.success) {
      const allArticles = response.data.data;
      const filteredArticles = allArticles.filter(article => 
        tab === "archived" 
          ? article.status === "archived" 
          : article.status !== "archived"
      );
      return { articles: filteredArticles };
    }
    throw new Error("Failed to fetch articles");
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch articles");
  }
}

const ManageArticles = () => {
  const navigate = useNavigate();
  const { articles: initialArticles } = useLoaderData();

  // State declarations
  const [articles, setArticles] = useState(initialArticles);
  const [filteredArticles, setFilteredArticles] = useState(initialArticles);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [tab, setTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);
  const [bulkAnchorEl, setBulkAnchorEl] = useState(null);
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);
  const [rowMenuAnchorEl, setRowMenuAnchorEl] = useState(null);
  const [activeRowId, setActiveRowId] = useState(null);
  const [openArchiveModal, setOpenArchiveModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch articles when tab changes
  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const response = await httpClient.get("news");
      
      if (response.data.success) {
        const allArticles = response.data.data;
        const filteredArticles = allArticles.filter(article => 
          tab === "archived" 
            ? article.status === "archived" 
            : article.status !== "archived"
        );
        setArticles(filteredArticles);
        setFilteredArticles(filteredArticles);
        setSelected([]);
      } else {
        setError(response.data.message || "Failed to fetch articles");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load articles");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [tab]);

  // Filter articles based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter(
        (article) =>
          article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (article.published_by?.toString() || "").includes(searchTerm)
      );
      setFilteredArticles(filtered);
    }
    setPage(0);
  }, [searchTerm, articles]);

  // Helper functions
  const handleMenuOpen = (setter) => (event) => setter(event.currentTarget);
  const handleMenuClose = (setter) => () => setter(null);

  const handleSelectAll = (e) => {
    setSelected(e.target.checked ? filteredArticles.map((a) => a.id) : []);
  };

  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  // Toggle publish status
  const handleTogglePublish = async (articleId, currentStatus) => {
    if (currentStatus === "archived") {
      setSnackbar({
        open: true,
        message: "Cannot modify status of archived articles",
        severity: "warning",
      });
      return;
    }

    setIsActionLoading(true);
    try {
      const newStatus = currentStatus === "published" ? "unpublished" : "published";
      const response = await httpClient.put(`news/${articleId}`, {
        status: newStatus
      });
      
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: `Article ${newStatus} successfully`,
          severity: "success",
        });
        fetchArticles();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to update article status",
        severity: "error",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  // Export data
  const exportData = (type) => {
    const data = filteredArticles.map((article) => ({
      Title: article.title,
      Slug: article.slug,
      Status: article.status,
      Views: article.views,
      Featured: article.featured,
      Pinned: article.pinned,
      "Created At": article.created_at,
      "Published By": article.published_by,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Articles");

    const fileType = type === "csv" ? "csv" : "xlsx";
    const wbout =
      type === "csv"
        ? XLSX.utils.sheet_to_csv(ws)
        : XLSX.write(wb, { bookType: fileType, type: "array" });
    const blob = new Blob([wbout], {
      type:
        type === "csv" ? "text/csv;charset=utf-8;" : "application/octet-stream",
    });
    saveAs(blob, `articles_export.${fileType}`);
    setDownloadAnchorEl(null);
  };

  // Archive actions
  const handleArchiveSelected = async () => {
    setIsActionLoading(true);
    try {
      const responses = await Promise.all(
        selected.map(id =>
          httpClient.put(`news/${id}`, { 
            status: "archived",
            archived_at: new Date().toISOString()
          })
        )
      );

      const successfulArchives = responses.filter(
        response => response.data.success
      );

      if (successfulArchives.length > 0) {
        setSnackbar({
          open: true,
          message: `Successfully archived ${successfulArchives.length} article(s)`,
          severity: "success",
        });
        fetchArticles();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to archive articles",
        severity: "error",
      });
    } finally {
      setIsActionLoading(false);
      setOpenArchiveModal(false);
    }
  };

  const handleUnarchiveSelected = async () => {
    setIsActionLoading(true);
    try {
      const responses = await Promise.all(
        selected.map(id =>
          httpClient.put(`news/${id}`, { status: "unpublished" })
        )
      );

      const successfulUnarchives = responses.filter(
        response => response.data.success
      );

      if (successfulUnarchives.length > 0) {
        setSnackbar({
          open: true,
          message: `Successfully unarchived ${successfulUnarchives.length} article(s)`,
          severity: "success",
        });
        fetchArticles();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to unarchive articles",
        severity: "error",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  // Delete actions
  const handleDeleteClick = (id) => {
    setArticleToDelete(id);
    setOpenDeleteModal(true);
    handleMenuClose(setRowMenuAnchorEl)();
  };

  const confirmDelete = async () => {
    setIsActionLoading(true);
    try {
      const response = await httpClient.delete(`news/${articleToDelete}`);
      
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: "Article deleted successfully",
          severity: "success",
        });
        fetchArticles();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to delete article",
        severity: "error",
      });
    } finally {
      setIsActionLoading(false);
      setOpenDeleteModal(false);
      setArticleToDelete(null);
    }
  };

  // Skeleton loader
  const renderSkeletonRows = () => {
    return Array(rowsPerPage).fill(0).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell><Skeleton variant="rectangular" width={20} height={20} /></TableCell>
        <TableCell><Skeleton variant="text" width={200} /></TableCell>
        <TableCell><Skeleton variant="text" width={100} /></TableCell>
        <TableCell><Skeleton variant="text" width={50} /></TableCell>
        <TableCell><Skeleton variant="text" width={50} /></TableCell>
        <TableCell><Skeleton variant="text" width={120} /></TableCell>
        <TableCell><Skeleton variant="text" width={80} /></TableCell>
        <TableCell><Skeleton variant="text" width={50} /></TableCell>
        <TableCell><Skeleton variant="text" width={50} /></TableCell>
        <TableCell><Skeleton variant="text" width={80} /></TableCell>
        <TableCell><Skeleton variant="text" width={120} /></TableCell>
        <TableCell><Skeleton variant="text" width={100} /></TableCell>
        <TableCell><Skeleton variant="circular" width={32} height={32} /></TableCell>
      </TableRow>
    ));
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Box p={2}>
      {/* Header with controls */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" gap={1}>
          {selected.length > 0 && (
            <Button
              variant="contained"
              color="primary"
              endIcon={<ExpandMore />}
              onClick={handleMenuOpen(setBulkAnchorEl)}
            >
              Bulk Actions
            </Button>
          )}
          <IconButton>
            <BarChart />
          </IconButton>
          <Button 
            variant="contained" 
            color="warning" 
            onClick={() => navigate("/manage/newsarticle/create")}
          >
            Create Article
          </Button>
          <Button
            variant="text"
            onClick={() => setTab("active")}
            style={{
              borderBottom: tab === "active" ? "2px solid #ccc" : "none",
            }}
          >
            Active
          </Button>
          <Button
            variant="text"
            onClick={() => setTab("archived")}
            style={{
              borderBottom: tab === "archived" ? "2px solid #ccc" : "none",
            }}
          >
            Archived
          </Button>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <TextField
            size="small"
            placeholder="Search by title or publisher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <IconButton onClick={handleMenuOpen(setDownloadAnchorEl)}>
            <Download />
          </IconButton>
          <IconButton>
            <FilterList />
          </IconButton>
          <IconButton onClick={handleMenuOpen(setAnchorEl)}>
            <MoreVert />
          </IconButton>
        </Box>
      </Box>

      {/* Error display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Table */}
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <Checkbox
                onChange={handleSelectAll}
                checked={
                  selected.length === filteredArticles.length &&
                  filteredArticles.length > 0
                }
              />
            </TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Slug</TableCell>
            <TableCell>Views</TableCell>
            <TableCell>% Viewed</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Published By</TableCell>
            <TableCell>Featured</TableCell>
            <TableCell>Pinned</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Archived At</TableCell>
            <TableCell>Schedule</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            renderSkeletonRows()
          ) : filteredArticles.length > 0 ? (
            filteredArticles
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(article.id)}
                      onChange={() => handleSelect(article.id)}
                    />
                  </TableCell>
                  <TableCell>{article.title}</TableCell>
                  <TableCell>{article.slug}</TableCell>
                  <TableCell>{article.views}</TableCell>
                  <TableCell>{article.percent_viewed}%</TableCell>
                  <TableCell>{formatDate(article.created_at)}</TableCell>
                  <TableCell>{article.published_by}</TableCell>
                  <TableCell>{article.featured ? "Yes" : "No"}</TableCell>
                  <TableCell>{article.pinned ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    {article.status === "published" 
                      ? "Published" 
                      : article.status === "archived" 
                        ? "Archived" 
                        : "Unpublished"}
                  </TableCell>
                  <TableCell>{formatDate(article.archived_at)}</TableCell>
                  <TableCell>{article.schedule || "-"}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Tooltip 
                        title={article.status === "published" ? "Unpublish" : "Publish"} 
                        placement="top"
                      >
                        <Switch
                          checked={article.status === "published"}
                          onChange={() => handleTogglePublish(article.id, article.status)}
                          color="primary"
                          size="small"
                          disabled={article.status === "archived"}
                        />
                      </Tooltip>
                      <IconButton
                        onClick={(e) => {
                          setActiveRowId(article.id);
                          handleMenuOpen(setRowMenuAnchorEl)(e);
                        }}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
          ) : (
            <TableRow>
              <TableCell colSpan={13} align="center">
                No articles found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredArticles.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Bulk Actions Menu */}
      <Menu
        anchorEl={bulkAnchorEl}
        open={Boolean(bulkAnchorEl)}
        onClose={handleMenuClose(setBulkAnchorEl)}
      >
        <MenuItem>Change Permissions</MenuItem>
        <MenuItem>Download Viewer Lists</MenuItem>
        {tab === "active" ? (
          <MenuItem onClick={() => setOpenArchiveModal(true)}>Archive</MenuItem>
        ) : (
          <MenuItem onClick={handleUnarchiveSelected}>Unarchive</MenuItem>
        )}
        <MenuItem>Remove Featured</MenuItem>
        <MenuItem>Remove Pinned</MenuItem>
        <MenuItem onClick={() => exportData("csv")}>Export</MenuItem>
      </Menu>

      {/* Settings Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose(setAnchorEl)}
      >
        <MenuItem>Manage News Categories</MenuItem>
      </Menu>

      {/* Download Menu */}
      <Menu
        anchorEl={downloadAnchorEl}
        open={Boolean(downloadAnchorEl)}
        onClose={handleMenuClose(setDownloadAnchorEl)}
      >
        <MenuItem onClick={() => exportData("csv")}>Export as CSV</MenuItem>
        <MenuItem onClick={() => exportData("xlsx")}>Export as Excel</MenuItem>
      </Menu>

      {/* Row Actions Menu */}
      <Menu
        anchorEl={rowMenuAnchorEl}
        open={Boolean(rowMenuAnchorEl)}
        onClose={handleMenuClose(setRowMenuAnchorEl)}
      >
        <MenuItem onClick={() => navigate(`/manage/newsarticle/${activeRowId}/details`)}>
          Edit
        </MenuItem>
        <MenuItem>Clone</MenuItem>
        {tab === "active" ? (
          <MenuItem onClick={() => {
            setArticleToDelete(activeRowId);
            setOpenArchiveModal(true);
            handleMenuClose(setRowMenuAnchorEl)();
          }}>
            Archive
          </MenuItem>
        ) : (
          <MenuItem onClick={() => {
            handleUnarchiveSelected([activeRowId]);
            handleMenuClose(setRowMenuAnchorEl)();
          }}>
            Unarchive
          </MenuItem>
        )}
        <MenuItem onClick={() => handleDeleteClick(activeRowId)}>
          Delete
        </MenuItem>
        <MenuItem>Viewer List</MenuItem>
        <MenuItem onClick={() => exportData("csv")}>Export</MenuItem>
      </Menu>

      {/* Archive Confirmation Dialog */}
      <Dialog
        open={openArchiveModal}
        onClose={() => setOpenArchiveModal(false)}
      >
        <DialogTitle>Confirm Archive</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to archive {selected.length} selected article(s)?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenArchiveModal(false)} 
            color="primary"
            disabled={isActionLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleArchiveSelected}
            color="error"
            autoFocus
            disabled={isActionLoading}
          >
            {isActionLoading ? "Archiving..." : "Confirm Archive"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this article? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDeleteModal(false)} 
            color="primary"
            disabled={isActionLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            autoFocus
            disabled={isActionLoading}
          >
            {isActionLoading ? "Deleting..." : "Confirm Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Action Loader */}
      {isActionLoading && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          display="flex"
          justifyContent="center"
          alignItems="center"
          bgcolor="rgba(0,0,0,0.1)"
          zIndex={9999}
        >
          <CircularProgress />
        </Box>
      )}

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageArticles;