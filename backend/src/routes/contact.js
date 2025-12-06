const express = require('express');
const router = express.Router();
const { submitContact, getContactMessages } = require('../controllers/contactController');
const { protect } = require('../middlewares/auth');
const { body, validationResult } = require('express-validator');

const validateContact = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('message').trim().notEmpty().withMessage('Message is required'),
];

router.post(
  '/',
  validateContact,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  submitContact
);
router.get('/', protect, getContactMessages);

module.exports = router;

