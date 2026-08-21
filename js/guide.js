/* ==========================================================================
   guide.js - ご利用についてページ専用JavaScript
   ========================================================================== */

(function () {
  "use strict";

  function getValueByPath(data, path) {
    return path.split(".").reduce(function (value, key) {
      return value && value[key] !== undefined ? value[key] : undefined;
    }, data);
  }

  function loadGuideData() {
    fetch("data/guide.json")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("guide.jsonの読み込みに失敗しました: " + response.status);
        }
        return response.json();
      })
      .then(function (guideData) {
        applyGuideData(guideData);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  function applyGuideData(guideData) {
    document.querySelectorAll("[data-guide]").forEach(function (el) {
      var path = el.getAttribute("data-guide");
      var value = getValueByPath(guideData, path);
      if (value !== undefined) {
        el.textContent = value;
      }
    });

    var heroImageEl = document.querySelector(".js-guide-hero-image");
    if (heroImageEl && guideData.hero && guideData.hero.image) {
      heroImageEl.style.backgroundImage = "url('" + guideData.hero.image + "')";
    }

    renderEligibility(guideData);
    renderSteps(guideData);
    renderFaq(guideData);
  }

  function renderEligibility(guideData) {
    var containerEl = document.querySelector(".js-eligibility");
    if (!containerEl || !guideData.eligibility) return;

    var html = guideData.eligibility.items
      .map(function (item) {
        return (
          '<div class="eligibility-card">' +
          '<span class="eligibility-card__icon"><svg width="32" height="32"><use href="#guide-icon-' + item.icon + '"></use></svg></span>' +
          '<p class="eligibility-card__text">' + item.text + "</p>" +
          "</div>"
        );
      })
      .join("");

    containerEl.innerHTML = html;
  }

  function renderSteps(guideData) {
    var containerEl = document.querySelector(".js-steps");
    if (!containerEl || !guideData.steps) return;

    var html = guideData.steps
      .map(function (step, index) {
        return (
          '<li class="step-item">' +
          '<span class="step-item__icon"><svg width="36" height="36"><use href="#guide-icon-' + step.icon + '"></use></svg></span>' +
          '<span class="step-item__number">STEP ' + (index + 1) + "</span>" +
          '<p class="step-item__title">' + step.title + "</p>" +
          '<p class="step-item__text">' + step.text + "</p>" +
          "</li>"
        );
      })
      .join("");

    containerEl.innerHTML = html;
  }

  function renderFaq(guideData) {
    var containerEl = document.querySelector(".js-faq");
    if (!containerEl || !guideData.faq) return;

    var html = guideData.faq
      .map(function (item) {
        return (
          '<details class="faq-item">' +
          '<summary class="faq-item__question">Q. ' + item.q + "</summary>" +
          '<p class="faq-item__answer">A. ' + item.a + "</p>" +
          "</details>"
        );
      })
      .join("");

    containerEl.innerHTML = html;
  }

  document.addEventListener("DOMContentLoaded", function () {
    loadGuideData();
  });
})();
