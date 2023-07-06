$(document).ready(function() {
  $("#search-btn").click(function() {
    var query = $("#search-input").val();
    searchArticles(query);
  });

  function searchArticles(query) {
    $.ajax({
      url: `${backend_base_url}/article/search/`,
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

  function displaySearchResults(data) {
    var resultsContainer = $("#search-results");
    resultsContainer.empty(); // 결과를 초기화합니다.

    if (data.articles.length === 0 && data.vocal_notices.length === 0) {
      resultsContainer.append("<p>검색 결과가 없습니다.</p>");
    } else {
      if (data.articles.length > 0) {
        data.articles.forEach(function(result) {
          var resultItem = $("<div class='search-result pointer'>");
          var articleURL = "article_detail.html?article_id=" + result.id;
          var titleLink = $("<a>").text("곡 정보: " + result.song_info).attr("href", articleURL);
          resultItem.append("<h3>").append(titleLink);
          resultItem.append("<p>" + "작성자: " + result.user.nickname + "</p>");
          resultsContainer.append(resultItem);
        });
      }

      if (data.vocal_notices.length > 0) {
        data.vocal_notices.forEach(function(result) {
          var resultItem = $("<div class='search-result pointer'>");
          var noticeURL = "notice_detail.html?article_id=" + result.id;
          var titleLink = $("<a>").text("제목: " + result.title).attr("href", noticeURL);
          var content = truncateContent("내용: " + result.content);
          resultItem.append("<h3>").append(titleLink);
          resultItem.append("<p>" + content + "</p>");
          resultItem.append("<p>" + "작성자: " + result.user.nickname + "</p>");
          resultsContainer.append(resultItem);
        });
      }
    }
  }

  function truncateContent(content) {
    var maxLength = 20;
    if (content.length > maxLength) {
      return content.substring(0, maxLength) + "...";
    }
    return content;
  }
});
