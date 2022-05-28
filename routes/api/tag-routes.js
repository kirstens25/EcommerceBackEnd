const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // find all tags
  Tag.findAll({
    // be sure to include its associated Product data
    include: [
      {
        model: Product,
        attributes: ["id", "price", "name", "stock", "category_id"],
      },
    ],
  }).then((categories) => {
    res.json(categories);
  });
});

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  Tag.findByPk(req.params.id, {
    // be sure to include its associated Product data
    include: [{
      model: Product,
      attributes: ["id", "price", "name", "stock", "category_id"],
    },
    ],
  })
});

router.post('/', (req, res) => {
  // create a new tag
  Tag.create({
    name: req.body.name
  }).then((created) => {
    res.json(created);
  })
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag.update({
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
  // delete on tag by its `id` value
  Tag.destroy({
    where: {
      id: req.params.id
    }
  }).then((results) => {
    res.json(results);
  })
});

module.exports = router;
