]</div>

<div id="oas-params" style="display:none" 
  data-gpr="@{GraphsPerRow}{1}"
  data-attr-title="@{PV_Attribute01}{Week}"
  data-mtitles="@{PV_MeasureTitles}{}"
  data-p1="@{PV_Met01}{AE}"
  data-p2="@{PV_Met02}{CE}"
  data-p3="@{PV_Met03}{NVP}"
  data-p4="@{PV_Met04}{BR}"
></div>

<style>
  :root{ --frame-bg:#fff; --frame-bd:#e5e7eb; --icon-hover:rgba(0,0,0,.06); }
  html,body{ overflow:hidden; }
  .sec{border:1px solid var(--frame-bd); border-radius:10px; padding:10px; background:var(--frame-bg);
       display:flex; flex-direction:column; position:relative; width:100%; box-sizing:border-box; overflow:hidden;}
  .plot-wrap{flex:1 1 auto; min-height:0; overflow:hidden;}
  #multiY{width:100%; height:100%; position:relative;}
</style>

<div class="sec" id="sec-root">
  <div class="plot-wrap"><div id="multiY"></div></div>
</div>

<script src="/analyticsRes/custom/echarts.min.js"></script>
<script>
(function(){
  try{
    const host=document.getElementById('box-data');
    const gd=document.getElementById('multiY');
    const sec=document.getElementById('sec-root');
    if(!host||!gd){ return; }
    if(typeof echarts==='undefined'){ gd.innerHTML='<div style="color:#ef4444">echarts.min.js not found</div>'; return; }

    /* ---------- THEME ---------- */
    const THEMES={
      light:{BG:'#fff',PBG:'#fff',TXT:'#111827',GRID:'#e5e7eb',AX:'#6b7280',VL:'#60a5fa',LEG:'#111827',BORDER:'#e5e7eb',LBLBG:'#eef2ff'},
      dark :{BG:'#0b1220',PBG:'#0f172a',TXT:'#e5e7eb',GRID:'#293244',AX:'#9aa4b2',VL:'#60a5fa',LEG:'#e5e7eb',BORDER:'#2b3447',LBLBG:'#1f2a44'}
    };
    let CUR_THEME='light';
    const PAL=['#38bdf8','#f59e0b','#22c55e','#ef4444'];
    const LINE_TYPES=['solid','dashed','dotted','dashdot'];

    function fit(){ const r=sec.getBoundingClientRect(); sec.style.height=Math.max(360, innerHeight-r.top-8)+'px'; }
    let rT=null; addEventListener('resize', ()=>{ clearTimeout(rT); rT=setTimeout(()=>{ fit(); chart && chart.resize(); },120); });
    fit(); new ResizeObserver(()=> chart && chart.resize()).observe(sec);

    /* ---------- PARAMS ---------- */
    const p=document.getElementById('oas-params')||{dataset:{}};
    const ATTR=(p.dataset.attrTitle||'Week').trim();
    const MT=(p.dataset.mtitles||'').split('|').map(s=>s.trim()).filter(Boolean);
    const PT=[]; for(let i=1;i<=4;i++){ const v=(p.dataset['p'+i]||'').trim(); if(v) PT.push(v); }

    const toNum=s=>{ if(s==null) return null; let t=(''+s).trim(); if(!t) return null;
      t=t.replace(/[^\d.,\-]/g,''); const d=t.lastIndexOf('.'), c=t.lastIndexOf(',');
      if(d!==-1&&c!==-1) t=(c>d)? t.replace(/\./g,'').replace(',', '.'): t.replace(/,/g,'');
      else if(c!==-1) t=t.replace(',', '.'); else t=t.replace(/,/g,'');
      const v=parseFloat(t); return Number.isFinite(v)?v:null; };

    function parseRows(txt){
      if(!txt) return [];
      try{
        const cleaned = txt.replace(/,\s*]$/,']').replace(/^[^\[]*\[/,'[').replace(/\][^\]]*$/ ,']');
        return JSON.parse(cleaned);
      }catch(e){}
      const blocks=[...txt.matchAll(/\{[\s\S]*?\}/g)].map(m=>m[0]);
      const rows=[]; for(const b of blocks){ try{ rows.push(JSON.parse(b)); }catch(_){ } }
      return rows;
    }

    let raw=parseRows(host.textContent||'');
    if(!raw.length){ gd.innerHTML='<div style="color:#374151">No data rows.</div>'; return; }

    const rows=raw.map(r=>({x:String(r.dt),m1:toNum(r.m1),m2:toNum(r.m2),m3:toNum(r.m3),m4:toNum(r.m4)}));
    const keys=['m1','m2','m3','m4'].filter(k=>rows.some(r=>Number.isFinite(r[k])));
    const DEF={m1:'Measure 1',m2:'Measure 2',m3:'Measure 3',m4:'Measure 4'};
    const TIT={}; keys.forEach((k,i)=>TIT[k]=(MT[i]||PT[i]||DEF[k]));

    const X0=[...new Set(rows.map(r=>r.x))];
    const byX={}; rows.forEach(r=>{ (byX[r.x]||(byX[r.x]=[])).push(r); });
    const mean=a=>a.length?a.reduce((s,v)=>s+v,0)/a.length:null;
    const buildSeries=X=>{ const s={}; for(const k of keys){ s[k]=X.map(x=>mean((byX[x]||[]).map(r=>r[k]).filter(Number.isFinite))); } return s; };

    /* ---------- STATE ---------- */
    let chart = echarts.init(gd, null, {renderer:'canvas'});
    let split=false, showValues=false, dragPan=false, curved=true;
    let barIdx = 0; // first measure as BAR
    const hiddenX = new Set();         // right-click removed x-values
    let lastXValue = null;             // track current pointer x

    function applyTheme(){ document.documentElement.setAttribute('data-theme',CUR_THEME==='dark'?'dark':'light'); }
    function extent(arr){
      const v=arr.filter(Number.isFinite); if(!v.length) return {min:0,max:1};
      let mn=Math.min(...v), mx=Math.max(...v);
      if(mn===mx){ const pad=Math.abs(mx||1)*0.05; return {min:mn-pad, max:mx+pad}; }
      const pad=(mx-mn)*0.05; return {min:mn-pad, max:mx+pad};
    }
    function tickFmtFactory(ex){
      const span=Math.abs(ex.max-ex.min); let d=2;
      if(span<0.5) d=3; if(span<0.05) d=4; if(span<0.005) d=5;
      const big=Math.max(Math.abs(ex.max),Math.abs(ex.min));
      if(big>=50) d=Math.min(d,1); if(big>=1000) d=0;
      return (val)=> (val==null||!isFinite(val))?'':(+val).toFixed(d);
    }

    function makeXAxis(X, showLabels, gridIndex, hasBar, withTitle){
      const T=THEMES[CUR_THEME], rot=X.length>18;
      return {
        type:'category', data:X, gridIndex,
        name: withTitle ? ATTR : '', nameLocation:'middle', nameGap: 26,
        nameTextStyle:{ color:T.TXT, fontSize:14 },
        axisLabel:{ show:showLabels, rotate:rot?90:0, color:T.TXT, margin:8 },
        axisLine:{ show:showLabels, lineStyle:{ color:T.AX }},
        axisTick:{ show:showLabels, alignWithLabel:true },
        boundaryGap: !!hasBar,
        axisPointer:{ show:true }
      };
    }

    const wrapName=s=>{ if(!s||s.length<=18) return s;
      const mid=Math.floor(s.length/2); let i=s.lastIndexOf(' ',mid);
      if(i<10) i=s.indexOf(' ',mid);
      return i>0 ? s.slice(0,i)+'\n'+s.slice(i+1) : s.replace(/(.{1,20})/g,'$1\n');
    };

    const sideStep=(S, side)=>{
      const widths = keys.map((k,i)=>{
        if((i%2===0?'left':'right')!==side) return 0;
        const ex=extent(S[k]); const w=Math.max(String(ex.min).length, String(ex.max).length);
        return 8*w + 18;
      });
      return Math.max(52, Math.max(...widths));
    };

    function makeCombinedYAxes(S){
      const T=THEMES[CUR_THEME];
      const sides = keys.map((_,i)=> i%2===0 ? 'left':'right');
      const STEP_L = sideStep(S,'left');
      const STEP_R = sideStep(S,'right');
      let li=0, ri=0; const yAxis=[];
      keys.forEach((k,i)=>{
        const side=sides[i], off = side==='left' ? li++*STEP_L : ri++*STEP_R;
        const ex=extent(S[k]); const fmt=tickFmtFactory(ex);
        yAxis.push({
          type:'value',
          name: TIT[k], position: side, offset: off,
          nameLocation:'middle', nameRotate: side==='left'? 90:-90,
          nameGap: 10 + off*0.05,
          nameTextStyle:{ color:PAL[i], fontSize:14 },
          axisLine:{ show:true, lineStyle:{ color:PAL[i] } },
          axisLabel:{ color:PAL[i], align: side==='left'?'right':'left', margin:5, formatter:fmt },
          splitLine:{ show:i===0, lineStyle:{ color:T.GRID }},
          scale:true, min: ex.min, max: ex.max,
          axisPointer:{
            show:true,
            label:{ show:true, backgroundColor:T.LBLBG, color:THEMES[CUR_THEME].TXT, borderColor:T.BORDER, borderWidth:1,
                    formatter:(p)=>fmt(p.value) }
          }
        });
      });
      const grid = {
        top:56, bottom:(filtered().X.length>18?100:52),
        left:  72 + Math.max(0, li-1)*STEP_L,
        right: 72 + Math.max(0, ri-1)*STEP_R,
        containLabel:false, backgroundColor:T.PBG, show:true, borderColor:T.BORDER, borderWidth:1
      };
      return {yAxis, grid};
    }

    // line + overlay scatter (scatter shares the SAME name → legend hides both)
    function lineWithHover(i, Y, xa=0, ya=i){
      const name=TIT[keys[i]];
      const base = {
        type:'line', name, xAxisIndex:xa, yAxisIndex:ya, data:Y,
        showSymbol:true, symbol:'circle', symbolSize:8,
        smooth: curved ? 0.35 : 0,
        lineStyle:{ width:3, type: LINE_TYPES[i%LINE_TYPES.length], color:PAL[i] },
        itemStyle:{ color:PAL[i] },
        emphasis:{ focus:'none' },
        label: showValues? {show:true, position:'top', formatter:(d)=> (d.data==null?'':(+d.data).toFixed(3))}: {show:false}
      };
      const scatter = {
        type:'scatter', name,                        // << SAME name as line
        xAxisIndex:xa, yAxisIndex:ya, data:Y,
        symbol:'circle', symbolSize:8, itemStyle:{ color:PAL[i] },
        emphasis:{ scale:true, symbolSize:11, focus:'none' },
        tooltip:{ show:false }, legendHoverLink:false, silent:true, z:3
      };
      return [base, scatter];
    }
    function barTrace(i, Y, xa=0, ya=i){
      return {
        type:'bar', name:TIT[keys[i]], xAxisIndex:xa, yAxisIndex:ya, data:Y,
        barMaxWidth:28, barCategoryGap:'30%', itemStyle:{ color:PAL[i] },
        emphasis:{ focus:'none' },
        label: showValues? {show:true, position:'top', formatter:(d)=> (d.data==null?'':(+d.data).toFixed(3))}: {show:false}
      };
    }

    function filtered(){
      const X = X0.filter(x=>!hiddenX.has(String(x)));
      return {X,S:buildSeries(X)};
    }

    /* ---------- TOOLTIPS (dedupe) ---------- */
    function fmtTooltip(params, attr){
      const seen=new Set(); const rows=[];
      for(const p of params){
        if(p.seriesType==='scatter') continue;
        if(!isFinite(p.value)) continue;
        if(seen.has(p.seriesName)) continue;
        seen.add(p.seriesName);
        rows.push(`${p.marker}<b>${p.seriesName}:</b> ${(+p.value).toLocaleString(undefined,{maximumFractionDigits:4})}`);
      }
      const xi=params[0]?.axisValueLabel ?? '';
      return `<b>${attr}: ${xi}</b><br>${rows.join('<br>')}`;
    }

    const tooltipCombined=()=>({
      trigger:'axis',
      axisPointer:{ type:'cross', link:[{xAxisIndex:'all'},{yAxisIndex:'all'}],
        lineStyle:{ color:THEMES[CUR_THEME].VL, width:1 },
        label:{ show:true, backgroundColor:THEMES[CUR_THEME].LBLBG, color:THEMES[CUR_THEME].TXT, borderColor:THEMES[CUR_THEME].BORDER, borderWidth:1 } },
      formatter:(p)=>fmtTooltip(p, ATTR)
    });
    const tooltipSplit=()=>({
      trigger:'axis',
      formatter:(p)=>fmtTooltip(p, ATTR)
    });

    /* ---------- DATA ZOOMS ---------- */
    function dataZoomX(idx){ return [{ id:'dx', type:'inside', xAxisIndex: idx, filterMode:'none',
      zoomOnMouseWheel: !dragPan, moveOnMouseMove: dragPan, moveOnMouseWheel: dragPan }]; }
    function dataZoomY(idx){ return [{ id:'dy', type:'inside', yAxisIndex: idx, filterMode:'none',
      zoomOnMouseWheel: false, moveOnMouseWheel: false }]; }

    /* ---------- TOOLBOX ICONS ---------- */
    const P=s=>'path://'+s;
    const homeI  = P('M500 150 L900 450 V850 H650 V600 H350 V850 H100 V450 Z');
    const barsI  = P('M160 840 V320 H270 V840 Z M420 840 V200 H530 V840 Z M680 840 V450 H790 V840 Z');
    const splitI = P('M120 140 H880 V260 H120 Z M120 420 H880 V540 H120 Z M120 700 H880 V820 H120 Z');
    const valsI  = P('M150 230 H850 V310 H150 Z M150 470 H650 V550 H150 Z M150 710 H800 V790 H150 Z');
    const themeI = P('M700 500 A200 200 0 1 1 300 500 A200 200 0 1 0 700 500 Z M500 100 A400 400 0 1 0 900 500 A250 250 0 0 1 500 100 Z');
    const plusI  = P('M450 150 H550 V450 H850 V550 H550 V850 H450 V550 H150 V450 H450 Z'); // original +
    const minusI = P('M150 450 H850 V550 H150 Z');                                        // original −
    const handI  = P('M140 700 L140 500 Q140 430 210 430 L360 600 V260 Q360 220 400 220 Q440 220 440 260 V520 L470 540 V240 Q470 200 510 200 Q550 200 550 240 V530 L580 550 V260 Q580 220 620 220 Q660 220 660 260 V600 L760 520 Q820 520 820 580 V700 Z');
    const diskI  = P('M200 150 H800 V850 H200 Z');
    const fullI  = P('M140 180 L140 140 L380 140 L380 180 L180 180 L180 380 L140 380 Z M620 140 L860 140 L860 380 L820 380 L820 180 L620 180 Z M140 620 L180 620 L180 820 L380 820 L380 860 L140 860 Z M820 620 L860 620 L860 860 L620 860 L620 820 L820 820 Z');
    const curveI = P('M120 600 C300 300, 700 900, 880 600');

    /* Bold vertical +/- for Y All */
    const yPlusI  = P('M470 200 H530 V430 H760 V490 H530 V720 H470 V490 H240 V430 H470 Z');
    const yMinusI = P('M240 470 H760 V530 H240 Z');

    function csv(){
      const F=filtered(), X=F.X, S=F.S;
      const cols=['"'+ATTR+'"'].concat(keys.map(k=>'"'+TIT[k]+'"')); const out=[cols.join(',')];
      for(let i=0;i<X.length;i++){ const row=[`"${X[i]}"`]; for(const k of keys){ const v=S[k][i]; row.push(v==null?'':v);} out.push(row.join(',')); }
      const blob=new Blob([out.join('\n')],{type:'text/csv;charset=utf-8;'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='multi_axis.csv'; a.click();
    }

    /* ---------- X/Y Zoom helpers ---------- */
    function getAxisYBounds(i){
      const o=chart.getOption(); const ax=o.yAxis?.[i];
      if(ax && isFinite(ax.min) && isFinite(ax.max)) return [Number(ax.min), Number(ax.max)];
      const F=filtered(), S=F.S, ex=extent(S[keys[i]]);
      return [ex.min, ex.max];
    }
    function zoomX(dir){
      const o=chart.getOption();
      const dz=o.dataZoom && o.dataZoom[0] ? o.dataZoom[0] : {start:0,end:100};
      const start=Array.isArray(dz.start)?dz.start[0]:dz.start ?? 0;
      const end  =Array.isArray(dz.end)?dz.end[0]:dz.end ?? 100;
      let span=end-start;
      const minSpanPct = Math.max(2/(filtered().X.length||1)*100, 1);
      const f = (dir==='in') ? 0.8 : 1.25;
      let newSpan = Math.min(100, Math.max(minSpanPct, span*f));
      const center=(start+end)/2;
      chart.dispatchAction({ type:'dataZoom', start: Math.max(0, center - newSpan/2), end: Math.min(100, center + newSpan/2) });
    }
    function zoomY(i,dir){
      const o=chart.getOption(); const ax=o.yAxis?.[i]; if(!ax) return;
      const [a,b]=getAxisYBounds(i);
      const c=(a+b)/2, h=(b-a)/2;
      const f=(dir==='in'?0.8:1.25);
      const nh=h*f;
      ax.min = +(c-nh).toFixed(6);
      ax.max = +(c+nh).toFixed(6);
      chart.setOption(o,{notMerge:true});
    }
    function zoomAllY(dir){ for(let i=0;i<keys.length;i++) zoomY(i,dir); }

    /* ---------- OPTION BUILDERS ---------- */
    function filteredData(){ return filtered(); }

    function combinedOption(){
      const T=THEMES[CUR_THEME]; const {X,S}=filteredData();
      const {yAxis, grid} = makeCombinedYAxes(S);
      const hasBar = barIdx>=0 && barIdx<keys.length;
      const xAxis = makeXAxis(X,true,0,hasBar,true);

      const series=[]; const legendNames=keys.map(k=>TIT[k]);
      keys.forEach((k,i)=>{
        if(i===barIdx) series.push( barTrace(i,S[k]) );
        else { const [ln,sc]=lineWithHover(i,S[k]); series.push(ln,sc); }
      });

      const feature = {
        myHome:{show:true,title:'Reset',icon:homeI,onclick:()=>{ hiddenX.clear(); redraw(true); }},
        mySplit:{show:true,title:'Toggle Split/Combined',icon:splitI,onclick:()=>{ split=!split; redraw(false); }},
        myBar:{show:true,title:'Cycle Bar Series',icon:barsI,onclick:()=>{ barIdx=(barIdx+1)%(keys.length+1); if(barIdx===keys.length) barIdx=-1; redraw(false); }},
        myCurve:{show:true,title:'Curved / Straight Lines',icon:curveI,onclick:()=>{ curved=!curved; redraw(false); }},
        myVals:{show:true,title:'Toggle Data Labels',icon:valsI,onclick:()=>{ showValues=!showValues; redraw(false); }},
        myXIn:{show:true,title:'Zoom X In', icon:plusI,  onclick:()=>zoomX('in')},
        myXOut:{show:true,title:'Zoom X Out',icon:minusI, onclick:()=>zoomX('out')},
        myYAllIn:{show:true,title:'Zoom Y In (All)', icon:yPlusI,  onclick:()=>zoomAllY('in')},
        myYAllOut:{show:true,title:'Zoom Y Out (All)',icon:yMinusI, onclick:()=>zoomAllY('out')},
        myTheme:{show:true,title:'Light/Dark',icon:themeI,onclick:()=>{ CUR_THEME=(CUR_THEME==='light'?'dark':'light'); redraw(false); }},
        myCSV:{show:true,title:'Download CSV',icon:diskI,onclick:csv},
        saveAsImage:{show:true,title:'Save as image'},
        myFull:{show:true,title:'Fullscreen',icon:fullI,onclick:()=>toggleFull()}
      };

      return {
        backgroundColor:T.BG, textStyle:{color:T.TXT},
        grid, xAxis, yAxis, series,
        legend:{ data:legendNames, selected:Object.fromEntries(legendNames.map(n=>[n,true])), top:8, left:16, textStyle:{ color:T.LEG } },
        tooltip: tooltipCombined(),
        axisPointer:{
          show:true, type:'line', triggerOn:'mousemove|click',
          link:[{xAxisIndex:'all'}],
          lineStyle:{ color:T.VL, width:1 },
          label:{ show:true, backgroundColor:T.LBLBG, color:T.TXT, borderColor:T.BORDER, borderWidth:1 }
        },
        animation:true,
        dataZoom: [...dataZoomX([0]), ...dataZoomY(keys.map((_,i)=>i))],
        toolbox:{ right:8, top:8, itemSize:18, itemGap:10,
          iconStyle:{ borderColor:THEMES[CUR_THEME].AX, borderWidth:2 },
          feature }
      };
    }

    function splitOption(){
      const T=THEMES[CUR_THEME]; const {X,S}=filteredData();
      const grids=[], xAxis=[], yAxis=[], series=[];
      const H = sec.clientHeight || gd.clientHeight || 600;
      const topStart=64, gap=12;
      const paneH = Math.max(120, Math.floor((H - topStart - 56 - gap*(keys.length-1)) / keys.length));

      keys.forEach((k,i)=>{
        const top = topStart + i*(paneH+gap);
        grids.push({ top, height:paneH, left:170, right:140, containLabel:false,
          backgroundColor:T.PBG, id:'g'+i, show:true, borderColor:T.BORDER, borderWidth:1 });

        xAxis.push( makeXAxis(X, i===keys.length-1, i, barIdx===i, i===keys.length-1) );
        if(i!==keys.length-1){
          xAxis[i].axisLabel.show=false; xAxis[i].axisLine.show=false; xAxis[i].axisTick.show=false; xAxis[i].splitLine={show:false}; xAxis[i].name='';
        }
        const ex=extent(S[k]); const fmt=tickFmtFactory(ex);
        yAxis.push({
          type:'value', gridIndex:i, name: wrapName(TIT[k]), position:'left',
          nameLocation:'middle', nameRotate:90, nameGap:14,
          nameTextStyle:{ color:PAL[i], align:'center', verticalAlign:'middle', fontSize:14, lineHeight:16 },
          axisLine:{ show:true, lineStyle:{ color:PAL[i] } },
          axisLabel:{ color:PAL[i], align:'right', margin:5, formatter:fmt },
          splitLine:{ show:true, lineStyle:{ color:(i===0?T.GRID:'#0000') }},
          scale:true, min: ex.min, max: ex.max,
          axisPointer:{ show:true, label:{ show:true, backgroundColor:T.LBLBG, color:T.TXT, borderColor:T.BORDER, borderWidth:1, formatter:(p)=>fmt(p.value) } }
        });

        if(i===barIdx) series.push( barTrace(i,S[k],i,i) );
        else { const [ln,sc]=lineWithHover(i,S[k],i,i); series.push(ln,sc); }
      });

      const tb = combinedOption().toolbox;

      return {
        backgroundColor:T.BG, textStyle:{color:T.TXT},
        grid:grids, xAxis, yAxis, series,
        legend:{ data:keys.map(k=>TIT[k]), top:8, left:16, textStyle:{ color:T.LEG } },
        tooltip: tooltipSplit(),
        axisPointer:{
          show:true, type:'line', triggerOn:'mousemove|click',
          link:[{xAxisIndex:'all'}],
          lineStyle:{ color:T.VL, width:1 },
          label:{ show:true, backgroundColor:T.LBLBG, color:T.TXT, borderColor:T.BORDER, borderWidth:1 }
        },
        animation:true,
        dataZoom: [...dataZoomX(keys.map((_,i)=>i)), ...dataZoomY(keys.map((_,i)=>i))],
        toolbox: tb
      };
    }

    /* ---------- FULLSCREEN ---------- */
    function toggleFull(){
      if(gd._fs){
        if (gd._fsResize) removeEventListener('resize', gd._fsResize);
        gd._fs._host.appendChild(gd); gd._fs.remove(); gd._fs=null;
        gd.style.width=''; gd.style.height='';
        setTimeout(()=>{ fit(); redraw(false); },0);
        return;
      }
      const ov=document.createElement('div');
      ov._host=gd.parentNode;
      Object.assign(ov.style,{position:'fixed', inset:'0', background:THEMES[CUR_THEME].BG, zIndex:2147483647});
      document.body.appendChild(ov); ov.appendChild(gd); gd._fs=ov;
      function fitFS(){ gd.style.width=innerWidth+'px'; gd.style.height=innerHeight+'px'; chart && chart.resize(); }
      gd._fsResize=()=>fitFS(); addEventListener('resize', gd._fsResize); fitFS();
      addEventListener('keydown', function esc(e){ if(e.key==='Escape' && gd._fs){ toggleFull(); removeEventListener('keydown', esc);} });
    }

    /* ---------- Right-click to remove the current x category ---------- */
    function bindContextRemove(){
      gd.addEventListener('contextmenu', (ev)=>{
        ev.preventDefault();
        if(lastXValue==null) return;
        // lastXValue can be label or index; normalize to label in X0
        let label = null;
        const X = filtered().X; // current visible X list
        if(typeof lastXValue==='number'){
          const idx=Math.max(0, Math.min(X.length-1, Math.round(lastXValue)));
          label = X[idx];
        }else{
          label = String(lastXValue);
        }
        hiddenX.add(String(label));
        redraw(false);
      });
      // track current x under pointer
      chart.on('updateAxisPointer', (e)=>{
        const ax = (e.axesInfo && e.axesInfo[0]) ? e.axesInfo[0] : null;
        lastXValue = ax ? ax.value : null;
      });
    }

    function buildOption(){ return split ? splitOption() : combinedOption(); }
    function redraw(reset){
      applyTheme();
      chart.dispose();
      chart = echarts.init(gd, null, {renderer:'canvas'});
      chart.setOption( buildOption(), { notMerge:true, replaceMerge:['series','xAxis','yAxis','grid','legend','toolbox','axisPointer'] } );
      bindContextRemove();
      chart.resize();
    }

    redraw();
  }catch(err){
    const el=document.getElementById('multiY');
    if(el) el.innerHTML='<div style="color:#ef4444;font-weight:600">Runtime error: '+(err?.message||err)+'</div>';
    console.error(err);
  }
})();
</script>
