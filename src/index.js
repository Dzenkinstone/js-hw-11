import axios from 'axios';
import Notiflix from 'notiflix';
import { Fetch } from '../src/fetchImages.js';
const fetch = new Fetch();
console.log(fetch);

const refs = {
  form: document.querySelector('.search-form'),
  div: document.querySelector('.gallery'),
  button: document.querySelector('.load-more'),
};

let imagesShown = 0;

refs.form.addEventListener('submit', async event => {
  event.preventDefault();
  fetch.resetPage();
  deleteLayout();
  imagesShown = 0;
  if (!event.currentTarget.elements.searchQuery.value) {
    return;
  }
  fetch.query = event.currentTarget.elements.searchQuery.value;
  try {
    const responce = await fetch.fetchImages();
    refs.button.classList.remove('is-active');
    imagesShown += responce.hits.length;
    console.log(imagesShown);
    appendLayout(responce);
  } catch (error) {
    console.log(error);
  }
});

refs.button.addEventListener('click', async () => {
  try {
    const responce = await fetch.fetchImages();
    imagesShown += responce.hits.length;
    console.log(imagesShown);
    console.log(responce.totalHits);
    if (imagesShown === responce.totalHits) {
      refs.button.classList.add('is-active');
      return Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
    appendLayout(responce);
  } catch (error) {
    console.log(error);
  }
});

function appendLayout(responce) {
  try {
    if (!responce.total) {
      refs.button.classList.add('is-active');
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    refs.div.insertAdjacentHTML(
      'beforeend',
      responce.hits
        .map(
          element =>
            `<div class="photo-card">
        <img src="${element.webformatURL}" width="300" height="200" alt="${element.tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            <b>${element.likes}</b>
          </p>
          <p class="info-item">
            <b>Views</b>
            <b>${element.views}</b>
          </p>
          <p class="info-item">
            <b>Comments</b>
            <b>${element.comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads</b>
            <b>${element.downloads}</b>
          </p>
        </div>
      </div>`
        )
        .join('')
    );
  } catch (error) {
    console.log(error);
  }
}

function deleteLayout() {
  refs.div.innerHTML = '';
}
