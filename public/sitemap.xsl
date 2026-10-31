<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
<xsl:template match="/">
<html lang="tr">
<head>
  <meta charset="utf-8"/>
  <title>Sitemap · True EDigital Marketing</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#0E0E10;color:#EDEAE3;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,sans-serif;
         font-size:14px;line-height:1.5;padding:56px 40px}
    .wrap{max-width:1180px;margin:0 auto}
    .kick{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;letter-spacing:.22em;
          text-transform:uppercase;color:#7C7970}
    h1{font-size:34px;font-weight:800;letter-spacing:-.03em;margin:14px 0 8px}
    .lead{color:#9B978D;max-width:640px}
    .stats{display:flex;gap:40px;margin:32px 0 8px;padding:20px 0;border-top:1px solid rgba(237,234,227,.16);
           border-bottom:1px solid rgba(237,234,227,.16);flex-wrap:wrap}
    .stat b{display:block;font-size:26px;font-weight:800;letter-spacing:-.02em}
    .stat span{font-family:ui-monospace,monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#7C7970}
    table{width:100%;border-collapse:collapse;margin-top:26px}
    th{text-align:left;font-family:ui-monospace,monospace;font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;
       color:#7C7970;font-weight:500;padding:0 14px 12px 0;border-bottom:1px solid rgba(237,234,227,.22)}
    td{padding:13px 14px 13px 0;border-bottom:1px solid rgba(237,234,227,.08);vertical-align:top}
    td.num{font-family:ui-monospace,monospace;font-variant-numeric:tabular-nums;color:#9B978D;white-space:nowrap}
    a{color:#A79BFF;text-decoration:none;word-break:break-all}
    a:hover{color:#C9C0FF;text-decoration:underline}
    .pill{display:inline-block;font-family:ui-monospace,monospace;font-size:10px;letter-spacing:.1em;
          text-transform:uppercase;padding:2px 7px;border:1px solid rgba(237,234,227,.26);border-radius:3px;
          color:#9B978D;margin-right:4px}
    .p1{color:#8E7BFF;border-color:#8E7BFF}
    footer{margin-top:36px;padding-top:18px;border-top:1px solid rgba(237,234,227,.16);
           font-family:ui-monospace,monospace;font-size:11px;color:#7C7970;display:flex;justify-content:space-between}
  </style>
</head>
<body><div class="wrap">
  <div class="kick">XML Sitemap</div>
  <h1>True EDigital Marketing</h1>
  <p class="lead">Bu dosya arama motorları için hazırlanmıştır. Her satır bir sayfayı, yanındaki diller o sayfanın
  çevirilerini gösterir. Google bu listeyi okuyarak sayfaları keşfeder ve hangi dilin hangi ülkeye ait olduğunu anlar.</p>

  <div class="stats">
    <div class="stat"><b><xsl:value-of select="count(s:urlset/s:url)"/></b><span>Toplam adres</span></div>
    <div class="stat"><b><xsl:value-of select="count(s:urlset/s:url/xhtml:link)"/></b><span>Dil bağlantısı</span></div>
    <div class="stat"><b><xsl:value-of select="count(s:urlset/s:url[s:priority='1'])"/></b><span>Öncelik 1,0</span></div>
    <div class="stat"><b><xsl:value-of select="count(s:urlset/s:url[s:lastmod])"/></b><span>Tarihli</span></div>
  </div>

  <table>
    <tr><th style="width:52%">Adres</th><th>Diller</th><th>Son güncelleme</th><th>Öncelik</th></tr>
    <xsl:for-each select="s:urlset/s:url">
      <tr>
        <td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
        <td>
          <xsl:for-each select="xhtml:link">
            <span class="pill"><xsl:value-of select="@hreflang"/></span>
          </xsl:for-each>
          <xsl:if test="not(xhtml:link)"><span style="color:#5C5A54">—</span></xsl:if>
        </td>
        <td class="num"><xsl:value-of select="substring(s:lastmod,1,10)"/></td>
        <td class="num">
          <xsl:choose>
            <xsl:when test="s:priority='1'"><span class="pill p1"><xsl:value-of select="s:priority"/></span></xsl:when>
            <xsl:otherwise><xsl:value-of select="s:priority"/></xsl:otherwise>
          </xsl:choose>
        </td>
      </tr>
    </xsl:for-each>
  </table>

  <footer>
    <span>etruemarketing.com</span>
    <span>sitemaps.org protokolü · 0.9</span>
  </footer>
</div></body>
</html>
</xsl:template>
</xsl:stylesheet>
