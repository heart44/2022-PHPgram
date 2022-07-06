const url = new URL(location.href);

if (feedObj) { 
    feedObj.iuser = parseInt(url.searchParams.get('iuser'));
    feedObj.getFeedUrl = '/user/feed';
    feedObj.getFeedList();
}

(function() {
    // const gData = document.querySelector('#gData');
    const follower = document.querySelector('#follower');
    // let followerCnt = parseInt(follower.dataset.follower);
    const btnUpdProfilePic = document.querySelector('#btnUpdProfilePic');
    const btnClose = document.querySelector('#btnModalClose');
    const btnDelCurrentProfilePic = document.querySelector('#btnDelCurrentProfilePic');
    const btnProfileImgModalClose = document.querySelector('#btnProfileImgModalClose');

    //팔로우 버튼
    const btnFollow = document.querySelector('#btnFollow');
    if(btnFollow) {
        btnFollow.addEventListener('click', function() {
            const param = {
                toiuser: parseInt(url.searchParams.get('iuser'))
                // toiuser: parseInt(gData.dataset.toiuser)
            };
            console.log(param);
            
            const follow = btnFollow.dataset.follow;
            console.log('follow : ' + follow);
            const followUrl = '/user/follow';
            switch(follow) {
                case '1':   //팔로우 취소 처리
                    fetch(followUrl + encodeQueryString(param), {method: 'DELETE'})
                    .then(res => res.json())
                    .then(res => {
                        // console.log('res: ' + res);
                        if(res.result) {
                            //팔로우 갯수 변경 (강사님 방법)
                            const followerCnt = parseInt(follower.innerText);
                            follower.innerText = followerCnt - 1;
                            // follower.dataset.follower = followerCnt;     //데이터셋 사용

                            btnFollow.dataset.follow = '0';
                            btnFollow.classList.remove('btn-outline-secondary');
                            btnFollow.classList.add('btn-primary');
                            if(btnFollow.dataset.youme === '1') {
                                btnFollow.innerText = '맞팔로우 하기';
                            } else {
                                btnFollow.innerText = '팔로우';
                            }
                        }
                    });
                    break;
                case '0':   //팔로우 등록 처리
                    fetch(followUrl, {
                        method: 'POST',
                        body: JSON.stringify(param)
                    }).then(res => res.json())
                    .then(res => {
                        if(res.result) {
                            //팔로우 갯수 변경 (강사님 방법)
                            const followerCnt = parseInt(follower.innerText);
                            follower.innerText = followerCnt + 1;
                            // follower.dataset.follower = followerCnt;     //데이터셋 사용

                            btnFollow.dataset.follow = '1';
                            btnFollow.classList.remove('btn-primary');
                            btnFollow.classList.add('btn-outline-secondary');
                            btnFollow.innerText = '팔로우 취소';
                        }
                    });
                    break;
            }
        });
    } 

    //프로필 사진 업로드
    if(btnUpdProfilePic) {
        const changeProfileImgModal = document.querySelector('#changeProfileImgModal');
        const updProfilePic = document.querySelector('input');
        const frmElem = changeProfileImgModal.querySelector('form');

        btnUpdProfilePic.addEventListener('click', e => {
            updProfilePic.click();
        });

        updProfilePic.addEventListener('change', e => {
            const files = frmElem.imgs.files;
            const fData = new FormData();
            fData.append('imgs[]', files[0]);
            fetch('/user/profile', {
                method: 'POST',
                body: fData
            }).then(res => res.json())
            .then(res => {
                const profileimgList = document.querySelectorAll('.profileimg');
                profileimgList.forEach(item => {
                    item.src = `/static/img/profile/${parseInt(url.searchParams.get('iuser'))}/${res.result}`;
                });
                if(res) {
                    btnClose.click();
                }
            });
        });
    }

    //현재 프로필 사진 삭제
    if(btnDelCurrentProfilePic) {
        btnDelCurrentProfilePic.addEventListener('click', e => {
            fetch('/user/profile', {method: 'DELETE'})
            .then(res => res.json())
            .then(res => {
                if(res.result) {
                    const profileimgList = document.querySelectorAll('.profileimg');
                    profileimgList.forEach(item => {
                        item.src = '/static/img/profile/user.png';
                    });
                }
                btnProfileImgModalClose.click();
            });
        });
    }
})();