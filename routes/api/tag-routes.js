const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// `/api/tags` endpoint


// route to get all tags
router.get('/', async (req, res) => {
  
  try {
    const tags = await Tag.findAll({ include: Product });
    res.json(tags);
  } catch (error) {
    res.status(500).json(error);
  }
});

// route to get one tag by id
router.get('/:id', async (req, res) => {
  
  try {
    
    const tag = await Tag.findByPk(req.params.id, { include: Product });
    if (!tag) {
      res.status(404).json({ message: 'No tag found with that id!' });
      return;
    }
    res.json(tag);

  } catch (error) {
    
  }
});

// route to create a new tag
router.post('/', async (req, res) => {
  
  try {
      
      const newTag = await Tag.create(req.body);
      res.status(201).json(newTag);
  
    }
    catch (error) {
        
        res.status(500).json(err);
      
      }
});

// route to update a tag's name by its `id` value
router.put('/:id', async (req, res) => {
  
  try {

    const updatedTag = await Tag.update(req.body, { where: { id: req.params.id } });
    
    if (!updatedTag[0]) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }
    
    res.json({ message: 'Tag updated successfully!' });

  }
  catch (error) {
      
      res.status(500).json(err);
    
    }
});

// route to delete on tag by its `id` value
router.delete('/:id', async (req, res) => {

  try {

    const deletedTag = await Tag.destroy({ where: { id: req.params.id } });
    
    if (!deletedTag) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }
    
    res.json({ message: 'Tag deleted successfully!' });

  }
  catch (error) {
        
        res.status(500).json(err);
      
      }
});

module.exports = router;
