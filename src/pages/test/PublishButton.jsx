// import React, { useState } from "react";
// import {
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from "@mui/material";
// import { usePermission } from "../../context/PermissionsContext";


// export default function PublishButton({ onPublish, hasPermission: customHasPermission }) {
//   const { hasPermission: contextHasPermission } = usePermission();
//   const hasPermission = customHasPermission || contextHasPermission;
//   const [open, setOpen] = React.useState(false);

//   const handleClick = () => {
//     if (hasPermission("news_publish")) {
//       onPublish && onPublish();
//     } else {
//       setOpen(true);
//     }
//   };

//   return (
//     <>
//       <Button variant="contained" color="primary" onClick={handleClick}>
//         Publish
//       </Button>

//       <Dialog open={open} onClose={() => setOpen(false)}>
//         <DialogTitle>Permission Denied</DialogTitle>
//         <DialogContent>
//           You do not have authority to publish news. Please contact the administrator.
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpen(false)} color="primary">
//             OK
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// }
import React from 'react'

const PublishButton = () => {
  return (
    <div>PublishButton</div>
  )
}

export default PublishButton