/* ==========================================================================
   flow.js - 1日の流れページ専用JavaScript
   ========================================================================== */

(function () {
  "use strict";

  function getValueByPath(data, path) {
    return path.split(".").reduce(function (value, key) {
      return value && value[key] !== undefined ? value[key] : undefined;
    }, data);
  }

  function loadFlowData() {
    fetch("data/flow.json")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("flow.jsonの読み込みに失敗しました: " + response.status);
        }
        return response.json();
      })
      .then(function (flowData) {
        applyFlowData(flowData);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  function applyFlowData(flowData) {
    document.querySelectorAll("[data-flow]").forEach(function (el) {
      var path = el.getAttribute("data-flow");
      var value = getValueByPath(flowData, path);
      if (value !== undefined) {
        el.textContent = value;
      }
    });

    var heroImageEl = document.querySelector(".js-flow-hero-image");
    if (heroImageEl && flowData.hero && flowData.hero.image) {
      heroImageEl.style.backgroundImage = "url('" + flowData.hero.image + "')";
    }

    renderTimeline(flowData);

    var containerEl = document.querySelector(".js-business-hours");
    window.SiteUtils.renderInfoCards(containerEl, flowData.businessHoursCards);
  }

  function renderTimeline(flowData) {
    var containerEl = document.querySelector(".js-timeline");
    if (!containerEl || !flowData.timeline) return;

    var singlePhotoIndex = 0;

    var html = flowData.timeline
      .map(function (item) {
        var photosHtml = buildPhotosHtml(item, singlePhotoIndex);
        if (item.image && (!item.images || item.images.length === 0)) {
          singlePhotoIndex += 1;
        }

        var rehabLinkHtml =
          item.size === "featured"
            ? '<a class="timeline-item__rehab-link" href="rehab.html">' + flowData.rehabLinkLabel + "</a>"
            : "";

        return (
          '<div class="timeline-item timeline-item--' + item.size + '">' +
          '<p class="timeline-item__time timeline-item__time--am">' + item.amTime + "</p>" +
          '<div class="timeline-item__center">' +
          '<span class="timeline-item__marker"></span>' +
          '<div class="timeline-item__card">' +
          '<p class="timeline-item__title">' + item.title + "</p>" +
          photosHtml +
          '<p class="timeline-item__text">' + item.text + "</p>" +
          rehabLinkHtml +
          "</div>" +
          "</div>" +
          '<p class="timeline-item__time timeline-item__time--pm">' + item.pmTime + "</p>" +
          "</div>"
        );
      })
      .join("");

    containerEl.innerHTML = html;
  }

  function buildPhotosHtml(item, singlePhotoIndex) {
    if (item.images && item.images.length > 0) {
      var multipleHtml = item.images
        .map(function (imagePath) {
          return '<div class="timeline-item__photo" style="background-image: url(\'' + imagePath + "');\"></div>";
        })
        .join("");
      return '<div class="timeline-item__photos timeline-item__photos--scatter">' + multipleHtml + "</div>";
    }

    if (item.image) {
      var variant = (singlePhotoIndex % 5) + 1;
      return (
        '<div class="timeline-item__photo timeline-item__photo--v' + variant + '" ' +
        'style="background-image: url(\'' + item.image + "');\"></div>"
      );
    }

    return "";
  }

  document.addEventListener("DOMContentLoaded", function () {
    loadFlowData();
  });
})();
