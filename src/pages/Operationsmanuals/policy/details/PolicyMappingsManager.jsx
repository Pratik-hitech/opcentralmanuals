import React from "react";
import {
  Box,
  FormLabel,
  Tooltip,
  IconButton,
  Typography,
  Grid,
  Autocomplete,
  TextField,
  ListItem,
  ListItemText,
  Collapse,
  Breadcrumbs,
  ListItemIcon,
  Button,
  List,
} from "@mui/material";
import {
  InfoOutlined as InfoIcon,
  ExpandMore,
  ExpandLess,
  Add as AddIcon,
  Close as CloseIcon,
  Article,
} from "@mui/icons-material";

import { FormGrid } from "../PolicyFormStyledComponents";

const MappingItem = ({
  item,
  depth = 0,
  expandedItems,
  mappedMappings,
  toggleExpand,
  addMapping,
  isMapped,
  selectedCollection,
}) => {
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedItems[item.id];
  // Check if the item is a policy (similar to how it's done in ManualsContent.jsx)
  const isPolicy = item.table !== null;

  return (
    <React.Fragment key={item.id}>
      <Box sx={{ ml: depth * 3, mb: 0.5 }}>
        <ListItem
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: 1,
            backgroundColor: depth === 0 ? "#eeeeee" : "#fafafa",
          }}
        >
          {isPolicy && (
            <ListItemIcon sx={{ minWidth: 25 }}>
              <Article sx={{ fontSize: 16 }} />
            </ListItemIcon>
          )}
          <ListItemText
            primary={item.title}
            primaryTypographyProps={{
              fontWeight: depth === 0 ? "bold" : "normal",
            }}
          />
          {hasChildren && (
            <IconButton size="small" onClick={() => toggleExpand(item.id)}>
              {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          )}
          {!isMapped(item.id) && !isPolicy && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => addMapping(item)}
              sx={{ ml: 2 }}
            >
              Add
            </Button>
          )}
        </ListItem>
      </Box>
      {hasChildren && (
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children.map((child) => (
              <MappingItem
                key={child.id}
                item={child}
                depth={depth + 1}
                expandedItems={expandedItems}
                mappedMappings={mappedMappings}
                toggleExpand={toggleExpand}
                addMapping={addMapping}
                isMapped={isMapped}
                selectedCollection={selectedCollection}
              />
            ))}
          </List>
        </Collapse>
      )}
    </React.Fragment>
  );
};

const PolicyMappingsManager = ({
  collections,
  selectedCollection,
  navigationTree,
  mappedMappings,
  expandedItems,
  setSelectedCollection,
  fetchNavigations,
  removeMapping,
  toggleExpand,
  addMapping,
  isMapped,
}) => {
  return (
    <FormGrid size={{ xs: 12 }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <FormLabel sx={{ color: "#4a5568", fontWeight: 500, mb: 1 }}>
          Mappings
        </FormLabel>
        <Tooltip
          title="Select all of the manuals and sections where you want this policy to be displayed."
          placement="top-start"
        >
          <IconButton size="small" sx={{ ml: 1, mb: 1 }}>
            <InfoIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      </Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Add to Manual/Section
          </Typography>
          <Autocomplete
            options={collections}
            getOptionLabel={(option) => option.title}
            value={selectedCollection}
            onChange={(event, newValue) => {
              setSelectedCollection(newValue);
              if (newValue) {
                fetchNavigations(newValue.id);
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="Select Manual" variant="outlined" />
            )}
            sx={{ width: "100%", mb: 2 }}
          />
          {navigationTree.length > 0 && (
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Select sections in {selectedCollection?.title}
              </Typography>
              <List sx={{ width: "100%" }}>
                {navigationTree.map((item) => (
                  <MappingItem
                    key={item.id}
                    item={item}
                    depth={0}
                    expandedItems={expandedItems}
                    mappedMappings={mappedMappings}
                    toggleExpand={toggleExpand}
                    addMapping={addMapping}
                    isMapped={isMapped}
                    selectedCollection={selectedCollection}
                  />
                ))}
              </List>
            </Box>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Mapped Manual/Sections
          </Typography>
          {mappedMappings.length > 0 ? (
            mappedMappings.map((mapping) => (
              <Box
                key={mapping.navId}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  my: 0.5,
                }}
              >
                <Breadcrumbs separator=" > " aria-label="breadcrumb">
                  {mapping.fullPath.map((title, index) => (
                    <Typography key={index} color="text.primary">
                      {title}
                    </Typography>
                  ))}
                </Breadcrumbs>
                <IconButton
                  size="small"
                  onClick={() => removeMapping(mapping.navId)}
                  sx={{ ml: 1 }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ))
          ) : (
            <Typography sx={{ color: "gray" }}>None mapped yet</Typography>
          )}
        </Grid>
      </Grid>
    </FormGrid>
  );
};

export default PolicyMappingsManager;
