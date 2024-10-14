const fs = require("fs");
const path = require("path");

let articles = [];
let categories = [];

module.exports = {
  initialize: function () {
    return new Promise((resolve, reject) => {
      fs.readFile(path.join(__dirname, "data", "articles.json"), "utf8", (err, data) => {
        if (err) {
          reject(`Failed to read articles file: ${err.message}`);
          return;
        }
        articles = JSON.parse(data);
        fs.readFile(path.join(__dirname, "data", "categories.json"), "utf8", (err, data) => {
          if (err) {
            reject(`Failed to read categories file: ${err.message}`);
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
        reject("No published articles found.");
      }
    });
  },
  getCategories: function () {
    return new Promise((resolve, reject) => {
      if (categories.length > 0) {
        resolve(categories);
      } else {
        reject("No categories found.");
      }
    });
  },
};
