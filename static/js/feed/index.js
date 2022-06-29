(function() {
    const btnNewFeedModal = document.querySelector('#btnNewFeedModal');
    if(btnNewFeedModal) {
        const modal = document.querySelector('#newFeedModal');
        const body =  modal.querySelector('#id-modal-body');
        const frmElem = modal.querySelector('form');
        const closeBtn = modal.querySelector('.btn-close');

        //이미지 값이 변하면
        frmElem.imgs.addEventListener('change', function(e) {
            if(e.target.files.length > 0) {
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
                reader.onload = function() {
                    imgElem.src = reader.result;
                };

                const shareBtnElem = body.querySelector('button');
                shareBtnElem.addEventListener('click', function() {
                    const files = frmElem.imgs.files;

                    const fData = new FormData();   //ajax로 데이터 보낼때 FormData 사용
                    for(let i=0; i<files.length; i++) {
                        fData.append('imgs[]', files[i]);
                    }
                    fData.append('ctnt', body.querySelector('textarea').value);
                    fData.append('location', body.querySelector('input[type=text]').value);

                    fetch('/feed/rest', {
                        method: 'post',
                        body: fData
                    }).then(res => res.json())
                        .then(myJson => {
                            console.log(myJson);
                            
                            if(myJson.result) {
                                closeBtn.click();
                            }
                        });
                });
            }
        });

        btnNewFeedModal.addEventListener('click', function() {
            const selFromComBtn = document.createElement('button');
            selFromComBtn.type = 'button';
            selFromComBtn.className = 'btn btn-primary';
            selFromComBtn.innerText = '컴퓨터에서 선택';
            selFromComBtn.addEventListener('click', function() {
                frmElem.imgs.click();
            });
            body.innerHTML = null;
            body.appendChild(selFromComBtn);
        });
    }

    const feedObj = {
        limit: 20,
        itemLength: 0,
        currentPage: 1,
        loadingElem: document.querySelector('.loading'),
        containerElem: document.querySelector('#item_container'),

        //list 가져오는 통신 부분
        getFeedList: function() {
            this.showLoading();
            const param = { page: this.currentPage++ };
            fetch('/feed/rest' + encodeQueryString(param))
            .then(res => res.json())
            .then(list => {
                // console.log(list);
                this.makeFeedList(list);
            })
            .catch(e => {
                console.error(e);
                this.hideLoading();
            });
        },
        makeFeedList: function(list) {
            if(list.length !== 0) {
                list.forEach(item => {
                    const divItem = this.makeFeedItem(item);
                    this.containerElem.appendChild(divItem);
                });
            }
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
                <div class="d-flex flex-column justify-content-center"><div class="circleimg h40 w40">${writerImg}</div></div>
                    <div class="p-3 flex-grow-1">
                        <div>
                            <span class="pointer" onclick="moveToProfile(${item.iuser});">${item.writer} - ${regDtInfo}</span>
                        </div>
                    <div>${item.location === null ? '' : item.location}</div>
                </div>
            `;

            const divImgSwiper = document.createElement('div');
            divContainer.appendChild(divImgSwiper);
            divImgSwiper.className = 'swiper item_img';
            divImgSwiper.innerHTML = `
                <div class="swiper-wrapper"></div>
                <div class="swiper-pagination"></div>
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
            `;
            const divSwiperWrapper = divImgSwiper.querySelector('.swiper-wrapper');
            //imgList는 for문 돌릴 예정
            const imgObj = item.imgList[0];
            const divSwiperSlide = document.createElement('div');
            divSwiperWrapper.appendChild(divSwiperSlide);
            divSwiperSlide.classList.add('swiper-slide');

            const img = document.createElement('img');
            divSwiperSlide.appendChild(img);
            img.className = 'w614';
            img.src = `/static/img/feed/${item.ifeed}/${imgObj.img}`;

            return divContainer;
        },

        showLoading: function() { this.loadingElem.classList.remove('d-none'); },
        hideLoading: function() { this.loadingElem.classList.add('d-none'); }
    }

    feedObj.getFeedList();

})();