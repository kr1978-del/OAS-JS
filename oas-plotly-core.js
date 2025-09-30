/* OAS Plotly – Core (8d.3 – lifecycle safe)
   - Stale instance guard (auto-stops old instance after page refresh)
   - Bounded retries for missing elements with backoff
   - Container-detach guard (stop when #chart-grid is replaced/removed)
   - Progress beacons + debug console (PV_Debug)
   - No getAttribute usage
*/
(function(global){
  const DFLT_HEIGHT=360, EXTREME_K=3, MILD_K=1.5, ROTATE_THRESHOLD=12;
  const LS_KEY='OAS_BOX_STATE_V8D3';
  const THEMES={ light:{BG:'#fff',PBG:'#fff',TXT:'#111827',GRID:'#e5e7eb'}, dark:{BG:'#0b1220',PBG:'#0f172a',TXT:'#e5e7eb',GRID:'#293244'} };

  const p=document.getElementById('oas-params')||{dataset:{}};
  const ENABLE_PERSISTENCE=String(p.dataset.enablePersistence||'1')!=='0';
  const PV_READ_MODE=String(p.dataset.readMode||'0')!=='0';
  const DEBUG_ENABLED=String(p.dataset.debug||'0')!=='0';

  const DATE_TITLE=(p.dataset.dateTitle||'Date').trim();
  const LINE_TITLE=(p.dataset.lineTitle||'Series').trim();
  const CELL_TITLE=(p.dataset.cellTitle||'Cell').trim();

  const LEG_SHOW=(String(p.dataset.legendShow||'1')!=='0');
  const normLegendPos=(v)=>{v=(v||'top-center').toLowerCase().replace(/\s+/g,'-'); const a={top:'top-center',bottom:'bottom-center'}; return a[v]||v;};
  const LEG_POS=normLegendPos(p.dataset.legendPos||'top-center');

  let CUR_THEME=(p.dataset.defaultTheme||'light').toLowerCase()==='dark'?'dark':'light';
  document.documentElement.setAttribute('data-theme', CUR_THEME==='dark'?'dark':'light');

  // Stale-instance guard: bump generation and pin this Core to it
  const GEN = (global.__OAS_PLOTLY_GEN = (global.__OAS_PLOTLY_GEN || 0) + 1);

  // Container resolve at use time; do not capture stale node
  function container(){ return document.getElementById('chart-grid'); }
  function containerAlive(){ const g=container(); return !!(g && g.isConnected); }

  // Debug sink (URL sanitized)
  function sanitizeUrls(s){
    try{
      return String(s||'').replace(/https?:\/\/[^)\s]+/g,(m)=>{ try{ const u=new URL(m); return u.pathname + (u.search||''); }catch(_){ return '[url]'; } });
    }catch(_){ return String(s||''); }
  }
  const OASDebug=(function(){
    const buf=[], listeners=[];
    const ts=()=>new Date().toISOString().slice(11,23);
    function log(step, detail, chartId){
      const e={ts:ts(), step, detail:sanitizeUrls(detail==null?'':String(detail)), chartId:chartId||''};
      buf.push(e); if(buf.length>3000) buf.shift();
      if(DEBUG_ENABLED) try{ console.log('[OAS]', e.ts, step, e.detail||'', chartId||''); }catch(_){}
      listeners.forEach(fn=>{ try{ fn(e, buf.slice()); }catch(_){ } });
    }
    return {enabled:DEBUG_ENABLED, log, on:(f)=>listeners.push(f), off:(f)=>{const i=listeners.indexOf(f); if(i>=0) listeners.splice(i,1);}, dump:()=>buf.slice(), clear:()=>{buf.length=0;}};
  })();
  global.OASDebug=OASDebug;

  const OASDebugUI=(function(){
    function ensureButton(){
      if(!DEBUG_ENABLED) return;
      if(document.getElementById('oas-debug-fab')) return;
      const b=document.createElement('button');
      b.id='oas-debug-fab'; b.textContent='Console';
      b.style.cssText='position:fixed;right:12px;bottom:12px;z-index:2147483647;background:#111827;color:#e5e7eb;border:1px solid #374151;border-radius:18px;padding:6px 10px;font:12px system-ui;cursor:pointer';
      b.onclick=toggle; document.body.appendChild(b);
    }
    function ensureOpen(){
      if(!DEBUG_ENABLED) return;
      let p=document.getElementById('oas-debug-console'); if(p){ p.style.display=''; return; }
      p=document.createElement('div'); p.id='oas-debug-console';
      p.style.cssText='position:fixed;right:10px;bottom:50px;width:560px;height:320px;background:#0f172a;color:#e5e7eb;border:1px solid #374151;border-radius:10px;z-index:2147483647;display:flex;flex-direction:column';
      p.innerHTML='<div style="padding:6px 8px;border-bottom:1px solid #374151;display:flex;gap:8px;align-items:center"><b style="flex:1;font:12px system-ui">OAS Debug Console</b><button id="dc-copy" style="padding:4px 8px">Copy</button><button id="dc-clear" style="padding:4px 8px">Clear</button><button id="dc-close" style="padding:4px 8px">Close</button></div><div id="dc-body" style="flex:1;overflow:auto;font:12px/1.35 ui-monospace,Consolas,monospace;padding:6px 8px;background:#0b1220"></div>';
      document.body.appendChild(p);
      const body=p.querySelector('#dc-body');
      const render=(e)=>{ const line=document.createElement('div'); line.textContent=`${e.ts}  ${e.step}${e.chartId?(' ['+e.chartId+']'):''}  ${e.detail||''}`; body.appendChild(line); body.scrollTop=body.scrollHeight; };
      OASDebug.dump().forEach(render);
      const listener=(e)=>render(e); OASDebug.on(listener);
      p.querySelector('#dc-close').onclick=()=>{ OASDebug.off(listener); p.style.display='none'; };
      p.querySelector('#dc-clear').onclick=()=>{ OASDebug.clear(); body.innerHTML=''; };
      p.querySelector('#dc-copy').onclick=()=>{ const t=OASDebug.dump().map(e=>`${e.ts}\t${e.step}\t${e.chartId||''}\t${e.detail||''}`).join('\n'); navigator.clipboard.writeText(t).catch(()=>{}); };
    }
    function toggle(){ const p=document.getElementById('oas-debug-console'); if(p&&p.style.display!=='none'){ p.style.display='none'; } else ensureOpen(); }
    return { ensureButton, ensureOpen, toggle };
  })();
  global.OASDebugUI=OASDebugUI;
  if(DEBUG_ENABLED){ if(document.readyState!=='loading') OASDebugUI.ensureButton(); else document.addEventListener('DOMContentLoaded', OASDebugUI.ensureButton, {once:true}); }

  // utils
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const fmtN=(v,d=3)=> (v==null||!isFinite(v))?'—':(+v).toFixed(clamp(d,0,10));
  const PALETTE=['#2E77D0','#E07A1F','#2FA24B','#C33C3C','#7C5AC9','#8C564B','#E377C2','#17BECF','#7f7f7f','#1F9EA8','#B87B00','#5B8C85','#B22222'];
  const LINE_COLORS={}; const colorFor=ln=>LINE_COLORS[ln]||(LINE_COLORS[ln]=PALETTE[Object.keys(LINE_COLORS).length%PALETTE.length]);

  function isNumeric(x){ if(x==null) return false; const s=String(x).trim(); if(!s) return false; const v=Number(String(s).replace(/[^0-9+\-Ee.,]/g,'').replace(/,/g,'.')); return Number.isFinite(v); }
  function toNum(s){ if(s==null) return null; let t=(''+s).trim(); if(!t) return null;
    t=t.replace(/[^\d.,\-Ee+]/g,''); const d=t.lastIndexOf('.'), c=t.lastIndexOf(',');
    if(d!==-1&&c!==-1) t=(c>d)?t.replace(/\./g,'').replace(',', '.'):t.replace(/,/g,''); else if(c!==-1) t=t.replace(',', '.'); else t=t.replace(/,/g,'');
    const v=parseFloat(t); return Number.isFinite(v)?v:null;
  }
  function quantiles(a){ const s=a.slice().sort((x,y)=>x-y), n=s.length; if(!n) return {q1:null,med:null,q3:null,iqr:null,min:s[0],max:s[n-1]};
    const q=p=>{const i=(n-1)*p, lo=Math.floor(i), hi=Math.ceil(i); return lo===hi?s[lo]:s[lo]+(s[hi]-s[lo])*(i-lo)}; return {q1:q(0.25),med:q(0.5),q3:q(0.75),iqr:q(0.75)-q(0.25),min:s[0],max:s[n-1]} }

  function setStepMsg(chartId, msg){
    const el=document.getElementById(chartId); if(!el) return;
    const sec=el.parentNode; if(!sec) return;
    let chip=sec.querySelector('.oas-step');
    if(!chip){
      chip=document.createElement('div');
      chip.className='oas-step';
      chip.style.cssText='position:absolute;top:8px;left:8px;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:6px;padding:2px 6px;font:11px system-ui;color:#374151;z-index:6';
      if(document.documentElement.getAttribute('data-theme')==='dark'){
        chip.style.background='#1f2937'; chip.style.borderColor='#374151'; chip.style.color='#e5e7eb';
      }
      sec.appendChild(chip);
    }
    chip.textContent=msg||''; chip.style.display=msg?'':'none';
  }

  // context
  const ctx={
    sections:[], state:{}, TIT:{}, mKeys:[], dates:[], lines:[],
    MEASURE_MINMAX:{}, _rawMap:{}, attrKeys:[],
    defaultsPV:(function(raw){ if(!raw) return null; let txt=raw.trim(); try{ if(/^[A-Za-z0-9+/=]+$/.test(txt) && txt.length%4===0) txt=atob(txt);}catch(_){ } try{ const o=JSON.parse(txt); if(o&&o.charts) return o; }catch(_){ } return null; })( (p.dataset.plotSettings||'') ),
    LS:null, ROTATE:false, params:p, version:'8d.3', PV_READ_MODE, mapping:{xKey:'dt',seriesKey:'line',cellKey:'cell'},
    GEN, _retry:{}  // per-chart retry counters
  };

  // data/load/store
  function loadRows(){
    OASDebug.log('init:load-rows','start');
    const host=document.getElementById('box-data'); 
    if(!host){ OASDebug.log('init:load-rows','box-data not found'); return []; }
    try{
      const raw=JSON.parse((host.textContent||'[]').trim());
      OASDebug.log('init:load-rows','rows='+raw.length);
      return raw;
    }catch(e){
      OASDebug.log('error:parse-rows', e&&e.message);
      return [];
    }
  }

  function buildRawMap(raw, mapping){
    const xKey=mapping.xKey||'dt', sKey=mapping.seriesKey||'line', cKey=mapping.cellKey||'cell';
    const out={};
    raw.forEach(r=>{
      const d=String(r[xKey]), s=String(r[sKey]??'—'), cell=String(r[cKey]??'');
      Object.keys(r).forEach(k=>{
        if(k===xKey||k===sKey||k===cKey) return;
        const v=toNum(r[k]); if(v==null) return;
        ((out[k]=out[k]||{})[d]=out[k][d]||{})[s]=(out[k][d][s]||[]);
        out[k][d][s].push({y:v, cell});
      });
    });
    return out;
  }

  function buildStore(rows, mapping){
    OASDebug.log('init:build-store','start');
    const xKey=mapping.xKey||'dt', sKey=mapping.seriesKey||'line', cKey=mapping.cellKey||'cell';

    const keys=new Set(), attrKeys=new Set();
    rows.forEach(r=>{ Object.keys(r).forEach(k=>{ if(k===xKey||k===sKey||k===cKey) return; (isNumeric(r[k])?keys:attrKeys).add(k); }); });

    const mKeys=[...keys];
    const TIT={}; const MT=(p.dataset.mtitles||'').split('|').map(s=>s.trim()).filter(Boolean);
    const pTitles=[]; for(let i=1;i<=160;i++){ const v=(p.dataset['p'+i]||'').trim(); if(v) pTitles.push(v); }
    mKeys.forEach((k,i)=>TIT[k]=(MT[i]||pTitles[i]||k));

    const norm=rows.map(r=>{
      const o={x:String(r[xKey]), s:String(r[sKey]??'—'), cell:String(r[cKey]??'')};
      Object.keys(r).forEach(k=>{ if(k===xKey||k===sKey||k===cKey) return; const v=toNum(r[k]); if(v!=null) o[k]=v; });
      return o;
    });

    const dates=[...new Set(norm.map(r=>r.x))];
    const lines=[...new Set(norm.map(r=>r.s))]; lines.forEach(colorFor);

    const map={}; mKeys.forEach(k=>map[k]={});
    for(const r of norm){ for(const mk of mKeys){ const v=r[mk]; if(!Number.isFinite(v)) continue; ((map[mk][r.x]=map[mk][r.x]||{})[r.s]=map[mk][r.x][r.s]||[]).push({y:v,cell:r.cell}); } }

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
          const inl=[], mild=[], ext=[];
          for(const o of arr){ if(o.y<feL||o.y>feH) ext.push(o); else if(o.y<fmL||o.y>fmH) mild.push(o); else inl.push(o); }
          const S=store[mk][ln];
          for(const o of inl){ S.inX.push(d); S.inY.push(o.y); S.inT.push(o.cell); S.tag.add(`${mk}␟${ln}␟${d}␟${o.cell}␟${o.y}␟in`); }
          for(const o of mild){ S.mildX.push(d); S.mildY.push(o.y); S.mildT.push(o.cell); S.tag.add(`${mk}␟${ln}␟${d}␟${o.cell}␟${o.y}␟mild`); }
          for(const o of ext){ S.extX.push(d); S.extY.push(o.y); S.extT.push(o.cell); S.tag.add(`${mk}␟${ln}␟${d}␟${o.cell}␟${o.y}␟ext`); }
          for(const o of arr){ S.allX.push(d); S.allY.push(o.y); S.allT.push(o.cell); }
          const medS=quantiles((inl.concat(mild)).map(o=>o.y));
          const extPct = arr.length? (ext.length/arr.length*100):0;
          const txt=`${LINE_TITLE}: ${ln}<br>${DATE_TITLE}: ${d}<br>Median: ${fmtN(medS.med)}<br>n: ${arr.length} | Extremes: ${ext.length} (${fmtN(extPct,1)}%)`;
          S.medX.push(d); S.medY.push(medS.med!=null?medS.med:(inl[0]?.y ?? mild[0]?.y ?? ext[0]?.y)); S.medTXT[d]=txt;
        }
      }
    }

    const MEASURE_MINMAX={};
    mKeys.forEach(mk=>{
      let mn=Infinity,mx=-Infinity;
      for(const ln of lines){ const S=store[mk][ln]; for(const y of S.allY){ if(Number.isFinite(y)){ mn=Math.min(mn,y); mx=Math.max(mx,y); } } }
      if(isFinite(mn)&&isFinite(mx)) MEASURE_MINMAX[mk]={min:mn,max:mx};
    });

    OASDebug.log('init:build-store','done m='+mKeys.length+', lines='+lines.length+', dates='+dates.length);
    return {store, dates, lines, mKeys, TIT, MEASURE_MINMAX, mapping:{xKey,sKey,cKey}, attrKeys:[...attrKeys]};
  }

  // legend/axes/filter/regression (unchanged from 8d.2) ...
  function legendSpec(pos){
    switch(pos){
      case 'top-left': return {orientation:'h',x:0,xanchor:'left',y:1.06,yanchor:'bottom'};
      case 'top-center': return {orientation:'h',x:0.5,xanchor:'center',y:1.06,yanchor:'bottom'};
      case 'top-right': return {orientation:'h',x:1,xanchor:'right',y:1.06,yanchor:'bottom'};
      case 'bottom-center': return {orientation:'h',x:0.5,xanchor:'center',y:-0.22,yanchor:'top'};
      case 'left': return {orientation:'v',x:-0.02,xanchor:'left',y:1,yanchor:'top'};
      case 'right': return {orientation:'v',x:1.02,xanchor:'left',y:1,yanchor:'top'};
      default: return {orientation:'h',x:0.5,xanchor:'center',y:1.06,yanchor:'bottom'};
    }
  }
  function marginsFor(pos, st){
    const top=68, bottom=(ctx.ROTATE?96:48), right=(st.chartType==='hist'&&st.kde?72:8);
    if(pos==='top-left'||pos==='top-center'||pos==='top-right') return {l:64,r:right,t:top,b:bottom,pad:0};
    if(pos==='bottom-center') return {l:64,r:right,t:28,b:bottom+28,pad:0};
    if(pos==='left') return {l:128,r:right,t:28,b:bottom,pad:0};
    if(pos==='right') return {l:64,r:128,t:28,b:bottom,pad:0};
    return {l:64,r:right,t:top,b:bottom,pad:0};
  }
  function xAxisSpec(){ return {type:'category',categoryorder:'array',categoryarray:ctx.dates,tickmode:'auto',tickangle:ctx.ROTATE?-90:0,tickfont:{size:ctx.ROTATE?10:12},automargin:true,title:{text:DATE_TITLE},gridcolor:THEMES[CUR_THEME].GRID,zeroline:false}; }
  function passesFilters(mk,ln,x,y,cell,st){
    if(y==null||!isFinite(y)) return false;
    if(st.exZero && y===0) return false;
    if(st.fmin!=null && y<st.fmin) return false;
    if(st.fmax!=null && y>st.fmax) return false;
    const key=`${mk}␟${ln}␟${x}␟${cell??''}␟${y}`;
    const S=ctx.store[mk][ln];
    if(st.exOut15){ if(S.tag.has(key+'␟mild')||S.tag.has(key+'␟ext')) return false; }
    else if(st.exExt3){ if(S.tag.has(key+'␟ext')) return false; }
    return true;
  }
  function filtArr(mk,ln,X,Y,T,st){ const Xo=[],Yo=[],To=[]; for(let i=0;i<Y.length;i++){ if(passesFilters(mk,ln,X[i],Y[i],T[i],st)){ Xo.push(X[i]); Yo.push(Y[i]); To.push(T[i]); } } return {X:Xo,Y:Yo,T:To}; }
  function hasActiveFilters(st){ return st.exZero||st.exOut15||st.exExt3||st.fmin!=null||st.fmax!=null; }
  function activeFiltersText(st){ const a=[]; if(st.exZero)a.push('Exclude zeros'); if(st.exOut15)a.push('Exclude outliers (1.5×IQR)'); if(st.exExt3)a.push('Exclude extremes (±3×IQR)'); if(st.fmin!=null||st.fmax!=null)a.push(`Range ${st.fmin??'−∞'}..${st.fmax??'+∞'}`); return a.join(' | ')||'None'; }
  function linreg(Y){ const idx=[],y=[]; for(let i=0;i<Y.length;i++){ const v=Y[i]; if(Number.isFinite(v)){ idx.push(i); y.push(v);} } const n=y.length; if(n<2) return {a:0,b:(y[0]||0),ok:false}; let sx=0,sy=0,sxx=0,sxy=0; for(let i=0;i<n;i++){ const X=idx[i],v=y[i]; sx+=X; sy+=v; sxx+=X*X; sxy+=X*v; } const d=(n*sxx - sx*sx)||1e-9; const a=(n*sxy - sx*sy)/d; const b=(sy - a*sx)/n; return {a,b,ok:true}; }
  function linregXY(X,Y){ const xs=[],ys=[]; for(let i=0;i<X.length;i++){ if(Number.isFinite(X[i])&&Number.isFinite(Y[i])){ xs.push(X[i]); ys.push(Y[i]); } } const n=xs.length; if(n<2) return {a:0,b:0,ok:false,r:0,r2:0}; let sx=0,sy=0,sxx=0,sxy=0,syy=0; for(let i=0;i<n;i++){ sx+=xs[i]; sy+=ys[i]; sxx+=xs[i]*xs[i]; sxy+=xs[i]*ys[i]; syy+=ys[i]*ys[i]; } const d=(n*sxx - sx*sx)||1e-9; const a=(n*sxy - sx*sy)/d; const b=(sy - a*sx)/n; const ssTot=syy - sy*sy/n, ssRes=ys.reduce((t,y,i)=>t+(y-(a*xs[i]+b))**2,0); const r2=ssTot?1-ssRes/ssTot:0; const r=Math.sign(a)*Math.sqrt(Math.max(0,Math.min(1,r2))); return {a,b,ok:true,r,r2}; }

  function tracesFor(chartId){
    const st=ctx.state[chartId]; if(!st) return [];
    const mk=st.mk; const traces=[];
    if(st.showLimitsInLegend){
      const firstX=ctx.dates[0], lastX=ctx.dates[ctx.dates.length-1];
      if(st.limitOrient==='h'){
        if(st.LSL!=null) traces.push({type:'scatter',mode:'lines',name:'LSL',x:[firstX,lastX],y:[st.LSL,st.LSL],line:{color:'#ef4444',dash:'dot',width:1.2}});
        if(st.USL!=null) traces.push({type:'scatter',mode:'lines',name:'USL',x:[firstX,lastX],y:[st.USL,st.USL],line:{color:'#ef4444',dash:'dot',width:1.2}});
        if(st.TGT!=null) traces.push({type:'scatter',mode:'lines',name:'Target',x:[firstX,lastX],y:[st.TGT,st.TGT],line:{color:'#2563eb',dash:'dot',width:1.2}});
      }else{
        if(st.LSL!=null) traces.push({type:'scatter',mode:'lines',name:'LSL',x:[st.LSL,st.LSL],y:[0,1],xref:'x',yref:'paper',line:{color:'#ef4444',dash:'dot',width:1.2}});
        if(st.USL!=null) traces.push({type:'scatter',mode:'lines',name:'USL',x:[st.USL,st.USL],y:[0,1],xref:'x',yref:'paper',line:{color:'#ef4444',dash:'dot',width:1.2}});
        if(st.TGT!=null) traces.push({type:'scatter',mode:'lines',name:'Target',x:[st.TGT,st.TGT],y:[0,1],xref:'x',yref:'paper',line:{color:'#2563eb',dash:'dot',width:1.2}});
      }
    }
    if((st.chartType==='box'||st.chartType==='violin'||st.chartType==='hist'||st.chartType==='scatter')&&st.seriesMode==='all'){
      const col='#6b7280';
      if(st.chartType==='hist'){
        const v=[]; for(const ln of ctx.lines){ const S=ctx.store[st.mk][ln]; const f=filtArr(st.mk,ln,S.allX,S.allY,S.allT,st); v.push(...f.Y); }
        const tr={type:'histogram',name:'All',x:v,marker:{color:col},opacity:0.85}; if(st.nbins>0) tr.nbinsx=st.nbins; traces.push(tr); return traces;
      }
      const ax=[],ay=[],at=[]; for(const ln of ctx.lines){ const S=ctx.store[st.mk][ln]; const f=filtArr(st.mk,ln,S.allX,S.allY,S.allT,st); ax.push(...f.X); ay.push(...f.Y); at.push(...f.T); }
      if(st.chartType==='box'){ traces.push({type:'box',name:'All',alignmentgroup:st.mk,x:ax,y:ay,boxpoints:(st.includeExt?'all':'suspectedoutliers'),jitter:(st.includeExt?0.4:0),pointpos:0,marker:{color:col},fillcolor:'rgba(107,114,128,0.12)',hovertemplate:`${DATE_TITLE}: %{x}<br>Value: %{y}<extra></extra>`}); }
      else if(st.chartType==='violin'){ const m=st.violinMode||'group'; traces.push({type:'violin',name:'All',alignmentgroup:(m==='group'?st.mk:undefined),x:ax,y:ay,points:(st.includeExt?'all':'suspectedoutliers'),marker:{color:col},hovertemplate:`${DATE_TITLE}: %{x}<br>Value: %{y}<extra></extra>`}); }
      else { traces.push({type:'scatter',mode:'markers',name:'All',x:ax,y:ay,text:at,marker:{size:st.dense?4:7,opacity:st.dense?0.5:0.9,color:col}}); }
      return traces;
    }
    for(const ln of ctx.lines){
      const col=colorFor(ln), S=ctx.store[st.mk][ln];
      const f=filtArr(st.mk,ln,S.allX,S.allY,S.allT,st);
      if(st.chartType==='box'){
        traces.push({type:'box',name:ln,legendgroup:ln,alignmentgroup:st.mk,offsetgroup:ln,x:f.X,y:f.Y,text:f.T,customdata:f.X.map(d=>S.medTXT[d]||''),boxpoints:(st.includeExt?'all':'suspectedoutliers'),hoveron:'boxes+points',jitter:(st.includeExt?0.4:0),pointpos:0,marker:{size:7,color:col},line:{width:1.2,color:col},fillcolor:'rgba(0,0,0,0.06)',hovertemplate:`%{customdata}<br>${CELL_TITLE}: %{text}<extra></extra>`});
        if(st.showMed) traces.push({type:'scatter',mode:'lines',name:`Median – ${ln}`,legendgroup:ln,showlegend:true,x:S.medX,y:S.medY,line:{width:2,color:col,dash:'dot'}});
        if(st.showReg){ const {a,b,ok}=linreg(f.Y); if(ok){ const yy=f.Y.map((_,i)=>a*i+b); traces.push({type:'scatter',mode:'lines',name:`Reg – ${ln}`,legendgroup:ln,showlegend:true,x:f.X,y:yy,line:{width:2,color:col,dash:'dash'}}); } }
        continue;
      }
      if(st.chartType==='violin'){
        const m=st.violinMode||'group';
        traces.push({type:'violin',name:ln,legendgroup:ln,alignmentgroup:(m==='group'?st.mk:undefined),offsetgroup:(m==='overlay'?ln:undefined),x:f.X,y:f.Y,text:f.T,points:(st.includeExt?'all':'suspectedoutliers'),spanmode:'hard',marker:{color:col,line:{color:'#0000001a',width:1}},hovertemplate:`${LINE_TITLE}: ${ln}<br>${DATE_TITLE}: %{x}<br>Value: %{y}<br>${CELL_TITLE}: %{text}<extra></extra>`});
        if(st.showMed) traces.push({type:'scatter',mode:'lines',name:`Median – ${ln}`,legendgroup:ln,showlegend:true,x:S.medX,y:S.medY,line:{width:2,color:col,dash:'dot'}});
        continue;
      }
      if(st.chartType==='scatter' || st.chartType==='bubble'){
        let Xvals=f.X, Xtxt=f.X, xTitle=DATE_TITLE;
        if(st.xMeasure && ctx.mKeys.includes(st.xMeasure)){
          const xv=[], xt=[]; for(let i=0;i<f.X.length;i++){ const d=f.X[i], cell=f.T[i]; const arr=(ctx._rawMap[st.xMeasure]?.[d]?.[ln])||[]; const hit=arr.find(o=>o.cell===cell); if(hit && Number.isFinite(hit.y)){ xv.push(hit.y); xt.push(d); } }
          Xvals=xv; Xtxt=xt; xTitle=ctx.TIT[st.xMeasure]||st.xMeasure;
        }
        const marker = st.chartType==='bubble' ? {size:f.Y.map(v=>Math.max(4,Math.min(22,Math.abs(v)))), color:col, opacity:st.dense?0.35:0.9, line:{width:1,color:'#00000014'}}
                                               : {size: st.dense?4:7, color:col, opacity:st.dense?0.45:0.9};
        const hoverfmt = st.xMeasure ? `${LINE_TITLE}: ${ln}<br>${xTitle}: %{x}<br>${ctx.TIT[st.mk]}: %{y}<br>${DATE_TITLE}: %{text}<extra></extra>`
                                     : `${LINE_TITLE}: ${ln}<br>${DATE_TITLE}: %{x}<br>Value: %{y}<br>${CELL_TITLE}: %{text}<extra></extra>`;
        traces.push({ type:'scatter', mode:'markers', name:ln, legendgroup:ln, x:Xvals, y:f.Y, text:Xtxt, marker, hovertemplate:hoverfmt });
        if(st.showReg){
          if(st.xMeasure){ const {a,b,ok,r}=linregXY(Xvals,f.Y); if(ok){ const xs=Xvals.slice().sort((a,b)=>a-b); const yy=xs.map(x=>a*x+b); traces.push({type:'scatter',mode:'lines',name:`Reg – ${ln} (r=${fmtN(r,2)})`,legendgroup:ln,showlegend:true,x:xs,y:yy,line:{width:2,color:col,dash:'dash'}}); } }
          else{ const {a,b,ok}=linreg(f.Y); if(ok){ const yy=f.Y.map((_,i)=>a*i+b); traces.push({type:'scatter',mode:'lines',name:`Reg – ${ln}`,legendgroup:ln,showlegend:true,x:f.X,y:yy,line:{width:2,color:col,dash:'dash'}}); } }
        }
        continue;
      }
      if(st.chartType==='line'){
        traces.push({type:'scatter',mode:'lines+markers',name:ln,legendgroup:ln,x:f.X,y:f.Y,text:f.T,marker:{size:4,color:col},line:{width:2,color:col,dash:st.lineType||'solid',shape:(st.smooth?'spline':'linear')},hovertemplate:`${LINE_TITLE}: ${ln}<br>${DATE_TITLE}: %{x}<br>Value: %{y}<br>${CELL_TITLE}: %{text}<extra></extra>`});
        if(st.showReg){ const {a,b,ok}=linreg(f.Y); if(ok){ const yy=f.Y.map((_,i)=>a*i+b); traces.push({type:'scatter',mode:'lines',name:`Reg – ${ln}`,legendgroup:ln,showlegend:true,x:f.X,y:yy,line:{width:2,color:col,dash:'dash'}}); } }
        continue;
      }
      if(st.chartType==='bar'){
        traces.push({type:'bar',name:ln,legendgroup:ln,x:f.X,y:f.Y,text:f.T,marker:{color:col,line:{width:1,color:'#11182722'}},hovertemplate:`${LINE_TITLE}: ${ln}<br>${DATE_TITLE}: %{x}<br>Value: %{y}<br>${CELL_TITLE}: %{text}<extra></extra>`});
        continue;
      }
      if(st.chartType==='hist'){
        const tr={type:'histogram',name:ln,x:f.Y,marker:{color:col},opacity:0.75}; if(st.nbins>0) tr.nbinsx=st.nbins; traces.push(tr); continue;
      }
      if(st.chartType==='gauge'){
        const v=f.Y.find(Number.isFinite) ?? 0; traces.push({type:'indicator',mode:'gauge+number',value:v,title:{text:ln},domain:{row:0,column:traces.length},gauge:{axis:{range:[Math.min(0,v), Math.max(100, v*1.2||100)]}}}); continue;
      }
    }
    return traces;
  }

  function yRangeFor(st, vals){
    const nums=vals.filter(Number.isFinite);
    if(!nums.length) return [null,null];
    if(st.yAxisScale==='auto') return [null,null];
    if(st.yAxisScale==='zero'){ const mx=Math.max(...nums); return [0, mx*1.05]; }
    if(st.yAxisScale==='log'){ const pos=nums.filter(v=>v>0); if(!pos.length) return [1,10]; const mn=Math.min(...pos); const mx=Math.max(...pos); return [mn, mx]; }
    if(st.yAxisScale==='manual'){ return [st.yMin, st.yMax]; }
    return [null,null];
  }

  function buildLayout(st, title, mk){
    const chosenPos=(st.legendPos&&st.legendPos!=='auto')?st.legendPos:LEG_POS;
    const legend=legendSpec(chosenPos), margin=marginsFor(chosenPos,st);
    const isHist=(st.chartType==='hist'), isH=(st.orient==='h');
    const xax = isHist
      ? (isH? {type:'linear', automargin:true, title:{text:'Count'}, gridcolor:THEMES[CUR_THEME].GRID, zeroline:false}
             : {type:'linear', automargin:true, title:{text:'Value'}, gridcolor:THEMES[CUR_THEME].GRID, zeroline:false})
      : (isH? {type:'linear',automargin:true, title:{text:st.xTitle||'Value',font:{size:st.axisTitleSize}},gridcolor:THEMES[CUR_THEME].GRID, zeroline:false}
             : {...xAxisSpec(), title:{text:st.xTitle||DATE_TITLE,font:{size:st.axisTitleSize}}});
    const layout={ margin, showlegend:st.showLegend, legend:Object.assign({groupclick:'togglegroup',bgcolor:'rgba(0,0,0,0)'},legend),
      xaxis:xax, yaxis:{zeroline:false,gridcolor:THEMES[CUR_THEME].GRID,title:{text:st.yTitle||mk,font:{size:st.axisTitleSize}},type:(st.yAxisScale==='log'?'log':'linear')},
      paper_bgcolor:THEMES[CUR_THEME].BG, plot_bgcolor:THEMES[CUR_THEME].PBG, font:{color:THEMES[CUR_THEME].TXT},
      title:{text:'<b>'+title+'</b>',x:0.02,xanchor:'left',y:0.98,yanchor:'top',font:{size:st.titleSize||14}},
      hovermode:'closest', hoverdistance:12, dragmode:false, uirevision:st.uirev, boxmode:'group',
      barmode:(st.chartType==='bar'||st.chartType==='hist')?st.barMode:undefined, shapes:[] };
    if(st.limitOrient==='h'){ if(st.LSL!=null) layout.shapes.push({type:'line',xref:'paper',x0:0,x1:1,y0:st.LSL,y1:st.LSL,line:{color:'#ef4444',dash:'dot',width:1}});
      if(st.USL!=null) layout.shapes.push({type:'line',xref:'paper',x0:0,x1:1,y0:st.USL,y1:st.USL,line:{color:'#ef4444',dash:'dot',width:1}});
      if(st.TGT!=null) layout.shapes.push({type:'line',xref:'paper',x0:0,x1:1,y0:st.TGT,y1:st.TGT,line:{color:'#2563eb',dash:'dot',width:1}}); }
    else { if(st.LSL!=null) layout.shapes.push({type:'line',yref:'paper',y0:0,y1:1,x0:st.LSL,x1:st.LSL,line:{color:'#ef4444',dash:'dot',width:1}});
      if(st.USL!=null) layout.shapes.push({type:'line',yref:'paper',y0:0,y1:1,x0:st.USL,x1:st.USL,line:{color:'#ef4444',dash:'dot',width:1}});
      if(st.TGT!=null) layout.shapes.push({type:'line',yref:'paper',y0:0,y1:1,x0:st.TGT,x1:st.TGT,line:{color:'#2563eb',dash:'dot',width:1}}); }
    return layout;
  }

  function defaultCfg(){ return {displayModeBar:true, displaylogo:false, responsive:true, scrollZoom:false}; }

  async function draw(chartId){
    // Stop if stale instance (after OAS refresh)
    if(ctx.GEN !== global.__OAS_PLOTLY_GEN){ OASDebug.log('lifecycle:stale-instance','',chartId); return; }
    // Stop if container is detached
    if(!containerAlive()){ OASDebug.log('lifecycle:container-missing','',chartId); return; }

    setStepMsg(chartId,'Draw…'); OASDebug.log('draw:start','',chartId);
    const gd=document.getElementById(chartId);

    if(!gd){
      const n=(ctx._retry[chartId]||0)+1; ctx._retry[chartId]=n;
      if(n<=30){ // backoff up to ~1s
        OASDebug.log('warn:draw','missing element; retry '+n, chartId);
        const delay=Math.min(1000, n*50);
        setTimeout(()=>draw(chartId), delay);
      }else{
        OASDebug.log('warn:draw:giveup','element not found after retries', chartId);
        setStepMsg(chartId,'');
      }
      return;
    }

    const st=ctx.state[chartId]; const mk=st.mk; const title=st.titleTxt||ctx.TIT[mk]||mk;

    // filter badge
    const sec=gd.parentNode; if(sec){ let b=sec.querySelector('.filter-indicator'); if(hasActiveFilters(st)){ if(!b){ b=document.createElement('div'); b.className='filter-indicator'; sec.appendChild(b);} b.textContent='Filters active'; b.title=activeFiltersText(st); } else if(b){ b.remove(); } }

    setStepMsg(chartId,'Traces…');
    let traces=[]; try{ traces=tracesFor(chartId); }catch(err){ OASDebug.log('error:traces', err&&err.stack || String(err), chartId); setStepMsg(chartId,'Traces error'); if(global.OASDebugUI) global.OASDebugUI.ensureOpen(); traces=[]; }

    if(st.orient==='h'){
      traces.forEach(t=>{
        if(t.type==='bar'||t.type==='histogram'||t.type==='box'||t.type==='violin'||t.type==='waterfall'){
          t.orientation='h';
          if(t.type==='bar'||t.type==='waterfall'){ const tmp=t.x; t.x=t.y; t.y=tmp; }
          if(t.type==='histogram'){ t.y=t.x; delete t.x; if(st.nbins>0) t.nbinsy=st.nbins; }
        }
      });
    }

    setStepMsg(chartId,'Layout…');
    let layout={}; try{ layout=buildLayout(st, title, mk); }catch(err){ OASDebug.log('error:layout', err&&err.stack || String(err), chartId); setStepMsg(chartId,'Layout error'); if(global.OASDebugUI) global.OASDebugUI.ensureOpen(); layout=buildLayout(st, title, mk); }

    const allY=[]; traces.forEach(t=>{ if(Array.isArray(t.y)) allY.push(...t.y); });
    try{ const yr=yRangeFor(st,allY); if(yr[0]!=null&&yr[1]!=null){ layout.yaxis.range=yr; layout.yaxis.autorange=false; } }catch(err){ OASDebug.log('error:y-range', err&&err.stack || String(err), chartId); setStepMsg(chartId,'Y-range error'); if(global.OASDebugUI) global.OASDebugUI.ensureOpen(); }

    if(!traces.length){ traces.push({type:'scatter',mode:'markers',x:[0],y:[0],marker:{opacity:0},hoverinfo:'skip',showlegend:false}); }

    const cfg=(global.OASPlotly && typeof global.OASPlotly.cfgFor==='function') ? global.OASPlotly.cfgFor(gd, chartId, title) : defaultCfg();

    // One more lifecycle check before rendering
    if(ctx.GEN !== global.__OAS_PLOTLY_GEN || !containerAlive()){ OASDebug.log('lifecycle:abort-before-react','',chartId); return; }

    setStepMsg(chartId,'Render…');
    try{
      await Plotly.react(gd, traces, layout, cfg);
      setStepMsg(chartId,''); OASDebug.log('draw:done','',chartId);
      ctx._retry[chartId]=0; // reset on success
    }catch(err){
      setStepMsg(chartId,'Render error'); OASDebug.log('error:react', err&&err.stack || String(err), chartId); if(global.OASDebugUI) global.OASDebugUI.ensureOpen(); return;
    }

    if(st.showStatus){ setStepMsg(chartId,'Status…'); renderStatusTable(gd,chartId); setStepMsg(chartId,''); }
    saveLocal();
  }

  function getStatusRows(chartId){
    const st=ctx.state[chartId]; const mk=st.mk; const out=[];
    for(const d of ctx.dates){
      for(const ln of ctx.lines){
        const S=ctx.store[mk]?.[ln]; if(!S) continue;
        const vals=[]; for(let i=0;i<S.allX.length;i++){ if(S.allX[i]===d){ const y=S.allY[i], c=S.allT[i]; if(passesFilters(mk,ln,d,y,c,st)) vals.push(y); } }
        const nAll=vals.length; if(!nAll){ out.push({d,ln,nAll:0,nIn:0,pctIn:0,nOut:0,pctOut:0,nExt:0,pctExt:0,min:null,q1:null,med:null,q3:null,max:null}); continue; }
        const q=quantiles(vals); const feL=q.q1-EXTREME_K*q.iqr, feH=q.q3+EXTREME_K*q.iqr; const foL=q.q1-MILD_K*q.iqr, foH=q.q3+MILD_K*q.iqr;
        let nExt=0,nOut=0,nIn=0; for(const v of vals){ if(v<feL||v>feH) nExt++; else if(v<foL||v>foH) nOut++; else nIn++; }
        out.push({d,ln,nAll,nIn,pctIn:nIn/nAll*100,nOut,pctOut:nOut/nAll*100,nExt,pctExt:nExt/nAll*100,min:q.min,q1:q.q1,med:q.med,q3:q.q3,max:q.max});
      }
    }
    out.sort((a,b)=> (a.d===b.d ? ctx.lines.indexOf(a.ln)-ctx.lines.indexOf(b.ln) : (a.d>b.d?1:-1))); return out;
  }
  function renderStatusTable(gd,chartId){
    const wrap=document.getElementById('st_'+chartId); if(!wrap) return;
    const st=ctx.state[chartId]; if(!st.showStatus){ wrap.style.display='none'; wrap.innerHTML=''; Plotly.Plots.resize(gd); return; }
    const rows=getStatusRows(chartId);
    let html='<table class="status-table"><thead><tr><th>'+DATE_TITLE+'</th><th>'+LINE_TITLE+'</th><th>n</th><th>Inliers</th><th>%In</th><th>Outliers</th><th>%Out</th><th>Extremes</th><th>%Ext</th><th>Min</th><th>Q1</th><th>Median</th><th>Q3</th><th>Max</th></tr></thead><tbody>';
    rows.forEach(r=>{ html+='<tr><td>'+r.d+'</td><td>'+r.ln+'</td><td>'+r.nAll+'</td><td class="pos-cell">'+r.nIn+'</td><td class="pos-cell">'+((r.pctIn||0).toFixed(1))+'%</td><td>'+r.nOut+'</td><td>'+((r.pctOut||0).toFixed(1))+'%</td><td class="neg-cell">'+r.nExt+'</td><td class="neg-cell">'+((r.pctExt||0).toFixed(1))+'%</td><td>'+fmtN(r.min,st.yDecimals)+'</td><td>'+fmtN(r.q1,st.yDecimals)+'</td><td>'+fmtN(r.med,st.yDecimals)+'</td><td>'+fmtN(r.q3,st.yDecimals)+'</td><td>'+fmtN(r.max,st.yDecimals)+'</td></tr>'; });
    html+='</tbody></table>'; wrap.innerHTML=html; wrap.style.display=''; Plotly.Plots.resize(gd);
  }

  function applyCols(n){ const g=container(); if(!g) return; g.classList.toggle('cols1',n===1); g.classList.toggle('cols2',n===2); g.classList.toggle('cols3',n===3); }
  function makeSection(mk,title){ const g=container(); const id='m_'+Math.random().toString(36).slice(2,9); if(!g){ OASDebug.log('error:make-section','grid missing'); return id; } const sec=document.createElement('div'); sec.className='sec'; const plot=document.createElement('div'); plot.id=id; plot.style.width='100%'; plot.style.height=DFLT_HEIGHT+'px'; const st=document.createElement('div'); st.id='st_'+id; st.style.display='none'; sec.appendChild(plot); sec.appendChild(st); g.appendChild(sec); return id; }

  function serializeAll(){
    const obj={version:ctx.version, theme:CUR_THEME, charts:{}, mapping:ctx.mapping};
    ctx.sections.forEach(id=>{ const st=ctx.state[id]; if(!st) return;
      obj.charts[st.mk]={ fmin:st.fmin,fmax:st.fmax, exZero:!!st.exZero, exOut15:!!st.exOut15, exExt3:!!st.exExt3, includeExt:!!st.includeExt, showMed:!!st.showMed, showReg:!!st.showReg, dense:!!st.dense, kde:!!st.kde, showLegend:!!st.showLegend, legendPos:st.legendPos||'auto', showStatus:!!st.showStatus, labels:st.labels||'off', chartType:st.chartType, seriesMode:st.seriesMode, barMode:st.barMode, orient:st.orient, LSL:st.LSL, USL:st.USL, TGT:st.TGT, showLimitsInLegend:!!st.showLimitsInLegend, limitOrient:st.limitOrient||'h', yAxisScale:st.yAxisScale, yMin:st.yMin, yMax:st.yMax, yDecimals:st.yDecimals, hoverDecimals:st.hoverDecimals, lineType:st.lineType, smooth:!!st.smooth, xMeasure:st.xMeasure, nbins:st.nbins||0, titleTxt:st.titleTxt, xTitle:st.xTitle, yTitle:st.yTitle, titleSize:st.titleSize, axisTitleSize:st.axisTitleSize };
    });
    return obj;
  }
  function applyAllSettings(obj){
    if(!obj||!obj.charts) return;
    CUR_THEME=(obj.theme==='dark'?'dark':'light'); document.documentElement.setAttribute('data-theme', CUR_THEME==='dark'?'dark':'light');
    if(obj.mapping){ ctx.mapping=obj.mapping; }
    ctx.sections.forEach(id=>{
      const st=ctx.state[id]; if(!st) return; const saved=obj.charts[st.mk]; if(!saved) return;
      Object.assign(st,{
        fmin:saved.fmin??null,fmax:saved.fmax??null,exZero:!!saved.exZero,exOut15:!!saved.exOut15,exExt3:!!saved.exExt3,includeExt:!!saved.includeExt,showMed:!!saved.showMed,showReg:!!saved.showReg,dense:!!saved.dense,kde:!!saved.kde,showLegend:!!saved.showLegend,legendPos:saved.legendPos||'auto',showStatus:!!saved.showStatus,labels:saved.labels||'off',
        chartType:saved.chartType||'box',seriesMode:saved.seriesMode||'perLine',barMode:saved.barMode||'group',orient:saved.orient||'v',
        LSL:(isFinite(saved.LSL)?+saved.LSL:null),USL:(isFinite(saved.USL)?+saved.USL:null),TGT:(isFinite(saved.TGT)?+saved.TGT:null),
        showLimitsInLegend:!!saved.showLimitsInLegend,limitOrient:saved.limitOrient||'h',
        yAxisScale:saved.yAxisScale||'auto',yMin:(saved.yMin??ctx.MEASURE_MINMAX[st.mk]?.min??null),yMax:(saved.yMax??ctx.MEASURE_MINMAX[st.mk]?.max??null),
        yDecimals:(isFinite(saved.yDecimals)?+saved.yDecimals:2),hoverDecimals:(isFinite(saved.hoverDecimals)?+saved.hoverDecimals:2),
        lineType:saved.lineType||'solid',smooth:!!saved.smooth,xMeasure:saved.xMeasure||null,nbins:(isFinite(saved.nbins)?+saved.nbins:0),
        titleTxt:saved.titleTxt||ctx.TIT[st.mk]||st.mk,xTitle:saved.xTitle||DATE_TITLE,yTitle:saved.yTitle||ctx.TIT[st.mk]||st.mk,titleSize:(isFinite(saved.titleSize)?+saved.titleSize:14),axisTitleSize:(isFinite(saved.axisTitleSize)?+saved.axisTitleSize:12)
      });
      st.uirev++;
    });
  }
  function saveLocal(){ if(!ENABLE_PERSISTENCE) return; try{ localStorage.setItem(LS_KEY, JSON.stringify(serializeAll())); }catch(_){ } }
  function loadLocal(){ try{ const t=localStorage.getItem(LS_KEY); if(!t) return null; return JSON.parse(t); }catch(_){ return null; } }
  function resetToSavedDefaults(){ if(ctx.defaultsPV) applyAllSettings(ctx.defaultsPV); else if(ctx.LS) applyAllSettings(ctx.LS); ctx.sections.forEach(id=>draw(id)); }

  function applyColsFromPV(){ const gpr=Math.min(3,Math.max(1,parseInt(p.dataset.gpr||'1',10)||1)); applyCols(gpr); }

  function initCore(onReady){
    try{
      OASDebug.log('init:start', ctx.version);
      if(typeof Plotly==='undefined'){ const g=container(); if(g) g.innerHTML='<div class="sec">Plotly not found</div>'; OASDebug.log('error:init','plotly missing'); if(DEBUG_ENABLED) OASDebugUI.ensureOpen(); return false; }
      const raw=loadRows(); if(!raw.length){ const g=container(); if(g) g.innerHTML='<div class="sec">No data rows.</div>'; OASDebug.log('warn:init','no rows'); return false; }

      const built=buildStore(raw, ctx.mapping);
      ctx.store=built.store; ctx.dates=built.dates; ctx.lines=built.lines; ctx.mKeys=built.mKeys; ctx.TIT=built.TIT; ctx._rawMap=buildRawMap(raw, ctx.mapping); ctx.MEASURE_MINMAX=built.MEASURE_MINMAX; ctx.attrKeys=built.attrKeys; ctx.ROTATE=ctx.dates.length>ROTATE_THRESHOLD;

      applyColsFromPV();
      ctx.sections = ctx.mKeys.map(k=>makeSection(k, ctx.TIT[k]||k));
      ctx.state={};
      ctx.sections.forEach((id,idx)=>{ const mk=ctx.mKeys[idx]; const mm=ctx.MEASURE_MINMAX[mk]||{min:null,max:null};
        ctx.state[id]={ mk, fmin:null,fmax:null, exZero:false, exOut15:false, exExt3:true, includeExt:false, showMed:false, showReg:false, dense:false, kde:false, showLegend:LEG_SHOW, legendPos:'auto', showStatus:false, labels:'off', chartType:'box', seriesMode:'perLine', barMode:'group', orient:'v', LSL:null, USL:null, TGT:null, showLimitsInLegend:false, limitOrient:'h', yAxisScale:'auto', yMin:mm.min, yMax:mm.max, yDecimals:2, hoverDecimals:2, lineType:'solid', smooth:false, xMeasure:null, nbins:0, titleTxt:ctx.TIT[mk]||mk, xTitle:DATE_TITLE, yTitle:ctx.TIT[mk]||mk, titleSize:14, axisTitleSize:12, uirev:1 };
      });

      if(ctx.defaultsPV) applyAllSettings(ctx.defaultsPV);
      ctx.LS=loadLocal(); if(ctx.LS) applyAllSettings(ctx.LS);

      (function loop(attempts){
        if(ctx.GEN !== global.__OAS_PLOTLY_GEN || !containerAlive()){ OASDebug.log('lifecycle:first-draw-abort',''); return; }
        const first=ctx.sections[0]; const el=document.getElementById(first);
        if(!first||!el){ if(attempts<10){ OASDebug.log('init:first-draw:retry', attempts); return setTimeout(()=>loop(attempts+1),20);} OASDebug.log('error:first-draw','element not found'); if(DEBUG_ENABLED) OASDebugUI.ensureOpen(); return; }
        setStepMsg(first,'Initialize…'); draw(first);
      })(0);

      if('IntersectionObserver' in window){
        const io=new IntersectionObserver(es=>{
          es.forEach(e=>{ if(e.isIntersecting){ if(ctx.GEN===global.__OAS_PLOTLY_GEN) draw(e.target.id); io.unobserve(e.target);} });
        },{root:null,rootMargin:'200px',threshold:0});
        ctx.sections.slice(1).forEach(id=>{ const el=document.getElementById(id); if(el) io.observe(el); });
      } else { ctx.sections.slice(1).forEach(id=> draw(id)); }

      let t=null; addEventListener('resize', ()=>{ if(t) return; t=setTimeout(()=>{ if(ctx.GEN!==global.__OAS_PLOTLY_GEN || !containerAlive()) return; document.querySelectorAll('#chart-grid .js-plotly-plot').forEach(el=>{ try{ Plotly.relayout(el,{autosize:true}); Plotly.Plots.resize(el);}catch(err){ OASDebug.log('error:resize', err&&err.message); } }); t=null; }, 120); });

      // expose Core API to UI
      Core.draw=draw; Core.legendSpec=legendSpec; Core.marginsFor=marginsFor; Core.xAxisSpec=xAxisSpec; Core.PV_READ_MODE=ctx.PV_READ_MODE; Core.resetToSavedDefaults=resetToSavedDefaults;
      Core.CUR_THEME=()=>CUR_THEME; Core.setTheme=(t)=>{ CUR_THEME=(t==='dark'?'dark':'light'); document.documentElement.setAttribute('data-theme', CUR_THEME==='dark'?'dark':'light'); ctx.sections.forEach(id=>draw(id)); saveLocal(); };
      Core.serializeAll=serializeAll; Core.applyAllSettings=applyAllSettings; Core.saveLocal=saveLocal;
      Core.addPlot=function(mk){ const id=makeSection(mk, ctx.TIT[mk]||mk); const mm=ctx.MEASURE_MINMAX[mk]||{min:null,max:null}; const baseId=ctx.sections[0]; ctx.state[id]=JSON.parse(JSON.stringify(ctx.state[baseId])); Object.assign(ctx.state[id],{ mk, yMin:mm.min, yMax:mm.max, xMeasure:null, titleTxt:ctx.TIT[mk]||mk, yTitle:ctx.TIT[mk]||mk, uirev:1 }); ctx.sections.push(id); draw(id); saveLocal(); return id; };
      Core.removePlot=function(id){ const el=document.getElementById(id); const stDiv=document.getElementById('st_'+id); if(el && el._fsOverlay){ const parent=el._origParent||null, ph=el._ph||null; if(ph&&ph.parentNode){ ph.parentNode.replaceChild(el, ph); el._ph=null; } else if(parent){ parent.appendChild(el); } if(el._fsOverlay) el._fsOverlay.remove(); el._fsOverlay=null; removeEventListener('resize',el._fsResize); } if(el){ const parent=el.parentNode; if(stDiv) parent.removeChild(stDiv); parent.removeChild(el); } delete ctx.state[id]; const idx=ctx.sections.indexOf(id); if(idx>=0) ctx.sections.splice(idx,1); saveLocal(); };
      if(onReady) onReady(ctx);
      OASDebug.log('init:done','');
      return true;
    }catch(err){
      OASDebug.log('error:init-core', err&&err.stack || String(err));
      const g=container(); if(g) g.innerHTML='<div class="sec" style="color:#b91c1c;font-weight:600;padding:10px">Init error: '+sanitizeUrls(err&&err.message||err)+'</div>';
      if(DEBUG_ENABLED) OASDebugUI.ensureOpen();
      return false;
    }
  }

  function rebuildWithMapping(newMapping){
    OASDebug.log('rebuild:mapping', JSON.stringify(newMapping));
    const raw=loadRows(); if(!raw.length) return;
    ctx.mapping=Object.assign({}, ctx.mapping||{xKey:'dt',seriesKey:'line',cellKey:'cell'}, newMapping||{});
    const built=buildStore(raw, ctx.mapping);
    ctx.store=built.store; ctx.dates=built.dates; ctx.lines=built.lines; ctx.mKeys=built.mKeys; ctx.TIT=built.TIT; ctx._rawMap=buildRawMap(raw, ctx.mapping); ctx.MEASURE_MINMAX=built.MEASURE_MINMAX; ctx.attrKeys=built.attrKeys; ctx.ROTATE=ctx.dates.length>ROTATE_THRESHOLD;
    ctx.sections.forEach(id=>draw(id));
  }

  const Core={ init:({onReady}={})=>initCore(onReady), rebuildWithMapping, colorFor, LINE_COLORS };
  global.OASPlotly=Core;

  window.addEventListener('error', e=>{ OASDebug.log('error:window', e?.error?.stack || e?.message || 'unknown'); if(DEBUG_ENABLED) OASDebugUI.ensureOpen(); });
  window.addEventListener('unhandledrejection', e=>{ OASDebug.log('error:promise', e?.reason?.stack || String(e?.reason) || 'rejection'); if(DEBUG_ENABLED) OASDebugUI.ensureOpen(); });

})(window);