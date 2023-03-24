import { getTrendingMoviesPreview } from '../main.js';
import { getRecommendationPreview } from '../main.js';
import { getTopRatedPreview } from '../main.js';
import { getMoviesByGenres } from '../main.js';
import { getMoviesBySearch } from '../main.js';
import { getTrendingMovies } from '../main.js';
import { getMovieById } from '../main.js';

searchFormBtn.addEventListener('click', () => {
    const search = searchFormInput.value.split(' ').join('+');
    location.hash = `#search=${search}`;
})

homeBtn.addEventListener('click', () => {
    location.hash = '#home';
    // window.scrollTo({top:0});
})

watchMoreBtn.addEventListener('click', () => {
    location.hash = '#trends';
    // window.scrollTo({top:0});
})

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);


function navigator() {
    if (location.hash.startsWith('#trends')) {
        trendsPage();
    } else if (location.hash.startsWith('#search=')) {
        SearchPage();
    } else if (location.hash.startsWith('#movie=')) {
        movieDetailsPage();
    } else if (location.hash.startsWith('#category=')) {
        categoriesPage();
    } else {
        homePage();
    }


    document.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    /*
    También puede ser utilizado especificando como un objeto la dirección a la que queremos hacer scroll.
                    example   
    window.scrollTo({top:0});
    */
}


function homePage() {
    trendingPreview.classList.remove('inactive');
    movieAndSeriesSection.classList.remove('inactive');
    movieInfoSection.classList.add('inactive');
    genericList.classList.add('inactive');
    genericListTitle.classList.add('inactive');
    const header = document.querySelector('.header');
    header.style.position = 'fixed'
    const genericListSearchError = document.querySelector('.genericListError');
    genericListSearchError.classList.add('inactive');

    getTrendingMoviesPreview();
    getRecommendationPreview();
    getTopRatedPreview();
}

function categoriesPage() {
    trendingPreview.classList.add('inactive');
    movieAndSeriesSection.classList.add('inactive');
    movieInfoSection.classList.add('inactive');
    genericList.classList.remove('inactive');
    genericListTitle.classList.remove('inactive');
    const header = document.querySelector('.header');
    const genericListSearchError = document.querySelector('.genericListError');
    genericListSearchError.classList.add('inactive');
    header.style.position = 'fixed'

    const [_, genresData] = location.hash.split('='); // => ['#category', 'id-name'];
    const [genresId, genresName] = genresData.split('-');

    genericListTitle.textContent = genresName.split('%20').join(' ');

    getMoviesByGenres(genresId);
}

function movieDetailsPage() {
    trendingPreview.classList.add('inactive');
    movieAndSeriesSection.classList.add('inactive');
    movieInfoSection.classList.remove('inactive');
    genericList.classList.add('inactive');
    genericListTitle.classList.add('inactive');
    const header = document.querySelector('.header');
    header.style.position = 'static'
    const genericListSearchError = document.querySelector('.genericListError');
    genericListSearchError.classList.add('inactive');

    const [_, movieId] = location.hash.split('='); // [#movie=, 'id-movie']

    getMovieById(movieId);
}
function SearchPage() {
    trendingPreview.classList.add('inactive');
    movieAndSeriesSection.classList.add('inactive');
    movieInfoSection.classList.add('inactive');
    genericList.classList.remove('inactive');
    genericListTitle.classList.remove('inactive');
    const header = document.querySelector('.header');
    const genericListSearchError = document.querySelector('.genericListError');
    genericListSearchError.classList.add('inactive');

    header.style.position = 'fixed'

    const [_, query] = location.hash.split('='); // => ['#search', 'buscador'];


    getMoviesBySearch(query);

}
function trendsPage() {
    trendingPreview.classList.add('inactive');
    movieAndSeriesSection.classList.add('inactive');
    movieInfoSection.classList.add('inactive');
    genericList.classList.remove('inactive');
    genericListTitle.classList.remove('inactive');
    const header = document.querySelector('.header');
    header.style.position = 'fixed'
    const genericListSearchError = document.querySelector('.genericListError');
    genericListSearchError.classList.add('inactive');

    genericListTitle.textContent = 'Trending';
    getTrendingMovies();
}


export { navigator };