window.onload = () => {
  // 게시글 가져오기
  loadArticles();
  showPayload();
};

/**
 * 작성자 : 공민영
 * 내용 : 닉네임 가져와서 보여줌
 * 최초 작성일 : 2023.06.15
 * 수정자 : 이준영
 * 수정내용 : 페이로드가 없을 때 오류 뿜뿜 수정
 * showName() > showPayload()로 변경
 * 업데이트 일자 : 2023.06.17
 * 수정자 : 마동휘
 * 수정내용 : 페이로드 변수수정(닉네임을 못받아와서 출력이 안됬음)
 * 업데이트 일자 : 2023.06.19
 */
async function showPayload() {
  const payload = localStorage.getItem("payload");
  if (payload) {
    const payload_parse = JSON.parse(payload);

    $("#intro").text(payload_parse.nickname);
  }
}

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

// /**
//  * 작성자 : 공민영
//  * 내용 : 게시글 작성하기
//  * 최초 작성일 : 2023.06.15
//  * 업데이트 일자 : 2023.06.15
//  */
async function postArticle() {
  const song_info = document.getElementById("song_info").value;
  const voice = document.getElementById("song_voice").value;
  const article_image = document.getElementById("article_image").files[0];
  const song = document.getElementById("song").files[0];

  const formdata = new FormData();

  formdata.append("song_info", song_info);
  formdata.append("voice", voice);
  if (article_image == undefined) {
    formdata.append("article_image", "");
  } else {
    formdata.append("article_image", article_image);
  }
  // formdata.append('article_image', article_image);
  formdata.append("song", song);

  if (song_info == "" || voice == "" || song == null) {
    alert("제목,내용,음악파일은 필수");
  } else {
    const response = await fetch(`${backend_base_url}/article/`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
      body: formdata,
    });
    console.log(response);
    if (response.status == 201) {
      alert("작성완료!");
      window.location.replace("../index.html");
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
 * 내용 : 게시글 가져오기
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
async function getArticles() {
  const response = await fetch("http://127.0.0.1:8000/article/");

  if (response.status == 200) {
    const response_json = await response.json();
    return response_json;
  } else {
    alert("게시글을 불러오는데 실패했습니다.");
  }
}

/**
 * 작성자 : 공민영
 * 내용 : 게시글 상세보기 url
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
function articleDetail(articleId) {
  console.log(articleId);
  window.location.href = `${frontend_base_url}/article_detail.html?article_id=${articleId}`;
}

/**
 * 작성자: 공민영
 * 내용: 노래자랑 페이지에서 게시글 불러오기
 * 수정내용 : 이미지에 마우스 호버 시 나올 재생버튼 이미지 불러오기
 * 최초 작성일: 2023.06.20
 * 업데이트 일자: 2023.06.20
 */
async function loadArticles() {
  const articles = await getArticles();
  console.log(articles);

  const articleList = $("#article_list");

  articles.forEach((article) => {
    const newCol = $("<div>").addClass("col");
    const newCard = $("<div>").addClass("card").attr("id", article.id);
    newCol.append(newCard);

    const newCardBody = $("<div>")
      .addClass("card_body")
      .attr("onclick", `articleDetail(${article.id})`);
    newCard.append(newCardBody);

    const newCardTitle = $("<h4>")
      .addClass("card_song_info")
      .text("원곡정보: " + article.song_info);
    newCardBody.append(newCardTitle);

    const newCardPlay = $("<div>").addClass("card_play");
    newCard.append(newCardPlay);

    const newCardVoice = $("<div>")
      .addClass("card_voice")
      .text("목소리: " + article.voice);
    newCardBody.append(newCardVoice);

    const newCardHits = $("<div>")
      .addClass("card_voice")
      .text("조회수: " + article.hits);
    newCardBody.append(newCardHits);

    const articleImage = $("<img>").addClass("card_img_top");
    const articleImageOverlay = $("<img>").addClass("card_img_overlay").attr("src", "../static/img/play.PNG");
    if (article.article_image) {
      articleImage.attr("src", `${backend_base_url}${article.article_image}/`);
      articleImage.after(articleImageOverlay);
    } else {
      articleImage.attr("src", "../static/img/default.PNG");
      articleImage.after(articleImageOverlay);
    }
    newCardPlay.append(articleImage);
    newCardPlay.append(articleImageOverlay);

  /**
   * 작성자: 공민영
   * 내용: 이미지 클릭해서 오디오 재생/멈춤 하기
   * 최초 작성일: 2023.06.21
   * 업데이트 일자: 2023.06.21
   */
    newCardPlay.on('click', () => {
      const articleSong = newCardPlay.find('audio')[0];
      
      if (articleSong.paused) {
        articleSong.play();
      } else {
        articleSong.pause();
      }
    });

    const articleSong = $("<audio>")
      .addClass("card_file")
      .attr({
        controls: true,
        preload: true,
        id: "card_file",
        name: "media",
        src: `${backend_base_url}${article.song}`,
      })
      .prop("volume", 0.1);

    newCardPlay.append(articleSong);
    
    articleList.append(newCol);
  });
}

/**
 * 작성자 : 이준영
 * 내용 : 이미지 미리보기
 * 최초 작성일 : 2023.06.17
 * 수정 내용 : 이미지 선택 해제 시 미리보기 삭제
 * 업데이트 일 : 2023. 06.17
 */
function showPreviewImage(event) {
  if (event.target.files.length > 0) {
    var file = event.target.files[0];
    var fileSize = file.size / 1024; // 파일 크기를 KB 단위로 계산
    if (fileSize <= 300) {
      var src = URL.createObjectURL(file);
      $(".detail_one_file").css({
        "background-image": "url(" + src + ")",
        "background-size": "cover",
        "background-position": "center",
        "background-repeat": "no-repeat",
      });
    } else {
      alert("이미지 파일 크기는 300KB 이하여야 합니다.");
      $("#article_image").val("");
      $(".detail_one_file").css("background-image", "none");
    }
  } else {
    $(".detail_one_file").css({
      "background-image": "none",
      "background-size": "auto",
      "background-position": "unset",
      "background-repeat": "unset",
    });
  }
}

/**
 * 작성자 : 이준영
 * 내용 : 오디오 미리보기
 * 최초 작성일 : 2023.06.17
 * 수정 내용 : 오디오 선택 해제 시 미리보기 삭제
 * 업데이트 일 : 2023. 06.17
 */
function showPreviewAudio(event) {
  if (event.target.files.length > 0) {
    var file = event.target.files[0];
    var src = URL.createObjectURL(file);

    if (file.size <= 10 * 1024 * 1024) {
      $(".playback_bar").attr("src", src);
      $(".playback_bar").prop("volume", 0.1);
    } else {
      alert("오디오 파일의 크기는 10MB를 초과할 수 없습니다.");
      $(".playback_bar").attr("src", "");
      return;
    }
  } else {
    $(".playback_bar").attr("src", "");
  }
}

/**
 * 작성자: 공민영
 * 내용: 노래자랑 페이지에서 게시글 작성 클릭 시 모달창
 * 최초 작성일: 2023.06.20
 * 업데이트 일자: 2023.06.20
 */
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("modal");
  const openModalBtn = document.getElementById("open-modal");
  const closeModalBtn = document.getElementById("close-modal");

  // 모달창 열기
  openModalBtn.addEventListener("click", () => {
    event.preventDefault(); // 새로고침 방지
    modal.style.display = "block";
    document.body.style.overflow = "hidden"; // 스크롤바 제거
  });

  // 모달창 닫기
  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // 스크롤바 보이기
  });
});


