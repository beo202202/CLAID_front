const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const searchResults = document.getElementById('search-results');

searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query !== '') {
        searchArticles(query);
    }
});

function searchArticles(query) {
    fetch(`/api/articles/?q=${query}`)
        .then(response => response.json())
        .then(data => {
            // 검색 결과를 처리하는 코드 작성
            displayResults(data);
        })
        .catch(error => console.error(error));
}

function displayResults(results) {
    searchResults.innerHTML = '';

    if (results.length === 0) {
        searchResults.innerHTML = '<p>검색 결과가 없습니다.</p>';
        return;
    }

    results.forEach(result => {
        const articleDiv = document.createElement('div');
        articleDiv.innerHTML = `<h3>${result.title}</h3><p>${result.content}</p>`;
        searchResults.appendChild(articleDiv);
    });
}