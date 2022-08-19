
const express = require("express");
const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");


mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true});

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 1
    },
    content: {
        type: String,
        required: true
    }
});

const Article = new mongoose.model("Article" , articleSchema);

const rest = Article({
    title : "REST",
    content : "REST is short for REpresentational State Transfer. IIt's an architectural style for designing APIs."
})

const api = Article({
    title : "API",
    content: "API stands for Application Programming Interface. It is a set of subroutine definitions, communication protocols, and tools for building software. In general terms, it is a set of clearly defined methods of communication among various components. A good API makes it easier to develop a computer program by providing all the building blocks, which are then put together by the programmer."
})

const bootstrap = Article({
    
    title : "Bootstrap",
    content : "This is a framework developed by Twitter that contains pre-made front-end templates for web design"
})

const dom = Article({
    
    title : "DOM",
    content : "The Document Object Model is like an API for interacting with our HTML"
})

const jack = Article({
    title : "Jack Bauer",
    content : "Jack Bauer once stepped into quicksand. The quicksand couldn't escape and nearly drowned.",
})

const defaultItems = [rest, api, bootstrap ,dom ,jack];

//////////////////////////////// All Articles /////////////////////////////////////

app.route("/articles")

.get((req ,res) => {
    // Article.insertMany(defaultItems, (err) => {
    //     if(!err){
    //         res.send("Successfully added the document to the wikiDB")
    //     }else{
    //         res.send(err);
    //     }
    // })

    Article.find({} , (err, foundArticles) => {
        if(!err){
            res.send(foundArticles)
        }else{
            res.send(err);
        }
        
    })

})

.post((req , res) => {

    const articlePost = Article({
        title: req.body.title,
        content: req.body.content
    });

    articlePost.save((err) => {
        if(!err){
            res.send("Successfully added a new articles!")
        }else{
            res.send(err);
        }
    });

})

.delete((req ,res) => {
    Article.deleteMany({} ,(err) => {
        if(!err){
            res.send("Successfully deleted the all article content")
        }else{
            res.send(err);
        }
    })
});


////////////////////////////// Specific articles //////////////////////////////

app.route("/articles/:articleID")
.get((req ,res) => {
    Article.find({title: req.params.articleID}, (err , foundArticle) => {
        if(!err){
            if(foundArticle){
                res.send(foundArticle);
            }else{
                res.send("No article matching that title was found!");
            }
           
        }else{
            res.send(err);
        }
    })

})
.put((req , res) => {
    Article.replaceOne(
        {title: req.params.articleID},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        (err) => {
            if(!err){
                res.send("Successfully updated articles!");
            }else{
                res.send(err);
            }
        })
})
.patch((req , res) => {
    Article.updateOne(
        {title: req.params.articleID},
        {$set: req.body},
        (err) => {
        if(!err){
            res.send("Successfully updated articles!")
        }else{
            res.send(err);
        }
    })
})
.delete((req , res) => {
    Article.deleteOne({title: req.params.articleID} ,(err) => {
        if(!err){
            res.send("Successfully deleted the specific article content");
        }
    })
});

app.listen(port, () => {
    console.log("Server is running at port " + port);
})