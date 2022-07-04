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
                "iuser" => $iuser,
            ];

            $list = $this->model->selFeedList($param);
            foreach ($list as $item) {
                $item->imgList = Application::getModel("feed")->selFeedImgList($item);
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
}