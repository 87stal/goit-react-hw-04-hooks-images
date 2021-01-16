import React, { useState, useEffect } from 'react';
import './App.css';

import Searchbar from '../Searchbar/Searchbar';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';
import Button from '../Button/Button';
import ImageGallery from '../ImageGallery/ImageGallery';
import Modal from '../Modal/Modal';
import ImageModal from '../ImageModal/ImageModal';

import imagesApi from '../../services/api';

export default function App() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [largeImage, setLargeImage] = useState(null);
  const [arePicturseOver, setArePicturseOver] = useState(false);

  useEffect(() => {
    if (searchQuery !== '') fetchImages();
  }, [searchQuery]);

  useEffect(() => {
    scroll();
  }, [images]);

  const fetchImages = () => {
    setIsLoading(true);
    setArePicturseOver(false);
    imagesApi
      .FetchImagesWithQuery(searchQuery, page)
      .then(images => {
        setImages(prevImages => [...prevImages, ...images.hits]);
        setPage(page + 1);
        pictursOver(images.totalHits, page);
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

  const closeModal = () => {
    setLargeImage(null);
  };

  const openModal = url => {
    setLargeImage(url);
  };

  const pictursOver = (totalImages, page) => {
    const lastPage = Math.ceil(totalImages / 12);
    if (page === lastPage) {
      setArePicturseOver(true);
    }
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
        <ImageGallery images={images} onSetImageLarge={openModal} />
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
      {images.length > 0 && !isLoading && !arePicturseOver && (
        <Button fetchImages={fetchImages} />
      )}

      {largeImage && (
        <Modal onClose={closeModal}>
          <ImageModal largeImage={largeImage} />
        </Modal>
      )}
    </>
  );
}
