/**
 * 작성자 : 마동휘
 * 내용 : 프로필 정보 가져옴
 * 최초 작성일 : 2023.06.18
 * 업데이트 일자 : 2023.06.19
 */

window.addEventListener("DOMContentLoaded", () => {
  loadProfile();
});

async function loadProfile() {
  const payload = localStorage.getItem("payload");
  const payload_parse = JSON.parse(payload);
  const nickname = document.getElementById("user-nickname");
  const profile_image = document.getElementById("user-profile_image");

  nickname.innerText = `닉네임: ${payload_parse.nickname}`;
  profile_image.src = payload_parse.profile_image;
}
