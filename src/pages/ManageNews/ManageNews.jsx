// *************************************

// import React, { useState, useEffect } from "react";
// import { useNavigate, useLoaderData, useSearchParams } from "react-router-dom";
// import {
//   Box,
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
//   Skeleton,
//   Snackbar,
//   Alert,
//   CircularProgress,
//   Switch,
//   Tooltip,
//   Chip,
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
// import { httpClient } from "../../utils/httpClientSetup";
// import ManageCategoriesModal from "../EditNews/components/CategoriesManager";

// const ARTICLE_STATUS = {
//   PUBLISHED: "PUBLISHED",
//   DRAFT: "DRAFT",
//   ARCHIVED: "ARCHIVED",
// };

// export async function loader({ request }) {
//   const url = new URL(request.url);
//   const tab = url.searchParams.get("tab") || "active";
//   const page = url.searchParams.get("page") || 1;
//   const perPage = url.searchParams.get("perPage") || 10;
//   const token = localStorage.getItem("token");

//   if (!token) {
//     throw new Error("Unauthenticated");
//   }

//   try {
//     const endpoint =
//       tab === "archived"
//         ? `news?status=${ARTICLE_STATUS.ARCHIVED}&page=${page}&per_page=${perPage}`
//         : `news?status=${ARTICLE_STATUS.PUBLISHED}|${ARTICLE_STATUS.DRAFT}&page=${page}&per_page=${perPage}`;

//     const response = await httpClient.get(endpoint);

//     if (response.data.success) {
//       return {
//         articles: response.data.data,
//         pagination: response.data.pagination,
//       };
//     }
//     throw new Error("Failed to fetch articles");
//   } catch (error) {
//     throw new Error(
//       error.response?.data?.message || "Failed to fetch articles"
//     );
//   }
// }

// const ManageArticles = () => {
//   const navigate = useNavigate();
//   const [searchParams, setSearchParams] = useSearchParams();
//   const { articles: initialArticles, pagination: initialPagination } =
//     useLoaderData();

//   // State declarations
//   const [categories, setCategories] = useState([]);
//   const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
//   const [openCategoryModal, setOpenCategoryModal] = useState(false);
//   const [articles, setArticles] = useState(initialArticles);
//   const [filteredArticles, setFilteredArticles] = useState(initialArticles);
//   const [pagination, setPagination] = useState(
//     initialPagination || {
//       total: 0,
//       current_page: 1,
//       last_page: 1,
//       per_page: 10,
//     }
//   );
//   const [isActionLoading, setIsActionLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [selected, setSelected] = useState([]);
//   const [tab, setTab] = useState(searchParams.get("tab") || "active");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [bulkAnchorEl, setBulkAnchorEl] = useState(null);
//   const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);
//   const [rowMenuAnchorEl, setRowMenuAnchorEl] = useState(null);
//   const [activeRowId, setActiveRowId] = useState(null);
//   const [openArchiveModal, setOpenArchiveModal] = useState(false);
//   const [openDeleteModal, setOpenDeleteModal] = useState(false);
//   const [openBulkDeleteModal, setOpenBulkDeleteModal] = useState(false);
//   const [articleToDelete, setArticleToDelete] = useState(null);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   // Fetch articles when tab or pagination changes
//   const fetchArticles = async (
//     newPage = pagination.current_page,
//     newPerPage = pagination.per_page
//   ) => {
//     setIsLoading(true);
//     try {
//       const endpoint =
//         tab === "archived"
//           ? `news?status=${ARTICLE_STATUS.ARCHIVED}&page=${newPage}&per_page=${newPerPage}`
//           : `news?status=${ARTICLE_STATUS.PUBLISHED}|${ARTICLE_STATUS.DRAFT}&page=${newPage}&per_page=${newPerPage}`;

//       const response = await httpClient.get(endpoint);

//       if (response.data.success) {
//         setArticles(response.data.data);
//         filterArticles(response.data.data, searchTerm);
//         setPagination(response.data.pagination);
//         setSelected([]);
//       } else {
//         setError(response.data.message || "Failed to fetch articles");
//       }
//     } catch (error) {
//       setError(error.response?.data?.message || "Failed to load articles");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch categories
//   const fetchCategories = async () => {
//     setIsCategoriesLoading(true);
//     try {
//       const response = await httpClient.get("categories/list");
//       if (response.data.success) {
//         setCategories(
//           response.data.data.map((c) => ({ id: c.id, title: c.title }))
//         );
//       }
//     } catch (error) {
//       showSnackbar("Failed to load categories", "error");
//     } finally {
//       setIsCategoriesLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   // Client-side filtering function
//   const filterArticles = (articlesToFilter, searchTerm) => {
//     let filtered = articlesToFilter;

//     if (searchTerm.trim() !== "") {
//       filtered = filtered.filter(
//         (article) =>
//           article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           (article.publisher?.name?.toLowerCase() || "").includes(
//             searchTerm.toLowerCase()
//           )
//       );
//     }

//     setFilteredArticles(filtered);
//   };

//   useEffect(() => {
//     const currentPage = parseInt(searchParams.get("page")) || 1;
//     const currentPerPage = parseInt(searchParams.get("perPage")) || 10;
//     fetchArticles(currentPage, currentPerPage);
//   }, [tab, searchParams]);

//   // Filter articles based on search term
//   useEffect(() => {
//     filterArticles(articles, searchTerm);
//   }, [searchTerm, articles]);

//   // Helper functions
//   const handleMenuOpen = (setter) => (event) => setter(event.currentTarget);
//   const handleMenuClose = (setter) => () => setter(null);

//   const handleSelectAll = (e) => {
//     setSelected(e.target.checked ? filteredArticles.map((a) => a.id) : []);
//   };

//   const handleSelect = (id) => {
//     setSelected((prev) =>
//       prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
//     );
//   };
//   const handleCategoriesUpdated = () => {
//     // refresh categories in form
//     fetchCategories();
//   };
//   const handleChangePage = (_, newPage) => {
//     searchParams.set("page", newPage + 1);
//     setSearchParams(searchParams);
//   };

//   const handleChangeRowsPerPage = (e) => {
//     const newPerPage = parseInt(e.target.value, 10);
//     searchParams.set("perPage", newPerPage);
//     searchParams.set("page", 1);
//     setSearchParams(searchParams);
//   };

//   const handleTogglePublish = async (articleId, currentStatus) => {
//     if (currentStatus === ARTICLE_STATUS.ARCHIVED) {
//       setSnackbar({
//         open: true,
//         message: "Cannot modify status of archived articles",
//         severity: "warning",
//       });
//       return;
//     }

//     setIsActionLoading(true);
//     try {
//       const newStatus =
//         currentStatus === ARTICLE_STATUS.PUBLISHED
//           ? ARTICLE_STATUS.DRAFT
//           : ARTICLE_STATUS.PUBLISHED;

//       const response = await httpClient.patch(`news/${articleId}`, {
//         status: newStatus,
//       });

//       if (response.data.success) {
//         setSnackbar({
//           open: true,
//           message: `Article ${
//             newStatus === ARTICLE_STATUS.PUBLISHED
//               ? "published"
//               : "saved as draft"
//           } successfully`,
//           severity: "success",
//         });

//         setArticles((prevArticles) =>
//           prevArticles.map((article) =>
//             article.id === articleId
//               ? { ...article, status: newStatus }
//               : article
//           )
//         );
//         setFilteredArticles((prev) =>
//           prev.map((article) =>
//             article.id === articleId
//               ? { ...article, status: newStatus }
//               : article
//           )
//         );
//       } else {
//         throw new Error(response.data.message || "Failed to update status");
//       }
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message:
//           error.response?.data?.message || "Failed to update article status",
//         severity: "error",
//       });
//     } finally {
//       setIsActionLoading(false);
//     }
//   };

//   const handleArchiveArticle = async (articleId) => {
//     setIsActionLoading(true);
//     try {
//       const response = await httpClient.patch(`news/${articleId}`, {
//         status: ARTICLE_STATUS.ARCHIVED,
//         archived_at: new Date().toISOString(),
//       });

//       if (response.data.success) {
//         setSnackbar({
//           open: true,
//           message: "Article archived successfully",
//           severity: "success",
//         });
//         fetchArticles();
//       }
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: error.response?.data?.message || "Failed to archive article",
//         severity: "error",
//       });
//     } finally {
//       setIsActionLoading(false);
//       setOpenArchiveModal(false);
//     }
//   };

//   const handleUnarchiveArticle = async (articleId) => {
//     setIsActionLoading(true);
//     try {
//       const response = await httpClient.patch(`news/${articleId}`, {
//         status: ARTICLE_STATUS.DRAFT,
//         archived_at: null,
//       });

//       if (response.data.success) {
//         setSnackbar({
//           open: true,
//           message: "Article unarchived successfully",
//           severity: "success",
//         });
//         fetchArticles();
//       }
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: error.response?.data?.message || "Failed to unarchive article",
//         severity: "error",
//       });
//     } finally {
//       setIsActionLoading(false);
//     }
//   };

//   const handleBulkArchive = async () => {
//     setIsActionLoading(true);
//     try {
//       const responses = await Promise.all(
//         selected.map((id) =>
//           httpClient.patch(`news/${id}`, {
//             status: ARTICLE_STATUS.ARCHIVED,
//             archived_at: new Date().toISOString(),
//           })
//         )
//       );

//       const successfulArchives = responses.filter(
//         (response) => response.data.success
//       );

//       if (successfulArchives.length > 0) {
//         setSnackbar({
//           open: true,
//           message: `Successfully archived ${successfulArchives.length} article(s)`,
//           severity: "success",
//         });
//         fetchArticles();
//       }
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: error.response?.data?.message || "Failed to archive articles",
//         severity: "error",
//       });
//     } finally {
//       setIsActionLoading(false);
//       setOpenArchiveModal(false);
//     }
//   };

//   const handleBulkUnarchive = async () => {
//     setIsActionLoading(true);
//     try {
//       const responses = await Promise.all(
//         selected.map((id) =>
//           httpClient.patch(`news/${id}`, {
//             status: ARTICLE_STATUS.DRAFT,
//             archived_at: null,
//           })
//         )
//       );

//       const successfulUnarchives = responses.filter(
//         (response) => response.data.success
//       );

//       if (successfulUnarchives.length > 0) {
//         setSnackbar({
//           open: true,
//           message: `Successfully unarchived ${successfulUnarchives.length} article(s)`,
//           severity: "success",
//         });
//         fetchArticles();
//       }
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message:
//           error.response?.data?.message || "Failed to unarchive articles",
//         severity: "error",
//       });
//     } finally {
//       setIsActionLoading(false);
//     }
//   };

//   const handleCloneArticle = async (articleId) => {
//     setIsActionLoading(true);
//     try {
//       const response = await httpClient.get(`news/clone/${articleId}`);

//       if (response.data.success) {
//         setSnackbar({
//           open: true,
//           message: "Article cloned successfully",
//           severity: "success",
//         });
//         // Refresh the articles list to show the new clone
//         fetchArticles();
//       } else {
//         throw new Error(response.data.message || "Failed to clone article");
//       }
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: error.response?.data?.message || "Failed to clone article",
//         severity: "error",
//       });
//     } finally {
//       setIsActionLoading(false);
//       handleMenuClose(setRowMenuAnchorEl)();
//     }
//   };

//   const handleBulkDelete = async () => {
//     setIsActionLoading(true);
//     try {
//       const responses = await Promise.all(
//         selected.map((id) => httpClient.delete(`news/${id}`))
//       );

//       const successfulDeletes = responses.filter(
//         (response) => response.data.success
//       );

//       if (successfulDeletes.length > 0) {
//         setSnackbar({
//           open: true,
//           message: `Successfully deleted ${successfulDeletes.length} article(s)`,
//           severity: "success",
//         });
//         fetchArticles();
//       }
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: error.response?.data?.message || "Failed to delete articles",
//         severity: "error",
//       });
//     } finally {
//       setIsActionLoading(false);
//       setOpenBulkDeleteModal(false);
//       handleMenuClose(setBulkAnchorEl)();
//     }
//   };

//   const handleDeleteClick = (id) => {
//     setArticleToDelete(id);
//     setOpenDeleteModal(true);
//     handleMenuClose(setRowMenuAnchorEl)();
//   };

//   const confirmDelete = async () => {
//     setIsActionLoading(true);
//     try {
//       const response = await httpClient.delete(`news/${articleToDelete}`);

//       if (response.data.success) {
//         setSnackbar({
//           open: true,
//           message: "Article deleted successfully",
//           severity: "success",
//         });
//         fetchArticles();
//       }
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: error.response?.data?.message || "Failed to delete article",
//         severity: "error",
//       });
//     } finally {
//       setIsActionLoading(false);
//       setOpenDeleteModal(false);
//       setArticleToDelete(null);
//     }
//   };
//   const exportData = async (type, selectedOnly = false) => {
//     try {
//       // If exporting selected news
//       const ids = selectedOnly && selected.length > 0 ? selected : [];

//       if (selectedOnly && ids.length === 0) {
//         setSnackbar({
//           open: true,
//           message: "Please select at least one article to export.",
//           severity: "warning",
//         });
//         return;
//       }

//       // If multiple IDs selected, join them with commas => /news/export/1,2,3
//       const idParam = ids.length > 0 ? ids.join(",") : "all";

//       // API endpoint
//       const response = await httpClient.get(`/news/export/${idParam}`, {
//         responseType: "blob", // <-- Important for file download
//       });

//       // Determine file type based on API response
//       const contentDisposition = response.headers["content-disposition"];
//       let fileName = "articles_export";
//       if (contentDisposition) {
//         const match = contentDisposition.match(/filename="(.+)"/);
//         if (match && match[1]) fileName = match[1];
//       }

//       // Create a downloadable file
//       const blob = new Blob([response.data]);
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = fileName;
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       window.URL.revokeObjectURL(url);

//       setSnackbar({
//         open: true,
//         message: "Export successful!",
//         severity: "success",
//       });
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: "Failed to export data.",
//         severity: "error",
//       });
//     } finally {
//       setDownloadAnchorEl(null);
//     }
//   };

//   // const exportData = (type) => {
//   //   const data = filteredArticles.map((article) => ({
//   //     Title: article.title,
//   //     Slug: article.slug,
//   //     Status: article.status,
//   //     Views: article.views,
//   //     Featured: article.featured,
//   //     Pinned: article.pinned,
//   //     "Created At": article.created_at,
//   //     "Publisher": article.publisher ? article.publisher.name : 'Unknown',
//   //   }));

//   //   const ws = XLSX.utils.json_to_sheet(data);
//   //   const wb = XLSX.utils.book_new();
//   //   XLSX.utils.book_append_sheet(wb, ws, "Articles");

//   //   const fileType = type === "csv" ? "csv" : "xlsx";
//   //   const wbout =
//   //     type === "csv"
//   //       ? XLSX.utils.sheet_to_csv(ws)
//   //       : XLSX.write(wb, { bookType: fileType, type: "array" });
//   //   const blob = new Blob([wbout], {
//   //     type:
//   //       type === "csv" ? "text/csv;charset=utf-8;" : "application/octet-stream",
//   //   });
//   //   saveAs(blob, `articles_export.${fileType}`);
//   //   setDownloadAnchorEl(null);
//   // };

//   const renderSkeletonRows = () => {
//     return Array(pagination.per_page)
//       .fill(0)
//       .map((_, index) => (
//         <TableRow key={`skeleton-${index}`}>
//           <TableCell>
//             <Skeleton variant="rectangular" width={20} height={20} />
//           </TableCell>
//           <TableCell>
//             <Skeleton variant="text" width={200} />
//           </TableCell>
//           <TableCell>
//             <Skeleton variant="text" width={100} />
//           </TableCell>
//           <TableCell>
//             <Skeleton variant="text" width={50} />
//           </TableCell>
//           <TableCell>
//             <Skeleton variant="text" width={50} />
//           </TableCell>
//           <TableCell>
//             <Skeleton variant="text" width={120} />
//           </TableCell>
//           <TableCell>
//             <Skeleton variant="text" width={80} />
//           </TableCell>
//           <TableCell>
//             <Skeleton variant="text" width={50} />
//           </TableCell>
//           <TableCell>
//             <Skeleton variant="text" width={50} />
//           </TableCell>
//           <TableCell>
//             <Skeleton variant="text" width={80} />
//           </TableCell>
//           <TableCell>
//             <Skeleton variant="text" width={120} />
//           </TableCell>
//           <TableCell>
//             <Skeleton variant="text" width={100} />
//           </TableCell>
//           <TableCell>
//             <Skeleton variant="circular" width={32} height={32} />
//           </TableCell>
//         </TableRow>
//       ));
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "-";
//     const date = new Date(dateString);
//     return date.toLocaleDateString();
//   };

//   const StatusChip = ({ status }) => {
//     const color =
//       status === ARTICLE_STATUS.PUBLISHED
//         ? "success"
//         : status === ARTICLE_STATUS.ARCHIVED
//         ? "default"
//         : "warning";

//     const label =
//       status === ARTICLE_STATUS.PUBLISHED
//         ? "Published"
//         : status === ARTICLE_STATUS.ARCHIVED
//         ? "Archived"
//         : "Draft";

//     return <Chip label={label} color={color} size="small" />;
//   };

//   const handleTabChange = (newTab) => {
//     setTab(newTab);
//     searchParams.set("tab", newTab);
//     searchParams.set("page", 1);
//     setSearchParams(searchParams);
//   };

//   return (
//     <Box p={2}>
//       {/* Header with controls */}
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
//               onClick={handleMenuOpen(setBulkAnchorEl)}
//               disabled={isActionLoading}
//             >
//               Bulk Actions
//             </Button>
//           )}
//           <IconButton onClick={() => navigate("/reporting/news")}>
//             <BarChart />
//           </IconButton>
//           <Button
//             variant="contained"
//             color="warning"
//             onClick={() => navigate("/manage/newsarticle/create")}
//             disabled={isActionLoading}
//           >
//             Create Article
//           </Button>
//           <Button
//             variant="text"
//             onClick={() => handleTabChange("active")}
//             disabled={isActionLoading}
//             style={{
//               borderBottom: tab === "active" ? "2px solid #ccc" : "none",
//             }}
//           >
//             Active
//           </Button>
//           <Button
//             variant="text"
//             onClick={() => handleTabChange("archived")}
//             disabled={isActionLoading}
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
//             disabled={isActionLoading}
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <Search />
//                 </InputAdornment>
//               ),
//             }}
//           />
//           <IconButton
//             onClick={handleMenuOpen(setDownloadAnchorEl)}
//             disabled={isActionLoading}
//           >
//             <Download />
//           </IconButton>
//           {/* <IconButton disabled={isActionLoading}>
//             <FilterList />
//           </IconButton> */}
//           <IconButton
//             onClick={handleMenuOpen(setAnchorEl)}
//             disabled={isActionLoading}
//           >
//             <MoreVert />
//           </IconButton>
//         </Box>
//       </Box>

//       {/* Error display */}
//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//       )}

//       {/* Table */}
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
//                 disabled={isActionLoading || isLoading}
//               />
//             </TableCell>
//             <TableCell>Title</TableCell>
//             <TableCell>Slug</TableCell>
//             <TableCell>Views</TableCell>
//             <TableCell>% Viewed</TableCell>
//             <TableCell>Created At</TableCell>
//             <TableCell>Publisher</TableCell>
//             <TableCell>Featured</TableCell>
//             <TableCell>Pinned</TableCell>
//             <TableCell>Status</TableCell>
//             <TableCell>Archived At</TableCell>
//             <TableCell>Schedule</TableCell>
//             <TableCell>Actions</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {isLoading ? (
//             renderSkeletonRows()
//           ) : filteredArticles.length > 0 ? (
//             filteredArticles.map((article) => (
//               <TableRow key={article.id}>
//                 <TableCell>
//                   <Checkbox
//                     checked={selected.includes(article.id)}
//                     onChange={() => handleSelect(article.id)}
//                     disabled={isActionLoading}
//                   />
//                 </TableCell>
//                 <TableCell>{article.title}</TableCell>
//                 <TableCell>{article.slug}</TableCell>
//                 <TableCell>{article.views}</TableCell>
//                 <TableCell>{article.percent_viewed}%</TableCell>
//                 <TableCell>{formatDate(article.created_at)}</TableCell>
//                 <TableCell>
//                   {article.publisher ? article.publisher.name : "Unknown"}
//                 </TableCell>
//                 <TableCell>{article.featured === 1 ? "Yes" : "No"}</TableCell>
//                 <TableCell>{article.pinned === 1 ? "Yes" : "No"}</TableCell>
//                 <TableCell>
//                   <StatusChip status={article.status} />
//                 </TableCell>
//                 <TableCell>{formatDate(article.archived_at)}</TableCell>
//                 <TableCell>{article.schedule_at || "-"}</TableCell>
//                 <TableCell>
//                   <Box display="flex" alignItems="center" gap={1}>
//                     {article.status !== ARTICLE_STATUS.ARCHIVED && (
//                       <Tooltip
//                         title={
//                           article.status === ARTICLE_STATUS.PUBLISHED
//                             ? "Unpublish"
//                             : "Publish"
//                         }
//                         placement="top"
//                       >
//                         <Switch
//                           checked={article.status === ARTICLE_STATUS.PUBLISHED}
//                           onChange={() =>
//                             handleTogglePublish(article.id, article.status)
//                           }
//                           color="primary"
//                           size="small"
//                           disabled={isActionLoading}
//                         />
//                       </Tooltip>
//                     )}
//                     <IconButton
//                       onClick={(e) => {
//                         setActiveRowId(article.id);
//                         handleMenuOpen(setRowMenuAnchorEl)(e);
//                       }}
//                       disabled={isActionLoading}
//                     >
//                       <MoreVert />
//                     </IconButton>
//                   </Box>
//                 </TableCell>
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell colSpan={13} align="center">
//                 No articles found
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>

//       {/* Pagination */}
//       <TablePagination
//         rowsPerPageOptions={[5, 10, 25]}
//         component="div"
//         count={pagination.total}
//         rowsPerPage={pagination.per_page}
//         page={pagination.current_page - 1}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//         disabled={isActionLoading || isLoading}
//       />

//       {/* Bulk Actions Menu */}
//       <Menu
//         anchorEl={bulkAnchorEl}
//         open={Boolean(bulkAnchorEl)}
//         onClose={handleMenuClose(setBulkAnchorEl)}
//       >
//         {/* <MenuItem>Change Permissions</MenuItem>
//         <MenuItem>Download Viewer Lists</MenuItem> */}
//         {tab === "active" ? (
//           <MenuItem onClick={() => setOpenArchiveModal(true)}>Archive</MenuItem>
//         ) : (
//           <MenuItem onClick={handleBulkUnarchive}>Unarchive</MenuItem>
//         )}
//         <MenuItem onClick={() => setOpenBulkDeleteModal(true)}>Delete</MenuItem>
//         {/* <MenuItem>Remove Featured</MenuItem>
//         <MenuItem>Remove Pinned</MenuItem> */}
//         <MenuItem onClick={() => exportData("csv")}>Export</MenuItem>
//       </Menu>

//       {/* Settings Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose(setAnchorEl)}
//       >
//         <MenuItem onClick={() => setOpenCategoryModal(true)}>
//           Manage News Categories
//         </MenuItem>
//         <ManageCategoriesModal
//           open={openCategoryModal}
//           onClose={() => setOpenCategoryModal(false)}
//           onCategoriesUpdated={handleCategoriesUpdated}
//         />
//       </Menu>

//       {/* Download Menu */}
//       <Menu
//         anchorEl={downloadAnchorEl}
//         open={Boolean(downloadAnchorEl)}
//         onClose={handleMenuClose(setDownloadAnchorEl)}
//       >
//         <MenuItem onClick={() => exportData("csv")}>Export as CSV</MenuItem>
//         <MenuItem onClick={() => exportData("xlsx")}>Export as Excel</MenuItem>
//       </Menu>

//       {/* Row Actions Menu */}
//       <Menu
//         anchorEl={rowMenuAnchorEl}
//         open={Boolean(rowMenuAnchorEl)}
//         onClose={handleMenuClose(setRowMenuAnchorEl)}
//       >
//         <MenuItem
//           onClick={() => navigate(`/manage/newsarticle/${activeRowId}/details`)}
//           disabled={isActionLoading}
//         >
//           Edit
//         </MenuItem>
//         <MenuItem
//           onClick={() => handleCloneArticle(activeRowId)}
//           disabled={isActionLoading}
//         >
//           Clone
//         </MenuItem>
//         {tab === "active" ? (
//           <MenuItem
//             onClick={() => {
//               setArticleToDelete(activeRowId);
//               setOpenArchiveModal(true);
//               handleMenuClose(setRowMenuAnchorEl)();
//             }}
//             disabled={isActionLoading}
//           >
//             Archive
//           </MenuItem>
//         ) : (
//           <MenuItem
//             onClick={() => {
//               handleUnarchiveArticle(activeRowId);
//               handleMenuClose(setRowMenuAnchorEl)();
//             }}
//             disabled={isActionLoading}
//           >
//             Unarchive
//           </MenuItem>
//         )}
//         <MenuItem
//           onClick={() => handleDeleteClick(activeRowId)}
//           disabled={isActionLoading}
//         >
//           Delete
//         </MenuItem>
//         <MenuItem disabled={isActionLoading}>Viewer List</MenuItem>
//         <MenuItem onClick={() => exportData("csv")} disabled={isActionLoading}>
//           Export
//         </MenuItem>
//       </Menu>

//       {/* Archive Confirmation Dialog */}
//       <Dialog
//         open={openArchiveModal}
//         onClose={() => setOpenArchiveModal(false)}
//       >
//         <DialogTitle>
//           {selected.length > 1 ? "Archive Articles" : "Archive Article"}
//         </DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             {selected.length > 1
//               ? `Are you sure you want to archive ${selected.length} selected articles?`
//               : "Are you sure you want to archive this article?"}
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button
//             onClick={() => setOpenArchiveModal(false)}
//             color="primary"
//             disabled={isActionLoading}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={() => {
//               if (selected.length > 0) {
//                 handleBulkArchive();
//               } else if (articleToDelete) {
//                 handleArchiveArticle(articleToDelete);
//               }
//             }}
//             color="error"
//             autoFocus
//             disabled={isActionLoading}
//           >
//             {isActionLoading ? "Archiving..." : "Confirm Archive"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
//         <DialogTitle>Confirm Delete</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to delete this article? This action cannot be
//             undone.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button
//             onClick={() => setOpenDeleteModal(false)}
//             color="primary"
//             disabled={isActionLoading}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={confirmDelete}
//             color="error"
//             autoFocus
//             disabled={isActionLoading}
//           >
//             {isActionLoading ? "Deleting..." : "Confirm Delete"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Bulk Delete Confirmation Dialog */}
//       <Dialog
//         open={openBulkDeleteModal}
//         onClose={() => setOpenBulkDeleteModal(false)}
//       >
//         <DialogTitle>Confirm Bulk Delete</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to delete {selected.length} selected articles?
//             This action cannot be undone.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button
//             onClick={() => setOpenBulkDeleteModal(false)}
//             color="primary"
//             disabled={isActionLoading}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleBulkDelete}
//             color="error"
//             autoFocus
//             disabled={isActionLoading}
//           >
//             {isActionLoading ? "Deleting..." : "Confirm Delete"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Action Loader */}
//       {isActionLoading && (
//         <Box
//           position="fixed"
//           top={0}
//           left={0}
//           right={0}
//           bottom={0}
//           display="flex"
//           justifyContent="center"
//           alignItems="center"
//           bgcolor="rgba(0,0,0,0.1)"
//           zIndex={9999}
//         >
//           <CircularProgress />
//         </Box>
//       )}

//       {/* Snackbar Notification */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={2000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Alert
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           severity={snackbar.severity}
//           variant="filled"
//           sx={{ width: "100%" }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default ManageArticles;

// ***********************************************************

import React, { useState, useEffect } from "react";
import { useNavigate, useLoaderData, useSearchParams } from "react-router-dom";
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
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  MoreVert,
  Search,
  BarChart,
  Download,
  ExpandMore,
} from "@mui/icons-material";
import { httpClient } from "../../utils/httpClientSetup";
import ManageCategoriesModal from "../EditNews/components/CategoriesManager";

const ARTICLE_STATUS = {
  PUBLISHED: "PUBLISHED",
  DRAFT: "DRAFT",
  ARCHIVED: "ARCHIVED",
};

export async function loader({ request }) {
  const url = new URL(request.url);
  const tab = url.searchParams.get("tab") || "active";
  const page = url.searchParams.get("page") || 1;
  const perPage = url.searchParams.get("perPage") || 10;
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Unauthenticated");
  }
  try {
    const endpoint =
      tab === "archived"
        ? `news?status=${ARTICLE_STATUS.ARCHIVED}&page=${page}&per_page=${perPage}`
        : `news?status=${ARTICLE_STATUS.PUBLISHED}|${ARTICLE_STATUS.DRAFT}&page=${page}&per_page=${perPage}`;
    const response = await httpClient.get(endpoint);
    if (response.data.success) {
      return {
        articles: response.data.data,
        pagination: response.data.pagination,
      };
    }
    throw new Error("Failed to fetch articles");
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch articles"
    );
  }
}

const ManageArticles = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchParams, setSearchParams] = useSearchParams();
  const { articles: initialArticles, pagination: initialPagination } =
    useLoaderData();

  // State declarations
  const [categories, setCategories] = useState([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [articles, setArticles] = useState(initialArticles);
  const [filteredArticles, setFilteredArticles] = useState(initialArticles);
  const [pagination, setPagination] = useState(
    initialPagination || {
      total: 0,
      current_page: 1,
      last_page: 1,
      per_page: isMobile ? 5 : 10,
    }
  );
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [tab, setTab] = useState(searchParams.get("tab") || "active");
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [bulkAnchorEl, setBulkAnchorEl] = useState(null);
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);
  const [rowMenuAnchorEl, setRowMenuAnchorEl] = useState(null);
  const [activeRowId, setActiveRowId] = useState(null);
  const [openArchiveModal, setOpenArchiveModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openBulkDeleteModal, setOpenBulkDeleteModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch articles when tab or pagination or isMobile changes
  const fetchArticles = async (
    newPage = pagination.current_page,
    newPerPage = pagination.per_page
  ) => {
    setIsLoading(true);
    try {
      const endpoint =
        tab === "archived"
          ? `news?status=${ARTICLE_STATUS.ARCHIVED}&page=${newPage}&per_page=${newPerPage}`
          : `news?status=${ARTICLE_STATUS.PUBLISHED}|${ARTICLE_STATUS.DRAFT}&page=${newPage}&per_page=${newPerPage}`;
      const response = await httpClient.get(endpoint);
      if (response.data.success) {
        setArticles(response.data.data);
        filterArticles(response.data.data, searchTerm);
        setPagination(response.data.pagination);
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

  // Fetch categories
  const fetchCategories = async () => {
    setIsCategoriesLoading(true);
    try {
      const response = await httpClient.get("categories/list");
      if (response.data.success) {
        setCategories(
          response.data.data.map((c) => ({ id: c.id, title: c.title }))
        );
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to load categories",
        severity: "error",
      });
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const currentPage = parseInt(searchParams.get("page")) || 1;
    const currentPerPage =
      parseInt(searchParams.get("perPage")) || (isMobile ? 5 : 10);
    fetchArticles(currentPage, currentPerPage);
  }, [tab, searchParams, isMobile]);

  useEffect(() => {
    filterArticles(articles, searchTerm);
  }, [searchTerm, articles]);

  // Update per_page in pagination when screen size changes
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      per_page: isMobile ? 5 : 10,
    }));
  }, [isMobile]);

  // Filter articles based on search term
  const filterArticles = (articlesToFilter, searchTerm) => {
    let filtered = articlesToFilter;
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (article) =>
          article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (article.publisher?.name?.toLowerCase() || "").includes(
            searchTerm.toLowerCase()
          )
      );
    }
    setFilteredArticles(filtered);
  };

  // Menu handlers
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

  const handleChangePage = (_, newPage) => {
    searchParams.set("page", newPage + 1);
    setSearchParams(searchParams);
    setSelected([]);
  };

  const handleChangeRowsPerPage = (e) => {
    const newPerPage = parseInt(e.target.value, 10);
    searchParams.set("perPage", newPerPage);
    searchParams.set("page", 1);
    setSearchParams(searchParams);
  };

  const handleTogglePublish = async (articleId, currentStatus) => {
    if (currentStatus === ARTICLE_STATUS.ARCHIVED) {
      setSnackbar({
        open: true,
        message: "Cannot modify status of archived articles",
        severity: "warning",
      });
      return;
    }
    setIsActionLoading(true);
    try {
      const newStatus =
        currentStatus === ARTICLE_STATUS.PUBLISHED
          ? ARTICLE_STATUS.DRAFT
          : ARTICLE_STATUS.PUBLISHED;
      const response = await httpClient.patch(`news/${articleId}`, {
        status: newStatus,
      });
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: `Article ${
            newStatus === ARTICLE_STATUS.PUBLISHED
              ? "published"
              : "saved as draft"
          } successfully`,
          severity: "success",
        });
        setArticles((prevArticles) =>
          prevArticles.map((article) =>
            article.id === articleId
              ? { ...article, status: newStatus }
              : article
          )
        );
        setFilteredArticles((prev) =>
          prev.map((article) =>
            article.id === articleId
              ? { ...article, status: newStatus }
              : article
          )
        );
      } else {
        throw new Error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message || "Failed to update article status",
        severity: "error",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleArchiveArticle = async (articleId) => {
    setIsActionLoading(true);
    try {
      const response = await httpClient.patch(`news/${articleId}`, {
        status: ARTICLE_STATUS.ARCHIVED,
        archived_at: new Date().toISOString(),
      });
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: "Article archived successfully",
          severity: "success",
        });
        fetchArticles();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to archive article",
        severity: "error",
      });
    } finally {
      setIsActionLoading(false);
      setOpenArchiveModal(false);
    }
  };

  const handleUnarchiveArticle = async (articleId) => {
    setIsActionLoading(true);
    try {
      const response = await httpClient.patch(`news/${articleId}`, {
        status: ARTICLE_STATUS.DRAFT,
        archived_at: null,
      });
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: "Article unarchived successfully",
          severity: "success",
        });
        fetchArticles();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to unarchive article",
        severity: "error",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleBulkArchive = async () => {
    setIsActionLoading(true);
    try {
      const responses = await Promise.all(
        selected.map((id) =>
          httpClient.patch(`news/${id}`, {
            status: ARTICLE_STATUS.ARCHIVED,
            archived_at: new Date().toISOString(),
          })
        )
      );
      const successfulArchives = responses.filter(
        (response) => response.data.success
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

  const handleBulkUnarchive = async () => {
    setIsActionLoading(true);
    try {
      const responses = await Promise.all(
        selected.map((id) =>
          httpClient.patch(`news/${id}`, {
            status: ARTICLE_STATUS.DRAFT,
            archived_at: null,
          })
        )
      );
      const successfulUnarchives = responses.filter(
        (response) => response.data.success
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
        message:
          error.response?.data?.message || "Failed to unarchive articles",
        severity: "error",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCloneArticle = async (articleId) => {
    setIsActionLoading(true);
    try {
      const response = await httpClient.get(`news/clone/${articleId}`);
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: "Article cloned successfully",
          severity: "success",
        });
        fetchArticles();
      } else {
        throw new Error(response.data.message || "Failed to clone article");
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to clone article",
        severity: "error",
      });
    } finally {
      setIsActionLoading(false);
      handleMenuClose(setRowMenuAnchorEl)();
    }
  };

  const handleBulkDelete = async () => {
    setIsActionLoading(true);
    try {
      const responses = await Promise.all(
        selected.map((id) => httpClient.delete(`news/${id}`))
      );
      const successfulDeletes = responses.filter(
        (response) => response.data.success
      );
      if (successfulDeletes.length > 0) {
        setSnackbar({
          open: true,
          message: `Successfully deleted ${successfulDeletes.length} article(s)`,
          severity: "success",
        });
        fetchArticles();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to delete articles",
        severity: "error",
      });
    } finally {
      setIsActionLoading(false);
      setOpenBulkDeleteModal(false);
      handleMenuClose(setBulkAnchorEl)();
    }
  };

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

  // const exportData = async (type, selectedOnly = false) => {
  //   try {
  //     const ids = selectedOnly && selected.length > 0 ? selected : [];
  //     if (selectedOnly && ids.length === 0) {
  //       setSnackbar({
  //         open: true,
  //         message: "Please select at least one article to export.",
  //         severity: "warning",
  //       });
  //       return;
  //     }
  //     const idParam = ids.length > 0 ? ids.join(",") : "all";

  //     const response = await httpClient.get(`/news/export/${idParam}`, {
  //       responseType: "blob",
  //     });

  //     const contentDisposition = response.headers["content-disposition"];
  //     let fileName = "articles_export";
  //     if (contentDisposition) {
  //       const match = contentDisposition.match(/filename="(.+)"/);
  //       if (match && match[1]) fileName = match[1];
  //     }

  //     const blob = new Blob([response.data]);
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = fileName;
  //     document.body.appendChild(a);
  //     a.click();
  //     a.remove();
  //     window.URL.revokeObjectURL(url);
  //     setSnackbar({
  //       open: true,
  //       message: "Export successful!",
  //       severity: "success",
  //     });
  //   } catch (error) {
  //     setSnackbar({
  //       open: true,
  //       message: "Failed to export data.",
  //       severity: "error",
  //     });
  //   } finally {
  //     setDownloadAnchorEl(null);
  //   }
  // };

  const exportData = async (type, selectedOnly = false) => {
    try {
      const ids = selectedOnly && selected.length > 0 ? selected : [];
      if (selectedOnly && ids.length === 0) {
        setSnackbar({
          open: true,
          message: "Please select at least one article to export.",
          severity: "warning",
        });
        return;
      }

      // Build query param string like ids[]=2&ids[]=5 etc.
      const params = new URLSearchParams();
      ids.forEach((id) => {
        params.append("ids[]", id);
      });

      // If no selection, set no ids param to export all
      const queryString = ids.length > 0 ? `?${params.toString()}` : "";

      const response = await httpClient.get(`/news/export${queryString}`, {
        responseType: "blob",
      });

      const contentDisposition = response.headers["content-disposition"];
      let fileName = "articles_export";

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match && match[1]) {
          fileName = match[1];
        }
      }

      // Infer file extension from requested type (fallback)
      let fileExtension = "";

      if (type === "csv") {
        if (!fileName.toLowerCase().endsWith(".csv")) fileExtension = ".csv";
      } else if (type === "xlsx") {
        if (
          !fileName.toLowerCase().endsWith(".xlsx") &&
          !fileName.toLowerCase().endsWith(".xls")
        )
          fileExtension = ".xlsx";
      }

      const mimeTypes = {
        csv: "text/csv;charset=utf-8;",
        xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      };

      const mimeType = mimeTypes[type] || "application/octet-stream";

      const blob = new Blob([response.data], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName + fileExtension;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setSnackbar({
        open: true,
        message: "Export successful!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to export data.",
        severity: "error",
      });
    } finally {
      setDownloadAnchorEl(null);
    }
  };

  //   const exportData = async (type, selectedOnly = false) => {
  //   try {
  //     const ids = selectedOnly && selected.length > 0 ? selected : [];
  //     if (selectedOnly && ids.length === 0) {
  //       setSnackbar({
  //         open: true,
  //         message: "Please select at least one article to export.",
  //         severity: "warning",
  //       });
  //       return;
  //     }

  //     // Build query param string like ids[]=2&ids[]=5 etc.
  //     const params = new URLSearchParams();
  //     ids.forEach((id) => {
  //       params.append("ids[]", id);
  //     });

  //     // If no selection, set no ids param to export all
  //     const queryString = ids.length > 0 ? `?${params.toString()}` : "";

  //     const response = await httpClient.get(`/news/export${queryString}`, {
  //       responseType: "blob",
  //     });

  //     const contentDisposition = response.headers["content-disposition"];
  //     let fileName = "articles_export";

  //     if (contentDisposition) {
  //       const match = contentDisposition.match(/filename="(.+)"/);
  //       if (match && match[1]) {
  //         fileName = match[1];
  //       }
  //     }

  //     // Infer file extension from requested type (fallback)
  //     let fileExtension = "";

  //     if (type === "csv") {
  //       if (!fileName.toLowerCase().endsWith(".csv")) fileExtension = ".csv";
  //     } else if (type === "xlsx") {
  //       if (
  //         !fileName.toLowerCase().endsWith(".xlsx") &&
  //         !fileName.toLowerCase().endsWith(".xls")
  //       )
  //         fileExtension = ".xlsx";
  //     }

  //     const mimeTypes = {
  //       csv: "text/csv;charset=utf-8;",
  //       xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     };

  //     const mimeType = mimeTypes[type] || "application/octet-stream";

  //     const blob = new Blob([response.data], { type: mimeType });
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = fileName + fileExtension;
  //     document.body.appendChild(a);
  //     a.click();
  //     a.remove();
  //     window.URL.revokeObjectURL(url);

  //     setSnackbar({
  //       open: true,
  //       message: "Export successful!",
  //       severity: "success",
  //     });
  //   } catch (error) {
  //     setSnackbar({
  //       open: true,
  //       message: "Failed to export data.",
  //       severity: "error",
  //     });
  //   } finally {
  //     setDownloadAnchorEl(null);
  //   }
  // };
  //   };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const StatusChip = ({ status }) => {
    const color =
      status === ARTICLE_STATUS.PUBLISHED
        ? "success"
        : status === ARTICLE_STATUS.ARCHIVED
        ? "default"
        : "warning";
    const label =
      status === ARTICLE_STATUS.PUBLISHED
        ? "Published"
        : status === ARTICLE_STATUS.ARCHIVED
        ? "Archived"
        : "Draft";
    return <Chip label={label} color={color} size="small" />;
  };

  const handleTabChange = (newTab) => {
    setTab(newTab);
    searchParams.set("tab", newTab);
    searchParams.set("page", 1);
    setSearchParams(searchParams);
  };

  const renderSkeletonRows = () => {
    return Array(pagination.per_page)
      .fill(0)
      .map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          <TableCell>
            <Skeleton variant="rectangular" width={20} height={20} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={isMobile ? 120 : 200} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={isMobile ? 80 : 100} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={50} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={50} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={120} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={isMobile ? 100 : 120} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={50} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={50} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={80} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={isMobile ? 100 : 120} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={isMobile ? 80 : 100} />
          </TableCell>
          <TableCell>
            <Skeleton variant="circular" width={32} height={32} />
          </TableCell>
        </TableRow>
      ));
  };

  return (
    <Box p={isMobile ? 1 : 2}>
      {/* Header with controls */}
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        justifyContent="space-between"
        alignItems={isMobile ? "flex-start" : "center"}
        mb={2}
        gap={1}
      >
        <Box
          display="flex"
          flexWrap="wrap"
          gap={1}
          alignItems="center"
          width={isMobile ? "100%" : "auto"}
        >
          {selected.length > 0 && (
            <Button
              variant="contained"
              color="primary"
              size={isMobile ? "small" : "medium"}
              endIcon={<ExpandMore />}
              onClick={handleMenuOpen(setBulkAnchorEl)}
              disabled={isActionLoading}
            >
              {isMobile ? "Actions" : "Bulk Actions"}
            </Button>
          )}
          <IconButton onClick={() => navigate("/reporting/news")}>
            <BarChart />
          </IconButton>
          <Button
            variant="contained"
            color="warning"
            size={isMobile ? "small" : "medium"}
            onClick={() => navigate("/manage/newsarticle/create")}
            disabled={isActionLoading}
          >
            {isMobile ? "Create" : "Create Article"}
          </Button>
          <Box display="flex" gap={isMobile ? 0.5 : 1}>
            <Button
              variant="text"
              size={isMobile ? "small" : "medium"}
              onClick={() => handleTabChange("active")}
              style={{
                borderBottom: tab === "active" ? "2px solid #ccc" : "none",
                minWidth: isMobile ? 60 : "auto",
              }}
              disabled={isActionLoading}
            >
              Active
            </Button>
            <Button
              variant="text"
              size={isMobile ? "small" : "medium"}
              onClick={() => handleTabChange("archived")}
              style={{
                borderBottom: tab === "archived" ? "2px solid #ccc" : "none",
                minWidth: isMobile ? 70 : "auto",
              }}
              disabled={isActionLoading}
            >
              Archived
            </Button>
          </Box>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          width={isMobile ? "100%" : "auto"}
          mt={isMobile ? 1 : 0}
        >
          <TextField
            fullWidth={isMobile}
            size="small"
            placeholder="Search by title or publisher..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              searchParams.set("page", "1");
              setSearchParams(searchParams);
            }}
            InputProps={{
              sx: {
                fontSize: isMobile ? "14px" : "inherit",
                height: isMobile ? "40px" : "auto",
              },
              endAdornment: (
                <InputAdornment position="end">
                  <Search />
                </InputAdornment>
              ),
            }}
            disabled={isActionLoading}
          />
          <IconButton
            onClick={handleMenuOpen(setDownloadAnchorEl)}
            disabled={isActionLoading}
          >
            <Download />
          </IconButton>
          <IconButton
            onClick={handleMenuOpen(setAnchorEl)}
            disabled={isActionLoading}
          >
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

      {/* Table with horizontal scroll */}
      <Box sx={{ overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: isMobile ? "900px" : "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  onChange={handleSelectAll}
                  checked={
                    selected.length === filteredArticles.length &&
                    filteredArticles.length > 0
                  }
                  indeterminate={
                    selected.length > 0 &&
                    selected.length < filteredArticles.length
                  }
                  disabled={isActionLoading || isLoading}
                />
              </TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Views</TableCell>
              <TableCell>% Viewed</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Publisher</TableCell>
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
              filteredArticles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(article.id)}
                      onChange={() => handleSelect(article.id)}
                      disabled={isActionLoading}
                    />
                  </TableCell>
                  <TableCell>{article.title}</TableCell>
                  <TableCell>{article.slug}</TableCell>
                  <TableCell>{article.views}</TableCell>
                  <TableCell>{article.percent_viewed}%</TableCell>
                  <TableCell>{formatDate(article.created_at)}</TableCell>
                  <TableCell>
                    {article.publisher ? article.publisher.name : "Unknown"}
                  </TableCell>
                  <TableCell>{article.featured === 1 ? "Yes" : "No"}</TableCell>
                  <TableCell>{article.pinned === 1 ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <StatusChip status={article.status} />
                  </TableCell>
                  <TableCell>{formatDate(article.archived_at)}</TableCell>
                  <TableCell>{article.schedule_at || "-"}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      {article.status !== ARTICLE_STATUS.ARCHIVED && (
                        <Tooltip
                          title={
                            article.status === ARTICLE_STATUS.PUBLISHED
                              ? "Unpublish"
                              : "Publish"
                          }
                          placement="top"
                        >
                          <Switch
                            checked={
                              article.status === ARTICLE_STATUS.PUBLISHED
                            }
                            onChange={() =>
                              handleTogglePublish(article.id, article.status)
                            }
                            color="primary"
                            size="small"
                            disabled={isActionLoading}
                          />
                        </Tooltip>
                      )}
                      <IconButton
                        onClick={(e) => {
                          setActiveRowId(article.id);
                          handleMenuOpen(setRowMenuAnchorEl)(e);
                        }}
                        disabled={isActionLoading}
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
      </Box>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={pagination.total}
        rowsPerPage={pagination.per_page}
        page={pagination.current_page - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        disabled={isActionLoading || isLoading}
      />

      {/* Bulk Actions Menu */}
      <Menu
        anchorEl={bulkAnchorEl}
        open={Boolean(bulkAnchorEl)}
        onClose={handleMenuClose(setBulkAnchorEl)}
      >
        {tab === "active" ? (
          <MenuItem
            onClick={() => {
              setOpenArchiveModal(true);
              handleMenuClose(setBulkAnchorEl)();
            }}
          >
            Archive
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              handleBulkUnarchive();
              handleMenuClose(setBulkAnchorEl)();
            }}
          >
            Unarchive
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            setOpenBulkDeleteModal(true);
            handleMenuClose(setBulkAnchorEl)();
          }}
        >
          Delete
        </MenuItem>
        <MenuItem
          onClick={() => {
            exportData("csv", true);
            handleMenuClose(setBulkAnchorEl)();
          }}
        >
          Export
        </MenuItem>
      </Menu>

      {/* Settings Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose(setAnchorEl)}
      >
        <MenuItem onClick={() => setOpenCategoryModal(true)}>
          Manage News Categories
        </MenuItem>
        <MenuItem onClick={() => exportData("csv")}>Export as CSV</MenuItem>
        <MenuItem onClick={() => exportData("xlsx")}>Export as Excel</MenuItem>
      </Menu>

      <ManageCategoriesModal
        open={openCategoryModal}
        onClose={() => setOpenCategoryModal(false)}
        onCategoriesUpdated={fetchCategories}
      />

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
        <MenuItem
          onClick={() => navigate(`/manage/newsarticle/${activeRowId}/details`)}
          disabled={isActionLoading}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => handleCloneArticle(activeRowId)}
          disabled={isActionLoading}
        >
          Clone
        </MenuItem>
        {tab === "active" ? (
          <MenuItem
            onClick={() => {
              setArticleToDelete(activeRowId);
              setOpenArchiveModal(true);
              handleMenuClose(setRowMenuAnchorEl)();
            }}
            disabled={isActionLoading}
          >
            Archive
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              handleUnarchiveArticle(activeRowId);
              handleMenuClose(setRowMenuAnchorEl)();
            }}
            disabled={isActionLoading}
          >
            Unarchive
          </MenuItem>
        )}
        <MenuItem
          onClick={() => handleDeleteClick(activeRowId)}
          disabled={isActionLoading}
        >
          Delete
        </MenuItem>
        <MenuItem disabled={isActionLoading}>Viewer List</MenuItem>
        <MenuItem
          onClick={() => {
            exportData("csv");
            handleMenuClose(setDownloadAnchorEl)();
          }}
          disabled={isActionLoading}
        >
          Export
        </MenuItem>
      </Menu>

      {/* Archive Confirmation Dialog */}
      <Dialog
        open={openArchiveModal}
        onClose={() => setOpenArchiveModal(false)}
      >
        <DialogTitle>
          {selected.length > 1 ? "Archive Articles" : "Archive Article"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selected.length > 1
              ? `Are you sure you want to archive ${selected.length} selected articles?`
              : "Are you sure you want to archive this article?"}
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
            onClick={() => {
              if (selected.length > 0) {
                handleBulkArchive();
              } else if (articleToDelete) {
                handleArchiveArticle(articleToDelete);
              }
            }}
            color="error"
            autoFocus
            disabled={isActionLoading}
          >
            {isActionLoading ? "Archiving..." : "Confirm Archive"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this article? This action cannot be
            undone.
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

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog
        open={openBulkDeleteModal}
        onClose={() => setOpenBulkDeleteModal(false)}
      >
        <DialogTitle>Confirm Bulk Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selected.length} selected articles?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenBulkDeleteModal(false)}
            color="primary"
            disabled={isActionLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleBulkDelete}
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
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageArticles;
