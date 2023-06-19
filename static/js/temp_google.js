if (!localStorage.getItem("access_token")) {
  /**
   * 작성자 : 이준영
   * 내용 : JWT Token이 없고 kakao_code를 받아왔다면 JWT Token 발급 받기
   * 최초 작성일 : 2023.06.14
   * 수정자 : 김은수
   * 수정 내용 : 백엔드 서버로 보낼 경우 
   * 수정일 : 2023.06.18
   * 
   */
  // 현재 페이지의 URL에서 쿼리 매개변수 추출
  let urlParams = new URLSearchParams(window.location.search);
  let code = urlParams.get("code");
  let state = urlParams.get("state");
  let hashParams = new URLSearchParams(window.location.hash.substr(1));
  let google_token = hashParams.get("access_token");
  // code가 있다면 JWT(access, refresh) 가져오기
  if (code) {
    if (state) {
      alert("네이버 로그인");
      getNaverJWT(code, state);
    } else {
      alert("카카오 로그인");
      getKakaoJWT(code);
    }
    // 구글 토큰이 있다면 JWT(access, refresh) 가져오기
  } else if (google_token) {
    alert("구글 로그인");
    getGoogleJWT(google_token);
  }
}


async function getGoogleJWT(google_token) {
  /*
   * 작성자 : 김은수
   * 내용 : google token을 보내서 access, refresh JWT Token을 받아오는 함수
   * 최초 작성일 : 2023.06.16
   */
  console.log('getGoogleJWT 함수 실행')
  const response = await fetch(`${backend_base_url}/user/google/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({access_token: google_token}),
  });
  response_json = await response.json();
  console.log(response_json);
  setLocalStorage(response);
  window.location.replace(`../index.html`);
}


function setLocalStorage(response) {
  /*
   * 작성자 : 김은수
   * 내용 : google token을 보내서 access, refresh JWT Token을 받아오는 함수
   * 최초 작성일 : 2023.06.16
   * 수정일 : 2023.06.19
   */
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

    console.log("로컬 스토리지 저장");
  } else {
    alert(response_json["error"]);
    window.history.back();
  }
}

