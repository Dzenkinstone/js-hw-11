import axios from 'axios';
import Notiflix from 'notiflix';
import { Fetch } from '../src/fetchImages.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
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
  if (!event.currentTarget.elements.searchQuery.value) {
    return;
  }
  imagesShown = 0;
  fetch.query = event.currentTarget.elements.searchQuery.value;
  try {
    const responce = await fetch.fetchImages();
    if (!responce.totalHits) {
      refs.button.classList.add('is-active');
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    Notiflix.Notify.success(`Hooray! We found ${responce.totalHits} images.`);
    refs.button.classList.remove('is-active');
    imagesShown += responce.hits.length;
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
    refs.div.insertAdjacentHTML(
      'beforeend',
      responce.hits
        .map(
          ({
            largeImageURL,
            webformatURL,
            tags,
            likes,
            views,
            comments,
            downloads,
          }) =>
            `<div class="photo-card">
        <a href="${largeImageURL}"><img src="${webformatURL}" width="300" height="200" alt="${tags}" loading="lazy"/></a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            <b>${likes}</b>
          </p>
          <p class="info-item">
            <b>Views</b>
            <b>${views}</b>
          </p>
          <p class="info-item">
            <b>Comments</b>
            <b>${comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads</b>
            <b>${downloads}</b>
          </p>
        </div>
      </div>`
        )
        .join('')
    );
  } catch (error) {
    console.log(error);
  }
  let gallery = new SimpleLightbox('.photo-card a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
  });
  gallery.refresh();
}

function deleteLayout() {
  refs.div.innerHTML = '';
}
