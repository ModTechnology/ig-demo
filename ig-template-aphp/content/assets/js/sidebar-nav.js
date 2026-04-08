/**
 * sidebar-nav.js
 * Ajustements DOM et fonctionnalités interactives pour le template AP-HP.
 * La navigation latérale est générée en Liquid (fragment-pagebegin.html).
 */
(function() {

  /* --- Page active + profondeur dynamique dans le sidebar --- */

  var sidebarList = document.getElementById('sidebar-list');
  if (sidebarList) {
    var items = sidebarList.querySelectorAll('li');
    for (var i = 0; i < items.length; i++) {
      var cls = items[i].className;
      var match = cls.match(/sidebar-depth-(\d+)/);
      if (match) {
        var depth = parseInt(match[1]);
        if (depth > 0) {
          var link = items[i].querySelector('a');
          if (link) {
            link.style.paddingLeft = (15 + depth * 14) + 'px';
            link.style.fontSize = depth === 1 ? '13px' : '12px';
            link.style.color = depth === 1 ? '#555' : '#777';
          }
        }
      }
    }

    var currentPath = sidebarList.getAttribute('data-current-path');
    var links = sidebarList.querySelectorAll('a');
    for (var j = 0; j < links.length; j++) {
      if (links[j].getAttribute('href') === currentPath) {
        links[j].classList.add('active');
        var group = links[j].parentElement.getAttribute('data-group');
        var children = sidebarList.querySelectorAll('.sidebar-child[data-group="' + group + '"]');
        for (var k = 0; k < children.length; k++) {
          children[k].setAttribute('data-open', 'true');
        }
        break;
      }
    }
  }

  /* --- Réorganisation DOM --- */

  var contentWrap = document.getElementById('content-wrapper');
  var innerWrap = contentWrap ? contentWrap.querySelector('.inner-wrapper') : null;
  var navTabs = innerWrap ? innerWrap.querySelector('.nav-tabs') : null;
  if (navTabs && innerWrap && contentWrap) {
    contentWrap.insertBefore(navTabs, innerWrap);
    innerWrap.classList.add('has-tabs');
  }

  var publishBox = document.querySelector('#publish-box, .publish-box');
  var segmentContent = document.getElementById('segment-content');
  if (publishBox && segmentContent) {
    segmentContent.parentNode.insertBefore(publishBox, segmentContent);
    publishBox.style.opacity = '1';
  }

  if (contentWrap) {
    var tables = contentWrap.querySelectorAll('table:not(.colsi)');
    for (var t = 0; t < tables.length; t++) {
      if (tables[t].parentNode) {
        var w = document.createElement('div');
        w.className = 'table-scroll-wrapper';
        tables[t].parentNode.insertBefore(w, tables[t]);
        w.appendChild(tables[t]);
      }
    }
  }

  var cells = document.querySelectorAll('td.hierarchy');
  for (var i = 0; i < cells.length; i++) {
    if (cells[i].textContent.trim() === '0 Table of Contents') {
      cells[i].parentElement.style.display = 'none';
    }
  }


  /* --- Drawer mobile --- */

  var navToggle = document.getElementById('nav-toggle');
  var sidebarWrapper = document.getElementById('sidebar-wrapper');
  var overlay = document.getElementById('mobile-overlay');

  function openDrawer() {
    sidebarWrapper.classList.add('open');
    overlay.classList.add('visible');
    navToggle.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    sidebarWrapper.classList.remove('open');
    overlay.classList.remove('visible');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (navToggle) {
    navToggle.addEventListener('click', function() {
      sidebarWrapper.classList.contains('open') ? closeDrawer() : openDrawer();
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeDrawer);
  }


  /* --- Table des matières (TOC) — construite depuis les h2/h3/h4 --- */

  var sidebarNav = document.getElementById('sidebar-nav');
  var innerContent = document.querySelector('#content-wrapper > .inner-wrapper');
  if (sidebarNav && innerContent) {
    // Masquer la TOC du publisher si présente
    var origToc = document.querySelector('.markdown-toc');
    if (origToc) origToc.style.display = 'none';

    var allHeadings = innerContent.querySelectorAll('h2[id], h3[id], h4[id]');
    var headings = [];
    for (var j = 0; j < allHeadings.length; j++) {
      var tabPane = allHeadings[j].closest('.tab-pane');
      if (tabPane && !tabPane.classList.contains('active')) continue;
      headings.push(allHeadings[j]);
    }

    if (headings.length > 0) {
      var tocSection = document.createElement('div');
      tocSection.className = 'sidebar-toc-section';

      var tocWrap = document.createElement('div');
      tocWrap.className = 'sidebar-toc-wrapper';

      var tocTitle = document.createElement('div');
      tocTitle.className = 'sidebar-toc-title';
      tocTitle.textContent = 'Sur cette page';
      tocWrap.appendChild(tocTitle);

      var tocNav = document.createElement('nav');
      tocNav.className = 'sidebar-page-toc';
      var tocUl = document.createElement('ul');

      for (var m = 0; m < headings.length; m++) {
        var heading = headings[m];
        var tag = heading.tagName.toLowerCase();
        var text = heading.textContent.replace(/^\s*[\d.]+\s*/, '').trim();
        if (!text) continue;

        var li = document.createElement('li');
        if (tag === 'h3') li.style.paddingLeft = '12px';
        if (tag === 'h4') li.style.paddingLeft = '24px';

        var tocLink = document.createElement('a');
        tocLink.href = '#' + heading.id;
        tocLink.textContent = text;
        li.appendChild(tocLink);
        tocUl.appendChild(li);
      }

      tocNav.appendChild(tocUl);
      tocWrap.appendChild(tocNav);
      tocSection.appendChild(tocWrap);
      sidebarNav.appendChild(tocSection);
    }
  }


  /* --- Hauteurs sidebar --- */

  var sNavEl = document.getElementById('sidebar-nav');
  var sListEl = document.getElementById('sidebar-list');
  var sTocEl = sNavEl ? sNavEl.querySelector('.sidebar-toc-section') : null;
  if (sNavEl && sListEl && sTocEl) {
    var availH = window.innerHeight - 70;
    sListEl.style.maxHeight = Math.floor(availH * 0.6) + 'px';
    sListEl.style.overflowY = 'auto';
    sTocEl.style.maxHeight = Math.floor(availH * 0.4) + 'px';
  }

})();
