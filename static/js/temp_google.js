async function getGoogleJWT(google_token, hashParams) {
  /*
   * 작성자 : 김은수
   * 내용 : google token을 보내서 access, refresh JWT Token을 받아오는 함수
   * 최초 작성일 : 2023.06.16
   */
  const response = await fetch(`${backend_base_url}/user/google/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ access_token: google_token, params: hashParams }),
  });
  response_json = await response.json();
  console.log(response_json, hashParams);
  setJWT(response);
}


if (!localStorage.getItem("access_token")) {
  /**
   * 작성자 : 이준영
   * 내용 : JWT Token이 없고 kakao_code를 받아왔다면 JWT Token 발급 받기
   * 최초 작성일 : 2023.06.14
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
    getGoogleJWT(google_token, hashParams);
  }
}