function getVisitorToken() {
  const key = "smysl_visitor_token";
  const existing = localStorage.getItem(key);
  if (existing) return existing;

  const generated = `visitor-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  localStorage.setItem(key, generated);
  return generated;
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) return null;
  return response.json();
}

export function mountArticleEngagement() {
  const root = document.getElementById("art-engage");
  if (!root || root.dataset.bound === "1") return;
  root.dataset.bound = "1";

  const likeBtn = document.getElementById("like-btn");
  const likeCount = document.getElementById("like-count");
  const likeIcon = document.getElementById("like-icon");
  const shareBtn = document.getElementById("share-btn");
  const shareLabel = document.getElementById("share-label");
  const viewsNode = document.getElementById("views-count");

  const trackViewUrl = root.dataset.trackViewUrl;
  const likeApiUrl = root.dataset.likeApiUrl;
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
  const visitorToken = getVisitorToken();

  const renderLikeState = (state) => {
    if (!state || !likeBtn || !likeCount) return;

    const liked = Boolean(state.liked);
    likeBtn.classList.toggle("is-liked", liked);
    likeCount.textContent = String(state.likes_count || 0);
    if (likeIcon) likeIcon.style.fill = liked ? "currentColor" : "none";
  };

  if (trackViewUrl && viewsNode) {
    fetchJson(trackViewUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
        "Accept": "application/json"
      },
      credentials: "same-origin"
    })
      .then((payload) => {
        if (!payload) return;
        viewsNode.textContent = `${Number(payload.views_count || 0).toLocaleString("ru-RU")} просмотров`;
      })
      .catch(() => {
        if (!viewsNode.textContent.trim()) {
          viewsNode.textContent = "0 просмотров";
        }
      });
  }

  if (likeApiUrl) {
    fetchJson(likeApiUrl, {
      headers: {
        "Accept": "application/json",
        "X-Visitor-Token": visitorToken
      }
    }).then((payload) => renderLikeState(payload?.data));

    likeBtn?.addEventListener("click", async () => {
      const isLiked = likeBtn.classList.contains("is-liked");
      const method = isLiked ? "DELETE" : "POST";
      const payload = await fetchJson(likeApiUrl, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
          "X-Visitor-Token": visitorToken,
          "Accept": "application/json"
        },
        credentials: "same-origin"
      });

      if (payload?.data) renderLikeState(payload.data);
    });
  }

  shareBtn?.addEventListener("click", async () => {
    const url = window.location.href;
    const title = document.title;

    if (navigator.share) {
      try {
        await navigator.share({ title: title, url: url });
        return;
      } catch (_error) {
        // User canceled the share sheet.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
    } catch (_error) {
      const area = document.createElement("textarea");
      area.value = url;
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      document.body.removeChild(area);
    }

    if (shareLabel) {
      const oldLabel = shareLabel.textContent;
      shareLabel.textContent = "Ссылка скопирована";
      setTimeout(() => {
        shareLabel.textContent = oldLabel;
      }, 1600);
    }
  });
}
