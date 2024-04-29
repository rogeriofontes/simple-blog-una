const mongoose = require('mongoose');
const router = require('express').Router();
const Articles = mongoose.model('Articles');

// Function to check for missing fields and streamline error responses
function validateArticleFields(body, fields) {
  const errors = {};
  fields.forEach(field => {
    if (!body[field]) {
      errors[field] = 'is required';
    }
  });
  return Object.keys(errors).length > 0 ? errors : null;
}

// POST - Create a new article
router.post('/', (req, res, next) => {
  const errors = validateArticleFields(req.body, ['title', 'author', 'description']);
  if (errors) {
    return res.status(422).json({ errors });
  }

  const finalArticle = new Articles(req.body);
  finalArticle.save()
    .then(article => res.status(201).json({ article: article.toJSON() }))
    .catch(next);
});

// GET - Retrieve all articles
router.get('/', (req, res, next) => {
  Articles.find()
    .sort({ createdAt: 'descending' })
    .then(articles => res.json({ articles: articles.map(article => article.toJSON()) }))
    .catch(next);
});

// Middleware to load article object by ID
router.param('id', (req, res, next, id) => {
  Articles.findById(id)
    .then(article => {
      if (!article) {
        return res.status(404).json({ message: 'Article not found' });
      }
      req.article = article;
      next();
    })
    .catch(next);
});

// GET - Retrieve a single article by ID
router.get('/:id', (req, res) => {
  res.json({ article: req.article.toJSON() });
});

// PATCH - Update an existing article
router.patch('/:id', (req, res, next) => {
  const { body } = req;
  Articles.findById(req.params.id)
    .then(article => {
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }

      ['title', 'author', 'description'].forEach(field => {
        if (typeof body[field] !== 'undefined') {
          article[field] = body[field];
        }
      });

      return article.save();
    })
    .then(article => res.json({ article: article.toJSON() }))
    .catch(next);
});

// DELETE - Delete an article
router.delete('/:id', (req, res, next) => {
  Articles.findByIdAndRemove(req.params.id)
    .then(() => res.sendStatus(204))
    .catch(next);
});

module.exports = router;
