<?php

  $xslDoc = new DOMDocument('utf-8');
  $xslDoc->load("einkauf.xsl");

  $xmlDoc = new DOMDocument();
  $xmlDoc->loadXML(file_get_contents("./liste.xml"));

  $proc = new XSLTProcessor();
  $proc->importStylesheet($xslDoc);
  echo $proc->transformToXML($xmlDoc);

?>
