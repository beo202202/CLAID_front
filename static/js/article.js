window.onload = () => {
    checkAccessToken2()
    showPayload();
}

/**
 * 작성자 : 공민영
 * 내용 : 게시글 작성하기
 * 최초 작성일 : 2023.06.15
 * 최종 수정자 : 이준영
 * 수정내용 : 1. 작성완료 시 오류 나면 초기화하는 문제
 * => 전송요청 후 체크가 아니라 체크 후 전송하도록 바꿈.
 * 2. 이미지 파일이 올라가지 않는 문제 해결
 * 업데이트 일자 : 2023.06.17
 */
async function postArticle() {
    console.log("게시글 작성 눌림");
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const article_image = document.getElementById("article_image").files[0];

    console.log(article_image);
    const song = document.getElementById("song").files[0];

    const formdata = new FormData();

    formdata.append('title', title);
    formdata.append('content', content);
    if (article_image == undefined) {
        formdata.append('article_image', '');
    } else {
        formdata.append('article_image', article_image);
    }
    // formdata.append('article_image', article_image);
    formdata.append('song', song);

    if (title == "" || content == "" || song == null) {
        alert("제목,내용,음악파일은 필수");
    } else {
        const response = await fetch(`${backend_base_url}/article/`, {
            method: 'POST',
            headers: {
                "Authorization": 'Bearer ' + localStorage.getItem("access_token")
            },
            body: formdata
        })
        if (response.status == 201) {
            alert("작성완료!");
            window.location.replace('../index.html');
        } else {
            alert(response.statusText);
            location.reload();
        }
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
 * 작성자 : 이준영
 * 내용 : 토큰 체크2
 * 최초 작성일 : 2023.06.17
 */
function checkAccessToken2() {
    var access_token = localStorage.getItem('access_token');
    if (!access_token) {
        alert('로그인 하셔야 됩니다.')
        window.location.replace(`../login.html`);
    }
};

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
    }
}
