const fs = require("fs");
const path = require("path");

let articles = [];
let categories = [];

const articlesPath = path.resolve(__dirname, './data/articles.json');
const categoriesPath = path.resolve(__dirname, './data/categories.json');

module.exports = {
  initialize: function () {
    return new Promise((resolve, reject) => {
      fs.readFile(articlesPath, "utf8", (err, data) => {
        if (err) {
          console.error("Error reading articles file:", err);
          reject(err);
          return;
        }
        articles = JSON.parse(data);
        fs.readFile(categoriesPath, "utf8", (err, data) => {
          if (err) {
            console.error("Error reading categories file:", err);
            reject(err);
            return;
          }
          categories = JSON.parse(data);
          resolve();
        });
      });
    });
  },
  getPublishedArticles: function () {
    return new Promise((resolve, reject) => {
      const publishedArticles = articles.filter(article => article.published === true);
      if (publishedArticles.length > 0) {
        resolve(publishedArticles);
      } else {
        reject(new Error("No published articles found."));
      }
    });
  },
  getCategories: function () {
    return new Promise((resolve, reject) => {
      if (categories.length > 0) {
        resolve(categories);
      } else {
        reject(new Error("No categories found."));
      }
    });
  },
};
