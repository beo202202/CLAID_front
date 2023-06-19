window.onload = () => {
    // 게시글 가져오기
    loadArticles();
    showPayload();
}

/**
 * 작성자 : 공민영
 * 내용 : 닉네임 가져와서 보여줌
 * 최초 작성일 : 2023.06.15
 * 최종 수정자 : 이준영
 * 수정내용 : 페이로드가 없을 때 오류 뿜뿜 수정
 * showName() > showPayload()로 변경
 * 업데이트 일자 : 2023.06.17
 */
async function showPayload() {
    const payload = localStorage.getItem("payload");
    if (payload) {
        const payload_parse = JSON.parse(payload);
        console.log(payload_parse);

        $("#intro").text(payload.nickname);
    }
}

/**
 * 작성자 : 공민영
 * 내용 : 로그인 로그아웃 시 버튼 바꾸기
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
document.addEventListener('DOMContentLoaded', function () {
    var access_token = localStorage.getItem('access_token');
    if (access_token) {
        document.getElementById('login_container').style.display = 'none';
    } else {
        document.getElementById('logged_in_container').style.display = 'none';
    }
});

/**
 * 작성자 : 공민영
 * 내용 : 로그아웃
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("payload");
    location.reload();
}

/**
 * 작성자 : 공민영
 * 내용 : 게시글 작성하기
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
async function postArticle() {
    console.log("게시글 작성 눌림");
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const article_image = document.getElementById("article_image").files[0];
    const song = document.getElementById("song").files[0];

    const formdata = new FormData();

    formdata.append('title', title);
    formdata.append('content', content);
    formdata.append('article_image', article_image);
    formdata.append('song', song);

    let access_token = localStorage.getItem("access_token");

    const response = await fetch(`${backend_base_url}/article/`, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${access_token}`
        },
        body: formdata
    })
    if (title == "" || content == "" || song == null) {
        alert("제목,내용,음악파일은 필수");
        location.reload();
    } else if (article_image == null) {
        formdata.append('article_image', '');
    } else {
        if (response.status == 201) {
            alert("작성완료!");
            window.location.replace('index.html');
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
    const response = await fetch('http://127.0.0.1:8000/article/');

    if (response.status == 200) {
        const response_json = await response.json();
        return response_json
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
    window.location.href = `${frontend_base_url}/article_detail.html?article_id=${articleId}`
}

/**
 * 작성자: 공민영
 * 내용: 인덱스 페이지에서 게시글 불러오기
 * 최초 작성일: 2023.06.15
 * 최종 수정자: 이준영 > 공민영
 * 수정 내용 : (이준영) 오디오 불러오기, 오디오 재생 기능 구현
 * 수정 내용 : (공민영) html의 #article_list 삭제 후 db에 저장되어있는 게시글만 보이기
 * 업데이트 일자: 2023.06.19
 */
async function loadArticles() {
    const articles = await getArticles();
    console.log(articles);

    const articleList = $("#article_list");
    $('#article_list').empty()
    articles.forEach(article => {
        const newCol = $("<div>").addClass("col").attr("onclick", `articleDetail(${article.id})`);
        const newCard = $("<div>").addClass("card").attr("id", article.id);
        newCol.append(newCard);

        const newCardBody = $("<div>").addClass("card_body");
        newCard.append(newCardBody);

        const newCardTitle = $("<h4>").addClass("card_title").text(article.title);
        newCardBody.append(newCardTitle);

        const newCardPlay = $("<div>").addClass("card_play");
        newCard.append(newCardPlay);

        const articleImage = $("<img>").addClass("card_img_top");
        if (article.article_image) {
            articleImage.attr("src", `${backend_base_url}${article.article_image}/`);
        } else {
            articleImage.attr("src", "../static/img/default.PNG");
        }
        newCardPlay.append(articleImage);

        const articleSong = $("<audio>").addClass("card_file").attr({
            controls: true,
            preload: true,
            "id": "card_file",
            "name": "media",
            "src": `${backend_base_url}${article.song}`
        }).prop("volume", 0.1);

        newCardPlay.append(articleSong);
        articleList.append(newCol);
    });
}


//작성 이미지 미리보기
function showPreview(event) {
    if (event.target.files.length > 0) {
        var src = URL.createObjectURL(event.target.files[0]);
        var preview = document.getElementById("preview");
        preview.src = src;
        preview.style.display = "block";
    }
}

/**
 * 작성자 : 공민영
 * 내용 : 로그인 로그아웃 시 버튼 바꾸기
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
document.addEventListener('DOMContentLoaded', function () {
    var access_token = localStorage.getItem('access_token');
    if (access_token) {
        document.getElementById('login_container').style.display = 'none';
    } else {
        document.getElementById('logged_in_container').style.display = 'none';
    }
});

/**
 * 작성자 : 공민영
 * 내용 : 로그아웃
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("payload");
    location.reload();
}
