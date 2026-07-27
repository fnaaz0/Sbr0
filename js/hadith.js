document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchHadith");
  const hadithContainer = document.getElementById("hadithList");

  let allHadith = [];
  let filteredHadith = [];
  let searchTimer = null;

  function flattenValue(value) {
    if (value === null || value === undefined) return "";
    if (Array.isArray(value)) return value.map(flattenValue).join(" ");
    if (typeof value === "object") return Object.values(value).map(flattenValue).join(" ");
    return String(value);
  }

  const normalizeText = (value = "") =>
    flattenValue(value)
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\u0600-\u06FF\u0900-\u097F]+/g, " ")
      .trim()
      .replace(/\s+/g, " ");

  function buildSearchBlob(item) {
    return [
      item.book,
      item.bookArabic,
      item.bookId,
      item.chapter,
      item.chapterArabic,
      item.chapterNo,
      item.hadithNo,
      item.grade,
      item.narrator,
      item.reference,
      item.source,
      item.arabic,
      item.urdu,
      item.hindi,
      item.english,
      item.keywords
    ]
      .map(normalizeText)
      .join(" ");
  }

  async function loadHadith() {
    const fallbackHadith = [
      {
        id: 1,
        book: "Sahih al-Bukhari",
        bookId: "Bukhari",
        chapter: "Revelation",
        chapterNo: 1,
        hadithNo: 1,
        grade: "Sahih",
        narrator: "Umar ibn Al-Khattab (RA)",
        reference: "Sahih al-Bukhari, Book 1, Hadith 1",
        source: "Sahih al-Bukhari",
        arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ",
        urdu: "اعمال کا دار و مدار نیتوں پر ہے۔",
        hindi: "कर्मों का आधार नीयत पर है।",
        english: "Actions are judged by intentions.",
        keywords: ["niyat", "intention", "bukhari", "actions"]
      },
      {
        id: 2,
        book: "Sahih al-Bukhari",
        bookId: "Bukhari",
        chapter: "Faith",
        chapterNo: 2,
        hadithNo: 8,
        grade: "Sahih",
        narrator: "Ibn Umar (RA)",
        reference: "Sahih al-Bukhari, Book 2, Hadith 8",
        source: "Sahih al-Bukhari",
        arabic: "بُنِيَ الإِسْلَامُ عَلَى خَمْسٍ",
        urdu: "اسلام کی بنیاد پانچ چیزوں پر ہے۔",
        hindi: "इस्लाम की बुनियाद पाँच चीज़ों पर है।",
        english: "Islam is built on five pillars.",
        keywords: ["islam", "five pillars", "bukhari"]
      },
      {
        id: 3,
        book: "Sahih Muslim",
        bookId: "Muslim",
        chapter: "Purification",
        chapterNo: 1,
        hadithNo: 223,
        grade: "Sahih",
        narrator: "Abu Hurairah (RA)",
        reference: "Sahih Muslim, Book 1, Hadith 223",
        source: "Sahih Muslim",
        arabic: "الطُّهُورُ شَطْرُ الإِيمَانِ",
        urdu: "پاکیزگی ایمان کا آدھا حصہ ہے۔",
        hindi: "पाकीज़गी ईमान का आधा हिस्सा है।",
        english: "Purification is half of faith.",
        keywords: ["purification", "faith", "muslim"]
      }
    ];

    try {
      const url = new URL("../data/hadith.json", window.location.href).href;
      const res = await fetch(url, { cache: "no-store" });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      allHadith = Array.isArray(data) ? data : (data.hadiths || []);
    } catch (error) {
      console.error("Hadith load error:", error);
      allHadith = fallbackHadith;
    }

    filteredHadith = [...allHadith];
    renderHadith();
  }

  function buildHadithText(item) {
    return `
Book: ${item.book}
Chapter: ${item.chapter}
Hadith No: ${item.hadithNo}
Grade: ${item.grade}
Narrator: ${item.narrator}
Reference: ${item.reference || "N/A"}
Source: ${item.source || "N/A"}

Arabic:
${item.arabic || ""}

Urdu:
${item.urdu || ""}

Hindi:
${item.hindi || ""}

English:
${item.english || ""}
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
      <h2>📚 ${item.book || "Hadith"}</h2>
      <p><strong>Chapter:</strong> ${item.chapter || "N/A"} (${item.chapterNo || "N/A"})</p>
      <p><strong>Hadith No:</strong> ${item.hadithNo || "N/A"}</p>
      <p><strong>Grade:</strong> ${item.grade || "N/A"}</p>
      <p><strong>Narrator:</strong> ${item.narrator || "N/A"}</p>
      <p><strong>Reference:</strong> ${item.reference || "N/A"}</p>
      <p><strong>Source:</strong> ${item.source || "N/A"}</p>

      <div class="hadith-box">
        <p><strong>Arabic:</strong></p>
        <p class="arabic-text">${item.arabic || ""}</p>

        <p><strong>Urdu:</strong></p>
        <p>${item.urdu || ""}</p>

        <p><strong>Hindi:</strong></p>
        <p>${item.hindi || ""}</p>

        <p><strong>English:</strong></p>
        <p>${item.english || ""}</p>
      </div>

      <div class="hadith-actions">
        <button class="copy-btn">📋 Copy</button>
        <button class="share-btn">📤 Share</button>
      </div>
    `;

    const copyBtn = card.querySelector(".copy-btn");
    const shareBtn = card.querySelector(".share-btn");

    copyBtn.addEventListener("click", async () => {
      const ok = await copyToClipboard(buildHadithText(item));
      alert(ok ? "Hadith copied!" : "Copy nahi hua.");
    });

    shareBtn.addEventListener("click", async () => {
      const shareText = `
${item.book || "Hadith"}
Chapter: ${item.chapter || "N/A"}
Hadith No: ${item.hadithNo || "N/A"}

${item.english || ""}
      `.trim();

      try {
        if (navigator.share) {
          await navigator.share({
            title: item.book || "Hadith",
            text: shareText
          });
        } else {
          alert("Share feature is not supported on this device.");
        }
      } catch (err) {
        if (err && err.name !== "AbortError") {
          console.error("Share failed:", err);
        }
      }
    });

    return card;
  }

  function renderHadith() {
    if (!hadithContainer) return;

    hadithContainer.innerHTML = "";

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
    filteredHadith.forEach((item) => {
      fragment.appendChild(createHadithCard(item));
    });
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
    searchInput.addEventListener("input", (e) => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        searchHadith(e.target.value);
      }, 150);
    });
  }

  loadHadith();
});
