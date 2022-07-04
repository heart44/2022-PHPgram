const url = new URL(location.href);

//list 가져오는 통신 부분
function getFeedList() {
    if (!feedObj) { return; }

    feedObj.showLoading();
    const param = {
        page: feedObj.currentPage++,
        iuser: url.searchParams.get('iuser')
    }
    fetch('/user/feed' + encodeQueryString(param))
    .then(res => res.json())
    .then(list => {
        feedObj.makeFeedList(list);
    })
    .catch(e => {
        console.error(e);
        feedObj.hideLoading();
    });
}
getFeedList();

(function() {
    const gData = document.querySelector('#gData');
    // const url = new URL(location.href);
    // const urlParams = url.searchParams;

    const btnFollow = document.querySelector('#btnFollow');   
    if(btnFollow) {
        btnFollow.addEventListener('click', function() {
            const param = {
                // toiuser: parseInt(urlParams.get('iuser'))
                toiuser: parseInt(gData.dataset.toiuser)
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
})();