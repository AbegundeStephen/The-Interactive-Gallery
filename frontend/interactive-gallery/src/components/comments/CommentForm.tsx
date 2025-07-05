import React, { useState } from "react";
import { MessageCircle, Loader2 } from "lucide-react";


const CommentForm: React.FC<{ 
    onSubmit: (content: string, authorName: string, authorEmail: string) => void;
    loading: boolean;
  }> = ({ onSubmit, loading }) => {
    const [content, setContent] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [authorEmail, setAuthorEmail] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
    const validate = () => {
      const newErrors: { [key: string]: string } = {};
      
      if (!content.trim()) {
        newErrors.content = 'Comment is required';
      } else if (content.trim().length < 5) {
        newErrors.content = 'Comment must be at least 5 characters long';
      }
      
      if (!authorName.trim()) {
        newErrors.authorName = 'Name is required';
      }
      
      if (!authorEmail.trim()) {
        newErrors.authorEmail = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authorEmail)) {
        newErrors.authorEmail = 'Please enter a valid email address';
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (validate()) {
        onSubmit(content, authorName, authorEmail);
        setContent('');
        setAuthorName('');
        setAuthorEmail('');
      }
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.authorName && <p className="text-red-500 text-sm mt-1">{errors.authorName}</p>}
          </div>
          <div>
            <input
              type="email"
              value={authorEmail}
              onChange={(e) => setAuthorEmail(e.target.value)}
              placeholder="Your email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.authorEmail && <p className="text-red-500 text-sm mt-1">{errors.authorEmail}</p>}
          </div>
        </div>
        
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your comment..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Posting...</span>
            </>
          ) : (
            <>
              <MessageCircle className="w-4 h-4" />
              <span>Post Comment</span>
            </>
          )}
        </button>
      </form>
    );
    };
  

    export default CommentForm