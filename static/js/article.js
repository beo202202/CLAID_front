window.onload = () => {
    // 게시글 가져오기
    loadArticles()

    showName()

}
/**
 * 작성자 : 공민영
 * 내용 : 게시글 작성하기
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
async function postArticle() {
    console.log("upload눌림")
    const title = document.getElementById("title").value
    const content = document.getElementById("content").value
    const article_image = document.getElementById("article_image").files[0]
    const song = document.getElementById("song").files[0]

    const formdata = new FormData();

    formdata.append('title', title)
    formdata.append('content', content)
    formdata.append('article_image', article_image)
    formdata.append('song', song)

    let access_token = localStorage.getItem("access")

    const response = await fetch(`${backend_base_url}/article/`, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${access_token}`
        },
        body: formdata
    })
    if (response.status == 201) {
        alert("작성완료!")
        window.location.replace('index.html')
    } else {
        alert(response.statusText)
    }

}

/**
 * 작성자 : 공민영
 * 내용 : 게시글 가져오기
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
async function getArticles() {
    const response = await fetch('http://127.0.0.1:8000/article/')

    if (response.status == 200) {
        const response_json = await response.json()
        return response_json
    } else {
        alert("게시글을 불러오는데 실패했습니다.")
        
        
    }

}



/**
 * 작성자 : 공민영
 * 내용 : 게시글 상세보기 url
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
function articleDetail(article_id) {
    console.log(article_id)
    window.location.href = `${frontend_base_url}/article_detail.html?article_id=${article_id}`

}


/**
 * 작성자 : 공민영
 * 내용 : index에 게시글 불러오기
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
console.log('리스트 연결')

async function loadArticles() {

    articles = await getArticles()
    console.log(articles)

    const article_list = document.getElementById("article_list")

    articles.forEach(article => {
        const newCol = document.createElement("div");
        newCol.setAttribute("class", "col")
        newCol.setAttribute("onclick", `articleDetail(${article.id})`)

        const newCard = document.createElement("div");
        newCard.setAttribute("class", "card")
        //클릭했을때 id값으로 이동하기 위함(각 card당 id넣어줌)
        newCard.setAttribute("id", article.id)

        newCol.appendChild(newCard)

        //제목이 들어있는 바디
        const newCardBody = document.createElement("div")
        newCardBody.setAttribute("class", "card_body")
        newCard.appendChild(newCardBody)

        //제목
        const newCardTitle = document.createElement("h4")
        newCardTitle.setAttribute("class", "card_title")
        newCardTitle.innerText = article.title
        newCardBody.appendChild(newCardTitle)

        //이미지와 음악이 들어있는 바디
        const newCardPlay = document.createElement("div")
        newCardPlay.setAttribute("class", "card_play")
        newCard.appendChild(newCardPlay)

        //이미지
        const articleImage = document.createElement("img")
        articleImage.setAttribute("class", "card_img_top")
        if (article.article_image) { //이미지 있으면
            articleImage.setAttribute("src", `${backend_base_url}/media/${article.article_image}`)
        } else { //이미지 없으면
            articleImage.setAttribute("src", "default.PNG")
        }
        newCardPlay.appendChild(articleImage)

        //음악
        // const articleSong = document.createElement("audio")
        // articleSong.setAttribute("class", "card_file")
        // articleSong.setAttribute("src", `${backend_base_url}${article.song}`)
        // newCardPlay.appendChild(articleSong)

        // Audio 객체 설정
        // const myAudio = new Audio();
        // myAudio.src = `${backend_base_url}${article.article_image}`;

        // // 오디오 재생: 크롬브라우저에서 작동 안함
        // myAudio.play();

        // const btnPlay = document.getElementById("btnPlay");
        // const btnPause = document.getElementById("btnPause");
        // const btnStop = document.getElementById("btnStop");

        article_list.appendChild(newCol)

    });
}

// //작성 이미지 미리보기
// function showPreview(event) {
//     if (event.target.files.length > 0) {
//         var src = URL.createObjectURL(event.target.files[0]);
//         var preview = document.getElementById("preview");
//         preview.src = src;
//         preview.style.display = "block";
//     }
// }



