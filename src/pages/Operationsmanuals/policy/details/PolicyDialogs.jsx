import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  TextField,
  Autocomplete,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

import PolicyPreview from "../PolicyPreview";

const PolicyDialogs = ({
  showPolicyDialog,
  loadingPolicies,
  policies,
  selectedPolicyId,
  handlePolicyDialogClose,
  handlePolicySelectChange,
  handleAddPolicyLink,
  policyLinkToEditIndex,
  updateDialogOpen,
  handleUpdateCancel,
  handleUpdateConfirm,
  updateToVersion,
  setUpdateToVersion,
  versionNotes,
  setVersionNotes,
  nextVersion,
  currentVersion,
  showVideoPreview,
  setShowVideoPreview,
  previewVideo,
  getYouTubeVideoId,
  getVimeoVideoId,
  showPreview,
  setShowPreview,
  formData,
  tags,
  videos,
  selectedLinks,
}) => {
  return (
    <>
      <Dialog
        open={showPolicyDialog}
        onClose={handlePolicyDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            minHeight: "350px",
          },
        }}
      >
        <DialogTitle>
          {policyLinkToEditIndex !== null
            ? "Edit Linked Policy"
            : "Select Policy"}
        </DialogTitle>
        <DialogContent>
          {loadingPolicies ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Autocomplete
              disablePortal
              id="policy-autocomplete"
              options={policies}
              getOptionLabel={(option) => option.title || ""}
              value={policies.find((p) => p.id === selectedPolicyId) || null}
              onChange={handlePolicySelectChange}
              renderInput={(params) => <TextField {...params} label="Policy" />}
              fullWidth
              sx={{ mt: 1 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePolicyDialogClose}>Cancel</Button>
          <Button
            onClick={handleAddPolicyLink}
            disabled={!selectedPolicyId || loadingPolicies}
            variant="contained"
          >
            {policyLinkToEditIndex !== null ? "Update Link" : "Add Link"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={updateDialogOpen}
        onClose={handleUpdateCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Policy</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
              Current Version: {currentVersion}
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={updateToVersion}
                  onChange={(e) => setUpdateToVersion(e.target.checked)}
                />
              }
              label={`Update policy to version ${nextVersion}`}
            />
            {updateToVersion && (
              <TextField
                label="Version Notes"
                multiline
                rows={3}
                value={versionNotes}
                onChange={(e) => setVersionNotes(e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
                inputProps={{ maxLength: 200 }}
                helperText={`${versionNotes.length}/200 characters`}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateCancel}>Cancel</Button>
          <Button onClick={handleUpdateConfirm} variant="contained">
            {updateToVersion ? "Confirm" : "Continue"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showVideoPreview}
        onClose={() => setShowVideoPreview(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <IconButton
            aria-label="close"
            onClick={() => setShowVideoPreview(false)}
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
        <DialogContent>
          {previewVideo && (
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {previewVideo.title}
              </Typography>
              {previewVideo.type === "upload" ? (
                previewVideo.file ? (
                  <video
                    src={URL.createObjectURL(previewVideo.file)}
                    controls
                    style={{
                      width: "100%",
                      height: "460px",
                    }}
                  />
                ) : previewVideo.reference_url ? (
                  <video
                    src={previewVideo.reference_url}
                    controls
                    style={{ width: "100%", maxHeight: "480px" }}
                  />
                ) : (
                  <Typography>No video file available</Typography>
                )
              ) : previewVideo.type === "youtube" ? (
                previewVideo.reference_url ? (
                  (() => {
                    const videoId = getYouTubeVideoId(
                      previewVideo.reference_url
                    );

                    return videoId ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={previewVideo.title}
                        allowFullScreen
                        style={{
                          width: "100%",
                          height: "400px",
                          border: "none",
                        }}
                      />
                    ) : (
                      <Typography>Invalid YouTube URL</Typography>
                    );
                  })()
                ) : (
                  <Typography>No YouTube URL provided</Typography>
                )
              ) : previewVideo.type === "vimeo" ? (
                previewVideo.reference_url ? (
                  (() => {
                    const videoId = getVimeoVideoId(previewVideo.reference_url);
                    return videoId ? (
                      <iframe
                        src={`https://player.vimeo.com/video/${videoId}`}
                        title={previewVideo.title}
                        allowFullScreen
                        style={{
                          width: "100%",
                          height: "400px",
                          border: "none",
                        }}
                      />
                    ) : (
                      <Typography>Invalid Vimeo URL</Typography>
                    );
                  })()
                ) : (
                  <Typography>No Vimeo URL provided</Typography>
                )
              ) : (
                <Typography>Unsupported video type</Typography>
              )}
              {previewVideo.description && (
                <Typography variant="body2" sx={{ mt: 2, textAlign: "left" }}>
                  {previewVideo.description}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowVideoPreview(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showPreview}
        onClose={() => setShowPreview(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Preview</DialogTitle>
        <DialogContent>
          <PolicyPreview
            title={formData.title}
            content={formData.content}
            tags={tags}
            videos={videos}
            links={selectedLinks}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreview(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PolicyDialogs;
