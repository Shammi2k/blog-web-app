import express from "express";

const app = express();
const port = 3000;

app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs", {blogs : listOfBlogs});
});

app.get("/create-blog", (req, res) => {
    res.render("newBlog.ejs");
});

app.get("/update-blog/*", (req, res) => {
    var blogId = req.url.split("/update-blog/")[1];
    var blog = listOfBlogs[listOfBlogs.findIndex((blog) => blog.id == blogId)];
    res.render("updateBlog.ejs", {blog : blog});
});

app.post("/confirm-update", (req, res) => {
    var blogData = req.body;
    var metaData = {};
    metaData.creationTime = new Date();
    var blog = listOfBlogs[listOfBlogs.findIndex((blog) => blog.id == blogData.blogId)];
    blog.title = blogData.title;
    blog.content = blogData.content;
    blog.metaData = metaData;
    res.redirect("/blogs/" + blog.id);
});

app.post("/add-blog", (req, res) => {
    var blogData = req.body;
    var metaData = {};
    metaData.creationTime = new Date();
    listOfBlogs.push(new Blog(blogData.title, blogData.content, metaData));
    res.redirect("/");
});

app.get("/blogs/*", (req, res) => {
    var blogId = req.url.split("/blogs/")[1];
    var blog = listOfBlogs[listOfBlogs.findIndex((blog) => blog.id == blogId)];
    res.render("displayBlog.ejs", {blog : blog});
});

app.post("/delete-blog", (req, res) => {
    var blogId = req.body.blogId;
    listOfBlogs = listOfBlogs.filter((blog) => {
        if (blog.id == blogId)
        {
            console.log(`Removing blog element with title ${blog.title}`);
        }
        return blog.id != blogId;
    });
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

class Blog {
    constructor(title, content, metaData) {
        this.id = availableId++;
        this.title = title;
        this.content = content;
        this.metaData = metaData;
    }
}

var listOfBlogs = [];
var availableId = 1;