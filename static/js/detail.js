window.onload = () => {
    getArticleDetail()
    showPayload();
    setButtonVisibility();
}

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
 * 최종 수정자 : 이준영
 * 수정 내용 : 너무 많은 코드를 JQuery로 간단히 변경, DB 오디오 연결
 * 일부 playload함수로 이동, nickname 오류 수정
 * 작성시간, 업데이트시간을 상대적이게 표현
 * 업데이트 일자 : 2023.06.17
 */
async function getArticleDetail() {
    const response = await getArticle(getArticleIdFromUrl());

    $("#detail_title").text(response.title);
    $("#detail_content").text(response.content);
    $("#playback_bar").attr("src", backend_base_url + response.song);
    $(".playback_bar").prop("volume", 0.1);
    $("#nickname").text(response.user.nickname);
    $("#detail_created_at").text(timeago(response.created_at));
    $("#detail_updated_at").text(timeago(response.updated_at));

    const articleImage = $("#detail_image");
    const newImage = $("<img>").attr("src", response.article_image ? `${backend_base_url}${response.article_image}` : "../static/img/default.PNG").addClass("img_size");
    articleImage.empty().append(newImage);
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
 * 작성자: 공민영
 * 내용: 게시글 수정 폼으로 변경
 * 최초 작성일: 2023.06.15
 * 수정자: 이준영
 * 수정 내용: 수정 기능이 작동되지 않고 세부적인 것을 create를 따르도록
 * 업데이트 일자: 2023.06.18
 */
function putArticle() {
    const elements = {
        title: $("#detail_title"),
        content: $("#detail_content"),
        image: $("#detail_image"),
        song: $("#detail_song")
    };

    const { title, content, image, song } = elements;

    title.html(
        `<br>
        <input type="text" id="edit_title" maxlength="20" placeholder="title(20자 이내)" value="${title.text()}">`
    );

    content.html(
        `<br>
        <textarea id="edit_content">${content.text()}</textarea>`
    );

    const imagePreview = $("<img>").addClass("preview_image");
    const imageInput = $("<input>").attr({
        type: "file",
        class: "detail_one_file",
        name: "article_image",
        id: "article_image",
        accept: "image/*"
    }).on("change", showPreviewImage);

    const imageSrc = image.find('img').attr('src');
    if (imageSrc) {
        imageInput.css({
            'background-image': `url('${imageSrc}')`,
            'background-size': 'cover',
            'background-position': 'center',
            'background-repeat': 'no-repeat'
        });
    } else {
        imageInput.css('background-image', 'none');
    }

    image.html("").append(imagePreview, imageInput);

    const audioSrc = song.find('audio').attr('src')
    const audioPreview = $("<audio>").addClass("playback_bar").attr({
        controls: "",
        id: "playback_bar",
        name: "media",
        src: `${audioSrc}`
    });

    const audioInput = $("<input>").attr({
        type: "file",
        name: "song",
        id: "song",
        accept: "audio/mp3, audio/wav, audio/ogg"
    }).on("change", showPreviewAudio);

    const audioDescript = $("<div>").attr("style", "color: gray; font-size: 15px;").text("mp3 wav ogg 파일만 업로드 가능합니다")

    if (audioSrc) {
        audioPreview.attr("src", `${audioSrc}`).prop('volume', 0.1);
    }

    song.html("").append(audioPreview, audioInput, audioDescript);

    $("#edit_button").hide();
    $("#save_button").show();
}

/**
 * 작성자 : 공민영
 * 내용 : 수정 후 저장 버튼 클릭 시 호출
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
async function saveEditedArticle(articleId) {
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
    let access_token = localStorage.getItem("access_token");

    if (confirm("삭제하시겠습니까?")) {
        const response = await fetch(`${backend_base_url}/article/${articleId}/`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${access_token}`
            },
        });
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
 * 최종 수정자 : 이준영
 * 수정 내용 : 함수가 잘 작동하게 수정함.
 * 업데이트 일자 : 2023.06.17
 */
async function setButtonVisibility() {
    const editButton = $("#edit_button");
    const deleteButton = $("#delete_button");

    const response = await getArticle(getArticleIdFromUrl());
    const loggedInUserId = response.user.pk;

    const payload = localStorage.getItem("payload");
    if (payload) {
        const payload_parse = JSON.parse(payload);
        const articleAuthorId = payload_parse.user_id;

        if (loggedInUserId === articleAuthorId) {
            editButton.show();
            deleteButton.show();
        } else {
            editButton.hide();
            deleteButton.hide();
        }
    } else {
        editButton.hide();
        deleteButton.hide();
    }
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
            $('.detail_one_file').css({
                'background-image': 'url(' + src + ')',
                'background-size': 'cover',
                'background-position': 'center',
                'background-repeat': 'no-repeat'
            });
        } else {
            alert('이미지 파일 크기는 300KB 이하여야 합니다.');
            $('#article_image').val('');
            $('.detail_one_file').css('background-image', 'none');
        }
    } else {
        $('.detail_one_file').css({
            'background-image': 'none',
            'background-size': 'auto',
            'background-position': 'unset',
            'background-repeat': 'unset'
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
            $('.playback_bar').attr('src', src);
            $('.playback_bar').prop('volume', 0.1);
        }
        else {
            alert("오디오 파일의 크기는 10MB를 초과할 수 없습니다.");
            $('.playback_bar').attr('src', '');
            return;
        }
    } else {
        $('.playback_bar').attr('src', '');
    }
}
