<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns="http://www.w3.org/TR/xhtml1/strict">
  <xsl:output method="html" encoding="utf-8" indent="yes" />
  <xsl:template match="/">
    <html>
      <head>
        <title>Einkaufszettel schreiben</title>
	<meta name="HandheldFriendly" content="true" />
	<!--meta name="viewport" content="width=device-width, height=device-height, user-scalable=no" /-->
	<meta name="viewport" content="width=device-width, height=device-height" />
        <link href="einkauf.css" rel="stylesheet" type="text/css" />
	<script type="text/javascript">
function count(id, up) {
  var element = document.getElementById(id);
  if (up == undefined) {
    element.value++;
  } else if (up) {
    element.value++;
  } else {
    element.value--;
  }
}
        </script>
      </head>
      <body>
        <form action="versenden.php" method="GET">
          <table cols="4">
	    <xsl:apply-templates/>
          </table>
	  <textarea name="comment">Bla</textarea>
	  <br/>
	  <input type="submit" value="Versenden"/>
	</form>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="items/item">

    <xsl:variable name="content">
      <xsl:choose>
        <xsl:when test="string(@title)"><xsl:value-of select="@title"/></xsl:when>
        <xsl:otherwise><xsl:value-of select='.'/></xsl:otherwise>
      </xsl:choose>
    </xsl:variable>

    <tr>
      <td>
        <xsl:value-of select="$content"/>
      </td>
      <!-- less button -->
      <td rowspan="2">
        <input type="button" value="-" style="padding: 9px 9px 9px 9px">
          <xsl:attribute name="name">
            <xsl:value-of select='$content'/>
          </xsl:attribute>
          <xsl:attribute name="onclick">
            <xsl:value-of select="concat('count(&quot;', $content, '&quot;', ', ', 'false', ')')"/>
          </xsl:attribute>
        </input>
      </td>
      <td rowspan="2">
        <input type="text" size="1" maxlength="2" style="padding: 9px 9px 9px 9px">
          <xsl:attribute name="id">
            <xsl:value-of select="$content"/>
          </xsl:attribute>
          <xsl:attribute name="name">
            <xsl:value-of select="$content"/>
          </xsl:attribute>
          <xsl:attribute name="value">
	    <xsl:choose>
	      <xsl:when test="@amount">
	        <xsl:value-of select="@amount"/>
          </xsl:when>
	      <xsl:otherwise>
	        <xsl:value-of select="0"/>
          </xsl:otherwise>
	    </xsl:choose>
          </xsl:attribute>
        </input>
      </td>
      <!-- more button -->
      <td rowspan="2">
        <input type="button" value="+" style="padding: 9px 9px 9px 9px">
          <xsl:attribute name="name">
            <xsl:value-of select='$content'/>
          </xsl:attribute>
          <xsl:attribute name="onclick">
            <xsl:value-of select="concat('count(&quot;', $content, '&quot;', ')')"/>
          </xsl:attribute>
        </input>
      </td>
    </tr>
    <tr>
      <td>
        <xsl:choose>
          <xsl:when test="./subitem">
            <select>
              <xsl:for-each select="./subitem">
                <option value="{.}"><xsl:value-of select="."/></option>
              </xsl:for-each>
            </select>
          </xsl:when>
          <xsl:otherwise>
            <input type="text">
              <xsl:attribute name="id">
                <xsl:value-of select="concat('text_', $content)"/>
              </xsl:attribute>
              <xsl:attribute name="name">
                <xsl:value-of select="concat('text_', $content)"/>
              </xsl:attribute>
              <xsl:attribute name="value"/>
            </input>
          </xsl:otherwise>
        </xsl:choose>
      </td>
    </tr>
  </xsl:template>
</xsl:stylesheet>
