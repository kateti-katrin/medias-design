(function () {
  function toInt(value) {
    var parsed = parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function initArticleMetrics() {
    var root = document.querySelector('[data-article-id]');
    if (!root) return;

    var articleId = root.getAttribute('data-article-id');
    var viewsKey = 'smysl:article:views:' + articleId;
    var likedKey = 'smysl:article:liked:' + articleId;

    var viewsNode = document.querySelector('[data-views-count]');
    var likeButton = document.querySelector('[data-like-button]');
    var shareButton = document.querySelector('[data-share-button]');
    var shareStatus = document.querySelector('[data-share-status]');

    var viewsCount = toInt(localStorage.getItem(viewsKey)) + 1;
    localStorage.setItem(viewsKey, String(viewsCount));
    if (viewsNode) viewsNode.textContent = String(viewsCount);

    function renderLikeState() {
      var isLiked = localStorage.getItem(likedKey) === '1';
      if (!likeButton) return;

      likeButton.setAttribute('aria-pressed', isLiked ? 'true' : 'false');
      likeButton.classList.toggle('is-active', isLiked);

      var icon = likeButton.querySelector('[data-like-icon]');
      if (icon) {
        icon.textContent = isLiked ? '♥' : '♡';
      }

      var label = likeButton.querySelector('[data-like-label]');
      if (label) {
        label.textContent = isLiked ? 'Вам нравится' : 'Нравится';
      }
    }

    if (likeButton) {
      renderLikeState();
      likeButton.addEventListener('click', function () {
        var isLiked = localStorage.getItem(likedKey) === '1';
        localStorage.setItem(likedKey, isLiked ? '0' : '1');
        renderLikeState();
      });
    }

    if (shareButton) {
      shareButton.addEventListener('click', function () {
        var url = window.location.href;
        var title = document.title;
        var shareText = 'Материал проекта «Смысл»';
        setShareStatus('Готовим ссылку...');

        function setShareStatus(message) {
          if (shareStatus) shareStatus.textContent = message;
        }

        function fallbackCopy(text) {
          var helper = document.createElement('textarea');
          helper.value = text;
          helper.setAttribute('readonly', '');
          helper.style.position = 'fixed';
          helper.style.left = '-9999px';
          document.body.appendChild(helper);
          helper.focus();
          helper.select();

          var copied = false;
          try {
            copied = document.execCommand('copy');
          } catch (e) {
            copied = false;
          }

          document.body.removeChild(helper);
          return copied;
        }

        if (navigator.share) {
          navigator.share({
            title: title,
            text: shareText,
            url: url
          }).then(function () {
            setShareStatus('Ссылка отправлена');
          }).catch(function (error) {
            if (error && error.name === 'AbortError') {
              setShareStatus('Действие отменено');
              return;
            }
            if (fallbackCopy(url)) {
              setShareStatus('Ссылка скопирована');
              return;
            }
            setShareStatus('Не удалось поделиться');
          });
          return;
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(function () {
            setShareStatus('Ссылка скопирована');
          }).catch(function () {
            if (fallbackCopy(url)) {
              setShareStatus('Ссылка скопирована');
            } else {
              window.open(
                'https://t.me/share/url?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(shareText),
                '_blank',
                'noopener,noreferrer'
              );
              setShareStatus('Открыта форма отправки');
            }
          });
          return;
        }

        if (fallbackCopy(url)) {
          setShareStatus('Ссылка скопирована');
          return;
        }

        window.open(
          'https://t.me/share/url?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(shareText),
          '_blank',
          'noopener,noreferrer'
        );
        setShareStatus('Открыта форма отправки');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initArticleMetrics);
  } else {
    initArticleMetrics();
  }
})();
