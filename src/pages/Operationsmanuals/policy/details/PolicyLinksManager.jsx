import {
  Box,
  FormLabel,
  Tooltip,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  InfoOutlined as InfoIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import {
  FormFieldContainer,
  LinkTableContainer,
  LinkTableRow,
  LinkTypeCell,
  LinkNameCell,
  LinkActionsCell,
} from "../PolicyFormStyledComponents";

const PolicyLinksManager = ({
  openDropdown,
  anchorEl,
  handleClickCreateLinks,
  handleCloseDropdown,
  handleSelectFileLink,
  handleSelectPolicyLink,
  selectedLinks,
  handleEditPolicyLink,
  handleRemoveLink,
}) => {
  return (
    <>
      <FormFieldContainer>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <FormLabel sx={{ color: "#4a5568", fontWeight: 500, mr: 1 }}>
            Links
          </FormLabel>
          <Tooltip
            title="Link additional resources to this policy"
            placement="top-start"
            arrow
          >
            <InfoIcon
              sx={{
                color: "action.active",
                fontSize: 18,
                cursor: "pointer",
              }}
            />
          </Tooltip>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
          <Button
            aria-controls={openDropdown ? "create-links-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openDropdown ? "true" : undefined}
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleClickCreateLinks}
            sx={{ borderRadius: 2, mr: 1 }}
          >
            Create Links
          </Button>
          <Menu
            id="create-links-menu"
            anchorEl={anchorEl}
            open={openDropdown}
            onClose={handleCloseDropdown}
            MenuListProps={{ "aria-labelledby": "create-links-button" }}
          >
            <MenuItem onClick={handleSelectFileLink}>File</MenuItem>
            <MenuItem onClick={handleSelectPolicyLink}>Policy</MenuItem>
          </Menu>
        </Box>
      </FormFieldContainer>
      {selectedLinks.length > 0 && (
        <LinkTableContainer>
          <TableContainer>
            <Table size="small" aria-label="selected links table">
              <TableHead>
                <TableRow>
                  <TableCell>Link Type</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedLinks.map((link, index) => (
                  <LinkTableRow key={`${link.type}-${link.data?.id || index}`}>
                    <LinkTypeCell component="th" scope="row">
                      {link.type === "file" ? "File" : "Policy"}
                    </LinkTypeCell>
                    <LinkNameCell>
                      {link.data?.name || link.data?.title || "Unnamed"}
                    </LinkNameCell>
                    <LinkActionsCell>
                      {link.type === "policy" && (
                        <IconButton
                          aria-label="edit"
                          size="small"
                          onClick={() => handleEditPolicyLink(index)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton
                        aria-label="remove"
                        size="small"
                        onClick={() => handleRemoveLink(index)}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </LinkActionsCell>
                  </LinkTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </LinkTableContainer>
      )}
    </>
  );
};

export default PolicyLinksManager;
