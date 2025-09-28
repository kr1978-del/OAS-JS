]</div> 

<!-- Params (PV) -->
<div id="oas-params" style="display:none"
  data-gpr="@{GraphsPerRow}{2}"

  data-date-title="@{PV_Attribute01}{Date}"
  data-line-title="@{PV_Attribute02}{Line}"
  data-cell-title="@{PV_Attribute03}{Cell}"

  data-legend-pos="@{PV_LegendPos}{auto}"
  data-legend-show="@{PV_LegendShow}{1}"

  data-chart-type="@{PV_ChartType}{line}"      <!-- line|area|bar -->
  data-line-style="@{PV_LineStyle}{curved}"    <!-- curved|straight|dashed|dotted|dashdot -->
  data-gap-mode="@{PV_GapMode}{break}"         <!-- break|connect|interp -->

  data-show-values="@{PV_ShowValues}{0}"       <!-- labels default -->
  data-point-mode="@{PV_PointMode}{extremes}"  <!-- none|extremes|all -->
  data-rotate-ticks="@{PV_RotateTicks}{auto}"
  data-hov-dig="@{PV_HoverDigits}{3}"
  data-value-digits="@{PV_ValueDigits}{}"

  data-card-border="@{PV_CardBorder}{1}"
  data-card-radius="@{PV_CardRadius}{14}"
  data-card-color="@{PV_CardColor}{#6b7280}"

  data-chart-height="@{PV_ChartHeight}{370px}"
  data-chart-width="@{PV_ChartWidth}{100%}"

  data-plot-min="@{PV_PlotMeasuresCount}{0}"
  data-meas-modes="@{PV_MeasureModes}{}"       <!-- per-measure type e.g. "m4:bar,Iron (%):area" -->
  data-overlays="@{PV_Overlays}{}"             <!-- "m4+m5:sameY:line,bar ; Iron|Aluminium:dualY:line,area" -->

  data-y-digits-map="@{PV_YDigitsPerMeasure}{}"
  data-hov-digits-map="@{PV_HovDigitsPerMeasure}{}"

  data-month-hints="@{PV_MonthHints}{1}"

  data-max-pts="@{PV_MaxPointsPerLine}{1200}"  <!-- downsample target per line -->
  data-hover-cell="@{PV_ShowCellInHover}{0}"   <!-- show/hide Cell in hover -->
  data-hover-mode="@{PV_HoverMode}{focused}"   <!-- focused|unified -->

  data-time-x-mode="@{PV_TimeXMode}{auto}"     <!-- auto|date|category -->
  data-max-groups="@{PV_MaxGroups}{9}"         <!-- limit groups; friendly message if exceeded -->
></div>

<style>
  html,body{margin:0;padding:0}
  #chart-grid{width:100%}
  .grid{display:grid;gap:8px;width:100%;grid-auto-flow:row}
  .cols1{grid-template-columns:repeat(1,minmax(0,1fr))}
  .cols2{grid-template-columns:repeat(2,minmax(0,1fr))}
  .cols3{grid-template-columns:repeat(3,minmax(0,1fr))}
  .sec{border:1.5px solid var(--card-bc,#6b7280);border-radius:var(--card-br,14px);background:#fff;position:relative;overflow:hidden}
  [data-theme="dark"] .sec{background:#0f172a;border-color:#2b3447}
  .sec .js-plotly-plot{width:100%!important}

  .js-plotly-plot .modebar{position:absolute!important;top:4px!important;right:4px!important;background:transparent!important;z-index:3!important;scale:.9}
  .js-plotly-plot .modebar-btn .icon path{fill:none!important;stroke:#6b7280!important;stroke-width:60!important}
  .js-plotly-plot .modebar-btn:hover .icon path{stroke:#111827!important}
  [data-theme="dark"] .js-plotly-plot .modebar-btn .icon path{stroke:#9aa4b2!important}
  [data-theme="dark"] .js-plotly-plot .modebar-btn:hover .icon path{stroke:#e5e7eb!important}

  .oas-pop{position:fixed;z-index:2147483646;min-width:170px;max-width:230px;background:#fff;border:1px solid #e5e7eb;border-radius:12px;box-shadow:0 6px 24px rgba(0,0,0,.14);padding:8px}
  [data-theme="dark"] .oas-pop{background:#0f172a;border-color:#1f2937;box-shadow:0 6px 24px rgba(0,0,0,.4)}
  .oas-pop h4{margin:0 0 6px 0;font:600 12px/1.2 system-ui}
  .oas-pop .group{display:flex;flex-direction:column;gap:6px;margin-top:6px}
  .oas-pop .row{display:flex;flex-direction:column;gap:4px}
  .oas-pop input[type="text"], .oas-pop input[type="number"]{width:100%;padding:5px 7px;border:1px solid #cfd5df;border-radius:7px;font:12px system-ui}
  .oas-pop button{padding:5px 7px;border:1px solid #cfd5df;border-radius:8px;background:#fff;cursor:pointer;font:12px/1 system-ui;width:100%;text-align:left}
  .oas-pop button:hover{background:#f3f4f6}
  .oas-pop label{display:flex;align-items:center;gap:6px;font:12px system-ui}

  .pl-fs-overlay{position:fixed;inset:0;background:#fff;z-index:2147483645;display:flex;flex-direction:column}
  .pl-fs-overlay .fs-row{display:flex;flex-direction:column;height:100%}
  .pl-fs-overlay .fs-chart{flex:1 1 auto}
  [data-theme="dark"] .pl-fs-overlay{background:#0b1220}
</style>

<div id="chart-grid" class="grid cols1"></div>

<script src="/analyticsRes/custom/plotly.min.js"></script>

<script>
(function(){
  const VERSION='v1.9.16 / rev 2025-09-22-p34';
  if(typeof Plotly==='undefined'){ document.getElementById('chart-grid').innerHTML='<div class="sec" style="padding:8px">Plotly not found</div>'; return; }

  /* ----------------- parameters ----------------- */
  const p=document.getElementById('oas-params')||{dataset:{}};
  const GPR=Math.min(3,Math.max(1,parseInt(p.dataset.gpr||'1',10)||1));

  const DATE_TITLE=(p.dataset.dateTitle||'Date').trim();
  const LINE_TITLE=(p.dataset.lineTitle||'Line').trim();
  const CELL_TITLE=(p.dataset.cellTitle||'Cell').trim();

  const LEG_SHOW=(String(p.dataset.legendShow||'1')!=='0');
  const LEG_POS=(p.dataset.legendPos||'auto').toLowerCase();

  const CHART_TYPE=(p.dataset.chartType||'line').toLowerCase();
  const LINE_STYLE=(p.dataset.lineStyle||'curved').toLowerCase();
  const GAP_MODE=(p.dataset.gapMode||'break').toLowerCase();

  const SHOW_VALUES_DEFAULT=(String(p.dataset.showValues||'0')==='1');
  const POINT_MODE_DEFAULT=(p.dataset.pointMode||'extremes').toLowerCase(); // none|extremes|all
  const ROTATE_TICKS=(p.dataset.rotateTicks||'auto').toLowerCase();
  const HOV_DIG=Math.max(0, Math.min(6, parseInt(p.dataset.hovDig||'3',10)||3));
  const VAL_DIG=(p.dataset.valueDigits??'').trim();

  const MONTH_HINTS=(String(p.dataset.monthHints||'1')!=='0');
  const MAX_PTS=Math.max(300, parseInt(p.dataset.maxPts||'1200',10)||1200);
  const HOVER_SHOW_CELL=(String(p.dataset.hoverCell||'0')!=='0');
  const HOVER_MODE=(p.dataset.hoverMode||'focused').toLowerCase(); // focused|unified

  const TIME_X_MODE=(p.dataset.timeXMode||'auto').toLowerCase();   // auto|date|category
  const MAX_GROUPS = Math.max(1, parseInt(p.dataset.maxGroups||'9',10) || 9);

  const CARD_BORDER=(String(p.dataset.cardBorder||'1')!=='0');
  const CARD_RADIUS=(p.dataset.cardRadius||'14');
  const CARD_COLOR =(p.dataset.cardColor || '#6b7280');
  const CHART_H=(p.dataset.chartHeight||'370px');
  const CHART_W=(p.dataset.chartWidth ||'100%');

  /* ----------------- data ingest ----------------- */
  const host=document.getElementById('box-data'); if(!host){ return; }
  let raw=[]; try{ raw=JSON.parse(host.textContent||'[]'); }catch(e){}
  if(!raw.length){ document.getElementById('chart-grid').innerHTML='<div class="sec" style="padding:8px">No data rows.</div>'; return; }

  const FAST_NUM_RE=/^-?\d+(\.\d+)?$/;
  function toNum(s){
    if(s==null) return null; let t=(''+s).trim(); if(!t) return null;
    if(FAST_NUM_RE.test(t)) return parseFloat(t);
    t=t.replace(/[^\d.,\-]/g,'');
    const d=t.lastIndexOf('.'), c=t.lastIndexOf(',');
    if(d!==-1&&c!==-1) t=(c>d)?t.replace(/\./g,'').replace(',', '.'):t.replace(/,/g,'');
    else if(c!==-1) t=t.replace(',', '.'); else t=t.replace(/,/g,'');
    const v=parseFloat(t); return Number.isFinite(v)?v:null;
  }

  const lite=new Array(raw.length);
  const linesSet=new Set(), datesSet=new Set();
  for(let i=0;i<raw.length;i++){ const r=raw[i]; const d=String(r.dt); const ln=String(r.line??'—'); const cell=(r.cell??''); lite[i]={d,ln,cell}; linesSet.add(ln); datesSet.add(d); }
  const lines=[...linesSet], dates=[...datesSet];

  // ---- group limit guard ----
  if (lines.length > MAX_GROUPS) {
    const gridEl = document.getElementById('chart-grid');
    if (gridEl) {
      gridEl.innerHTML = `
        <div class="sec" style="padding:14px">
          <div style="font:600 14px system-ui; margin-bottom:6px">
            Too many groups selected (${lines.length}).
          </div>
          <div style="font:12px/1.4 system-ui; opacity:.8">
            For performance and readability, this view is limited to <b>${MAX_GROUPS}</b> groups by default
            (<code>PV_MaxGroups</code>). Please filter or select fewer groups for a clearer visual.
          </div>
        </div>`;
    }
    return; // stop here; skip plotting
  }

  let allKeys=[]; for(const r of raw){ for(const k in r){ if(k!=='dt'&&k!=='line'&&k!=='cell') allKeys.push(k); } if(allKeys.length) break; }
  if(!allKeys.length){ const s=new Set(); for(const r of raw){ for(const k in r){ if(k!=='dt'&&k!=='line'&&k!=='cell') s.add(k); } } allKeys=[...s]; }
  const pref=Array.from({length:160},(_,i)=>'m'+(i+1));
  const measureKeys=allKeys.sort((a,b)=> (pref.indexOf(a)<0?9e9:pref.indexOf(a)) - (pref.indexOf(b)<0?9e9:pref.indexOf(b)));
  const PLOT_MIN=Math.max(0, parseInt(p.dataset.plotMin||'0',10));
  const mKeys=measureKeys.slice(0, Math.max(PLOT_MIN, measureKeys.length));
  if(!mKeys.length){ document.getElementById('chart-grid').innerHTML='<div class="sec" style="padding:8px">No measure columns detected.</div>'; return; }

  /* ---- date vs category ---- */
  const HINTS_DATE = ['date','datetime','day'];               // only these trigger date mode in auto
  const TITLE_LOOKS_DATE = HINTS_DATE.some(h => (DATE_TITLE||'').toLowerCase().includes(h));
  const parsable = s => Number.isFinite(+new Date(s));
  const sample = lite.slice(0, Math.min(40, lite.length)).map(r => r.d);
  const DATA_MOSTLY_DATE = (sample.filter(parsable).length >= Math.ceil(sample.length*0.6));

  let USE_TIME_X;
  if (TIME_X_MODE === 'date')      USE_TIME_X = true;
  else if (TIME_X_MODE === 'category') USE_TIME_X = false;
  else /* auto */                  USE_TIME_X = (TITLE_LOOKS_DATE && DATA_MOSTLY_DATE);

  const isoCache=new Map();
  const toISO=d=>{ if(!USE_TIME_X) return d; const s=String(d); if(isoCache.has(s)) return isoCache.get(s); const t=new Date(s); const v=Number.isFinite(+t)?t.toISOString().slice(0,10):s; isoCache.set(s,v); return v; };
  const ISO_DATES_UNIQ = USE_TIME_X ? [...new Set(lite.map(r=>toISO(r.d)))] : [];

  /* ---- month labels row ---- */
  function computeMonthBand(list){
    const mon=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const pts=list.map(d=>({d,t:+new Date(d)})).filter(o=>Number.isFinite(o.t)).sort((a,b)=>a.t-b.t);
    const out=[]; for(let i=0;i<pts.length;){ const dt=new Date(pts[i].d), m=dt.getMonth(), y=dt.getFullYear(); let j=i; while(j<pts.length){ const d2=new Date(pts[j].d); if(d2.getMonth()!==m||d2.getFullYear()!==y) break; j++; }
      const a=new Date(pts[i].d), b=new Date(pts[Math.max(j-1,i)].d); const cx=new Date((a.getTime()+b.getTime())/2).toISOString().slice(0,10);
      out.push({x:cx, text:mon[m]+' '+String(y).slice(2)}); i=j; }
    return out;
  }
  const MONTH_BAND=(USE_TIME_X && MONTH_HINTS && ISO_DATES_UNIQ.length && ISO_DATES_UNIQ.length<=200)?computeMonthBand(ISO_DATES_UNIQ):null;

  /* ---- config maps ---- */
  const MEAS_MODE_MAP={}; (p.dataset.measModes||'').split(/[,;]+/).map(s=>s.trim()).filter(Boolean).forEach(pair=>{ const m=pair.split(':'); if(m.length>=2){ MEAS_MODE_MAP[m[0].trim()]=(m[1].trim().toLowerCase()==='bar'?'bar':(m[1].trim().toLowerCase()==='area'?'area':'line')); } });
  const YDIG_MAP={}; (p.dataset.yDigitsMap||'').split(/[;,]+/).map(s=>s.trim()).filter(Boolean).forEach(pair=>{ const m=pair.split(':'); if(m.length===2) YDIG_MAP[m[0].trim()]=Math.max(0,parseInt(m[1],10)||0); });
  const HOV_MAP={}; (p.dataset.hovDigitsMap||'').split(/[;,]+/).map(s=>s.trim()).filter(Boolean).forEach(pair=>{ const m=pair.split(':'); if(m.length===2) HOV_MAP[m[0].trim()]=Math.max(0,parseInt(m[1],10)||0); });
  const hovDigitsFor=k=> (HOV_MAP[k]!=null?HOV_MAP[k]:HOV_DIG);
  const yFmtFor=(k,f)=> { if (YDIG_MAP[k]==null) return f; const n=Math.max(0,Math.min(6,+YDIG_MAP[k])); return ',.'+n+'f'; };
  const chartTypeFor=k=> MEAS_MODE_MAP[k] || CHART_TYPE || 'line';

  /* ---- overlays ---- */
  const OVERLAYS_RAW=(p.dataset.overlays||'').trim();
  const overlayGroups=[], overlayMembers=new Set();
  const resolveKey = nameOrKey => measureKeys.includes(nameOrKey)? nameOrKey
                                 : measureKeys.find(k=>k.toLowerCase()===String(nameOrKey).toLowerCase()) || null;
  if(OVERLAYS_RAW){
    OVERLAYS_RAW.split(';').map(s=>s.trim()).filter(Boolean).forEach((grp,gi)=>{
      const parts=grp.split(':').map(s=>s.trim());
      const L=(parts[0]||'').split('|')[0]||''; const R=(parts[0]||'').split('|')[1]||'';
      const left=(L||'').split('+').map(x=>x.trim()).filter(Boolean).map(resolveKey).filter(Boolean);
      const right=(R||'').split('+').map(x=>x.trim()).filter(Boolean).map(resolveKey).filter(Boolean);
      if(!left.length && !right.length) return;
      left.forEach(k=>overlayMembers.add(k)); right.forEach(k=>overlayMembers.add(k));
      overlayGroups.push({id:'ov_'+gi, axisMode:(parts[1]||'sameY').toLowerCase(), left, right, types:(parts[2]||'').toLowerCase().split(/[,\s]+/).filter(Boolean)});
    });
  }

  const singleMeasures=mKeys.filter(k=>!overlayMembers.has(k));
  const plan=[ ...overlayGroups.map(meta=>({kind:'overlay',meta})), ...singleMeasures.map(k=>({kind:'single',key:k})) ];

  /* ----------------- DOM ----------------- */
  const grid=document.getElementById('chart-grid');
  const applyCols=n=>{ grid.classList.toggle('cols1',n===1); grid.classList.toggle('cols2',n===2); grid.classList.toggle('cols3',n===3); };
  applyCols(GPR);

  function makeSec(title, dataAttr){
    const id='t_'+Math.random().toString(36).slice(2,9);
    const sec=document.createElement('div'); sec.className='sec';
    sec.style.setProperty('--card-bc', CARD_COLOR); sec.style.setProperty('--card-br', (CARD_BORDER?CARD_RADIUS:0)+'px'); sec.style.borderWidth = CARD_BORDER ? '1.5px' : '0';
    sec.innerHTML=`<div id="${id}" ${dataAttr} data-title="${encodeURIComponent(title)}" style="width:${CHART_W};height:${CHART_H};position:relative"></div>`;
    grid.appendChild(sec); return id;
  }
  const sections=plan.map(pl=>{
    if(pl.kind==='overlay'){ const title=[...pl.meta.left,...pl.meta.right].join(' + '); return makeSec(title, `data-overlay="${encodeURIComponent(JSON.stringify(pl.meta))}"`); }
    return makeSec(pl.key, `data-measure="${encodeURIComponent(pl.key)}"`);
  });

  /* ----------------- helpers ----------------- */
  const THEMES={light:{BG:'#fff',PBG:'#fff',TXT:'#111827',GRID:'#e5e7eb',SPIKE:'#9ca3af',XGRID:true},
                dark:{ BG:'#0b1220',PBG:'#0f172a',TXT:'#e5e7eb',GRID:'#1f2937',SPIKE:'#475569',XGRID:false}};
  const PALETTE=['#2E77D0','#E07A1F','#2FA24B','#C33C3C','#7C5AC9','#8C564B','#E377C2','#17BECF','#7f7f7f'];
  const LINE_COLORS={}; const colorFor=ln=>LINE_COLORS[ln]||(LINE_COLORS[ln]=PALETTE[Object.keys(LINE_COLORS).length%PALETTE.length]);
  const fmtText=v=> VAL_DIG===''? v : (Number.isFinite(+v)?(+v).toFixed(Math.max(0,Math.min(6,parseInt(VAL_DIG)||0))):v);

  function linearInterp(y){ const o=y.slice(); const idx=[]; for(let i=0;i<o.length;i++){ if(o[i]==null||!isFinite(o[i])){ let p=i-1; while(p>=0 && !isFinite(o[p])) p--; let n=i+1; while(n<o.length && !isFinite(o[n])) n++; if(p>=0&&n<o.length&&isFinite(o[p])&&isFinite(o[n])){ o[i]=o[p]+(o[n]-o[p])*((i-p)/(n-p)); idx.push(i);} } } return {y:o,idx}; }
  function median(a){ const s=a.slice().sort((x,y)=>x-y); const n=s.length; if(!n) return null; const m=n/2|0; return n%2? s[m] : (s[m-1]+s[m])/2; }
  function linreg(_,y){ const n=y.length; if(n<2) return {a:0,b:(y[0]||0)}; let sx=0,sy=0,sxx=0,sxy=0; for(let i=0;i<n;i++){ const X=i, Y=y[i]; sx+=X; sy+=Y; sxx+=X*X; sxy+=X*Y; } const d=(n*sxx-sx*sx)||1e-9; return {a:(n*sxy-sx*sy)/d, b:(sy - ((n*sxy-sx*sy)/d)*sx)/n}; }
  function outlierIdx(y){ const v=y.filter(Number.isFinite); if(v.length<4) return []; const s=v.slice().sort((a,b)=>a-b);
    const q1=s[Math.floor((s.length-1)*0.25)], q3=s[Math.floor((s.length-1)*0.75)], iqr=q3-q1, lo=q1-1.5*iqr, hi=q3+1.5*iqr;
    const idx=[]; for(let i=0;i<y.length;i++){ const t=y[i]; if(Number.isFinite(t)&&(t<lo||t>hi)) idx.push(i); } return idx; }

  const cache=new Map();
  function perLineArray(mk){
    let by=cache.get(mk); if(by) return by;
    by={}; lines.forEach(l=>by[l]={x:[],y:[],t:[], _ext:null, _keepW:-1, _keep:null});
    for(let i=0;i<raw.length;i++){ const r=raw[i], L=lite[i], v=toNum(r[mk]); const x=USE_TIME_X?toISO(L.d):L.d; const ln=L.ln; by[ln].x.push(x); by[ln].y.push(Number.isFinite(v)?v:null); by[ln].t.push(L.cell||''); }
    cache.set(mk,by); return by;
  }

  /* Aggregate across ALL groups at each X (for Scope: All) */
  const __AGG_CACHE__ = new Map();
  function aggAllForMeasure(mk){
    if(__AGG_CACHE__.has(mk)) return __AGG_CACHE__.get(mk);
    const by = perLineArray(mk);
    const m = new Map(); // x -> [values...]
    for(const ln of lines){
      const X=by[ln].x, Y=by[ln].y;
      for(let i=0;i<X.length;i++){
        const y=Y[i]; if(!Number.isFinite(y)) continue;
        const key=X[i]; if(m.has(key)) m.get(key).push(y); else m.set(key,[y]);
      }
    }
    const xUniq = USE_TIME_X ? ISO_DATES_UNIQ.slice() : dates.slice();
    const yAvg = xUniq.map(x=>{
      const arr=m.get(x); if(!arr||!arr.length) return null;
      let s=0; for(const v of arr) s+=v; return s/arr.length;
    });
    const allVals=[]; m.forEach(arr=>allVals.push(...arr));
    const medAll = allVals.length? median(allVals) : null;
    const res = {x:xUniq, yAvg, medAll};
    __AGG_CACHE__.set(mk,res);
    return res;
  }

  function buildKeepIndex(y, width, extIdx, maxPts){
    const n=y.length; if(n<=maxPts) return null;
    const bins=Math.max(80, Math.min(n, Math.floor((width||800)/2)));
    const step=Math.ceil(n/bins);
    const keep=new Set([0,n-1]); const extSet=new Set(extIdx||[]);
    if(extIdx){ for(const k of extIdx){ if(k>=0&&k<n) keep.add(k); } }
    for(let i=0;i<n;i+=step){ let lo=Infinity,hi=-Infinity,il=-1,ih=-1; const end=Math.min(n,i+step);
      for(let j=i;j<end;j++){ const v=y[j]; if(v==null||!isFinite(v)) continue; if(v<lo){lo=v;il=j;} if(v>hi){hi=v;ih=j;} }
      if(il>=0) keep.add(il); if(ih>=0) keep.add(ih);
    }
    let arr=[...keep].sort((a,b)=>a-b);
    if(arr.length>maxPts){ const stride=Math.ceil(arr.length/maxPts); arr=arr.filter((_,idx)=> idx%stride===0); for(const k of extSet) arr.push(k); arr=[...new Set(arr)].sort((a,b)=>a-b); }
    return arr;
  }
  function applyKeep(x,y,t,idx){ if(!idx) return {x,y,t}; const X=new Array(idx.length),Y=new Array(idx.length),T=new Array(idx.length); for(let i=0;i<idx.length;i++){ const k=idx[i]; X[i]=x[k]; Y[i]=y[k]; T[i]=t[k]; } return {x:X,y:Y,t:T}; }

  function legendSpec(pos){
    if(pos==='auto'){ const needRight=lines.length>7; return needRight?{orientation:'v',x:1.01,y:1,xanchor:'left',yanchor:'top'}:{orientation:'h',x:0.5,y:1.04,xanchor:'center',yanchor:'bottom'}; }
    if(pos==='top-left')return{orientation:'h',x:0,y:1.04,xanchor:'left',yanchor:'bottom'};
    if(pos==='top-center')return{orientation:'h',x:0.5,y:1.04,xanchor:'center',yanchor:'bottom'};
    if(pos==='top-right')return{orientation:'h',x:1,y:1.04,xanchor:'right',yanchor:'bottom'};
    if(pos==='bottom')return{orientation:'h',x:0.5,y:-0.28,xanchor:'center',yanchor:'top'};
    if(pos==='left')return{orientation:'v',x:-0.01,y:1,xanchor:'left',yanchor:'top'};
    if(pos==='right')return{orientation:'v',x:1.01,y:1,xanchor:'left',yanchor:'top'};
    return{orientation:'h',x:0.5,y:1.04,xanchor:'center',yanchor:'bottom'};
  }
  const dash=s=> s==='dashed'?'dash': s==='dotted'?'dot': s==='dashdot'?'dashdot':'solid';
  const shape=st=> st.lineStyle==='curved'?'spline':'linear';

  function rightmostX(){ return USE_TIME_X ? ISO_DATES_UNIQ[ISO_DATES_UNIQ.length-1] : dates[dates.length-1]; }

  function addEndLabel(traces, x, y, text, color){
    if(x==null || !Number.isFinite(y) || !text) return;
    traces.push({type:'scatter', mode:'text', x:[x], y:[y], text:[text], textposition:'top right',
      textfont:{size:11, color:color}, showlegend:false, hoverinfo:'skip'});
  }

  function minmaxShapes(st){
    const sh=[];
    if(st.band && Number.isFinite(st.minT) && Number.isFinite(st.maxT)){
      sh.push({type:'rect', xref:'paper', x0:0, x1:1, y0:st.minT, y1:st.maxT,
               fillcolor:'rgba(200,30,30,0.08)', line:{width:0}});
    }
    return sh;
  }

  const hx = () => (USE_TIME_X ? '<b>%{x|%d-%b-%Y}</b>' : '<b>%{x}</b>');

  /* ----------------- traces ----------------- */
  function tracesForMeasure(mk, st){
    const by=perLineArray(mk); const trs=[];

    for(const ln of lines){
      const col=colorFor(ln), arr=by[ln]; if(!arr) continue;
      const ext = (arr._ext!=null?arr._ext:(arr._ext=outlierIdx(arr.y)));

      let x=arr.x, y=arr.y, cell=arr.t;
      const keep = (arr._keepW===st.sizes.w && arr._keep) ? arr._keep : (arr._keep = buildKeepIndex(y, st.sizes.w, ext, MAX_PTS), arr._keepW=st.sizes.w, arr._keep);
      if(keep){ const c=applyKeep(x,y,cell,keep); x=c.x; y=c.y; cell=c.t; }

      const isOut = (keep? keep.map(k=>ext.includes(k)) : y.map((_,i)=>ext.includes(i)));

      let yMain=y, interpIdx=[]; if(st.gaps==='interp'){ const r=linearInterp(y); yMain=r.y; interpIdx=r.idx; }
      const connect=(st.gaps==='connect');

      // === labels obey "Points" ===
      const showText = st.labels && (st.points!=='none');
      const textArr = showText
        ? (st.points==='extremes' ? yMain.map((v,i)=> isOut[i] ? fmtText(v) : '') 
                                   : yMain.map(v=>fmtText(v)))
        : null;

      // markers / mode
      const mode=['lines'];
      let marker={size:0};
      if(st.points==='all'){
        mode.push('markers');
        const base=(st.sizes.marker||6);
        marker={ size:isOut.map(o=>o?base+3:base), symbol:isOut.map(o=>o?'diamond-open':'circle'),
                 color:col, line:{width:2,color:col} };
      }else if(st.points==='extremes'){
        mode.push('markers');
        const base=(st.sizes.marker||6);
        marker={ size:isOut.map(o=>o?base+2:0), symbol:isOut.map(o=>o?'diamond-open':'circle'),
                 color:col, line:{width:2,color:col} };
      }
      if(textArr) mode.push('text');

      const kind = (st.chartType || chartTypeFor(mk));
      const ydig = hovDigitsFor(mk);
      const hoverCore = `${LINE_TITLE}: ${ln}<br>${hx()}<br>%{y:.${ydig}f}` + (HOVER_SHOW_CELL?`<br>${CELL_TITLE}: %{customdata}`:'');
      const ht = '%{hovertext}'+hoverCore+'<extra></extra>';
      const bulletColored = isOut.map(o => o ? '◆ ' : '● ');

      if(kind==='bar'){
        trs.push({type:'bar', name:ln, legendgroup:ln, showlegend:true, x, y:yMain, customdata:cell,
          marker:{color:col, line:{width:1, color:'#11182722'}},
          text:textArr, textposition:(textArr?'outside':undefined), texttemplate:(textArr?'%{text}':undefined),
          hovertext:bulletColored, hovertemplate:ht, hoverlabel:{bordercolor:col, font:{color:col}}});
      } else {
        trs.push({type:'scatter', name:ln, legendgroup:ln, showlegend:true, x, y:yMain, customdata:cell,
          mode:mode.join('+'), connectgaps:connect, cliponaxis:true, simplify:true,
          line:{color:col,width:(st.sizes.lineW||2),shape:shape(st),dash:dash(st.lineStyle)},
          marker, text:textArr, textposition:'top center', texttemplate:(textArr?'%{text}':undefined),
          hovertext:bulletColored, hovertemplate:ht, hoverlabel:{bordercolor:col, font:{color:col}},
          fill:(kind==='area'?'tozeroy':'none')});

        if(st.gaps==='interp' && interpIdx.length){
          const ix=interpIdx.map(i=>x[i]), iy=interpIdx.map(i=>yMain[i]);
          trs.push({type:'scatter',mode:'markers',name:'Interpolated',x:ix,y:iy,marker:{symbol:'x',size:8,line:{width:1.5,color:'#6b7280'}},showlegend:false,cliponaxis:true,hovertemplate:`Interpolated<br>${hx()}<br>%{y:.${ydig}f}<extra></extra>`});
        }
      }

      // ---- per-line stats ----
      if(st.statMode==='median' && st.scope==='line'){
        const v=yMain.filter(Number.isFinite); if(v.length){
          const m=median(v), yy=x.map(()=>m);
          trs.push({
            type:'scatter',mode:'lines',name:`Median – ${ln}`,legendgroup:ln,showlegend:false,
            x,y:yy,line:{color:col,width:1.5,dash:'dot'},
            hovertemplate:`Median (${LINE_TITLE}: ${ln})<br>${hx()}<br>%{y:.${ydig}f}<extra></extra>`
          });
          addEndLabel(trs, x[x.length-1], m, `Median (${ln}): ${m.toFixed(ydig)}`, col);
        }
      }
      if(st.statMode==='reg' && st.scope==='line'){
        const v=yMain.filter(Number.isFinite); if(v.length>1){
          const {a,b}=linreg(null,v), yy=yMain.map((_,i)=>a*i+b);
          trs.push({
            type:'scatter',mode:'lines',name:`Regression – ${ln}`,legendgroup:ln,showlegend:false,
            x,y:yy,line:{color:col,width:1.5,dash:'dash'},
            hovertemplate:`Regression (${LINE_TITLE}: ${ln})<br>${hx()}<br>%{y:.${ydig}f}<extra></extra>`
          });
          const last=yy[yy.length-1]; addEndLabel(trs, x[x.length-1], last, `Reg (${ln}): ${last.toFixed(ydig)}`, col);
        }
      }
    }

    // ---- ALL groups stats ----
    if(st.statMode!=='none' && st.scope==='all'){
      const agg = aggAllForMeasure(mk);
      const colAll = '#111827';
      const ydig = hovDigitsFor(mk);
      if(st.statMode==='median' && Number.isFinite(agg.medAll)){
        const yline = agg.x.map(()=>agg.medAll);
        trs.push({
          type:'scatter', mode:'lines', name:'Median – All', showlegend:false,
          x:agg.x, y:yline, line:{color:colAll,width:1.8,dash:'dot'},
          hovertemplate:`Median (All groups)<br>${hx()}<br>%{y:.${ydig}f}<extra></extra>`
        });
        addEndLabel(trs, agg.x[agg.x.length-1], agg.medAll, `Median (All): ${agg.medAll.toFixed(ydig)}`, colAll);
      }
      if(st.statMode==='reg'){
        const idx=[], vals=[];
        for(let i=0;i<agg.yAvg.length;i++){ const v=agg.yAvg[i]; if(Number.isFinite(v)){ idx.push(i); vals.push(v); } }
        if(vals.length>1){
          const {a,b}=linreg(idx, vals);
          const yreg = agg.x.map((_,i)=>a*i+b);
          trs.push({
            type:'scatter',mode:'lines',name:'Regression – All',showlegend:false,
            x:agg.x,y:yreg,line:{color:colAll,width:1.8,dash:'dash'},
            hovertemplate:`Regression (All groups)<br>${hx()}<br>%{y:.${ydig}f}<extra></extra>`
          });
          addEndLabel(trs, agg.x[agg.x.length-1], yreg[yreg.length-1],
            `Reg (All): ${yreg[yreg.length-1].toFixed(ydig)}`, colAll);
        }
      }
    }

    // ---- targets (lines + right-side value text + hover)
    if(Number.isFinite(st.minT) || Number.isFinite(st.maxT)){
      const xl = USE_TIME_X ? ISO_DATES_UNIQ[0] : dates[0];
      const xr = USE_TIME_X ? ISO_DATES_UNIQ[ISO_DATES_UNIQ.length-1] : dates[dates.length-1];
      const ydig = hovDigitsFor(mk);

      if(Number.isFinite(st.minT)){
        trs.push({
          type:'scatter', mode:'lines', showlegend:false,
          x:[xl,xr], y:[st.minT, st.minT],
          line:{color:'#c81e1e', width:1.5, dash:'dot'},
          hovertemplate:`Min target<br>${hx()}<br>%{y:.${ydig}f}<extra></extra>`
        });
        addEndLabel(trs, xr, st.minT, `Min target: ${st.minT.toFixed(ydig)}`, '#c81e1e');
      }
      if(Number.isFinite(st.maxT)){
        trs.push({
          type:'scatter', mode:'lines', showlegend:false,
          x:[xl,xr], y:[st.maxT, st.maxT],
          line:{color:'#c81e1e', width:1.5, dash:'dot'},
          hovertemplate:`Max target<br>${hx()}<br>%{y:.${ydig}f}<extra></extra>`
        });
        addEndLabel(trs, xr, st.maxT, `Max target: ${st.maxT.toFixed(ydig)}`, '#c81e1e');
      }
    }

    return trs;
  }

  /* ----------------- layouts ----------------- */
  function xAxisBase(){
    if(USE_TIME_X){
      const base={type:'date', hoverformat:'%d-%b-%Y', tickformat:'%d'};
      if(ISO_DATES_UNIQ.length>=2) base.range=[ISO_DATES_UNIQ[0], ISO_DATES_UNIQ[ISO_DATES_UNIQ.length-1]];
      return base;
    }
    return {type:'category', categoryorder:'array', categoryarray:dates, tickangle:0};
  }
  function yLayout(st, vals, title, mk){
    const all=vals.filter(Number.isFinite);
    const tf=(()=>{ if(!all.length) return ',.2f'; const a=Math.min(...all), b=Math.max(...all), r=Math.abs(b-a); if(Math.max(Math.abs(a),Math.abs(b))>=10000) return ',.2s'; if(r>=100) return ',.0f'; if(r>=10) return ',.1f'; if(r>=1) return ',.2f'; if(r>=0.1) return ',.3f'; return ',.4f'; })();
    const base={zeroline:false, gridcolor:THEMES[st.theme].GRID, tickformat:yFmtFor(mk||'', tf), gridwidth:1, type:'linear', automargin:true,
                title:{text:title, standoff:16, font:{size:Math.max(10, 14 - Math.max(0,(title||'').length-16)/4)}}};
    if(st.yMode==='log')   return Object.assign({},base,{type:'log', autorange:true});
    if(st.yMode==='zero')  return Object.assign({},base,{rangemode:'tozero', autorange:true});
    if(st.yMode==='manual')return Object.assign({},base,{autorange:false, range:[st.yMin, st.yMax]});
    return Object.assign({},base,{autorange:true});
  }
  function layoutFor(gd, mk, st){
    const t=THEMES[st.theme], legend=legendSpec(st.legend.pos);
    const vals=raw.map(r=>toNum(r[mk])).filter(v=>v!=null&&isFinite(v));
    const title=decodeURIComponent(gd.dataset.title||mk);
    return {
      margin:{l:70,r: (legend.orientation==='v' && legend.x>=1 ? 128 : 16), t:56, b:(MONTH_BAND?76:56), pad:0},
      showlegend: st.legend.show,
      legend:Object.assign({bgcolor:'rgba(0,0,0,0)'}, legend),
      paper_bgcolor:t.BG, plot_bgcolor:t.PBG, font:{color:t.TXT},
      xaxis:Object.assign({automargin:true, title:{text:DATE_TITLE}, showgrid:t.XGRID, gridcolor:t.GRID, showspikes:true, spikethickness:1, spikedash:'dot', spikecolor:t.SPIKE}, xAxisBase()),
      yaxis:yLayout(st, vals, title, mk),
      hovermode: (HOVER_MODE==='unified'?'x unified':'x'),
      hoverlabel:{align:'left'},
      spikedistance: (HOVER_MODE==='unified'?-1:20),
      hoverdistance: (HOVER_MODE==='unified'?10:20),
      dragmode:'pan',
      annotations: (function(){ if(!MONTH_BAND) return []; return MONTH_BAND.map(seg=>({xref:'x', yref:'paper', x:seg.x, y:0, yanchor:'top', yshift:-18, showarrow:false, text:seg.text, font:{size:11,color:t.TXT}, align:'center'})); })(),
      shapes:minmaxShapes(st),
      uirevision: st.uirev
    };
  }

  /* ----------------- state + draw ----------------- */
  const state={};
  sections.forEach(id=>{
    const mk=decodeURIComponent(document.getElementById(id)?.dataset?.measure||'');
    const titleKey=decodeURIComponent(document.getElementById(id)?.dataset?.title||mk);
    state[id]={ chartType: (MEAS_MODE_MAP[mk]||MEAS_MODE_MAP[titleKey]||CHART_TYPE||'line'),
      lineStyle:LINE_STYLE, points:(POINT_MODE_DEFAULT==='none'?'none':POINT_MODE_DEFAULT==='all'?'all':'extremes'),
      labels:SHOW_VALUES_DEFAULT, statMode:'none', scope:'line', gaps:GAP_MODE,
      yMode:'auto', yMin:null, yMax:null, legend:{show:LEG_SHOW,pos:LEG_POS}, theme:'light',
      minT:null, maxT:null, band:false, showTargets:false,
      sizes:{w:800,lineW:2,marker:6,title:14,hov:12}, uirev:1,
      keepYRange:false
    };
  });

  const I=p=>({width:1000,height:1000,path:p});
  const homeI =I('M500 150 L900 450 V850 H650 V600 H350 V850 H100 V450 Z');
  const typeI =I('M200 750 H800 V700 H200 Z M200 600 H600 V550 H200 Z M200 250 H800 V200 H200 Z');
  const ptsI  =I('M200 500 A40 40 0 1 0 199 500 Z M400 500 A40 40 0 1 0 399 500 Z M600 500 A40 40 0 1 0 599 500 Z M800 500 A40 40 0 1 0 799 500 Z');
  const yI    =I('M500 200 V800 M320 650 H680 M320 450 H680');
  const zoomI =I('M200 500 H450 M550 500 H800 M500 200 V450 M500 550 V800');
  const themeI=I('M700 500 A200 200 0 1 1 300 500 A200 200 0 1 0 700 500 Z M500 100 A400 400 0 1 0 900 500 A250 250 0 0 1 500 100 Z');
  const downI =I('M500 180 V720 M500 720 L420 640 M500 720 L580 640');
  const fsI   =I('M140 180 L140 140 L380 140 L380 180 L180 180 L180 380 L140 380 Z M620 140 L860 140 L860 380 L820 380 L820 180 L620 180 Z M140 620 L180 620 L180 820 L380 820 L380 860 L140 860 Z M820 620 L860 620 L860 860 L620 860 L620 820 L820 820 Z');
  const statusI=I('M180 500 H820 M500 200 V800 M350 500 A150 150 0 1 0 351 500 Z');
  const minmaxI=I('M200 720 H800 M200 280 H800 M180 720 L220 720 M180 280 L220 280');

  function cfgFor(gd,id){
    const st=state[id];
    const resetBtn={name:'Reset',title:'Reset chart + UI',icon:homeI,click:()=>{ const mk=decodeURIComponent(gd.dataset.measure||'');
      Object.assign(st,{ chartType:(MEAS_MODE_MAP[mk]||CHART_TYPE||'line'), lineStyle:LINE_STYLE, points:(POINT_MODE_DEFAULT==='none'?'none':POINT_MODE_DEFAULT==='all'?'all':'extremes'),
        labels:SHOW_VALUES_DEFAULT, statMode:'none', scope:'line', gaps:GAP_MODE, yMode:'auto', yMin:null, yMax:null,
        legend:{show:LEG_SHOW,pos:LEG_POS}, minT:null, maxT:null, band:false, showTargets:false, theme:'light', uirev:st.uirev+1, keepYRange:false });
      draw(id);
    }};
    const viewBtn  ={name:'View',title:'Graph type • Line styles • Legend',icon:typeI, click:()=>openViewMenu(gd,id)};
    const ptsBtn   ={name:'Points',title:'Points / labels / gaps',icon:ptsI, click:()=>openPointsMenu(gd,id)};
    const statusBtn={name:'Status',title:'Median / Regression',icon:statusI, click:()=>openStatusMenu(gd,id)};
    const yBtn     ={name:'Y axis',title:'Auto • 0-based • Log • Manual',icon:yI, click:()=>openYAxisMenu(gd,id)};
    const tgtBtn   ={name:'Targets',title:'Min/Max target lines/band',icon:minmaxI, click:()=>openTargetsMenu(gd,id)};
    const zoomBtn  ={name:'Zoom',title:'Zoom X/Y + resets',icon:zoomI, click:()=>openZoomMenu(gd)};
    const themeBtn ={name:'Theme',title:'Light / Dark',icon:themeI, click:()=>{ st.theme=(st.theme==='light'?'dark':'light'); st.uirev++; draw(id);} };
    const dlBtn    ={name:'Download',title:'PNG/CSV',icon:downI, click:()=>openDownloadMenu(gd)};
    const fsBtn    ={name:'Fullscreen',title:'Enter/Exit fullscreen',icon:fsI, click:()=>toggleFS(gd,id)};
    return {displayModeBar:true, displaylogo:false, responsive:true, scrollZoom:false,
      modeBarButtonsToRemove:['toImage','resetScale2d','zoom2d','zoomIn2d','zoomOut2d','pan2d','select2d','lasso2d','hoverClosestCartesian','hoverCompareCartesian','autoScale2d','toggleSpikelines'],
      modeBarButtonsToAdd:[resetBtn,viewBtn,ptsBtn,statusBtn,yBtn,tgtBtn,zoomBtn,themeBtn,dlBtn,fsBtn]};
  }

  function layoutForAny(gd, st){
    const ov=gd.getAttribute('data-overlay');
    if(!ov){ const mk=decodeURIComponent(gd.getAttribute('data-measure')); return layoutFor(gd, mk, st); }
    const meta=JSON.parse(decodeURIComponent(ov)); const seed=meta.left[0]||meta.right[0]; const base=layoutFor(gd, seed, st);
    if(meta.axisMode==='dualY'){ base.yaxis2={overlaying:'y', side:'right', showgrid:false, zeroline:false, automargin:true}; base.margin.r=Math.max(96, base.margin.r||16); }
    return base;
  }
  function tracesForAny(gd, st){
    const ov=gd.getAttribute('data-overlay');
    if(!ov){ const mk=decodeURIComponent(gd.getAttribute('data-measure')); return tracesForMeasure(mk, st); }
    const meta=JSON.parse(decodeURIComponent(ov)); const keys=[...meta.left,...meta.right]; const types=meta.types||[];
    const out=[]; keys.forEach((k,i)=>{ const cloned=Object.assign({},st); cloned.chartType = st.chartType || (types[i]||chartTypeFor(k)); const trs=tracesForMeasure(k, cloned); const y2=meta.right.includes(k);
      trs.forEach(t=>{ if(t.type==='scatter'||t.type==='bar') t.yaxis=(y2?'y2':'y'); }); out.push(...trs); }); return out;
  }

  function calcSizes(gd){ const r=gd.getBoundingClientRect(); const w=Math.max(280, Math.floor(r.width||600));
    return {w, lineW:Math.max(1,Math.min(3,Math.round(w/600*2))), marker:Math.max(3,Math.min(8,Math.round(w/600*5))), title:Math.max(12,Math.min(18,Math.round(w/600*16))), hov:Math.max(10,Math.min(14,Math.round(w/600*12)))}; }

  async function draw(id){
    const gd=document.getElementById(id), st=state[id];
    st.sizes=calcSizes(gd);

    const traces=tracesForAny(gd, st);
    const layout=layoutForAny(gd, st);

    // keep Y-range when requested
    if(gd._lastYRange && st.keepYRange){
      layout.yaxis = Object.assign({}, layout.yaxis, {autorange:false, range: gd._lastYRange.slice()});
    }

    layout.title={text:'<b>'+decodeURIComponent(gd.dataset.title||'')+'</b>', x:0.01, y:0.98, xanchor:'left', yanchor:'top', font:{size:st.sizes.title}};
    layout.hoverlabel = Object.assign({}, layout.hoverlabel, (st.theme==='dark'
      ? {bgcolor:'rgba(15,23,42,.96)', font:{size:st.sizes.hov, color:'#e5e7eb'}, bordercolor:'#475569'}
      : {bgcolor:'rgba(255,255,255,.94)', font:{size:st.sizes.hov, color:'#111827'}, bordercolor:'#94a3b8'}));

    await Plotly.react(gd, traces, layout, cfgFor(gd,id));

    const yr = gd._fullLayout?.yaxis?.range; 
    if(yr) gd._lastYRange = yr.slice();
    st.keepYRange = false;
  }

  /* --------- Menus --------- */
  function btnRect(gd){ const b=gd.querySelector('.modebar'); return b? b.getBoundingClientRect():{right:innerWidth-8,bottom:40,top:8}; }
  function placeMenu(pop, anchor){ const r=anchor||{right:innerWidth-16,bottom:48}; const w=pop.offsetWidth, h=pop.offsetHeight; let left=r.right-w, top=r.bottom+6; if(top+h>innerHeight) top=r.top-h-6; if(left<6) left=6; pop.style.left=left+'px'; pop.style.top=top+'px'; }
  function closeMenus(){ document.querySelectorAll('.oas-pop').forEach(x=>x.remove()); }
  let __open=null; function toggleMenu(kind,build){ if(__open===kind){ closeMenus(); __open=null; return; } closeMenus(); build(); __open=kind; }
  addEventListener('keydown',e=>{ if(e.key==='Escape'){ closeMenus(); __open=null; }},{passive:true});
  addEventListener('mousedown',e=>{ const pops=[...document.querySelectorAll('.oas-pop')]; if(pops.length && !pops.some(p=>p.contains(e.target))) { closeMenus(); __open=null; } },{capture:true,passive:true});

  function openViewMenu(gd,id){ toggleMenu('view', ()=>{ const st=state[id];
    const isLine = st.chartType==='line';
    const pop=document.createElement('div'); pop.className='oas-pop'; pop.innerHTML=`
      <h4>Graph Type</h4>
      <div class="group row">
        <label><input type="radio" name="gt" value="line" ${st.chartType==='line'?'checked':''}> Line</label>
        <label><input type="radio" name="gt" value="bar"  ${st.chartType==='bar'?'checked':''}> Bar</label>
        <label><input type="radio" name="gt" value="area" ${st.chartType==='area'?'checked':''}> Area</label>
      </div>
      <div class="group row" id="lsBox" style="${isLine?'':'display:none'}">
        <h4>Line Style</h4>
        <label><input type="radio" name="ls" value="curved"   ${st.lineStyle==='curved'?'checked':''}> Curved</label>
        <label><input type="radio" name="ls" value="straight" ${st.lineStyle==='straight'?'checked':''}> Straight</label>
        <label><input type="radio" name="ls" value="dashed"   ${st.lineStyle==='dashed'?'checked':''}> Dashed</label>
        <label><input type="radio" name="ls" value="dotted"   ${st.lineStyle==='dotted'?'checked':''}> Dotted</label>
        <label><input type="radio" name="ls" value="dashdot"  ${st.lineStyle==='dashdot'?'checked':''}> Dash-dot</label>
      </div>
      <h4>Legend</h4>
      <div class="group row">
        <label><input type="radio" name="lpos" value="auto"       ${st.legend.pos==='auto'?'checked':''}> Auto</label>
        <label><input type="radio" name="lpos" value="top-left"   ${st.legend.pos==='top-left'?'checked':''}> Top-left</label>
        <label><input type="radio" name="lpos" value="top-center" ${st.legend.pos==='top-center'?'checked':''}> Top-center</label>
        <label><input type="radio" name="lpos" value="top-right"  ${st.legend.pos==='top-right'?'checked':''}> Top-right</label>
        <label><input type="radio" name="lpos" value="bottom"     ${st.legend.pos==='bottom'?'checked':''}> Bottom</label>
        <label><input type="radio" name="lpos" value="left"       ${st.legend.pos==='left'?'checked':''}> Left</label>
        <label><input type="radio" name="lpos" value="right"      ${st.legend.pos==='right'?'checked':''}> Right</label>
        <label><input type="radio" name="lshow" value="1" ${st.legend.show?'checked':''}> Show</label>
        <label><input type="radio" name="lshow" value="0" ${!st.legend.show?'checked':''}> Hide</label>
      </div>`;
    document.body.appendChild(pop); placeMenu(pop, btnRect(gd));
    pop.addEventListener('change',e=>{
      if(e.target.name==='gt'){
        // lock current Y-range as MANUAL so it doesn't change on later menu clicks
        const r = gd._fullLayout?.yaxis?.range; 
        if(r && r.length===2 && isFinite(+r[0]) && isFinite(+r[1])){
          st.yMode='manual'; st.yMin=+r[0]; st.yMax=+r[1];
        }else{
          st.keepYRange = true; // fallback once
        }
        st.chartType = e.target.value;
        const box = pop.querySelector('#lsBox'); if(box) box.style.display = (st.chartType==='line')?'block':'none';
      }
      if(e.target.name==='ls')   st.lineStyle = e.target.value;
      if(e.target.name==='lpos') st.legend.pos = e.target.value;
      if(e.target.name==='lshow')st.legend.show = (e.target.value==='1');
      st.uirev++; draw(id);
    },{passive:true});
  }); }

  function openPointsMenu(gd,id){ toggleMenu('points', ()=>{ const st=state[id];
    const pop=document.createElement('div'); pop.className='oas-pop'; pop.innerHTML=`
      <h4>Points &amp; Labels</h4>
      <div class="group row">
        <label><input type="radio" name="pm" value="none"     ${st.points==='none'?'checked':''}> None</label>
        <label><input type="radio" name="pm" value="extremes" ${st.points==='extremes'?'checked':''}> Only outliers</label>
        <label><input type="radio" name="pm" value="all"      ${st.points==='all'?'checked':''}> All points</label>
      </div>
      <div class="group row">
        <label><input type="radio" name="lbl" value="off" ${!st.labels?'checked':''}> Labels OFF</label>
        <label><input type="radio" name="lbl" value="on"  ${st.labels?'checked':''}> Labels ON</label>
      </div>
      <h4>Gaps</h4>
      <div class="group row">
        <label><input type="radio" name="gap" value="break"   ${st.gaps==='break'?'checked':''}> Break gaps</label>
        <label><input type="radio" name="gap" value="connect" ${st.gaps==='connect'?'checked':''}> Connect gaps</label>
        <label><input type="radio" name="gap" value="interp"  ${st.gaps==='interp'?'checked':''}> Interpolate (add ×)</label>
      </div>`;
    document.body.appendChild(pop); placeMenu(pop, btnRect(gd));
    pop.addEventListener('change',e=>{ if(e.target.name==='pm') st.points=e.target.value; if(e.target.name==='lbl') st.labels=(e.target.value==='on'); if(e.target.name==='gap') st.gaps=e.target.value; st.uirev++; draw(id); },{passive:true});
  }); }

  function openStatusMenu(gd,id){ toggleMenu('status', ()=>{ const st=state[id];
    const pop=document.createElement('div'); pop.className='oas-pop'; pop.innerHTML=`
      <h4>Status</h4>
      <div class="group row">
        <label><input type="radio" name="sm" value="none"   ${st.statMode==='none'?'checked':''}> None</label>
        <label><input type="radio" name="sm" value="median" ${st.statMode==='median'?'checked':''}> Median</label>
        <label><input type="radio" name="sm" value="reg"    ${st.statMode==='reg'?'checked':''}> Regression</label>
      </div>
      <div class="group row">
        <label><input type="radio" name="scp" value="line" ${st.scope==='line'?'checked':''}> Scope: By group</label>
        <label><input type="radio" name="scp" value="all"  ${st.scope==='all'?'checked':''}> Scope: All groups</label>
      </div>`;
    document.body.appendChild(pop); placeMenu(pop, btnRect(gd));
    pop.addEventListener('change',e=>{ if(e.target.name==='sm'){ st.statMode=e.target.value; } if(e.target.name==='scp') st.scope=e.target.value; st.uirev++; draw(id); },{passive:true});
  }); }

  function openTargetsMenu(gd,id){ toggleMenu('targets', ()=>{ const st=state[id];
    const pop=document.createElement('div'); pop.className='oas-pop'; pop.innerHTML=`
      <h4>Min / Max targets</h4>
      <div class="group row">
        <label><input type="radio" name="band" value="line" ${!st.band?'checked':''}> Style: Line</label>
        <label><input type="radio" name="band" value="area" ${st.band?'checked':''}> Style: Band</label>
      </div>
      <div class="group">
        <div class="row"><input id="mmmin" type="number" placeholder="min" value="${Number.isFinite(st.minT)?st.minT:''}"></div>
        <div class="row"><input id="mmmax" type="number" placeholder="max" value="${Number.isFinite(st.maxT)?st.maxT:''}"></div>
        <div class="row"><button id="apply">Apply</button> <button id="clear">Clear</button></div>
      </div>`;
    document.body.appendChild(pop); placeMenu(pop, btnRect(gd));
    pop.addEventListener('change',e=>{ if(e.target.name==='band'){ st.band=(e.target.value==='area'); st.uirev++; draw(id); } },{passive:true});
    pop.querySelector('#apply').onclick=()=>{ const mi=parseFloat(pop.querySelector('#mmmin').value), ma=parseFloat(pop.querySelector('#mmmax').value); st.minT=Number.isFinite(mi)?mi:null; st.maxT=Number.isFinite(ma)?ma:null; st.showTargets=true; st.uirev++; draw(id); };
    pop.querySelector('#clear').onclick=()=>{ st.minT=null; st.maxT=null; st.showTargets=false; st.uirev++; draw(id); };
  }); }

  function openYAxisMenu(gd,id){ toggleMenu('yaxis', ()=>{ const st=state[id];
    const pop=document.createElement('div'); pop.className='oas-pop'; pop.innerHTML=`
      <h4>Y-axis</h4>
      <div class="group row">
        <label><input type="radio" name="ym" value="auto" ${st.yMode==='auto'?'checked':''}> Auto</label>
        <label><input type="radio" name="ym" value="zero" ${st.yMode==='zero'?'checked':''}> 0-based</label>
        <label><input type="radio" name="ym" value="log"  ${st.yMode==='log'?'checked':''}> Log</label>
      </div>
      <div class="group">
        <div class="row"><input id="ymin" type="number" placeholder="min" value="${st.yMin??''}"></div>
        <div class="row"><input id="ymax" type="number" placeholder="max" value="${st.yMax??''}"></div>
        <div class="row"><button id="apply">Apply</button> <button id="clear">Clear</button></div>
      </div>`;
    document.body.appendChild(pop); placeMenu(pop, btnRect(gd));
    pop.addEventListener('change',e=>{ if(e.target.name!=='ym') return; st.yMode=e.target.value; if(st.yMode!=='manual'){ st.yMin=null; st.yMax=null; } st.uirev++; draw(id); },{passive:true});
    pop.querySelector('#apply').onclick=()=>{ const mi=parseFloat(pop.querySelector('#ymin').value), ma=parseFloat(pop.querySelector('#ymax').value); st.yMin=Number.isFinite(mi)?mi:null; st.yMax=Number.isFinite(ma)?ma:null; st.yMode='manual'; st.uirev++; draw(id); };
    pop.querySelector('#clear').onclick=()=>{ st.yMin=null; st.yMax=null; st.yMode='auto'; st.uirev++; draw(id); };
  }); }

  function openZoomMenu(gd){ toggleMenu('zoom', ()=>{ const pop=document.createElement('div'); pop.className='oas-pop'; pop.innerHTML=`
      <h4>Zoom</h4>
      <div class="group">
        <div class="row"><button data-z="xin">X +</button><button data-z="xout">X −</button><button data-z="xreset">X reset</button></div>
        <div class="row"><button data-z="yin">Y +</button><button data-z="yout">Y −</button><button data-z="yreset">Y reset</button></div>
        <div class="row"><button data-z="reset">Reset both</button></div>
      </div>`;
    document.body.appendChild(pop); placeMenu(pop, btnRect(gd));
    const setR=(ax,r)=>{ const o={}; o[ax+'axis.range']=r; return Plotly.relayout(gd,o); };
    function zoom(ax,dir){ const la=gd._fullLayout[ax+'axis']; const r=la?.range?.slice()||null; if(!r){ const o={}; o[ax+'axis.autorange']=true; Plotly.relayout(gd,o).then(()=>zoom(ax,dir)); return; }
      const f=(dir==='in'?0.8:1.25);
      if(la.type==='date'){ const toMs=v=> (typeof v==='number')?v:(new Date(v)).getTime(); const toStr=ms=> (new Date(ms)).toISOString(); const a=toMs(r[0]), b=toMs(r[1]); const c=(a+b)/2, nh=(b-a)/2*f; setR(ax,[toStr(c-nh),toStr(c+nh)]); }
      else { const a=+r[0], b=+r[1]; const c=(a+b)/2, nh=(b-a)/2*f; setR(ax,[c-nh,c+nh]); } }
    pop.querySelectorAll('button[data-z]').forEach(b=>b.onclick=()=>{ const k=b.dataset.z; if(k==='xin')zoom('x','in'); if(k==='xout')zoom('x','out'); if(k==='xreset')Plotly.relayout(gd,{'xaxis.autorange':true}); if(k==='yin')zoom('y','in'); if(k==='yout')zoom('y','out'); if(k==='yreset')Plotly.relayout(gd,{'yaxis.autorange':true}); if(k==='reset')Plotly.relayout(gd,{'xaxis.autorange':true,'yaxis.autorange':true}); });
  }); }

  function openDownloadMenu(gd){ toggleMenu('download', ()=>{ const pop=document.createElement('div'); pop.className='oas-pop'; pop.innerHTML=`<h4>Download</h4>
      <div class="group"><button data-dl="png">PNG (this)</button><button data-dl="csv">CSV (this)</button></div>`;
    document.body.appendChild(pop); placeMenu(pop, btnRect(gd));
    pop.querySelector('[data-dl="png"]').onclick=()=>{ const title=decodeURIComponent(gd.getAttribute('data-title')||'chart'); Plotly.downloadImage(gd,{format:'png',scale:2,filename:title.replace(/\s+/g,'_')}); };
    pop.querySelector('[data-dl="csv"]').onclick=()=>downloadCSV(gd);
  }); }
  function downloadCSV(gd){ const mk=decodeURIComponent(gd.getAttribute('data-measure')), title=decodeURIComponent(gd.getAttribute('data-title')||mk||'overlay');
    const by=perLineArray(mk); const out=[`"${DATE_TITLE}","${LINE_TITLE}","${CELL_TITLE}","Value"`]; for(const ln of lines){ const X=by[ln].x, Y=by[ln].y, T=by[ln].t; for(let i=0;i<Y.length;i++) out.push(`"${X[i]}","${ln}","${T[i]??''}","${Y[i]==null?'':Y[i]}"`); }
    const blob=new Blob([out.join('\n')],{type:'text/csv;charset=utf-8;'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=(title||'measure').replace(/\s+/g,'_')+'.csv'; a.click(); }

  /* --------- Fullscreen (preserve state) --------- */
  async function toggleFS(g,id){
    const st=state[id];

    // EXIT FS
    if(g._fsOverlay){
      if(g._origParent){
        if(g._after && g._after.parentNode===g._origParent) g._origParent.insertBefore(g,g._after);
        else g._origParent.appendChild(g);
      }
      g.style.width='100%';
      g.style.height=(g._prevH||parseInt(CHART_H)||200)+'px';
      g._fsOverlay.remove(); g._fsOverlay=null;
      removeEventListener('resize',g._fsResize);

      g.style.opacity=0.01;
      await Plotly.relayout(g,{autosize:true});
      Plotly.Plots.resize(g);
      await draw(id);
      g.style.opacity=1;
      return;
    }

    // ENTER FS (do NOT force any setting; preserve current st.*)
    g._origParent=g.parentNode; g._after=g.nextSibling;
    g._prevH=(parseInt(g.style.height,10)||parseInt(CHART_H)||200);

    const ov=document.createElement('div'); ov.className='pl-fs-overlay'; document.body.appendChild(ov); g._fsOverlay=ov;
    const row=document.createElement('div'); row.className='fs-row'; ov.appendChild(row);
    const top=document.createElement('div'); top.className='fs-chart'; row.appendChild(top); top.appendChild(g);

    g._fsResize=function(){
      const ih=innerHeight, iw=innerWidth;
      g.style.width=iw+'px'; g.style.height=ih+'px';
      Plotly.relayout(g,{margin:{l:80,r:28,t:84,b:64,pad:0}, width:iw, height:ih, autosize:false});
      Plotly.Plots.resize(g);
    };
    addEventListener('resize',g._fsResize);
    g._fsResize();
    draw(id);
  }

  /* ----------------- lazy & start ----------------- */
  if(!sections.length){ return; }
  draw(sections[0]);
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(es=>{ es.forEach(e=>{ if(e.isIntersecting){ draw(e.target.id); io.unobserve(e.target); } }); },{root:null,rootMargin:'400px',threshold:0});
    sections.slice(1).forEach(id=>io.observe(document.getElementById(id)));
  }else{ sections.slice(1).forEach(id=>draw(id)); }
})();
</script>

