document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchHadith");
  const hadithContainer = document.getElementById("hadithList");

  let allHadith = [];
  let filteredHadith = [];

  async function loadHadith() {
    try {
      const res = await fetch("../data/hadith.json");
      const data = await res.json();

      allHadith = Array.isArray(data) ? data : (data.hadiths || []);
      filteredHadith = [...allHadith];

      renderHadith();
    } catch (error) {
      console.error("Hadith load error:", error);
      if (hadithContainer) {
        hadithContainer.innerHTML = "<p style='color:red;'>Hadith data load nahi ho saka.</p>";
      }
    }
  }

  function renderHadith() {
    if (!hadithContainer) return;

    hadithContainer.innerHTML = "";

    filteredHadith.forEach((item) => {
      const card = document.createElement("div");
      card.className = "card hadith-card";

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
        const text = `
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

        try {
          await navigator.clipboard.writeText(text);
          alert("Hadith copied!");
        } catch (err) {
          console.error("Copy failed:", err);
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

      hadithContainer.appendChild(card);
    });
  }

  function searchHadith(query) {
    const q = query.trim().toLowerCase();

    if (!q) {
      filteredHadith = [...allHadith];
    } else {
      filteredHadith = allHadith.filter((item) => {
        return (
          item.book.toLowerCase().includes(q) ||
          item.chapter.toLowerCase().includes(q) ||
          String(item.hadithNo).includes(q) ||
          item.grade.toLowerCase().includes(q) ||
          item.narrator.toLowerCase().includes(q) ||
          item.arabic.toLowerCase().includes(q) ||
          item.urdu.toLowerCase().includes(q) ||
          item.english.toLowerCase().includes(q) ||
          item.bookId.toLowerCase().includes(q)
        );
      });
    }

    renderHadith();
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchHadith(e.target.value);
    });
  }

  loadHadith();
});

