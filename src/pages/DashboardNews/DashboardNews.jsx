
import React, { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  IconButton, 
  Divider, 
  Avatar, 
  Paper,
  Menu,
  MenuItem
} from '@mui/material';
import { Print, MoreVert } from '@mui/icons-material';
import moment from 'moment';
import { httpClient } from "../../utils/httpClientSetup";

export async function dashboardNewsLoader({ params }) {
  try {
    // Fetch article data
    const articleResponse = await httpClient.get(`news/${params.id}`);
    if (!articleResponse.data.success) {
      throw new Error(articleResponse.data.message || 'Failed to fetch article');
    }
    const article = articleResponse.data.data;

    // Fetch user data if created_by exists
    let userName = 'Blue Wheelers Admin';
    let userInitial = 'B';
    if (article.created_by) {
      try {
        const userResponse = await httpClient.get(`users/${article.created_by}`);
        if (userResponse.data.success && userResponse.data.data.name) {
          userName = userResponse.data.data.name;
          userInitial = userName.charAt(0).toUpperCase();
        }
      } catch (userError) {
        console.error("Error fetching user:", userError);
      }
    }

    return {
      article: {
        ...article,
        authorName: userName,
        authorInitial: userInitial
      }
    };
  } catch (err) {
    console.error("Loader error:", err);
    throw new Response(
      JSON.stringify({ message: err.message || 'Failed to load article' }),
      { status: 404 }
    );
  }
}

const DashboardNews = () => {
    const { article } = useLoaderData();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handlePrint = () => {
        window.print();
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.8)' }}>
                {/* Header with title and action buttons */}
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
                    <Typography variant="h3" sx={{ fontWeight: 800 }}>
                        {article.title || 'Untitled Article'}
                    </Typography>
                    <Box>
                        <IconButton onClick={handlePrint} sx={{ mr: 1 }}>
                            <Print />
                        </IconButton>
                        <IconButton 
                          onClick={handleMenuClick}
                          aria-controls={open ? 'article-menu' : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? 'true' : undefined}
                        >
                            <MoreVert />
                        </IconButton>
                        <Menu
                          id="article-menu"
                          anchorEl={anchorEl}
                          open={open}
                          onClose={handleMenuClose}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}
                          sx={{
                            '& .MuiPaper-root': {
                              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                              borderRadius: '8px',
                              minWidth: '180px'
                            }
                          }}
                        >
                          <MenuItem onClick={handleMenuClose}>Share</MenuItem>
                          <MenuItem onClick={handleMenuClose}>Save to favorites</MenuItem>
                          <MenuItem onClick={handleMenuClose}>Report issue</MenuItem>
                        </Menu>
                    </Box>
                </Box>

                {/* Author and date */}
                <Box display="flex" alignItems="center" mb={4}>
                    <Avatar sx={{ 
                      bgcolor: 'primary.main', 
                      mr: 2,
                      width: 40,
                      height: 40,
                      fontSize: '1rem'
                    }}>
                        {article.authorInitial}
                    </Avatar>
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {article.authorName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Published {moment(article.created_at).format('MMMM D, YYYY [at] h:mm A')}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Article content */}
                <Typography variant="body1" paragraph sx={{ 
                  whiteSpace: 'pre-line',
                  fontSize: '1.1rem',
                  lineHeight: '1.8'
                }}>
                    {article.content}
                </Typography>

                <Divider sx={{ my: 3 }} />
            </Paper>
        </Box>
    );
};

export default DashboardNews;