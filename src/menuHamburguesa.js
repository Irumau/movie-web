import { API_KEY } from "./secrets.js";

const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    },
});

const listGenres = document.createElement('ul');
const title = document.createElement('h2');
title.textContent = 'Genres';



async function getGenresPreview() {
    const { data } = await api(`genre/movie/list`);

    const genres = data.genres;


    genres.map((genre) => {
        const nav = document.querySelector('.navCategory');
        const itemGenre = document.createElement('li');
        const textGenre = document.createTextNode(genre.name);

        listGenres.classList.add("navCategory__list");
        itemGenre.classList.add("navCategory__item");
        title.classList.add('title-genres');


        nav.appendChild(listGenres);
        listGenres.insertAdjacentElement('afterbegin', title);
        itemGenre.appendChild(textGenre);
        listGenres.appendChild(itemGenre);


        itemGenre.addEventListener('click', () => {
            const navShow = document.querySelector('.navCategory');
            location.hash = `#category=${genre.id}-${genre.name}`;

            window.scrollTo({top:0});

            navShow.classList.toggle('showMenu')


        })
    })



}

export function eventMenuHamburguesa() {
    const menuHamburguesa = document.getElementById('menuHamburguesa');
    const navShow = document.querySelector('.navCategory')



    menuHamburguesa.addEventListener('click', () => {
        navShow.classList.toggle('showMenu')
        getGenresPreview();
        listGenres.innerHTML = "";
    })
}








