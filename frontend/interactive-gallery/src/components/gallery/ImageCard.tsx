import React, { useState } from "react";
import type { Image } from "../../types";
import { Camera, Eye, Heart, MessageCircle } from "lucide-react";
import LoadingSpinner from "../common/LoadingSpinner";

const ImageCard: React.FC<{
  image: Image;
  onClick: () => void;
}> = ({ image, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
      onClick={onClick}>
      <div className="aspect-w-16 aspect-h-12 bg-gray-100 relative overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner size="sm" />
          </div>
        )}
        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Camera className="w-8 h-8 text-gray-400" />
          </div>
        ) : (
          <img
            src={image.url_thumb}
            loading="lazy"
            alt={image.title}
            className={`w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Eye className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 truncate">
          {image.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2">by {image.author}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Heart className="w-4 h-4" />
            <span>{image.likes_count}</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <MessageCircle className="w-4 h-4" />
            <span>View</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
