]</div>

<!-- OAS params -->
<div id="oas-params" style="display:none"
  data-gpr="@{GraphsPerRow}{1}"
  data-date-title="@{PV_Attribute01}{week}"
  data-line-title="@{PV_Attribute02}{Line}"
  data-legend-pos="@{PV_LegendPos}{top-center}"
  data-legend-show="@{PV_LegendShow}{1}"
  data-mtitles="@{PV_MeasureTitles}{}"
  data-p1="@{P1Title}{}" data-p2="@{P2Title}{}" data-p3="@{P3Title}{}" data-p4="@{P4Title}{}"
></div>

<style>
  html,body{margin:0;padding:0}
  #chart-grid{width:100%;max-width:100%}

  .grid{display:grid;gap:4px;width:100%;max-width:100%}
  .cols1{grid-template-columns:repeat(1,minmax(0,1fr))}
  .cols2{grid-template-columns:repeat(2,minmax(0,1fr))}
  .cols3{grid-template-columns:repeat(3,minmax(0,1fr))}

  .sec{
    border:1px solid #e5e7eb;border-radius:10px;padding:2px;background:#fafafa;
    position:relative;width:100%;box-sizing:border-box;margin:0;max-width:100%;
  }
  .sec > .js-plotly-plot, .sec > div[id^="m_"]{width:100% !important;max-width:100%}

  /* Modebar pinned top-right but BELOW prompts/hoverlabels */
  .js-plotly-plot .modebar{
    position:absolute !important; top:6px !important; right:6px !important; left:auto !important;
    transform:none !important; background:transparent !important; z-index:100 !important;
  }
  .js-plotly-plot .modebar-btn .icon path{fill:none!important;stroke:#6b7280!important;stroke-width:80!important}
  .js-plotly-plot .modebar-btn:hover .icon path{stroke:#111827!important}
  [data-theme="dark"] .js-plotly-plot .modebar-btn .icon path{stroke:#9aa4b2!important}
  [data-theme="dark"] .js-plotly-plot .modebar-btn:hover .icon path{stroke:#e5e7eb!important}
  .js-plotly-plot .modebar-btn[data-on="1"] .icon path{stroke:#111827!important}
  [data-theme="dark"] .js-plotly-plot .modebar-btn[data-on="1"] .icon path{stroke:#e5e7eb!important}

  /* Menus / popovers */
  .filter-pop,.menu-pop{
    position:fixed; z-index:2147483646;
    background:#fff; border:1px solid #e5e7eb; border-radius:10px; padding:10px;
    box-shadow:0 6px 24px rgba(0,0,0,.12);
    display:flex; gap:8px; align-items:center; flex-wrap:wrap; font:12px/1.2 system-ui,-apple-system,Segoe UI,Roboto,Arial;
  }
  .filter-pop input{ width:110px; padding:6px 8px; border:1px solid #d0d0d0; border-radius:8px }
  .filter-pop button, .menu-pop button{ padding:6px 10px; border:1px solid #cdd0d4; border-radius:8px; background:#fff; cursor:pointer }
  .filter-pop button:hover, .menu-pop button:hover{ background:#f3f4f6 }
  [data-theme="dark"] .filter-pop, [data-theme="dark"] .menu-pop{ background:#0f172a; border-color:#2b3447; color:#e5e7eb }
  [data-theme="dark"] .filter-pop input{ background:#0b1220; border-color:#2b3447; color:#e5e7eb }
  [data-theme="dark"] .filter-pop button, [data-theme="dark"] .menu-pop button{ border-color:#394357; color:#e5e7eb }
  [data-theme="dark"] .filter-pop button:hover, [data-theme="dark"] .menu-pop button:hover{ background:#1f2937 }

  /* Fullscreen overlay */
  .pl-fs-overlay{position:fixed;inset:0;background:#fff;z-index:2147483647;overflow:auto}
  [data-theme="dark"] .pl-fs-overlay{background:#0b1220}

  /* Status table */
  .status-wrap{padding:6px 8px 10px; overflow-x:auto}
  .status-table{width:100%; border-collapse:collapse; font:12px/1.35 system-ui,-apple-system,Segoe UI,Roboto,Arial; min-width:1000px}
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
  /* Force 1 chart per row on tablets/phones */
	@media (max-width: 1024px){
  /* when viewport is <= 1024px, collapse any multi-col grid to one column */
  #chart-grid.cols2,
  #chart-grid.cols3{
    grid-template-columns: repeat(1, minmax(0, 1fr));
		}
	}

</style>

<div id="chart-grid" class="grid cols1"></div>

<script src="/analyticsRes/custom/plotly.min.js"></script>
<script>
(function(){
  try{
    if(typeof Plotly==='undefined'){ const g=document.getElementById('chart-grid'); if(g) g.innerHTML='<div class="sec">Plotly not found</div>'; return; }

    /* ===== Theme ===== */
    const THEMES={ light:{BG:'#fff',PBG:'#fff',TXT:'#111827',GRID:'#e5e7eb'}, dark:{BG:'#0b1220',PBG:'#0f172a',TXT:'#e5e7eb',GRID:'#293244'} };
    let CUR_THEME='light'; const setThemeAttr=()=>document.documentElement.setAttribute('data-theme', CUR_THEME==='dark'?'dark':'light'); setThemeAttr();

    /* ===== Config ===== */
    const HEIGHT=340, EXTREME_K=3.0, MILD_K=1.5;
    const MAX_POINTS_PER_CHART=25000;
    const ROTATE_THRESHOLD=12;

    const KEYS={ dt:'dt', line:'line', cell:'cell' };
    const PALETTE=['#2E77D0','#E07A1F','#2FA24B','#C33C3C','#7C5AC9','#8C564B','#E377C2','#17BECF','#7f7f7f'];
    const LINE_COLORS={}; const colorFor=ln=>LINE_COLORS[ln]||(LINE_COLORS[ln]=PALETTE[Object.keys(LINE_COLORS).length%PALETTE.length]);
    const rgba=(h,a=0.14)=>{const b=h.replace('#','');const n=parseInt(b,16);return`rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`};

    /* ===== Params ===== */
    const p=document.getElementById('oas-params')||{dataset:{}};
    const GPR=Math.min(3,Math.max(1,parseInt(p.dataset.gpr||'1',10)||1));
    const DATE_TITLE=(p.dataset.dateTitle||'Date').trim();
    const LINE_TITLE=(p.dataset.lineTitle||'Line').trim();
    const LEG_SHOW = (String(p.dataset.legendShow||'1')!=='0');
    const normLegendPos=(v)=>{ v=(v||'top-center').toLowerCase().replace(/\s+/g,'-'); const a={top:'top-center',bottom:'bottom-center'}; return a[v]||v; };
    const LEG_POS = normLegendPos(p.dataset.legendPos || 'top-center');

    const MT=(p.dataset.mtitles||'').split('|').map(s=>s.trim()).filter(Boolean);
    const pTitles=[]; for(let i=1;i<=40;i++){ const v=(p.dataset['p'+i]||'').trim(); if(v) pTitles.push(v); }

    /* ===== Data ===== */
    const host=document.getElementById('box-data'); if(!host){ fail('box-data not found'); return; }
    let raw=[]; try{ raw=JSON.parse((host.textContent||'[]').trim()); }catch(e){ fail('Invalid JSON in box-data'); return; }
    if(!raw.length){ document.getElementById('chart-grid').innerHTML='<div class="sec">No data rows.</div>'; return; }

    const toNum=s=>{ if(s==null) return null; let t=(''+s).trim(); if(!t) return null;
      t=t.replace(/[^\d.,\-]/g,''); const d=t.lastIndexOf('.'), c=t.lastIndexOf(',');
      if(d!==-1&&c!==-1) t=(c>d)?t.replace(/\./g,'').replace(',', '.'):t.replace(/,/g,''); else if(c!==-1) t=t.replace(',', '.'); else t=t.replace(/,/g,'');
      const v=parseFloat(t); return Number.isFinite(v)?v:null; };

    const rows=raw.map(r=>{ const o={d:String(r[KEYS.dt]), ln:String(r[KEYS.line]??'—'), cell:String(r[KEYS.cell]??'')};
      for(const k in r){ if(k===KEYS.dt||k===KEYS.line||k===KEYS.cell) continue; const v=toNum(r[k]); if(v!=null) o[k]=v; } return o; });

    const pref=Array.from({length:40},(_,i)=>'m'+(i+1));
    const mKeys=[...new Set(rows.flatMap(o=>Object.keys(o)))].filter(k=>!['d','ln','cell'].includes(k))
                  .filter(k=>rows.some(r=>Number.isFinite(r[k]))).sort((a,b)=>pref.indexOf(a)-pref.indexOf(b));
    if(!mKeys.length){ document.getElementById('chart-grid').innerHTML='<div class="sec">No numeric measures found.</div>'; return; }
    const TIT={}; mKeys.forEach((k,i)=>TIT[k]=(MT[i]||pTitles[i]||k));

    const dates=[...new Set(rows.map(r=>r.d))];
    const ROTATE=dates.length>ROTATE_THRESHOLD;
    const lines=[...new Set(rows.map(r=>r.ln))]; lines.forEach(colorFor);

    /* ===== Stats & store ===== */
    const quantiles=a=>{const s=a.slice().sort((x,y)=>x-y), n=s.length; if(!n) return {q1:null,med:null,q3:null,iqr:null,min:null,max:null};
      const q=p=>{const i=(n-1)*p, lo=Math.floor(i), hi=Math.ceil(i); return lo===hi?s[lo]:s[lo]+(s[hi]-s[lo])*(i-lo)}; return {q1:q(0.25),med:q(0.5),q3:q(0.75),iqr:q(0.75)-q(0.25),min:s[0],max:s[n-1]} };

    const map={}; mKeys.forEach(k=>map[k]={});
    for(const r of rows){ for(const mk of mKeys){ const v=r[mk]; if(!Number.isFinite(v)) continue;
      ((map[mk][r.d]=map[mk][r.d]||{})[r.ln]=map[mk][r.d][r.ln]||[]).push({y:v,cell:r.cell}); } }

    const store={};
    for(const mk of mKeys){
      store[mk]={};
      for(const ln of lines) store[mk][ln]={ nmX:[],nmY:[],nmT:[], allX:[],allY:[],allT:[], extX:[],extY:[],extT:[], medX:[],medY:[],medTXT:{} };
      for(const d of dates){
        const byLine=map[mk][d]||{};
        for(const ln of lines){
          const arr=byLine[ln]||[]; if(!arr.length) continue;
          const vals=arr.map(o=>o.y), st=quantiles(vals);
          const fmL=st.q1-MILD_K*st.iqr, fmH=st.q3+MILD_K*st.iqr, feL=st.q1-EXTREME_K*st.iqr, feH=st.q3+EXTREME_K*st.iqr;

          const non=[], mild=[], ext=[]; for(const o of arr){ if(o.y<feL||o.y>feH) ext.push(o); else if(o.y<fmL||o.y>fmH) mild.push(o); else non.push(o); }

          const S=store[mk][ln];
          for(const o of non.concat(mild)){ S.nmX.push(d); S.nmY.push(o.y); S.nmT.push(o.cell); }
          for(const o of arr){ S.allX.push(d); S.allY.push(o.y); S.allT.push(o.cell); }
          for(const o of ext){ S.extX.push(d); S.extY.push(o.y); S.extT.push(o.cell); }

          const medS=quantiles((non.concat(mild)).map(o=>o.y));
          const txt=`${LINE_TITLE}: ${ln}<br>${DATE_TITLE}: ${d}<br>`+
            `Min: ${fmtN(medS.min)}<br>Q1: ${fmtN(medS.q1)}<br>Median: ${fmtN(medS.med)}<br>Q3: ${fmtN(medS.q3)}<br>Max: ${fmtN(medS.max)}<br>`+
            `n: ${arr.length} &nbsp;|&nbsp; Inliers: ${(non.length+mild.length)} &nbsp;|&nbsp; Extremes: ${ext.length}`;
          S.medX.push(d); S.medY.push(medS.med!=null?medS.med:(non[0]?.y ?? mild[0]?.y ?? ext[0]?.y)); S.medTXT[d]=txt;
        }
      }
    }
    function fmtN(v){ return v==null?'—':(+v).toFixed(3); }

    /* ===== Grid & sections ===== */
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
    const ids=mKeys.map(k=>makeSection(k,TIT[k]));
    const state={}; ids.forEach(id=>state[id]={includeExt:false,showMed:false,fmin:null,fmax:null,exclude:new Set(),showLegend:LEG_SHOW,uirev:1,lastHover:null,showStatus:false,legendPos:'auto'});

    /* ===== Axes & legend ===== */
    const xAxisSpec=()=>({
      type:'category',categoryorder:'array',categoryarray:dates,
      tickmode:'auto',tickangle:ROTATE?-90:0,tickfont:{size:ROTATE?10:12},
      automargin:true, title:{text: DATE_TITLE}, gridcolor:THEMES[CUR_THEME].GRID, zeroline:false
    });
    function yFmt(vals){ const v=vals.filter(Number.isFinite); if(!v.length) return ',.3f';
      const allInt=v.every(x=>Math.abs(x-Math.round(x))<1e-9); if(allInt) return ',.0f';
      const mn=Math.min(...v), mx=Math.max(...v), rg=Math.abs(mx-mn);
      if(rg>=100) return ',.0f'; if(rg>=10) return ',.1f'; if(rg>=1) return ',.2f'; if(rg>=0.1) return ',.3f'; return ',.4f'; }

    function legendSpec(pos){
      switch(pos){
        case 'top-left':      return {orientation:'h', x:0,   xanchor:'left',   y:1.06, yanchor:'bottom'};
        case 'top-center':    return {orientation:'h', x:0.5, xanchor:'center', y:1.06, yanchor:'bottom'};
        case 'top-right':     return {orientation:'h', x:1,   xanchor:'right',  y:1.06, yanchor:'bottom'};
        case 'bottom-center': return {orientation:'h', x:0.5, xanchor:'center', y:-0.22,yanchor:'top'};
        case 'left':          return {orientation:'v', x:-0.02,xanchor:'left',  y:1,    yanchor:'top'};
        case 'right':         return {orientation:'v', x:1.02, xanchor:'left',  y:1,    yanchor:'top'};
        case 'plot-top-left':
        case 'plot-top-center':
        case 'plot-top-right':
        case 'plot-bottom-left':
        case 'plot-bottom-center':
        case 'plot-bottom-right':
          return {orientation:'h', x:0, y:1};
        default:
          return {orientation:'h', x:0.5, xanchor:'center', y:1.06, yanchor:'bottom'};
      }
    }
    function marginsFor(pos){
      if(pos.startsWith('plot-')) return { l:56, r:6, t:28, b:(ROTATE?96:48), pad:0 };
      if(pos==='top-left'||pos==='top-center'||pos==='top-right')
        return { l:56, r:6, t:68, b:(ROTATE?96:48), pad:0 }; /* headroom for modebar */
      if(pos==='bottom-center')
        return { l:56, r:6, t:28, b:(ROTATE?120:80), pad:0 };
      if(pos==='left')
        return { l:116, r:6, t:28, b:(ROTATE?96:48), pad:0 };
      if(pos==='right')
        return { l:56, r:116, t:28, b:(ROTATE?96:48), pad:0 };
      return { l:56, r:6, t:68, b:(ROTATE?96:48), pad:0 };
    }
    async function positionLegendInsideIfNeeded(gd, pos){
      if(!pos.startsWith('plot-')) return;
      const fl=gd._fullLayout; if(!fl || !fl.xaxis || !fl.yaxis) return;
      const xd=fl.xaxis.domain.slice(); const yd=fl.yaxis.domain.slice(); const padX=0.01, padY=0.01;
      let x=xd[0]+padX, y=yd[1]-padY, xa='left', ya='top';
      if(pos==='plot-top-left'){ x=xd[0]+padX; y=yd[1]-padY; xa='left';  ya='top'; }
      if(pos==='plot-top-center'){ x=(xd[0]+xd[1])/2; y=yd[1]-padY; xa='center'; ya='top'; }
      if(pos==='plot-top-right'){x=xd[1]-padX; y=yd[1]-padY; xa='right'; ya='top'; }
      if(pos==='plot-bottom-left'){x=xd[0]+padX; y=yd[0]+padY; xa='left';  ya='bottom';}
      if(pos==='plot-bottom-center'){x=(xd[0]+xd[1])/2; y=yd[0]+padY; xa='center'; ya='bottom';}
      if(pos==='plot-bottom-right'){x=xd[1]-padX; y=yd[0]+padY; xa='right'; ya='bottom';}
      await Plotly.relayout(gd,{
        'legend.x':x,'legend.y':y,'legend.xanchor':xa,'legend.yanchor':ya,
        'legend.orientation':'h',
        'legend.bgcolor': (CUR_THEME==='dark'?'rgba(15,23,42,0.68)':'rgba(255,255,255,0.72)'),
        'legend.bordercolor': (CUR_THEME==='dark'?'#2b3447':'#e5e7eb'),
        'legend.borderwidth': 1
      });
    }

    /* ===== Helpers ===== */
    const rmKey=(mk,ln,x,y,cell)=>`${mk}␟${ln}␟${x}␟${cell??''}␟${y}`;
    function applyFilters(X,Y,T,mk,ln,st){ const Xo=[],Yo=[],To=[];
      for(let i=0;i<Y.length;i++){
        const y=Y[i], x=X[i], c=T[i];
        if(st.fmin!=null && y<st.fmin) continue;
        if(st.fmax!=null && y>st.fmax) continue;
        if(st.exclude.has(rmKey(mk,ln,x,y,c))) continue;
        Xo.push(x); Yo.push(y); To.push(c);
      }
      return {X:Xo,Y:Yo,T:To};
    }
    function sampleArrays(X,Y,T,keep){ if(Y.length<=keep) return {X,Y,T};
      const step=Math.ceil(Y.length/keep); const Xo=[],Yo=[],To=[];
      for(let i=0;i<Y.length;i+=step){ Xo.push(X[i]); Yo.push(Y[i]); To.push(T[i]); }
      return {X:Xo,Y:Yo,T:To};
    }
    function allY(mk, st){ const vals=[]; for(const ln of lines){ const S=store[mk][ln]; if(!S) continue;
      const bx=st.includeExt?S.allX:S.nmX, by=st.includeExt?S.allY:S.nmY, bt=st.includeExt?S.allT:S.nmT; const f=applyFilters(bx,by,bt,mk,ln,st); vals.push(...f.Y); } return vals; }

    /* ===== Traces (no extra red overlay; keep original feel) ===== */
    function tracesFor(mk, st, chartPointBudget){
      const traces=[]; let budget=chartPointBudget;
      for(const ln of lines){
        const baseCol=LINE_COLORS[ln]||'#2E77D0', S=store[mk][ln]; if(!S) continue;

        const bx=st.includeExt?S.allX:S.nmX, by=st.includeExt?S.allY:S.nmY, bt=st.includeExt?S.allT:S.nmT;
        let f=applyFilters(bx,by,bt,mk,ln,st);

        if(st.includeExt && budget>0){
          const maxForLn=Math.max(1000, Math.floor(budget/lines.length));
          f = sampleArrays(f.X,f.Y,f.T,maxForLn);
          budget -= f.Y.length;
        }

        const boxCD=f.X.map(d=>S.medTXT[d]||'');

        traces.push({
          type:'box', name:ln, legendgroup:ln, offsetgroup:ln,
          x:f.X, y:f.Y, text:f.T, customdata:boxCD,
          /* show all points when "Extremes" is ON (original behavior) */
          boxpoints: st.includeExt ? 'all' : 'suspectedoutliers',
          hoveron:'boxes+points',
          /* stronger jitter only when "Extremes" is ON so points don't hide behind the box */
          jitter: st.includeExt ? 0.4 : 0,
          pointpos:0,
          marker:{ size:7, color:baseCol, line:{color:'rgba(0,0,0,0)', width:0}, opacity:0.98 },
          line:{width:1.2,color:baseCol}, fillcolor:rgba(baseCol,0.12), whiskerwidth:0.5,
          hovertemplate:`%{customdata}<br>Cell: %{text}<extra></extra>`,
          showlegend:true
        });

        if(st.showMed){
          traces.push({
            type:'scatter', mode:'lines+markers', name:`Median – ${ln}`, legendgroup:ln, showlegend:false, hoverinfo:'skip',
            x:S.medX, y:S.medY, line:{width:2,color:baseCol}, marker:{size:6,color:baseCol}
          });
        }
      }
      return traces;
    }

    /* ===== Icons & modebar ===== */
    const I=p=>({width:1000,height:1000,path:p});
    const homeI=I('M500 150 L900 450 V850 H650 V600 H350 V850 H100 V450 Z');
    const plusI=I('M450 150 H550 V450 H850 V550 H550 V850 H450 V550 H150 V450 H450 Z');
    const minusI=I('M150 450 H850 V550 H150 Z');
    const yPlusI=I('M470 200 H530 V430 H760 V490 H530 V720 H470 V490 H240 V430 H470 Z');
    const yMinusI=I('M240 470 H760 V530 H240 Z');
    const themeI=I('M700 500 A200 200 0 1 1 300 500 A200 200 0 1 0 700 500 Z M500 100 A400 400 0 1 0 900 500 A250 250 0 0 1 500 100 Z');
    const downI=I('M500 180 V720 M500 720 L420 640 M500 720 L580 640');
    const fullI=I('M140 180 L140 140 L380 140 L380 180 L180 180 L180 380 L140 380 Z M620 140 L860 140 L860 380 L820 380 L820 180 L620 180 Z M140 620 L180 620 L180 820 L380 820 L380 860 L140 860 Z M820 620 L860 620 L860 860 L620 860 L620 820 L820 820 Z');
    const medianI=I('M200 500 H800 M200 350 H800 M200 650 H800');
    const extI=I('M500 120 L860 880 H140  Z');
    const filtI=I('M200 200 H800 L600 520 V800 H400 V520 Z');
    const posI=I('M200 200 H800 V300 H200 Z M200 450 H350 V650 H200 Z M450 450 H800 V650 H450 Z');
    const tableI=I('M160 200 H840 V800 H160 Z M160 320 H840 M160 480 H840 M160 640 H840 M360 200 V800 M560 200 V800');

    function cfgFor(gd, chartId, title){
      const resetBtn={name:'Reset',title:'Reset (axes + clear + Extremes OFF + Median OFF)',icon:homeI,click:()=>{
        const st=state[chartId]; st.fmin=st.fmax=null; st.exclude.clear(); st.includeExt=false; st.showMed=false;
        Plotly.relayout(gd,{'xaxis.autorange':true,'yaxis.autorange':true}); st.uirev++; draw(chartId);
      }};
      const medBtn   ={name:'Median',title:'Toggle median line',icon:medianI,click:()=>{state[chartId].showMed=!state[chartId].showMed; state[chartId].uirev++; draw(chartId);} };
      const extBtn   ={name:'Extremes',title:'Toggle extreme outliers',icon:extI,click:()=>{state[chartId].includeExt=!state[chartId].includeExt; state[chartId].uirev++; draw(chartId);} };
      const filterBtn={name:'Filter',title:'Keep only values…',icon:filtI,click:()=>openFilterPopover(gd, chartId)};
      const legendMenuBtn={name:'Legend',title:'Legend menu',icon:posI,click:()=>openLegendMenu(gd, chartId)};
      const statusBtn={name:'Status',title:'Toggle status table',icon:tableI,click:()=>{state[chartId].showStatus=!state[chartId].showStatus; renderStatusTable(gd, chartId); markActiveButtons(gd, chartId);} };
      const xInBtn   ={name:'X+', title:'Zoom X In', icon:plusI,  click:()=>zoomAxis(gd,'x','in') };
      const xOutBtn  ={name:'X-', title:'Zoom X Out',icon:minusI, click:()=>zoomAxis(gd,'x','out')};
      const yInBtn   ={name:'Y+', title:'Zoom Y In', icon:yPlusI, click:()=>zoomAxis(gd,'y','in') };
      const yOutBtn  ={name:'Y-', title:'Zoom Y Out',icon:yMinusI,click:()=>zoomAxis(gd,'y','out')};
      const themeBtn ={name:'Theme',title:'Light/Dark',icon:themeI, click:()=>{ CUR_THEME=(CUR_THEME==='light'?'dark':'light'); setThemeAttr(); const st=state[chartId]; st.uirev++; draw(chartId); if(state[chartId].showStatus) renderStatusTable(gd, chartId); }};
      const dlBtn    ={name:'Downloads',title:'Downloads',icon:downI, click:()=>openDownloadsMenu(gd, chartId, title)};
      const fsBtn    ={name:'Fullscreen',title:'Fullscreen',icon:fullI, click:(g)=>toggleFS(g)};
      return {
        displayModeBar:true, displaylogo:false, responsive:true, scrollZoom:false,
        modeBarButtonsToRemove:['zoom2d','zoomIn2d','zoomOut2d','pan2d','select2d','lasso2d','autoScale2d','resetScale2d','hoverClosestCartesian','hoverCompareCartesian','toggleSpikelines','toImage'],
        modeBarButtonsToAdd:[resetBtn,legendMenuBtn,statusBtn,medBtn,extBtn,filterBtn,xInBtn,xOutBtn,yInBtn,yOutBtn,themeBtn,dlBtn,fsBtn]
      };
    }
    function markActiveButtons(gd, chartId){
      const st=state[chartId]; const mb=gd.querySelector('.modebar'); if(!mb) return;
      mb.querySelectorAll('.modebar-btn').forEach(b=>{ const t=b.getAttribute('data-title')||b.getAttribute('title')||'';
        if(/median/i.test(t))  b.setAttribute('data-on', st.showMed?'1':'0');
        if(/extreme/i.test(t)) b.setAttribute('data-on', st.includeExt?'1':'0');
        if(/status/i.test(t))  b.setAttribute('data-on', st.showStatus?'1':'0');
      });
    }

    /* ===== Popover helpers ===== */
    function findModebarBtn(gd, re){
      const mb=gd.querySelector('.modebar'); if(!mb) return null;
      return Array.from(mb.querySelectorAll('.modebar-btn')).find(b=>{
        const t=b.getAttribute('data-title')||b.getAttribute('title')||''; return re.test(t);
      })||null;
    }
    function closePopover(fn){
      const el=fn._el; if(el&&el.parentNode) el.parentNode.removeChild(el);
      if(fn._rePos){ removeEventListener('resize', fn._rePos); removeEventListener('scroll', fn._rePos); }
      fn._el=null; fn._rePos=null;
    }

    /* ===== Filter popover (attaches to FS overlay when present) ===== */
    function openFilterPopover(gd, chartId){
      closePopover(openFilterPopover);
      const st=state[chartId];
      const pop=document.createElement('div'); pop.className='filter-pop';
      pop.innerHTML=`<span>Keep only values</span>
        <input id="fp-min" placeholder="Min" value="${st.fmin??''}">
        <input id="fp-max" placeholder="Max" value="${st.fmax??''}">
        <button id="fp-apply">Apply</button>
        <button id="fp-clear">Clear</button>
        <button id="fp-close">✕</button>`;
      (gd._fsOverlay||document.body).appendChild(pop);

      function place(){
        const btn=findModebarBtn(gd, /Filter/i) || gd.querySelector('.modebar');
        const r=btn?btn.getBoundingClientRect():{left:innerWidth-140, right:innerWidth-14, bottom:54};
        const pw=pop.offsetWidth, ph=pop.offsetHeight;
        let top=r.bottom+6, left=r.right - pw;
        top=Math.max(6, Math.min(top, innerHeight-ph-6));
        left=Math.max(6, Math.min(left, innerWidth - pw - 6));
        pop.style.top=top+'px'; pop.style.left=left+'px';
      }
      place();
      const rePos=()=>place(); addEventListener('resize',rePos); addEventListener('scroll',rePos,{passive:true});

      pop.querySelector('#fp-apply').onclick=()=>{ const v0=parseFloat(pop.querySelector('#fp-min').value), v1=parseFloat(pop.querySelector('#fp-max').value);
        st.fmin=Number.isFinite(v0)?v0:null; st.fmax=Number.isFinite(v1)?v1:null; st.uirev++; draw(chartId); if(st.showStatus) renderStatusTable(gd, chartId); closePopover(openFilterPopover); };
      pop.querySelector('#fp-clear').onclick=()=>{ st.fmin=st.fmax=null; st.uirev++; draw(chartId); if(st.showStatus) renderStatusTable(gd, chartId); closePopover(openFilterPopover); };
      pop.querySelector('#fp-close').onclick=()=>closePopover(openFilterPopover);

      setTimeout(()=>document.addEventListener('mousedown', e=>{ if(!pop.contains(e.target)) closePopover(openFilterPopover); }, {capture:true, once:true}),0);

      openFilterPopover._el=pop; openFilterPopover._rePos=rePos;
    }

    /* ===== Legend menu (attaches to FS overlay) ===== */
    const LEG_OPTS=['auto','top-left','top-center','top-right','bottom-center','left','right'];
    function openLegendMenu(gd, chartId){
      closePopover(openLegendMenu);
      const st=state[chartId];
      const pop=document.createElement('div'); pop.className='menu-pop'; pop.style.flexDirection='column';

      pop.innerHTML =
        `<div style="font-weight:600;margin-bottom:6px">Legend</div>
         <button id="lg-toggle" style="justify-content:flex-start;min-width:180px">Show/Hide: ${st.showLegend?'On':'Off'}</button>
         <div style="height:6px"></div>
         <div style="font-weight:600;margin-bottom:6px">Position</div>` +
        LEG_OPTS.map(o=>{
          const cur=(st.legendPos||'auto'); const mark = (cur===o)?'✓ ':'&nbsp; ';
          const lbl=o.replace(/-/g,' ').replace(/\b\w/g,m=>m.toUpperCase());
          return `<button data-pos="${o}" style="justify-content:flex-start;min-width:180px">${mark}${lbl}</button>`;
        }).join('') + `<button id="lp-close">Close</button>`;

      (gd._fsOverlay||document.body).appendChild(pop);

      function place(){
        const btn=findModebarBtn(gd, /Legend menu|Legend$/i) || gd.querySelector('.modebar');
        const r=btn?btn.getBoundingClientRect():{left:innerWidth-140, right:innerWidth-14, bottom:54};
        const pw=pop.offsetWidth, ph=pop.offsetHeight;
        let top=r.bottom+6, left=r.right - pw;
        top=Math.max(6, Math.min(top, innerHeight-ph-6));
        left=Math.max(6, Math.min(left, innerWidth - pw - 6));
        pop.style.top=top+'px'; pop.style.left=left+'px';
      }
      place();
      const rePos=()=>place(); addEventListener('resize',rePos); addEventListener('scroll',rePos,{passive:true});

      pop.querySelector('#lg-toggle').onclick=()=>{ st.showLegend=!st.showLegend; st.uirev++; draw(chartId); closePopover(openLegendMenu); };
      pop.querySelectorAll('button[data-pos]').forEach(b=>{
        b.onclick=()=>{ st.legendPos=b.getAttribute('data-pos')||'auto'; st.uirev++; draw(chartId); closePopover(openLegendMenu); };
      });
      pop.querySelector('#lp-close').onclick=()=>closePopover(openLegendMenu);

      setTimeout(()=>document.addEventListener('mousedown', e=>{ if(!pop.contains(e.target)) closePopover(openLegendMenu); }, {capture:true, once:true}),0);

      openLegendMenu._el=pop; openLegendMenu._rePos=rePos;
    }

    /* ===== Downloads menu (attaches to FS overlay) ===== */
    function openDownloadsMenu(gd, chartId, title){
      closePopover(openDownloadsMenu);
      const pop=document.createElement('div'); pop.className='menu-pop'; pop.style.flexDirection='column';
      pop.innerHTML=`<div style="font-weight:600;margin-bottom:6px">Downloads</div>
        <button id="dl-data">This chart – Data CSV</button>
        <button id="dl-status">This chart – Status CSV</button>
        <button id="dl-img">This chart – Image (PNG)</button>
        <button id="dl-allpng">All charts – PNG grid</button>
        <button id="dl-allstatus">All charts – Status CSV</button>
        <button id="dl-close">Close</button>`;
      (gd._fsOverlay||document.body).appendChild(pop);

      function place(){
        const btn=findModebarBtn(gd, /Downloads/i) || gd.querySelector('.modebar');
        const r=btn?btn.getBoundingClientRect():{left:innerWidth-140, right:innerWidth-14, bottom:54};
        const pw=pop.offsetWidth, ph=pop.offsetHeight;
        let top=r.bottom+6, left=r.right - pw;
        top=Math.max(6, Math.min(top, innerHeight-ph-6));
        left=Math.max(6, Math.min(left, innerWidth - pw - 6));
        pop.style.top=top+'px'; pop.style.left=left+'px';
      }
      place();
      const rePos=()=>place(); addEventListener('resize',rePos); addEventListener('scroll',rePos,{passive:true});

      pop.querySelector('#dl-data').onclick=()=>{ downloadCSV(gd, chartId, title); closePopover(openDownloadsMenu); };
      pop.querySelector('#dl-status').onclick=()=>{ downloadStatusCSV(gd, chartId, title); closePopover(openDownloadsMenu); };
      pop.querySelector('#dl-img').onclick=()=>{ Plotly.downloadImage(gd,{format:'png',scale:2,filename:(title||'chart').replace(/\s+/g,'_')}); closePopover(openDownloadsMenu); };
      pop.querySelector('#dl-allpng').onclick=()=>{ downloadAllPNG(); closePopover(openDownloadsMenu); };
      pop.querySelector('#dl-allstatus').onclick=()=>{ downloadAllStatusCSV(); closePopover(openDownloadsMenu); };
      pop.querySelector('#dl-close').onclick=()=>closePopover(openDownloadsMenu);

      setTimeout(()=>document.addEventListener('mousedown', e=>{ if(!pop.contains(e.target)) closePopover(openDownloadsMenu); }, {capture:true, once:true}),0);

      openDownloadsMenu._el=pop; openDownloadsMenu._rePos=rePos;
    }

    /* ===== CSV + ALL PNG ===== */
    function downloadCSV(gd, chartId, title){
      const st=state[chartId], mk=decodeURIComponent(gd.getAttribute('data-measure'));
      const out=[`"${DATE_TITLE}","${LINE_TITLE}","Cell","Value"`];
      for(const ln of lines){
        const S=store[mk][ln]; if(!S) continue;
        const bx=st.includeExt?S.allX:S.nmX, by=st.includeExt?S.allY:S.nmY, bt=st.includeExt?S.allT:S.nmT;
        const f=applyFilters(bx,by,bt,mk,ln,st);
        for(let i=0;i<f.Y.length;i++) out.push(`"${f.X[i]}","${ln}","${f.T[i]??''}","${f.Y[i]}"`);
      }
      const blob=new Blob([out.join('\n')],{type:'text/csv;charset=utf-8;'}); const a=document.createElement('a');
      a.href=URL.createObjectURL(blob); a.download((title||'measure').replace(/\s+/g,'_')+'.csv'); a.click();
    }
    async function downloadAllPNG(){
      const els=[...document.querySelectorAll('#chart-grid .js-plotly-plot')]; if(!els.length) return;
      const shots=await Promise.all(els.map(el=>Plotly.toImage(el,{format:'png',scale:2})));
      const imgs=await Promise.all(shots.map(src=>new Promise(res=>{ const im=new Image(); im.onload=()=>res(im); im.src=src; })));

      const cols=Math.max(1, Math.min(GPR, 3));
      const cellW=900, cellH=HEIGHT*2;
      const rows=Math.ceil(imgs.length/cols);
      const maxPageRows=10;
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

    /* ===== Status table ===== */
    function getStatusRows(gd, chartId){
      const st=state[chartId], mk=decodeURIComponent(gd.getAttribute('data-measure'));
      const out=[];
      const byM=map[mk]||{};
      for(const d of dates){
        const byD=byM[d]||{};
        for(const ln of lines){
          const arr=(byD[ln]||[]).slice();
          if(!arr.length){ continue; }

          const filtered = arr.filter(o=>{
            if(st.fmin!=null && o.y<st.fmin) return false;
            if(st.fmax!=null && o.y>st.fmax) return false;
            return !st.exclude.has(rmKey(mk, ln, d, o.y, o.cell));
          });
          if(!filtered.length){ out.push({d,ln,nAll:0,nIn:0,pctIn:0,nExt:0,pctExt:0,min:null,q1:null,med:null,q3:null,max:null,lf:null,uf:null}); continue; }

          const valsAll = filtered.map(o=>o.y);
          const statsAll = quantiles(valsAll);
          const feL = statsAll.q1 - EXTREME_K*statsAll.iqr;
          const feH = statsAll.q3 + EXTREME_K*statsAll.iqr;
          const nm = [], ext = [];
          for(const o of filtered){ ((o.y<feL||o.y>feH)?ext:nm).push(o); }

          const yForBox = st.includeExt ? nm.concat(ext).map(o=>o.y) : nm.map(o=>o.y);
          const stq = quantiles(yForBox);
          const lf = (stq.q1!=null && stq.iqr!=null) ? (stq.q1 - MILD_K*stq.iqr) : null;
          const uf = (stq.q3!=null && stq.iqr!=null) ? (stq.q3 + MILD_K*stq.iqr) : null;

          const nAll = nm.length + ext.length, nExt = ext.length, nIn = nm.length;
          out.push({
            d, ln,
            nAll, nIn, pctIn: nAll ? (nIn/nAll*100) : 0,
            nExt, pctExt: nAll ? (nExt/nAll*100) : 0,
            min: stq.min, q1: stq.q1, med: stq.med, q3: stq.q3, max: stq.max,
            lf, uf
          });
        }
      }
      out.sort((a,b)=> (a.d===b.d ? lines.indexOf(a.ln)-lines.indexOf(b.ln) : (a.d>b.d?1:-1)));
      return out;
    }
    function renderStatusTable(gd, chartId){
      const wrap=document.getElementById('st_'+chartId);
      if(!wrap) return;
      if(!state[chartId].showStatus){
        wrap.style.display='none'; wrap.innerHTML='';
        Plotly.Plots.resize(gd);
        return;
      }

      const rows=getStatusRows(gd, chartId);
      let html=`<table class="status-table"><thead><tr>
        <th>${DATE_TITLE}</th><th>${LINE_TITLE}</th>
        <th>n</th><th>Inliers</th><th>%In</th>
        <th>Extremes</th><th>%Ext</th>
        <th>Min</th><th>Q1</th><th>Median</th><th>Q3</th><th>Max</th>
        <th>Lower fence</th><th>Upper fence</th>
      </tr></thead><tbody>`;
      rows.forEach(r=>{
        html+=`<tr>
          <td>${r.d}</td><td>${r.ln}</td>
          <td>${r.nAll}</td>
          <td class="pos-cell">${r.nIn}</td><td class="pos-cell">${(r.pctIn||0).toFixed(1)}%</td>
          <td class="neg-cell">${r.nExt}</td><td class="neg-cell">${(r.pctExt||0).toFixed(1)}%</td>
          <td>${fmtN(r.min)}</td><td>${fmtN(r.q1)}</td><td>${fmtN(r.med)}</td><td>${fmtN(r.q3)}</td><td>${fmtN(r.max)}</td>
          <td>${fmtN(r.lf)}</td><td>${fmtN(r.uf)}</td>
        </tr>`;
      });
      html+='</tbody></table>';
      wrap.innerHTML=html;
      wrap.style.display='';
      Plotly.Plots.resize(gd);
      if(gd._fsOverlay){ setTimeout(()=>wrap.scrollIntoView({block:'nearest'}), 50); }
    }

    function downloadStatusCSV(gd, chartId, title){
      const mk=decodeURIComponent(gd.getAttribute('data-measure'));
      const rows=getStatusRows(gd, chartId);
      const out=[`"Measure","${DATE_TITLE}","${LINE_TITLE}","n","Inliers","%In","Extremes","%Ext","Min","Q1","Median","Q3","Max","Lower fence","Upper fence"`];
      const t=(decodeURIComponent(gd.getAttribute('data-title'))||mk).replace(/"/g,'""');
      rows.forEach(r=>out.push(
        `"${t}","${r.d}","${r.ln}","${r.nAll}","${r.nIn}","${(r.pctIn||0).toFixed(1)}%","${r.nExt}","${(r.pctExt||0).toFixed(1)}%","${r.min}","${r.q1}","${r.med}","${r.q3}","${r.max}","${r.lf}","${r.uf}"`
      ));
      const blob=new Blob([out.join('\n')],{type:'text/csv;charset=utf-8;'}); const a=document.createElement('a');
      a.href=URL.createObjectURL(blob); a.download(((title||'measure').replace(/\s+/g,'_')+'_status.csv')); a.click();
    }
    function downloadAllStatusCSV(){
      const out=[`"Measure","${DATE_TITLE}","${LINE_TITLE}","n","Inliers","%In","Extremes","%Ext","Min","Q1","Median","Q3","Max","Lower fence","Upper fence"`];
      document.querySelectorAll('#chart-grid .js-plotly-plot').forEach(gd=>{
        const id=gd.id, mk=decodeURIComponent(gd.getAttribute('data-measure'));
        const title=decodeURIComponent(gd.getAttribute('data-title'))||mk;
        const rows=getStatusRows(gd, id);
        const t=title.replace(/"/g,'""');
        rows.forEach(r=>out.push(`"${t}","${r.d}","${r.ln}","${r.nAll}","${r.nIn}","${(r.pctIn||0).toFixed(1)}%","${r.nExt}","${(r.pctExt||0).toFixed(1)}%","${r.min}","${r.q1}","${r.med}","${r.q3}","${r.max}","${r.lf}","${r.uf}"`));
      });
      const blob=new Blob([out.join('\n')],{type:'text/csv;charset=utf-8;'}); const a=document.createElement('a');
      a.href=URL.createObjectURL(blob); a.download('all_charts_status.csv'); a.click();
    }

    /* ===== Fullscreen ===== */
    function toggleFS(g){
      if(g._fsOverlay){
        const parent=g._origParent||null;
        const ph=g._ph||null;
        if(ph && ph.parentNode){ ph.parentNode.replaceChild(g, ph); g._ph=null; }
        else if(parent){ parent.appendChild(g); }

        const stWrap=document.getElementById('st_'+g.id);
        if(stWrap && g.parentNode){
          g.parentNode.insertBefore(stWrap, g.nextSibling);
          stWrap.style.maxHeight='unset'; stWrap.style.overflow='unset';
        }
        g.style.width='100%'; g.style.height=(g._prevH||HEIGHT)+'px';
        g._fsOverlay.remove(); g._fsOverlay=null; removeEventListener('resize',g._fsResize);
        requestAnimationFrame(()=>{ Plotly.relayout(g,{autosize:true}); Plotly.Plots.resize(g); });
        return;
      }

      g._origParent=g.parentNode;
      const ph=document.createElement('div'); ph.className='pl-fs-ph'; ph.style.display='none';
      g._origParent.insertBefore(ph, g); g._ph=ph;

      const ov=document.createElement('div'); ov.className='pl-fs-overlay'; document.body.appendChild(ov);
      ov.appendChild(g); g._fsOverlay=ov; g._prevH=(parseInt(g.style.height,10)||HEIGHT);

      const stWrap=document.getElementById('st_'+g.id);
      if(stWrap){ ov.appendChild(stWrap); stWrap.style.maxHeight='30vh'; stWrap.style.overflow='auto'; }

      g._fsResize=()=>fitFS(g); addEventListener('resize',g._fsResize); fitFS(g);
      addEventListener('keydown',function esc(e){ if(e.key==='Escape'&&g._fsOverlay){ toggleFS(g); removeEventListener('keydown',esc);} });
    }
    function fitFS(g){ g.style.width=innerWidth+'px'; g.style.height=innerHeight+'px'; Plotly.relayout(g,{width:innerWidth,height:innerHeight,autosize:false}); Plotly.Plots.resize(g); }

    /* ===== Point events ===== */
    function attachPointEvents(gd, chartId){
      if(gd._wired) return;
      gd.on('plotly_hover', ev=>{
        if(!ev||!ev.points||!ev.points.length) return;
        const p=ev.points[0];
        if((p.data.type==='box'||p.data.type==='scatter') && typeof p.pointNumber==='number'){
          state[chartId].lastHover={ ln:(p.data.name||'').replace(/^Extremes – /,''), x:String(p.x), y:+p.y, cell:p.text };
        }
      });
      gd.on('plotly_click', ev=>{
        if(!ev||!ev.points||!ev.points.length) return;
        const mod = ev.event && (ev.event.shiftKey || ev.event.ctrlKey || ev.event.metaKey);
        if(!mod) return;
        const p=ev.points[0]; if((p.data.type!=='box' && p.data.type!=='scatter') || typeof p.pointNumber!=='number') return;
        const mk=decodeURIComponent(gd.getAttribute('data-measure'));
        const ln=(p.data.name||'').replace(/^Extremes – /,''); const key=rmKey(mk, ln, String(p.x), +p.y, p.text);
        state[chartId].exclude.add(key); state[chartId].uirev++; draw(chartId); if(state[chartId].showStatus) renderStatusTable(gd, chartId);
      });
      gd.addEventListener('contextmenu', e=>{
        e.preventDefault();
        const h=state[chartId].lastHover; if(!h) return;
        const mk=decodeURIComponent(gd.getAttribute('data-measure'));
        const key=rmKey(mk, h.ln||'', h.x, +h.y, h.cell);
        state[chartId].exclude.add(key); state[chartId].uirev++; draw(chartId); if(state[chartId].showStatus) renderStatusTable(gd, chartId);
      }, {passive:false});
      gd._wired=true;
    }

    /* ===== Zoom helpers (category-safe) ===== */
    const getRange=(gd,axis)=>{ const ax=gd._fullLayout[axis+'axis']; return (ax&&ax.range)?ax.range.slice():null; }
    const setRange=(gd,axis,r)=>{ const o={}; o[axis+'axis.range']=r; return Plotly.relayout(gd,o); }
    const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
    function asIndexRange(range){
      if(range==null) return null;
      let [a,b]=range;
      const toIdx=v=> (typeof v==='number'? v : Math.max(0, dates.indexOf(String(v))));
      return [toIdx(a), toIdx(b)];
    }
    function zoomAxis(gd,axis,dir){
      const r=getRange(gd,axis);
      if(!r){ const o={}; o[axis+'axis.autorange']=true; Plotly.relayout(gd,o).then(()=>zoomAxis(gd,axis,dir)); return; }
      let [a,b]= (axis==='x' ? asIndexRange(r) : r);
      let c=(a+b)/2, half=(b-a)/2, f=(dir==='in'?0.8:1.25), nh=half*f;
      if(axis==='x'){
        const N=dates.length, mn=-0.5, mx=N-0.5;
        a=clamp(c-nh,mn,mx); b=clamp(c+nh,mn,mx); if(b-a<1){a=c-0.5;b=c+0.5;}
      }else{
        const pad=1e-9; a=c-nh; b=c+nh; if(b-a<pad){a=c-1;b=c+1;}
      }
      setRange(gd,axis,[a,b]);
    }

    /* ===== Draw ===== */
    async function draw(chartId){
      const st=state[chartId], gd=document.getElementById(chartId);
      const mk=decodeURIComponent(gd.getAttribute('data-measure')); const title='<b>'+(decodeURIComponent(gd.getAttribute('data-title'))||mk)+'</b>';

      const chosenPos = (st.legendPos && st.legendPos!=='auto') ? st.legendPos : LEG_POS;
      const legend=legendSpec(chosenPos);
      const margin=marginsFor(chosenPos);

      const layoutBase={
        margin, showlegend: st.showLegend, legend:Object.assign({groupclick:'togglegroup', bgcolor:'rgba(0,0,0,0)'}, legend),
        boxmode:'group', boxgroupgap:0.30, boxgap:0.14,
        xaxis:xAxisSpec(), yaxis:{zeroline:false,tickformat:yFmt(allY(mk,st)),gridcolor:THEMES[CUR_THEME].GRID},
        paper_bgcolor:THEMES[CUR_THEME].BG, plot_bgcolor:THEMES[CUR_THEME].PBG, font:{color:THEMES[CUR_THEME].TXT},
        title:{text:title,x:0.02,xanchor:'left',y:0.98,yanchor:'top',font:{size:14}},
        hovermode:'closest', hoverdistance:12, dragmode:false, uirevision:st.uirev
      };
      const isFS=!!gd._fsOverlay;
      const layout=isFS? Object.assign({width:innerWidth,height:innerHeight}, layoutBase) : Object.assign({height:HEIGHT}, layoutBase);

      await Plotly.react(gd, tracesFor(mk, st, MAX_POINTS_PER_CHART), layout, cfgFor(gd, chartId, title));
      await positionLegendInsideIfNeeded(gd, chosenPos);

      markActiveButtons(gd, chartId);
      if(isFS) fitFS(gd);
      attachPointEvents(gd, chartId);
      if(st.showStatus) renderStatusTable(gd, chartId);
    }

    /* ===== Render scheduling & responsive ===== */
    if(!ids.length){ grid.innerHTML='<div class="sec">No numeric measures found.</div>'; return; }
    draw(ids[0]);
    const later=ids.slice(1);
    if('IntersectionObserver' in window){
      const io=new IntersectionObserver(es=>{ es.forEach(e=>{ if(e.isIntersecting){ draw(e.target.id); io.unobserve(e.target);} }); },{root:null,rootMargin:'200px',threshold:0});
      later.forEach(id=>{ const el=document.getElementById(id); if(el) io.observe(el); });
    } else { later.forEach(id=> draw(id)); }

    let t=null; addEventListener('resize', ()=>{ if(t) return; t=setTimeout(()=>{ document.querySelectorAll('#chart-grid .js-plotly-plot').forEach(el=>{ try{ Plotly.relayout(el,{autosize:true}); Plotly.Plots.resize(el);}catch(_){}}); t=null; },120); });

    function fail(msg){ const g=document.getElementById('chart-grid'); if(g) g.innerHTML='<div class="sec" style="color:#b91c1c;font-weight:600">'+msg+'</div>'; }
  }catch(err){
    const g=document.getElementById('chart-grid');
    if(g) g.innerHTML='<div class="sec" style="color:#b91c1c;font-weight:600">Runtime error: '+(err?.message||err)+'</div>';
    console.error(err);
  }
})();
</script>
