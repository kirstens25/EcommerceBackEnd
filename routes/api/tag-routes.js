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
  }).then((findAllTags) => {
    res.json(findAllTags);
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
  }).then((findTag) => {
    res.json(findTag);
  })
});

router.post('/', (req, res) => {
  // create a new tag
  Tag.create({
    name: req.body.name
  }).then((createdTag) => {
    res.json(createdTag);
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
  }).then((updatedTag) => {
    res.json(updatedTag);
  })
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  Tag.destroy({
    where: {
      id: req.params.id
    }
  }).then((deleteTag) => {
    res.json(deleteTag);
  })
});

module.exports = router;
