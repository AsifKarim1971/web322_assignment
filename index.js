const express = require("express");
const path = require("path");
const contentService = require("./content-service");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const ejsLayouts = require("express-ejs-layouts");

const app = express();
const port = 4000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Set up view engine and use express-ejs-layouts for layouts
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(ejsLayouts);

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Serve 'about.html' from the root and '/about' routes
app.get(["/", "/about"], (req, res) => {
  res.render("about", { title: "About Us" });
});

// Serve 'home.html' from the '/home' route
app.get("/home", (req, res) => {
  contentService
    .getPublishedArticles()
    .then((articles) => {
      console.log(articles); // Check the URLs here
      res.render("home", {
        title: "Home",
        articles: articles,
      });
    })
    .catch((err) => {
      console.error("Error fetching published articles:", err);
      res.render("index", {
        title: "Home",
        articles: [], // If error occurs, pass an empty array for articles
      });
    });
});

// Route for fetching published articles
app.get("/articles", (req, res) => {
  contentService
    .getPublishedArticles()
    .then((articles) => {
      res.render("articles", { articles: articles, title: "Articles" });
    })
    .catch((err) => {
      console.error("Error fetching published articles:", err);
      res.render("articles", {
        message: "No articles available or error fetching.",
        articles: [],
        title: "Articles",
      });
    });
});

// Route to get categories
app.get("/categories", (req, res) => {
  contentService
    .getCategories()
    .then((categories) => {
      res.render("categories", {
        categories: categories,
        title: "Categories",
      });
    })
    .catch((err) => {
      console.error("Error fetching categories:", err);
      res.render("categories", {
        message: "No categories available or error fetching.",
        categories: [],
        title: "Categories",
      });
    });
});

// Route to display the add post page with categories
app.get("/articles/add", (req, res) => {
  contentService
    .getCategories()
    .then((categories) => {
      res.render("addArticle", {
        title: "Add Article",
        categories: categories,
      });
    })
    .catch((err) => {
      console.error("Error fetching categories:", err);
      res.render("addArticle", { title: "Add Article", categories: [] });
    });
});

// Cloudinary configuration (replace with your credentials)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const upload = multer(); // No disk storage, image data will be uploaded directly to Cloudinary

// Route to handle adding new article
app.post("/articles/add", upload.single("featureImage"), (req, res) => {
  console.log("Request Body:", req.body);
  console.log("Uploaded File:", req.file);

  let processArticle = (imageUrl) => {
    console.log("Image URL:", imageUrl);

    const { title, content, category } = req.body;
    const published = req.body.published === "on";

    if (!title || !content || !category) {
      console.error("Missing required fields");
      return res.status(400).send("Missing required fields");
    }

    const newArticle = {
      title,
      content,
      category,
      featureImage: imageUrl, // Storing Cloudinary URL
      published,
    };

    contentService
      .addArticle(newArticle)
      .then((article) => {
        console.log("Article added successfully:", article);
        res.redirect("/articles");
      })
      .catch((err) => {
        console.error("Error adding article:", err);
        res.status(500).send("Internal Server Error");
      });
  };

  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    streamUpload(req)
      .then((uploaded) => {
        processArticle(uploaded.url); // Use Cloudinary URL
      })
      .catch((error) => {
        console.error("Image upload error:", error);
        processArticle(""); // Proceed without image
      });
  } else {
    processArticle(""); // No image provided
  }
});

// Route to get all posts or filter by category or minDate
app.get("/posts", (req, res) => {
  let { category, minDate } = req.query;

  if (category) {
    contentService
      .getPostsByCategory(category)
      .then((posts) =>
        res.render("articles", { articles: posts, title: "Articles" })
      )
      .catch((err) => res.status(400).json({ message: err.message }));
  } else if (minDate) {
    contentService
      .getPostsByMinDate(minDate)
      .then((posts) =>
        res.render("articles", { articles: posts, title: "Articles" })
      )
      .catch((err) => res.status(400).json({ message: err.message }));
  } else {
    contentService
      .getPosts()
      .then((posts) =>
        res.render("articles", { articles: posts, title: "Articles" })
      )
      .catch((err) => res.status(400).json({ message: err.message }));
  }
});

// Route to get a post by ID
app.get("/post/:id", (req, res) => {
  const postId = req.params.id;
  console.log("Fetching post with ID:", postId);

  contentService
    .getPostById(postId)
    .then((post) => {
      console.log(post.featureImage); // Log to verify image URL
      res.render("article", { article: post, title: post.title });
    })
    .catch((err) => {
      console.error("Error fetching post:", err);
      res.status(404).render("404", { message: "Post not found" });
    });
});

// Route to show the modify page (edit an article)
app.get("/article/:id/modify", (req, res) => {
  const articleId = req.params.id;

  // Fetch the article and categories to populate the form
  contentService
    .getPostById(articleId)
    .then((article) => {
      contentService
        .getCategories()
        .then((categories) => {
          res.render("modify", {
            article: article,
            categories: categories, // Pass the categories to populate the dropdown
            title: "Modify Article",
          });
        })
        .catch((err) => {
          console.error("Error fetching categories:", err);
          res.status(500).send("Internal Server Error");
        });
    })
    .catch((err) => {
      console.error("Error fetching article:", err);
      res.status(404).render("404", { message: "Article not found" });
    });
});

// Route to handle article update
app.post("/article/:id/update", (req, res) => {
  const articleId = req.params.id;
  const { title, content, category, featureImage, published } = req.body;

  // Convert published to boolean
  const isPublished = published === "on";

  const updatedArticle = {
    title,
    content,
    category,
    featureImage,
    published: isPublished,
  };

  contentService
    .updateArticle(articleId, updatedArticle)
    .then((updatedPost) => {
      res.redirect(`/article/${updatedPost.id}`); // Redirect to the updated article's page
    })
    .catch((err) => {
      console.error("Error updating article:", err);
      res.status(500).send("Internal Server Error");
    });
});

// Route to handle article deletion
app.post("/article/:id/delete", (req, res) => {
  const articleId = req.params.id;

  contentService
    .deleteArticle(articleId)
    .then(() => {
      res.redirect("/articles"); // Redirect to the articles list page
    })
    .catch((err) => {
      console.error("Error deleting article:", err);
      res.status(500).send("Internal Server Error");
    });
});

// Handler for favicon requests
app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

// Start the server
app.listen(port, () => {
  console.log(`Express http server listening on port ${port}`);
});

module.exports = app;
