const router = require('express').Router();
const { Category, Product } = require('../../models');
const { findAll, create } = require('../../models/Category');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  // find all categories
  Category.findAll({
    // be sure to include its associated Products
    include: [
      { model: Product }
    ]
  }).then((categories) => {
    res.json(categories);
  });
});

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  Category.findByPk(req.params.id, {
    // be sure to include its associated Products
    include: [
      { model: Product }
    ]
  }).then((categories) => {
    res.json(categories);
  });
});

router.post('/', (req, res) => {
  // create a new category
  Category.create({
    name: req.body.name
  }).then((created) => {
    res.json(created);
  })
});
router.put('/:id', (req, res) => {
  // update a category by its `id` value
  Category.update({
    name: req.body.name
  }, {
    where: {
      id: req.params.id
    }
  }).then((updated) => {
    res.json(updated);
  })
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
  Category.destroy({
    where: {
      id: req.params.id
    }
  }).then((results) => {
    res.json(results)
  })
});
  module.exports = router;
