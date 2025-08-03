import React from "react";
import Navbar from "../components/Navbar/Navbar";
import { Outlet, useNavigation } from "react-router-dom";
import { Box } from "@mui/material";
import LoadingModal from "../utils/LoadingModal"

const PrivateLayout = () => {
  const navigation = useNavigation();

  return (
    <>
      {/* Show loading modal if route is changing */}
      {navigation.state === "loading" && <LoadingModal />}

      <Navbar />
      <Box mt="30px" px={3}>
        <Outlet />
      </Box>
    </>
  );
};

export default PrivateLayout;
