import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchPhoto } from './js/pixabay-api';
import { createMarkup } from './js/markup';
import { refs } from './js/refs';
import { lightbox } from './js/lightbox';

const { searchForm, gallery, btnLoadMore } = refs;
const paramsForNotify = {
  position: 'center-center',
  timeout: 2500,
};
const perPage = 40;
let page = 1;
let keyOfSearchPhoto = '';

btnLoadMore.classList.add('is-hidden');

searchForm.addEventListener('submit', onSubmitForm);

async function onSubmitForm(event) {
  event.preventDefault();

  gallery.innerHTML = '';
  page = 1;
  const { searchQuery } = event.currentTarget.elements;
  //   console.log (searchQuery)
  keyOfSearchPhoto = searchQuery.value.trim().toLowerCase();

  if (keyOfSearchPhoto === '') {
    Notify.info('Enter your request, please!', paramsForNotify);
    return;
  }

  //   console.log(keyOfSearchPhoto);

  const response = await fetchPhoto(keyOfSearchPhoto, page, perPage);

  const searchResults = response.hits;

  try {
    if (response.totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
        paramsForNotify
      );
    } else {
      Notify.info(
        `Hooray! We found ${response.totalHits} images.`,
        paramsForNotify
      );

      // console.log(searchResults);

      createMarkup(searchResults);
      lightbox.refresh();
    }

    if (response.totalHits > perPage) {
      btnLoadMore.classList.remove('is-hidden');
    }

    scrollPage();
  } catch (error) {
    onFetchError();
  }

  searchForm.reset();
}

btnLoadMore.addEventListener('click', onClickLoadMore);
async function onClickLoadMore() {
  page += 1;
  const response = await fetchPhoto(keyOfSearchPhoto, page, perPage);

  const searchResults = response.hits;
  const numberOfPage = Math.ceil(response.totalHits / perPage);

  createMarkup(searchResults);
  if (page === numberOfPage) {
    btnLoadMore.classList.add('is-hidden');
    Notify.info(
      "We're sorry, but you've reached the end of search results.",
      paramsForNotify
    );
  }
  lightbox.refresh();
  scrollPage();
}

function onFetchError() {
  Notify.failure(
    'Oops! Something went wrong! Try reloading the page or make another choice!',
    paramsForNotify
  );
}

function scrollPage() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
