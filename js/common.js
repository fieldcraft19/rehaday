/* ==========================================================================
   common.js
   全ページ共通のJavaScript(ヘッダーのスクロール検知・モバイルメニュー・
   data/site.json の読み込みと反映)
   ========================================================================== */

(function () {
  "use strict";

  function setupHeaderScroll() {
    var header = document.querySelector(".js-header");
    if (!header) return;

    var SCROLL_THRESHOLD = 40;

    function updateHeaderState() {
      if (window.scrollY > SCROLL_THRESHOLD) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    }

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState);
  }

  function setupMobileMenu() {
    var menuButton = document.querySelector(".js-menu-button");
    var mobileNav = document.querySelector(".js-mobile-nav");
    if (!menuButton || !mobileNav) return;

    menuButton.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  function loadSiteData() {
    fetch("data/site.json")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("site.jsonの読み込みに失敗しました: " + response.status);
        }
        return response.json();
      })
      .then(function (siteData) {
        applySiteData(siteData);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  function applySiteData(siteData) {
    document.querySelectorAll("[data-site]").forEach(function (el) {
      var key = el.getAttribute("data-site");
      var value = getNestedValue(siteData, key);
      if (value === undefined) return;

      if (el.tagName === "IMG") {
        el.src = value;
      } else {
        el.textContent = value;
      }
    });

    document.querySelectorAll("[data-site-tel-link]").forEach(function (el) {
      if (siteData.tel) {
        el.href = "tel:" + siteData.tel.replace(/-/g, "");
      }
    });

    document.querySelectorAll("[data-site-href]").forEach(function (el) {
      var key = el.getAttribute("data-site-href");
      var value = getNestedValue(siteData, key);
      if (value !== undefined) {
        el.href = value;
      }
    });

    document.querySelectorAll("[data-site-list]").forEach(function (el) {
      var key = el.getAttribute("data-site-list");
      var list = getNestedValue(siteData, key);
      if (!Array.isArray(list)) return;

      el.innerHTML = list
        .map(function (itemText) {
          return "<li>" + itemText + "</li>";
        })
        .join("");
    });

    window.siteData = siteData;

    document.dispatchEvent(new CustomEvent("siteDataLoaded", { detail: siteData }));
  }

  function getNestedValue(data, dotSeparatedKey) {
    var keys = dotSeparatedKey.split(".");
    var current = data;

    for (var i = 0; i < keys.length; i++) {
      if (current === null || current === undefined) {
        return undefined;
      }
      current = current[keys[i]];
    }

    return current;
  }

  function renderInfoCards(containerEl, items) {
    if (!containerEl || !items) return;

    var html = items
      .map(function (item) {
        return (
          '<div class="card business-hours-card">' +
          '<p class="business-hours-card__label">' + item.label + "</p>" +
          '<p class="business-hours-card__value">' + item.value + "</p>" +
          "</div>"
        );
      })
      .join("");

    containerEl.innerHTML = html;
  }

  window.SiteUtils = {
    renderInfoCards: renderInfoCards
  };

  document.addEventListener("DOMContentLoaded", function () {
    setupHeaderScroll();
    setupMobileMenu();
    loadSiteData();
  });
})();
