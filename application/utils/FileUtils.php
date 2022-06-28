<?php
function getRandomFileNm($fileName) {
    return gen_uuid_v4() . "." . getExt($fileName);
}

function getExt($fileName) {
    // return end(explode(".", $fileName));                 //end : 배열의 마지막 요소 가져오는 함수
    return pathinfo($fileName, PATHINFO_EXTENSION);         //php에서 제공해주는 거래용
    // return substr($fileName, strrpos($fileName, "."));   //. 까지 같이 가져올 때 좋을 듯
}

function gen_uuid_v4() { 
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x'
        , mt_rand(0, 0xffff)
        , mt_rand(0, 0xffff)
        , mt_rand(0, 0xffff)
        , mt_rand(0, 0x0fff) | 0x4000
        , mt_rand(0, 0x3fff) | 0x8000
        , mt_rand(0, 0xffff)
        , mt_rand(0, 0xffff)
        , mt_rand(0, 0xffff) 
    ); 
}