// Cloudflare Worker: 百家姓暗号转换工具
// 部署: wrangler deploy

const HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>百家姓暗号转换</title>
<style>
:root {
  --bg:#fafafa;--surface:#fff;--surface2:#f4f4f5;--border:#e4e4e7;
  --text:#18181b;--text-sub:#52525b;--text-muted:#71717a;
  --primary:#18181b;--accent:#3b82f6;--accent-light:#eff6ff;
  --danger:#ef4444;--success:#22c55e;--radius:10px;--shadow:0 1px 3px rgba(0,0,0,.05);
  --font:-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei','Noto Sans SC',sans-serif;
}
[data-theme="dark"]{
  --bg:#09090b;--surface:#18181b;--surface2:#27272a;--border:#3f3f46;
  --text:#fafafa;--text-sub:#a1a1aa;--text-muted:#8b8b94;
  --primary:#fafafa;--accent:#60a5fa;--accent-light:#172554;
  --danger:#f87171;--success:#4ade80;--shadow:0 1px 3px rgba(0,0,0,.3);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:var(--font);background:var(--bg);color:var(--text);min-height:100vh;transition:background .3s,color .3s;padding:20px 16px 60px}
.container{max-width:680px;margin:0 auto}

/* Header */
.header{text-align:center;padding:32px 0 8px}
.header .logo{display:inline-flex;align-items:center;gap:10px;margin-bottom:12px}
.header .logo-icon{width:40px;height:40px;background:var(--accent);color:#fff;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700}
.header h1{font-size:24px;font-weight:800;letter-spacing:-.5px}
.header .sub{font-size:13px;color:var(--text-muted);margin-top:6px}

/* Tabs */
.tabs{display:flex;gap:4px;background:var(--surface2);border-radius:var(--radius);padding:4px;margin:20px 0}
.tab{flex:1;text-align:center;padding:8px 0;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:none;background:transparent;color:var(--text-sub);transition:all .2s}
.tab.active{background:var(--surface);color:var(--text);box-shadow:var(--shadow)}
.tab:hover:not(.active){color:var(--text)}

/* Card */
.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px;margin-bottom:16px}
.card-title{font-size:13px;font-weight:600;color:var(--text-sub);margin-bottom:10px;display:flex;align-items:center;gap:6px}

/* Textarea */
textarea{width:100%;min-height:120px;border:1px solid var(--border);border-radius:8px;padding:12px;font-size:14px;font-family:var(--font);resize:vertical;background:var(--surface2);color:var(--text);outline:none;transition:border .2s}
textarea:focus{border-color:var(--accent)}
textarea::placeholder{color:var(--text-muted)}

/* Result */
.result{min-height:60px;max-height:300px;overflow-y:auto;white-space:pre-wrap;word-break:break-all;font-size:14px;line-height:1.7;padding:12px;border-radius:8px;background:var(--surface2);color:var(--text-sub);user-select:all}
.result.has{color:var(--text)}

/* Buttons */
.actions{display:flex;gap:8px;margin-top:12px}
.btn{padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:none;transition:all .15s}
.btn-primary{background:var(--primary);color:#fff}
.btn-primary:hover{opacity:.85}
.btn-secondary{background:var(--surface2);color:var(--text-sub);border:1px solid var(--border)}
.btn-secondary:hover{background:var(--border)}
.btn-sm{padding:5px 12px;font-size:12px}

/* Direction switch */
.dir-row{display:flex;align-items:center;gap:8px;margin-bottom:12px}
.dir-row .dir-label{font-size:12px;color:var(--text-muted);flex:1;text-align:center}
.dir-btn{width:36px;height:36px;border-radius:50%;border:1px solid var(--border);background:var(--surface);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;transition:transform .2s}
.dir-btn:hover{transform:rotate(180deg)}

/* Toast */
.toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(80px);background:var(--primary);color:#fff;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;z-index:999;transition:transform .3s,opacity .3s;opacity:0;pointer-events:none;white-space:nowrap}
.toast.show{transform:translateX(-50%) translateY(0);opacity:1}

/* Theme toggle */
.theme-btn{position:fixed;top:16px;right:16px;width:36px;height:36px;border-radius:50%;border:1px solid var(--border);background:var(--surface);cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;z-index:99}

/* Footer */
.footer{text-align:center;font-size:11px;color:var(--text-muted);padding:20px 0}

/* Info box */
.info{font-size:12px;color:var(--text-muted);line-height:1.6;padding:10px 12px;border-radius:8px;background:var(--accent-light);margin-top:8px}
.info code{background:var(--surface2);padding:1px 5px;border-radius:4px;font-size:11px}
</style>
</head>
<body>
<button class="theme-btn" onclick="toggleTheme()" title="切换主题">🌙</button>

<div class="container">
  <div class="header">
    <div class="logo"><div class="logo-icon">赵</div></div>
    <h1>百家姓暗号转换</h1>
    <p class="sub">支持百家姓 / 核心价值观 / 与佛论禅</p>
  </div>

  <div class="tabs">
    <button class="tab active" data-mode="baijiaxing" onclick="switchMode('baijiaxing')">📜 百家姓</button>
    <button class="tab" data-mode="corevalues" onclick="switchMode('corevalues')">⭐ 核心价值观</button>
    <button class="tab" data-mode="buddha" onclick="switchMode('buddha')">🪷 与佛论禅</button>
  </div>

  <div class="card">
    <div class="card-title" id="inputLabel"><span>📝</span> 输入</div>
    <div class="dir-row">
      <span class="dir-label" id="dirFrom">百家姓暗号</span>
      <button class="dir-btn" onclick="switchDirection()" title="切换方向">⇄</button>
      <span class="dir-label" id="dirTo">明文链接</span>
    </div>
    <textarea id="input" placeholder="请输入百家姓暗号，如：赵钱孙李周吴郑王" oninput="convert()" maxlength="2000"></textarea>
    <div class="actions">
      <button class="btn btn-secondary btn-sm" onclick="clearAll()">清空</button>
      <button class="btn btn-secondary btn-sm" onclick="pasteFromClipboard()">📋 粘贴</button>
      <button class="btn btn-primary btn-sm" onclick="copyResult()">复制结果</button>
    </div>
  </div>

  <div class="card">
    <div class="card-title"><span>✨</span> 结果</div>
    <div class="result" id="result">结果将实时显示在这里…</div>
    <div class="info" id="infoBox"></div>
  </div>

  <div class="footer">
    百家姓暗号转换工具 · Cloudflare Worker · 数据仅本地处理，不上传服务器
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
/* ===== 数据表 ===== */
var nameMap={
  "赵":"0","钱":"1","孙":"2","李":"3","周":"4","吴":"5","郑":"6","王":"7","冯":"8","陈":"9",
  "褚":"a","卫":"b","蒋":"c","沈":"d","韩":"e","杨":"f","朱":"g","秦":"h","尤":"i","许":"j",
  "何":"k","吕":"l","施":"m","张":"n","孔":"o","曹":"p","严":"q","华":"r","金":"s","魏":"t",
  "陶":"u","姜":"v","戚":"w","谢":"x","邹":"y","喻":"z",
  "福":"A","水":"B","窦":"C","章":"D","云":"E","苏":"F","潘":"G","葛":"H","奚":"I","范":"J",
  "彭":"K","郎":"L","鲁":"M","韦":"N","昌":"O","马":"P","苗":"Q","凤":"R","花":"S","方":"T",
  "俞":"U","任":"V","袁":"W","柳":"X","唐":"Y","罗":"Z",
  "薛":".","伍":"-","余":"_","米":"+","贝":"=","姚":"/","孟":"?","顾":"#","尹":"%","江":"&","钟":"*","竺":":","赖":"|",
  "卜":"|"
};
var coreValues=['富强','民主','文明','和谐','自由','平等','公正','法治','爱国','敬业','诚信','友善'];
var buddhaChars=['滅','苦','婆','娑','耶','陀','逝','迦','南','無','密','多','咒','即','說','曰','怛','侄','他','唵','为','无','上','至','尊','真','实','一','切','诸','佛','般','若','波','罗','蜜'];
var buddhaKey='SKUMOR@K2D4V8Z5';

var magnetHeader='magnet:?xt=urn:btih:';
var curMode='baijiaxing';
var curDir='encode'; // encode=明文→暗号, decode=暗号→明文

/* ===== 编解码 ===== */
function nameEncode(str){
  // 明文(ascii/magnet) → 百家姓
  var r='';for(var i=0;i<str.length;i++){var ch=str[i];for(var k in nameMap){if(nameMap[k]===ch){r+=k;break;}}}
  return r;
}
function nameDecode(str){
  // 百家姓 → 明文
  var r='';for(var i=0;i<str.length;i++){var ch=str[i];if(nameMap[ch]!==undefined)r+=nameMap[ch];}
  return r;
}
function isMagnet(s){return s.substring(0,magnetHeader.length)===magnetHeader;}
function isEd2k(s){return s.substring(0,7)==='ed2k://';}

// 核心价值观: byte→三元组(base-12)
function valEncode(str){
  var enc=new TextEncoder();var bytes=enc.encode(str);var r='';
  for(var i=0;i<bytes.length;i++){var b=bytes[i];r+=coreValues[Math.floor(b/144)]+coreValues[Math.floor((b%144)/12)]+coreValues[b%12];}
  return r;
}
function valDecode(str){
  if(str.length%6!==0)return'';var bytes=[];
  for(var i=0;i<str.length;i+=6){
    var d1=coreValues.indexOf(str.substring(i,i+2)),d2=coreValues.indexOf(str.substring(i+2,i+4)),d3=coreValues.indexOf(str.substring(i+4,i+6));
    if(d1<0||d2<0||d3<0)return'';bytes.push(d1*144+d2*12+d3);
  }
  return new TextDecoder().decode(new Uint8Array(bytes));
}

// 与佛论禅: XOR→字符替换
function buddhaEncipher(str){
  var enc=new TextEncoder();var bytes=enc.encode(str);
  for(var i=0;i<bytes.length;i++){bytes[i]=bytes[i]^buddhaKey.charCodeAt(i%buddhaKey.length);}
  var r='佛曰：';for(var i=0;i<bytes.length;i++){r+=buddhaChars[Math.floor(bytes[i]/36)]+buddhaChars[bytes[i]%36];}
  return r;
}
function buddhaDecipher(str){
  str=str.replace(/^佛曰[：:]?/,'');var bytes=[];
  for(var i=0;i<str.length;i+=2){
    var hi=buddhaChars.indexOf(str[i]),lo=buddhaChars.indexOf(str[i+1]);
    if(hi<0||lo<0)return'';bytes.push(hi*36+lo);
  }
  for(var i=0;i<bytes.length;i++){bytes[i]=bytes[i]^buddhaKey.charCodeAt(i%buddhaKey.length);}
  return new TextDecoder().decode(new Uint8Array(bytes));
}

/* ===== 自动检测输入类型 ===== */
function isBaijiaxing(s){return /^[\u4e00-\u9fa5]+$/.test(s);}
function isCoreValuesText(s){return /^[富强民主文明和谐自由平等公正法治爱国敬业诚信友善]+$/.test(s)&&s.length%6===0;}
function isBuddhaText(s){return /^佛曰[：:]?/.test(s);}

/* ===== 主转换逻辑 ===== */
function convert(){
  var input=document.getElementById('input').value.trim();
  var el=document.getElementById('result');
  var info=document.getElementById('infoBox');
  if(!input){el.textContent='结果将实时显示在这里…';el.className='result';info.textContent='';return;}

  var out='';
  var detected='';

  if(curMode==='baijiaxing'){
    if(curDir==='encode'){
      // 明文→百家姓
      out=nameEncode(input);
      detected='输入明文，已转换为百家姓暗号';
    }else{
      // 百家姓→明文
      var plain=nameDecode(input);
      // 智能补全 magnet 头
      if(isMagnet(magnetHeader+plain)){out=magnetHeader+plain;detected='检测到磁力链接格式';}
      else if(isEd2k(plain)||/^[a-z][a-z0-9+\\-.]*:\\/\\//i.test(plain)){out=plain;detected='检测到协议链接';}
      else{out=plain;detected='已转换为明文';}
    }
  }else if(curMode==='corevalues'){
    if(curDir==='encode'){
      out=valEncode(input);detected='已转换为核心价值观暗号';
    }else{
      out=valDecode(input);detected=out?'已解码核心价值观':'格式错误，请检查输入';
    }
  }else{
    if(curDir==='encode'){
      out=buddhaEncipher(input);detected='已转换为与佛论禅';
    }else{
      out=buddhaDecipher(input);detected=out?'已解码与佛论禅':'格式错误，请检查输入';
    }
  }

  el.textContent=out||'⚠️ 转换失败，请检查输入';
  el.className=out?'result has':'result';
  info.textContent=detected;
}

/* ===== UI 交互 ===== */
function switchMode(mode){
  curMode=mode;
  document.querySelectorAll('.tab').forEach(function(t){t.classList.toggle('active',t.dataset.mode===mode);});
  var ta=document.getElementById('input');
  if(mode==='baijiaxing'){ta.placeholder='请输入百家姓暗号或明文…\\n例如：赵钱孙李\\n或：magnet:?xt=urn:btih:…';}
  else if(mode==='corevalues'){ta.placeholder='请输入核心价值观或明文…\\n例如：富强民主文明和谐';}
  else{ta.placeholder='请输入与佛论禅暗号或明文…\\n例如：佛曰：…';}
  clearAll();
}
function switchDirection(){
  curDir=curDir==='encode'?'decode':'encode';
  document.getElementById('dirFrom').textContent=curDir==='encode'?'明文':'百家姓暗号';
  document.getElementById('dirTo').textContent=curDir==='encode'?'百家姓暗号':'明文';
  document.getElementById('inputLabel').innerHTML='<span>📝</span> '+(curDir==='encode'?'输入明文':'输入百家姓暗号');
  clearAll();
}
function clearAll(){document.getElementById('input').value='';document.getElementById('result').textContent='结果将实时显示在这里…';document.getElementById('result').className='result';document.getElementById('infoBox').textContent='';}
function copyResult(){
  var t=document.getElementById('result').textContent;
  if(!t||t==='结果将实时显示在这里…'){showToast('⚠️ 没有可复制的内容');return;}
  navigator.clipboard.writeText(t).then(function(){showToast('✅ 已复制到剪贴板');}).catch(function(){showToast('❌ 复制失败');});
}
function pasteFromClipboard(){
  navigator.clipboard.readText().then(function(t){if(t){document.getElementById('input').value=t;convert();}}).catch(function(){showToast('⚠️ 无法读取剪贴板');});
}
function showToast(msg){
  var el=document.getElementById('toast');el.textContent=msg;el.classList.add('show');
  setTimeout(function(){el.classList.remove('show');},2000);
}
function toggleTheme(){
  var html=document.documentElement;
  var dark=html.getAttribute('data-theme')==='dark';
  html.setAttribute('data-theme',dark?'light':'dark');
  document.querySelector('.theme-btn').textContent=dark?'🌙':'☀️';
}
// 暗色模式跟随系统
if(window.matchMedia&&window.matchMedia('(prefers-color-scheme:dark)').matches){document.documentElement.setAttribute('data-theme','dark');document.querySelector('.theme-btn').textContent='☀️';}
</script>
</body>
</html>`;

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // 支持 CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(request.url);

  // API 路径：POST /api/convert 支持程序化调用
  if (url.pathname === '/api/convert' && request.method === 'POST') {
    try {
      const body = await request.json();
      const { text, mode, direction } = body;

      if (!text) {
        return Response.json({ error: '缺少 text 参数' }, { status: 400, headers: corsHeaders });
      }

      const result = convertAPI(text, mode || 'baijiaxing', direction || 'encode');
      return Response.json({ result }, { headers: corsHeaders });
    } catch (e) {
      return Response.json({ error: e.message }, { status: 500, headers: corsHeaders });
    }
  }

  // 默认返回 HTML 页面
  return new Response(HTML, {
    headers: { 'Content-Type': 'text/html;charset=utf-8', ...corsHeaders },
  });
}

// ===== Server-side conversion (same logic as client) =====

const NAME_MAP = {
  "赵":"0","钱":"1","孙":"2","李":"3","周":"4","吴":"5","郑":"6","王":"7","冯":"8","陈":"9",
  "褚":"a","卫":"b","蒋":"c","沈":"d","韩":"e","杨":"f","朱":"g","秦":"h","尤":"i","许":"j",
  "何":"k","吕":"l","施":"m","张":"n","孔":"o","曹":"p","严":"q","华":"r","金":"s","魏":"t",
  "陶":"u","姜":"v","戚":"w","谢":"x","邹":"y","喻":"z",
  "福":"A","水":"B","窦":"C","章":"D","云":"E","苏":"F","潘":"G","葛":"H","奚":"I","范":"J",
  "彭":"K","郎":"L","鲁":"M","韦":"N","昌":"O","马":"P","苗":"Q","凤":"R","花":"S","方":"T",
  "俞":"U","任":"V","袁":"W","柳":"X","唐":"Y","罗":"Z",
  "薛":".","伍":"-","余":"_","米":"+","贝":"=","姚":"/","孟":"?","顾":"#","尹":"%","江":"&","钟":"*","竺":":","赖":"|",
  "卜":"|"
};

const CORE_VALUES = ['富强','民主','文明','和谐','自由','平等','公正','法治','爱国','敬业','诚信','友善'];

const BUDDHA_CHARS = ['滅','苦','婆','娑','耶','陀','逝','迦','南','無','密','多','咒','即','說','曰','怛','侄','他','唵','为','无','上','至','尊','真','实','一','切','诸','佛','般','若','波','罗','蜜'];
const BUDDHA_KEY = 'SKUMOR@K2D4V8Z5';

function nameEncode(str) {
  let r = '';
  for (const ch of str) { for (const [k, v] of Object.entries(NAME_MAP)) { if (v === ch) { r += k; break; } } }
  return r;
}

function nameDecode(str) {
  let r = '';
  for (const ch of str) { if (NAME_MAP[ch] !== undefined) r += NAME_MAP[ch]; }
  return r;
}

function valEncode(str) {
  const bytes = new TextEncoder().encode(str);
  let r = '';
  for (const b of bytes) { r += CORE_VALUES[Math.floor(b / 144)] + CORE_VALUES[Math.floor((b % 144) / 12)] + CORE_VALUES[b % 12]; }
  return r;
}

function valDecode(str) {
  if (str.length % 6 !== 0) return '';
  const bytes = [];
  for (let i = 0; i < str.length; i += 6) {
    const d1 = CORE_VALUES.indexOf(str.substring(i, i + 2));
    const d2 = CORE_VALUES.indexOf(str.substring(i + 2, i + 4));
    const d3 = CORE_VALUES.indexOf(str.substring(i + 4, i + 6));
    if (d1 < 0 || d2 < 0 || d3 < 0) return '';
    bytes.push(d1 * 144 + d2 * 12 + d3);
  }
  return new TextDecoder().decode(new Uint8Array(bytes));
}

function buddhaEncipher(str) {
  const bytes = new TextEncoder().encode(str);
  for (let i = 0; i < bytes.length; i++) bytes[i] = bytes[i] ^ BUDDHA_KEY.charCodeAt(i % BUDDHA_KEY.length);
  let r = '佛曰：';
  for (const b of bytes) r += BUDDHA_CHARS[Math.floor(b / 36)] + BUDDHA_CHARS[b % 36];
  return r;
}

function buddhaDecipher(str) {
  str = str.replace(/^佛曰[：:]?/, '');
  const bytes = [];
  for (let i = 0; i < str.length; i += 2) {
    const hi = BUDDHA_CHARS.indexOf(str[i]), lo = BUDDHA_CHARS.indexOf(str[i + 1]);
    if (hi < 0 || lo < 0) return '';
    bytes.push(hi * 36 + lo);
  }
  for (let i = 0; i < bytes.length; i++) bytes[i] = bytes[i] ^ BUDDHA_KEY.charCodeAt(i % BUDDHA_KEY.length);
  return new TextDecoder().decode(new Uint8Array(bytes));
}

function convertAPI(text, mode, direction) {
  if (!text) return '';
  if (mode === 'baijiaxing') {
    if (direction === 'encode') return nameEncode(text);
    const plain = nameDecode(text);
    if (plain.startsWith('magnet:?xt=urn:btih:')) return plain;
    return plain;
  } else if (mode === 'corevalues') {
    if (direction === 'encode') return valEncode(text);
    return valDecode(text);
  } else {
    if (direction === 'encode') return buddhaEncipher(text);
    return buddhaDecipher(text);
  }
}
