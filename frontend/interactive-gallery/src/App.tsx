import React, { useState } from "react";
import type { Image } from "./types";
import AuthProvider from "./contexts/AuthProvider";
import Header from "./components/common/Header";
import ImageGallery from "./components/gallery/ImageGallery";
import ImageModal from "./components/gallery/ImageModal";
import AuthModal from "./components/auth/AuthModal";
import { Toaster } from "sonner";

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleImageClick = (image: Image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Header onSearch={handleSearch} onAuthClick={() => setShowAuth(true)} />

        <main>
          <ImageGallery
            onImageClick={handleImageClick}
            searchQuery={searchQuery}
          />
        </main>

        {selectedImage && (
          <ImageModal image={selectedImage} onClose={handleCloseModal} />
        )}

        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      </div>

      {/* Sonner Toast Container */}
      <Toaster
        position="top-right"
        richColors
        expand={true}
        duration={4000}
        closeButton
      />
    </AuthProvider>
  );
};

export default App;
