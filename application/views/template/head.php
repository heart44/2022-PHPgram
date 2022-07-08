<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" type="image/x-icon" href="https://cdn.pixabay.com/photo/2021/06/15/12/17/instagram-6338401_960_720.png">
    <title><?= isset($this->title) ? $this->title : _SERVICE_NM ?></title>
    <link rel="stylesheet" href="/static/css/common.css">
    <?php 
        if(isset($this->css)) {
            foreach($this->css as $item) {
                $href = strpos($item, "http") === 0 ? $item : "/static/css/{$item}.css";
                echo "<link rel='stylesheet' href='{$href}'>
                ";
            }
        }
    ?>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
    <script src="https://kit.fontawesome.com/e0f2c51fd2.js" crossorigin="anonymous"></script>
    <script defer src="/static/js/ws.js"></script>
    <script defer src="/static/js/header.js"></script>
    <script defer src="/static/js/common.js"></script>
    <script defer src="/static/js/feed/common_feed.js"></script>

    <?php
        if(isset($this->js)) {
            foreach($this->js as $item) {
                $src = strpos($item, "http") === 0 ? $item : "/static/js/{$item}.js";
                echo "<script defer src='{$src}'></script>
                ";
            }
        }
    ?>
</head>
<div id="gData" data-loginiuser="<?=getIuser()?>" data-mainimg="<?=(isset(getLoginUser()->mainimg) ? getLoginUser()->mainimg : "")?>"></div>