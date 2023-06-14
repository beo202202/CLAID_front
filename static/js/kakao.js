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

async function requestUserInfo() {
    sns_id = 2824936242;
    /**
     * 작성자 : 이준영
     * 내용 : 2824936242의 정보를 가져옴. test 함수로 이 함수를 활용할 예정
     * 최초 작성일 : 2023.06.14
     */
    await fetch(`${backend_base_url}/user/kakao/${sns_id}/`, {
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP status ' + response.status);
            }
            return response.json();
        })
        .then(response => {
            alert(JSON.stringify(response));
        })
        .catch(error => {
            console.error('HTTP 상태 코드: ', error.message);
            alert(error.message);
        });
}

async function kakaoUnLink() {
    /**
     * 작성자 : 이준영
     * 내용 : 카카오 연결 끊기, DB 삭제는 안함
     * 최초 작성일 : 2023.06.14
     */
    if (access_token == undefined) {
        alert('비로그인입니다.')
        return
    }
    await fetch(`${backend_base_url}/user/kakao/unlink/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
    })
        .then(response => {
            if (response.status === 200) {
                return response.json().then(data => {
                    alert(data.message);
                });
            } else {
                return response.json().then(data => {
                    alert(data.message);
                    throw new Error('Server response: ' + data.message);
                });
            }
        });
    // JWT 토큰 삭제
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('payload');

    window.location.replace(`../kakao.html`);
}

// 통합 시 넣기?
function requestJWTUserInfo() {

}