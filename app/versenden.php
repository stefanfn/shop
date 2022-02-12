<?php
  $list = "";
  $comment = "";
  foreach ($_GET as $k => $v) {
    // number and item name
    if (intval($v) > 0) {
      if (isset($_GET['select_' . $k])) {
        $list .= "\n" . $v . " x " . $_GET['select_' . $k];
      } else {
        $list .= "\n" . $v . " x " . $k;
      }
    }
    // item comment
    if (substr($k, 0, 5) == 'text_' && $v != '') {
      $list .= " (" . $v . ")";
    }
    // final text to be appended last
    if ($k == 'comment' && $v != '' && $v != 'Bla') {
      $comment = "\nKommentar:\n" . $v . "\n";
    }
  }
  $list .= $comment;

  $to='stefan.sassenberg@gmx.de';
  $envelopeTo='stefan.sassenberg@gmx.de';
  $subject='Einkaufen';
  $hdr_to="An: $envelopeTo";
  $hdr_from="From: coolmule.de <stefan.sassenberg@gmx.de>";
  $hdr_mime="MIME-Version: 1.0";
  $hdr_encoding="Content-Type: text/plain; charset=utf-8";
  mail(
    $to,
    $subject,
    $list,
    "$hdr_to\n$hdr_from\n$hdr_mime\n$hdr_encoding\n"
  );
  echo "Viel Spa&szlig; beim Einkaufen";
?>
