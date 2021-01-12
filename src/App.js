import React, { useState, useEffect } from 'react';
import './App.css';

import Searchbar from './components/Searchbar/Searchbar';
import Loader from './components/Loader/Loader';
import Button from './components/Button/Button';
import ImageGallery from './components/ImageGallery/ImageGallery';
import Modal from './components/Modal/Modal';
import ImageModal from './components/ImageModal/ImageModal';

import imagesApi from './services/api';

export default function App() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [largeImage, setLargeImage] = useState(null);

  useEffect(() => {
    fetchImages();
  }, [searchQuery]);

  useEffect(() => {
    scroll();
  }, [images]);

  const fetchImages = () => {
    if (searchQuery !== '') setIsLoading(true);
    imagesApi
      .FetchImagesWithQuery(searchQuery, page)
      .then(images => {
        console.log(images);
        setImages(prevImages => [...prevImages, ...images]);
        setPage(page + 1);
      })
      .catch(error => {
        setError(error);
      })
      .finally(() => setIsLoading(false));
  };
  const handlerSearchFormSubmit = query => {
    setSearchQuery(query);
    setPage(1);
    setImages([]);
  };

  const toggleModal = () => {
    setLargeImage(null);
  };

  const setlargeImage = url => {
    setLargeImage(url);
  };
  
  const scroll = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };
  return (
    <>
      <Searchbar onSubmit={handlerSearchFormSubmit} />

      {images.length > 0 && (
        <ImageGallery images={images} onSetImageLarge={setlargeImage} />
      )}
      {isLoading && (
        <Loader
          type="Circles"
          color="#00BFFF"
          height={100}
          width={100}
          timeout={3000}
        />
      )}
      {images.length > 0 && <Button fetchImages={fetchImages} />}
      {largeImage && (
        <Modal onClose={toggleModal}>
          <ImageModal largeImage={largeImage} />
        </Modal>
      )}
    </>
  );
}
