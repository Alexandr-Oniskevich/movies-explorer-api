const router = require('express').Router();
// const { celebrate, Joi } = require('celebrate');
const { validateCreateMovies, validateDeleteMovies } = require('../utils/validation');
const {
  getMovies, createMovies, deleteMovies,
} = require('../controllers/movies');

router.get('/', getMovies);
// создание фильма
router.post('/', validateCreateMovies, createMovies);
// удаление фильма
router.delete('/:movieId', validateDeleteMovies, deleteMovies);

module.exports = router;
