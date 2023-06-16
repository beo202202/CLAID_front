console.log('detail');
/**
 * 작성자 : 공민영
 * 내용 : 게시글 아이디 가져오기
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
function getArticleIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("article_id");
}

/**
 * 작성자 : 공민영
 * 내용 : 게시글 상세보기
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
window.onload = async function () {
    const response = await getArticle(getArticleIdFromUrl());
    console.log(response);

    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload);
    console.log(payload_parse);

    setButtonVisibility()
    showName()

    const articleTitle = document.getElementById("detail_title");
    const articleImage = document.getElementById("detail_image");
    const articleContent = document.getElementById("detail_content");
    const articleSong = document.getElementById("detail_song");
    const articleCreatedAt = document.getElementById("detail_created_at");
    const articleUpdatedAt = document.getElementById("detail_updated_at");
    const articleNickname = document.getElementById("nickname");

    articleTitle.innerText = response.title;
    articleContent.innerText = response.content;
    articleSong.innerText = response.song;
    articleCreatedAt.innerText = response.created_at;
    articleUpdatedAt.innerText = response.updated_at;
    articleNickname.innerText = payload_parse.nickname;

    const newImage = document.createElement("img");
    if (response.article_image) { // 이미지가 있을 때
        newImage.setAttribute("src", `${backend_base_url}${response.article_image}`);
    } else { // 이미지가 없을 때
        newImage.setAttribute("src", "default.PNG");
    }
    newImage.setAttribute("class", "img_size");
    articleImage.appendChild(newImage);
}


/**
 * 작성자 : 공민영
 * 내용 : 디테일뷰 가져오기
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
async function getArticle(articleId) {
    const response = await fetch(`${backend_base_url}/article/${articleId}/`,
    )
    if (response.status == 200) {
        response_json = await response.json();
        return response_json;
    } else {
        alert(response.statusText);
    }

}


/**
 * 작성자 : 공민영
 * 내용 : 게시글 수정 폼으로 변경
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
function putArticle() {
    const titleElement = document.getElementById("detail_title");
    const contentElement = document.getElementById("detail_content");
    const imageElement = document.getElementById("detail_image");
    const songElement = document.getElementById("detail_song");


    const title = titleElement.textContent;
    const content = contentElement.textContent;
    const image = imageElement.textContent;
    const song = songElement.textContent;

    titleElement.innerHTML = 
    `<label for="edit_title"></label><br>
    <input type="text" id="edit_title" maxlength="20" placeholder="title(20자 이내)" value="${title}">`;
    
    contentElement.innerHTML =  
    `<label for="edit_content"></label><br>
    <textarea id="edit_content">${content}</textarea>`;

    // 이미지와 음악 파일 업로드를 위한 input 요소 추가
    imageElement.innerHTML = 
    `<label for="edit_image"></label><br>
     <input type="file" id="edit_image" value="${image ? image.name : ''}">`;

    songElement.innerHTML = 
    `<label for="edit_song">song</label>
    <input type="file" id="edit_song" value="${song ? song.name : ''}">`;
    /**
     * 작성자 : 공민영
     * 내용 : edit_button 클릭 시 save_button으로 변경
     * 최초 작성일 : 2023.06.15
     * 업데이트 일자 : 2023.06.15
     */
    const editButton = document.getElementById("edit_button");
    const saveButton = document.getElementById("save_button");
    editButton.style.display = "none";
    saveButton.style.display = "block";
}

/**
 * 작성자 : 공민영
 * 내용 : 수정 후 저장 버튼 클릭 시 호출
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
async function saveEditedArticle(articleId) {
    console.log("수정 후 저장 눌림");
    console.log(articleId);

    const editedTitle = document.getElementById("edit_title").value;
    const editedContent = document.getElementById("edit_content").value;
    const editedImage = document.getElementById("edit_image").files[0];
    const editedSong = document.getElementById("edit_song").files[0];

    const formdata = new FormData();

    formdata.append("title", editedTitle);
    formdata.append("content", editedContent);
    formdata.append("article_image", editedImage);
    formdata.append("song", editedSong);

    let access_token = localStorage.getItem("access_token");

    const response = await fetch(`${backend_base_url}/article/${articleId}/`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${access_token}`
        },
        body: formdata
    });

    if (response.status == 200) {
        alert("수정이 완료되었습니다.");
        saveEdited();
        window.location.href = `${frontend_base_url}/article_detail.html?article_id=${articleId}`
    } else {
        alert(response.statusText);
        location.reload();
    }
}

/**
 * 작성자 : 공민영
 * 내용 : save_button 클릭 시 edit_button으로 변경
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
async function saveEdited() {
    const editButton = document.getElementById("edit_button");
    const saveButton = document.getElementById("save_button");
    editButton.style.display = "block";
    saveButton.style.display = "none";
}

/**
 * 작성자 : 공민영
 * 내용 : 내 게시글 삭제
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
async function deleteArticle(articleId) {
    console.log("deleteArticle()눌림");
    console.log(articleId);

    let access_token = localStorage.getItem("access_token");

    if (confirm("삭제하시겠습니까?")) {
        const response = await fetch(`${backend_base_url}/article/${articleId}/`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${access_token}`
            },
        });
        console.log(response.user);
        if (response.status == 204) {
            alert("삭제가 완료되었습니다.");
            window.location.replace('index.html');
        } else {
            alert(response.statusText);
        }
    }
}

/**
 * 작성자 : 공민영
 * 내용 : 내 게시글일 경우에만 수정/삭제버튼 보이기
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
async function setButtonVisibility() {
    const editButton = document.getElementById("edit_button");
    const deleteButton = document.getElementById("delete_button");

    const response = await getArticle(getArticleIdFromUrl());
    const loggedInUserId = response.user;
    console.log(loggedInUserId);

    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload);
    const articleAuthorId = payload_parse.user_id;
    console.log(articleAuthorId);
    
    if (loggedInUserId === articleAuthorId) {
        editButton.style.display = "block";
        deleteButton.style.display = "block";
    } else {
        editButton.style.display = "none";
        deleteButton.style.display = "none";
    }
}

/**
 * 작성자 : 공민영
 * 내용 : 닉네임 가져와서 보여줌
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
async function showName() {
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload);
    console.log(payload_parse);

    const intro = document.getElementById("intro");


    // payload 에서 가져온 정보를 html에 보이게하기(id 이용)
    intro.innerText = payload_parse.nickname;
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