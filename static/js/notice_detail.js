window.onload = () => {
    getArticleDetail()
    showPayload();
    setButtonVisibility();
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

    $("#notice_detail_title").text(response.title);
    $("#notice_detail_content").html(response.content);
    $("#nickname").text(response.user.nickname);
    $("#detail_created_at").text(timeago(response.created_at));
    $("#detail_updated_at").text(timeago(response.updated_at));

    const articleImage = $("#notice_detail_image");
    // const newImage = $("<img>").attr("src", response.article_image ? `${backend_base_url}${response.article_image}` : "../static/img/default.PNG").addClass("notice_img_size");
    // articleImage.empty().append(newImage);
    articleImage.empty();
}

/**
 * 작성자 : 공민영
 * 내용 : 디테일뷰 가져오기
 * 최초 작성일 : 2023.06.15
 * 수정자 : 이준영
 * 업데이트 내용 : 한글 알람으로 변경
 * 업데이트 일자 : 2023.06.18
 */
async function getArticle(articleId) {
    const response = await fetch(`${backend_base_url}/article/notice/${articleId}/`,
    )
    if (response.status == 200) {
        response_json = await response.json();
        return response_json;
    } else {
        alert("잘못된 요청입니다.");
    }
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
 * 작성자: 공민영
 * 내용: 게시글 수정 폼으로 변경
 * 최초 작성일: 2023.06.15
 * 수정자: 이준영 > 공민영
 * 수정 내용: (이준영)수정 기능이 작동되지 않고 세부적인 것을 create를 따르도록
 *  수정 내용: (공민영)수정 버튼 눌렀을 때 삭제버튼이 취소버튼으로 변경
 * 업데이트 일자: 2023.06.18
 */
function putArticle() {
    const elements = {
        title: $("#notice_detail_title"),
        content: $("#notice_detail_content"),
        image: $("#notice_detail_image"),
    };

    const { title, content, image } = elements;

    title.html(
        `<br>
        <input type="text" id="edit_notice_title" maxlength="30" placeholder="title(30자 이내)" value="${title.text()}">`
    );

    content.html(
        `<br>
        <div class="ck_content" id="edit_notice_content">
        <script>CKEDITOR.replace('edit_notice_content')</script>
        ${content.html()}
        </div>`
    );

    // const imagePreview = $("<img>").addClass("preview_image");
    const imageInput = $("<input>").attr({
        type: "file",
        class: "notice_detail_one_file",
        name: "article_image",
        id: "article_image",
        accept: "image/*"
    })
    // }).on("change", showPreviewImage);

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

    // image.html("").append(imagePreview, imageInput);
    image.html("").append(imageInput);

    $("#edit_button").hide();
    $("#save_button").show();
    $("#delete_button").hide();
    $("#cancel_button").show();
}

function cancelEditedArticle() {
    location.reload();
}

// /**
//  * 작성자 : 이준영
//  * 내용 : 이미지 미리보기
//  * 최초 작성일 : 2023.06.17
//  * 수정 내용 : 이미지 선택 해제 시 미리보기 삭제
//  * 업데이트 일 : 2023. 06.17
//  */
// function showPreviewImage(event) {
//     if (event.target.files.length > 0) {
//         var file = event.target.files[0];
//         var fileSize = file.size / 1024; // 파일 크기를 KB 단위로 계산
//         if (fileSize <= 300) {
//             var src = URL.createObjectURL(file);
//             $('.detail_one_file').css({
//                 'background-image': 'url(' + src + ')',
//                 'background-size': 'cover',
//                 'background-position': 'center',
//                 'background-repeat': 'no-repeat'
//             });
//         } else {
//             alert('이미지 파일 크기는 300KB 이하여야 합니다.');
//             $('#article_image').val('');
//             $('.detail_one_file').css('background-image', 'none');
//         }
//     } else {
//         $('.detail_one_file').css({
//             'background-image': 'none',
//             'background-size': 'auto',
//             'background-position': 'unset',
//             'background-repeat': 'unset'
//         });
//     }
// }

/**
 * 작성자: 공민영
 * 내용: 수정 후 저장 버튼 클릭 시 호출
 * 최초 작성일: 2023.06.15
 * 수정자: 이준영
 * 업데이트 내용: 업데이트 되게 수정, PUT > PATCH, Fetch > JQuery Ajax Request
 * 업데이트 일자: 2023.06.18
 */
function saveEditedArticle(articleId) {
    const editedTitle = $("#edit_notice_title").val();
    // CKEditor 인스턴스를 가져옵니다.
    var editedContent = CKEDITOR.instances.edit_notice_content.getData();
    const editedImage = $("#article_image").prop("files")[0];

    const formdata = new FormData();
    formdata.append("title", editedTitle);
    formdata.append("content", editedContent);
    if (editedImage !== undefined) {
        formdata.append("article_image", editedImage);
    }

    $.ajax({
        type: "PATCH",
        url: `${backend_base_url}/article/notice/${articleId}/`,
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        data: formdata,
        processData: false,
        contentType: false,
        dataType: "json",
        success: function (response) {
            alert("수정이 완료되었습니다.");
            saveEdited();
            window.location.href = `${frontend_base_url}/notice_detail.html?article_id=${articleId}`;
        },
        error: function (xhr, status, error) {
            if (xhr.status === 401) {
                alert("토큰 만료! 재로그인하세요!");
                handleLogout();
            } else if (xhr.status === 403) {
                alert("본인 게시글만 수정 가능합니다.");
            } else {
                alert("잘못된 요청입니다.");
            }
        }
    });
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
        const response = await fetch(`${backend_base_url}/article/notice/${articleId}/`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${access_token}`
            },
        });
        if (response.status == 204) {
            alert("삭제가 완료되었습니다.");
            window.location.replace('notice.html');
        } else if (response.status == 401) {
            alert("토큰 만료! 재로그인하세요!");
            handleLogout();
        } else {
            alert("잘못된 요청입니다.");
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
document.addEventListener('DOMContentLoaded', function () {
    var access_token = localStorage.getItem('access_token');
    if (access_token) {
        document.getElementById('login_container').style.display = 'none';
    } else {
        document.getElementById('logged_in_container').style.display = 'none';
        document.getElementById('logged_out').style.display = 'none';
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