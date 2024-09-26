const express = require('express');
const router = express.Router();
const Post = require(`../models/Post`)
// *GET/
// Home Route 


router.get('', async (req, res) => {
    try {
      const locals = {
        title: "NodeJs Blog",
        description: "Simple Blog created with NodeJs, Express & MongoDb."
      }
  
      let perPage = 10;
      let page = req.query.page || 1;
  
      const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
  
      // Count is deprecated - please use countDocuments
      // const count = await Post.count();
      const count = await Post.countDocuments({});
      const nextPage = parseInt(page) + 1;
      const hasNextPage = nextPage <= Math.ceil(count / perPage);
  
      res.render('index', { 
        locals,
        data,
        current: page,
        nextPage: hasNextPage ? nextPage : null,
        currentRoute: '/'
      });
    } catch (error) {
      console.log(error);
    }
  
  });


  // GET Route
  // POST: id

  router.get('/post/:id', async (req, res) => {
    
     
    
      try {
        
          let slug = req.params.id;

        const data = await Post.findById({_id: slug});
        
        const locals = {
            title: data.title,
            description: "Simple Blog created with NodeJs, Express & MongoDb."
          }
          res.render('post', { locals, data });
    } catch (error) {
        console.log(error);
      }
    
    });
    
  

  // POST /
  // Post- Search Terms
  router.post('/search', async (req, res) => {
    try {
      const locals = {
        title: "Search",
        description: "Simple Blog"
      }
      let searchTerm = req.body.searchTerm;
      const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g,"");
      const data = await Post.find(
        {
          $or: [
            { title: {$regex: new RegExp(searchNoSpecialChar, 'i')}},
            { body: {$regex: new RegExp(searchNoSpecialChar, 'i')}}
          ]
        }
      )
      res.render("search", {
        data,
        locals
      })
  } catch (error) {
      console.log(error);
    }
  
  });
  


// About Page Router
router.get('/about', (req, res) => {
    res.render(`about`);
});



//Very important to export the router:
module.exports = router;