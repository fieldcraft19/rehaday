/* ==========================================================================
   news.js - お知らせ一覧の描画(トップページ・お知らせ一覧ページ共通)
   ========================================================================== */

(function () {
  "use strict";

  function formatDate(dateString) {
    return dateString.replace(/-/g, ".");
  }

  function sortByDateDesc(newsList) {
    return newsList.slice().sort(function (a, b) {
      if (a.date === b.date) return 0;
      return a.date < b.date ? 1 : -1;
    });
  }

  function renderNewsList(containerEl, newsList) {
    var html = newsList
      .map(function (newsItem) {
        return (
          '<li class="news-item">' +
          '<span class="news-item__date">' + formatDate(newsItem.date) + "</span>" +
          '<span class="news-item__category">' + newsItem.category + "</span>" +
          '<span class="news-item__title">' + newsItem.title + "</span>" +
          "</li>"
        );
      })
      .join("");

    containerEl.innerHTML = html;
  }

  function setupNewsList() {
    var containerEl = document.querySelector(".js-news-list");
    if (!containerEl) return;

    var limitAttr = containerEl.getAttribute("data-news-limit");
    var limit = limitAttr ? parseInt(limitAttr, 10) : null;

    fetch("data/news.json")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("news.jsonの読み込みに失敗しました: " + response.status);
        }
        return response.json();
      })
      .then(function (newsList) {
        var sortedList = sortByDateDesc(newsList);
        var targetList = limit ? sortedList.slice(0, limit) : sortedList;
        renderNewsList(containerEl, targetList);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  document.addEventListener("DOMContentLoaded", setupNewsList);
})();
