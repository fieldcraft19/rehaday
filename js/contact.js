/* ==========================================================================
   contact.js - お問い合わせ・アクセスページ専用JavaScript
   ========================================================================== */

(function () {
  "use strict";

  function getValueByPath(data, path) {
    return path.split(".").reduce(function (value, key) {
      return value && value[key] !== undefined ? value[key] : undefined;
    }, data);
  }

  function loadContactData() {
    fetch("data/contact.json")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("contact.jsonの読み込みに失敗しました: " + response.status);
        }
        return response.json();
      })
      .then(function (contactData) {
        applyContactData(contactData);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  function applyContactData(contactData) {
    document.querySelectorAll("[data-contact]").forEach(function (el) {
      var path = el.getAttribute("data-contact");
      var value = getValueByPath(contactData, path);
      if (value !== undefined) {
        el.textContent = value;
      }
    });

    var heroImageEl = document.querySelector(".js-contact-hero-image");
    if (heroImageEl && contactData.hero && contactData.hero.image) {
      heroImageEl.style.backgroundImage = "url('" + contactData.hero.image + "')";
    }
  }

  function setupMapEmbed() {
    document.addEventListener("siteDataLoaded", function (event) {
      var siteData = event.detail;
      var mapFrameEl = document.querySelector(".js-map-frame");
      if (mapFrameEl && siteData && siteData.address) {
        mapFrameEl.src = "https://www.google.com/maps?q=" + encodeURIComponent(siteData.address) + "&output=embed";
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    loadContactData();
    setupMapEmbed();
  });
})();
