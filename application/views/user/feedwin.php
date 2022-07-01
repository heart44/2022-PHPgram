<div class="d-flex flex-column align-items-center">
    <div class="size_box_100"></div>
    <div class="w100p_mw614">
        <div class="d-flex flex-row">
            <div class="d-flex flex-column justify-content-center">
                <div class="circleimg h150 w150 pointer feedwin">
                    <img id="imgModProfileModal" data-bs-toggle="modal" data-bs-target="#modProfileModal" src='/static/img/profile/<?= $this->data->iuser ?>/<?= $this->data->mainimg ?>' onerror='this.error=null;this.src="/static/img/profile/user.png"'>
                </div>
            </div>
            <div></div>
        </div>
    </div>
</div>

<!-- profile img update modal -->
<div class="modal fade" id="modProfileModal" tabindex="-1" aria-labelledby="modProfileModalLabel" aria-hidden="true">
    <div class="modal-dialog profile-dialog modal-dialog-centered modal-md">
        <div class="modal-content profile-content">
            <div class="modal-header justify-content-center">
                <h5 class="modal-title profile-title bold" id="modProfileModalLabel">프로필 사진 바꾸기</h5>
            </div>
            <div class="modal_item">
                <span class="bold pointer c_primary-button">사진 업로드</span>
            </div>
            <div class="modal_item">
                <span class="bold pointer c_error-or-destructive">현재 사진 삭제</span>
            </div>
            <div class="modal_item">
                <span class="pointer" data-bs-dismiss="modal">취소</span>
            </div>
        </div>
    </div>
</div>