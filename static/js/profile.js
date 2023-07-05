async function fetchUserProfileData() {
    const userId = getUserId();
    if (!userId) {
      console.error('사용자 ID를 가져오지 못했습니다.');
      return;
    }
  
    const accessToken = getAccessToken();
    if (!accessToken) {
      console.error('액세스 토큰이 없습니다.');
      return;
    }
    $.ajax({
      url: `${backend_base_url}/user/profile/${userId}/`,  // 프로필 API 엔드포인트의 URL을 여기에 입력
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      success: function(response) {

        var profileData = response;  // API 응답 데이터
        // 가져온 데이터를 HTML 요소에 업데이트
        $('#image_profile').attr("src", profileData.profile_image);
        $('#user-nickname').text(profileData.nickname);
      },
      error: function(error) {
        // 에러 발생 시의 처리 로직
        console.log(error);
      }
    });
    $.ajax({
      url: `${backend_base_url}/article/?user_id=${userId}`,
      type: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      success: function (data) {
        // 게시글을 표시할 컨테이너 선택
        var articlesContainer = $('#articles-container');
        articlesContainer.empty(); // 기존 게시글 초기화
  
        // 각 게시글을 반복하여 표시
        for (var i = 0; i < data.length; i++) {
          var article = data[i];
          var articleElement = $('<div class="article">');
          articleElement.text(article.song_info);
  
          articleElement.click((function (article) {
            return function () {
              var articleUrl = "article_detail.html?article_id=" + article.id;
              window.location.href = articleUrl;
            };
          })(article));
  
          articlesContainer.append(articleElement);
        }
      },
      error: function () {
        // 에러 처리
      }
    });
  }
  
  $(document).ready(function () {
    fetchUserProfileData();
  });
  