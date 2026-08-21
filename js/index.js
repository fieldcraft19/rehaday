/* ==========================================================================
   index.js - トップページ専用JavaScript
   ・ファーストビューの写真スライダー
   ・店舗一覧の描画(data/site.json を読み込んで表示)
   ========================================================================== */

(function () {
  "use strict";

  function setupHeroSlider() {
    var slides = document.querySelectorAll(".js-hero-slide");
    if (slides.length === 0) return;

    var SLIDE_INTERVAL_MS = 5000;
    var currentIndex = 0;

    function showSlide(index) {
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
    }

    showSlide(currentIndex);

    setInterval(function () {
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
    }, SLIDE_INTERVAL_MS);
  }

  function setupStoresList() {
    var storesListEl = document.querySelector(".js-stores-list");
    if (!storesListEl) return;

    document.addEventListener("siteDataLoaded", function (event) {
      var siteData = event.detail;
      if (siteData && siteData.stores) {
        renderStoresList(storesListEl, siteData);
      }
    });
  }

  function renderStoresList(containerEl, siteData) {
    var stores = siteData.stores || [];
    var currentStore = siteData.currentStore;

    // 店舗ごとの画像は images/stores/ に "store-a.svg" のようなアルファベット順で用意する想定。
    var imageLetters = ["a", "b", "c", "d", "e", "f"];

    var html = stores
      .map(function (store, index) {
        var imageLetter = imageLetters[index] || "a";

        var isCurrentStore = store.name === currentStore;
        var linkButtonHtml = isCurrentStore
          ? ""
          : '<a class="button button--navy" href="' +
            store.url +
            '" target="_blank" rel="noopener">' +
            store.name +
            "のホームページはこちら</a>";

        return (
          '<div class="card store-card">' +
          '<div class="store-card__image" style="background-image: url(images/stores/store-' +
          imageLetter +
          '.svg);"></div>' +
          '<div class="store-card__body">' +
          '<p class="store-card__name">' + store.name + "</p>" +
          linkButtonHtml +
          "</div>" +
          "</div>"
        );
      })
      .join("");

    containerEl.innerHTML = html;
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupHeroSlider();
    setupStoresList();
  });
})();
