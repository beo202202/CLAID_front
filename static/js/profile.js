/**
 * 작성자 : 마동휘
 * 내용 : 프로필 정보 가져옴
 * 최초 작성일 : 2023.06.18
 * 업데이트 일자 : 2023.06.19
 */

window.addEventListener("DOMContentLoaded", () => {
  loadProfile();
  getPointDetail();
  loadPointHistoryList();
});

async function loadProfile() {
  const payload = localStorage.getItem("payload");
  const payload_parse = JSON.parse(payload);
  const nickname = document.getElementById("user-nickname");
  const profile_image = document.getElementById("image_profile");

  nickname.innerText = `${payload_parse.nickname}`;
  profile_image.src = payload_parse.profile_image;
}

/**
 * 작성자 : 공민영
 * 내용 : 현재 로그인 되어있는 유저 아이디 가져오기
 * 최초 작성일 : 2023.07.03
 */
function getUserIdFromUrl() {
  const payloadString = localStorage.getItem("payload");
  const payload = JSON.parse(payloadString);
  const userId = payload.user_id
  return userId
}

/**
 * 작성자 : 공민영
 * 내용 : 현재 로그인 되어있는 사용자의 포인트 정보 가져오기
 * 작성일 : 2023.07.03
 */
async function getUserPoint(userId) {
  const access_token = localStorage.getItem("access_token");
  const response = await fetch(`http://127.0.0.1:8000/user/points/${userId}/`, {
      headers: {
          'Authorization': `Bearer ${access_token}`,
      },
  });

  if (response.status == 200) {
    response_json = await response.json();
    return response_json;
  } else {
    alert("id잘못된 요청입니다.");
  }
}

/**
* 작성자 : 공민영
* 내용 : 현재 포인트 가져와서 보여주기
* 작성일 : 2023.06.15
*/
async function getPointDetail() {
  const response = await getUserPoint(getUserIdFromUrl());
  $("#user_points").text(response.points);
}

/**
 * 작성자 : 공민영
 * 내용 : 현재 로그인 된 사용자의 포인트 히스토리 가져오기
 * 작성일 : 2023.07.03
 */
async function getPointHistoryList() {
  const access_token = localStorage.getItem("access_token");
  const response = await fetch(`${backend_base_url}/user/history/`, {
    headers: {
        'Authorization': `Bearer ${access_token}`,
    },
});
  if (response.status == 200) {
    response_json = await response.json();
    return response_json;

  } else if (response.status == 403) {
    alert("관리자만 접근 가능합니다.");
  }
}

/**
* 작성자 : 공민영
* 내용 : 가져온 전체 포인트 히스토리 html에 출력
* 작성일 : 2023.07.03
*/
async function loadPointHistoryList() {

const pointHistorys = await getPointHistoryList();

  const pointHistoryList = $("#history_list");

  pointHistorys.forEach((pointHistory) => {
  const newListCol = $("<div>")
      .addClass("list_col")
  const newList = $("<div>").addClass("point_list").attr("id", pointHistory.id);
  newListCol.append(newList);

  const newListPointChange = $("<li>").addClass("list_points").text(pointHistory.point_change);
  newList.append(newListPointChange);

  const newListReason = $("<li>").addClass("list_reason").text(pointHistory.reason);
  newList.append(newListReason);

  const newListCreated = $("<li>").addClass("list_created_at").text(timeago(pointHistory.created_at));
  newList.append(newListCreated);

  pointHistoryList.append(newListCol);
  });
}

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