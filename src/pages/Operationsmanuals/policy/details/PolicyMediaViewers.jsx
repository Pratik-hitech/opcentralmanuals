import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

import MediaFolderViewer from "../../../FileManager/FileManager";

const PolicyMediaViewers = ({
  showMediaViewer,
  handleMediaViewerClose,
  showPdfMediaViewer,
  handlePdfMediaViewerClose,
  showImageMediaViewer,
  handleImageMediaViewerClose,
}) => {
  return (
    <>
      <Dialog
        fullScreen
        open={showMediaViewer}
        onClose={() => handleMediaViewerClose([])}
        maxWidth={false}
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Select Files
          <IconButton
            aria-label="close"
            onClick={() => handleMediaViewerClose([])}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0, height: "100%" }}>
          <MediaFolderViewer
            selectionMode={true}
            onSelectionConfirm={(selectedFiles) =>
              handleMediaViewerClose(selectedFiles)
            }
            onCloseRequest={() => handleMediaViewerClose([])}
            fileTypeFilter={null}
          />
        </DialogContent>
      </Dialog>
      <Dialog
        fullScreen
        open={showPdfMediaViewer}
        onClose={() => handlePdfMediaViewerClose([])}
        maxWidth={false}
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Select PDF File
          <IconButton
            aria-label="close"
            onClick={() => handlePdfMediaViewerClose([])}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0, height: "100%" }}>
          <MediaFolderViewer
            selectionMode={true}
            onSelectionConfirm={(selectedFiles) =>
              handlePdfMediaViewerClose(selectedFiles)
            }
            onCloseRequest={() => handlePdfMediaViewerClose([])}
            fileTypeFilter="pdf"
          />
        </DialogContent>
      </Dialog>
      <Dialog
        fullScreen
        open={showImageMediaViewer}
        onClose={() => handleImageMediaViewerClose([])}
        maxWidth={false}
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Select Image
          <IconButton
            aria-label="close"
            onClick={() => handleImageMediaViewerClose([])}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0, height: "100%" }}>
          <MediaFolderViewer
            selectionMode={true}
            onSelectionConfirm={(selectedFiles) =>
              handleImageMediaViewerClose(selectedFiles)
            }
            onCloseRequest={() => handleImageMediaViewerClose([])}
            fileTypeFilter="image"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PolicyMediaViewers;
