import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
// import { httpClient } from "../../utils/httpClientSetup";
import { publicClient } from "../../utils/publicClient";

const VerifyUserPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get("id");
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const { data } = await publicClient.post(`users/verify`, {
          id: userId,
          token: token,
        },
        // {
        //     headers:{
        //         Authorization: ""
        //     }
        // }
    
    );

        if (data.success) {
          setVerified(true);
          setSnackbar({
            open: true,
            message: data.message || "User verified successfully!",
            severity: "success",
          });
        } else {
          setVerified(false);
          setSnackbar({
            open: true,
            message: data.message || "Verification failed!",
            severity: "error",
          });
        }
      } catch (error) {
        console.error("Verification error:", error);
        setVerified(false);
        setSnackbar({
          open: true,
          message: "Verification failed! Please try again.",
          severity: "error",
        });
      } finally {
        setLoading(false); 
      }
    };

    if (userId && token) {
      verifyUser();
    } else {
      setSnackbar({
        open: true,
        message: "Invalid verification link!",
        severity: "error",
      });
      setLoading(false);
    }
  }, [userId, token]);

  const handleCreatePassword = () => {
    navigate(`/create-password/${userId}?token=${token}`,{ replace: true });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#eef2f7",
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "90%",
          maxWidth: 500,
          p: 4,
          textAlign: "center",
          borderRadius: 3,
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography
              variant="h5"
              fontWeight="bold"
              color={verified ? "success.main" : "error"}
              gutterBottom
            >
              {verified
                ? "Your email has been verified!"
                : "Verification failed!"}
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              {verified
                ? "You can now proceed to set your password or login."
                : "The verification link is invalid or has expired."}
            </Typography>

            {verified && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreatePassword}
                sx={{
                  mt: 2,
                  px: 4,
                  py: 1.2,
                  fontSize: "1rem",
                  fontWeight: "bold",
                  borderRadius: 3,
                }}
              >
                Create Password
              </Button>
            )}
          </>
        )}
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
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

export default VerifyUserPage;
