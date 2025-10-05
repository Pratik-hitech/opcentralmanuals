import { Box, styled, Paper, Grid, TableRow, TableCell } from "@mui/material";

export const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

export const TagsContainer = styled(Box)(({ theme }) => ({
  border: "1px solid #d1d5db",
  borderRadius: 8,
  padding: "12px",
  minHeight: "48px",
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  alignItems: "center",
  "&:focus-within": {
    borderColor: "#667eea",
    boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
  },
}));

export const TagInput = styled("input")(({ theme }) => ({
  border: "none",
  outline: "none",
  backgroundColor: "transparent",
  fontSize: "14px",
  minWidth: "120px",
  flex: 1,
  "&::placeholder": {
    color: "#9ca3af",
  },
}));

export const LinkTableContainer = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(2),
  overflowX: "auto",
}));

export const LinkTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export const LinkTypeCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 500,
  width: "15%",
}));

export const LinkNameCell = styled(TableCell)(({ theme }) => ({
  width: "60%",
}));

export const LinkActionsCell = styled(TableCell)(({ theme }) => ({
  width: "25%",
  textAlign: "right",
}));

export const FormFieldContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
}));
