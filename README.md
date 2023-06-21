# CLAID_front
- 내 게시글일 경우에만 수정 삭제 버튼보이기 ㅇ
- 이미지 첨부시 미리보기 v
- index.html에 재생바 만들기 v
- 로그인안해도 상세페이지에서 이미지 보이게하기 v

-ai article detail css + 댓글
-ai article 노래바 안되는거 v
-방법공유 게시판 10개씩만 보이고 넘어가게 + 조회수 + 공지사항 같은거 최상단 고정
-방법공유 게시판 detail(notice detail) v
-ckeditor로 작성 / 수정(전에 썼던 게시글 그대로 가져오기) 가능하게하기 v
-이미지 누르면 음악 재생 / 멈춤(hover)

#profile.js에 
  const profile_image = document.getElementById("image_profile"); id와
  #profile.html 15번줄 <img src="{{ user.profile_image.url }}" alt="프로필 이미지" id="image_profile"> id를
kakao.js의 151번줄     let imgElement = document.getElementById('image_profile'); 의 id와 똑같이 했더니 프로필 이미지가 잘 들어옴