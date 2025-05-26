import { refs } from "../main";
import { userValue } from "../main";
import { currentPage } from "../main";
import { maxPage } from "../main";

export function createGallery(images) {
  return images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `
    <li class="photo-card">
      <a href="${largeImageURL}" target="_blank">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      </a>
      <div class="info">
        <p><b>Likes:</b> ${likes}</p>
        <p><b>Views:</b> ${views}</p>
        <p><b>Comments:</b> ${comments}</p>
        <p><b>Downloads:</b> ${downloads}</p>
      </div>
    </li>
    `
    )
    .join('');
}
export function renderGallery(container, images, lightboxInstance) {
  container.innerHTML = createGallery(images);
  lightboxInstance.refresh();
}
export function renderGalleryForLoadBtn(container, images, lightboxInstance) {
  container.insertAdjacentHTML('beforeend', createGallery(images));;
  lightboxInstance.refresh();
}


export function clearGallery(container) {
  container.innerHTML = '';
}

export function showLoader(loaderEl) {
  loaderEl.classList.remove('is-hidden');
}

export function hideLoader(loaderEl) {
  loaderEl.classList.add('is-hidden');
}
export function showLoadMoreButton() {
    refs.loadBtn.classList.remove('is-hidden');
}

export function hideLoadMoreButton() {
    refs.loadBtn.classList.add('is-hidden');
}

export function updateBtnStatus() {
    if (currentPage < maxPage) {
        showLoadMoreButton();
    } else {
        hideLoadMoreButton(); 
}
}