window.onload = () => {
  // 게시글 가져오기
  loadArticles();
};

/**
 * 작성자 : 공민영
 * 내용 : 로그인 로그아웃 시 버튼 바꾸기
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
document.addEventListener("DOMContentLoaded", function () {
  var access_token = localStorage.getItem("access_token");
  if (access_token) {
    document.getElementById("login_container").style.display = "none";
  } else {
    document.getElementById("logged_in_container").style.display = "none";
    document.getElementById("logged_out").style.display = "none";
  }
});

/**
 * 작성자 : 공민영
 * 내용 : 게시글 가져오기
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
async function getArticles() {
  const response = await fetch("http://127.0.0.1:8000/article/notice/");

  if (response.status == 200) {
    const response_json = await response.json();
    return response_json;
  } else {
    alert("게시글을 불러오는데 실패했습니다.");
  }
}

//  * 작성자 : 공민영
//  * 내용 : 게시글 작성하기
//  * 최초 작성일 : 2023.06.15
//  * 업데이트 일자 : 2023.06.15
//  */
async function postArticle() {
  const title = document.getElementById("title").value;
  // CKEditor 인스턴스를 가져옵니다.
  var content = CKEDITOR.instances.content.getData();

  const article_image = document.getElementById("notice_article_image")
    .files[0];

  const formdata = new FormData();

  formdata.append("title", title);
  formdata.append("content", content);
  if (article_image == undefined) {
    formdata.append("article_image", "");
  } else {
    formdata.append("article_image", article_image);
  }

  if (title == "" || content == "") {
    alert("제목,내용은 필수");
  } else {
    const response = await fetch(`${backend_base_url}/article/notice/`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
      body: formdata,
    });
    if (response.status == 201) {
      alert("작성완료!");
      window.location.replace("../notice.html");
    } else if (response.status == 401) {
      alert("토큰이 만료! 재로그인하세요!");
      handleLogout();
    } else {
      alert(response.statusText);
      location.reload();
    }
  }
}

/**
 * 작성자 : 공민영
 * 내용 : 게시글 상세보기 url
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
function articleDetail(articleId) {
  window.location.href = `${frontend_base_url}/notice_detail.html?article_id=${articleId}`;
}

/**
 * 작성자: 공민영
 * 내용: 방법공유 페이지에서 게시글 불러오기
 * 최초 작성일: 2023.06.20
 * 업데이트 일자: 2023.06.20
 */
async function loadArticles() {
  const articles = await getArticles();

  const articleList = $("#notice_list");

  articles.forEach((article) => {
    const newListCol = $("<div>")
      .addClass("list_col")
      .attr("onclick", `articleDetail(${article.id})`);
    const newList = $("<div>").addClass("list").attr("id", article.id);
    newListCol.append(newList);

    const newListLi = $("<li>").addClass("list_li");
    newListCol.append(newListLi);

    const newListUl = $("<ul>").addClass("list_ul");
    newListLi.append(newListUl);

    const newListId = $("<li>").addClass("list_id").text(article.id);
    newListUl.append(newListId);

    const newListTitle = $("<li>").addClass("list_title").text(article.title);
    newListUl.append(newListTitle);

    const newListUpdated = $("<li>")
      .addClass("list_updated")
      .text(timeago(article.updated_at));
    newListUl.append(newListUpdated);

    const newListNickname = $("<li>")
      .addClass("list_nickname")
      .text(article.user.nickname);
    newListUl.append(newListNickname);

    const newListHits = $("<li>").addClass("hits").text(article.hits);
    newListUl.append(newListHits);

    articleList.append(newListCol);
  });
}