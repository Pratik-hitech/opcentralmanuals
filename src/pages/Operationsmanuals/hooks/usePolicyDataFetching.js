import { useState, useEffect, useCallback } from "react";
import { httpClient } from "../../../utils/httpClientSetup";
import { useNotification } from "../../../hooks/useNotification";
import { transformPolicyData } from "../utils/policyUtils";

export const usePolicyDataFetching = (
  policyId,
  id,
  navigationId,
  setMappedMappings,
  setCurrentVersion,
  setNextVersion,
  formSetters
) => {
  const {
    setFormData,
    setTags,
    setIsVideoEnabled,
    setVideos,
    setSelectedLinks,
    setEmbeddedPdf,
  } = formSetters;

  const [collections, setCollections] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [loadingPolicies, setLoadingPolicies] = useState(false);
  const [loading, setLoading] = useState(false);
  const showNotification = useNotification();

  // Fetch collections
  useEffect(() => {
    httpClient
      .get("/collections")
      .then((res) => {
        if (res.data.success) setCollections(res.data.data);
      })
      .catch((err) => console.error("Error fetching collections:", err));
  }, []);

  // Fetch policy details (edit mode)
  useEffect(() => {
    if (!policyId) return;

    setLoading(true);
    httpClient
      .get(`/policies/${policyId}`)
      .then(async (res) => {
        if (res.data.success) {
          const transformed = await transformPolicyData(res.data.data);
          setFormData(transformed.formData);
          setTags(transformed.tags);

          if (transformed.videos.length > 0) {
            setIsVideoEnabled(true);
          }

          setVideos(transformed.videos);
          setSelectedLinks(transformed.selectedLinks);
          setEmbeddedPdf(transformed.embeddedPdf);
          setMappedMappings(transformed.mappedMappings);
          setCurrentVersion(transformed.currentVersion);
          setNextVersion(transformed.nextVersion);
        }
      })
      .catch((err) => {
        console.error("Error fetching policy:", err);
        // showNotification("error", "Failed to load policy");
      })
      .finally(() => setLoading(false));
  }, [policyId]);

  const fetchPolicies = useCallback(async () => {
    if (policies.length > 0) return;
    setLoadingPolicies(true);
    try {
      const res = await httpClient.get("/policies");
      if (res.data.success) {
        setPolicies(res.data.data || []);
      } else {
        showNotification(
          "error",
          res.data.message || "Failed to fetch policies"
        );
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch policies";
      showNotification("error", msg);
    } finally {
      setLoadingPolicies(false);
    }
  }, [policies.length]);

  return {
    collections,
    policies,
    loadingPolicies,
    loading,
    fetchPolicies,
  };
};
