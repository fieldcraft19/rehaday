/* ==========================================================================
   rehab.js - リハビリ紹介ページ専用JavaScript
   ========================================================================== */

(function () {
  "use strict";

  function getValueByPath(data, path) {
    return path.split(".").reduce(function (value, key) {
      return value && value[key] !== undefined ? value[key] : undefined;
    }, data);
  }

  function loadRehabData() {
    fetch("data/rehab.json")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("rehab.jsonの読み込みに失敗しました: " + response.status);
        }
        return response.json();
      })
      .then(function (rehabData) {
        applyRehabData(rehabData);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  function applyRehabData(rehabData) {
    document.querySelectorAll("[data-rehab]").forEach(function (el) {
      var path = el.getAttribute("data-rehab");
      var value = getValueByPath(rehabData, path);
      if (value !== undefined) {
        el.textContent = value;
      }
    });

    var heroImageEl = document.querySelector(".js-rehab-hero-image");
    if (heroImageEl && rehabData.hero && rehabData.hero.image) {
      heroImageEl.style.backgroundImage = "url('" + rehabData.hero.image + "')";
    }

    renderTechniqueExtras(rehabData);
    renderProfessionals(rehabData);
  }

  function renderTechniqueExtras(rehabData) {
    if (!rehabData.techniques) return;

    document.querySelectorAll(".js-technique-image").forEach(function (el) {
      var index = parseInt(el.getAttribute("data-technique-index"), 10);
      var technique = rehabData.techniques[index];
      if (technique && technique.image) {
        el.style.backgroundImage = "url('" + technique.image + "')";
      }
    });

    document.querySelectorAll(".js-technique-items").forEach(function (el) {
      var index = parseInt(el.getAttribute("data-technique-index"), 10);
      var technique = rehabData.techniques[index];
      if (technique && technique.items) {
        el.innerHTML = technique.items
          .map(function (item) {
            return "<li>" + item + "</li>";
          })
          .join("");
      }
    });
  }

  function renderProfessionals(rehabData) {
    var containerEl = document.querySelector(".js-professionals-content");
    if (!containerEl || !rehabData.professionals) return;

    var professionals = rehabData.professionals;
    var qualificationsHtml = (professionals.qualifications || [])
      .map(function (qualification) {
        return "<li>" + qualification + "</li>";
      })
      .join("");

    containerEl.innerHTML =
      '<div class="professionals__image" style="background-image: url(\'' + professionals.image + "');\"></div>" +
      '<div class="professionals__body">' +
      '<ul class="professionals__qualifications tag-list">' + qualificationsHtml + "</ul>" +
      '<p class="professionals__text">' + professionals.text + "</p>" +
      "</div>";
  }

  document.addEventListener("DOMContentLoaded", function () {
    loadRehabData();
  });
})();
