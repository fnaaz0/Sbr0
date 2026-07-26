document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchHadith");
  const hadithContainer = document.getElementById("hadithList");

  let allHadith = [];
  let filteredHadith = [];

  async function loadHadith() {
    try {
      const res = await fetch("../data/hadith.json", { cache: "force-cache" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      allHadith = Array.isArray(data) ? data : (data.hadiths || []);
      filteredHadith = [...allHadith];
      renderHadith();
    } catch (error) {
      console.error("Hadith load error:", error);
      if (hadithContainer) {
        hadithContainer.innerHTML = `
          <div class="hadith-card">
            <h2>❌ Error</h2>
            <p>Hadith data load nahi ho saka.</p>
          </div>
        `;
      }
    }
  }

  const normalizeText = (value = "") =>
    String(value)
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\u0600-\u06FF]+/g, " ")
      .trim()
      .replace(/\s+/g, " ");

  function buildSearchBlob(item) {
    return [
      item.book,
      item.bookId,
      item.chapter,
      item.chapterNo,
      item.hadithNo,
      item.grade,
      item.narrator,
      item.arabic,
      item.urdu,
      item.english
    ]
      .map(normalizeText)
      .join(" ");
  }

  function buildHadithText(item) {
    return `
Book: ${item.book}
Chapter: ${item.chapter}
Hadith No: ${item.hadithNo}
Grade: ${item.grade}
Narrator: ${item.narrator}

Arabic:
${item.arabic}

Urdu:
${item.urdu}

English:
${item.english}
    `.trim();
  }

  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }

      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, ta.value.length);

      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch (err) {
      console.error("Copy failed:", err);
      return false;
    }
  }

  function createHadithCard(item) {
    const card = document.createElement("article");
    card.className = "hadith-card";

    card.innerHTML = `
      <h2>📚 ${item.book}</h2>
      <p><strong>Chapter:</strong> ${item.chapter} (${item.chapterNo})</p>
      <p><strong>Hadith No:</strong> ${item.hadithNo}</p>
      <p><strong>Grade:</strong> ${item.grade}</p>
      <p><strong>Narrator:</strong> ${item.narrator}</p>

      <div class="hadith-box">
        <p><strong>Arabic:</strong></p>
        <p class="arabic-text">${item.arabic}</p>

        <p><strong>Urdu:</strong></p>
        <p>${item.urdu}</p>

        <p><strong>English:</strong></p>
        <p>${item.english}</p>
      </div>

      <div class="hadith-actions">
        <button class="copy-btn">📋 Copy</button>
        <button class="share-btn">📤 Share</button>
      </div>
    `;

    const copyBtn = card.querySelector(".copy-btn");
    const shareBtn = card.querySelector(".share-btn");

    copyBtn.addEventListener("click", async () => {
      const text = buildHadithText(item);
      const ok = await copyToClipboard(text);

      if (ok) {
        alert("Hadith copied!");
      } else {
        alert("Copy nahi hua.");
      }
    });

    shareBtn.addEventListener("click", async () => {
      const shareText = `
${item.book}
Chapter: ${item.chapter}
Hadith No: ${item.hadithNo}

${item.english}
      `.trim();

      try {
        if (navigator.share) {
          await navigator.share({
            title: item.book,
            text: shareText
          });
        } else {
          alert("Share feature is not supported on this device.");
        }
      } catch (err) {
        console.error("Share failed:", err);
      }
    });

    return card;
  }

  function renderHadith() {
    if (!hadithContainer) return;

    hadithContainer.replaceChildren();

    if (!filteredHadith.length) {
      hadithContainer.innerHTML = `
        <div class="hadith-card">
          <h2>🔍 No Result</h2>
          <p>Koi hadith nahi mili.</p>
        </div>
      `;
      return;
    }

    const fragment = document.createDocumentFragment();
    filteredHadith.forEach((item) => fragment.appendChild(createHadithCard(item)));
    hadithContainer.appendChild(fragment);
  }

  function searchHadith(query) {
    const q = normalizeText(query);

    if (!q) {
      filteredHadith = [...allHadith];
    } else {
      filteredHadith = allHadith.filter((item) => {
        const blob = item.__searchBlob || (item.__searchBlob = buildSearchBlob(item));
        return blob.includes(q);
      });
    }

    renderHadith();
  }

  if (searchInput) {
    let timer = null;
    searchInput.addEventListener("input", (e) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        searchHadith(e.target.value);
      }, 150);
    });
  }

  loadHadith();
});

