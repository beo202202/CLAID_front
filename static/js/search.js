$(document).ready(function() {
  // 검색 버튼 클릭 이벤트 처리
  $("#search-btn").click(function() {
    var query = $("#search-input").val();
    searchArticles(query);
  });

  // 검색 요청 함수
  function searchArticles(query) {
    $.ajax({
      url: "http://localhost:8000/article/search/",
      type: "GET",
      data: { q: query },
      success: function(data) {
        displaySearchResults(data);
      },
      error: function() {
        $("#search-results").empty().append("<p>검색 결과를 가져오지 못했습니다.</p>");
      }
    });
  }

  // 검색 결과 표시 함수
  function displaySearchResults(results) {
    var resultsContainer = $("#search-results");
    resultsContainer.empty();

    if (results.length === 0) {
      resultsContainer.append("<p>검색 결과가 없습니다.</p>");
    } else {
      results.forEach(function(result) {
        var resultItem = $("<div class='search-result'>");
        var articleURL = "article_detail.html?article_id=" + result.id;
        var titleLink = $("<a>").text(result.song_info).attr("href", articleURL);
        resultItem.append("<h3>").append(titleLink);
        resultItem.append("<p>" + result.user.nickname + "</p>");
        resultsContainer.append(resultItem);
      });
    }
  }
})