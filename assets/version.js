/* ---------- Cherimoya SSH 版本号 ----------
   页面里所有 [data-cherimoya-version] 都填成 GitHub 上的最新版本。
   HTML 中保留一份静态版本号兜底：接口限流、断网或没跑 JS 时，
   页面照常显示，只是数字旧一点。 */
(function () {
  var REPO = 'binfenshengdai/CherimoyaSSH';
  var API = 'https://api.github.com/repos/' + REPO;
  var targets = document.querySelectorAll('[data-cherimoya-version]');

  if (!targets.length || !window.fetch) return;

  function apply(tag) {
    if (!tag) return;
    Array.prototype.forEach.call(targets, function (el) { el.textContent = tag; });
  }

  fetch(API + '/releases/latest', { headers: { Accept: 'application/vnd.github+json' } })
    .then(function (res) { return res.ok ? res.json() : null; })
    .then(function (release) {
      // 走 Release 而不是直接取 tag：这样跳过预发布和草稿，
      // 也和页面上下载按钮指向的 /releases/latest 是同一个版本。
      if (release && release.tag_name) { apply(release.tag_name); return; }

      // 仓库只打了 tag 没建 Release 时，退回 tags 接口
      return fetch(API + '/tags?per_page=1')
        .then(function (res) { return res.ok ? res.json() : null; })
        .then(function (tags) {
          if (tags && tags.length) { apply(tags[0].name); }
        });
    })
    .catch(function () { /* 保持静态版本号 */ });
})();
