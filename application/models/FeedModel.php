<?php
namespace application\models;
use PDO;

class FeedModel extends Model { 
    public function insFeed(&$param) {
        $sql = "INSERT INTO t_feed (location, ctnt, iuser)
                VALUES (:location, :ctnt, :iuser)";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":location", $param["location"]);
        $stmt->bindValue(":ctnt", $param["ctnt"]);
        $stmt->bindValue(":iuser", $param["iuser"]);
        $stmt->execute();

        return intval($this->pdo->lastInsertId());
    }

    public function insFeedImg(&$param) {
        $sql = "INSERT INTO t_feed_img (ifeed, img)
                VALUES (:ifeed, :img)";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":ifeed", $param["ifeed"]);
        $stmt->bindValue(":img", $param["img"]);
        $stmt->execute();

        return $stmt->rowCount();
    }

    public function selFeedList(&$param) {
        $sql = "SELECT a.*, c.id AS writer, c.mainimg
                    , IFNULL(e.cnt, 0) AS favCnt
                    , IF(f.ifeed IS NULL, 0, 1) AS isFav
                FROM t_feed a
                INNER JOIN t_user c
                ON a.iuser = c.iuser
                LEFT JOIN (
                    SELECT ifeed, COUNT(ifeed) AS cnt, iuser
                    FROM t_feed_fav
                    GROUP BY ifeed
                ) e
                ON a.ifeed = e.ifeed
                LEFT JOIN (
                    SELECT ifeed
                    FROM t_feed_fav
                    WHERE iuser = :iuser
                ) f
                ON a.ifeed = f.ifeed
                ORDER BY a.ifeed DESC
                LIMIT :startIdx, :feedItemCnt";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":iuser", $param["iuser"]);
        $stmt->bindValue(":startIdx", $param["startIdx"]);
        $stmt->bindValue(":feedItemCnt", _FEED_ITEM_CNT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    public function selFeedImgList($param) {
        $sql = "SELECT img FROM t_feed_img
                WHERE ifeed = :ifeed";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":ifeed", $param->ifeed);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    //-------- 밑으로는 Fav --------
    public function insFeedFav(&$param) {
        $sql = "INSERT INTO t_feed_fav (ifeed, iuser)
                VALUES (:ifeed, :iuser)";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":ifeed", $param["ifeed"]);
        $stmt->bindValue(":iuser", $param["iuser"]);
        $stmt->execute();

        return $stmt->rowCount();
    }

    public function delFeedFav(&$param) {
        $sql = "DELETE FROM t_feed_fav
                WHERE ifeed = :ifeed and iuser = :iuser";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":ifeed", $param["ifeed"]);
        $stmt->bindValue(":iuser", $param["iuser"]);
        $stmt->execute();

        return $stmt->rowCount();
    }
}