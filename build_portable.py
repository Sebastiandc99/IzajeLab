from pathlib import Path
import re
root=Path(__file__).resolve().parent
html=(root/'index.html').read_text()
css=(root/'styles.css').read_text()
js=(root/'data.js').read_text()+'\n'+(root/'engine.js').read_text()+'\n'+(root/'field.js').read_text()+'\n'+(root/'planning.js').read_text()+'\n'+(root/'estimation.js').read_text()+'\n'+(root/'rigging.js').read_text()+'\n'+(root/'app.js').read_text()
js=re.sub(r'^import .*?;\s*$', '',js,flags=re.MULTILINE)
js=re.sub(r'\bexport\s+(?=const|function)', '', js)
js=re.sub(r"if\('serviceWorker'.*?;\s*$", '',js,flags=re.MULTILINE)
js=js.replace('</script','<\\/script')
html=html.replace('<link rel="stylesheet" href="styles.css">','<style>'+css+'</style>')
html=re.sub(r'<link rel="(?:icon|manifest)"[^>]+>', '', html)
html=html.replace('<script type="module" src="app.js"></script>','<script>'+js+'</script>')
(root/'IzajeLab-portable.html').write_text(html)
print('Generado: IzajeLab-portable.html')
