console.log('detail')

/**
 * 작성자 : 공민영
 * 내용 : 게시글 아이디 가져오기
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
function getArticleIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("article_id");
}

/**
 * 작성자 : 공민영
 * 내용 : 게시글 상세보기
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
window.onload = async function () {
    const response = await getArticle(getArticleIdFromUrl())
    console.log(response)

    const articleTitle = document.getElementById("detail_title")
    const articleImage = document.getElementById("detail_image")
    const articleContent = document.getElementById("detail_content")
    const articleSong = document.getElementById("detail_song")
    const articleCreatedAt = document.getElementById("detail_created_at")
    const articleUpdatedAt = document.getElementById("detail_updated_at")

    articleTitle.innerText = response.title
    articleContent.innerText = response.content
    articleSong.innerText = response.song
    articleCreatedAt.innerText = response.created_at
    articleUpdatedAt.innerText = response.update_at

    const newImage = document.createElement("img")


    if (response.article_image) { //이미지 있으면
        newImage.setAttribute("src", `${backend_base_url}${response.article_image}`)
    } else { //이미지 없으면
        newImage.setAttribute("src", "default.PNG")
    }
    newImage.setAttribute("class", "img_size")
    articleImage.appendChild(newImage)

}

/**
 * 작성자 : 공민영
 * 내용 : 디테일뷰 가져오기
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
async function getArticle(articleId) {
    const response = await fetch(`${backend_base_url}/article/${articleId}/`,
    )
    if (response.status == 200) {
        response_json = await response.json()
        return response_json
    } else {
        alert(response.statusText)
    }
}


/**
 * 작성자 : 공민영
 * 내용 : 내 게시글 수정
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
async function putArticle(articleId) {
    console.log("putArticle()눌림")
    console.log(articleId)


    let access_token = localStorage.getItem("access")

    const title = document.querySelector("#detail_title").value;
    const content = document.querySelector("#detail_content").value;
    const article_image = document.querySelector("#detail_image").value;
    const song = document.querySelector("#detail_song").value;

    const formdata = {
        title: title,
        content: content,
        article_image: article_image,
        song: song
    }

    const response = await fetch(`${backend_base_url}/article/${articleId}`, {
        method: 'PUT',
        headers: {
            "Authorization": `Bearer ${access_token}`
        },
        body: JSON.stringify(formdata)
    })

    if (response.status == 200) {
        alert("수정이 완료되었습니다.")
        window.location.replace('index.html')
    } else {
        alert("수정 권한이 없습니다.")
    }
}

/**
 * 작성자 : 공민영
 * 내용 : 내 게시글 삭제
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
async function deleteArticle(articleId) {
    console.log("deleteArticle()눌림")
    console.log(articleId)

    const response = await fetch(`${backend_base_url}/article/${articleId}`, {
        method: 'DELETE',
        headers: {
            "Authorization": `Bearer ${access_token}`
        },
    })
    console.log(response.user)
    if (response.status == 204) {
        alert("삭제가 완료되었습니다.")
        window.location.replace('index.html')
    } else {
        alert("삭제 권한이 없습니다.")
    }
}