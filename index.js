async function main() {
  try {
    const userId = getUserId();
    const userInfo = await fetchUserInfo(userId);
    const view = createView(userInfo);
    displayView(view);
  } catch (error) {
    //   promiseチェーンの中で発生したエラーを受け取る
    console.error(`エラーが発生しました (${error})`);
  }
}

function fetchUserInfo(userId) {
  return fetch(
    `https://api.github.com/users/${encodeURIComponent(userId)}`
  ).then((response) => {
    if (!response.ok) {
      return Promise.reject(
        new Error(`${response.status}: ${response.statusText}`)
      );
    } else {
      // JSONオブジェクトで解決されるPromiseを返す
      return response.json();
    }
  });
}

function getUserId() {
  return document.getElementById("userId").value;
}

function createView(userInfo) {
  return escapeHTML`
    <h4>${userInfo.name} (@${userInfo.login})</h4>
    <img src="${userInfo.avatar_url}" alt="${userInfo.login}" height="100">
    <dl>
        <dt>Location</dt>
        <dd>${userInfo.location}</dd>
        <dt>Repositories</dt>
        <dd>${userInfo.public_repos}</dd>
    </dl>
    `;
}

function displayView(view) {
  const result = document.getElementById("result");
  result.innerHTML = view;
}

function escapeSpecialChars(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeHTML(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = values[i - 1];
    if (typeof value === "string") {
      return result + escapeSpecialChars(value) + str;
    } else {
      return result + String(value) + str;
    }
  });
}

// HTMLの組み立てと表示の処理をcreateView関数とdisplayView関数に分離した
// main関数を宣言し、fetchUserInfo関数が返すPromiseのエラーハンドリングを行った
// Promiseチェーンを使ってfetchUserInfo関数をリファクタリングした
// Async Function を使ってmain関数をリファクタリングした
// index.htmlに<input>タグを追加し、getUserId関数でユーザーIDを取得した
