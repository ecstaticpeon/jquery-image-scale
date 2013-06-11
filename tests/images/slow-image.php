<?php

sleep(3);
header('content-type: image/jpeg');
print file_get_contents('wide.jpg');