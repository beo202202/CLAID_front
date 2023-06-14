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
