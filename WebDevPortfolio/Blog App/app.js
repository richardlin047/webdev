var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    app = express();
   
// APP CONFIG   
mongoose.connect("mongodb://localhost/restful_blog_app");
//first time connecting will create it, second time will connect
app.set("view engine", "ejs"); 
//need to install, this allows the ejs files to be loaded without .ejs
app.use(express.static("public"));
//Used to serve images, CSS files, and JavaScript files in a directory named public
app.use(bodyParser.urlencoded({extended: true}));
// for parsing application/x-www-form-urlencoded
app.use(expressSanitizer());
app.use(methodOverride("_method"));
//Whenever you see _method, change the method to the given param

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Test Blog",
//     image: "https://images.unsplash.com/photo-1505455567956-d0ef422b45b4?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=b2bf5dc37830cea5a83fd79ee7a66251&auto=format&fit=crop&w=1050&q=80",
//     body: "HELLO THIS IS A BLOG POST"
// });

// RESTFUL ROUTES
app.get("/", function(req, res){
    res.redirect("/blogs");
});
// INDEX ROUTE
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err) {
            console.log("ERROR!");
        } else {
            res.render("index.ejs", {blogs: blogs});
        }
    })
});

// NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new.ejs");
});

// CREATE ROUTE
app.post("/blogs", function(req, res){
    // Create blog
    // Blog.create(data, callback)
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if (err){
            res.render("new");
        } else {
            // then, redirect to the index
            res.redirect("/blogs");
        }
    });
});

// SHOW ROUTE
app.get("/blogs/:id", function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err){
            res.redirect("/blogs");
        } else {
            res.render("show.ejs", {blog: foundBlog})
        }
    });
});

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    })
});

// UPDATE ROUTE
app.put("/blogs/:id", function(req,res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    // Blog.findByIdAndUpdate(id, newData, callBack)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if (err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// DELETE ROUTE
app.delete("/blogs/:id", function(req,res) {
    // destroy blog
    // Blog.findByIdAndRemove(req.params.id, function)
    Blog.findByIdAndRemove(req.params.id, function(err){
        if (err){
            res.redirect("/blogs")
        } else {
            res.redirect("/blogs")
        }
    })
    // redirect somewhere
    
    // res.send("You have reached the destory route");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("SERVER IS RUNNING!");
});
