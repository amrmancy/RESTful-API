const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();

// Set view engine to EJS
app.set('view engine', 'ejs');

// Parse request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


mongoose.set('strictQuery',false);                                        // to prevent deprecation error             
mongoose.connect('mongodb://127.0.0.1/wikiDB');                 // the connection
console.log("Connected to database");                                     //msg

  

const articleSchema = {                               //Schema
    title: String,
    content: String
}

const Article =mongoose.model("Article", articleSchema); //model, collection name will change automatically to "articles"



/////////////////////////////////////////// Requests targeting All Articles///////////////////////////////

app.route("/articles")                     // Chained Route Handlers, write the Route() then .get().post().delete()


.get(function(req, res) {
  Article.find()                          // Always targeting the Model Article not the collection
    .then(function(foundArticles) {
      res.send(foundArticles);
    })
    .catch(function(err) {
      res.send(err);
    });
})

.post(function(req,res){

  const newArticle =new Article({             // Always targeting the Model Article not the collection
    title:req.body.title,
    content:req.body.content
  });
  newArticle.save()
  .then(() => {
    res.send("successfully added a new article!");
  })
  .catch((error) => {
    res.send(error);
  });

})


.delete(function(req,res){
  Article.deleteMany()                       // Always targeting the Model Article not the collection
  .then(() => {
    res.send("successfully deleted all Articles!");
  })
  .catch((error) => {
    res.send(error);
  });

});



/////////////////////////////////////////// Requests targeting a specific Article///////////////////////////////

app.route("/articles/:articleTitle")
.get(function(req,res) {
  Article.findOne({title:req.params.articleTitle})
  .then(function(foundArticle) {
    res.send(foundArticle);
  })
  .catch(function(err) {
    res.send("there's no such an Article with this title was found!");
  });
})
.put(function(req,res){       // PUT is used to update the whole Document(title&content)
  Article.findOneAndUpdate(
    {title:req.params.articleTitle},
    {title:req.body.title, content:req.body.content},
    {overwrite:true, useFindAndModify: false} 
  )
  .then(updatedArticle => {
    if (updatedArticle) {
      res.send("The article was updated successfully");
    }
  })
  .catch(err => {
    res.send(err.message);
  });
})
.patch(function(req,res){
  Article.findOneAndUpdate(
    {title:req.params.articleTitle},
    {$set:req.body}  // same as follows
    // {$set:{title:req.body.title, content:req.body.content}}
  )
  .then(updatedArticle => {
    if (updatedArticle) {
      res.send("The article was updated successfully");
    }
  })
  .catch(err => {
    res.send(err.message);
  });
})
.delete(function(req,res){
  Article.deleteOne(
   {title:req.params.articleTitle}
  )
  .then(() => {
    res.send("successfully deleted the Article!");
  })
  .catch((error) => {
    res.send(error);
  });
});

  



    app.listen(3000, function() {
        console.log("Server started on port 3000");
      });