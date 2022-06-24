<!DOCTYPE html>
<html lang="en">
<?php include_once "application/views/template/head.php"; ?>

<body>
    <div class="container">
        <header><?php include_once "application/views/template/header.php"; ?></header>
        <main><?php include_once $this->main;?></main>
        <footer><?php include_once "application/views/template/footer.php";?></footer>
    </div>
</body>
</html>