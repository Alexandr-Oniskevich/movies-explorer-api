const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUsersId, changeUserInfo, getCurrentUser,
} = require('../controllers/users');

router.get('/me', getCurrentUser);
router.get('/', getUsers);
// получение юзера по ID
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24)
      .required(),
  }),
}), getUsersId);
// изменение информации о пользователе
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), changeUserInfo);

module.exports = router;
