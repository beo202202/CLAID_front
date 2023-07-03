window.onload = () => {
    getPointList();
    loadPointList();
    loadPointHistoryList();
};

/**
 * 작성자 : 공민영
 * 내용 : (슈퍼계정만) 전체 포인트 가져오기
 * 작성일 : 2023.07.03
 */
async function getPointList() {
    const access_token = localStorage.getItem("access_token");
    const response = await fetch(`${backend_base_url}/user/points/`, {
        headers: {
            'Authorization': `Bearer ${access_token}`,
        },
    });
    if (response.status == 200) {
        response_json = await response.json();
        console.log(response_json)
        return response_json;

    } else if (response.status == 403) {
        window.location.href = "index.html"
    }
}

/**
 * 작성자 : 공민영
 * 내용 : 가져온 전체 포인트 html에 출력
 * 작성일 : 2023.07.03
 */
async function loadPointList() {

    const points = await getPointList();

    const pointList = $("#point_list");
    $('#point_list').empty();
    points.forEach((point) => {
        const newListCol = $("<div>")
            .addClass("list_col")
        const newList = $("<div>").addClass("list").attr("id", point.id);
        newListCol.append(newList);

        const newListEmail = $("<li>").addClass("email").text(point.user_email);
        newList.append(newListEmail);

        const newListPoints = $("<li>").addClass("points").text(point.points);
        newList.append(newListPoints);

        pointList.append(newListCol);
    });
}

/**
 * 작성자 : 공민영
 * 내용 : 입력받은 email의 user값을 가져옴
 * 작성일 : 2023.07.03
 */
function findUserByEmail(response_json, userEmail) {
    const foundUser = response_json.find(user => user.user_email === userEmail);
    if (foundUser) {
        return foundUser;
    } else { // 유저를 찾지 못한 경우
        return null;
    }
}

/**
 * 작성자 : 공민영
 * 내용 : 포인트 추가 버튼 클릭시
 * 작성일 : 2023.07.03
 */
async function addPoint() {
    const access_token = localStorage.getItem("access_token");
    const userEmail = document.querySelector("#super_user_email").value;
    const amount = parseInt(document.querySelector("#amount").value);
    const reason = document.querySelector("#reason").value;

    const foundUser = response_json.find(user => user.user_email === userEmail);
    if (foundUser) {
        const userId = foundUser.user;
        if (userId) {
            console.log("사용자 ID:", userId);
            const response = await fetch(`${backend_base_url}/user/points/${userId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
                body: JSON.stringify({ amount, reason, action: "add" })
            });

            if (response.status === 200) {
                const points = await getPointList();

                const pointList = $("#point_list");
                loadPointList();
                loadPointHistoryList();
                alert(`${amount} 포인트가 성공적으로 추가되었습니다.`);
            } else {
                alert('포인트 추가에 실패했습니다.');
            }
        } else {
            alert(`${userEmail} 이메일에 해당하는 사용자가 없습니다.`);
        }
    }
}

/**
 * 작성자 : 공민영
 * 내용 : 포인트 차감 버튼 클릭시
 * 작성일 : 2023.07.03
 */
async function subtractPoint() {
    const access_token = localStorage.getItem("access_token");
    const userEmail = document.querySelector("#super_user_email").value;
    const amount = parseInt(document.querySelector("#amount").value);
    const reason = document.querySelector("#reason").value;

    const foundUser = response_json.find(user => user.user_email === userEmail);
    if (foundUser) {
        const userId = foundUser.user;
        if (userId) {
            console.log("사용자 ID:", userId);
            const response = await fetch(`${backend_base_url}/user/points/${userId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
                body: JSON.stringify({ amount, reason, action: "subtract" })
            });

            if (response.status === 200) {
                loadPointList();
                loadPointHistoryList();
                alert(`${amount} 포인트가 성공적으로 차감되었습니다.`);
            } else {
                alert('포인트 차감에 실패했습니다.');
            }
        } else {
            alert(`${userEmail} 이메일에 해당하는 사용자가 없습니다.`);
        }
    }
}


/**
 * 작성자 : 공민영
 * 내용 : (슈퍼계정만) 전체 포인트 히스토리 가져오기
 * 작성일 : 2023.07.03
 */
async function getPointHistoryList() {
    const access_token = localStorage.getItem("access_token");
    const response = await fetch(`${backend_base_url}/user/history/`, {
        headers: {
            'Authorization': `Bearer ${access_token}`,
        },
    });
    if (response.status == 200) {
        response_json = await response.json();
        return response_json;

    } else if (response.status == 403) {
        window.location.href = "index.html"
    }
}

/**
 * 작성자 : 공민영
 * 내용 : 슈퍼계정 가져온 전체 포인트 히스토리 html에 출력
 * 작성일 : 2023.07.03
 */
async function loadPointHistoryList() {

    const pointHistorys = await getPointHistoryList();

    const pointHistoryList = $("#point_history_list");
    $('#point_history_list').empty();
    pointHistorys.forEach((pointHistory) => {
        const newListCol = $("<div>")
            .addClass("list_col")
        const newList = $("<div>").addClass("point_list").attr("id", pointHistory.id);
        newListCol.append(newList);

        const newListEmail = $("<li>").addClass("list_email").text(pointHistory.user_email);
        newList.append(newListEmail);

        const newListPointChange = $("<li>").addClass("list_points").text(pointHistory.point_change);
        newList.append(newListPointChange);

        const newListReason = $("<li>").addClass("list_reason").text(pointHistory.reason);
        newList.append(newListReason);

        const newListCreated = $("<li>").addClass("list_created_at").text(timeago(pointHistory.created_at));
        newList.append(newListCreated);

        pointHistoryList.append(newListCol);
    });
}

/**
 * 작성자 : 이준영
 * 내용 : 상대시간을 동적으로 해주는 함수
 * 최초 작성일 : 2023.06.17
 * 관련 링크 : https://beolog.tistory.com/125
 */
function timeago(date) {
    var t = new Date(date);
    var seconds = Math.floor((new Date() - t.getTime()) / 1000);
    if (seconds > 86400) return t.toISOString().substring(0, 10);
    if (seconds > 3600) return Math.floor(seconds / 3600) + "시간 전";
    if (seconds > 60) return Math.floor(seconds / 60) + "분 전";
    return "방금";
}