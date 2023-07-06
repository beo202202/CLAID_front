window.onload = () => {
    checkAccessToken2()
    ResultFiles();
    // autoUpdate();
    updateTimer();
    document.addEventListener('play', function (e) {
        var audios = document.getElementsByTagName('audio');
        for (var i = 0, len = audios.length; i < len; i++) {
            if (audios[i] != e.target) {
                audios[i].pause();
            }
        }
    }, true);
}

/**
 * 작성자 : 이준영
 * 내용 : 오디오 분리
 * 최초 작성일 : 2023.06.21
 */
async function separator() {
    var file = $('#audio-file_input')[0].files[0];
    var formData = new FormData();
    formData.append('file', file);

    try {
        $('#loadingSpinner').show();
        $('#uploadBtn').prop('disabled', true);
        $('.vocals-container').hide();
        $('.accompaniment-container').hide();

        const response = await fetch(`${backend_base_url}/separator/upload/`, {
            method: 'POST',
            headers: {
                "Authorization": 'Bearer ' + localStorage.getItem("access_token")
            },
            body: formData
        });
        if (response.ok) {
            const data = await response.json();

            $('#vocals-audio').attr('src', data.files.vocals).css('display', 'block').prop('volume', 0.1).prop('preload', 'metadata');
            $('#accompaniment-audio').attr('src', data.files.accompaniment).css('display', 'block').prop('volume', 0.1).prop('preload', 'metadata');

            $('#vocals-download').removeClass('disabled');
            $('#accompaniment-download').removeClass('disabled');

            $('.vocals-container').show();
            $('.accompaniment-container').show();
        } else if (response.status === 400) {
            alert('Bad Request, 잘못된 요청입니다.');
        } else if (response.status === 401) {
            handleLogout()
            alert('토큰 만료! 재로그인해주세요!');
            window.location.href = '/login.html';
        } else if (response.status === 500) {
            alert('서버 내부 오류가 발생했습니다. 관리자에게 문의해주세요.');
        } else {
            alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요.');
        }
    } catch (error) {
        alert(error);
    } finally {
        $('#loadingSpinner').hide();
    }
}

/**
 * 작성자 : 이준영
 * 내용 : 토큰 체크2
 * 최초 작성일 : 2023.06.17
 */
function checkAccessToken2() {
    var access_token = localStorage.getItem('access_token');
    if (!access_token) {
        alert('로그인 하셔야 됩니다.')
        window.location.replace(`../login.html`);
    }
};

/**
 * 작성자 : 이준영
 * 내용 : 분리할 오디오 업로드
 * 최초 작성일 : 2023.06.30
 */
async function upload() {
    var file = $('#audio-file_input')[0].files[0];
    var formData = new FormData();
    formData.append('file', file);

    try {
        $('#loadingSpinner').show();
        $('#uploadBtn').prop('disabled', true);
        $('.vocals-container').hide();
        $('.accompaniment-container').hide();

        const response = await fetch(`${backend_base_url}/separator/upload/`, {
            method: 'POST',
            headers: {
                "Authorization": 'Bearer ' + localStorage.getItem("access_token")
            },
            body: formData
        });
        if (response.ok) {
            const data = await response.json();
            ResultFiles()

        } else if (response.status === 400) {
            alert('Bad Request, 잘못된 요청입니다.');
        } else if (response.status === 409) {
            alert('중복된 자료 입니다.');
            window.location.reload();
        } else if (response.status === 401) {
            handleLogout()
            alert('토큰 만료! 재로그인해주세요!');
            window.location.href = '/login.html';
        } else if (response.status === 500) {
            alert('서버 내부 오류가 발생했습니다. 관리자에게 문의해주세요.');
        } else {
            alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요.');
        }
    } catch (error) {
        alert(error);
    } finally {
        $('#loadingSpinner').hide();
    }
}

/**
 * 작성자: 이준영
 * 내용: 오디오 결과 표, 페이지네이션, 메모리 누적 방지, 데이터 자동 갱신
 * 최초 작성일: 2023.07.03
 * 수정자: 이준영
 * 내용: 이전, 다음(http > https)
 * 수정일: 2023.07.6
 */
let waveSurfers = [];
let files = [];
async function ResultFiles(data) {
    try {
        waveSurfers = [];
        for (let waveSurfer of waveSurfers) {
            waveSurfer.destroy();
        }

        if (!data) {
            const response = await fetch(`${backend_base_url}/separator/converted-files/`, {
                method: 'GET',
                headers: {
                    "Authorization": 'Bearer ' + localStorage.getItem("access_token")
                },
            });
            if (response.ok) {
                data = await response.json();
            } else {
                if (response.status === 400) {
                    alert('Bad Request, 잘못된 요청입니다.');
                } else if (response.status === 401) {
                    handleLogout();
                    alert('토큰 만료! 재로그인해주세요!');
                    window.location.href = '/login.html';
                } else if (response.status === 404) {
                    var fileTable = $('#file-table');
                    fileTable.empty();
                    fileTable.append('<tr><td colspan="5">변환된 파일이 없습니다.</td></tr>');
                } else if (response.status === 500) {
                    alert('서버 내부 오류가 발생했습니다. 관리자에게 문의해주세요.');
                } else {
                    alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요.');
                }
                return;
            }
        }

        const newFiles = data.results;

        if (isFilesEqual(newFiles, files)) {
            return;
        }

        files = newFiles;

        var fileTable = $('#file-table');
        fileTable.empty();
        if (files.length === 0) {
            fileTable.append('<tr><td colspan="5">변환된 파일이 없습니다.</td></tr>');
        } else {
            fileTable.append('<tr><th class="result-filename">파일 이름</th><th class="result-crated-at">등록 시간</th><th class="result-vocals">보컬</th><th class="result-accompaniment">악기</th><th class="result-state">상태</th><th class="result-delete"></th></tr>');

            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var fileRow = '<tr>';
                fileRow += '<td class="file-name">' + file.file_name + '</td>';
                fileRow += '<td>' + new Date(file.created_at).toLocaleDateString() + '</td>';
                fileRow += '<td><div id="vocals-waveform-' + i + '"></div></td>';
                fileRow += '<td><div id="accompaniment-waveform-' + i + '"></div></td>';
                if (file.state == 'waiting') {
                    fileRow += '<td><i class="fa-solid fa-chair"></i></td>';
                } else if (file.state == 'working') {
                    fileRow += '<td><div id="loading2"></div></td>';
                } else if (file.state == 'success') {
                    fileRow += '<td><i class="fa-solid fa-check"></i></td>';
                } else {
                    fileRow += '<td><i class="fa-solid fa-triangle-exclamation"></i></td>';
                }
                fileRow += '<td><button class="btn-delete" data-id="' + file.id + '">삭제</button></td>';
                fileRow += '</tr>';
                fileTable.append(fileRow);

                if (file.state == 'success') {
                    var vocalsWaveform = WaveSurfer.create({
                        container: '#vocals-waveform-' + i,
                        responsive: true,
                        waveColor: 'violet',
                        progressColor: 'transparent',
                        barWidth: 2,
                        height: 50,
                    });

                    var accompanimentWaveform = WaveSurfer.create({
                        container: '#accompaniment-waveform-' + i,
                        responsive: true,
                        waveColor: '#6527BE',
                        progressColor: 'lightblue',
                        barWidth: 2,
                        height: 50,
                    });

                    waveSurfers.push(vocalsWaveform);
                    waveSurfers.push(accompanimentWaveform);

                    vocalsWaveform.load(file.vocals_path);
                    accompanimentWaveform.load(file.accompaniment_path);
                }
            }

            fileTable.find('tr').each(function (index) {
                $(this).delay(100 * index).fadeIn();
            });

            $('.btn-delete').click(function () {
                var fileId = $(this).data('id');
                deleteFile(fileId);
            });

            $('tr').on('click', function () {
                var fileId = $(this).find('.btn-delete').data('id');
                window.location.href = 'separator-detail.html?fileId=' + fileId;
            });
        }

        var pageButtons = $('#page-buttons');
        pageButtons.empty();
        if (data.previous) {
            data.previous = data.previous.replace('http://', 'https://');
            pageButtons.append('<button id="prev-page" data-url="' + data.previous + '">이전</button>');
        }
        if (data.next) {
            data.next = data.next.replace('http://', 'https://');
            pageButtons.append('<button id="next-page" data-url="' + data.next + '">다음</button>');
        }
        pageButtons.append('<button id="refresh-button"><div id="loading3"></div></button>');

        $('#prev-page').click(function () {
            stopAutoUpdate();
            fetchFiles($(this).data('url'));
        });

        $('#next-page').click(function () {
            stopAutoUpdate();
            fetchFiles($(this).data('url'));
        });

        $('#refresh-button').click(function () {
            seconds = originalSeconds;
            updateTimer();
        });

    } catch (error) {
        alert('API 호출 실패:', error);
        console.log('API 호출 실패:', error);
    }
}

/**
 * 작성자: 이준영
 * 내용: 데이터 비교
 * 최초 작성일: 2023.07.03
 */
function isFilesEqual(files1, files2) {
    if (files1.length !== files2.length) {
        return false;
    }

    for (let i = 0; i < files1.length; i++) {
        const file1 = files1[i];
        const file2 = files2[i];

        if (file1.file_name !== file2.file_name || file1.created_at !== file2.created_at || file1.state !== file2.state) {
            return false;
        }
    }

    return true;
}

/**
 * 작성자: 이준영
 * 내용: 일정 시간마다 데이터 갱신
 * 최초 작성일: 2023.07.03
 */
function autoUpdate() {
    fetchFiles(`${backend_base_url}/separator/converted-files/`);
    // timerId = setTimeout(autoUpdate, 30000);
}

/**
 * 작성자: 이준영
 * 내용: 타이머 중지
 * 최초 작성일: 2023.07.03
 */
function stopAutoUpdate() {
    // $('#refresh-button').hide();
    // $('#loading3').stop();
    clearInterval(timerId);
}

let originalSeconds = 30;
let seconds = originalSeconds;
let timerId;
function updateTimer() {
    const timerElement = document.getElementById('timer');
    let seconds = 30;
    if (timerId) {
        clearInterval(timerId);
    }

    timerInterval = setInterval(() => {
        if (seconds > 0) {
            seconds--;
            const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
            const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
            const timerText = `${minutes}:${remainingSeconds}`;
            timerElement.textContent = '자동 갱신까지 ' + timerText;
        } else {
            clearInterval(timerInterval);
            // timerElement.textContent = "타이머 종료";
            autoUpdate();
            updateTimer();
        }
    }, 1000);

    timerId = timerInterval;
}

/**
 * 작성자: 이준영
 * 내용: 페이지 네이션
 * 최초 작성일: 2023.07.03
 */
async function fetchFiles(pageUrl) {
    try {
        const response = await fetch(pageUrl, {
            method: 'GET',
            headers: {
                "Authorization": 'Bearer ' + localStorage.getItem("access_token")
            },
        });
        if (response.ok) {
            const data = await response.json();
            ResultFiles(data);
        } else if (response.status === 400) {
            alert('Bad Request, 잘못된 요청입니다.');
        } else if (response.status === 401) {
            handleLogout();
            alert('토큰 만료! 재로그인해주세요!');
            window.location.href = '/login.html';
        } else if (response.status === 404) {
            var fileTable = $('#file-table');
            fileTable.empty();
            fileTable.append('<tr><td colspan="5">변환된 파일이 없습니다.</td></tr>');
        } else if (response.status === 500) {
            alert('서버 내부 오류가 발생했습니다. 관리자에게 문의해주세요.');
        } else {
            alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요.');
        }
        return;
    } catch (error) {
        console.error('API 호출 실패:', error);
    }
}

/**
 * 작성자: 이준영
 * 내용: 오디오 삭제
 * 최초 작성일: 2023.07.01
 */
async function deleteFile(fileId) {
    event.stopPropagation();

    try {
        const response = await fetch(`${backend_base_url}/separator/converted-files/${fileId}/`, {
            method: 'DELETE',
            headers: {
                "Authorization": 'Bearer ' + localStorage.getItem("access_token")
            }
        });

        if (response.ok) {
            // ResultFiles();
            // 메모리 때문에 리로드
            window.location.reload();
        } else {
            if (response.status === 401) {
                handleLogout();
                alert('토큰 만료! 재로그인해주세요!');
                window.location.href = '/login.html';
            } else if (response.status === 500) {
                alert('서버 내부 오류가 발생했습니다. 관리자에게 문의해주세요.');
            } else {
                alert('파일 삭제에 실패했습니다. 다시 시도해주세요.');
            }
        }
    } catch (error) {
        alert('API 호출 실패:', error);
    }
}
