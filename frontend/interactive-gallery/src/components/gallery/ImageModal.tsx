import React, {useState, useEffect} from "react";
import type { Image,Comment } from "../../types";
import { User, Heart, X } from "lucide-react";
import CommentForm from "../comments/CommentForm";
import LoadingSpinner from "../common/LoadingSpinner";
import ApiService from "../../services/ApiService";
import {toast} from 'sonner'

const ImageModal: React.FC<{ 
    image: Image;
    onClose: () => void;
  }> = ({ image, onClose }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loadingComments, setLoadingComments] = useState(true);
    const [addingComment, setAddingComment] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(image.likes_count);
    const [imageLoaded, setImageLoaded] = useState(false);
  
    const apiService = new ApiService();
  
    useEffect(() => {
      const loadComments = async () => {
        try {
        const commentsData = await apiService.getComments(image.id);
        setComments(commentsData);
        } catch (error) {
          console.error('Failed to load comments:', error);
        } finally {
          setLoadingComments(false);
        }
      };
  
      loadComments();
    }, [image.id]);

    useEffect(() => {
      const loadLikesCount = async () => {
        try {
          const likesCountData = await apiService.getLikesCount(image.id);
          setLikesCount(likesCountData.likes_count);
        } catch (error) {
          console.error("Failed to load comments:", error);
        } finally {
          
        }
      };

      loadLikesCount();
    }, [image.id]);

    const handleAddComment = async (content: string, authorName: string, authorEmail: string) => {
      setAddingComment(true);
      try {
        const newComment = await apiService.addComment(image.id, content, authorName, authorEmail);
        setComments(prev => [newComment, ...prev]);
        toast.info("comment added!")
      } catch (error) {
        console.error('Failed to add comment:', error);
      } finally {
        setAddingComment(false);
      }
    };
  
    const handleLike = async () => {
      try {
        if (!liked) {
           await apiService.likeImage(image.id);
          // setLikesCount(response.likes_count);
          setLiked(true);
        }
      } catch (error) {
        console.error('Failed to like image:', error);
      }
    };
  
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
  
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
        onClick={onClose}
        onKeyDown={handleKeyDown}
        tabIndex={0}>
        <div
          className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col lg:flex-row"
          onClick={(e) => e.stopPropagation()}>
          {/* Image Section */}
          <div className="flex-1 bg-gray-100 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all">
              <X className="w-5 h-5" />
            </button>

            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <LoadingSpinner />
              </div>
            )}

            <img
              src={image.url_full}
              alt={image.title}
              className={`w-full h-full object-contain transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>

          {/* Content Section */}
          <div className="w-full lg:w-96 flex flex-col max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {image.title}
              </h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {image.author}
                  </span>
                </div>
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
                    liked
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}>
                  <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
                  <span className="text-sm font-medium">{likesCount}</span>
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="p-6 border-b">
              <p className="text-gray-700 text-sm leading-relaxed">
                {image.description}
              </p>
              {image.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {image.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="flex-1 flex flex-col">
              <div className="p-6 border-b">
                <h3 className="font-semibold text-gray-900 mb-4">Comments</h3>
                <CommentForm
                  onSubmit={handleAddComment}
                  loading={addingComment}
                />
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {loadingComments ? (
                  <LoadingSpinner size="sm" />
                ) : comments.length === 0 ? (
                  <p className="text-gray-500 text-center">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {comments?.map((comment) => (
                      <div
                        key={comment.id}
                        className="border-b border-gray-100 pb-4 last:border-b-0">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium text-gray-900">
                                {comment.author_name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(
                                  comment.created_at
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    };
  

    export default ImageModal