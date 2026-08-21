/* ==========================================================================
   about.js - 施設についてページ専用JavaScript
   data/about.json を読み込み、各セクションの中身を描画する。
   ========================================================================== */

(function () {
  "use strict";

  function getValueByPath(data, path) {
    return path.split(".").reduce(function (value, key) {
      return value && value[key] !== undefined ? value[key] : undefined;
    }, data);
  }

  function loadAboutData() {
    fetch("data/about.json")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("about.jsonの読み込みに失敗しました: " + response.status);
        }
        return response.json();
      })
      .then(function (aboutData) {
        applyAboutData(aboutData);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  function applyAboutData(aboutData) {
    document.querySelectorAll("[data-about]").forEach(function (el) {
      var path = el.getAttribute("data-about");
      var value = getValueByPath(aboutData, path);
      if (value !== undefined) {
        el.textContent = value;
      }
    });

    var heroImageEl = document.querySelector(".js-about-hero-image");
    if (heroImageEl && aboutData.hero && aboutData.hero.image) {
      heroImageEl.style.backgroundImage = "url('" + aboutData.hero.image + "')";
    }

    renderConceptText(aboutData);
    renderGallery(aboutData);
    renderBusinessHours(aboutData);
  }

  function renderConceptText(aboutData) {
    var containerEl = document.querySelector(".js-concept-text");
    if (!containerEl || !aboutData.concept || !aboutData.concept.paragraphs) return;

    var paragraphs = aboutData.concept.paragraphs;
    var photoPath = aboutData.concept.photo;
    var photoAfterIndex = Math.min(1, paragraphs.length - 1);

    var html = paragraphs
      .map(function (text, index) {
        var paragraphHtml = '<p class="concept__paragraph">' + text + "</p>";
        if (photoPath && index === photoAfterIndex) {
          paragraphHtml +=
            '<div class="concept__photo" style="background-image: url(\'' + photoPath + "');\"></div>";
        }
        return paragraphHtml;
      })
      .join("");

    containerEl.innerHTML = html;
  }

  /* ギャラリーのメイン枠は、動画ではなく1枚の写真(mainImage)を表示する構成にしている。 */
  function renderGallery(aboutData) {
    var containerEl = document.querySelector(".js-gallery");
    if (!containerEl || !aboutData.gallery) return;

    var gallery = aboutData.gallery;
    var subImagesHtml = (gallery.subImages || [])
      .map(function (imagePath) {
        return '<div class="gallery-sub-item" style="background-image: url(\'' + imagePath + "');\"></div>";
      })
      .join("");

    containerEl.innerHTML =
      '<div class="gallery-main" style="background-image: url(\'' + gallery.mainImage + '\');"></div>' +
      '<p class="gallery-caption">' + gallery.caption + "</p>" +
      '<div class="gallery-sub">' + subImagesHtml + "</div>";
  }

  function renderBusinessHours(aboutData) {
    var containerEl = document.querySelector(".js-business-hours");
    window.SiteUtils.renderInfoCards(containerEl, aboutData.businessHoursCards);
  }

  document.addEventListener("DOMContentLoaded", function () {
    loadAboutData();
  });
})();
