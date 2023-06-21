window.onload = () => {
    checkAccessToken2()
    showPayload();
}

/**
 * 작성자 : 이준영
 * 내용 : 오디오 분리
 * 최초 작성일 : 2023.06.21
 */
async function separator() {
    var file = $('#audio-file_input')[0].files[0];
    var formData = new FormData();
    formData.append('file', file);

    try {
        $('#loadingSpinner').show();
        $('#uploadBtn').prop('disabled', true);

        const response = await fetch(`${backend_base_url}/separator/`, {
            method: 'POST',
            headers: {
                "Authorization": 'Bearer ' + localStorage.getItem("access_token")
            },
            body: formData
        });
        if (response.ok) {
            const data = await response.json();

            $('#vocals-audio').attr('src', data.files.vocals).css('display', 'block').prop('volume', 0.1).prop('preload', 'metadata');
            $('#accompaniment-audio').attr('src', data.files.accompaniment).css('display', 'block').prop('volume', 0.1).prop('preload', 'metadata');

            $('#vocals-download').removeClass('disabled');
            $('#accompaniment-download').removeClass('disabled');

            $('.vocals-container').show();
            $('.accompaniment-container').show();
        } else if (response.status === 400) {
            console.log('파일 업로드 실패');
            console.log('Bad Request: 잘못된 요청입니다.');
            alert('잘못된 요청입니다.');
        } else if (response.status === 401) {
            console.log('파일 업로드 실패');
            console.log('Unauthorized: 인증되지 않은 요청입니다.');
            alert('토큰 만료! 재로그인해주세요!');
            handleLogout()
            window.location.href = '/login.html';
        } else if (response.status === 500) {
            console.log('파일 업로드 실패');
            console.log('Internal Server Error: 서버 내부 오류가 발생했습니다.');
            alert('서버 내부 오류가 발생했습니다. 관리자에게 문의해주세요.');
        } else {
            console.log('파일 업로드 실패');
            console.log('Unknown Error: 알 수 없는 오류가 발생했습니다.');
            alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요.');
        }
    } catch (error) {
        console.log(error);
    } finally {
        $('#loadingSpinner').hide();
    }
}

/**
 * 작성자 : 이준영
 * 내용 : 다운로드
 * 최초 작성일 : 2023.06.21
 */
function downloadFile(button) {
    var downloadLink = $(button).attr('href');
    if (downloadLink) {
        window.location.href = downloadLink;
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
