
import { getImagesByQuery, PER_PAGE } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#search-form');
  const loadMoreBtn = document.querySelector('.load-more');

  let currentQuery = '';
  let currentPage = 1;
  let totalHits = 0;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const input = e.target.elements.searchQuery.value.trim();

    if (!input) {
      iziToast.warning({
        title: 'Увага',
        message: 'Введіть пошуковий запит!',
        position: 'topRight',
      });
      return;
    }

    currentQuery = input;
    currentPage = 1;
    clearGallery();
    hideLoadMoreButton();
    showLoader();

    try {
      const data = await getImagesByQuery(currentQuery, currentPage);
      totalHits = data.totalHits;

      if (data.hits.length === 0) {
        iziToast.info({
          title: 'Нічого не знайдено',
          message: 'Спробуйте інший запит.',
          position: 'topRight',
        });
        return;
      }

      createGallery(data.hits);

      const totalPages = Math.ceil(totalHits / PER_PAGE);
      if (currentPage < totalPages) {
        showLoadMoreButton();
      } else {
        hideLoadMoreButton();
        iziToast.info({
          message: "We're sorry, but you've reached the end of search results.",
          position: 'topRight',
        });
      }
    } catch (err) {
      iziToast.error({
        title: 'Помилка',
        message: 'Не вдалося отримати дані',
        position: 'topRight',
      });
    } finally {
      hideLoader();
    }
  });

  loadMoreBtn.addEventListener('click', async () => {
    currentPage += 1;
    hideLoadMoreButton();
    showLoader();

    try {
      const data = await getImagesByQuery(currentQuery, currentPage);
      createGallery(data.hits);

      const totalPages = Math.ceil(totalHits / PER_PAGE);
      if (currentPage < totalPages) {
        showLoadMoreButton();
      } else {
        hideLoadMoreButton();
        iziToast.info({
          message: "We're sorry, but you've reached the end of search results.",
          position: 'topRight',
        });
      }

      smoothScroll();
    } catch (err) {
      iziToast.error({
        title: 'Помилка',
        message: 'Не вдалося завантажити більше',
        position: 'topRight',
      });
    } finally {
      hideLoader();
    }
  });

  function smoothScroll() {
    const gallery = document.querySelector('.gallery');
    const firstCard = gallery.firstElementChild;
    if (firstCard) {
      const { height: cardHeight } = firstCard.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
  }
});