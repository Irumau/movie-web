import { API_KEY } from "./src/secrets.js";
import { eventMenuHamburguesa } from "./src/menuHamburguesa.js";
import { navigator, getPaginated} from './src/navigation.js';

const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    },
});


let lastId = 0;

// Utils

// function to see the width admitted for the API

// const configuration = async () => {
//     const { data } = await api(`configuration`)


//     console.log(data)
// }


const observador = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const url = entry.target.getAttribute('data-img');
            entry.target.setAttribute('src', url);

            observador.unobserve(entry.target);
        }
    })
});



function createMovies(movies, container, { clean = true }) {
    if (clean) {
        container.innerHTML = '';
    }


    movies.forEach(movie => {
        const movieListContainerInfo = document.createElement('div');
        const movieImg = document.createElement('img');
        const titleMovie = document.createElement('h3');
        const textTitleMovie = document.createTextNode(`${movie.title}`)
        const figureContainerImg = document.createElement('figure');

        movieListContainerInfo.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id;
        })

        movieListContainerInfo.classList.add('movieList__container-info');
        movieImg.classList.add('movieList__img');
        titleMovie.classList.add('movieList__title-movie');
        figureContainerImg.classList.add('figureContainerImg')
        figureContainerImg.classList.add('skeleton');
        titleMovie.classList.add('skeleton');

        titleMovie.setAttribute('title', movie.title)
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('data-img', 'http://image.tmdb.org/t/p/w342' + movie.poster_path);

        observador.observe(movieImg);

        if (movie.poster_path != null) {
            titleMovie.appendChild(textTitleMovie);
            container.appendChild(movieListContainerInfo)
            figureContainerImg.appendChild(movieImg);
            movieListContainerInfo.appendChild(figureContainerImg)
            movieListContainerInfo.appendChild(titleMovie);
        }

        movieImg.addEventListener('load', () => {
            figureContainerImg.classList.remove('skeleton');
            titleMovie.classList.remove('skeleton');
        })

    });
}


// LLamados a la API

async function getTrendingMoviesPreview() {
    const { data } = await api('trending/movie/day');
    const movies = data.results;

    const trendingPreview = document.getElementById('trendingPreview');
    const movieTitleTrending = document.querySelector('.trendingPreview__title');
    const trendingPreviewMoviesSlide = document.querySelectorAll('.trendingPreview__movies-trending');
    const trendingPreviewMoviesSlideArray = [...trendingPreviewMoviesSlide];

    trendingPreview.style.background = ''

    trendingPreview.style.background = `linear-gradient(0deg, rgba(0,0,0,0.3),rgba(0,0,0,0.3)), url(https://image.tmdb.org/t/p/original${movies[0].backdrop_path}) no-repeat`;
    trendingPreview.style.backgroundSize = 'cover';
    movieTitleTrending.innerHTML = movies[0].title;


    trendingPreviewMoviesSlideArray.map((movie, index) => {
        movie.style.background = `linear-gradient(0deg, rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url(https://image.tmdb.org/t/p/w342${movies[index].poster_path}) no-repeat`;
        movie.style.backgroundSize = 'cover'

        movie.addEventListener('click', () => {
            trendingPreview.style.background = `linear-gradient(0deg, rgba(0,0,0,0.3),rgba(0,0,0,0.3)), url(https://image.tmdb.org/t/p/original${movies[index].backdrop_path}) no-repeat`;
            trendingPreview.style.backgroundSize = 'cover';
            movieTitleTrending.textContent = movies[index].title;
        })
    })
}

const getRecommendationPreview = async () => {
    const { data } = await api(`movie/13/recommendations`)
    const movies = data.results;
    const movieListContainer = document.getElementById('containerRecommendation');
    createMovies(movies, movieListContainer, { clean: true });
    movieListContainer.scrollTo(0, 0);
}

const getTopRatedPreview = async () => {
    const { data } = await api(`movie/top_rated?page=1`);
    const movies = data.results;
    const topRatedMoviesContainer = document.getElementById('topRatedMovies');
    createMovies(movies, topRatedMoviesContainer, { clean: true });

    topRatedMoviesContainer.scrollTo(0, 0);
}

const getMoviesByGenres = async (id = 0) => {
    lastId = parseInt(id) > 0 ? id : lastId


    const { data } = await api(`discover/movie`, {
        params: {
            with_genres: lastId,
        }
    });
    const movies = data.results;
    const genericList = document.getElementById('genericList');

    createMovies(movies, genericList, { clean: true });
}

const getMoviesBySearch = async (query) => {
    const { data } = await api(`search/movie`, {
        params: {
            query: query,
        }
    });

    const moviesAndSeries = data.results;
    const genericList = document.getElementById('genericList');
    if (data.results.length === 0) {
        const genericListSearchError = document.querySelector('.genericListError');
        genericListSearchError.innerHTML = '';


        const h2Error = document.createElement('h2');
        const imgError = document.createElement('img');

        genericListSearchError.classList.remove('inactive');
        imgError.classList.add('genericListImgError');
        h2Error.classList.add('genericListErrorTitle');

        h2Error.textContent = `We don't find the Movie`;
        imgError.setAttribute('src', './src/img/Untitled design.jpg');

        genericListSearchError.appendChild(imgError);
        genericListSearchError.appendChild(h2Error);
    }

    createMovies(moviesAndSeries, genericList, { clean: true });
    genericListTitle.textContent = '';
}


const getTrendingMovies = async () => {
    const { data } = await api(`trending/movie/day`);
    const movies = data.results;
    const genericList = document.getElementById('genericList');


    createMovies(movies, genericList, { clean: true });
}

const getMovieById = async (id) => {
    const { data: movie } = await api(`movie/${id}`);

    const getGenresInfo = movie.genres;

    const movieInfoTitle = document.querySelector('.movie-info__movieTitle');
    const movieInfoPoints = document.querySelector('.fa-star');
    const movieInfoParagraph = document.querySelector('.movie-info__paragraph');
    const movieInfoList = document.querySelector('.movie-info__lista-generes');
    const movieInfoSection = document.getElementById('movieInfoSection');

    const Img_URL = `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    movieInfoSection.style.background = `linear-gradient(0deg,rgba(0,0,0,0.2),rgba(0,0,0,0.2)),url('${Img_URL}') no-repeat`;
    movieInfoSection.style.backgroundSize = 'cover'
    movieInfoTitle.textContent = movie.title;
    movieInfoPoints.textContent = movie.vote_average;
    movieInfoParagraph.textContent = movie.overview;


    movieInfoList.innerHTML = '';

    getGenresInfo.forEach((genres) => {
        const li = document.createElement('li');
        const liGenre = document.createTextNode(genres.name)
        li.classList.add('movie-info__generes');

        movieInfoList.appendChild(li);
        li.appendChild(liGenre);


        li.addEventListener('click', () => {
            location.hash = `#category=${genres.id}-${genres.name}`;
        })
    });

    getRelatedMoviesId(id);

}

const ulMovieList = document.createElement('ul');

const getRelatedMoviesId = async (id) => {
    const { data } = await api(`movie/${id}/recommendations`);
    const movieRecommendations = data.results;

    const movieInfoContainer = document.querySelector('.movie-info__container');
    movieInfoContainer.appendChild(ulMovieList);
    ulMovieList.innerHTML = '';

    if (movieRecommendations.length === 0) {
        ulMovieList.remove();

    }

    movieRecommendations.forEach((movie) => {
        const liMovieList = document.createElement('li');
        const imgMovieList = document.createElement('img');

        liMovieList.classList.add('movie-info__recommendations-item');
        imgMovieList.classList.add('movie-info__img');
        liMovieList.classList.add('skeleton');

        imgMovieList.setAttribute('data-img', 'http://image.tmdb.org/t/p/w342' + movie.poster_path);
        imgMovieList.setAttribute('alt', movie.title);

        liMovieList.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id;
        })



        observador.observe(imgMovieList)

        if (movie.poster_path != null) {
            ulMovieList.appendChild(liMovieList);
            liMovieList.appendChild(imgMovieList);
            ulMovieList.classList.add('movie-info__recommendations-list');
            ulMovieList.classList.add('scrollStyle');
        }

        imgMovieList.addEventListener('load', () => {
            liMovieList.classList.remove('skeleton');
        })
    })
};
const getPaginatedGenres = async ()=>{

    const [_, genresData] = location.hash.split('='); // => ['#category', 'id-name'];
    const [genresId] = genresData.split('-');


    getPaginated(`discover/movie`,{genresId})
}
const getPaginatedSearch = async()=>{

    const [_, query] = location.hash.split('='); // => ['#search', 'buscador'];

    getPaginated(`search/movie`,{query})
}


eventMenuHamburguesa();
navigator();


export {
    getTrendingMoviesPreview,
    getRecommendationPreview,
    getTopRatedPreview,
    getMoviesByGenres,
    getMoviesBySearch,
    getTrendingMovies,
    getMovieById,
    getPaginatedGenres,
    api,
    createMovies,
    getPaginatedSearch,
}





