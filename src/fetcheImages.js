export const Fetch = class Fetch {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImages() {
    console.log(this);
    const BASE_URL = 'https://pixabay.com/api';
    const BASE_KEY = '31643108-406f286ad01c488a7c5407e59';
    const tryToResponce = await fetch(
      `${BASE_URL}/?key=${BASE_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=10`
    );
    const responce = await tryToResponce.json();
    this.page += 1;
    return responce;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
};
