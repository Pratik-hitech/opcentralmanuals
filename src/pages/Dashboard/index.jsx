import { Outlet, useLoaderData, useNavigation } from "react-router-dom";
import { Box, Paper, Typography, CircularProgress, Container, Stack } from "@mui/material";
import NewsCard from "./components/NewsCard";
import RightCard from "./components/RightCard1";
import { httpClient } from "../../utils/httpClientSetup";

export async function loader() {
  try {
    const response = await httpClient.get("news");
    const data = response.data;

    if (!data.success) throw new Error(data.message || "Failed to fetch news");

    const formattedData = Array.isArray(data.data)
      ? data.data.map((item) => ({
          id: item.id || Math.random().toString(36).substring(2, 9),
          title: item.title || "Untitled",
          content: item.content || "No content available",
          created_at: item.created_at || new Date().toISOString(),
        }))
      : [];

    return formattedData;
  } catch (error) {
    console.error("Loader error:", error);
    return [];
  }
}

function Dashboard() {
  const news = useLoaderData();
  const navigation = useNavigation();

  if (navigation.state === "loading") {
    return (
      <Box sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)"
      }}>
        <CircularProgress size={80} thickness={4} sx={{ color: "primary.main" }} />
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)",
      py: 6
    }}>
      <Container maxWidth="xl">
        <Typography variant="h3" sx={{
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
            borderRadius: 3
          }
        }}>
          Dashboard
        </Typography>

        <Stack direction={{ xs: "column", lg: "row" }} spacing={4}>
          {/* Main Content Column */}
          <Box sx={{ flex: 2.5 }}>
            <Paper elevation={0} sx={{
              p: 4,
              borderRadius: 4,
              background: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(0,0,0,0.05)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)",
              mb: 4
            }}>
              <Typography variant="h4" sx={{
                fontWeight: 700,
                mb: 3,
                display: "flex",
                alignItems: "center",
                gap: 2
              }}>
                <Box component="span" sx={{
                  width: 8,
                  height: 32,
                  bgcolor: "primary.main",
                  borderRadius: 1
                }} />
                News Updates
              </Typography>
              <NewsCard newsData={news} />
            </Paper>
          </Box>

          {/* Sidebar Column */}
          <Box sx={{ flex: 1 }}>
            <Stack spacing={4}>
              <Paper elevation={0} sx={{
                p: 4,
                borderRadius: 4,
                background: "rgba(255,255,255,0.8)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(0,0,0,0.05)",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)"
              }}>
                <RightCard />
              </Paper>

              <Paper elevation={0} sx={{
                p: 4,
                borderRadius: 4,
                background: "rgba(255,255,255,0.8)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(0,0,0,0.05)",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)",
                overflow: "hidden"
              }}>
                <Typography variant="h5" sx={{
                  mb: 3,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 2
                }}>
                  <Box component="span" sx={{
                    width: 6,
                    height: 24,
                    bgcolor: "secondary.main",
                    borderRadius: 1
                  }} />
                  Social Feed
                </Typography>
                <Box sx={{ 
                  height: 500, 
                  borderRadius: 3, 
                  overflow: "hidden",
                  border: "1px solid rgba(0,0,0,0.1)"
                }}>
                  {/* <iframe
                    src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FBlueWheelers%2F&tabs=timeline&width=471&height=550&small_header=true&adapt_container_width=true&hide_cover=true&hide_cta=true&show_facepile=false"
                    width="100%"
                    height="100%"
                    style={{ border: "none" }}
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen={true}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    title="Facebook Stream"
                  /> */}
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