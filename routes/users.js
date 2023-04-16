const router = require('express').Router();
const {
  getUsers, changeUserInfo, getCurrentUser,
} = require('../controllers/users');
const { validateChangeUserInfo } = require('../utils/validation');

router.get('/me', getCurrentUser);
router.get('/', getUsers);
// изменение информации о пользователе
router.patch('/me', validateChangeUserInfo, changeUserInfo);

module.exports = router;
