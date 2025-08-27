// import React, { useState } from 'react';
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Checkbox,
//   FormControlLabel,
//   Divider,
//   Grid,
//   Paper
// } from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// const RoleDetailsForm = () => {
//   const [roleName, setRoleName] = useState('Dashboard');
//   const [expanded, setExpanded] = useState('general');

//   const [permissions, setPermissions] = useState({
//     general: {
//       manageSystemSettings: false,
//       regionalManager: true,
//       manageLocationsDetails: false,
//       manageUsers: false,
//       canDeleteUsersLocations: false,
//       canTagUserGroups: false,
//       manageCustomFields: false,
//       manageSystemFields: false,
//       usersManagedRegions: false,
//       restrictRules: true
//     },
//     events: {
//       hasAccess: true,
//       manageEvents: false
//     },
//     fileManager: {
//       hasAccess: true,
//       manageContent: false
//     },
//     keyContacts: {
//       hasAccess: true,
//       manageContacts: false
//     },
//     news: {
//       hasAccess: true,
//       delete: false,
//       canPublish: false,
//       canManageDrafts: false,
//       exportPDF: false,
//       viewReporting: false
//     },
//     operationsManuals: {
//       hasAccess: true,
//       exportPDF: false,
//       canPublish: false,
//       canManageDrafts: false,
//       viewReporting: false
//     },
//     quickLinks: {
//       hasAccess: true,
//       manageLinks: false
//     },
//     socialTimeline: {
//       hasAccess: true,
//       canCreatePosts: false
//     }
//   });

//   const handleAccordionChange = (panel) => (event, isExpanded) => {
//     setExpanded(isExpanded ? panel : false);
//   };

//   const handlePermissionChange = (section, key) => (event) => {
//     setPermissions({
//       ...permissions,
//       [section]: {
//         ...permissions[section],
//         [key]: event.target.checked
//       }
//     });
//   };

//   const moduleExtraPermissions = {
//     events: ['manageEvents'],
//     fileManager: ['manageContent'],
//     keyContacts: ['manageContacts'],
//     news: ['delete', 'canPublish', 'canManageDrafts', 'exportPDF', 'viewReporting'],
//     operationsManuals: ['exportPDF', 'canPublish', 'canManageDrafts', 'viewReporting'],
//     quickLinks: ['manageLinks'],
//     socialTimeline: ['canCreatePosts']
//   };

//   const labels = {
//     manageSystemSettings: 'Manage System Settings',
//     regionalManager: 'Regional Manager',
//     manageLocationsDetails: 'Manage Locations & Details',
//     manageUsers: 'Manage Users',
//     canDeleteUsersLocations: 'Can Delete Users/Locations',
//     canTagUserGroups: 'Can Tag User Groups',
//     manageCustomFields: 'Manage Custom Fields',
//     manageSystemFields: 'Manage System Fields',
//     usersManagedRegions: 'Users Managed Region(s)',
//     restrictRules: 'Restrict Rules',
//     manageEvents: 'Manage Events',
//     manageContent: 'Manage Content',
//     manageContacts: 'Manage Contacts',
//     delete: 'Delete',
//     canPublish: 'Can Publish',
//     canManageDrafts: 'Can Manage Drafts',
//     exportPDF: "Export PDF's",
//     viewReporting: 'View Reporting',
//     manageLinks: 'Manage Links',
//     canCreatePosts: 'Can Create Posts'
//   };

//   return (
//     <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
//       <Typography variant="h5" gutterBottom>
//         ROLE DETAILS
//       </Typography>

//       <Grid container spacing={3} sx={{ maxWidth: '70%' }}>
//         <Grid item xs={12}>
//           <TextField
//             fullWidth
//             label="Role Name *"
//             value={roleName}
//             onChange={(e) => setRoleName(e.target.value)}
//             margin="normal"
//           />
//         </Grid>
//       </Grid>

//       <Box sx={{ mt: 4 }}>
//         {/* GENERAL Accordion */}
//         <Accordion
//           expanded={expanded === 'general'}
//           onChange={handleAccordionChange('general')}
//         >
//           <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//             <Typography sx={{ flexGrow: 1 }}>GENERAL</Typography>
//           </AccordionSummary>
//           <AccordionDetails>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
//               {Object.keys(permissions.general).map((permKey) => (
//                 <FormControlLabel
//                   key={permKey}
//                   control={
//                     <Checkbox
//                       checked={permissions.general[permKey]}
//                       onChange={handlePermissionChange('general', permKey)}
//                     />
//                   }
//                   label={labels[permKey]}
//                 />
//               ))}
//             </Box>
//           </AccordionDetails>
//         </Accordion>

//         {/* MODULES with hasAccess */}
//         {Object.keys(moduleExtraPermissions).map((module) =>
//           permissions[module]?.hasAccess !== undefined ? (
//             <Accordion
//               key={module}
//               expanded={expanded === module}
//               onChange={handleAccordionChange(module)}
//             >
//               <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                 <Typography sx={{ flexGrow: 1 }}>
//                   {module.split(/(?=[A-Z])/).join(' ').toUpperCase()}
//                 </Typography>
//                 <FormControlLabel
//                   control={
//                     <Checkbox
//                       checked={permissions[module].hasAccess}
//                       onChange={handlePermissionChange(module, 'hasAccess')}
//                     />
//                   }
//                   label="Has Access"
//                   sx={{ m: 0 }}
//                 />
//               </AccordionSummary>
//               {permissions[module].hasAccess && (
//                 <AccordionDetails>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
//                     {moduleExtraPermissions[module].map((permKey) => (
//                       <FormControlLabel
//                         key={permKey}
//                         control={
//                           <Checkbox
//                             checked={permissions[module][permKey]}
//                             onChange={handlePermissionChange(module, permKey)}
//                           />
//                         }
//                         label={labels[permKey]}
//                       />
//                     ))}
//                   </Box>
//                 </AccordionDetails>
//               )}
//             </Accordion>
//           ) : null
//         )}
//       </Box>

//       <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
//         <Button variant="outlined" sx={{ mr: 2 }}>
//           Cancel
//         </Button>
//         <Button variant="contained" color="primary">
//           Submit
//         </Button>
//       </Box>
//     </Paper>
//   );
// };

// export default RoleDetailsForm;


// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { usePermission } from "../../../context/PermissionsContext";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Checkbox,
//   FormControlLabel,
//   Grid,
//   Paper,
//   CircularProgress,
//   Snackbar,
//   Alert
// } from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { httpClient } from "../../../utils/httpClientSetup";

// const RoleDetailsForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { updatePermissions, isAdmin } = usePermission();
//   const isCreateMode = !id || id === 'create';
//   const [roleName, setRoleName] = useState('');
//   const [expanded, setExpanded] = useState('general');
//   const [loading, setLoading] = useState(!isCreateMode);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: '',
//     severity: 'success'
//   });
//   const [permissions, setPermissions] = useState({});

//   // Initialize with default permissions structure
//   const defaultPermissions = {
//     manage_system_setting: false,
//     regional_manager: false,
//     manage_locations: false,
//     location_details: false,
//     manage_users: false,
//     user_details: false,
//     does_restrict_roles: false,
//     can_tag_user_groups: false,
//     manage_custom_fields: false,
//     manage_system_fields: false,
//     event_access: false,
//     manage_events: false,
//     file_access: false,
//     manage_files: false,
//     contact_access: false,
//     manage_contacts: false,
//     news_access: false,
//     news_delete: false,
//     news_can_publish: false,
//     news_manage_draft: false,
//     news_export_pdf: false,
//     news_view_reporting: false,
//     manual_access: false,
//     manual_delete: false,
//     manual_publish: false,
//     manual_drafts: false,
//     manual_export_pdf: false,
//     manual_view_reporting: false,
//     links_access: false,
//     manage_links: false,
//     timeline_access: false,
//     can_create_posts: false
//   };

//   // Check if user has permission to access this form
//   useEffect(() => {
//     if (!isAdmin()) {
//       navigate('/unauthorized');
//     }
//   }, [isAdmin, navigate]);

//   // Fetch role details in edit mode
//   useEffect(() => {
//     if (isCreateMode) {
//       setPermissions(defaultPermissions);
//       setLoading(false);
//       return;
//     }

//     const fetchRoleDetails = async () => {
//       try {
//         const response = await httpClient.get(`roles/${id}`);
        
//         if (response.data.success) {
//           const roleData = response.data.data;
//           setRoleName(roleData.label || roleData.name);
          
//           // Map permissions from API to our state
//           const formattedPermissions = { ...defaultPermissions };
//           for (const [key, value] of Object.entries(roleData.permissions)) {
//             if (key in formattedPermissions) {
//               formattedPermissions[key] = value === "1";
//             }
//           }
          
//           setPermissions(formattedPermissions);
//         }
//       } catch (error) {
//         showSnackbar('Failed to load role details', 'error');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRoleDetails();
//   }, [id, isCreateMode]);

//   const showSnackbar = (message, severity = 'success') => {
//     setSnackbar({ open: true, message, severity });
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar(prev => ({ ...prev, open: false }));
//   };

//   const handleAccordionChange = (panel) => (event, isExpanded) => {
//     setExpanded(isExpanded ? panel : false);
//   };

//   const handlePermissionChange = (permissionKey) => (event) => {
//     setPermissions(prev => ({
//       ...prev,
//       [permissionKey]: event.target.checked
//     }));
//   };
//   const handleSubmit = async () => {
//   setLoading(true);
//   try {
//     // Convert boolean permissions to API format ("1"/"0")
//     const apiPermissions = {};
//     for (const [key, value] of Object.entries(permissions)) {
//       apiPermissions[key] = value ? "1" : "0";
//     }

//     const payload = {
//       name: roleName.toLowerCase().replace(/\s+/g, '_'),
//       label: roleName,
//       permissions: apiPermissions
//     };

//     let response;
//     if (isCreateMode) {
//       response = await httpClient.post('roles', payload);
//     } else {
//       response = await httpClient.put(`roles/${id}`, payload);
//     }

//     if (response.data.success) {
//       // Update permissions in context if we're editing the current user's role
//       if (response.data.data.id === id) {
//         updatePermissions(apiPermissions);
//       }
      
//       showSnackbar(
//         isCreateMode ? 'Role created successfully' : 'Role updated successfully'
//       );
      
//       // Add 3-second delay before navigation
//       setTimeout(() => {
//         navigate('/general-settings/roles');
//       }, 3000);
//     }
//   } catch (error) {
//     showSnackbar(
//       error.response?.data?.message || 
//       (isCreateMode ? 'Failed to create role' : 'Failed to update role'),
//       'error'
//     );
//   } finally {
//     setLoading(false);
//   }
// };


// // const handleSubmit = async () => {
// //   setLoading(true);
// //   try {
// //     // Convert boolean permissions to API format ("1"/"0")
// //     const apiPermissions = {};
// //     for (const [key, value] of Object.entries(permissions)) {
// //       apiPermissions[key] = value ? "1" : "0";
// //     }

// //     const payload = {
// //       name: roleName.toLowerCase().replace(/\s+/g, '_'),
// //       label: roleName,
// //       permissions: apiPermissions
// //     };

// //     let response;
// //     if (isCreateMode) {
// //       response = await httpClient.post('roles', payload);
// //     } else {
// //       response = await httpClient.put(`roles/${id}`, payload);
// //     }

// //     if (response.data.success) {
// //       // Refresh permissions for all affected users
// //       await httpClient.post('roles/refresh-permissions', { roleId: id || response.data.data.id });
      
// //       // Update permissions in context if we're editing the current user's role
// //       if (response.data.data.id === id) {
// //         await updatePermissions(apiPermissions);
// //         await refreshPermissions(); // Refresh the current user's permissions
// //       }
      
// //       showSnackbar(
// //         isCreateMode ? 'Role created successfully' : 'Role updated successfully'
// //       );
// //       setTimeout(() => {
// //         navigate('/general-settings/roles');
// //       }, 3000);
// //     }
// //   } catch (error) {
// //     showSnackbar(
// //       error.response?.data?.message || 
// //       (isCreateMode ? 'Failed to create role' : 'Failed to update role'),
// //       'error'
// //     );
// //   } finally {
// //     setLoading(false);
// //   }
// // };

//   // const handleSubmit = async () => {
//   //   setLoading(true);
//   //   try {
//   //     // Convert boolean permissions to API format ("1"/"0")
//   //     const apiPermissions = {};
//   //     for (const [key, value] of Object.entries(permissions)) {
//   //       apiPermissions[key] = value ? "1" : "0";
//   //     }

//   //     const payload = {
//   //       name: roleName.toLowerCase().replace(/\s+/g, '_'),
//   //       label: roleName,
//   //       permissions: apiPermissions
//   //     };

//   //     let response;
//   //     if (isCreateMode) {
//   //       response = await httpClient.post('roles', payload);
//   //     } else {
//   //       response = await httpClient.put(`roles/${id}`, payload);
//   //     }

//   //     if (response.data.success) {
//   //       // Update permissions in context if we're editing the current user's role
//   //       if (response.data.data.id === id) {
//   //         updatePermissions(apiPermissions);
//   //       }
        
//   //       showSnackbar(
//   //         isCreateMode ? 'Role created successfully' : 'Role updated successfully'
//   //       );
//   //       navigate('/general-settings/roles');
//   //     }
//   //   } catch (error) {
//   //     showSnackbar(
//   //       error.response?.data?.message || 
//   //       (isCreateMode ? 'Failed to create role' : 'Failed to update role'),
//   //       'error'
//   //     );
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const handleCancel = () => {
//     navigate('/general-settings/roles');
//   };

//   // Permission groups organization - EXACTLY as specified
//   const permissionGroups = {
//     General: [
//       'manage_system_setting', 'regional_manager','can_tag_user_groups','manage_custom_fields','manage_system_fields',
//       'manage_users','manage_locations'
//     ],
//     Events: [
//       'manage_events'
//     ],
//     File_Manager: [
//       'manage_files'
//     ],
//     Key_Contacts: [
//        'manage_contacts'
//     ],
//     News: [
//        'news_delete', 'news_can_publish', 'news_manage_draft',
//        'news_export_pdf', 'news_view_reporting'
//     ],
//     Operational_Manuals: [
//       'manual_publish','manual_drafts','manual_view_reporting',
//       'manual_export_pdf', 'manual_view_reporting'
//     ],
//     social: [
//       'can_create_posts'
//     ],
//     Quick_Links: [
//       'manage_links'
//     ]
//   };

//   // Human-readable labels
//   const permissionLabels = {
//     manage_system_setting: 'Manage System Settings',
//     regional_manager: 'Regional Manager',
//     manage_locations: 'Manage Locations',
//     location_details: 'View Location Details',
//     manage_users: 'Manage Users',
//     user_details: 'View User Details',
//     does_restrict_roles: 'Restrict Role Access',
//     can_tag_user_groups: 'Tag User Groups',
//     manage_custom_fields: 'Manage Custom Fields',
//     manage_system_fields: 'Manage System Fields',
//     event_access: 'Event Access',
//     manage_events: 'Manage Events',
//     file_access: 'File Access',
//     manage_files: 'Manage Files',
//     contact_access: 'Contact Access',
//     manage_contacts: 'Manage Contacts',
//     news_access: 'News Access',
//     news_delete: 'Delete News',
//     news_can_publish: 'Publish News',
//     news_manage_draft: 'Manage News Drafts',
//     news_export_pdf: 'Export News as PDF',
//     news_view_reporting: 'View News Reporting',
//     manual_access: 'Manual Access',
//     manual_delete: 'Delete Manuals',
//     manual_publish: 'Publish Manuals',
//     manual_drafts: 'Manage Manual Drafts',
//     manual_export_pdf: 'Export Manuals as PDF',
//     manual_view_reporting: 'View Manual Reporting',
//     links_access: 'Links Access',
//     manage_links: 'Manage Links',
//     timeline_access: 'Timeline Access',
//     can_create_posts: 'Create Posts'
//   };

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" p={4}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
//       <Typography variant="h5" gutterBottom>
//         {isCreateMode ? 'CREATE NEW ROLE' : `EDIT ROLE: ${roleName}`}
//       </Typography>

//       <Grid container spacing={3}>
//         <Grid item xs={12} md={6}>
//           <TextField
//             fullWidth
//             label="Role Name *"
//             value={roleName}
//             onChange={(e) => setRoleName(e.target.value)}
//             margin="normal"
//             required
//           />
//         </Grid>
//       </Grid>

//       <Box sx={{ mt: 4 }}>
//         {Object.entries(permissionGroups).map(([group, groupPermissions]) => (
//           <Accordion
//             key={group}
//             expanded={expanded === group.toLowerCase()}
//             onChange={handleAccordionChange(group.toLowerCase())}
//           >
//             <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//               <Typography sx={{ flexGrow: 1, textTransform: 'capitalize' }}>
//                 {group.replace(/_/g, ' ')}
//               </Typography>
//             </AccordionSummary>
//             <AccordionDetails>
//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//                 {groupPermissions.map(permKey => (
//                   <FormControlLabel
//                     key={permKey}
//                     control={
//                       <Checkbox
//                         checked={permissions[permKey] || false}
//                         onChange={handlePermissionChange(permKey)}
//                         color="primary"
//                       />
//                     }
//                     label={permissionLabels[permKey] || permKey}
//                   />
//                 ))}
//               </Box>
//             </AccordionDetails>
//           </Accordion>
//         ))}
//       </Box>

//       <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
//         <Button variant="outlined" onClick={handleCancel}>
//           Cancel
//         </Button>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleSubmit}
//           disabled={loading || !roleName.trim()}
//           startIcon={loading ? <CircularProgress size={20} /> : null}
//         >
//           {isCreateMode ? 'Create Role' : 'Save Changes'}
//         </Button>
//       </Box>

//       <Snackbar
//   open={snackbar.open}
//   autoHideDuration={6000}
//   onClose={handleCloseSnackbar}
//   anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
 
//   sx={{ 
//     zIndex: 1400,
//     '& .MuiAlert-root': { width: '100%' } // Ensure alert takes full width
//   }}
// >
//   <Alert 
//     onClose={handleCloseSnackbar} 
//     severity={snackbar.severity}
//     variant = "filled"
//     sx={{ width: '100%' }}
//   >
//     {snackbar.message}
//   </Alert>
// </Snackbar>
//     </Paper>
//   );
// };

// export default RoleDetailsForm;



import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePermission } from "../../../context/PermissionsContext";
import {
  Box,
  Typography,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { httpClient } from "../../../utils/httpClientSetup";

const RoleDetailsForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updatePermissions, isAdmin } = usePermission();
  const isCreateMode = !id || id === 'create';
  const [roleName, setRoleName] = useState('');
  const [expanded, setExpanded] = useState('general');
  const [loading, setLoading] = useState(!isCreateMode);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [permissions, setPermissions] = useState({});

  // Default permissions
  const defaultPermissions = {
    manage_system_setting: false,
    regional_manager: false,
    manage_locations: false,
    location_details: 0, // 0 = Across All, 1 = Users Locations, 2 = Users Managed Regions
    manage_users: false,
    user_details: 0, // same mapping
    does_restrict_roles: false,
    can_tag_user_groups: false,
    manage_custom_fields: false,
    manage_system_fields: false,
    event_access: false,
    manage_events: false,
    file_access: false,
    manage_files: false,
    contact_access: false,
    manage_contacts: false,
    news_access: false,
    news_delete: false,
    news_can_publish: false,
    news_manage_draft: false,
    news_export_pdf: false,
    news_view_reporting: false,
    manual_access: false,
    manual_delete: false,
    manual_publish: false,
    manual_drafts: false,
    manual_export_pdf: false,
    manual_view_reporting: false,
    links_access: false,
    manage_links: false,
    timeline_access: false,
    can_create_posts: false
  };

  useEffect(() => { if (!isAdmin()) navigate('/unauthorized'); }, [isAdmin, navigate]);

  useEffect(() => {
    if (isCreateMode) {
      setPermissions(defaultPermissions);
      setLoading(false);
      return;
    }

    const fetchRoleDetails = async () => {
      try {
        const response = await httpClient.get(`roles/${id}`);
        if (response.data.success) {
          const roleData = response.data.data;
          setRoleName(roleData.label || roleData.name);
          const formattedPermissions = { ...defaultPermissions };
          for (const [key, value] of Object.entries(roleData.permissions)) {
            if (key in formattedPermissions) {
              if (key === "location_details" || key === "user_details") {
                formattedPermissions[key] = parseInt(value, 10);
              } else {
                formattedPermissions[key] = value === "1";
              }
            }
          }
          setPermissions(formattedPermissions);
        }
      } catch (error) {
        showSnackbar('Failed to load role details', 'error');
      } finally { setLoading(false); }
    };
    fetchRoleDetails();
  }, [id, isCreateMode]);

  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });
  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));
  const handleAccordionChange = (panel) => (event, isExpanded) => setExpanded(isExpanded ? panel : false);

  const handleParentCheckbox = (key) => (event) => {
    const checked = event.target.checked;
    setPermissions(prev => {
      const updated = { ...prev, [key]: checked };
      if (!checked) {
        if (key === "manage_locations") updated.location_details = 0;
        if (key === "manage_users") updated.user_details = 0;
      }
      return updated;
    });
  };

  const handleNestedSelection = (key, value) => () => {
    setPermissions(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const apiPermissions = {};
      for (const [key, value] of Object.entries(permissions)) {
        if (key === "location_details" || key === "user_details") {
          apiPermissions[key] = value.toString();
        } else {
          apiPermissions[key] = value ? "1" : "0";
        }
      }
      const payload = { name: roleName.toLowerCase().replace(/\s+/g, '_'), label: roleName, permissions: apiPermissions };
      let response = isCreateMode ? await httpClient.post('roles', payload) : await httpClient.put(`roles/${id}`, payload);
      if (response.data.success) {
        if (response.data.data.id === id) updatePermissions(apiPermissions);
        showSnackbar(isCreateMode ? 'Role created successfully' : 'Role updated successfully');
        setTimeout(() => navigate('/general-settings/roles'), 3000);
      }
    } catch (error) {
      showSnackbar(error.response?.data?.message || (isCreateMode ? 'Failed to create role' : 'Failed to update role'), 'error');
    } finally { setLoading(false); }
  };

  const handleCancel = () => navigate('/general-settings/roles');

  const permissionGroups = {
    General: ['manage_system_setting', 'regional_manager','can_tag_user_groups','manage_custom_fields','manage_system_fields','manage_users','manage_locations'],
    Events: ['manage_events'],
    File_Manager: ['manage_files'],
    Key_Contacts: ['manage_contacts'],
    News: ['news_delete', 'news_can_publish', 'news_manage_draft','news_export_pdf', 'news_view_reporting'],
    Operational_Manuals: ['manual_publish','manual_drafts','manual_view_reporting','manual_export_pdf'],
    social: ['can_create_posts'],
    Quick_Links: ['manage_links']
  };

  const permissionLabels = {
    manage_system_setting: 'Manage System Settings',
    regional_manager: 'Regional Manager',
    manage_locations: 'Manage Locations',
    manage_users: 'Manage Users',
    can_tag_user_groups: 'Tag User Groups',
    manage_custom_fields: 'Manage Custom Fields',
    manage_system_fields: 'Manage System Fields',
    manage_events: 'Manage Events',
    manage_files: 'Manage Files',
    manage_contacts: 'Manage Contacts',
    news_delete: 'Delete News',
    news_can_publish: 'Publish News',
    news_manage_draft: 'Manage News Drafts',
    news_export_pdf: 'Export News as PDF',
    news_view_reporting: 'View News Reporting',
    manual_publish: 'Publish Manuals',
    manual_drafts: 'Manage Manual Drafts',
    manual_view_reporting: 'View Manual Reporting',
    manage_links: 'Manage Links',
    can_create_posts: 'Create Posts'
  };

  if (loading) return (<Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>);

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>{isCreateMode ? 'CREATE NEW ROLE' : `EDIT ROLE: ${roleName}`}</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Role Name " value={roleName} onChange={(e) => setRoleName(e.target.value)} margin="normal" required />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        {Object.entries(permissionGroups).map(([group, groupPermissions]) => (
          <Accordion key={group} expanded={expanded === group.toLowerCase()} onChange={handleAccordionChange(group.toLowerCase())}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ flexGrow: 1, textTransform: 'capitalize' }}>{group.replace(/_/g, ' ')}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {groupPermissions.map(permKey => (
                  <React.Fragment key={permKey}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={permissions[permKey] || false}
                          onChange={permKey === "manage_locations" ? handleParentCheckbox("manage_locations") :
                                    permKey === "manage_users" ? handleParentCheckbox("manage_users") :
                                    (e) => setPermissions(prev => ({ ...prev, [permKey]: e.target.checked }))}
                        />
                      }
                      label={permissionLabels[permKey] || permKey}
                    />

                    {/* Nested Location Details */}
                    {permKey === "manage_locations" && permissions.manage_locations && (
                      <RadioGroup value={permissions.location_details} sx={{ ml: 4 }} onChange={(e) => setPermissions(prev => ({ ...prev, location_details: parseInt(e.target.value) }))}>
                        <FormControlLabel value={0} control={<Radio />} label="Across All Locations" />
                        <FormControlLabel value={1} control={<Radio />} label="Users Location(s)" />
                        <FormControlLabel value={2} control={<Radio />} label="Users Managed Regions" />
                      </RadioGroup>
                    )}

                    {/* Nested User Details */}
                    {permKey === "manage_users" && permissions.manage_users && (
                      <RadioGroup value={permissions.user_details} sx={{ ml: 4 }} onChange={(e) => setPermissions(prev => ({ ...prev, user_details: parseInt(e.target.value) }))}>
                        <FormControlLabel value={0} control={<Radio />} label="Across All Users" />
                        <FormControlLabel value={1} control={<Radio />} label="Users Location(s)" />
                        <FormControlLabel value={2} control={<Radio />} label="Users Managed Regions" />
                      </RadioGroup>
                    )}

                  </React.Fragment>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
        <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading || !roleName.trim()} startIcon={loading ? <CircularProgress size={20} /> : null}>
          {isCreateMode ? 'Create Role' : 'Save Changes'}
        </Button>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} sx={{ zIndex: 1400, '& .MuiAlert-root': { width: '100%' } }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Paper>
  );
};

export default RoleDetailsForm;
