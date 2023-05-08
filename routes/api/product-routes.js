const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {

  try {

    const products = await Product.findAll({ include: [Category, Tag] });
    res.json(products);
    
  } catch (error) {

    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
 
  try {
      
      const product = await Product.findByPk(req.params.id, { include: [Category, Tag] });

      if (!product) {
        res.status(404).json({ message: 'No product found with that id!' });
        return;
      }

      res.json(product);
    
  } catch (error) {
      
      res.status(500).json(err);
    
  }
});

router.post('/', async (req, res) => {
  
  Product.create(req.body)
    .then((product) => {

      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }

      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {

  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {

      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {

      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {

      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {

  try {
    const deletedProduct = await Product.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!deletedProduct) {
      res.status(404).json({ message: 'No product found with that id!' });
      return;
    }

    res.json({ message: 'Product deleted successfully!' });

  } catch (error) {
    res.status(500).json(error);
  }
});


module.exports = router;
