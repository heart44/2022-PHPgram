<?php
namespace application\controllers;

use application\libs\Application;

class UserController extends Controller {
    public function signin() {      //로그인  
        switch(getMethod()) {
            case _GET:
                return "user/signin.php";   
            case _POST:
                $email = $_POST["email"];
                $pw = $_POST["pw"];
                $param = [ "email" => $email, ];
                $dbUser = $this->model->selUser($param);

                if(!$dbUser || !password_verify($pw, $dbUser->pw)) {
                    // echo "<script>alert('아이디, 비밀번호가 틀렸습니다.');</script>";
                    return "redirect:signin?email={$email}&err"; 
                }
                $dbUser->pw = null;
                $dbUser->regdt = null;
                $this->flash(_LOGINUSER, $dbUser);

                return "redirect:/feed/index";
        }
    }

    public function signup() {      //회원가입
        /*if(getMethod() === _GET) {
            return "user/signup.php";   
        } else if(getMethod() === _POST) {
            return "redirect:signin";
        }*/
        switch(getMethod()) {
            case _GET:
                return "user/signup.php";
            case _POST:
                $param = [
                    "email" => $_POST["email"],
                    "pw" => $_POST["pw"],
                    "nm" => $_POST["nm"],
                    "id" => $_POST["id"],
                ];
                $param["pw"] = password_hash($param["pw"], PASSWORD_BCRYPT);

                $this->model->insUser($param);
                
                return "redirect:signin";
        }
    }

    public function logout() {
        $this->flash(_LOGINUSER);
        return "redirect:/user/signin";
    }

    public function feedwin() {
        $iuser = isset($_GET["iuser"]) ? intval($_GET["iuser"]) : 0;
        $param = [ "feediuser" => $iuser, "loginiuser" => getIuser()];
        $this->addAttribute(_DATA, $this->model->selUserProfile($param));
        $this->addAttribute(_JS, ["user/feedwin", "https://unpkg.com/swiper@8/swiper-bundle.min.js"]);        
        $this->addAttribute(_CSS, ["user/feedwin", "https://unpkg.com/swiper@8/swiper-bundle.min.css", "feed/index"]);        
        $this->addAttribute(_MAIN, $this->getView("user/feedwin.php"));
        return "template/t1.php"; 
    }
    
    public function feed() {
        if(getMethod() === _GET) {
            $iuser = isset($_GET["iuser"]) ? intval($_GET["iuser"]) : 0;
            $page = 1;
            if (isset($_GET["page"])) {
                $page = intval($_GET["page"]);
            }
            $startIdx = ($page - 1) * _FEED_ITEM_CNT;
            $param = [
                "startIdx" => $startIdx,
                "toiuser" => $_GET["iuser"],
                "loginiuser" => getIuser()
            ];

            $list = $this->model->selFeedList($param);
            foreach ($list as $item) {
                $param2 = [ "ifeed" => $item->ifeed ];
                $item->imgList = Application::getModel("feed")->selFeedImgList($param2);
                $item->cmt = Application::getModel('feedcmt')->selFeedCmt($param2);
            }
            return $list;
        }
    }

    public function follow() {
        //fromiuser(세션에 있음), toiuser 필요
        $param = [ "fromiuser" => getIuser(), ];

        switch(getMethod()) {
            case _POST:      //팔로우
                $json = getJson();
                $param["toiuser"] = $json["toiuser"];
                return ["result" => $this->model->insFollow($param)];
            case _DELETE:    //팔로우 취소
                $param["toiuser"] = $_GET["toiuser"];
                return ["result" => $this->model->delFollow($param)];
        }
    }

    public function profile() {
        switch(getMethod()) {
            case _POST:
                foreach($_FILES['imgs']['name'] as $key => $originFileNm) {
                    $saveDir = _IMG_PATH . "/profile/" . getIuser();
                    $path = "static/img/profile/" . getMainimgSrc();
                    unlink($path);
                    
                    $tempName = $_FILES["imgs"]["tmp_name"][$key];
                    $randFileNm = getRandomFileNm($originFileNm);
                    if(move_uploaded_file($tempName, $saveDir . "/" . $randFileNm)) {
                        $imgParam = ["mainimg" => $randFileNm, "iuser" => getIuser()];
                        $this->model->updUser($imgParam);
                        getLoginUser()->mainimg = $randFileNm;
                    }
                }
                return [_RESULT => $randFileNm];
            case _DELETE:
                $loginUser = getLoginUser();
                if($loginUser && $loginUser->mainimg) {
                    $path = "static/img/profile/" . getMainimgSrc();
                    // $path = "static/img/profile/{$loginUser->iuser}/{$loginUser->mainimg}";
                    if(file_exists($path) && unlink($path)) {
                        $param = [ "iuser" => $loginUser->iuser, "delMainImg" => 1 ];
                        if($this->model->updUser($param)) {
                            $loginUser->mainimg = null;
                            return [_RESULT => 1];
                        }
                    }
                }
                return [_RESULT => 0];
        }
    }
}