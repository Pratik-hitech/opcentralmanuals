





// import React, { useState, useRef, useEffect } from 'react';
// import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
// import { 
//   Box, 
//   Typography, 
//   IconButton, 
//   Divider, 
//   Avatar, 
//   Paper,
//   Menu,
//   MenuItem,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
//   Button,
//   Snackbar,
//   Alert,
//   CircularProgress
// } from '@mui/material';
// import { 
//   PictureAsPdf, 
//   MoreVert, 
//   ArrowBack, 
//   NavigateBefore, 
//   NavigateNext
// } from '@mui/icons-material';
// import moment from 'moment';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import { httpClient } from "../../utils/httpClientSetup";

// export async function dashboardNewsLoader({ params }) {
//   try {
//     const articleResponse = await httpClient.get(`news/${params.id}`);
    
//     if (!articleResponse.data.success) {
//       throw new Error(articleResponse.data.message || 'Failed to fetch article');
//     }
//     const article = articleResponse.data.data;

//     let userName = 'Blue Wheelers Admin';
//     let userInitial = 'B';
//     if (article.created_by) {
//       try {
//         const userResponse = await httpClient.get(`users/${article.created_by}`);
//         if (userResponse.data.success && userResponse.data.data.name) {
//           userName = userResponse.data.data.name;
//           userInitial = userName.charAt(0).toUpperCase();
//         }
//       } catch (userError) {
//         console.error("Error fetching user:", userError);
//       }
//     }

//     return {
//       article: {
//         ...article,
//         authorName: userName,
//         authorInitial: userInitial
//       }
//     };
//   } catch (err) {
//     console.error("Loader error:", err);
//     throw new Response(
//       JSON.stringify({ message: err.message || 'Failed to load article' }),
//       { status: 404 }
//     );
//   }
// }

// const DashboardNews = () => {
//   const { article: initialArticle } = useLoaderData();
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const articleRef = useRef();
//   const controlsRef = useRef();

//   const [article, setArticle] = useState(initialArticle);
//   const [newsList, setNewsList] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);
//   const [openDeleteModal, setOpenDeleteModal] = useState(false);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: '',
//     severity: 'success'
//   });

//   // Fetch news list for navigation
//   useEffect(() => {
//     const fetchNewsList = async () => {
//       try {
//         const response = await httpClient.get('news');
//         if (response.data.success) {
//           const newsItems = response.data.data;
//           setNewsList(newsItems);
          
//           // Find current index
//           const index = newsItems.findIndex(item => item.id === parseInt(id));
//           if (index !== -1) {
//             setCurrentIndex(index);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching news list:", error);
//       }
//     };

//     fetchNewsList();
//   }, [id]);

//   // Fetch article when ID changes
//   useEffect(() => {
//     const fetchArticle = async () => {
//       if (!id) return;
      
//       setLoading(true);
//       try {
//         const response = await httpClient.get(`news/${id}`);
//         if (response.data.success) {
//           const articleData = response.data.data;
          
//           // Get author info
//           let userName = 'Blue Wheelers Admin';
//           let userInitial = 'B';
//           if (articleData.created_by) {
//             try {
//               const userResponse = await httpClient.get(`users/${articleData.created_by}`);
//               if (userResponse.data.success && userResponse.data.data.name) {
//                 userName = userResponse.data.data.name;
//                 userInitial = userName.charAt(0).toUpperCase();
//               }
//             } catch (userError) {
//               console.error("Error fetching user:", userError);
//             }
//           }
          
//           setArticle({
//             ...articleData,
//             authorName: userName,
//             authorInitial: userInitial
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching article:", error);
//         setSnackbar({
//           open: true,
//           message: 'Failed to load article',
//           severity: 'error'
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id !== article.id.toString()) {
//       fetchArticle();
//     }
//   }, [id, article.id]);

//   const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
//   const handleMenuClose = () => setAnchorEl(null);

//   const handleDeleteClick = () => {
//     handleMenuClose();
//     setOpenDeleteModal(true);
//   };

//   const handleDeleteConfirm = async () => {
//     setOpenDeleteModal(false);
//     try {
//       const response = await httpClient.delete(`news/${article.id}`);
//       if (response.data?.success) {
//         setSnackbar({
//           open: true,
//           message: 'Article deleted successfully',
//           severity: 'success'
//         });
//         setTimeout(() => navigate('/dashboard'), 1000);
//       } else {
//         throw new Error(response.data?.message || 'Failed to delete article');
//       }
//     } catch (err) {
//       setSnackbar({
//         open: true,
//         message: err.message || 'Failed to delete article',
//         severity: 'error'
//       });
//     }
//   };

//   const handleExportPDF = async () => {
//     if (!articleRef.current) return;
    
//     // Hide controls before capturing
//     if (controlsRef.current) {
//       controlsRef.current.style.display = 'none';
//     }
    
//     try {
//       const canvas = await html2canvas(articleRef.current, { 
//         scale: 2,
//         useCORS: true,
//         backgroundColor: '#ffffff'
//       });
//       const imgData = canvas.toDataURL('image/png');

//       const pdf = new jsPDF('p', 'pt', 'a4');
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

//       // Add the content
//       pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

//       // Add single centered watermark
//       pdf.setGState(new pdf.GState({ opacity: 0.07 }));
//       pdf.setTextColor(100, 100, 100);
//       pdf.setFontSize(60);
//       pdf.setFont('helvetica', 'bold');
      
//       const watermarkText = article.authorName;
//       const textWidth = pdf.getTextWidth(watermarkText);
      
//       // Center the watermark on the page
//       const x = (pdfWidth - textWidth) / 2;
//       const y = pdfHeight / 2;
      
//       // Add single watermark
//       pdf.text(watermarkText, x, y, { angle: -30 });

//       pdf.save(`${article.title || 'Article'}.pdf`);
//     } catch (err) {
//       console.error('Error exporting PDF:', err);
//       setSnackbar({
//         open: true,
//         message: 'Failed to export PDF',
//         severity: 'error'
//       });
//     } finally {
//       // Show controls again after capturing
//       if (controlsRef.current) {
//         controlsRef.current.style.display = 'flex';
//       }
//     }
//   };

//   const navigateToArticle = (direction) => {
//     if (newsList.length === 0) return;
    
//     let newIndex;
//     if (direction === 'next') {
//       newIndex = (currentIndex + 1) % newsList.length;
//     } else {
//       newIndex = (currentIndex - 1 + newsList.length) % newsList.length;
//     }
    
//     navigate(`/dashboard/news/${newsList[newIndex].id}`);
//   };

//   const handleBack = () => {
//     navigate(-1);
//   };

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ maxWidth: 800, mx: 'auto', p: 3, position: 'relative' }}>
//       {/* Navigation buttons */}
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//         <IconButton onClick={handleBack} sx={{ mr: 1 }}>
//           <ArrowBack />
//         </IconButton>
        
//         <Box display="flex" alignItems="center">
//           {/* <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary' }}>
//             {currentIndex + 1} of {newsList.length}
//           </Typography> */}
//           {/* <IconButton 
//             onClick={() => navigateToArticle('prev')} 
//             disabled={newsList.length <= 1}
//             sx={{ mr: 1 }}
//             size="large"
//           >
//             <NavigateBefore />
//           </IconButton>
//           <IconButton 
//             onClick={() => navigateToArticle('next')}
//             disabled={newsList.length <= 1}
//             size="large"
//           >
//             <NavigateNext />
//           </IconButton> */}
//         </Box>
//       </Box>

//       <Paper
//         ref={articleRef}
//         elevation={0}
//         sx={{ p: 4, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.8)', position: 'relative', zIndex: 1 }}
//       >
//         {/* Top Bar */}
//         <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
//           <Typography variant="h3" sx={{ fontWeight: 800 }}>
//             {article.title || 'Untitled Article'}
//           </Typography>
//           <Box ref={controlsRef} display="flex">
//             <IconButton onClick={handleExportPDF} sx={{ mr: 1 }}><PictureAsPdf /></IconButton>
//             <IconButton 
//               onClick={handleMenuClick}
//               aria-controls={open ? 'article-menu' : undefined}
//               aria-haspopup="true"
//               aria-expanded={open ? 'true' : undefined}
//             >
//               <MoreVert />
//             </IconButton>
//             <Menu
//               id="article-menu"
//               anchorEl={anchorEl}
//               open={open}
//               onClose={handleMenuClose}
//               anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//               transformOrigin={{ vertical: 'top', horizontal: 'right' }}
//               sx={{ '& .MuiPaper-root': { boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', borderRadius: '8px', minWidth: '180px' } }}
//             >
//               <MenuItem onClick={() => navigate(`/manage/newsarticle/${article.id}/details`)}>Edit</MenuItem>
//               <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
//             </Menu>
//           </Box>
//         </Box>

//         {/* Author Info */}
//         <Box display="flex" alignItems="center" mb={4}>
//           <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 40, height: 40, fontSize: '1rem' }}>
//             {article.authorInitial}
//           </Avatar>
//           <Box>
//             <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{article.authorName}</Typography>
//             <Typography variant="caption" color="text.secondary">
//               Published {moment(article.created_at).format('MMMM D, YYYY [at] h:mm A')}
//             </Typography>
//           </Box>
//         </Box>

//         <Divider sx={{ my: 3 }} />

//         {/* Article Content */}
//         <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line', fontSize: '1.1rem', lineHeight: '1.8' }}>
//           {article.content}
//         </Typography>

//         <Divider sx={{ my: 3 }} />

//         {/* Exported By */}
//         <Box textAlign="right" fontSize="0.9rem" fontWeight={500} mt={3}>
//           {/* Exported by: {article.authorName} */}
//         </Box>
//       </Paper>

//       {/* Delete Confirmation Modal */}
//       <Dialog
//         open={openDeleteModal}
//         onClose={() => setOpenDeleteModal(false)}
//       >
//         <DialogTitle>Delete Article</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to delete this article? This action cannot be undone.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDeleteModal(false)} color="primary">Cancel</Button>
//           <Button onClick={handleDeleteConfirm} color="error" autoFocus>Delete</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Snackbar */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled">
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default DashboardNews;



// **********************************


// import React, { useState, useRef, useEffect } from 'react';
// import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
// import { 
//   Box, 
//   Typography, 
//   IconButton, 
//   Divider, 
//   Avatar, 
//   Paper,
//   Menu,
//   MenuItem,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
//   Button,
//   Snackbar,
//   Alert,
//   CircularProgress
// } from '@mui/material';
// import { 
//   PictureAsPdf, 
//   MoreVert, 
//   ArrowBack, 
//   NavigateBefore, 
//   NavigateNext
// } from '@mui/icons-material';
// import moment from 'moment';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import { httpClient } from "../../utils/httpClientSetup";

// export async function dashboardNewsLoader({ params }) {
//   try {
//     const articleResponse = await httpClient.get(`news/${params.id}`);
//     if (!articleResponse.data.success) {
//       throw new Error(articleResponse.data.message || 'Failed to fetch article');
//     }
//     const article = articleResponse.data.data;

//     let userName = 'Blue Wheelers Admin';
//     let userInitial = 'B';
//     if (article.created_by) {
//       try {
//         const userResponse = await httpClient.get(`users/${article.created_by}`);
//         if (userResponse.data.success && userResponse.data.data.name) {
//           userName = userResponse.data.data.name;
//           userInitial = userName.charAt(0).toUpperCase();
//         }
//       } catch (userError) {
//         console.error("Error fetching user:", userError);
//       }
//     }

//     return {
//       article: {
//         ...article,
//         authorName: userName,
//         authorInitial: userInitial
//       }
//     };
//   } catch (err) {
//     console.error("Loader error:", err);
//     throw new Response(
//       JSON.stringify({ message: err.message || 'Failed to load article' }),
//       { status: 404 }
//     );
//   }
// }

// const DashboardNews = () => {
//   const { article: initialArticle } = useLoaderData();
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const articleRef = useRef();
//   const controlsRef = useRef();

//   const [article, setArticle] = useState(initialArticle);
//   const [newsList, setNewsList] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(-1);
//   const [loading, setLoading] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);
//   const [openDeleteModal, setOpenDeleteModal] = useState(false);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: '',
//     severity: 'success'
//   });

//   // Fetch news list for navigation
//   useEffect(() => {
//     const fetchNewsList = async () => {
//       try {
//         const response = await httpClient.get('news');
//         if (response.data.success) {
//           const newsItems = response.data.data;
//           setNewsList(newsItems);
          
//           // Find current index
//           const index = newsItems.findIndex(item => item.id === parseInt(id));
//           if (index !== -1) {
//             setCurrentIndex(index);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching news list:", error);
//       }
//     };

//     fetchNewsList();
//   }, [id]);

//   // Fetch article when ID changes
//   useEffect(() => {
//     const fetchArticle = async () => {
//       if (!id) return;
      
//       setLoading(true);
//       try {
//         const response = await httpClient.get(`news/${id}`);
//         if (response.data.success) {
//           const articleData = response.data.data;
          
//           // Get author info
//           let userName = 'Blue Wheelers Admin';
//           let userInitial = 'B';
//           if (articleData.created_by) {
//             try {
//               const userResponse = await httpClient.get(`users/${articleData.created_by}`);
//               if (userResponse.data.success && userResponse.data.data.name) {
//                 userName = userResponse.data.data.name;
//                 userInitial = userName.charAt(0).toUpperCase();
//               }
//             } catch (userError) {
//               console.error("Error fetching user:", userError);
//             }
//           }
          
//           setArticle({
//             ...articleData,
//             authorName: userName,
//             authorInitial: userInitial
//           });

//           // Update current index if newsList is already loaded
//           if (newsList.length > 0) {
//             const index = newsList.findIndex(item => item.id === parseInt(id));
//             if (index !== -1) {
//               setCurrentIndex(index);
//             }
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching article:", error);
//         setSnackbar({
//           open: true,
//           message: 'Failed to load article',
//           severity: 'error'
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id !== article.id.toString()) {
//       fetchArticle();
//     }
//   }, [id, article.id, newsList]);

//   const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
//   const handleMenuClose = () => setAnchorEl(null);

//   const handleDeleteClick = () => {
//     handleMenuClose();
//     setOpenDeleteModal(true);
//   };

//   const handleDeleteConfirm = async () => {
//     setOpenDeleteModal(false);
//     try {
//       const response = await httpClient.delete(`news/${article.id}`);
//       if (response.data?.success) {
//         setSnackbar({
//           open: true,
//           message: 'Article deleted successfully',
//           severity: 'success'
//         });
//         setTimeout(() => navigate('/dashboard'), 1000);
//       } else {
//         throw new Error(response.data?.message || 'Failed to delete article');
//       }
//     } catch (err) {
//       setSnackbar({
//         open: true,
//         message: err.message || 'Failed to delete article',
//         severity: 'error'
//       });
//     }
//   };

//   const handleExportPDF = async () => {
//     if (!articleRef.current) return;
    
//     // Hide controls before capturing
//     if (controlsRef.current) {
//       controlsRef.current.style.display = 'none';
//     }
    
//     try {
//       const canvas = await html2canvas(articleRef.current, { 
//         scale: 2,
//         useCORS: true,
//         backgroundColor: '#ffffff'
//       });
//       const imgData = canvas.toDataURL('image/png');

//       const pdf = new jsPDF('p', 'pt', 'a4');
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

//       // Add the content
//       pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

//       // Add single centered watermark
//       pdf.setGState(new pdf.GState({ opacity: 0.07 }));
//       pdf.setTextColor(100, 100, 100);
//       pdf.setFontSize(60);
//       pdf.setFont('helvetica', 'bold');
      
//       const watermarkText = article.authorName;
//       const textWidth = pdf.getTextWidth(watermarkText);
      
//       // Center the watermark on the page
//       const x = (pdfWidth - textWidth) / 2;
//       const y = pdfHeight / 2;
      
//       // Add single watermark
//       pdf.text(watermarkText, x, y, { angle: -30 });

//       pdf.save(`${article.title || 'Article'}.pdf`);
//     } catch (err) {
//       console.error('Error exporting PDF:', err);
//       setSnackbar({
//         open: true,
//         message: 'Failed to export PDF',
//         severity: 'error'
//       });
//     } finally {
//       // Show controls again after capturing
//       if (controlsRef.current) {
//         controlsRef.current.style.display = 'flex';
//       }
//     }
//   };

//   const navigateToArticle = (direction) => {
//     if (newsList.length <= 1 || currentIndex === -1) return;
    
//     let newIndex;
//     if (direction === 'next') {
//       newIndex = (currentIndex + 1) % newsList.length;
//     } else {
//       newIndex = (currentIndex - 1 + newsList.length) % newsList.length;
//     }
    
//     const nextArticle = newsList[newIndex];
//     navigate(`/dashboard/news/${nextArticle.id}`);
//   };

//   const handleBack = () => {
//     navigate('/dashboard');
//   };

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ maxWidth: 800, mx: 'auto', p: 3, position: 'relative' }}>
//       {/* Navigation buttons */}
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//         <IconButton onClick={handleBack} sx={{ mr: 1 }}>
//           <ArrowBack />
//         </IconButton>
        
//         <Box display="flex" alignItems="center">
//           <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary' }}>
//             {currentIndex !== -1 ? `${currentIndex + 1} of ${newsList.length}` : 'Loading...'}
//           </Typography>
//           <IconButton 
//             onClick={() => navigateToArticle('prev')} 
//             disabled={newsList.length <= 1 || currentIndex === -1}
//             sx={{ mr: 1 }}
//             size="large"
//           >
//             <NavigateBefore />
//           </IconButton>
//           <IconButton 
//             onClick={() => navigateToArticle('next')}
//             disabled={newsList.length <= 1 || currentIndex === -1}
//             size="large"
//           >
//             <NavigateNext />
//           </IconButton>
//         </Box>
//       </Box>

//       <Paper
//         ref={articleRef}
//         elevation={0}
//         sx={{ p: 4, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.8)', position: 'relative', zIndex: 1 }}
//       >
//         {/* Top Bar */}
//         <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
//           <Typography variant="h3" sx={{ fontWeight: 800 }}>
//             {article.title || 'Untitled Article'}
//           </Typography>
//           <Box ref={controlsRef} display="flex">
//             <IconButton onClick={handleExportPDF} sx={{ mr: 1 }}><PictureAsPdf /></IconButton>
//             <IconButton 
//               onClick={handleMenuClick}
//               aria-controls={open ? 'article-menu' : undefined}
//               aria-haspopup="true"
//               aria-expanded={open ? 'true' : undefined}
//             >
//               <MoreVert />
//             </IconButton>
//             <Menu
//               id="article-menu"
//               anchorEl={anchorEl}
//               open={open}
//               onClose={handleMenuClose}
//               anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//               transformOrigin={{ vertical: 'top', horizontal: 'right' }}
//               sx={{ '& .MuiPaper-root': { boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', borderRadius: '8px', minWidth: '180px' } }}
//             >
//               <MenuItem onClick={() => navigate(`/manage/newsarticle/${article.id}/details`)}>Edit</MenuItem>
//               <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
//             </Menu>
//           </Box>
//         </Box>

//         {/* Author Info */}
//         <Box display="flex" alignItems="center" mb={4}>
//           <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 40, height: 40, fontSize: '1rem' }}>
//             {article.authorInitial}
//           </Avatar>
//           <Box>
//             <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{article.authorName}</Typography>
//             <Typography variant="caption" color="text.secondary">
//               Published {moment(article.created_at).format('MMMM D, YYYY [at] h:mm A')}
//             </Typography>
//           </Box>
//         </Box>

//         <Divider sx={{ my: 3 }} />

//         {/* Article Content */}
//         <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line', fontSize: '1.1rem', lineHeight: '1.8' }}>
//           {article.content}
//         </Typography>

//         <Divider sx={{ my: 3 }} />

//         {/* Exported By */}
//         <Box textAlign="right" fontSize="0.9rem" fontWeight={500} mt={3}>
//           Exported by: {article.authorName}
//         </Box>
//       </Paper>

//       {/* Delete Confirmation Modal */}
//       <Dialog
//         open={openDeleteModal}
//         onClose={() => setOpenDeleteModal(false)}
//       >
//         <DialogTitle>Delete Article</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to delete this article? This action cannot be undone.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDeleteModal(false)} color="primary">Cancel</Button>
//           <Button onClick={handleDeleteConfirm} color="error" autoFocus>Delete</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Snackbar */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled">
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default DashboardNews;



// latest ***********************


// import React, { useState, useRef, useEffect } from "react";
// import { useLoaderData, useNavigate, useParams } from "react-router-dom";
// import {
//   Box,
//   Typography,
//   IconButton,
//   Divider,
//   Avatar,
//   Paper,
//   Menu,
//   MenuItem,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
//   Button,
//   Snackbar,
//   Alert,
//   Skeleton,
// } from "@mui/material";
// import {
//   PictureAsPdf,
//   MoreVert,
//   ArrowBack,
//   NavigateBefore,
//   NavigateNext,
// } from "@mui/icons-material";
// import moment from "moment";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import { httpClient } from "../../utils/httpClientSetup";
// import { useAuth } from "../../context/AuthContext";

// export async function dashboardNewsLoader({ params }) {
//   try {
//     const articleResponse = await httpClient.get(`news/${params.id}`);
//     if (!articleResponse.data.success) {
//       throw new Error(articleResponse.data.message || "Failed to fetch article");
//     }
//     return { article: articleResponse.data.data };
//   } catch (err) {
//     console.error("Loader error:", err);
//     throw new Response(
//       JSON.stringify({ message: err.message || "Failed to load article" }),
//       { status: 404 }
//     );
//   }
// }

// const DashboardNews = () => {
//   const { article: initialArticle } = useLoaderData();
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const articleRef = useRef();
//   const controlsRef = useRef();
//   const { user } = useAuth();

//   const [article, setArticle] = useState(initialArticle);
//   const [newsIds, setNewsIds] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(-1);
//   const [loading, setLoading] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [openDeleteModal, setOpenDeleteModal] = useState(false);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   const open = Boolean(anchorEl);

//   // Fetch news IDs once for navigation
//   useEffect(() => {
//     const fetchNewsIds = async () => {
//       try {
//         const response = await httpClient.get("news?status=PUBLISHED");
//         if (response.data.success) {
//           const sortedNews = [...response.data.data].sort(
//             (a, b) => new Date(b.created_at) - new Date(a.created_at)
//           );
//           const ids = sortedNews.map((item) => item.id);
//           setNewsIds(ids);

//           const index = ids.findIndex((newsId) => newsId === parseInt(id));
//           setCurrentIndex(index);
//         }
//       } catch (error) {
//         console.error("Error fetching news IDs:", error);
//       }
//     };
//     fetchNewsIds();
//   }, []);

//   // Fetch article when ID changes
//   useEffect(() => {
//     const fetchArticle = async () => {
//       if (!id) return;

//       setLoading(true);
//       try {
//         const response = await httpClient.get(`news/${id}`);
//         if (response.data.success) {
//           const articleData = response.data.data;

//           let userName = "Blue Wheelers Admin";
//           let userInitial = "B";
//           if (articleData.created_by) {
//             try {
//               const userResponse = await httpClient.get(
//                 `users/${articleData.created_by}`
//               );
//               if (
//                 userResponse.data.success &&
//                 userResponse.data.data.name
//               ) {
//                 userName = userResponse.data.data.name;
//                 userInitial = userName.charAt(0).toUpperCase();
//               }
//             } catch (userError) {
//               console.error("Error fetching user:", userError);
//             }
//           }

//           setArticle({
//             ...articleData,
//             authorName: userName,
//             authorInitial: userInitial,
//           });

//           if (newsIds.length > 0) {
//             const index = newsIds.findIndex(
//               (newsId) => newsId === parseInt(id)
//             );
//             setCurrentIndex(index);
//           }
//         }
//       } catch (error) {
//         setSnackbar({
//           open: true,
//           message: "Failed to load article",
//           severity: "error",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchArticle();
//   }, [id, newsIds]);

//   const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
//   const handleMenuClose = () => setAnchorEl(null);

//   const handleDeleteClick = () => {
//     handleMenuClose();
//     setOpenDeleteModal(true);
//   };

//   const handleDeleteConfirm = async () => {
//     setOpenDeleteModal(false);
//     try {
//       const response = await httpClient.delete(`news/${article.id}`);
//       if (response.data?.success) {
//         setSnackbar({
//           open: true,
//           message: "Article deleted successfully",
//           severity: "success",
//         });
//         setTimeout(() => navigate("/dashboard"), 800);
//       } else {
//         throw new Error(response.data?.message || "Failed to delete article");
//       }
//     } catch (err) {
//       setSnackbar({
//         open: true,
//         message: err.message || "Failed to delete article",
//         severity: "error",
//       });
//     }
//   };

//   const handleExportPDF = async () => {
//     if (!articleRef.current) return;

//     if (controlsRef.current) {
//       controlsRef.current.style.display = "none";
//     }

//     try {
//       const canvas = await html2canvas(articleRef.current, {
//         scale: 2,
//         useCORS: true,
//         backgroundColor: "#ffffff",
//       });
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "pt", "a4");
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

//       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

//       pdf.setGState(new pdf.GState({ opacity: 0.07 }));
//       pdf.setTextColor(100, 100, 100);
//       pdf.setFontSize(60);
//       pdf.setFont("helvetica", "bold");

//       const watermarkText =
//         user?.name || user?.company_name || "Exported Document";
//       const textWidth = pdf.getTextWidth(watermarkText);
//       const x = (pdfWidth - textWidth) / 2;
//       const y = pdfHeight / 2;

//       pdf.text(watermarkText, x, y, { angle: -30 });
//       pdf.save(`${article.title || "Article"}.pdf`);
//     } catch (err) {
//       setSnackbar({
//         open: true,
//         message: "Failed to export PDF",
//         severity: "error",
//       });
//     } finally {
//       if (controlsRef.current) {
//         controlsRef.current.style.display = "flex";
//       }
//     }
//   };

//   const navigateToArticle = (direction) => {
//     if (newsIds.length <= 1 || currentIndex === -1) return;

//     let newIndex;
//     if (direction === "next") {
//       newIndex = (currentIndex + 1) % newsIds.length;
//     } else {
//       newIndex = (currentIndex - 1 + newsIds.length) % newsIds.length;
//     }

//     const nextArticleId = newsIds[newIndex];
//     navigate(`/dashboardnews/${nextArticleId}`);
//   };

//   const handleBack = () => navigate("/dashboard");

//   return (
//     <Box sx={{ maxWidth: 800, mx: "auto", p: 3, position: "relative" }}>
//       {/* Navigation */}
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//         <IconButton onClick={handleBack} sx={{ mr: 1 }}>
//           <ArrowBack />
//         </IconButton>
//         <Box display="flex" alignItems="center">
//           <Typography variant="body2" sx={{ mr: 1, color: "text.secondary" }}>
//             {currentIndex !== -1
//               ? `${currentIndex + 1} of ${newsIds.length}`
//               : "Loading..."}
//           </Typography>
//           <IconButton
//             onClick={() => navigateToArticle("prev")}
//             disabled={newsIds.length <= 1 || currentIndex === -1}
//             sx={{ mr: 1 }}
//             size="large"
//           >
//             <NavigateBefore />
//           </IconButton>
//           <IconButton
//             onClick={() => navigateToArticle("next")}
//             disabled={newsIds.length <= 1 || currentIndex === -1}
//             size="large"
//           >
//             <NavigateNext />
//           </IconButton>
//         </Box>
//       </Box>

//       {loading ? (
//         // Show skeletons instead of blank spinner
//         <Paper sx={{ p: 3, borderRadius: 4 }}>
//           <Skeleton variant="text" width="80%" height={60} />
//           <Skeleton variant="text" width="40%" height={30} />
//           <Skeleton variant="rectangular" width="100%" height={300} sx={{ my: 2 }} />
//           <Skeleton variant="text" width="60%" height={30} />
//         </Paper>
//       ) : (
//         <Paper
//           ref={articleRef}
//           elevation={0}
//           sx={{
//             p: 4,
//             borderRadius: 4,
//             bgcolor: "rgba(255,255,255,0.8)",
//             position: "relative",
//             zIndex: 1,
//           }}
//         >
//           {/* Header */}
//           <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
//             <Typography variant="h3" sx={{ fontWeight: 800 }}>
//               {article.title || "Untitled Article"}
//             </Typography>
//             <Box ref={controlsRef} display="flex">
//               <IconButton onClick={handleExportPDF} sx={{ mr: 1 }}>
//                 <PictureAsPdf />
//               </IconButton>
//               <IconButton onClick={handleMenuClick}>
//                 <MoreVert />
//               </IconButton>
//               <Menu
//                 id="article-menu"
//                 anchorEl={anchorEl}
//                 open={open}
//                 onClose={handleMenuClose}
//                 anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//                 transformOrigin={{ vertical: "top", horizontal: "right" }}
//               >
//                 <MenuItem
//                   onClick={() =>
//                     navigate(`/manage/newsarticle/${article.id}/details`)
//                   }
//                 >
//                   Edit
//                 </MenuItem>
//                 <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
//               </Menu>
//             </Box>
//           </Box>

//           {/* Author Info */}
//           <Box display="flex" alignItems="center" mb={4}>
//             <Avatar
//               sx={{
//                 bgcolor: "primary.main",
//                 mr: 2,
//                 width: 40,
//                 height: 40,
//                 fontSize: "1rem",
//               }}
//             >
//               {article.authorInitial}
//             </Avatar>
//             <Box>
//               <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
//                 {article.authorName}
//               </Typography>
//               <Typography variant="caption" color="text.secondary">
//                 Published{" "}
//                 {moment(article.created_at).format("MMMM D, YYYY [at] h:mm A")}
//               </Typography>
//             </Box>
//           </Box>

//           <Divider sx={{ my: 3 }} />

//           <Typography
//             variant="body1"
//             paragraph
//             sx={{
//               whiteSpace: "pre-line",
//               fontSize: "1.1rem",
//               lineHeight: "1.8",
//             }}
//           >
//             {article.content}
//           </Typography>
//         </Paper>
//       )}

//       {/* Delete Modal */}
//       <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
//         <DialogTitle>Delete Article</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to delete this article? This action cannot be undone.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDeleteModal(false)} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={handleDeleteConfirm} color="error" autoFocus>
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Snackbar */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Alert
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           severity={snackbar.severity}
//           variant="filled"
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default DashboardNews;
  // ***********************************


  import React, { useState, useRef, useEffect } from "react";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Avatar,
  Paper,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  Skeleton,
} from "@mui/material";
import { PictureAsPdf, MoreVert, ArrowBack, NavigateBefore, NavigateNext } from "@mui/icons-material";
import moment from "moment";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { httpClient } from "../../utils/httpClientSetup";
import { useAuth } from "../../context/AuthContext";

export async function dashboardNewsLoader({ params }) {
  try {
    const articleResponse = await httpClient.get(`news/${params.id}`);
    if (!articleResponse.data.success) throw new Error(articleResponse.data.message || "Failed to fetch article");
    return { article: articleResponse.data.data };
  } catch (err) {
    console.error("Loader error:", err);
    throw new Response(JSON.stringify({ message: err.message || "Failed to load article" }), { status: 404 });
  }
}

const DashboardNews = () => {
  const { article: initialArticle } = useLoaderData();
  const { id } = useParams();
  const navigate = useNavigate();
  const articleRef = useRef();
  const controlsRef = useRef();
  const { user } = useAuth();

  const [article, setArticle] = useState(initialArticle);
  const [newsList, setNewsList] = useState([]); // full list of published news
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const open = Boolean(anchorEl);
const isAdmin = user?.role.name === "admin";
  // Fetch published news list once for navigation
  useEffect(() => {
    const fetchNewsList = async () => {
      try {
        const response = await httpClient.get("news/list?status=PUBLISHED");
        if (response.data.success) {
          const sortedNews = [...response.data.data]; // keep order as returned
          setNewsList(sortedNews);

          const index = sortedNews.findIndex(news => news.id === parseInt(id));
          setCurrentIndex(index);
        }
      } catch (error) {
        console.error("Error fetching news list:", error);
      }
    };
    fetchNewsList();
  }, []);

  // Fetch article whenever ID changes
  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const response = await httpClient.get(`news/${id}`);
        if (response.data.success) {
          const articleData = response.data.data;

          // Fetch author info
          let userName = "Blue Wheelers Admin";
          let userInitial = "B";
          if (articleData.created_by) {
            try {
              const userResponse = await httpClient.get(`users/${articleData.created_by}`);
              if (userResponse.data.success && userResponse.data.data.name) {
                userName = userResponse.data.data.name;
                userInitial = userName.charAt(0).toUpperCase();
              }
            } catch (err) {
              console.error("Error fetching user:", err);
            }
          }

          setArticle({ ...articleData, authorName: userName, authorInitial: userInitial });

          // Update current index based on newsList
          if (newsList.length > 0) {
            const index = newsList.findIndex(news => news.id === parseInt(id));
            setCurrentIndex(index);
          }
        }
      } catch (error) {
        setSnackbar({ open: true, message: "Failed to load article", severity: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, newsList]);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleDeleteClick = () => {
    handleMenuClose();
    setOpenDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setOpenDeleteModal(false);
    try {
      const response = await httpClient.delete(`news/${article.id}`);
      if (response.data?.success) {
        setSnackbar({ open: true, message: "Article deleted successfully", severity: "success" });
        setTimeout(() => navigate("/dashboard"), 800);
      } else throw new Error(response.data?.message || "Failed to delete article");
    } catch (err) {
      setSnackbar({ open: true, message: err.message || "Failed to delete article", severity: "error" });
    }
  };

  const handleExportPDF = async () => {
    if (!articleRef.current) return;

    if (controlsRef.current) controlsRef.current.style.display = "none";

    try {
      const canvas = await html2canvas(articleRef.current, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      pdf.setGState(new pdf.GState({ opacity: 0.07 }));
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(60);
      pdf.setFont("helvetica", "bold");

      const watermarkText = user?.name || user?.company_name || "Exported Document";
      const textWidth = pdf.getTextWidth(watermarkText);
      const x = (pdfWidth - textWidth) / 2;
      const y = pdfHeight / 2;

      pdf.text(watermarkText, x, y, { angle: -30 });
      pdf.save(`${article.title || "Article"}.pdf`);
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to export PDF", severity: "error" });
    } finally {
      if (controlsRef.current) controlsRef.current.style.display = "flex";
    }
  };

  const navigateToArticle = (direction) => {
    if (newsList.length <= 1 || currentIndex === -1) return;

    let newIndex;
    if (direction === "next") newIndex = (currentIndex + 1) % newsList.length;
    else newIndex = (currentIndex - 1 + newsList.length) % newsList.length;

    const nextArticleId = newsList[newIndex].id;
    navigate(`/dashboardnews/${nextArticleId}`);
  };

  const handleBack = () => navigate(-1);

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3, position: "relative" }}>
      {/* Navigation */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <IconButton onClick={handleBack}><ArrowBack /></IconButton>
        <Box display="flex" alignItems="center">
          <Typography variant="body2" sx={{ mr: 1, color: "text.secondary" }}>
            {currentIndex !== -1 ? `${currentIndex + 1} of ${newsList.length}` : "Loading..."}
          </Typography>
          <IconButton onClick={() => navigateToArticle("prev")} disabled={newsList.length <= 1 || currentIndex === -1}>
            <NavigateBefore />
          </IconButton>
          <IconButton onClick={() => navigateToArticle("next")} disabled={newsList.length <= 1 || currentIndex === -1}>
            <NavigateNext />
          </IconButton>
        </Box>
      </Box>

      {/* Article */}
      {loading ? (
        <Paper sx={{ p: 3, borderRadius: 4 }}>
          <Skeleton variant="text" width="80%" height={60} />
          <Skeleton variant="text" width="40%" height={30} />
          <Skeleton variant="rectangular" width="100%" height={300} sx={{ my: 2 }} />
          <Skeleton variant="text" width="60%" height={30} />
        </Paper>
      ) : (
        <Paper ref={articleRef} elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: "rgba(255,255,255,0.8)" }}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>{article.title || "Untitled Article"}</Typography>
            <Box ref={controlsRef} display="flex">
              <IconButton onClick={handleExportPDF} sx={{ mr: 1 }}><PictureAsPdf /></IconButton>
              {isAdmin && (
    <>
      <IconButton onClick={handleMenuClick}>
        <MoreVert />
      </IconButton>
      <Menu
        id="article-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={() => navigate(`/manage/newsarticle/${article.id}/details`)}>
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
      </Menu>
    </>
  )}
            </Box>
          </Box>

          {/* Author */}
          <Box display="flex" alignItems="center" mb={4}>
            <Avatar sx={{ bgcolor: "primary.main", mr: 2, width: 40, height: 40, fontSize: "1rem" }}>{article.authorInitial}</Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{article.authorName}</Typography>
              <Typography variant="caption" color="text.secondary">Published {moment(article.created_at).format("MMMM D, YYYY [at] h:mm A")}</Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />
          <Typography variant="body1" paragraph sx={{ whiteSpace: "pre-line", fontSize: "1.1rem", lineHeight: "1.8" }}>
            {article.content}
          </Typography>
        </Paper>
      )}

      {/* Delete Modal */}
      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Delete Article</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this article? This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)} color="primary">Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default DashboardNews;
