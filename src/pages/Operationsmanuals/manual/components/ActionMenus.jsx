import React from "react";
import { Menu, MenuItem } from "@mui/material";

export const AddMenu = ({ anchorEl, onClose, onAddSubSection, onAddPolicy }) => (
  <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
    <MenuItem onClick={onAddSubSection}>Add Sub Section</MenuItem>
    <MenuItem onClick={onAddPolicy}>Add Policy</MenuItem>
  </Menu>
);

export const MoreMenu = ({ anchorEl, onClose, onEdit, onDelete }) => (
  <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
    <MenuItem onClick={onEdit}>Edit</MenuItem>
    <MenuItem onClick={onDelete}>Delete</MenuItem>
  </Menu>
);

export const CreateMenu = ({ anchorEl, onClose, onSectionClick, onPolicyClick }) => (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
    >
      <MenuItem onClick={onSectionClick}>Section</MenuItem>
      <MenuItem onClick={onPolicyClick}>Policy</MenuItem>
    </Menu>
);
