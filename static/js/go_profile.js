function getUserId() {
  const payload = JSON.parse(localStorage.getItem("payload"));
  const userId = payload.user_id;
  return userId;
}

function profileDetail(userId) {
    const profileUrl = `${frontend_base_url}/profile.html?user_id=${userId}`;
    window.location.href = profileUrl;
  }
  
  document.getElementById("profile-btn").addEventListener("click", () => {
    const loggedInUserId = getUserId(); 
  
    if (loggedInUserId) {
      profileDetail(loggedInUserId);
    } else {
      window.location.href = "login.html";
    }
  });