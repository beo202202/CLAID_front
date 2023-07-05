/**
 * 작성자: 이준영
 * 내용: 오디오 디테일
 * 최초 작성일: 2023.07.03
 */
$(document).ready(function () {
    var fileId = new URLSearchParams(window.location.search).get('fileId');

    $.ajax({
        url: `${backend_base_url}/separator/converted-files/${fileId}/`,
        method: 'GET',
        headers: {
            "Authorization": 'Bearer ' + localStorage.getItem("access_token")
        },
        success: function (response) {
            var wave1 = WaveSurfer.create({
                container: '#waveform1',
                responsive: true,
                waveColor: 'violet',
                progressColor: '#6527BE',
                backend: 'MediaElement'
            });
            wave1.load(response.vocals_path);
            wave1.setVolume(0.1);

            var wave2 = WaveSurfer.create({
                container: '#waveform2',
                responsive: true,
                waveColor: '#6527BE',
                progressColor: 'yellow',
                backend: 'MediaElement'
            });
            wave2.load(response.accompaniment_path);
            wave2.setVolume(0.1);

            var syncInProgress = false;

            function handleWaveformClick(e, wave1, wave2) {
                if (syncInProgress) return;

                var rect = e.target.getBoundingClientRect();
                var offsetX = e.clientX - rect.left;
                var progress = offsetX / rect.width;

                console.log('X Position:', offsetX);
                console.log('Width:', rect.width);
                console.log('Progress:', progress);

                var isPlaying1 = !wave1.backend.isPaused();
                var isPlaying2 = !wave2.backend.isPaused();

                syncInProgress = true;

                var duration1 = wave1.getDuration();
                var duration2 = wave2.getDuration();

                var seekTime1 = progress * duration1;
                var seekTime2 = progress * duration2;

                if (isPlaying1) {
                    wave1.pause();
                    wave1.on('pause', function () {
                        wave1.seekTo(seekTime1 / duration1);
                    });
                } else {
                    wave1.play();
                    wave1.seekTo(seekTime1 / duration1);
                }

                if (isPlaying2) {
                    wave2.pause();
                    wave2.on('pause', function () {
                        wave2.seekTo(seekTime2 / duration2);
                    });
                } else {
                    wave1.play();
                    wave2.seekTo(seekTime2 / duration2);
                }

                syncInProgress = false;
            }

            $('#waveform1, #waveform2').on('click', function (e) {
                handleWaveformClick(e, wave1, wave2);
            });

            $('#play-pause').on('click', function () {
                wave1.playPause();
                wave2.playPause();
            });

            $('#volume1, #volume2').on('input', function () {
                var volume = this.value;
                if (this.id === 'volume1') {
                    wave1.setVolume(volume);
                } else if (this.id === 'volume2') {
                    wave2.setVolume(volume);
                }
            });
            $('#file-name').text(response.file_name).css('color', '#6527BE').css('font-size', '40px').css('font-weight', 'bold').css('user-select', 'none');
        },
        error: function (error) {
            alert('API 호출 실패:', error);
        }
    });
});
