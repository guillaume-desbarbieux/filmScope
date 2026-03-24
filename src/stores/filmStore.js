import { defineStore } from 'pinia'
export const useFilmStore = defineStore('films', {
  state: () => ({
    films: [
      {
        id: 1,
        title: 'A New Hope',
        year: 2000,
        poster_url: 'https://placehold.co/300x100/orange/white?text=A+new+hope',
        rating: 5.3,
        isFavorite: false,
      },
      {
        id: 2,
        title: 'The Empire Strikes Back',
        year: 2001,
        poster_url: 'https://placehold.co/300x100/orange/white?text=The+empire+strikes+back',
        rating: 8.2,
        isFavorite: false,
      },
      {
        id: 3,
        title: 'Return of the Jedi',
        year: 2003,
        poster_url: 'https://placehold.co/300x100/orange/white?text=Return+of+the+Jedi',
        rating: 7.8,
        isFavorite: false,
      },
    ],
  }),
})
