var access_token = localStorage.getItem('access_token');


function loginWithKakao() {
    /**
     * 작성자 : 이준영
     * 내용 : kakao_code 가져오고 임시 주소로 이동.
     * 최초 작성일 : 2023.06.14
     */
    access_token || Kakao.Auth.authorize({
        redirectUri: `${frontend_base_url}/temp.html`,
    });
}

displayToken()
function displayToken() {
    /**
     * 작성자 : 이준영
     * 내용 : JWT Token 가져오고 보여줌.
     * 최초 작성일 : 2023.06.14
     */
    var access_token = localStorage.getItem('access_token');
    var refresh_token = localStorage.getItem('refresh_token');

    console.log(access_token || '토큰이 없습니다.');
    if (access_token) {
        $('#token-result0').text('jwt 로그인 성공');

        $('#token-result1').val(access_token);
        $('#token-result2').val(refresh_token);

    } else {
        console.log('비로그인 중')
    }
};

displayPayload()
function displayPayload() {
    /**
     * 작성자 : 이준영
     * 내용 : 페이로드를 가져옴.
     * 최초 작성일 : 2023.06.14
     */
    var payload = localStorage.getItem('payload');
    const parsedPayload = JSON.parse(payload);

    if (payload) {
        var login_type = parsedPayload.login_type;
        $('#login_type').val(login_type);
    }
}

async function kakaoLogout() {
    /**
     * 작성자 : 이준영
     * 내용 : jwt token로 카카오 access 시간 만료
     * 최초 작성일 : 2023.06.14
     */
    if (access_token == undefined) {
        alert('비로그인입니다.')
        return
    }

    // 카카오 토큰을 만료시키기
    try {
        const response = await $.ajax({
            url: `${backend_base_url}/user/kakao/logout/`,
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            },
            // data: {},
            // dataType: 'json',
        });
        alert(JSON.stringify(response));
    } catch (error) {
        console.error('HTTP 상태 코드: ', error.status);
        console.error('백엔드로부터의 응답: ', error.responseJSON);
        alert(JSON.stringify(error.responseJSON));
    }
    // JWT 토큰 삭제
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('payload');

    window.location.replace(`../kakao.html`);
}
