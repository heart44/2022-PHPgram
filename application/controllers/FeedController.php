<?php
namespace application\controllers;

class FeedController extends Controller {
    public function index() {
        $this->addAttribute(_JS, ["feed/index"]);
        $this->addAttribute(_MAIN, $this->getView("feed/index.php"));
        return "template/t1.php";
    }

    public function rest() {
        switch(getMethod()) {
            case _POST: 
                if(!is_array($_FILES) || !isset($_FILES['imgs'])) {
                    return ["result" => 0];
                }

                $location = $_POST["location"];
                $ctnt = $_POST["ctnt"];
                $iuser = getIuser();
                $param = [ 
                    "location" => $location, 
                    "ctnt" => $ctnt, 
                    "iuser" => $iuser, 
                ];
                $ifeed = $this->model->insFeed($param);
                
                $imgParam = ["ifeed" => $ifeed];
                foreach($_FILES['imgs']['name'] as $key => $originFileNm) {     
                    $saveDir = _IMG_PATH . "/feed/" . $ifeed;
                    if(!is_dir($saveDir)) {
                        mkdir($saveDir, 0777, true);
                    }
                    $tempName = $_FILES["imgs"]["tmp_name"][$key];
                    $randFileNm = getRandomFileNm($originFileNm);
                    if(move_uploaded_file($tempName, $saveDir . "/" . $randFileNm)) {
                        // chmod("C://Apache24/PHPgram/static/img/profile/1/test." . $ext, 0755);
                        $imgParam["img"] = $randFileNm;
                        $this->model->insFeedImg($imgParam);
                    }
                }

                return ["result" => 1];
            }
    }
}