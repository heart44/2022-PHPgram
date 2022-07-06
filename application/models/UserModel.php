<?php
namespace application\models;
use PDO;

//$pdo -> lastInsertId();

class UserModel extends Model {
    public function insUser(&$param) {
        $sql = "INSERT INTO t_user
                ( email, pw, nm, id ) 
                VALUES 
                ( :email, :pw, :nm, :id )";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":email", $param["email"]);
        $stmt->bindValue(":pw", $param["pw"]);
        $stmt->bindValue(":nm", $param["nm"]);
        $stmt->bindValue(":id", $param["id"]);
        $stmt->execute();
        return $stmt->rowCount();

    }
    public function selUser(&$param) {
        $sql = "SELECT * FROM t_user
                WHERE email = :email";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":email", $param["email"]);        
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_OBJ);
    }
    
    public function selUserProfile(&$param) {
        $feediuser = $param["feediuser"];
        $loginiuser = $param["loginiuser"];
        $sql = "SELECT *, (SELECT COUNT(ifeed) FROM t_feed WHERE iuser = {$feediuser}) AS feedcnt
                    , (SELECT COUNT(toiuser) FROM t_user_follow WHERE toiuser = {$feediuser}) AS followercnt
                    , (SELECT COUNT(fromiuser) FROM t_user_follow WHERE fromiuser = {$feediuser}) AS followingcnt
                    , (SELECT COUNT(fromiuser) FROM t_user_follow WHERE fromiuser = {$feediuser} AND toiuser = {$loginiuser}) AS youme
                    , (SELECT COUNT(fromiuser) FROM t_user_follow WHERE fromiuser = {$loginiuser} AND toiuser = {$feediuser}) AS meyou
                FROM t_user
                WHERE iuser = {$feediuser}";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        // $stmt->execute([$param["iuser"], $param["iuser"]]); //이렇게도 가능
        
        return $stmt->fetch(PDO::FETCH_OBJ);
    }

    public function updUser(&$param) {
        $sql = "UPDATE t_user 
                SET moddt = now()";
        if(isset($param["mainimg"])) {
            $mainimg = $param["mainimg"];
            $sql .= ", mainimg = {$mainimg}";
        }
        if(isset($param["delMainImg"])) {
            $sql .= ", mainimg = null";
        }
        $sql .= " WHERE iuser = :iuser";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":iuser", $param["iuser"]);
        $stmt->execute();

        return $stmt->rowCount();
    }

    //-------- 밑으로는 Follow --------
    public function insFollow(&$param) {
        $sql = "INSERT INTO t_user_follow (fromiuser, toiuser)
                VALUES (?, ?)";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(1, $param["fromiuser"]);
        $stmt->bindValue(2, $param["toiuser"]);
        $stmt->execute();

        return $stmt->rowCount();
    }

    public function delFollow(&$param) {
        $sql = "DELETE FROM t_user_follow
                WHERE fromiuser = ? and toiuser = ?";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(1, $param["fromiuser"]);
        $stmt->bindValue(2, $param["toiuser"]);
        $stmt->execute();

        return $stmt->rowCount();
    }

    //-------- 밑으로는 Feed --------
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
                    WHERE iuser = :loginiuser
                ) f
                ON a.ifeed = f.ifeed
                WHERE c.iuser = :toiuser
                ORDER BY a.ifeed DESC
                LIMIT :startIdx, :feedItemCnt";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":toiuser", $param["toiuser"]);
        $stmt->bindValue(":loginiuser", $param["loginiuser"]);
        $stmt->bindValue(":startIdx", $param["startIdx"]);
        $stmt->bindValue(":feedItemCnt", _FEED_ITEM_CNT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    //-------- 밑으로는 user 프로필 사진 --------
    
}