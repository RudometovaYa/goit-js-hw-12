import './css/styles.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import axios from 'axios';

import { getImagesByQuery, PAGE_SIZE } from './js/pixabay-api.js';
import {
  renderGallery,
  renderGalleryForLoadBtn,
  clearGallery,
  showLoader,
  hideLoader,
  updateBtnStatus,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

export const refs = {
  formEl: document.querySelector('.form'),
  galleryEl: document.querySelector('.gallery'),
  loader: document.querySelector('.loader-container'),
  loadBtn: document.querySelector('.load-btn'),
};

export let userValue;
export let currentPage = 0;
export let maxPage = 0;

refs.loadBtn.classList.add('is-hidden');

/* ініціалізуємо  */
const gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

refs.formEl.addEventListener('submit', async e => {
  e.preventDefault();
  userValue = e.target.elements['search-text'].value.trim();

  if (!userValue) {
    iziToast.warning({
      message:
        'Sorry, there are no images matching your search query. Please try again!',
      position: 'topRight',
    });
    return;
  }

  hideLoadMoreButton();

  clearGallery(refs.galleryEl);
  showLoader(refs.loader);
  currentPage = 1;

  try {
    console.log('НАДСИЛАЄМО ЗАПИТ', userValue, currentPage);

    const data = await getImagesByQuery(userValue, currentPage);

    console.log('Відповідь:', data);

    if (data.hits.length === 0) {
      iziToast.error({
        message: 'Sorry, there are no images matching your search query.',
        position: 'topRight',
      });
      hideLoadMoreButton();
      return;
    }

    renderGallery(refs.galleryEl, data.hits, gallery);
    maxPage = Math.ceil(data.totalHits / PAGE_SIZE);
    console.log(maxPage);

    updateBtnStatus();
  } catch (error) {
    iziToast.error({
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
    console.error(error);
  } finally {
    hideLoader(refs.loader);
    updateBtnStatus();
    e.target.reset();
  }
});

refs.loadBtn.addEventListener('click', async e => {
  console.log('Load button clicked, викликаю showLoader');

  hideLoadMoreButton();
  showLoader(refs.loader);
  currentPage += 1;

  try {
    const res = await getImagesByQuery(userValue, currentPage);

    renderGalleryForLoadBtn(refs.galleryEl, res.hits, gallery);

    const firstCard = refs.galleryEl.querySelector('.photo-card');
    if (firstCard) {
      const { height: cardHeight } = firstCard.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }

    const loadedImagesCount = currentPage * PAGE_SIZE;

    if (loadedImagesCount >= res.totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      updateBtnStatus();
    }
  } catch (error) {
    iziToast.error({
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
    console.error(error);
  } finally {
    // Ховаємо лоадер у будь-якому разі
    hideLoader(refs.loader);
    updateBtnStatus();
  }
});
