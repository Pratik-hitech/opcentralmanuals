// import { Outlet, useLoaderData, useNavigation } from "react-router-dom";
// import { Box, Paper, Typography, CircularProgress, Container, Stack } from "@mui/material";
// import NewsCard from "./components/NewsCard";
// import RightCard from "./components/RightCard1";
// import { httpClient } from "../../utils/httpClientSetup";

// export async function loader() {
//   try {
//     const response = await httpClient.get("news");
//     const data = response.data;

//     if (!data.success) throw new Error(data.message || "Failed to fetch news");

//     const formattedData = Array.isArray(data.data)
//       ? data.data.map((item) => ({
//           id: item.id || Math.random().toString(36).substring(2, 9),
//           title: item.title || "Untitled",
//           content: item.content || "No content available",
//           created_at: item.created_at || new Date().toISOString(),
//         }))
//       : [];

//     return formattedData;
//   } catch (error) {
//     console.error("Loader error:", error);
//     return [];
//   }
// }

// function Dashboard() {
//   const news = useLoaderData();
//   const navigation = useNavigation();

//   if (navigation.state === "loading") {
//     return (
//       <Box sx={{ 
//         display: "flex", 
//         justifyContent: "center", 
//         alignItems: "center", 
//         height: "100vh",
//         background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)"
//       }}>
//         <CircularProgress size={80} thickness={4} sx={{ color: "primary.main" }} />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{
//       minHeight: "100vh",
//       background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)",
//       py: 6
//     }}>
//       <Container maxWidth="xl">
//         <Typography variant="h3" sx={{
//           fontWeight: 800,
//           mb: 6,
//           color: "text.primary",
//           textAlign: "center",
//           position: "relative",
//           "&:after": {
//             content: '""',
//             position: "absolute",
//             bottom: -12,
//             left: "50%",
//             transform: "translateX(-50%)",
//             width: "100px",
//             height: "6px",
//             background: "linear-gradient(90deg, #3f51b5 0%, #2196f3 100%)",
//             borderRadius: 3
//           }
//         }}>
//           Dashboard
//         </Typography>

//         <Stack direction={{ xs: "column", lg: "row" }} spacing={4}>
//           {/* Main Content Column */}
//           <Box sx={{ flex: 2.5 }}>
//             <Paper elevation={0} sx={{
//               p: 4,
//               borderRadius: 4,
//               background: "rgba(255,255,255,0.8)",
//               backdropFilter: "blur(10px)",
//               border: "1px solid rgba(0,0,0,0.05)",
//               boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)",
//               mb: 4
//             }}>
//               <Typography variant="h4" sx={{
//                 fontWeight: 700,
//                 mb: 3,
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 2
//               }}>
//                 <Box component="span" sx={{
//                   width: 8,
//                   height: 32,
//                   bgcolor: "primary.main",
//                   borderRadius: 1
//                 }} />
//                 News Updates
//               </Typography>
//               <NewsCard newsData={news} />
//             </Paper>
//           </Box>

//           {/* Sidebar Column */}
//           <Box sx={{ flex: 1 }}>
//             <Stack spacing={4}>
//               <Paper elevation={0} sx={{
//                 p: 4,
//                 borderRadius: 4,
//                 background: "rgba(255,255,255,0.8)",
//                 backdropFilter: "blur(10px)",
//                 border: "1px solid rgba(0,0,0,0.05)",
//                 boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)"
//               }}>
//                 <RightCard />
//               </Paper>

//               <Paper elevation={0} sx={{
//                 p: 4,
//                 borderRadius: 4,
//                 background: "rgba(255,255,255,0.8)",
//                 backdropFilter: "blur(10px)",
//                 border: "1px solid rgba(0,0,0,0.05)",
//                 boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)",
//                 overflow: "hidden"
//               }}>
//                 <Typography variant="h5" sx={{
//                   mb: 3,
//                   fontWeight: 700,
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 2
//                 }}>
//                   <Box component="span" sx={{
//                     width: 6,
//                     height: 24,
//                     bgcolor: "secondary.main",
//                     borderRadius: 1
//                   }} />
//                   Social Feed
//                 </Typography>
//                 <Box sx={{ 
//                   height: 500, 
//                   borderRadius: 3, 
//                   overflow: "hidden",
//                   border: "1px solid rgba(0,0,0,0.1)"
//                 }}>
//                   {/* <iframe
//                     src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FBlueWheelers%2F&tabs=timeline&width=471&height=550&small_header=true&adapt_container_width=true&hide_cover=true&hide_cta=true&show_facepile=false"
//                     width="100%"
//                     height="100%"
//                     style={{ border: "none" }}
//                     scrolling="no"
//                     frameBorder="0"
//                     allowFullScreen={true}
//                     allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
//                     title="Facebook Stream"
//                   /> */}
//                 </Box>
//               </Paper>
//             </Stack>
//           </Box>
//         </Stack>
//       </Container>
//     </Box>
//   );
// }

// export default Dashboard;


// import React, { useState, useEffect } from "react";
// import {
//   Outlet,
//   useLoaderData,
//   useNavigation,
//   useSearchParams,
//   useNavigate,
// } from "react-router-dom";
// import {
//   Box,
//   Paper,
//   Typography,
//   Container,
//   Stack,
//   Pagination,
//   MenuItem,
//   Select,
//   FormControl,
//   CircularProgress,
// } from "@mui/material";
// import NewsCard from "./components/NewsCard";
// import RightCard from "./components/RightCard1";
// import { httpClient } from "../../utils/httpClientSetup";

// // Helper function to truncate content
// const truncateContent = (content, maxLength = 200) => {
//   if (!content) return "No content available";
//   if (content.length <= maxLength) return content;
//   return content.substring(0, maxLength) + "...";
// };

// // Loader function with fixed pagination & status filter
// export async function loader({ request }) {
//   try {
//     const url = new URL(request.url);
//     const page = url.searchParams.get("page") || 1;
//     const perPage = url.searchParams.get("per_page") || 10;

//     const response = await httpClient.get(
//       `news?page=${page}&per_page=${perPage}&status=published`
//     );
//     const data = response.data;

//     if (!data.success) throw new Error(data.message || "Failed to fetch news");

//     return {
//       news: data.data.map((item) => ({
//         id: item.id || Math.random().toString(36).substring(2, 9),
//         title: item.title || "Untitled",
//         content: truncateContent(item.content),
//         fullContent: item.content || "",
//         created_at: item.created_at || new Date().toISOString(),
//         status: item.status || "published",
//       })),
//       pagination: {
//         ...data.pagination,
//         per_page: parseInt(perPage),
//       },
//     };
//   } catch (error) {
//     console.error("Loader error:", error);
//     return {
//       news: [],
//       pagination: {
//         total: 0,
//         current_page: 1,
//         last_page: 1,
//         per_page: 10,
//       },
//     };
//   }
// }

// function Dashboard() {
//   const loaderData = useLoaderData();
//   const navigation = useNavigation();
//   const [searchParams, setSearchParams] = useSearchParams();
//   const currentPage = parseInt(searchParams.get("page") || 1);
//   const [itemsPerPage, setItemsPerPage] = useState(
//     loaderData.pagination.per_page || 10
//   );

//   const [news, setNews] = useState(loaderData.news || []);
//   const [pagination, setPagination] = useState(loaderData.pagination || {});
//   const [isLoading, setIsLoading] = useState(false);

//   const navigate = useNavigate();

//   // Update news and pagination when loaderData changes
//   useEffect(() => {
//     setNews(loaderData.news);
//     setPagination(loaderData.pagination);
//     setIsLoading(false);
//   }, [loaderData.news, loaderData.pagination]);

//   // Show loading overlay when navigation state is loading
//   useEffect(() => {
//     if (navigation.state === "loading") {
//       setIsLoading(true);
//     } else {
//       setIsLoading(false);
//     }
//   }, [navigation.state]);

//   const handlePageChange = (event, value) => {
//     setSearchParams({ page: value, per_page: itemsPerPage });
//     const newsSection = document.getElementById("news-section");
//     if (newsSection) newsSection.scrollIntoView({ behavior: "smooth" });
//   };

//   const handleItemsPerPageChange = (event) => {
//     const newPerPage = event.target.value;
//     setItemsPerPage(newPerPage);
//     setSearchParams({ page: 1, per_page: newPerPage });
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)",
//         py: 6,
//       }}
//     >
//       <Container maxWidth="xl">
//         <Typography
//           variant="h3"
//           sx={{
//             fontWeight: 800,
//             mb: 6,
//             color: "text.primary",
//             textAlign: "center",
//             position: "relative",
//             "&:after": {
//               content: '""',
//               position: "absolute",
//               bottom: -12,
//               left: "50%",
//               transform: "translateX(-50%)",
//               width: "100px",
//               height: "6px",
//               background: "linear-gradient(90deg, #3f51b5 0%, #2196f3 100%)",
//               borderRadius: 3,
//             },
//           }}
//         >
//           Dashboard
//         </Typography>

//         <Stack direction={{ xs: "column", lg: "row" }} spacing={4}>
//           {/* Main Content */}
//           <Box sx={{ flex: 2.5 }} id="news-section">
//             <Paper
//               elevation={0}
//               sx={{
//                 p: 4,
//                 borderRadius: 4,
//                 background: "rgba(255,255,255,0.8)",
//                 backdropFilter: "blur(10px)",
//                 border: "1px solid rgba(0,0,0,0.05)",
//                 boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)",
//                 mb: 4,
//                 position: "relative",
//               }}
//             >
//               {/* Overlay loader */}
//               {isLoading && (
//                 <Box
//                   sx={{
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     right: 0,
//                     bottom: 0,
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     backgroundColor: "rgba(255,255,255,0.7)",
//                     zIndex: 2,
//                     borderRadius: 4,
//                   }}
//                 >
//                   {/* <CircularProgress /> */}
//                 </Box>
//               )}

//               <Typography
//                 variant="h4"
//                 sx={{
//                   fontWeight: 700,
//                   mb: 3,
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 2,
//                 }}
//               >
//                 <Box
//                   component="span"
//                   sx={{
//                     width: 8,
//                     height: 32,
//                     bgcolor: "primary.main",
//                     borderRadius: 1,
//                   }}
//                 />
//                 News Updates
//               </Typography>

//               {news.length > 0 ? (
//                 <>
//                   <NewsCard newsData={news} />

//                   {pagination.total > 0 && (
//                     <Box
//                       sx={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                         mt: 4,
//                         flexDirection: { xs: "column", sm: "row" },
//                         gap: 2,
//                       }}
//                     >
//                       {/* Items per page */}
//                       <Box sx={{ display: "flex", alignItems: "center" }}>
//                         <Typography variant="body2" sx={{ mr: 2 }}>
//                           Items per page:
//                         </Typography>
//                         <FormControl size="small" sx={{ minWidth: 80 }}>
//                           <Select
//                             value={itemsPerPage}
//                             onChange={handleItemsPerPageChange}
//                             disabled={isLoading}
//                           >
//                             <MenuItem value={5}>5</MenuItem>
//                             <MenuItem value={10}>10</MenuItem>
//                             <MenuItem value={15}>15</MenuItem>
//                             <MenuItem value={20}>20</MenuItem>
//                           </Select>
//                         </FormControl>
//                       </Box>

//                       {/* Pagination */}
//                       <Box sx={{ display: "flex", alignItems: "center" }}>
//                         <Pagination
//                           count={Math.ceil(pagination.total / itemsPerPage)}
//                           page={currentPage}
//                           onChange={handlePageChange}
//                           color="primary"
//                           size="medium"
//                           disabled={isLoading}
//                           sx={{
//                             "& .MuiPaginationItem-root": {
//                               fontSize: "0.9rem",
//                               minWidth: "36px",
//                               height: "36px",
//                               borderRadius: "6px",
//                               border: "1px solid #ddd",
//                               margin: "0 3px",
//                               backgroundColor: "#fff",
//                               transition: "all 0.2s ease-in-out",
//                               "&.Mui-selected": {
//                                 fontWeight: "bold",
//                                 backgroundColor: "#1976d2",
//                                 color: "#fff",
//                                 borderColor: "#1976d2",
//                                 boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
//                                 "&:hover": { backgroundColor: "#1565c0" },
//                               },
//                               "&:hover": {
//                                 backgroundColor: "rgba(0, 0, 0, 0.05)",
//                               },
//                             },
//                           }}
//                         />
//                         <Typography variant="body2" sx={{ ml: 2 }}>
//                           Showing{" "}
//                           {(currentPage - 1) * itemsPerPage + 1} –{" "}
//                           {Math.min(currentPage * itemsPerPage, pagination.total)}{" "}
//                           of {pagination.total} articles
//                         </Typography>
//                       </Box>
//                     </Box>
//                   )}
//                 </>
//               ) : (
//                 <Typography
//                   variant="body1"
//                   sx={{ textAlign: "center", py: 4, color: "text.secondary" }}
//                 >
//                   No published news available
//                 </Typography>
//               )}
//             </Paper>
//           </Box>

//           {/* Sidebar */}
//           <Box sx={{ flex: 1 }}>
//             <Stack spacing={4}>
//               <Paper
//                 elevation={0}
//                 sx={{
//                   p: 4,
//                   borderRadius: 4,
//                   background: "rgba(255,255,255,0.8)",
//                   backdropFilter: "blur(10px)",
//                   border: "1px solid rgba(0,0,0,0.05)",
//                   boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)",
//                 }}
//               >
//                 <RightCard />
//               </Paper>

//               <Paper
//                 elevation={0}
//                 sx={{
//                   p: 4,
//                   borderRadius: 4,
//                   background: "rgba(255,255,255,0.8)",
//                   backdropFilter: "blur(10px)",
//                   border: "1px solid rgba(0,0,0,0.05)",
//                   boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)",
//                   overflow: "hidden",
//                 }}
//               >
//                 <Typography
//                   variant="h5"
//                   sx={{
//                     mb: 3,
//                     fontWeight: 700,
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 2,
//                   }}
//                 >
//                   <Box
//                     component="span"
//                     sx={{
//                       width: 6,
//                       height: 24,
//                       bgcolor: "secondary.main",
//                       borderRadius: 1,
//                     }}
//                   />
//                   Social Feed
//                 </Typography>
//                 <Box
//                   sx={{
//                     height: 500,
//                     borderRadius: 3,
//                     overflow: "hidden",
//                     border: "1px solid rgba(0,0,0,0.1)",
//                   }}
//                 >
//                   <iframe
//                     src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FBlueWheelers%2F&tabs=timeline&width=471&height=550&small_header=true&adapt_container_width=true&hide_cover=true&hide_cta=true&show_facepile=false"
//                     width="100%"
//                     height="100%"
//                     style={{ border: "none" }}
//                     scrolling="no"
//                     frameBorder="0"
//                     allowFullScreen={true}
//                     allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
//                     title="Facebook Stream"
//                   />
//                 </Box>
//               </Paper>
//             </Stack>
//           </Box>
//         </Stack>
//       </Container>
//     </Box>
//   );
// }

// export default Dashboard;




// import React, { useState, useEffect } from "react";
// import {
//   Outlet,
//   useLoaderData,
//   useNavigation,
//   useSearchParams,
//   useNavigate,
// } from "react-router-dom";
// import {
//   Box,
//   Paper,
//   Typography,
//   Container,
//   Stack,
//   Pagination,
//   MenuItem,
//   Select,
//   FormControl,
//   CircularProgress,
// } from "@mui/material";
// import NewsCard from "./components/NewsCard";
// import RightCard from "./components/RightCard1";
// import { httpClient } from "../../utils/httpClientSetup";

// // Helper function to truncate content
// const truncateContent = (content, maxLength = 200) => {
//   if (!content) return "No content available";
//   if (content.length <= maxLength) return content;
//   return content.substring(0, maxLength) + "...";
// };

// // Loader function with fixed pagination & status filter
// export async function loader({ request }) {
//   try {
//     const url = new URL(request.url);
//     const page = url.searchParams.get("page") || 1;
//     const perPage = url.searchParams.get("per_page") || 10;

//     const response = await httpClient.get(
//       `news?page=${page}&per_page=${perPage}&status=published`
//     );
//     const data = response.data;

//     if (!data.success) throw new Error(data.message || "Failed to fetch news");

//     return {
//       news: data.data.map((item) => ({
//         id: item.id || Math.random().toString(36).substring(2, 9),
//         title: item.title || "Untitled",
//         content: truncateContent(item.content),
//         fullContent: item.content || "",
//         created_at: item.created_at || new Date().toISOString(),
//         status: item.status || "published",
//       })),
//       pagination: {
//         ...data.pagination,
//         per_page: parseInt(perPage),
//       },
//     };
//   } catch (error) {
//     console.error("Loader error:", error);
//     return {
//       news: [],
//       pagination: {
//         total: 0,
//         current_page: 1,
//         last_page: 1,
//         per_page: 10,
//       },
//     };
//   }
// }

// function Dashboard() {
//   const loaderData = useLoaderData();
//   const navigation = useNavigation();
//   const [searchParams, setSearchParams] = useSearchParams();
//   const currentPage = parseInt(searchParams.get("page") || 1);
//   const [itemsPerPage, setItemsPerPage] = useState(
//     loaderData.pagination.per_page || 10
//   );

//   const [news, setNews] = useState(loaderData.news || []);
//   const [pagination, setPagination] = useState(loaderData.pagination || {});
//   const [isLoading, setIsLoading] = useState(false);

//   const navigate = useNavigate();

//   // Update news and pagination when loaderData changes
//   useEffect(() => {
//     setNews(loaderData.news);
//     setPagination(loaderData.pagination);
//     setIsLoading(false);
//   }, [loaderData.news, loaderData.pagination]);

//   // Show loading overlay when navigation state is loading
//   useEffect(() => {
//     if (navigation.state === "loading") {
//       setIsLoading(true);
//     } else {
//       setIsLoading(false);
//     }
//   }, [navigation.state]);

//   const handlePageChange = (event, value) => {
//     setSearchParams({ page: value, per_page: itemsPerPage });
//     const newsSection = document.getElementById("news-section");
//     if (newsSection) newsSection.scrollIntoView({ behavior: "smooth" });
//   };

//   const handleItemsPerPageChange = (event) => {
//     const newPerPage = event.target.value;
//     setItemsPerPage(newPerPage);
//     setSearchParams({ page: 1, per_page: newPerPage });
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)",
//         py: 6,
//       }}
//     >
//       <Container maxWidth="xl">
//         <Typography
//           variant="h3"
//           sx={{
//             fontWeight: 800,
//             mb: 6,
//             color: "text.primary",
//             textAlign: "center",
//             position: "relative",
//             "&:after": {
//               content: '""',
//               position: "absolute",
//               bottom: -12,
//               left: "50%",
//               transform: "translateX(-50%)",
//               width: "100px",
//               height: "6px",
//               background: "linear-gradient(90deg, #3f51b5 0%, #2196f3 100%)",
//               borderRadius: 3,
//             },
//           }}
//         >
//           Dashboard
//         </Typography>

//         <Stack direction={{ xs: "column", lg: "row" }} spacing={4}>
//           {/* Main Content */}
//           <Box sx={{ flex: 2.5 }} id="news-section">
//             <Paper
//               elevation={0}
//               sx={{
//                 p: 4,
//                 borderRadius: 4,
//                 background: "rgba(255,255,255,0.8)",
//                 backdropFilter: "blur(10px)",
//                 border: "1px solid rgba(0,0,0,0.05)",
//                 boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)",
//                 mb: 4,
//                 position: "relative",
//               }}
//             >
//               {/* Overlay loader */}
//               {isLoading && (
//                 <Box
//                   sx={{
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     right: 0,
//                     bottom: 0,
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     backgroundColor: "rgba(255,255,255,0.7)",
//                     zIndex: 2,
//                     borderRadius: 4,
//                   }}
//                 >
//                   {/* <CircularProgress /> */}
//                 </Box>
//               )}

//               <Typography
//                 variant="h4"
//                 sx={{
//                   fontWeight: 700,
//                   mb: 3,
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 2,
//                 }}
//               >
//                 <Box
//                   component="span"
//                   sx={{
//                     width: 8,
//                     height: 32,
//                     bgcolor: "primary.main",
//                     borderRadius: 1,
//                   }}
//                 />
//                 News Updates
//               </Typography>

//               {news.length > 0 ? (
//                 <>
//                   <NewsCard newsData={news} />

//                   {pagination.total > 0 && (
//                     <Box
//                       sx={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                         mt: 4,
//                         flexDirection: { xs: "column", sm: "row" },
//                         gap: 2,
//                       }}
//                     >
//                       {/* Items per page */}
//                       <Box sx={{ display: "flex", alignItems: "center" }}>
//                         <Typography variant="body2" sx={{ mr: 2 }}>
//                           Items per page:
//                         </Typography>
//                         <FormControl size="small" sx={{ minWidth: 80 }}>
//                           <Select
//                             value={itemsPerPage}
//                             onChange={handleItemsPerPageChange}
//                             disabled={isLoading}
//                           >
//                             <MenuItem value={5}>5</MenuItem>
//                             <MenuItem value={10}>10</MenuItem>
//                             <MenuItem value={15}>15</MenuItem>
//                             <MenuItem value={20}>20</MenuItem>
//                           </Select>
//                         </FormControl>
//                       </Box>

//                       {/* Pagination */}
//                       <Box sx={{ display: "flex", alignItems: "center" }}>
//                         <Pagination
//                           count={Math.ceil(pagination.total / itemsPerPage)}
//                           page={currentPage}
//                           onChange={handlePageChange}
//                           color="primary"
//                           size="medium"
//                           disabled={isLoading}
//                           sx={{
//                             "& .MuiPaginationItem-root": {
//                               fontSize: "0.9rem",
//                               minWidth: "36px",
//                               height: "36px",
//                               borderRadius: "6px",
//                               border: "1px solid #ddd",
//                               margin: "0 3px",
//                               backgroundColor: "#fff",
//                               transition: "all 0.2s ease-in-out",
//                               "&.Mui-selected": {
//                                 fontWeight: "bold",
//                                 backgroundColor: "#1976d2",
//                                 color: "#fff",
//                                 borderColor: "#1976d2",
//                                 boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
//                                 "&:hover": { backgroundColor: "#1565c0" },
//                               },
//                               "&:hover": {
//                                 backgroundColor: "rgba(0, 0, 0, 0.05)",
//                               },
//                             },
//                           }}
//                         />
//                         <Typography variant="body2" sx={{ ml: 2 }}>
//                           Showing{" "}
//                           {(currentPage - 1) * itemsPerPage + 1} –{" "}
//                           {Math.min(currentPage * itemsPerPage, pagination.total)}{" "}
//                           of {pagination.total} articles
//                         </Typography>
//                       </Box>
//                     </Box>
//                   )}
//                 </>
//               ) : (
//                 <Typography
//                   variant="body1"
//                   sx={{ textAlign: "center", py: 4, color: "text.secondary" }}
//                 >
//                   No published news available
//                 </Typography>
//               )}
//             </Paper>
//           </Box>

//           {/* Sidebar */}
//           <Box sx={{ flex: 1 }}>
//             <Stack spacing={4}>
//               <Paper
//                 elevation={0}
//                 sx={{
//                   p: 4,
//                   borderRadius: 4,
//                   background: "rgba(255,255,255,0.8)",
//                   backdropFilter: "blur(10px)",
//                   border: "1px solid rgba(0,0,0,0.05)",
//                   boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)",
//                 }}
//               >
//                 <RightCard />
//               </Paper>

//               <Paper
//                 elevation={0}
//                 sx={{
//                   p: 4,
//                   borderRadius: 4,
//                   background: "rgba(255,255,255,0.8)",
//                   backdropFilter: "blur(10px)",
//                   border: "1px solid rgba(0,0,0,0.05)",
//                   boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)",
//                   overflow: "hidden",
//                 }}
//               >
//                 <Typography
//                   variant="h5"
//                   sx={{
//                     mb: 3,
//                     fontWeight: 700,
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 2,
//                   }}
//                 >
//                   <Box
//                     component="span"
//                     sx={{
//                       width: 6,
//                       height: 24,
//                       bgcolor: "secondary.main",
//                       borderRadius: 1,
//                     }}
//                   />
//                   Social Feed
//                 </Typography>
//                 <Box
//                   sx={{
//                     height: 500,
//                     borderRadius: 3,
//                     overflow: "hidden",
//                     border: "1px solid rgba(0,0,0,0.1)",
//                   }}
//                 >
//                   <iframe
//                     src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FBlueWheelers%2F&tabs=timeline&width=471&height=550&small_header=true&adapt_container_width=true&hide_cover=true&hide_cta=true&show_facepile=false"
//                     width="100%"
//                     height="100%"
//                     style={{ border: "none" }}
//                     scrolling="no"
//                     frameBorder="0"
//                     allowFullScreen={true}
//                     allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
//                     title="Facebook Stream"
//                   />
//                 </Box>
//               </Paper>
//             </Stack>
//           </Box>
//         </Stack>
//       </Container>
//     </Box>
//   );
// }

// export default Dashboard;




import React, { useState, useEffect } from "react";
import {
  Outlet,
  useLoaderData,
  useNavigation,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Container,
  Stack,
  Pagination,
  MenuItem,
  Select,
  FormControl,
  CircularProgress,
} from "@mui/material";
import NewsCard from "./components/NewsCard";
import RightCard from "./components/RightCard1";
import { httpClient } from "../../utils/httpClientSetup";

// Loader function to fetch paginated news
export async function loader({ request }) {
  try {
    const url = new URL(request.url);
    const page = url.searchParams.get("page") || 1;
    const perPage = url.searchParams.get("per_page") || 10;

    const response = await httpClient.get(
      `news?page=${page}&per_page=${perPage}&status=published`
    );
    const data = response.data;

    if (!data.success) throw new Error(data.message || "Failed to fetch news");

    return {
      news: data.data, // ✅ Pass the full raw objects now
      pagination: {
        ...data.pagination,
        per_page: parseInt(perPage),
      },
    };
  } catch (error) {
    console.error("Loader error:", error);
    return {
      news: [],
      pagination: {
        total: 0,
        current_page: 1,
        last_page: 1,
        per_page: 10,
      },
    };
  }
}

function Dashboard() {
  const loaderData = useLoaderData();
  const navigation = useNavigation();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || 1);
  const [itemsPerPage, setItemsPerPage] = useState(
    loaderData.pagination.per_page || 10
  );

  const [news, setNews] = useState(loaderData.news || []);
  const [pagination, setPagination] = useState(loaderData.pagination || {});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Update news and pagination when loaderData changes
  useEffect(() => {
    setNews(loaderData.news);
    setPagination(loaderData.pagination);
    setIsLoading(false);
  }, [loaderData.news, loaderData.pagination]);

  // Show loading overlay when navigation state is loading
  useEffect(() => {
    setIsLoading(navigation.state === "loading");
  }, [navigation.state]);

  const handlePageChange = (event, value) => {
    setSearchParams({ page: value, per_page: itemsPerPage });
    const newsSection = document.getElementById("news-section");
    if (newsSection) newsSection.scrollIntoView({ behavior: "smooth" });
  };

  const handleItemsPerPageChange = (event) => {
    const newPerPage = event.target.value;
    setItemsPerPage(newPerPage);
    setSearchParams({ page: 1, per_page: newPerPage });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)",
        py: 6,
      }}
    >
      <Container maxWidth="xl">
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            mb: 6,
            color: "text.primary",
            textAlign: "center",
            position: "relative",
            "&:after": {
              content: '""',
              position: "absolute",
              bottom: -12,
              left: "50%",
              transform: "translateX(-50%)",
              width: "100px",
              height: "6px",
              background: "linear-gradient(90deg, #3f51b5 0%, #2196f3 100%)",
              borderRadius: 3,
            },
          }}
        >
          Dashboard
        </Typography>

        <Stack direction={{ xs: "column", lg: "row" }} spacing={4}>
          {/* Main Content */}
          <Box sx={{ flex: 2.5 }} id="news-section">
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 4,
                background: "rgba(255,255,255,0.8)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(0,0,0,0.05)",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)",
                mb: 4,
                position: "relative",
              }}
            >
              {/* Overlay loader */}
              {isLoading && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(255,255,255,0.7)",
                    zIndex: 2,
                    borderRadius: 4,
                  }}
                >
                  {/* <CircularProgress /> */}
                </Box>
              )}

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 8,
                    height: 32,
                    bgcolor: "primary.main",
                    borderRadius: 1,
                  }}
                />
                News Updates
              </Typography>

              {news.length > 0 ? (
                <>
                  {/* ✅ Send entire data to NewsCard */}
                  <NewsCard newsData={news} />

                  {pagination.total > 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 4,
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 2,
                      }}
                    >
                      {/* Items per page */}
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="body2" sx={{ mr: 2 }}>
                          Items per page:
                        </Typography>
                        <FormControl size="small" sx={{ minWidth: 80 }}>
                          <Select
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                            disabled={isLoading}
                          >
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={15}>15</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>

                      {/* Pagination */}
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Pagination
                          count={Math.ceil(pagination.total / itemsPerPage)}
                          page={currentPage}
                          onChange={handlePageChange}
                          color="primary"
                          size="medium"
                          disabled={isLoading}
                          sx={{
                            "& .MuiPaginationItem-root": {
                              fontSize: "0.9rem",
                              minWidth: "36px",
                              height: "36px",
                              borderRadius: "6px",
                              border: "1px solid #ddd",
                              margin: "0 3px",
                              backgroundColor: "#fff",
                              transition: "all 0.2s ease-in-out",
                              "&.Mui-selected": {
                                fontWeight: "bold",
                                backgroundColor: "#1976d2",
                                color: "#fff",
                                borderColor: "#1976d2",
                                boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
                                "&:hover": { backgroundColor: "#1565c0" },
                              },
                              "&:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.05)",
                              },
                            },
                          }}
                        />
                        <Typography variant="body2" sx={{ ml: 2 }}>
                          Showing{" "}
                          {(currentPage - 1) * itemsPerPage + 1} –{" "}
                          {Math.min(currentPage * itemsPerPage, pagination.total)}{" "}
                          of {pagination.total} articles
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </>
              ) : (
                <Typography
                  variant="body1"
                  sx={{ textAlign: "center", py: 4, color: "text.secondary" }}
                >
                  No published news available
                </Typography>
              )}
            </Paper>
          </Box>

          {/* Sidebar */}
          <Box sx={{ flex: 1 }}>
            <Stack spacing={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: "rgba(255,255,255,0.8)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(0,0,0,0.05)",
                  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)",
                }}
              >
                <RightCard />
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: "rgba(255,255,255,0.8)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(0,0,0,0.05)",
                  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)",
                  overflow: "hidden",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    mb: 3,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      width: 6,
                      height: 24,
                      bgcolor: "secondary.main",
                      borderRadius: 1,
                    }}
                  />
                  Social Feed
                </Typography>
                <Box
                  sx={{
                    height: 500,
                    borderRadius: 3,
                    overflow: "hidden",
                    border: "1px solid rgba(0,0,0,0.1)",
                  }}
                >
                  <iframe
                    src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FBlueWheelers%2F&tabs=timeline&width=471&height=550&small_header=true&adapt_container_width=true&hide_cover=true&hide_cta=true&show_facepile=false"
                    width="100%"
                    height="100%"
                    style={{ border: "none" }}
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen={true}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    title="Facebook Stream"
                  />
                </Box>
              </Paper>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

export default Dashboard;
