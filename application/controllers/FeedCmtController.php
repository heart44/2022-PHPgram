<?php
namespace application\controllers;

class FeedCmtController extends Controller {
    public function index() {
        switch(getMethod()) {
            case _POST:
                $json = getJson();
                $json["iuser"] = getIuser();
                
                return [_RESULT => $this->model->insFeedCmt($json)];
        }
    }
}