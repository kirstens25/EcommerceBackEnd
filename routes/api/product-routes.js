const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', (req, res) => {
  // find all products
  Product.findAll({
    // be sure to include its associated Category and Tag data
    include: [
      { model: Category },
      {
        model: Tag,
      }
    ]
  }).then((findProducts) => {
    res.json(findProducts);
  })
});

// get one product
router.get('/:id', (req, res) => {
  // find a single product by its `id`
  Product.findByPk(req.params.id, {
    // be sure to include its associated Category and Tag data
    include: [
      { model: Category },
      {
        model: Tag,
        as: ProductTag
      }
    ]
  }).then((results) => {
    res.json(results);
  })
});

// create new product
router.post('/', (req, res) => {
  Product.create({
    name: req.body.name,
    price: req.body.price,
    stock: req.body.stock,
    category_id: req.body.category_id
  })
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((createProduct) => res.status(200).json(createProduct))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id
    }
  })
    .then(product => {
      if (req.body.tagIds && req.body.tagIds.length) {
        const productTags = ProductTag.findAll({
          where: { product_id: req.params.id }
        });
        const productTagIds = productTags.map(({ tag_id }) => tag_id);
        // create filtered list of new tag_ids
        const newProductTags = req.body.tagIds
          .filter(tag_id => !productTagIds.includes(tag_id))
          .map(tag_id => {
            return {
              product_id: req.params.id,
              tag_id
            };
          });
        // figure out which ones to remove
        const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);

        // run both actions
        return Promise.all([
          ProductTag.destroy({ where: { id: productTagsToRemove } }),
          ProductTag.bulkCreate(newProductTags)
        ]);
      }

      return res.json(product);
    })
    .catch(err => {
      // console.log(err);
      res.status(400).json(err);
    });
});
router.delete('/:id', (req, res) => {
  // delete one product by its `id` value
  Product.destroy({
    where: {
      id: req.params.id
    },
    // be sure to include its associated Category and Tag data
    include: [
      { model: Category },
      { model: Tag,
        as: ProductTag
      }
    ]
  }).then((deleteProduct) => {
    res.json(deleteProduct);
  })
});

module.exports = router;
