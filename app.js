// ─────────────────────────────────────────────
// 저장·불러오기 (이 두 함수만 바꾸면 저장 장소가 바뀝니다)
// 지금은 브라우저 저장소(localStorage)에 저장 → 내 브라우저에서만 보여요.
// 6부에서 Supabase로 바꾸면 모두가 같은 글을 보게 됩니다.
// ─────────────────────────────────────────────

const STORAGE_KEY = "guestbook-entries";

// 글 목록을 최신순으로 돌려줍니다. 글 하나 = { nickname, content, created_at }
async function loadEntries() {
  const saved = localStorage.getItem(STORAGE_KEY);
  const entries = saved ? JSON.parse(saved) : [];
  return entries.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

// 글 하나를 저장합니다.
async function saveEntry(nickname, content) {
  const saved = localStorage.getItem(STORAGE_KEY);
  const entries = saved ? JSON.parse(saved) : [];
  entries.push({ nickname, content, created_at: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

// ─────────────────────────────────────────────
// 화면 그리기 (여기는 바꾸지 않아도 됩니다)
// ─────────────────────────────────────────────

const form = document.getElementById("entry-form");
const nicknameInput = document.getElementById("nickname");
const contentInput = document.getElementById("content");
const list = document.getElementById("entry-list");
const count = document.getElementById("count");
const statusText = document.getElementById("status");

function formatTime(iso) {
  return new Date(iso).toLocaleString("ko-KR", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function render() {
  try {
    const entries = await loadEntries();
    list.innerHTML = "";
    count.textContent = `(${entries.length})`;
    statusText.textContent = entries.length === 0 ? "아직 남긴 글이 없어요. 첫 번째로 남겨 보세요!" : "";

    for (const entry of entries) {
      const item = document.createElement("li");

      const content = document.createElement("p");
      content.className = "content";
      content.textContent = entry.content;

      const meta = document.createElement("p");
      meta.className = "meta";
      meta.textContent = `${entry.nickname} · ${formatTime(entry.created_at)}`;

      item.append(content, meta);
      list.append(item);
    }
  } catch (error) {
    console.error(error);
    statusText.textContent = "글을 불러오지 못했어요.";
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const nickname = nicknameInput.value.trim();
  const content = contentInput.value.trim();
  if (!nickname || !content) return;

  const button = form.querySelector("button");
  button.disabled = true;
  try {
    await saveEntry(nickname, content);
    contentInput.value = "";
    await render();
  } catch (error) {
    console.error(error);
    alert("저장하지 못했어요. 잠시 후 다시 시도해 주세요.");
  } finally {
    button.disabled = false;
  }
});

render();
