import {
    getTrendingMoviesPreview, getRecommendationPreview,
    getTopRatedPreview, getMoviesByGenres,
    getMoviesBySearch, getTrendingMovies, getMovieById,
    getLikedMovies,
} from '../main.js';

import { getPaginatedGenres, getPaginatedSearch, api, createMovies } from '../main.js';

let maxPage;
let page = 1;
let infiniteScrolling;


searchFormBtn.addEventListener('click', () => {
    const search = searchFormInput.value.split(' ').join('+');
    location.hash = `#search=${search}`;
})

const homeBtnArray = [...homeBtn];
homeBtnArray.forEach(btn =>{
    btn.addEventListener('click',()=>{
        location.hash = '#home';
    })
})



watchMoreBtn.addEventListener('click', () => {
    location.hash = '#trends';
    // window.scrollTo({top:0});
})

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);
window.addEventListener('scroll', infiniteScrolling, { passive: false });



function navigator() {

    if (infiniteScrolling) {
        window.removeEventListener('scroll', infiniteScrolling);
        infiniteScrolling = undefined;
    }

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

    if (infiniteScrolling) {
        window.addEventListener('scroll', infiniteScrolling);
    }
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
    getLikedMovies();
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

    const deCodeGenresName = decodeURIComponent(genresName);
    genericListTitle.textContent = deCodeGenresName;

    getMoviesByGenres(genresId);

    infiniteScrolling = getPaginatedGenres;
    page = 1;
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
    page = 1;
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

    page = 1;
    infiniteScrolling = getPaginatedSearch;
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


    infiniteScrolling = getPaginatedTrendingMovies;
    page = 1;
}
async function getPaginatedTrendingMovies() {
    const { scrollTop,
        scrollHeight,
        clientHeight
    } = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);

    if (scrollIsBottom && page) {
        page++
        const { data } = await api(`trending/movie/day`, {
            params: {
                page,
            }
        });

        maxPage = data.total_pages;
        if (maxPage > page) {
            const movies = data.results;
            const genericList = document.getElementById('genericList');

            createMovies(movies, genericList, { clean: false });
        }
    }
}
const getPaginated = async (endPoint, {
    genresId,
    query,
}) => {
    const { scrollTop,
        scrollHeight,
        clientHeight
    } = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 35);

    if (scrollIsBottom) {
        page++
        const { data } = await api(endPoint, {
            params: {
                page,
                with_genres: genresId,
                query,
            }
        });
        const movies = data.results;
        const genericList = document.getElementById('genericList');
        createMovies(movies, genericList, { clean: false });

    }
}

export { navigator, getPaginated,homePage };