const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index', {
    user: req.user,
    token: req.csrfToken()
  });
});

router.get('/test', (req, res, next) => {
  res.render('index', {
    user: req.user,
    token: req.csrfToken()
  });
});

module.exports = router;
