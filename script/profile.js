async function fetchUserProfile() {
    try {
      const response = await fetch('유저 프로필 정보를 받아오는 API 엔드포인트');
      const userData = await response.json();
  
      document.getElementById('user-nickname').textContent = userData.nickname;
      document.getElementById('user-email').textContent = userData.email;
      document.getElementById('user-date').textContent = userData.date;
    } catch (error) {
      console.error('프로필 정보를 받아오는 동안 오류가 발생했습니다:', error);
    }
  }
  
  window.addEventListener('load', fetchUserProfile);
  