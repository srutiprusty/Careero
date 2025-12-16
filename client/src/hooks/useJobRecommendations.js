import { useState } from "react";
import axios from "axios";
import { RECOMMENDATION_API_END_POINT } from "@/utils/constant";

export const useJobRecommendations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  const getRecommendations = async (userId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${RECOMMENDATION_API_END_POINT}/recommendations/job-recommendations/${userId}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setRecommendations(response.data.recommendations);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, recommendations, getRecommendations };
};
