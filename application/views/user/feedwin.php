<div id="lData" data-toiuser="<?= $this->data->iuser ?>"></div>
<div class="d-flex flex-column align-items-center">
    <div class="size_box_100"></div>
    <div class="w100p_mw614">
        <div class="d-flex flkex-row">
            <div class="d-flex flex-column justify-content-center me-3">
                <div class="circleimg h150 w150 pointer feedwin">
                    <img class="profileimg" id="btnChangeProfileModal" data-bs-toggle="modal" data-bs-target="#changeProfileImgModal" src='/static/img/profile/<?= $this->data->iuser ?>/<?= $this->data->mainimg ?>' onerror='this.error=null;this.src="/static/img/profile/user.png"'>
                </div>
            </div>
            <div class="flex-grow-1 d-flex flex-column justify-content-evenly">
                <div><?= $this->data->id ?>
                    <!-- <?php 
                        if(getIuser() === $this->data->iuser) { ?>
                            <button type="button" id="btnModProfile" class="btn btn-outline-secondary">프로필 수정</button>
                    <?php } else {
                            $youme = $this->data->youme;
                            $meyou = $this->data->meyou;

                            if($youme === 1 && $meyou === 0) { ?>
                                <button type="button" id="btnFollow" data-youme="<?= $youme ?>" data-follow="0" class="btn btn-primary">맞팔로우 하기</button>
                        <?php } else if($youme === 0 && $meyou === 0) { ?>
                                <button type="button" id="btnFollow" data-youme="<?= $youme ?>" data-follow="0" class="btn btn-primary">팔로우</button>
                        <?php } else if(($youme === 1 && $meyou === 1) || ($youme === 0 && $meyou === 1)) { ?>
                                <button type="button" id="btnFollow" data-youme="<?= $youme ?>" data-follow="1" class="btn btn-secondary">팔로우 취소</button>
                        <?php } ?>
                    <?php } ?> -->
                            

                    <!-- 강사님 소스 -->
                    <?php
                        if($this->data->iuser === getIuser()) {
                            echo '<button type="button" id="btnModProfile" class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#changeProfileModal">프로필 수정</button>';
                        } else {
                            $youme = $this->data->youme;
                            $meyou = $this->data->meyou;
                            
                            $data_follow = 0;
                            $cls = "btn-primary";
                            $txt = "팔로우";

                            if($meyou === 1) {
                                $data_follow = 1;
                                $cls = "btn-outline-secondary";
                                $txt = "팔로우 취소";
                            } else if($youme === 1 && $meyou === 0) {
                                $txt = "맞팔로우 하기";
                            } ?>
                            <button type="button" id="btnFollow" data-youme="<?= $youme ?>" data-follow="<?= $data_follow ?>" class="btn <?= $cls ?>"><?= $txt ?></button>
                        <?php } 
                    ?>
                </div>
                <div class="d-flex flex-row">
                    <div class="flex-grow-1 me-3">게시물 <span id="myPost" class="bold"><?= $this->data->feedcnt ?></span></div>
                    <div class="flex-grow-1 me-3">팔로워 <span id="follower" class="bold" data-follower="<?= $this->data->followercnt ?>"><?= $this->data->followercnt ?></span></div>
                    <div class="flex-grow-1">팔로잉 <span class="bold"><?= $this->data->followingcnt ?></span></div>
                </div>
                <div class="bold"><?= $this->data->nm ?></div>
                <div><?= $this->data->cmt ?></div>
            </div>
        </div>
        <br>
        <hr>
        <br>
        <div id="item_container"></div>
    </div>
    <div class="loading d-none"><img src="/static/img/loading.gif"></div>
</div>

<!-- profile img update modal -->
<?php if($this->data->iuser === getIuser()) { ?>
<div class="modal fade" id="changeProfileImgModal" tabindex="-1" aria-labelledby="changeProfileImgModalLabel" aria-hidden="true">
    <div class="modal-dialog profile-dialog modal-dialog-centered modal-md">
        <div class="modal-content profile-content">
            <div class="modal-header justify-content-center">
                <h5 class="modal-title profile-title bold" id="changeProfileImgModalLabel">프로필 사진 바꾸기</h5>
            </div>
            <div class="modal_item" data-bs-target="#changeProfileImg" data-bs-toggle="modal" id="btnUpdProfilePic">
                <span class="bold pointer c_primary-button">사진 업로드</span>
            </div>
            <div class="modal_item <?= $this->data->mainimg ? "" : "d-none" ?>" id="btnDelCurrentProfileItem">
                <span id="btnDelCurrentProfilePic" class="bold pointer c_error-or-destructive">현재 사진 삭제</span>
            </div>
            <div class="modal_item">
                <span class="pointer" id="btnProfileImgModalClose" data-bs-dismiss="modal">취소</span>
            </div>
        </div>
        <form class="d-none">
            <input type="file" accept="image/*" name="imgs">
        </form>
    </div>
</div>
<?php } ?>

<!-- 사진 업로드 시 모달창 한 번 더 띄움 -->
<div class="modal fade" id="changeProfileImg" tabindex="-1" aria-labelledby="changeProfileImgLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title profile-title bold" id="changeProfileImgLabel">사진 업로드</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center">
                <div class="circleimg h300 w300 pointer">
                <img id="currentProfileImg" class="profileimg"
                    src="/static/img/profile/<?= $this->data->iuser ?>/<?= $this->data->mainimg ?>"
                    onerror='this.error=null;this.src="/static/img/profile/user.png"'>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" id="changeBtn">저장</button>
            </div>
        </div>
        <form class="d-none">
            <input type="file" accept="image/*" name="imgs">
        </form>
    </div>
</div>

<!-- 프로필 수정 -->
<div class="modal fade" id="changeProfileModal" tabindex="-1" aria-labelledby="changeProfileImgModalLabel" aria-hidden="true">
    <div class="modal-dialog profile-dialog modal-dialog-centered modal-md">
        <div class="modal-content profile-content">
            <div class="modal-header justify-content-center">
                <h5 class="modal-title profile-title bold" id="changeProfileImgModalLabel">프로필 수정</h5>
            </div>
            <div class="modal_item flex-column" id="">
                <span class="bold">아이디 변경</span>
                <input type="text" name="modId" value="<?= $this->data->id ?>">
            </div>
            <div class="modal_item" id="">
                <span class="bold">상태 메세지 변경</span>
                <textarea name="" id="" cols="30" rows="10"><?= $this->data->cmt ?></textarea>
            </div>
            <div class="modal_item justify-content-around">
                <span class="pointer" id="btnProfileImgModalClose" data-bs-dismiss="modal">취소</span>
                <span class="pointer">확인</span>
            </div>
        </div>
    </div>
</div>