const frontend_base_url = "http://127.0.0.1:5500"
const backend_base_url = "http://127.0.0.1:8000"

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
