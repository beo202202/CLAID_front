var access_token = localStorage.getItem('access_token');

// 카카오 로그인 ###############################################
function loginWithKakao() {
    /**
     * 작성자 : 이준영
     * 내용 : kakao_code 가져오고 임시 주소로 이동.
     * 최초 작성일 : 2023.06.14
     * 업데이트일 : 2023.06.16
     */
    access_token || Kakao.Auth.authorize({
        redirectUri: `${frontend_base_url}/temp.html`,
    });
}
