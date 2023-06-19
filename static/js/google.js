
var access_token = localStorage.getItem("access_token");


document.addEventListener("DOMContentLoaded", function () {
  console.log("이 함수 실행됨?");
  const redirect_uri = `${frontend_base_url}/temp.html`;
  console.log(redirect_uri);
  /**
   * 작성자 : 김은수
   * 내용 : JWT Token 가져오고 보여줌.
   * 최초 작성일 : 2023.06.14
   */
  var access_token = localStorage.getItem("access_token");
  var refresh_token = localStorage.getItem("refresh_token");

  console.log(access_token || "토큰이 없습니다.");
  if (access_token) {
    document.getElementById("token-result0").innerHTML = "jwt 로그인 성공";
    document.getElementById("token-result1").innerHTML = access_token;
    document.getElementById("token-result2").innerHTML = refresh_token;
  } else {
    console.log("비로그인 중");
    document.getElementById("token-result0").innerHTML = "비로그인 상태";
  }
});


async function googleloginBtn() {
  /**
   * 작성자 : 김은수
   * 내용 : 백엔드서버로 요청보냄. 백앤드에선 구글에 요청보내고 토큰받아옴
   * 최초 작성일 : 2023.06.14
   */
  const response = await fetch(`${backend_base_url}/user/google/`, {
    method: "GET",
  });
  const google_id = await response.json();
  const redirect_uri = `${frontend_base_url}/temp.html`;
  const scope =
    "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";
  const param = `scope=${scope}&include_granted_scopes=true&response_type=token&state=pass-through value&prompt=consent&client_id=${google_id}&redirect_uri=${redirect_uri}`;
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${param}`;
}


    /**
     * 작성자 : 김은수
     * 내용 : 로컬 스토리지에 저장하는 코드 temp.js에 같은 내용이 있어서 주석처리.
     * 최초 작성일 : 2023.06.16
     */
function setLocalStorage(response) {
  if (response.status === 200) {
    localStorage.setItem("access_token", response_json.access);
    localStorage.setItem("refresh_token", response_json.refresh);
    const base64Url = response_json.access.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    localStorage.setItem("payload", jsonPayload);

    console.log('로컬 스토리지 저장')
    window.location.reload();
  } else {
    alert(response_json["error"]);
    window.history.back();
  }
}

async function GoogleLogout() {
  /**
   * 작성자 : 김은수
   * 내용 : 구글 로그아웃
   * 최초 작성일 : 2023.06.17
   */
  if (access_token == undefined) {
    alert("이미 비로그인입니다.");
    return;
  }

  // 구글 토큰을 만료시키기
  // try {
  //   const response = await $.ajax({
  //     url: `${backend_base_url}/user/kakao/logout/`,
  //     method: "POST",
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  //     },
  //     // data: {},
  //     // dataType: 'json',
  //   });
  //   alert(JSON.stringify(response));
  // } catch (error) {
  //   console.error("HTTP 상태 코드: ", error.status);
  //   console.error("백엔드로부터의 응답: ", error.responseJSON);
  //   alert(JSON.stringify(error.responseJSON))}

  // JWT 토큰 삭제
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("payload");

  window.location.replace(`../google.html`);
}
