/**
 * 작성자 : 이준영
 * 내용 : JWT Token이 없고 kakao_code를 받아왔다면 JWT Token 발급 받기
 * 최초 작성일 : 2023.06.14
 * 수정자 : 이준영
 * 수정 내용 : else 추가
 */
if (!localStorage.getItem('access_token')) {
  let urlParams = new URLSearchParams(window.location.search);
  let code = urlParams.get('code');
  let state = urlParams.get("state");
  let hashParams = new URLSearchParams(window.location.hash.substr(1));
  let google_token = hashParams.get("access_token");

  // code가 있다면 JWT(access, refresh) 가져오기
  if (code) {
    if (state) {
      // alert("네이버 로그인");
      getNaverJWT(code, state);
    } else {
      // alert("카카오 로그인");
      getKakaoJWT(code);
    }
    // 구글 토큰이 있다면 JWT(access, refresh) 가져오기
  } else if (google_token) {
    // alert("구글 로그인");
    getGoogleJWT(google_token);
  }
} else {
  window.location.replace(`../index.html`);
}

async function setJWT(response) {
  /**
   * 작성자 : 이준영
   * 내용 : 받아온 JWT Totken을 로컬 스토리지에 저장
   * 에러 발생 시, 에러 문구를 띄워주고 이전 페이지(로그인페이지)로 이동
   * 최초 작성일 : 2023.06.14
   * 업데이트 일 : 2023.06.16
   */
  const response_json = response;
  localStorage.setItem("access_token", response_json.access_token);
  localStorage.setItem("refresh_token", response_json.refresh_token);
  const base64Url = response_json.access_token.split(".")[1];
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
  checkAccessToken();
  // window.history.back();

  window.location.replace(`../index.html`);
}

async function getKakaoJWT(kakao_code) {
  /**
   * 작성자 : 이준영
   * 내용 : kakao_code를 보내서 access, refresh JWT Token을 받아오는 함수
   * 최초 작성일 : 2023.06.14
   */
  await fetch(`${backend_base_url}/user/kakao/login/callback/?code=${kakao_code}`)
    .then(response => response.json())
    .then(data => {
      setJWT(data);
    })
    .catch(error => {
      alert(error + " 다시 로그인 해주세요.");
      window.location.href = '../login.html';
    });
}


async function getGoogleJWT(google_token) {
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
    body: JSON.stringify({ access_token: google_token }),
  });
  response_json = await response.json();
  setJWT(response_json);
  // alert('jwt토큰 발행')
  window.location.replace(`../index.html`);

}

/*
* 작성자 : 이준영
* 내용 : access_token이 underfined 일때 오류 해결하기
* 최초 작성일 : 2023.06.28
*/
async function checkAccessToken() {
  let access_token = await localStorage.getItem('access_token');
  if (access_token == null || '' || undefined) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("payload");
    alert("잘못된 로그인입니다.")
    window.location.replace(`../index.html`);
  }
}