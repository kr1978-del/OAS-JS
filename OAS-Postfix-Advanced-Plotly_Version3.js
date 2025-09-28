]</div>

<!-- OAS params -->
<div id="oas-params" style="display:none"
  data-gpr="@{GraphsPerRow}{1}"

  data-date-title="@{PV_Attribute01}{week}"
  data-line-title="@{PV_Attribute02}{Line}"
  data-cell-title="@{PV_Attribute03}{Cell}"

  data-legend-pos="@{PV_LegendPos}{top-center}"
  data-legend-show="@{PV_LegendShow}{1}"

  data-mtitles="@{PV_MeasureTitles}{}"
  data-p1="@{P1Title}{}" data-p2="@{P2Title}{}" data-p3="@{P3Title}{}" data-p4="@{P4Title}{}"

  data-plot-settings="@{PV_PlotSettings}{}"
></div>

<style>
  html,body{margin:0;padding:0}
  #chart-grid{width:100%;max-width:100%}

  .grid{display:grid;gap:6px;width:100%;max-width:100%}
  .cols1{grid-template-columns:repeat(1,minmax(0,1fr))}
  .cols2{grid-template-columns:repeat(2,minmax(0,1fr))}
  .cols3{grid-template-columns:repeat(3,minmax(0,1fr))}

  .sec{
    border:1.5px solid #6b7280;border-radius:14px;background:#fff;
    position:relative;width:100%;margin:0;max-width:100%;overflow:hidden;
    box-shadow:0 1px 8px rgba(0,0,0,.04)
  }
  [data-theme="dark"] .sec{background:#0f172a;border-color:#2b3447}
  .sec > .js-plotly-plot{width:100% !important;max-width:100%}

  .js-plotly-plot .modebar{
    position:absolute !important; top:6px !important; right:6px !important;
    background:transparent !important; z-index:100 !important;
  }
  .js-plotly-plot .modebar-btn .icon path{fill:none!important;stroke:#6b7280!important;stroke-width:80!important}
  .js-plotly-plot .modebar-btn:hover .icon path{stroke:#111827!important}
  [data-theme="dark"] .js-plotly-plot .modebar-btn .icon path{stroke:#9aa4b2!important}
  [data-theme="dark"] .js-plotly-plot .modebar-btn:hover .icon path{stroke:#e5e7eb!important}
  .js-plotly-plot .modebar-btn[data-on="1"] .icon path{stroke:#111827!important}
  [data-theme="dark"] .js-plotly-plot .modebar-btn[data-on="1"] .icon path{stroke:#e5e7eb!important}

  .oas-pop{
    position:fixed; z-index:2147483646;
    background:#fff; border:1px solid #e5e7eb; border-radius:12px; padding:10px;
    box-shadow:0 6px 24px rgba(0,0,0,.12);
    display:flex; flex-direction:column; gap:8px; font:12px/1.35 system-ui,-apple-system,Segoe UI,Roboto,Arial;
    max-width:92vw; min-width:220px
  }
  .oas-pop h4{margin:0 0 6px 0;font:600 12px/1.2 system-ui}
  .oas-pop .row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
  .oas-pop input[type="text"], .oas-pop input[type="number"], .oas-pop select{
    padding:6px 8px;border:1px solid #cfd5df;border-radius:8px;font:12px system-ui
  }
  .oas-pop button{padding:6px 10px;border:1px solid #cfd5df;border-radius:8px;background:#fff;cursor:pointer;font:12px/1 system-ui}
  .oas-pop button:hover{background:#f3f4f6}
  .oas-pop .close-x{position:absolute;top:6px;right:6px;border:none;background:transparent;cursor:pointer;font-weight:700}
  [data-theme="dark"] .oas-pop{background:#0f172a;border-color:#1f2937;box-shadow:0 6px 24px rgba(0,0,0,.4);color:#e5e7eb}
  [data-theme="dark"] .oas-pop input,[data-theme="dark"] .oas-pop select{background:#0b1220;border-color:#2b3447;color:#e5e7eb}
  [data-theme="dark"] .oas-pop button{border-color:#394357;color:#e5e7eb}
  [data-theme="dark"] .oas-pop button:hover{background:#1f2937}

  .pl-fs-overlay{position:fixed;inset:0;background:#fff;z-index:2147483647;overflow:auto}
  [data-theme="dark"] .pl-fs-overlay{background:#0b1220}

  .status-wrap{padding:6px 8px 10px; overflow-x:auto}
  .status-table{width:100%; border-collapse:collapse; font:12px/1.35 system-ui; min-width:1100px}
  .status-table th,.status-table td{border:1px solid #e5e7eb; padding:6px 8px; text-align:right; white-space:nowrap}
  .status-table th{background:#f8fafc; text-align:center; position:sticky; top:0; z-index:1}
  .status-table td:first-child,.status-table th:first-child{text-align:left}
  .status-table td:nth-child(2){text-align:left}
  .pos-cell{background:#e8f7ee}
  .neg-cell{background:#ffecec}
  [data-theme="dark"] .status-table th,[data-theme="dark"] .status-table td{border-color:#2b3447}
  [data-theme="dark"] .status-table th{background:#0f172a}
  [data-theme="dark"] .pos-cell{background:#0f2a1b}
  [data-theme="dark"] .neg-cell{background:#2a1414}

  @media (max-width: 1024px){
    #chart-grid.cols2, #chart-grid.cols3{grid-template-columns: repeat(1, minmax(0, 1fr));}
  }
</style>

<div id="chart-grid" class="grid cols1"></div>

<script src="/analyticsRes/custom/plotly.min.js"></script>
<script>
(function(){
  try{
    if(typeof Plotly==='undefined'){ const g=document.getElementById('chart-grid'); if(g) g.innerHTML='<div class="sec">Plotly not found</div>'; return; }

    // THEME
    const THEMES={ light:{BG:'#fff',PBG:'#fff',TXT:'#111827',GRID:'#e5e7eb'}, dark:{BG:'#0b1220',PBG:'#0f172a',TXT:'#e5e7eb',GRID:'#293244'} };
    let CUR_THEME='light'; const setThemeAttr=()=>document.documentElement.setAttribute('data-theme', CUR_THEME==='dark'?'dark':'light'); setThemeAttr();

    // CONFIG
    const HEIGHT=360, EXTREME_K=3.0, MILD_K=1.5;
    const ROTATE_THRESHOLD=12;
    const LS_KEY='OAS_BOX_STATE_V4';

    // HOISTED UTIL
    function rmKey(mk, ln, x, y, cell){ return `${mk}␟${ln}␟${x}␟${cell ?? ''}␟${y}`; }
    const KEYS={ dt:'dt', line:'line', cell:'cell' };
    const PALETTE=['#2E77D0','#E07A1F','#2FA24B','#C33C3C','#7C5AC9','#8C564B','#E377C2','#17BECF','#7f7f7f'];
    const LINE_COLORS={}; const colorFor=ln=>LINE_COLORS[ln]||(LINE_COLORS[ln]=PALETTE[Object.keys(LINE_COLORS).length%PALETTE.length]);
    const rgba=(h,a=0.14)=>{const b=h.replace('#','');const n=parseInt(b,16);return`rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`};

    // PARAMS
    const p=document.getElementById('oas-params')||{dataset:{}};
    const GPR=Math.min(3,Math.max(1,parseInt(p.dataset.gpr||'1',10)||1));
    const DATE_TITLE=(p.dataset.dateTitle||'Date').trim();
    const LINE_TITLE=(p.dataset.lineTitle||'Line').trim();
    const CELL_TITLE=(p.dataset.cellTitle||'Cell').trim();
    const LEG_SHOW = (String(p.dataset.legendShow||'1')!=='0');
    const normLegendPos=(v)=>{ v=(v||'top-center').toLowerCase().replace(/\s+/g,'-'); const a={top:'top-center',bottom:'bottom-center'}; return a[v]||v; };
    const LEG_POS = normLegendPos(p.dataset.legendPos || 'top-center');
    const PV_SETTINGS_RAW=(p.dataset.plotSettings||'').trim();

    const MT=(p.dataset.mtitles||'').split('|').map(s=>s.trim()).filter(Boolean);
    const pTitles=[]; for(let i=1;i<=160;i++){ const v=(p.dataset['p'+i]||'').trim(); if(v) pTitles.push(v); }

    // DATA
    const host=document.getElementById('box-data'); if(!host){ fail('box-data not found'); return; }
    let raw=[]; try{ raw=JSON.parse((host.textContent||'[]').trim()); }catch(e){ fail('Invalid JSON in box-data'); return; }
    if(!raw.length){ document.getElementById('chart-grid').innerHTML='<div class="sec">No data rows.</div>'; return; }

    const toNum=s=>{ if(s==null) return null; let t=(''+s).trim(); if(!t) return null;
      t=t.replace(/[^\d.,\-]/g,''); const d=t.lastIndexOf('.'), c=t.lastIndexOf(',');
      if(d!==-1&&c!==-1) t=(c>d)?t.replace(/\./g,'').replace(',', '.'):t.replace(/,/g,''); else if(c!==-1) t=t.replace(',', '.'); else t=t.replace(/,/g,'');
      const v=parseFloat(t); return Number.isFinite(v)?v:null; };

    const rows=raw.map(r=>{ const o={d:String(r[KEYS.dt]), ln:String(r[KEYS.line]??'—'), cell:String(r[KEYS.cell]??'')};
      for(const k in r){ if(k===KEYS.dt||k===KEYS.line||k===KEYS.cell) continue; const v=toNum(r[k]); if(v!=null) o[k]=v; } return o; });

    const pref=Array.from({length:160},(_,i)=>'m'+(i+1));
    const mKeys=[...new Set(rows.flatMap(o=>Object.keys(o)))].filter(k=>!['d','ln','cell'].includes(k))
                  .filter(k=>rows.some(r=>Number.isFinite(r[k]))).sort((a,b)=>pref.indexOf(a)-pref.indexOf(b));
    if(!mKeys.length){ document.getElementById('chart-grid').innerHTML='<div class="sec">No numeric measures found.</div>'; return; }
    const TIT={}; mKeys.forEach((k,i)=>TIT[k]=(MT[i]||pTitles[i]||k));

    const dates=[...new Set(rows.map(r=>r.d))];
    const ROTATE=dates.length>ROTATE_THRESHOLD;
    const lines=[...new Set(rows.map(r=>r.ln))]; lines.forEach(colorFor);

    // STORE
    const quantiles=a=>{const s=a.slice().sort((x,y)=>x-y), n=s.length; if(!n) return {q1:null,med:null,q3:null,iqr:null,min:s[0],max:s[n-1]};
      const q=p=>{const i=(n-1)*p, lo=Math.floor(i), hi=Math.ceil(i); return lo===hi?s[lo]:s[lo]+(s[hi]-s[lo])*(i-lo)}; return {q1:q(0.25),med:q(0.5),q3:q(0.75),iqr:q(0.75)-q(0.25),min:s[0],max:s[n-1]} };

    const map={}; mKeys.forEach(k=>map[k]={});
    for(const r of rows){ for(const mk of mKeys){ const v=r[mk]; if(!Number.isFinite(v)) continue;
      ((map[mk][r.d]=map[mk][r.d]||{})[r.ln]=map[mk][r.d][r.ln]||[]).push({y:v,cell:r.cell}); } }

    const store={};
    for(const mk of mKeys){
      store[mk]={};
      for(const ln of lines) store[mk][ln]={ inX:[],inY:[],inT:[], mildX:[],mildY:[],mildT:[], extX:[],extY:[],extT:[], allX:[],allY:[],allT:[], medX:[],medY:[],medTXT:{}, tag:new Set() };
      for(const d of dates){
        const byLine=map[mk][d]||{};
        for(const ln of lines){
          const arr=byLine[ln]||[]; if(!arr.length) continue;
          const vals=arr.map(o=>o.y), st=quantiles(vals);
          const fmL=st.q1-MILD_K*st.iqr, fmH=st.q3+MILD_K*st.iqr, feL=st.q1-EXTREME_K*st.iqr, feH=st.q3+EXTREME_K*st.iqr;

          const inl=[], mild=[], ext=[]; for(const o of arr){ if(o.y<feL||o.y>feH) ext.push(o); else if(o.y<fmL||o.y>fmH) mild.push(o); else inl.push(o); }

          const S=store[mk][ln];
          for(const o of inl){ S.inX.push(d); S.inY.push(o.y); S.inT.push(o.cell); S.tag.add(rmKey(mk,ln,d,o.y,o.cell)+'␟in'); }
          for(const o of mild){ S.mildX.push(d); S.mildY.push(o.y); S.mildT.push(o.cell); S.tag.add(rmKey(mk,ln,d,o.y,o.cell)+'␟mild'); }
          for(const o of ext){ S.extX.push(d); S.extY.push(o.y); S.extT.push(o.cell); S.tag.add(rmKey(mk,ln,d,o.y,o.cell)+'␟ext'); }
          for(const o of arr){ S.allX.push(d); S.allY.push(o.y); S.allT.push(o.cell); }

          const medS=quantiles((inl.concat(mild)).map(o=>o.y));
          const txt=`${LINE_TITLE}: ${ln}<br>${DATE_TITLE}: ${d}<br>`+
            `Min: ${fmtN(medS.min)}<br>Q1: ${fmtN(medS.q1)}<br>Median: ${fmtN(medS.med)}<br>Q3: ${fmtN(medS.q3)}<br>Max: ${fmtN(medS.max)}<br>`+
            `n: ${arr.length} &nbsp;|&nbsp; Inliers: ${inl.length} &nbsp;|&nbsp; Outliers: ${mild.length} &nbsp;|&nbsp; Extremes: ${ext.length}`;
          S.medX.push(d); S.medY.push(medS.med!=null?medS.med:(inl[0]?.y ?? mild[0]?.y ?? ext[0]?.y)); S.medTXT[d]=txt;
        }
      }
    }
    function fmtN(v){ return v==null?'—':(+v).toFixed(3); }

    // GRID
    const grid=document.getElementById('chart-grid');
    const applyCols=n=>{ grid.classList.toggle('cols1',n===1); grid.classList.toggle('cols2',n===2); grid.classList.toggle('cols3',n===3); };
    applyCols(GPR);

    function makeSection(mk,title){
      const id='m_'+Math.random().toString(36).slice(2,9);
      const sec=document.createElement('div'); sec.className='sec';
      sec.innerHTML=`<div id="${id}" data-measure="${encodeURIComponent(mk)}" data-title="${encodeURIComponent(title)}" style="width:100%;height:${HEIGHT}px"></div>
                     <div id="st_${id}" class="status-wrap" style="display:none"></div>`;
      grid.appendChild(sec); return id;
    }
    const sections=mKeys.map(k=>makeSection(k,TIT[k]));

    // STATE
    const state={};
    sections.forEach(id=>state[id]={
      fmin:null,fmax:null,exclude:new Set(), exZero:false, exOut15:false, exExt3:true,
      includeExt:false, showMed:false, showReg:false, dense:false, kde:false,
      showLegend:LEG_SHOW, legendPos:'auto', showStatus:false, labels:'off',
      chartType:'box', seriesMode:'perLine', barMode:'group', orient:'v',
      LSL:null, USL:null, TGT:null,
      uirev:1,lastHover:null
    });

    const PV_DEFAULTS=parsePVSettings(PV_SETTINGS_RAW); if(PV_DEFAULTS) applyAllSettings(PV_DEFAULTS);
    const LS_SAVED=loadLocal(); if(LS_SAVED) applyAllSettings(LS_SAVED);

    // AXES/LEGEND
    const xAxisSpec=()=>({
      type:'category',categoryorder:'array',categoryarray:dates,
      tickmode:'auto',tickangle:ROTATE?-90:0,tickfont:{size:ROTATE?10:12},
      automargin:true, title:{text: DATE_TITLE}, gridcolor:THEMES[CUR_THEME].GRID, zeroline:false
    });
    function legendSpec(pos){
      switch(pos){
        case 'top-left':      return {orientation:'h', x:0,   xanchor:'left',   y:1.06, yanchor:'bottom'};
        case 'top-center':    return {orientation:'h', x:0.5, xanchor:'center', y:1.06, yanchor:'bottom'};
        case 'top-right':     return {orientation:'h', x:1,   xanchor:'right',  y:1.06, yanchor:'bottom'};
        case 'bottom-center': return {orientation:'h', x:0.5, xanchor:'center', y:-0.22,yanchor:'top'};
        case 'left':          return {orientation:'v', x:-0.02,xanchor:'left',  y:1,    yanchor:'top'};
        case 'right':         return {orientation:'v', x:1.02, xanchor:'left',  y:1,    yanchor:'top'};
        default:              return {orientation:'h', x:0.5, xanchor:'center', y:1.06, yanchor:'bottom'};
      }
    }
    function marginsFor(pos, st){
      const top=68, bottom=(ROTATE?96:48), right=(st.chartType==='hist'&&st.kde?72:8);
      if(pos==='top-left'||pos==='top-center'||pos==='top-right') return { l:64, r:right, t:top, b:bottom, pad:0 };
      if(pos==='bottom-center') return { l:64, r:right, t:28, b:bottom+28, pad:0 };
      if(pos==='left') return { l:128, r:right, t:28, b:bottom, pad:0 };
      if(pos==='right') return { l:64, r:128, t:28, b:bottom, pad:0 };
      return { l:64, r:right, t:top, b:bottom, pad:0 };
    }

    // FILTERS
    function passesFilters(mk, ln, x, y, cell, st){
      if(y==null||!isFinite(y)) return false;
      if(st.exZero && y===0) return false;
      if(st.fmin!=null && y<st.fmin) return false;
      if(st.fmax!=null && y>st.fmax) return false;
      if(st.exclude.has(rmKey(mk,ln,x,y,cell))) return false;
      const key = rmKey(mk,ln,x,y,cell);
      const S=store[mk][ln];
      if(st.exOut15){ if(S.tag.has(key+'␟mild') || S.tag.has(key+'␟ext')) return false; }
      else if(st.exExt3){ if(S.tag.has(key+'␟ext')) return false; }
      return true;
    }
    function filtArr(mk, ln, X,Y,T, st){
      const Xo=[],Yo=[],To=[]; for(let i=0;i<Y.length;i++){ if(passesFilters(mk,ln,X[i],Y[i],T[i],st)){ Xo.push(X[i]); Yo.push(Y[i]); To.push(T[i]); } } return {X:Xo,Y:Yo,T:To};
    }

    // KDE + Regression
    function kde(xs, sample){
      const v=sample.filter(Number.isFinite); const n=v.length; if(!n) return xs.map(()=>0);
      const mean=v.reduce((a,b)=>a+b,0)/n; const varr=v.reduce((a,b)=>a+(b-mean)*(b-mean),0)/Math.max(1,n-1); const std=Math.sqrt(Math.max(varr,1e-12));
      const h=1.06*std*Math.pow(n,-1/5), inv=1/(Math.sqrt(2*Math.PI)*h);
      return xs.map(x=>{ let s=0; for(let i=0;i<n;i++){ const z=(x-v[i])/h; s+=Math.exp(-0.5*z*z); } return inv*s/n; });
    }
    function linreg(Y){
      const idx=[], y=[]; for(let i=0;i<Y.length;i++){ const v=Y[i]; if(Number.isFinite(v)){ idx.push(i); y.push(v); } }
      const n=y.length; if(n<2) return {a:0,b:(y[0]||0), ok:false};
      let sx=0,sy=0,sxx=0,sxy=0; for(let i=0;i<n;i++){ const X=idx[i], v=y[i]; sx+=X; sy+=v; sxx+=X*X; sxy+=X*v; }
      const d=(n*sxx - sx*sx)||1e-9; const a=(n*sxy - sx*sy)/d; const b=(sy - a*sx)/n; return {a,b,ok:true};
    }

    // TRACE BUILDER
    function tracesFor(mk, st){
      const traces=[];

      if((st.chartType==='box' || st.chartType==='violin') && st.seriesMode==='all'){
        const col='#6b7280', ax=[], ay=[];
        for(const d of dates){
          for(const ln of lines){
            const S=store[mk][ln]; const f=filtArr(mk, ln, S.allX,S.allY,S.allT,st);
            for(let i=0;i<f.Y.length;i++){ if(f.X[i]===d){ ax.push(d); ay.push(f.Y[i]); } }
          }
        }
        if(st.chartType==='box'){
          traces.push({type:'box', name:'All', alignmentgroup:mk, x:ax, y:ay, marker:{color:col}, fillcolor:rgba(col,0.12),
                       boxpoints:(st.includeExt?'all':'suspectedoutliers'), jitter:(st.includeExt?0.4:0), pointpos:0,
                       hovertemplate:`${DATE_TITLE}: %{x}<br>Value: %{y}<extra></extra>`});
        }else{
          traces.push({type:'violin', name:'All', alignmentgroup:mk, x:ax, y:ay, points:(st.includeExt?'all':'suspectedoutliers'),
                       marker:{color:col}, hovertemplate:`${DATE_TITLE}: %{x}<br>Value: %{y}<extra></extra>`});
        }
        return traces;
      }

      if(st.chartType==='hist'){
        if(st.seriesMode==='all'){
          const v=[]; for(const ln of lines){ const S=store[mk][ln]; const f=filtArr(mk, ln, S.allX,S.allY,S.allT,st); v.push(...f.Y); }
          traces.push({type:'histogram', name:'All', x:v, marker:{color:'#6b7280'}, opacity:0.8});
          if(st.kde){ const vv=v.filter(Number.isFinite); if(vv.length>=3){ const mn=Math.min(...vv), mx=Math.max(...vv), n=60, xs=Array.from({length:n+1},(_,i)=>mn+(mx-mn)*i/n); const dens=kde(xs,vv);
            traces.push({type:'scatter',mode:'lines',name:'Density',x:xs,y:dens,yaxis:'y2',line:{color:'#111827'}}); } }
          return traces;
        }else{
          for(const ln of lines){
            const S=store[mk][ln]; const f=filtArr(mk, ln, S.allX,S.allY,S.allT,st);
            traces.push({type:'histogram', name:ln, x:f.Y, marker:{color:LINE_COLORS[ln]}, opacity:0.75});
            if(st.kde){ const vv=f.Y.filter(Number.isFinite); if(vv.length>=3){ const mn=Math.min(...vv), mx=Math.max(...vv), n=48, xs=Array.from({length:n+1},(_,i)=>mn+(mx-mn)*i/n); const dens=kde(xs,vv);
              traces.push({type:'scatter',mode:'lines',name:`Density – ${ln}`,x:xs,y:dens,yaxis:'y2',line:{color:LINE_COLORS[ln]},showlegend:false}); } }
          }
          return traces;
        }
      }

      for(const ln of lines){
        const col=LINE_COLORS[ln], S=store[mk][ln];
        const f=filtArr(mk, ln, S.allX,S.allY,S.allT,st);

        if(st.chartType==='box'){
          traces.push({ type:'box', name:ln, legendgroup:ln, alignmentgroup:mk, offsetgroup:ln,
            x:f.X, y:f.Y, text:f.T, customdata:f.X.map(d=>S.medTXT[d]||''), boxpoints:(st.includeExt?'all':'suspectedoutliers'),
            hoveron:'boxes+points', jitter:(st.includeExt?0.4:0), pointpos:0, marker:{size:7,color:col}, line:{width:1.2,color:col}, fillcolor:rgba(col,0.12),
            hovertemplate:`%{customdata}<br>${CELL_TITLE}: %{text}<extra></extra>`});
          if(st.showMed) traces.push({type:'scatter',mode:'lines',name:`Median – ${ln}`,legendgroup:ln,showlegend:false,x:S.medX,y:S.medY,line:{width:2,color:col,dash:'dot'}});
          continue;
        }

        if(st.chartType==='violin'){
          traces.push({ type:'violin', name:ln, legendgroup:ln, alignmentgroup:mk, offsetgroup:ln,
            x:f.X, y:f.Y, points:(st.includeExt?'all':'suspectedoutliers'), spanmode:'hard',
            marker:{color:col, line:{color:'#0000001a',width:1}},
            hovertemplate:`${LINE_TITLE}: ${ln}<br>${DATE_TITLE}: %{x}<br>Value: %{y}<extra></extra>`});
          if(st.showMed) traces.push({type:'scatter',mode:'lines',name:`Median – ${ln}`,legendgroup:ln,showlegend:false,x:S.medX,y:S.medY,line:{width:2,color:col,dash:'dot'}});
          continue;
        }

        if(st.chartType==='scatter' || st.chartType==='bubble'){
          const marker = st.chartType==='bubble'
            ? {size:f.Y.map(v=>Math.max(4,Math.min(22,Math.abs(v)))), color:col, opacity:st.dense?0.35:0.9, line:{width:1,color:'#00000014'}}
            : {size: st.dense?4:7, color:col, opacity:st.dense?0.45:0.9};
          traces.push({ type:'scatter', mode:'markers', name:ln, legendgroup:ln, x:f.X, y:f.Y, text:f.T, marker,
            hovertemplate:`${LINE_TITLE}: ${ln}<br>${DATE_TITLE}: %{x}<br>Value: %{y}<br>${CELL_TITLE}: %{text}<extra></extra>`});
          if(st.showReg){ const {a,b,ok}=linreg(f.Y); if(ok){ const yy=f.Y.map((_,i)=>a*i+b); traces.push({type:'scatter',mode:'lines',name:`Reg – ${ln}`,legendgroup:ln,showlegend:false,x:f.X,y:yy,line:{color:col,dash:'dash',width:1.8}}); } }
          if(st.showMed){ const m=quantiles(f.Y.filter(Number.isFinite)).med; if(Number.isFinite(m)){ traces.push({type:'scatter',mode:'lines',name:`Median – ${ln}`,legendgroup:ln,showlegend:false,x:[f.X[0],f.X[f.X.length-1]],y:[m,m],line:{color:col,dash:'dot',width:1.8}}); } }
          continue;
        }

        if(st.chartType==='line'){
          traces.push({type:'scatter', mode:'lines+markers', name:ln, legendgroup:ln, x:f.X, y:f.Y, text:f.T, marker:{size:4,color:col}, line:{width:2,color:col},
            hovertemplate:`${LINE_TITLE}: ${ln}<br>${DATE_TITLE}: %{x}<br>Value: %{y}<br>${CELL_TITLE}: %{text}<extra></extra>`});
          if(st.showReg){ const {a,b,ok}=linreg(f.Y); if(ok){ const yy=f.Y.map((_,i)=>a*i+b); traces.push({type:'scatter',mode:'lines',name:`Reg – ${ln}`,legendgroup:ln,showlegend:false,x:f.X,y:yy,line:{color:col,dash:'dash',width:1.8}}); } }
          if(st.showMed){ const m=quantiles(f.Y.filter(Number.isFinite)).med; if(Number.isFinite(m)){ traces.push({type:'scatter',mode:'lines',name:`Median – ${ln}`,legendgroup:ln,showlegend:false,x:[f.X[0],f.X[f.X.length-1]],y:[m,m],line:{color:col,dash:'dot',width:1.8}}); } }
          continue;
        }

        if(st.chartType==='bar'){
          traces.push({type:'bar', name:ln, legendgroup:ln, x:f.X, y:f.Y, text:f.T, marker:{color:col, line:{width:1, color:'#11182722'}},
            hovertemplate:`${LINE_TITLE}: ${ln}<br>${DATE_TITLE}: %{x}<br>Value: %{y}<br>${CELL_TITLE}: %{text}<extra></extra>`});
          continue;
        }

        if(st.chartType==='heatmap'){
          const counts=new Map(); for(let i=0;i<f.X.length;i++){ const key=f.X[i]; counts.set(key,(counts.get(key)||0)+1); }
          const z = dates.map(d=>counts.get(d)||0);
          traces.push({type:'heatmap',x:dates,y:[ln],z:[z],colorscale:'YlOrRd',showscale:true});
          continue;
        }

        if(st.chartType==='pie' || st.chartType==='donut'){
          const totals=new Map(); for(let i=0;i<f.X.length;i++){ totals.set(f.X[i], (totals.get(f.X[i])||0) + (Number.isFinite(f.Y[i])?f.Y[i]:0)); }
          const lab=[...totals.keys()], val=lab.map(k=>totals.get(k));
          traces.push({type:'pie',labels:lab,values:val,name:ln,hole:(st.chartType==='donut'?0.4:0)});
          continue;
        }

        if(st.chartType==='gauge'){
          const v = f.Y.find(Number.isFinite) ?? 0;
          traces.push({type:'indicator',mode:'gauge+number',value:v,title:{text:ln},gauge:{axis:{range:[Math.min(0,v), Math.max(100, v*1.2||100)]}}});
          continue;
        }

        if(st.chartType==='waterfall'){
          traces.push({type:'waterfall',x:f.X,y:f.Y,name:ln,connector:{line:{color:col}},increasing:{marker:{color:rgba(col,0.4)}},decreasing:{marker:{color:col}}});
          continue;
        }
      }
      return traces;
    }

    // ICONS + MODEBAR BUTTONS
    const I=p=>({width:1000,height:1000,path:p});
    const gearI =I('M500 300 L560 300 L590 240 L660 260 L690 200 L740 240 L700 300 L740 360 L690 400 L660 340 L590 360 L560 300 Z M500 650 A150 150 0 1 0 500 350 A150 150 0 1 0 500 650 Z');
    const themeI=I('M700 500 A200 200 0 1 1 300 500 A200 200 0 1 0 700 500 Z M500 100 A400 400 0 1 0 900 500 A250 250 0 0 1 500 100 Z');
    const downI =I('M500 180 V720 M500 720 L420 640 M500 720 L580 640');
    const fullI =I('M140 180 L140 140 L380 140 L380 180 L180 180 L180 380 L140 380 Z M620 140 L860 140 L860 380 L820 380 L820 180 L620 180 Z M140 620 L180 620 L180 820 L380 820 L380 860 L140 860 Z M820 620 L860 620 L860 860 L620 860 L620 820 L820 820 Z');
    const filtI =I('M200 200 H800 L600 520 V800 H400 V520 Z');
    const tableI=I('M160 200 H840 V800 H160 Z M160 320 H840 M160 480 H840 M160 640 H840 M360 200 V800 M560 200 V800');
    const plusI =I('M450 150 H550 V450 H850 V550 H550 V850 H450 V550 H150 V450 H450 Z');
    const trashI=I('M350 800 H650 V300 H350 Z M300 250 H700 L660 200 H340 Z');

    function cfgFor(gd, chartId, title){
      const settingsBtn={name:'Settings',title:'Chart settings',icon:gearI, click:()=>openSettingsMenu(gd, chartId)};
      const filterBtn  ={name:'Filter',  title:'Filters',       icon:filtI, click:()=>openFilterMenu(gd, chartId)};
      const statusBtn  ={name:'Status',  title:'Toggle status', icon:tableI,click:()=>{state[chartId].showStatus=!state[chartId].showStatus; renderStatusTable(gd, chartId); markActive(gd, chartId); saveLocal();}};
      const themeBtn   ={name:'Theme',   title:'Light/Dark',    icon:themeI, click:()=>{ CUR_THEME=(CUR_THEME==='light'?'dark':'light'); setThemeAttr(); state[chartId].uirev++; draw(chartId); if(state[chartId].showStatus) renderStatusTable(gd, chartId); saveLocal(); }};
      const dlBtn      ={name:'Download',title:'Downloads',     icon:downI, click:()=>openDownloadsMenu(gd, chartId, title)};
      const fsBtn      ={name:'Fullscreen',title:'Fullscreen',  icon:fullI, click:(g)=>toggleFS(g)};
      const addBtn     ={name:'Add',title:'Add plot',icon:plusI, click:()=>openAddPlotMenu()};
      const remBtn     ={name:'Remove',title:'Remove this plot',icon:trashI, click:()=>removePlot(chartId)};
      return {
        displayModeBar:true, displaylogo:false, responsive:true, scrollZoom:false,
        modeBarButtonsToRemove:['zoom2d','zoomIn2d','zoomOut2d','pan2d','select2d','lasso2d','autoScale2d','resetScale2d','hoverClosestCartesian','hoverCompareCartesian','toggleSpikelines','toImage'],
        modeBarButtonsToAdd:[addBtn,remBtn,settingsBtn,filterBtn,statusBtn,themeBtn,dlBtn,fsBtn]
      };
    }
    function markActive(gd, chartId){
      const st=state[chartId]; const mb=gd.querySelector('.modebar'); if(!mb) return;
      mb.querySelectorAll('.modebar-btn').forEach(b=>{ const t=b.getAttribute('data-title')||b.getAttribute('title')||''; if(/status/i.test(t)) b.setAttribute('data-on', st.showStatus?'1':'0'); });
    }

    // ADD/REMOVE PLOT POPUP
    function openAddPlotMenu(){
      closePop();
      const pop=document.createElement('div'); pop.className='oas-pop';
      pop.innerHTML=`<button class="close-x" id="ax">✕</button>
        <h4>Add plot</h4>
        <div class="row"><label>Measure</label><select id="ap_m">${mKeys.map(k=>`<option value="${k}">${TIT[k]}</option>`).join('')}</select></div>
        <div class="row"><button id="ap_add">Add</button></div>`;
      document.body.appendChild(pop); placeAtCorner(pop);
      pop.querySelector('#ax').onclick=()=>closePop();
      pop.querySelector('#ap_add').onclick=()=>{ const mk=pop.querySelector('#ap_m').value; const id=makeSection(mk,TIT[mk]); state[id]=JSON.parse(JSON.stringify(state[sections[0]])); state[id].uirev=1; sections.push(id); draw(id); closePop(); saveLocal(); };
    }
    function removePlot(id){
      if(!state[id]) return;
      const el=document.getElementById(id); const stDiv=document.getElementById('st_'+id);
      if(el){ const p=el.parentNode; if(stDiv) p.removeChild(stDiv); p.removeChild(el); }
      delete state[id];
      const idx=sections.indexOf(id); if(idx>=0) sections.splice(idx,1);
      saveLocal();
    }

    // SETTINGS / FILTER / DOWNLOAD POPOVERS
    function openSettingsMenu(gd, chartId){
      closePop();
      const st=state[chartId]; const mk=decodeURIComponent(gd.getAttribute('data-measure'))||'';
      const pop=document.createElement('div'); pop.className='oas-pop'; pop.style.minWidth='320px';
      const CT=[['box','Boxplot'],['violin','Violin'],['hist','Histogram'],['scatter','Scatter'],['line','Line'],['bar','Bar'],['heatmap','Heatmap'],['pie','Pie'],['donut','Donut'],['gauge','Gauge'],['waterfall','Waterfall'],['bubble','Bubble']];
      const seriesCtl = (st.chartType==='box'||st.chartType==='violin'||st.chartType==='hist') ? `
        <div class="row"><label>Series Mode</label>
          <select id="s_ser">
            <option value="perLine" ${st.seriesMode==='perLine'?'selected':''}>Per series</option>
            <option value="all" ${st.seriesMode==='all'?'selected':''}>All series (combined)</option>
          </select>
        </div>` : '';
      const densityCtl = (st.chartType==='hist') ? `<div class="row"><label><input type="checkbox" id="s_kde" ${st.kde?'checked':''}> Density on Y2</label></div>` : '';
      const stackCtl = (st.chartType==='bar' || st.chartType==='hist') ? `
        <div class="row"><label>Combine</label>
          <select id="s_barmode">
            <option value="group" ${st.barMode==='group'?'selected':''}>Group</option>
            <option value="stack" ${st.barMode==='stack'?'selected':''}>Stack</option>
            <option value="overlay" ${st.barMode==='overlay'?'selected':''}>Overlay</option>
          </select>
        </div>` : '';
      const orientCtl = (['bar','hist','box','violin','waterfall'].includes(st.chartType)) ? `
        <div class="row"><label>Orientation</label>
          <select id="s_orient">
            <option value="v" ${st.orient==='v'?'selected':''}>Vertical</option>
            <option value="h" ${st.orient==='h'?'selected':''}>Horizontal</option>
          </select>
        </div>` : '';
      const measureCtl = `
        <div class="row"><label>Measure</label>
          <select id="s_measure">${mKeys.map(k=>`<option value="${k}" ${k===mk?'selected':''}>${TIT[k]}</option>`).join('')}</select>
        </div>`;

      pop.innerHTML=`
        <button class="close-x" id="sx">✕</button>
        <h4>${decodeURIComponent(gd.getAttribute('data-title')||mk)}</h4>
        ${measureCtl}
        <div class="row"><label>Chart Type</label>
          <select id="s_ct">${CT.map(([v,l])=>`<option value="${v}" ${st.chartType===v?'selected':''}>${l}</option>`).join('')}</select>
        </div>
        ${seriesCtl}${densityCtl}${stackCtl}${orientCtl}
        <div class="row">
          <label><input type="checkbox" id="s_legend" ${st.showLegend?'checked':''}> Legend</label>
          <select id="s_lpos">
            ${['auto','top-left','top-center','top-right','bottom-center','left','right'].map(o=>`<option value="${o}" ${((st.legendPos||'auto')===o?'selected':'')}>${o}</option>`).join('')}
          </select>
        </div>
        <div class="row">
          <label><input type="checkbox" id="s_med" ${st.showMed?'checked':''}> Median</label>
          <label><input type="checkbox" id="s_reg" ${st.showReg?'checked':''}> Regression</label>
          <label><input type="checkbox" id="s_dense" ${st.dense?'checked':''}> Dense points</label>
          <label>Labels
            <select id="s_labels">
              <option value="off" ${st.labels==='off'?'selected':''}>Off</option>
              <option value="extremes" ${st.labels==='extremes'?'selected':''}>Extremes</option>
              <option value="all" ${st.labels==='all'?'selected':''}>All</option>
              <option value="auto" ${st.labels==='auto'?'selected':''}>Auto</option>
            </select>
          </label>
        </div>
        <div class="row">
          <label>LSL</label><input id="s_lsl" type="number" value="${st.LSL??''}" style="width:110px">
          <label>USL</label><input id="s_usl" type="number" value="${st.USL??''}" style="width:110px">
          <label>TGT</label><input id="s_tgt" type="number" value="${st.TGT??''}" style="width:110px">
        </div>
        <div class="row"><button id="s_apply">Apply</button></div>
        <div class="row">
          <button id="s_copy_json">Copy settings (JSON)</button>
          <button id="s_copy_b64">Copy settings (base64)</button>
          <button id="s_apply_pv">Apply PV defaults</button>
          <button id="s_save_local">Save to local</button>
          <button id="s_clear_local">Clear local</button>
        </div>`;
      (gd._fsOverlay||document.body).appendChild(pop);
      placeNear(gd, pop, /Chart settings|Settings/i);
      pop.querySelector('#sx').onclick=()=>closePop();
      pop.querySelector('#s_apply').onclick=()=>{
        const newMk=pop.querySelector('#s_measure').value;
        if(newMk!==mk){
          gd.setAttribute('data-measure', encodeURIComponent(newMk));
          gd.setAttribute('data-title', encodeURIComponent(TIT[newMk]||newMk));
        }
        st.chartType=pop.querySelector('#s_ct').value;
        const sSer=pop.querySelector('#s_ser'); if(sSer) st.seriesMode=sSer.value;
        const sK=pop.querySelector('#s_kde'); if(sK) st.kde=sK.checked;
        const sBM=pop.querySelector('#s_barmode'); if(sBM) st.barMode=sBM.value;
        const sO=pop.querySelector('#s_orient'); if(sO) st.orient=sO.value;
        st.showLegend=pop.querySelector('#s_legend').checked;
        st.legendPos=pop.querySelector('#s_lpos').value||'auto';
        st.showMed = pop.querySelector('#s_med').checked;
        st.showReg = pop.querySelector('#s_reg').checked;
        st.dense   = pop.querySelector('#s_dense').checked;
        st.labels  = pop.querySelector('#s_labels').value;
        st.LSL=parseFloat(pop.querySelector('#s_lsl').value); if(!isFinite(st.LSL)) st.LSL=null;
        st.USL=parseFloat(pop.querySelector('#s_usl').value); if(!isFinite(st.USL)) st.USL=null;
        st.TGT=parseFloat(pop.querySelector('#s_tgt').value); if(!isFinite(st.TGT)) st.TGT=null;
        st.uirev++; saveLocal(); draw(chartId); if(st.showStatus) renderStatusTable(gd, chartId); closePop();
      };
      pop.querySelector('#s_copy_json').onclick=()=>copyStr(JSON.stringify(serializeAll(),null,0));
      pop.querySelector('#s_copy_b64').onclick=()=>copyStr(toB64(JSON.stringify(serializeAll())));
      pop.querySelector('#s_apply_pv').onclick=()=>{ if(PV_DEFAULTS){ applyAllSettings(PV_DEFAULTS); refreshAll(); } };
      pop.querySelector('#s_save_local').onclick=()=>saveLocal(true);
      pop.querySelector('#s_clear_local').onclick=()=>localStorage.removeItem(LS_KEY);
    }

    function openFilterMenu(gd, chartId){
      closePop();
      const st=state[chartId];
      const pop=document.createElement('div'); pop.className='oas-pop';
      pop.innerHTML=`<button class="close-x" id="fx">✕</button>
        <h4>Filters</h4>
        <div class="row"><label><input type="checkbox" id="f_zero" ${st.exZero?'checked':''}> Exclude zeros</label></div>
        <div class="row"><label><input type="checkbox" id="f_out" ${st.exOut15?'checked':''}> Exclude outliers (1.5×IQR)</label></div>
        <div class="row"><label><input type="checkbox" id="f_ext" ${st.exExt3?'checked':''}> Exclude extreme outliers (±3×IQR)</label></div>
        <div class="row">
          <input id="fp-min" placeholder="Min" value="${st.fmin??''}" style="width:120px">
          <input id="fp-max" placeholder="Max" value="${st.fmax??''}" style="width:120px">
        </div>
        <div class="row"><button id="fp-apply">Apply</button><button id="fp-clear">Clear</button></div>
        <div class="row" style="opacity:.7">Note: Filters apply to tooltips and status too.</div>`;
      (gd._fsOverlay||document.body).appendChild(pop);
      placeNear(gd, pop, /Filters|Filter/i);
      pop.querySelector('#fx').onclick=()=>closePop();
      pop.querySelector('#fp-apply').onclick=()=>{
        st.exZero=pop.querySelector('#f_zero').checked;
        st.exOut15=pop.querySelector('#f_out').checked;
        st.exExt3=pop.querySelector('#f_ext').checked;
        const v0=parseFloat(pop.querySelector('#fp-min').value), v1=parseFloat(pop.querySelector('#fp-max').value);
        st.fmin=Number.isFinite(v0)?v0:null; st.fmax=Number.isFinite(v1)?v1:null; st.uirev++; saveLocal(); draw(chartId); if(st.showStatus) renderStatusTable(gd, chartId); closePop();
      };
      pop.querySelector('#fp-clear').onclick=()=>{ st.fmin=st.fmax=null; st.exZero=false; st.exOut15=false; st.exExt3=false; st.uirev++; saveLocal(); draw(chartId); if(st.showStatus) renderStatusTable(gd, chartId); closePop(); };
    }

    function openDownloadsMenu(gd, chartId, title){
      closePop();
      const pop=document.createElement('div'); pop.className='oas-pop';
      pop.innerHTML=`<button class="close-x" id="dx">✕</button>
        <h4>Downloads</h4>
        <div class="row">
          <button id="dl-data">This chart – Data CSV</button>
          <button id="dl-status">This chart – Status CSV</button>
          <button id="dl-img">This chart – Image (PNG)</button>
        </div>
        <div class="row">
          <button id="dl-allpng">All charts – PNG grid</button>
          <button id="dl-allstatus">All charts – Status CSV</button>
        </div>`;
      (gd._fsOverlay||document.body).appendChild(pop);
      placeNear(gd, pop, /Downloads|Download/i);
      pop.querySelector('#dx').onclick=()=>closePop();
      pop.querySelector('#dl-data').onclick=()=>{ downloadCSV(gd, chartId, title); closePop(); };
      pop.querySelector('#dl-status').onclick=()=>{ downloadStatusCSV(gd, chartId, title); closePop(); };
      pop.querySelector('#dl-img').onclick=()=>{ Plotly.downloadImage(gd,{format:'png',scale:2,filename:(title||'chart').replace(/\s+/g,'_')}); closePop(); };
      pop.querySelector('#dl-allpng').onclick=()=>{ downloadAllPNG(); closePop(); };
      pop.querySelector('#dl-allstatus').onclick=()=>{ downloadAllStatusCSV(); closePop(); };
    }

    function placeAtCorner(pop){ const right=innerWidth-16, bottom=48; const w=pop.offsetWidth, h=pop.offsetHeight; pop.style.left=(right-w)+'px'; pop.style.top=(bottom+6)+'px'; }
    function placeNear(gd, pop, titleRe){
      const btn=findModebarBtn(gd, titleRe) || gd.querySelector('.modebar');
      const r=btn?btn.getBoundingClientRect():{left:innerWidth-160, right:innerWidth-16, bottom:54, top:10};
      const pw=pop.offsetWidth, ph=pop.offsetHeight;
      let top=r.bottom+6, left=r.right - pw;
      top=Math.max(6, Math.min(top, innerHeight-ph-6));
      left=Math.max(6, Math.min(left, innerWidth - pw - 6));
      pop.style.top=top+'px'; pop.style.left=left+'px';
      const rePos=()=>placeNear(gd,pop,titleRe); addEventListener('resize',rePos); addEventListener('scroll',rePos,{passive:true});
      pop._rePos=rePos;
    }
    function findModebarBtn(gd, re){
      const mb=gd.querySelector('.modebar'); if(!mb) return null;
      return Array.from(mb.querySelectorAll('.modebar-btn')).find(b=>{ const t=b.getAttribute('data-title')||b.getAttribute('title')||''; return re.test(t); })||null;
    }
    function closePop(){
      document.querySelectorAll('.oas-pop').forEach(el=>{
        if(el._rePos){ removeEventListener('resize',el._rePos); removeEventListener('scroll',el._rePos); }
        el.remove();
      });
    }
    async function copyStr(s){
      try{ await navigator.clipboard.writeText(s); }catch(_){
        const ta=document.createElement('textarea'); ta.value=s; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
      }
    }
    function toB64(s){ try{ return btoa(s); }catch(_){ return s; } }
    function parsePVSettings(raw){
      if(!raw) return null;
      let txt=raw.trim(); try{ if(/^[A-Za-z0-9+/=]+$/.test(txt) && txt.length%4===0) txt=atob(txt); }catch(_){}
      try{ const obj=JSON.parse(txt); if(obj&&obj.charts) return obj; }catch(_){}
      return null;
    }

    // CSV + PNG GRID
    function downloadCSV(gd, chartId, title){
      const st=state[chartId], mk=decodeURIComponent(gd.getAttribute('data-measure'));
      const out=[`"${DATE_TITLE}","${LINE_TITLE}","${CELL_TITLE}","Value"`];
      for(const ln of lines){
        const S=store[mk][ln]; if(!S) continue;
        const f=filtArr(mk, ln, S.allX,S.allY,S.allT,st);
        for(let i=0;i<f.Y.length;i++) out.push(`"${f.X[i]}","${ln}","${f.T[i]??''}","${f.Y[i]}"`);
      }
      const blob=new Blob([out.join('\n')],{type:'text/csv;charset=utf-8;'}); const a=document.createElement('a');
      a.href=URL.createObjectURL(blob); a.download((title||'measure').replace(/\s+/g,'_')+'.csv'); a.click();
    }
    function downloadStatusCSV(gd, chartId, title){
      const st=state[chartId]; const rows=getStatusRows(gd, chartId);
      const out=[`"${DATE_TITLE}","${LINE_TITLE}","n","Inliers","%In","Outliers","%Out","Extremes","%Ext","Min","Q1","Median","Q3","Max"`+(st.LSL!=null&&st.USL!=null?', "Cp","Cpk","Pp","Ppk"':'')];
      rows.forEach(r=>out.push(`"${r.d}","${r.ln}",${r.nAll},${r.nIn},"${(r.pctIn||0).toFixed(1)}%",${r.nOut},"${(r.pctOut||0).toFixed(1)}%",${r.nExt},"${(r.pctExt||0).toFixed(1)}%",${r.min},${r.q1},${r.med},${r.q3},${r.max}`+(st.LSL!=null&&st.USL!=null?`,`+(r.cp??'')+`,`+(r.cpk??'')+`,`+(r.pp??'')+`,`+(r.ppk??''):'') ) );
      const blob=new Blob([out.join('\n')],{type:'text/csv;charset=utf-8;'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download(((title||'measure').replace(/\s+/g,'_')+'_status.csv')); a.click();
    }
    async function downloadAllPNG(){
      const els=[...document.querySelectorAll('#chart-grid .js-plotly-plot')]; if(!els.length) return;
      const shots=await Promise.all(els.map(el=>Plotly.toImage(el,{format:'png',scale:2})));
      const imgs=await Promise.all(shots.map(src=>new Promise(res=>{ const im=new Image(); im.onload=()=>res(im); im.src=src; })));
      const cols=Math.max(1, Math.min(GPR, 3));
      const cellW=900, cellH=HEIGHT*2;
      const rows=Math.ceil(imgs.length/cols);
      const maxPageRows=8;
      const pages=Math.ceil(rows/maxPageRows);
      for(let pgi=0;pgi<pages;pgi++){
        const startRow=pgi*maxPageRows, endRow=Math.min(rows,(pgi+1)*maxPageRows);
        const rowsOnPage=endRow-startRow;
        const canvas=document.createElement('canvas');
        canvas.width=cellW*cols; canvas.height=cellH*rowsOnPage;
        const ctx=canvas.getContext('2d'); ctx.fillStyle='#fff'; ctx.fillRect(0,0,canvas.width,canvas.height);
        for(let r=0;r<rowsOnPage;r++){
          for(let c=0;c<cols;c++){
            const idx=(startRow+r)*cols+c; const im=imgs[idx]; if(!im) continue;
            ctx.drawImage(im, c*cellW, r*cellH, cellW, cellH);
          }
        }
        const a=document.createElement('a'); a.href=canvas.toDataURL('image/png'); a.download=`all_charts_page_${pgi+1}.png`; a.click();
      }
    }
    function downloadAllStatusCSV(){
      const out=[`"${DATE_TITLE}","${LINE_TITLE}","n","Inliers","%In","Outliers","%Out","Extremes","%Ext","Min","Q1","Median","Q3","Max"`];
      sections.forEach(id=>{
        const gd=document.getElementById(id); const rows=getStatusRows(gd,id);
        rows.forEach(r=> out.push(`"${r.d}","${r.ln}",${r.nAll},${r.nIn},"${(r.pctIn||0).toFixed(1)}%",${r.nOut},"${(r.pctOut||0).toFixed(1)}%",${r.nExt},"${(r.pctExt||0).toFixed(1)}%",${r.min},${r.q1},${r.med},${r.q3},${r.max}`));
      });
      const blob=new Blob([out.join('\n')],{type:'text/csv;charset=utf-8;'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download('all_charts_status.csv'); a.click();
    }

    // STATUS (filters-aware + Cp/Cpk/Pp/Ppk)
    function getStatusRows(gd, chartId){
      const st=state[chartId], mk=decodeURIComponent(gd.getAttribute('data-measure'));
      const rowsOut=[];
      const hasLimits = (st.LSL!=null && st.USL!=null && isFinite(st.LSL) && isFinite(st.USL));
      for(const d of dates){
        for(const ln of lines){
          const S=store[mk][ln]; if(!S) continue;
          const vals=[];
          for(let i=0;i<S.allX.length;i++){ if(S.allX[i]===d){ const y=S.allY[i], c=S.allT[i]; if(passesFilters(mk,ln,d,y,c,st)) vals.push(y); } }
          const nAll=vals.length; if(!nAll){ rowsOut.push({d,ln,nAll:0,nIn:0,pctIn:0,nOut:0,pctOut:0,nExt:0,pctExt:0,min:null,q1:null,med:null,q3:null,max:null,cp:null,cpk:null,pp:null,ppk:null}); continue; }
          const q=quantiles(vals);
          const feL = q.q1 - EXTREME_K*q.iqr, feH = q.q3 + EXTREME_K*q.iqr;
          const foL = q.q1 - MILD_K*q.iqr, foH = q.q3 + MILD_K*q.iqr;
          let nExt=0, nOut=0, nIn=0; for(const v of vals){ if(v<feL||v>feH) nExt++; else if(v<foL||v>foH) nOut++; else nIn++; }
          let cp=null,cpk=null,pp=null,ppk=null;
          if(hasLimits){
            const mu=vals.reduce((a,b)=>a+b,0)/nAll;
            const varS=vals.reduce((a,b)=>a+(b-mu)*(b-mu),0)/Math.max(1,nAll-1);
            const varP=vals.reduce((a,b)=>a+(b-mu)*(b-mu),0)/Math.max(1,nAll);
            const s = Math.sqrt(Math.max(varS,1e-12)), sp=Math.sqrt(Math.max(varP,1e-12));
            if(s>0){ cp=(st.USL-st.LSL)/(6*s); cpk=Math.min((st.USL-mu)/(3*s),(mu-st.LSL)/(3*s)); }
            if(sp>0){ pp=(st.USL-st.LSL)/(6*sp); ppk=Math.min((st.USL-mu)/(3*sp),(mu-st.LSL)/(3*sp)); }
          }
          rowsOut.push({d,ln,nAll,nIn,pctIn:nIn/nAll*100,nOut,pctOut:nOut/nAll*100,nExt,pctExt:nExt/nAll*100,min:q.min,q1:q.q1,med:q.med,q3:q.q3,max:q.max,cp,cpk,pp,ppk});
        }
      }
      rowsOut.sort((a,b)=> (a.d===b.d ? lines.indexOf(a.ln)-lines.indexOf(b.ln) : (a.d>b.d?1:-1)));
      return rowsOut;
    }
    function renderStatusTable(gd, chartId){
      const wrap=document.getElementById('st_'+chartId); if(!wrap) return;
      if(!state[chartId].showStatus){ wrap.style.display='none'; wrap.innerHTML=''; Plotly.Plots.resize(gd); return; }
      const st=state[chartId]; const rows=getStatusRows(gd, chartId);
      const hasLimits = (st.LSL!=null && st.USL!=null && isFinite(st.LSL) && isFinite(st.USL));
      let html=`<table class="status-table"><thead><tr>
        <th>${DATE_TITLE}</th><th>${LINE_TITLE}</th>
        <th>n</th><th>Inliers</th><th>%In</th>
        <th>Outliers</th><th>%Out</th>
        <th>Extremes</th><th>%Ext</th>
        <th>Min</th><th>Q1</th><th>Median</th><th>Q3</th><th>Max</th>`;
      if(hasLimits) html+=`<th>Cp</th><th>Cpk</th><th>Pp</th><th>Ppk</th>`;
      html+=`</tr></thead><tbody>`;
      rows.forEach(r=>{
        html+=`<tr>
          <td>${r.d}</td><td>${r.ln}</td>
          <td>${r.nAll}</td>
          <td class="pos-cell">${r.nIn}</td><td class="pos-cell">${(r.pctIn||0).toFixed(1)}%</td>
          <td>${r.nOut}</td><td>${(r.pctOut||0).toFixed(1)}%</td>
          <td class="neg-cell">${r.nExt}</td><td class="neg-cell">${(r.pctExt||0).toFixed(1)}%</td>
          <td>${fmtN(r.min)}</td><td>${fmtN(r.q1)}</td><td>${fmtN(r.med)}</td><td>${fmtN(r.q3)}</td><td>${fmtN(r.max)}</td>`;
        if(hasLimits) html+=`<td>${r.cp!=null?fmtN(r.cp):'—'}</td><td>${r.cpk!=null?fmtN(r.cpk):'—'}</td><td>${r.pp!=null?fmtN(r.pp):'—'}</td><td>${r.ppk!=null?fmtN(r.ppk):'—'}</td>`;
        html+=`</tr>`;
      });
      html+='</tbody></table>';
      wrap.innerHTML=html; wrap.style.display=''; Plotly.Plots.resize(gd);
      if(gd._fsOverlay){ setTimeout(()=>wrap.scrollIntoView({block:'nearest'}), 60); }
    }

    // FULLSCREEN
    function toggleFS(g){
      if(g._fsOverlay){
        const parent=g._origParent||null, ph=g._ph||null;
        if(ph && ph.parentNode){ ph.parentNode.replaceChild(g, ph); g._ph=null; } else if(parent){ parent.appendChild(g); }
        const stWrap=document.getElementById('st_'+g.id); if(stWrap && g.parentNode){ g.parentNode.insertBefore(stWrap, g.nextSibling); stWrap.style.maxHeight='unset'; stWrap.style.overflow='unset'; }
        g.style.width='100%'; g.style.height=(g._prevH||HEIGHT)+'px';
        g._fsOverlay.remove(); g._fsOverlay=null; removeEventListener('resize',g._fsResize);
        requestAnimationFrame(()=>{ Plotly.relayout(g,{autosize:true}); Plotly.Plots.resize(g); });
        return;
      }
      g._origParent=g.parentNode; const ph=document.createElement('div'); ph.className='pl-fs-ph'; ph.style.display='none'; g._origParent.insertBefore(ph, g); g._ph=ph;
      const ov=document.createElement('div'); ov.className='pl-fs-overlay'; document.body.appendChild(ov); ov.appendChild(g); g._fsOverlay=ov; g._prevH=(parseInt(g.style.height,10)||HEIGHT);
      const stWrap=document.getElementById('st_'+g.id); if(stWrap){ ov.appendChild(stWrap); stWrap.style.maxHeight='30vh'; stWrap.style.overflow='auto'; }
      g._fsResize=()=>fitFS(g); addEventListener('resize',g._fsResize); fitFS(g);
      addEventListener('keydown',function esc(e){ if(e.key==='Escape'&&g._fsOverlay){ toggleFS(g); removeEventListener('keydown',esc);} });
    }
    function fitFS(g){ g.style.width=innerWidth+'px'; g.style.height=innerHeight+'px'; Plotly.relayout(g,{width:innerWidth,height:innerHeight,autosize:false}); Plotly.Plots.resize(g); }

    // DRAW
    async function draw(chartId){
      const st=state[chartId], gd=document.getElementById(chartId);
      const mk=decodeURIComponent(gd.getAttribute('data-measure')); const title='<b>'+(decodeURIComponent(gd.getAttribute('data-title'))||mk)+'</b>';

      const chosenPos = (st.legendPos && st.legendPos!=='auto') ? st.legendPos : LEG_POS;
      const legend=legendSpec(chosenPos);
      const margin=marginsFor(chosenPos, st);

      const isHist = (st.chartType==='hist');
      const isH = (st.orient==='h');

      const xax = isHist
        ? (isH? {type:'linear', automargin:true, title:{text:'Count'}, gridcolor:THEMES[CUR_THEME].GRID, zeroline:false}
               : {type:'linear', automargin:true, title:{text:'Value'}, gridcolor:THEMES[CUR_THEME].GRID, zeroline:false})
        : (isH? {type:'linear',automargin:true, title:{text:'Value'},gridcolor:THEMES[CUR_THEME].GRID, zeroline:false} : xAxisSpec());

      const layout={
        margin, showlegend: st.showLegend, legend:Object.assign({groupclick:'togglegroup', bgcolor:'rgba(0,0,0,0)'}, legend),
        xaxis:xax,
        yaxis: (isHist ? (isH? {zeroline:false,tickformat:',.0f',gridcolor:THEMES[CUR_THEME].GRID,title:{text:'Value'}}
                             : {zeroline:false,tickformat:',.0f',gridcolor:THEMES[CUR_THEME].GRID,title:{text:'Count'}})
                       : {zeroline:false,gridcolor:THEMES[CUR_THEME].GRID}),
        paper_bgcolor:THEMES[CUR_THEME].BG, plot_bgcolor:THEMES[CUR_THEME].PBG, font:{color:THEMES[CUR_THEME].TXT},
        title:{text:title,x:0.02,xanchor:'left',y:0.98,yanchor:'top',font:{size:14}},
        hovermode:'closest', hoverdistance:12, dragmode:false, uirevision:st.uirev,
        boxmode:'group',
        barmode: (st.chartType==='bar'||st.chartType==='hist') ? st.barMode : undefined,
        shapes: []
      };

      if(st.LSL!=null) layout.shapes.push({type:'line',xref:'paper',x0:0,x1:1,y0:st.LSL,y1:st.LSL,line:{color:'#ef4444',dash:'dot',width:1.5}});
      if(st.USL!=null) layout.shapes.push({type:'line',xref:'paper',x0:0,x1:1,y0:st.USL,y1:st.USL,line:{color:'#ef4444',dash:'dot',width:1.5}});
      if(st.TGT!=null) layout.shapes.push({type:'line',xref:'paper',x0:0,x1:1,y0:st.TGT,y1:st.TGT,line:{color:'#2563eb',dash:'dot',width:1.5}});

      if(isHist && st.kde) layout.yaxis2={overlaying:'y', side:'right', showgrid:false, zeroline:false, automargin:true, title:{text:'Density'}};

      const traces=tracesFor(mk, st);

      if(st.orient==='h'){
        traces.forEach(t=>{
          if(t.type==='bar' || t.type==='histogram' || t.type==='box' || t.type==='violin' || t.type==='waterfall'){
            t.orientation='h';
            if(t.type==='bar' || t.type==='waterfall'){ const tmp=t.x; t.x=t.y; t.y=tmp; }
            if(t.type==='histogram'){ t.y=t.x; delete t.x; }
          }
        });
      }

      await Plotly.react(gd, traces, layout, cfgFor(gd, chartId, title));
      markActive(gd, chartId);
      if(state[chartId].showStatus) renderStatusTable(gd, chartId);
      saveLocal();
    }

    // LAZY + RESIZE
    if(!sections.length){ grid.innerHTML='<div class="sec">No numeric measures found.</div>'; return; }
    draw(sections[0]);
    if('IntersectionObserver' in window){
      const io=new IntersectionObserver(es=>{ es.forEach(e=>{ if(e.isIntersecting){ draw(e.target.id); io.unobserve(e.target);} }); },{root:null,rootMargin:'200px',threshold:0});
      sections.slice(1).forEach(id=>{ const el=document.getElementById(id); if(el) io.observe(el); });
    } else { sections.slice(1).forEach(id=> draw(id)); }
    let t=null; addEventListener('resize', ()=>{ if(t) return; t=setTimeout(()=>{ document.querySelectorAll('#chart-grid .js-plotly-plot').forEach(el=>{ try{ Plotly.relayout(el,{autosize:true}); Plotly.Plots.resize(el);}catch(_){}}); t=null; },120); });

    // PERSISTENCE
    function serializeAll(){
      const obj={version:4, theme:CUR_THEME, charts:{}};
      sections.forEach(id=>{
        const gd=document.getElementById(id); if(!gd) return;
        const mk=decodeURIComponent(gd.getAttribute('data-measure'))||id;
        const st=state[id];
        obj.charts[mk]={
          fmin:st.fmin,fmax:st.fmax, exZero:!!st.exZero, exOut15:!!st.exOut15, exExt3:!!st.exExt3,
          includeExt:!!st.includeExt, showMed:!!st.showMed, showReg:!!st.showReg, dense:!!st.dense, kde:!!st.kde,
          showLegend:!!st.showLegend, legendPos:st.legendPos||'auto', showStatus:!!st.showStatus, labels:st.labels||'off',
          chartType:st.chartType, seriesMode:st.seriesMode, barMode:st.barMode, orient:st.orient,
          LSL:st.LSL, USL:st.USL, TGT:st.TGT
        };
      });
      return obj;
    }
    function applyAllSettings(obj){
      if(!obj||!obj.charts) return;
      CUR_THEME = (obj.theme==='dark'?'dark':'light'); setThemeAttr();
      sections.forEach(id=>{
        const gd=document.getElementById(id); if(!gd) return;
        const mk=decodeURIComponent(gd.getAttribute('data-measure'))||id;
        const saved=obj.charts[mk]; if(!saved) return;
        const st=state[id];
        Object.assign(st,{
          fmin:saved.fmin??null, fmax:saved.fmax??null,
          exZero:!!saved.exZero, exOut15:!!saved.exOut15, exExt3:!!saved.exExt3,
          includeExt:!!saved.includeExt, showMed:!!saved.showMed, showReg:!!saved.showReg, dense:!!saved.dense, kde:!!saved.kde,
          showLegend:!!saved.showLegend, legendPos:saved.legendPos||'auto', showStatus:!!saved.showStatus, labels:saved.labels||'off',
          chartType:saved.chartType||'box', seriesMode:saved.seriesMode||'perLine', barMode:saved.barMode||'group', orient:saved.orient||'v',
          LSL:(isFinite(saved.LSL)?+saved.LSL:null), USL:(isFinite(saved.USL)?+saved.USL:null), TGT:(isFinite(saved.TGT)?+saved.TGT:null)
        });
        st.uirev++;
      });
    }
    function refreshAll(){ sections.forEach(id=>draw(id)); }
    function saveLocal(force){ try{ localStorage.setItem(LS_KEY, JSON.stringify(serializeAll())); }catch(_){ } if(force){} }
    function loadLocal(){ try{ const t=localStorage.getItem(LS_KEY); if(!t) return null; return JSON.parse(t); }catch(_){ return null; } }

    function fail(msg){ const g=document.getElementById('chart-grid'); if(g) g.innerHTML='<div class="sec" style="color:#b91c1c;font-weight:600;padding:10px">'+msg+'</div>'; }

  }catch(err){
    const g=document.getElementById('chart-grid');
    if(g) g.innerHTML='<div class="sec" style="color:#b91c1c;font-weight:600;padding:10px">Runtime error: '+(err?.message||err)+'</div>';
    console.error(err);
  }
})();
</script>