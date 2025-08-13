import React, { useState } from 'react';
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
  Divider,
  Grid,
  Paper
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const RoleDetailsForm = () => {
  const [roleName, setRoleName] = useState('Dashboard');
  const [expanded, setExpanded] = useState('general');

  const [permissions, setPermissions] = useState({
    general: {
      manageSystemSettings: false,
      regionalManager: true,
      manageLocationsDetails: false,
      manageUsers: false,
      canDeleteUsersLocations: false,
      canTagUserGroups: false,
      manageCustomFields: false,
      manageSystemFields: false,
      usersManagedRegions: false,
      restrictRules: true
    },
    events: {
      hasAccess: true,
      manageEvents: false
    },
    fileManager: {
      hasAccess: true,
      manageContent: false
    },
    keyContacts: {
      hasAccess: true,
      manageContacts: false
    },
    news: {
      hasAccess: true,
      delete: false,
      canPublish: false,
      canManageDrafts: false,
      exportPDF: false,
      viewReporting: false
    },
    operationsManuals: {
      hasAccess: true,
      exportPDF: false,
      canPublish: false,
      canManageDrafts: false,
      viewReporting: false
    },
    quickLinks: {
      hasAccess: true,
      manageLinks: false
    },
    socialTimeline: {
      hasAccess: true,
      canCreatePosts: false
    }
  });

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handlePermissionChange = (section, key) => (event) => {
    setPermissions({
      ...permissions,
      [section]: {
        ...permissions[section],
        [key]: event.target.checked
      }
    });
  };

  const moduleExtraPermissions = {
    events: ['manageEvents'],
    fileManager: ['manageContent'],
    keyContacts: ['manageContacts'],
    news: ['delete', 'canPublish', 'canManageDrafts', 'exportPDF', 'viewReporting'],
    operationsManuals: ['exportPDF', 'canPublish', 'canManageDrafts', 'viewReporting'],
    quickLinks: ['manageLinks'],
    socialTimeline: ['canCreatePosts']
  };

  const labels = {
    manageSystemSettings: 'Manage System Settings',
    regionalManager: 'Regional Manager',
    manageLocationsDetails: 'Manage Locations & Details',
    manageUsers: 'Manage Users',
    canDeleteUsersLocations: 'Can Delete Users/Locations',
    canTagUserGroups: 'Can Tag User Groups',
    manageCustomFields: 'Manage Custom Fields',
    manageSystemFields: 'Manage System Fields',
    usersManagedRegions: 'Users Managed Region(s)',
    restrictRules: 'Restrict Rules',
    manageEvents: 'Manage Events',
    manageContent: 'Manage Content',
    manageContacts: 'Manage Contacts',
    delete: 'Delete',
    canPublish: 'Can Publish',
    canManageDrafts: 'Can Manage Drafts',
    exportPDF: "Export PDF's",
    viewReporting: 'View Reporting',
    manageLinks: 'Manage Links',
    canCreatePosts: 'Can Create Posts'
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        ROLE DETAILS
      </Typography>

      <Grid container spacing={3} sx={{ maxWidth: '70%' }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Role Name *"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            margin="normal"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        {/* GENERAL Accordion */}
        <Accordion
          expanded={expanded === 'general'}
          onChange={handleAccordionChange('general')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ flexGrow: 1 }}>GENERAL</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {Object.keys(permissions.general).map((permKey) => (
                <FormControlLabel
                  key={permKey}
                  control={
                    <Checkbox
                      checked={permissions.general[permKey]}
                      onChange={handlePermissionChange('general', permKey)}
                    />
                  }
                  label={labels[permKey]}
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* MODULES with hasAccess */}
        {Object.keys(moduleExtraPermissions).map((module) =>
          permissions[module]?.hasAccess !== undefined ? (
            <Accordion
              key={module}
              expanded={expanded === module}
              onChange={handleAccordionChange(module)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ flexGrow: 1 }}>
                  {module.split(/(?=[A-Z])/).join(' ').toUpperCase()}
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={permissions[module].hasAccess}
                      onChange={handlePermissionChange(module, 'hasAccess')}
                    />
                  }
                  label="Has Access"
                  sx={{ m: 0 }}
                />
              </AccordionSummary>
              {permissions[module].hasAccess && (
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {moduleExtraPermissions[module].map((permKey) => (
                      <FormControlLabel
                        key={permKey}
                        control={
                          <Checkbox
                            checked={permissions[module][permKey]}
                            onChange={handlePermissionChange(module, permKey)}
                          />
                        }
                        label={labels[permKey]}
                      />
                    ))}
                  </Box>
                </AccordionDetails>
              )}
            </Accordion>
          ) : null
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button variant="outlined" sx={{ mr: 2 }}>
          Cancel
        </Button>
        <Button variant="contained" color="primary">
          Submit
        </Button>
      </Box>
    </Paper>
  );
};

export default RoleDetailsForm;
