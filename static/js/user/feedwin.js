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

    const gData2 = document.querySelector('#gData').dataset.mainimg;    //head gData에 mainimg 데이터셋 추가 했음
    const btnUpdProfilePic = document.querySelector('#btnUpdProfilePic');   //사진 업로드 id
    const btnProfileImgModalClose = document.querySelector('#btnProfileImgModalClose'); //프로필 수정 눌렀을 때 뜨는 모달 닫기
    
    //현재 사진 삭제하는 아이템 생성
    const modalItem = document.createElement('div');
    modalItem.className = 'modal_item';
    modalItem.id = 'btnDelCurrentProfileItem';
    btnUpdProfilePic.after(modalItem);
    modalItem.innerHTML = `
        <span id="btnDelCurrentProfilePic" class="bold pointer c_error-or-destructive">현재 사진 삭제</span>
    `;
    //위에 만들어졌는데 만약에 이미지 없으면 d-none 주기
    if(gData2 === '') {
        console.log('지금 이미지 없음');
        modalItem.classList.add('d-none');
    }

    //프로필 사진 업로드
    if(btnUpdProfilePic) {
        const changeProfileImg = document.querySelector('#changeProfileImg');
        const frmElem = changeProfileImg.querySelector('form');
        const imgElem = changeProfileImg.querySelector('#currentProfileImg');
        const btnClose = changeProfileImg.querySelector('.btn-close');

        imgElem.addEventListener('click', e => {
            frmElem.imgs.click();
        });

        frmElem.imgs.addEventListener('change', e => {
            if(e.target.files.length > 0) {
                const imgSource = e.target.files[0];
                const reader = new FileReader();
                reader.readAsDataURL(imgSource);
                reader.onload = function () {
                    imgElem.src = reader.result;
                };

                const changeBtn = changeProfileImg.querySelector('#changeBtn');
                changeBtn.addEventListener('click', e => {
                    const files = frmElem.imgs.files[0];
                    const fData = new FormData();
                    fData.append('imgs[]', files);
                    fetch('/user/profile', {
                        method: 'POST',
                        body: fData
                    }).then(res => res.json())
                    .then(res => {
                        // console.log(parseInt(url.searchParams.get('iuser')));
                        // console.log(res);
                        if (res) {
                            console.log(res.result);
                            const gData = document.querySelector('#gData').dataset.loginiuser;
                            const cmtProfileimgList = document.querySelectorAll('#cmtProfileimg');
                            cmtProfileimgList.forEach(item => {
                                console.log('gdata:'+gData);
                                console.log('item.iuser:'+item.dataset.iuser);
                                if(parseInt(item.dataset.iuser) !== parseInt(gData)) {
                                    console.log(item);
                                    item.classList.remove('profileimg');
                                }
                            });
                            const profileimgList = document.querySelectorAll('.profileimg');
                            profileimgList.forEach(item => {
                                item.src = `/static/img/profile/${parseInt(url.searchParams.get('iuser'))}/${res.result}`;
                            });

                            btnClose.click();
                            //이미지 등록하면 d-none 삭제
                            modalItem.classList.remove('d-none');
                        }
                    });
                });
            }
        });
    }

    const btnDelCurrentProfilePic = document.querySelector('#btnDelCurrentProfilePic');
    //현재 프로필 사진 삭제
    if(btnDelCurrentProfilePic) {
        btnDelCurrentProfilePic.addEventListener('click', e => {
            fetch('/user/profile', {method: 'DELETE'})
            .then(res => res.json())
            .then(res => {
                if(res.result) {
                    const gData = document.querySelector('#gData').dataset.loginiuser;
                    const cmtProfileimgList = document.querySelectorAll('#cmtProfileimg');
                    cmtProfileimgList.forEach(item => {
                        console.log('gdata:'+gData);
                        console.log('item.iuser:'+item.dataset.iuser);
                        if(parseInt(item.dataset.iuser) !== parseInt(gData)) {
                            item.classList.remove('profileimg');
                        }
                    });
                    const profileimgList = document.querySelectorAll('.profileimg');
                    profileimgList.forEach(item => {
                        item.src = '/static/img/profile/user.png';
                    });
                }
                btnProfileImgModalClose.click();
                //이미지 삭제하면 d-none 다시 만들어줌
                modalItem.classList.add('d-none');
            });
        });
    }
})();