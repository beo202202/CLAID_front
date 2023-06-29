$(document).on("headerLoaded", function () {
    loginChanger();
    showPayload()
});


const frontend_base_url = "http://127.0.0.1:5500"
const backend_base_url = "http://127.0.0.1:8000"
// const frontend_base_url = "https://claid.kr"
// const backend_base_url = "https://cdn.claid.kr"

/**
 * 작성자 : 이준영
 * 내용 : 상대시간을 동적으로 해주는 함수
 * 최초 작성일 : 2023.06.17
 * 관련 링크 : https://beolog.tistory.com/125
 */
function timeago(date) {
    var t = new Date(date);
    var seconds = Math.floor((new Date() - t.getTime()) / 1000);
    if (seconds > 86400) return t.toISOString().substring(0, 10);
    if (seconds > 3600) return Math.floor(seconds / 3600) + "시간 전";
    if (seconds > 60) return Math.floor(seconds / 60) + "분 전";
    return "방금";
}

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
 * 내용 : 로그인 로그아웃 시 버튼 바꾸기
 * 최초 작성일 : 2023.06.15
 * 수정자 : 이준영
 * 수정 내용 :유동 header로 인해 제이쿼리로 바꿈
 * 업데이트 일자 : 2023.06.23
 */
function loginChanger() {
    var access_token = localStorage.getItem('access_token');
    if (access_token) {
        $('#login_container').hide();
    } else {
        $('#logged_in_container').hide();
        $('#logged_out').hide();
    }
};

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
 * 수정자 : 이준영
 * 수정내용 : base.js로 통합 및 header 로딩 후 실행되도록 변경
 * 업데이트 일자 : 2023.06.29
 */
async function showPayload() {
    const payload = localStorage.getItem("payload");
    if (payload) {
        const payload_parse = JSON.parse(payload);

        $("#intro").text(payload_parse.nickname);
    }
}