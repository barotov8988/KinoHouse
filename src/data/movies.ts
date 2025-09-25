export type Genre =
  | 'Драма'
  | 'Криминал'
  | 'Фантастика'
  | 'Фэнтези'
  | 'Боевик'
  | 'Триллер'
  | 'Комедия'
  | 'Мелодрама'
  | 'Приключения'
  | 'Анимация'
  | 'История'
  | 'Детектив'

export type Person = {
  id: string
  name: string
}

export type Movie = {
  id: string
  type: 'movie' | 'series'
  title: string
  originalTitle?: string
  year: number
  runtime?: number // minutes
  seasons?: number
  overview: string
  rating: number // 0..10
  votes: number
  genres: Genre[]
  cast: Person[]
  posterUrl: string
  backdropUrl?: string
  trailerYoutubeId?: string
}

export const movies: Movie[] = [
  {
    id: 'tt0110912',
    type: 'movie',
    title: 'Криминальное чтиво',
    originalTitle: 'Pulp Fiction',
    year: 1994,
    runtime: 154,
    overview:
      'Нерассказанные истори�� гангстеров, боксёров и молодой пары преступников переплетаются в стиле нуар с чёрным юмором.',
    rating: 8.6,
    votes: 2200000,
    genres: ['Криминал', 'Драма'],
    cast: [
      { id: 'nm0000237', name: 'Джон Траволта' },
      { id: 'nm0000235', name: 'Сэмюэл Л. Джексон' },
      { id: 'nm0000236', name: 'Ума Турман' },
    ],
    posterUrl: 'https://image.tmdb.org/t/p/w342/dM2w364MScsjFf8pfMbaWUcWrR.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg',
    trailerYoutubeId: 's7EdQ4FqbhY',
  },
  {
    id: 'tt0133093',
    type: 'movie',
    title: 'Матрица',
    originalTitle: 'The Matrix',
    year: 1999,
    runtime: 136,
    overview:
      'Хакер Нео узнаёт об истинной природе реальности и вступает в борьбу против машин вместе с Морфеусом и Тринити.',
    rating: 8.7,
    votes: 2100000,
    genres: ['Фантастика', 'Боевик'],
    cast: [
      { id: 'nm0000206', name: 'Киану Ривз' },
      { id: 'nm0000401', name: 'Лоренс Фишбёрн' },
      { id: 'nm0005251', name: 'Кэрри-Энн Мосс' },
    ],
    posterUrl: 'https://image.tmdb.org/t/p/w342/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/7u3pxc0K1wx32IleAkLv78MKgrw.jpg',
    trailerYoutubeId: 'vKQi3bBA1y8',
  },
  {
    id: 'tt0903747',
    type: 'series',
    title: 'Во все тяжкие',
    originalTitle: 'Breaking Bad',
    year: 2008,
    seasons: 5,
    overview:
      'Учитель химии, узнав о смертельной болезни, начинает варить метамфетамин вместе с бывшим учеником, чтобы обеспечить семью.',
    rating: 9.5,
    votes: 2000000,
    genres: ['Драма', 'Криминал'],
    cast: [
      { id: 'nm0186505', name: 'Брайан Крэнстон' },
      { id: 'nm0666739', name: 'Аарон Пол' },
      { id: 'nm0644022', name: 'Анна Ганн' },
    ],
    posterUrl: 'https://image.tmdb.org/t/p/w342/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
    trailerYoutubeId: 'HhesaQXLuRY',
  },
  {
    id: 'tt0468569',
    type: 'movie',
    title: 'Тёмный рыцарь',
    originalTitle: 'The Dark Knight',
    year: 2008,
    runtime: 152,
    overview:
      'Бэтмен сталкивается с Джокером, преступником-агентом хаоса, ставящим под угрозу Готэм.',
    rating: 9.0,
    votes: 2700000,
    genres: ['Боевик', 'Триллер', 'Криминал'],
    cast: [
      { id: 'nm0000288', name: 'Кристиан Бэйл' },
      { id: 'nm0005132', name: 'Хит Леджер' },
      { id: 'nm0000323', name: 'Гэри Олдман' },
    ],
    posterUrl: 'https://image.tmdb.org/t/p/w342/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
    trailerYoutubeId: 'EXeTwQWrcwY',
  },
  {
    id: 'tt2395427',
    type: 'movie',
    title: 'Мстители: Эра Альтрона',
    originalTitle: 'Avengers: Age of Ultron',
    year: 2015,
    runtime: 141,
    overview:
      'Команда Мстителей сталкивается с новым искусственным интеллектом Альтроном, стремящимся уничтожить человечество.',
    rating: 7.3,
    votes: 900000,
    genres: ['Боевик', 'Фантастика', 'Приключения'],
    cast: [
      { id: 'nm0000375', name: 'Роберт Дауни мл.' },
      { id: 'nm0262635', name: 'Крис Эванс' },
      { id: 'nm0424060', name: 'Скарлетт Йоханссон' },
    ],
    posterUrl: 'https://image.tmdb.org/t/p/w342/4ssDuvEDkSArWEdyBl2X5EHvYKU.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/r02x2Tz9n6gZ8b31QgRIFVQGryu.jpg',
    trailerYoutubeId: 'JAUoeqvedMo',
  },
  {
    id: 'tt7366338',
    type: 'series',
    title: 'Чернобыль',
    originalTitle: 'Chernobyl',
    year: 2019,
    seasons: 1,
    overview:
      'Драматическое воссоздание событий катастрофы на ЧАЭС и героизма людей, предотвративших ещё большие последствия.',
    rating: 9.4,
    votes: 900000,
    genres: ['Драма', 'История'],
    cast: [
      { id: 'nm0564215', name: 'Джаред Харрис' },
      { id: 'nm0001303', name: 'Стеллан Скарсгард' },
      { id: 'nm0939697', name: 'Эмили Уотсон' },
    ],
    posterUrl: 'https://image.tmdb.org/t/p/w342/hlLXt2tOPT6RRnjiUmoxyG1LTFi.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/5I5eJp7xZ2nFzo4PM5XgS5aXoa.jpg',
    trailerYoutubeId: 's9APLXM9Ei8',
  },
  {
    id: 'tt4154796',
    type: 'movie',
    title: 'Мстители: Финал',
    originalTitle: 'Avengers: Endgame',
    year: 2019,
    runtime: 181,
    overview:
      'Оставшиеся в живых Мстители объединяются, чтобы отменить действия Таноса и вернуть погибших.',
    rating: 8.4,
    votes: 1200000,
    genres: ['Боевик', 'Фантастика', 'Приключения'],
    cast: [
      { id: 'nm0262635', name: 'Крис Эванс' },
      { id: 'nm0000375', name: 'Роберт Дауни мл.' },
      { id: 'nm4043618', name: 'Крис Хемсворт' },
    ],
    posterUrl: 'https://image.tmdb.org/t/p/w342/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg',
    trailerYoutubeId: 'TcMBFSGVi1c',
  },
  {
    id: 'tt0944947',
    type: 'series',
    title: 'Игра престолов',
    originalTitle: 'Game of Thrones',
    year: 2011,
    seasons: 8,
    overview:
      'Эпическая борьба за власть в Семи Королевствах Вестероса, где интриги и драконы переплетаются.',
    rating: 9.2,
    votes: 2100000,
    genres: ['Фэнтези', 'Драма', 'Приключения'],
    cast: [
      { id: 'nm3592338', name: 'Эмилия Кларк' },
      { id: 'nm0227759', name: 'Питер Динк��эйдж' },
      { id: 'nm3229685', name: 'Кит Харрингтон' },
    ],
    posterUrl: 'https://image.tmdb.org/t/p/w342/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/gwPSoYUHAKmdyVywgLpKKA4BjRr.jpg',
    trailerYoutubeId: 'KPLWWIOCOOQ',
  },
]

export const allGenres: Genre[] = Array.from(
  movies.reduce((set, m) => {
    m.genres.forEach((g) => set.add(g))
    return set
  }, new Set<Genre>())
) as Genre[]

export const allActors: Person[] = Array.from(
  movies.reduce((set, m) => {
    m.cast.forEach((a) => set.add(a.name))
    return set
  }, new Set<string>())
).map((name) => ({ id: name, name }))
