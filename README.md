# CLAID_front
- 내 게시글일 경우에만 수정 삭제 버튼보이기 ㅇ
- 이미지 첨부시 미리보기 v
- index.html에 재생바 만들기 v
- 로그인안해도 상세페이지에서 이미지 보이게하기 v
- ai article 노래바 안되는거 v
- 이미지 누르면 음악 재생 / 멈춤(hover) v
- ai article detail css + 댓글
- ckeditor로 작성 / 수정(전에 썼던 게시글 그대로 가져오기) 가능하게하기 v
- 방법공유 게시판 detail(notice detail) v
- ai 노래자랑 게시판(리스트,상세보기) 방법공유 게시판(리스트,상세보기) 조회수 보이게 하기 v
- nav바 회원가입 로그인 오른쪽으로 옮기기 v
- 음원분리 html nav css맞추기 v
- nav바 고정 풀기 v
- 댓글 기능 도입


-방법공유 게시판 10개씩만 보이고 넘어가게  + 공지사항 같은거 최상단 고정


#profile.js에 
  const profile_image = document.getElementById("image_profile"); id와
  #profile.html 15번줄 <img src="{{ user.profile_image.url }}" alt="프로필 이미지" id="image_profile"> id를
kakao.js의 151번줄     let imgElement = document.getElementById('image_profile'); 의 id와 똑같이 했더니 프로필 이미지가 잘 들어옴