//feed 가져오는 부분
const feedObj = {
    limit: 20,
    itemLength: 0,
    currentPage: 1,
    swiper: null,
    loadingElem: document.querySelector('.loading'),
    containerElem: document.querySelector('#item_container'),
    //댓글 만드는 부분
    makeCmtItem: function(item) {
        const divCmtItemContainer = document.createElement('div');
        divCmtItemContainer.className = 'd-flex flex-row align-items-center mb-2 ps-3 pt-2';
        let src = '/static/img/profile/' + (item.writerimg ? `${item.iuser}/${item.writerimg}` : 'user.png');
        divCmtItemContainer.innerHTML = `
            <div class="circleimg h24 w24">
                <img src="${src}" class="profile pointer">
            </div>
            <div class="d-flex flex-row align-items-center">
                <div class="pointer bold spanNick ms-1 me-2">${item.writer}</div>
                <div>${item.cmt}</div>
                <div class="reg_date ms-2">${getDateTimeInfo(item.regdt)}</div>
            </div>
        `;
        return divCmtItemContainer;
    },

    //feedlist 만드는 부분
    makeFeedList: function(list) {
        if(list.length !== 0) {
            list.forEach(item => {
                const divItem = this.makeFeedItem(item);
                this.containerElem.appendChild(divItem);
            });
        }

        if (this.swiper !== null) { this.swiper = null; }
        this.swiper = new Swiper('.swiper', {
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: { el: '.swiper-pagination' },
            allowTouchMove: false,
            direction: 'horizontal',
            loop: false,
        });

        this.hideLoading();
    },
    makeFeedItem: function(item) {
        // console.log(item);
        const divContainer = document.createElement('div');
        divContainer.className = 'item mt-3 mb-3';

        const divTop = document.createElement('div');
        divContainer.appendChild(divTop);

        const regDtInfo = getDateTimeInfo(item.regdt);
        divTop.className = 'd-flex flex-row ps-3 pe-3';

        const writerImg = `<img src='/static/img/profile/${item.iuser}/${item.mainimg}'
                            onerror='this.error=null;this.src="/static/img/profile/user.png"'>`;
        
        divTop.innerHTML = `
            <div class="d-flex flex-column justify-content-center">
                <div class="circleimg h40 w40 pointer feedwin">${writerImg}</div>
            </div>
                <div class="p-3 flex-grow-1">
                    <div>
                        <span class="pointer bold feedwin">${item.writer}</span>
                    </div>
                <div class="font_loc">${item.location === null ? '' : item.location}</div>
            </div>
        `;

        //이미지 스와이퍼 만드는 부분
        const divImgSwiper = document.createElement('div');
        divContainer.appendChild(divImgSwiper);
        divImgSwiper.className = 'swiper item_img';
        divImgSwiper.innerHTML = `
            <div class="swiper-wrapper align-items-center"></div>
            <div class="swiper-pagination"></div>
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
        `;
        const divSwiperWrapper = divImgSwiper.querySelector('.swiper-wrapper');
        //imgList는 forEach문 돌릴 예정
        item.imgList.forEach(function(imgObj) {
            const divSwiperSlide = document.createElement('div');
            divSwiperWrapper.appendChild(divSwiperSlide);
            divSwiperSlide.classList.add('swiper-slide');

            const img = document.createElement('img');
            divSwiperSlide.appendChild(img);
            img.className = 'w100p_mw614';
            img.src = `/static/img/feed/${item.ifeed}/${imgObj.img}`;
        });

        //좋아요, 디엠 버튼 만드는 부분
        const divBtns = document.createElement('div');
        divContainer.appendChild(divBtns);
        divBtns.className = 'favCont p-3 d-flex flex-row';

        //좋아요
        const heartIcon = document.createElement('i');
        divBtns.appendChild(heartIcon);
        heartIcon.className = 'fa-heart pointer rem1_5 me-3';
        heartIcon.classList.add(item.isFav === 1 ? 'fas' : 'far');
        //좋아요 버튼 이벤트
        heartIcon.addEventListener('click', e => {
            let method = 'POST';
            if(item.isFav === 1) {  //delete
                method = 'DELETE';
            } 

            fetch(`/feed/fav/${item.ifeed}`, {
                'method': method,
            }).then(res => res.json())
            .then(res => {
                if(res.result) {
                    item.isFav = 1 - item.isFav;    //0 -> 1, 1 -> 0
                    if(item.isFav === 0) {  //좋아요 취소
                        heartIcon.classList.remove('fas');
                        heartIcon.classList.add('far');
                    } else {    //좋아요 처리
                        heartIcon.classList.remove('far');
                        heartIcon.classList.add('fas');
                    }
                } else {
                    alert('좋아요를 할 수 없습니다.');
                }
            }).catch(e => {
                alert('네트워크에 이상이 있습니다.');
            });
        });

        //dm
        const divDm = document.createElement('div');
        divBtns.appendChild(divDm);
        divDm.className = 'pointer';
        divDm.innerHTML = `<svg aria-label="다이렉트 메세지" class="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><line fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2" x1="22" x2="9.218" y1="3" y2="10.083"></line><polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></polygon></svg>`;

        //좋아요 갯수
        const divFav = document.createElement('div');
        divContainer.appendChild(divFav);
        divFav.className = 'ps-3 d-none';
        const spanFavCnt = document.createElement('span');
        divFav.appendChild(spanFavCnt);
        spanFavCnt.className = 'bold rem0_9';
        spanFavCnt.innerText = `좋아요 ${item.favCnt}개`;
        if(item.favCnt > 0) { divFav.classList.remove('d-none'); }

        //글 내용
        if(item.ctnt !== null && item.ctnt !== '') {
            const divCtnt = document.createElement('div');
            divContainer.appendChild(divCtnt);
            divCtnt.innerHTML = `
                <span class="pointer spanNick feedwin">${item.writer}</span>
                <span>${item.ctnt}</span>
                `;
            // divCtnt.innerText = item.ctnt;
            divCtnt.className = 'itemCtnt ps-3 pt-2';
        }

        //댓글 리스트
        const divCmtList = document.createElement('div');
        divContainer.appendChild(divCmtList);
        // divCmtList.className = 'ms-3';

        //댓글 더보기
        const divCmt = document.createElement('div');
        divContainer.appendChild(divCmt);

        if(item.cmt) {
            const divCmtItem = this.makeCmtItem(item.cmt);
            divCmtList.appendChild(divCmtItem);
            
            if(item.cmt.ismore === 1) {
                const divMoreCmt = document.createElement('div');
                divCmt.appendChild(divMoreCmt);
                divMoreCmt.className = 'ms-3 mb-3';
    
                const spanMoreCmt = document.createElement('span');
                divMoreCmt.appendChild(spanMoreCmt);
                spanMoreCmt.className = 'pointer rem0_9 c_lightgray';
                spanMoreCmt.innerText = '댓글 더보기..';
                spanMoreCmt.addEventListener('click', e => {
    
                });
            }
        } 

        //게시글 업로드한 시간
        const divDate = document.createElement('div');
        divContainer.appendChild(divDate);
        divDate.innerHTML = `<div class="reg_date p-3">${regDtInfo}</div>`;

        //댓글(innerHtml말고 appendChild로 만드는 방법)
        //댓글 폼
        const divCmtForm = document.createElement('div');
        divCmtForm.className = 'd-flex flex-row';
        divContainer.appendChild(divCmtForm);
        divCmtForm.innerHTML = `
            <input type="text" class="flex-grow-1 my_input p-2 back_color" placeholder="댓글을 입력하세요...">
            <button type="button" class="btn btn-outline-primary">게시</button>
        `;
        //댓글 게시 이벤트
        const inputCmt = divCmtForm.querySelector('input');
        const btnCmtReg = divCmtForm.querySelector('button');
        btnCmtReg.addEventListener('click', e => {
            const param = {
                ifeed: item.ifeed,
                cmt: inputCmt.value
            };
            fetch('/feedcmt/index', {
                method: 'POST',
                body: JSON.stringify(param)
            })
            .then(res => res.json())
            .then(res => {
                console.log('icmt : ' + res.result);
                if(res.result) {
                    inputCmt.value = '';
                    //댓글 공간에 댓글 내용 추가
                }
            });
        });

        //유저 프로필로 가는 부분
        const feedWinList = divContainer.querySelectorAll('.feedwin');
        feedWinList.forEach(el => {
            el.addEventListener('click', () => {
                moveToFeedWin(item.iuser);
            });
        });

        return divContainer;
    },
    //feedList 끝


    //새고했을 때 뜨는 로딩 이미지
    showLoading: function() { this.loadingElem.classList.remove('d-none'); },
    hideLoading: function() { this.loadingElem.classList.add('d-none'); }
}

function moveToFeedWin(iuser) {
    location.href = `/user/feedwin?iuser=${iuser}`;
}


(function () {
    const btnNewFeedModal = document.querySelector('#btnNewFeedModal');
    if(btnNewFeedModal) {
        const modal = document.querySelector('#newFeedModal');
        const body = modal.querySelector('#id-modal-body');
        const frmElem = modal.querySelector('form');
        const btnClose = modal.querySelector('.btn-close');
        //이미지 값이 변하면
        frmElem.imgs.addEventListener('change', function (e) {
            console.log(`length: ${e.target.files.length}`);
            if (e.target.files.length > 0) {
                body.innerHTML = `
                    <div>
                        <div class="d-flex flex-md-row">
                            <div class="flex-grow-1 h-full"><img id="id-img" class="w300"></div>
                            <div class="ms-1 w250 d-flex flex-column">                
                                <textarea placeholder="문구 입력..." class="flex-grow-1 p-1"></textarea>
                                <input type="text" placeholder="위치" class="mt-1 p-1">
                            </div>
                        </div>
                    </div>
                    <div class="mt-2">
                        <button type="button" class="btn btn-primary">공유하기</button>
                    </div>
                `;
                const imgElem = body.querySelector('#id-img');

                const imgSource = e.target.files[0];
                const reader = new FileReader();
                reader.readAsDataURL(imgSource);
                reader.onload = function () {
                    imgElem.src = reader.result;
                };

                const shareBtnElem = body.querySelector('button');
                shareBtnElem.addEventListener('click', function () {
                    const files = frmElem.imgs.files;

                    const fData = new FormData();   //ajax로 데이터 보낼때 FormData 사용
                    for (let i = 0; i < files.length; i++) {
                        fData.append('imgs[]', files[i]);
                    }
                    fData.append('ctnt', body.querySelector('textarea').value);
                    fData.append('location', body.querySelector('input[type=text]').value);

                    fetch('/feed/rest', {
                        method: 'post',
                        body: fData
                    }).then(res => res.json())
                        .then(myJson => {
                            // console.log(myJson);
                            if (myJson.result) {
                                btnClose.click();
                            }
                        });
                });
            }
        });

        btnNewFeedModal.addEventListener('click', function () {
            const selFromComBtn = document.createElement('button');
            selFromComBtn.type = 'button';
            selFromComBtn.className = 'btn btn-primary';
            selFromComBtn.innerText = '컴퓨터에서 선택';
            selFromComBtn.addEventListener('click', function () {
                frmElem.imgs.click();
            });
            body.innerHTML = null;
            body.appendChild(selFromComBtn);
        });
    }

})();