#!/usr/bin/python

import PIL.Image
import sys

# 
def mktable(n):
    t = []
    for i in range(0,n):
        row = []
        for j in range(0,n):
            row.append((i*j)%n)
        t.append(row)
    return t


# from tilly
#----------
# 0 - black
# 1 - white
# 2 - dark blue
# 3 - drab orangey pink
# 4 - forest green
# 5 - orange/peanut butter
# 6 - royal blue
# 7 - yellowy green
# 8 - deep red
# 9 - purple

# The double digits don't seem to have their own color--just a combo
# of the digits. For what it's worth, 4 and 5 (and to some extent 2)
# coincide with billiard balls.

colors = [
    (0x00,0x00,0x00), # 0 - black
    (0xff,0xff,0xff), # 1 - white
    (0x00,0x00,0x40), # 2 - dark blue
    (0xff,0x77,0x57), # 3 - drab orangey pink
    (0x00,0x80,0x0f), # 4 - forest green
    (0xff,0x65,0x00), # 5 - orange/peanut butter
    (0x00,0x00,0x80), # 6 - royal blue
    (0xb0,0xd0,0x30), # 7 - yellowy green
    (0xd0,0x40,0x20), # 8 - deep red
    (0xb0,0x40,0xa0), # 9 - purple
    (0x80,0x80,0x80)  # 10 - yellow (from dkg)
]

def invertcolor(c):
    if c == (0x80,0x80,0x80):
        return (0,0,0) # special case to avoid grey-on-gray
    return (0xff-c[0],0xff-c[1],0xff-c[2])

jscolors=[]
jsinvcolors=[]
palette = []
for c in colors:
    for i in [0,1,2]:
        palette.append(c[i])
    jscolors.append("'#%02x%02x%02x'"%(c))
    jsinvcolors.append("'#%02x%02x%02x'"%(invertcolor(c)))


def mkimage(n, blksize=30):
    t = mktable(n)
    image = PIL.Image.new("P", (n*blksize,n*blksize), None)
    image.putpalette(palette)
    i = 0
    for row in t:
        j = 0
        for v in row:
            image.paste(v, (blksize*i,blksize*j,blksize*(i+1),blksize*(j+1)))
            j += 1
        i += 1
    return image


html = '''
<html>
<head>
<meta charset="utf-8">
<title>
modquilt {max}
</title>
<style type="text/css">
  body {{
    background: black;
  }}
  div {{
   color: white;
   text-shadow: black 2px 2px 1px, black -2px 2px 1px, black -2px -2px 1px, black 2px -2px 1px, black 0px 2px 1px, black 2px 0px 1px, black 0px -2px 1px, black -2px 0px 1px;
   text-align: center;
  }}
  #modulus {{
    font-size: 200px;
    font-weight: bold;
    margin: auto;
    cursor: pointer;
  }}
  span#buttons {{
   background-color: #aaa;
   border-radius: 2em;
   padding: 1em;
   margin-left: auto;
   margin-right: auto;
 }}
 button {{
   border-radius: 1em;
   padding: 0.5em;
   cursor: pointer;
   border: none;
   background: none;
 }}
 button#hover {{
  background: yellow;
 }}
  button span {{
    cursor: pointer;
  }}
</style>
<script type="text/javascript">
  var min = 2;
  var max = {max};
  var colors = [{jscolors}];
  var invcolors = [{jsinvcolors}];

  var m = max;

  var newshadow = function(c,pix,blur) {{
    var ret = '';
    for (var i = -pix; i <= pix; i+= pix) {{
      for (var j = -pix; j <= pix; j+= pix) {{
        ret += c + " " + i + "px " + j + "px " + blur + "px, ";
      }}
    }}
    return ret + "0px 0px";
  }}

  var trigger = function(off) {{
  m = (m + off - min)%((max-min)+1) + min;
  if (m < min) {{
    m += (max-min)+1;
  }}
  document.body.style.backgroundImage = "url(modquilt-" + m + ".png)";
  document.body.style.backgroundPosition = "50% 50%";
  var modtext = document.getElementById("modulus");
  modtext.innerHTML = m;
//  modtext.style.color = colors[m];
//  modtext.style.textShadow = newshadow(invcolors[m],2,1);
  }}

  document.onkeypress = function(k) {{
   
  }}
</script>
</head>
<body onload="trigger(1);">
  <div id="modulus" onclick="trigger(1);"> </div>
  <div><span id="buttons"><button onclick="trigger(-1);" title="back">&lt;&lt;</button> <button onclick="trigger(1);" title="forward">&gt;&gt;</button></span></div>
</body>
</html>
'''


for m in range(2, len(colors)+1):
    im = mkimage(m)
    im.save("modquilt-%d.png"%(m,))

f = open('modquilt.html', 'w')
f.write(html.format(max=len(colors), jscolors=','.join(jscolors) , jsinvcolors= ','.join(jsinvcolors) ))
f.close()
