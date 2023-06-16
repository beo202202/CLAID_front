async function showProfile() {
  try {
    const response = await fetch('http://127.0.0.1:8000/user/profile', {
      headers: {
        Authorization: `Bearer ${access_token}` // 액세스 토큰을 헤더에 포함하여 인증 정보 전달
    }
  });

    const userData = await response.json();
  
    // 닉네임 표시
    const nicknameElement = document.getElementById('user-nickname');
    nicknameElement.innerText = userData.nickname;
  
    // 이메일 표시
    const emailElement = document.getElementById('user-email');
    emailElement.innerText = userData.email;
  
    // 가입일자 표시
    const dateElement = document.getElementById('user-created_date');
    dateElement.innerText = userData.created_at;
  } catch (error) {
    console.error('프로필 정보를 받아오는 동안 오류가 발생했습니다:', error);
  }
}

window.addEventListener('load', showProfile);
