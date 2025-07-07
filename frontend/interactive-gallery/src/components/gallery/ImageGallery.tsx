import React, { useState, useCallback, useEffect } from "react";
import type { Image } from "../../types";
import ImageCard from "./ImageCard";
import LoadingSpinner from "../common/LoadingSpinner";
import { Plus, Loader2 } from "lucide-react";
import ErrorMessage from "../common/ErrorMessage";
import ApiService from "../../services/ApiService";

const ImageGallery: React.FC<{
  onImageClick: (image: Image) => void;
  searchQuery?: string;
}> = ({ onImageClick, searchQuery }) => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  // Track the current session's query state
  const [currentQuery, setCurrentQuery] = useState<string | undefined>(
    undefined
  );

  const apiService = new ApiService();

  const loadImages = useCallback(
    async (pageNum: number, query?: string, append: boolean = false) => {
      try {
        if (pageNum === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        const response = await apiService.getImages(pageNum, 12, query);

        if (append) {
          setImages((prev) => [...prev, ...response.images]);
        } else {
          setImages(response.images);
        }

        setTotalPages(10);
        setError(null);
      } catch (error) {
        console.error(error);
        setError("Failed to load images");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    setPage(1);
    setCurrentQuery(searchQuery); // Store the current query state
    loadImages(1, searchQuery);
  }, [searchQuery, loadImages]);

  const handleLoadMore = () => {
    if (page < totalPages && !loadingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadImages(nextPage, currentQuery, true);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images?.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            onClick={() => onImageClick(image)}
          />
        ))}
      </div>

      {page < totalPages && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2">
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Load More</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
