/* OAS Plotly – UI (context-safe, full Settings restored, no getAttribute)
   - Stores Core context in wire(ctx) BEFORE any use
   - All actions call global Core methods (window.OASPlotly.*), not CTX.* (prevents CTX.draw errors)
   - cfgFor returns safe default until context is wired; after wire, redraws all charts to install custom modebar
   - Chart Settings button restored
*/
(function(global){
  if(!global.OASPlotly) return;

  let CTX=null;                      // internal data context (state, sections, TIT, etc.)
  const Core=()=>global.OASPlotly;   // global Core API (draw, removePlot, setTheme, etc.)
  const PVDebugOn=()=> String(CTX?.params?.dataset?.debug||'0')!=='0';

  // Icons
  const I=p=>({width:1000,height:1000,path:p});
  const gearI=I('M500 300 L560 300 L590 240 L660 260 L690 200 L740 240 L700 300 L740 360 L690 400 L660 340 L590 360 L560 300 Z M500 650 A150 150 0 1 0 500 350 A150 150 0 1 0 500 650 Z');
  const themeI=I('M700 500 A200 200 0 1 1 300 500 A200 200 0 1 0 700 500 Z M500 100 A400 400 0 1 0 900 500 A250 250 0 0 1 500 100 Z');
  const downI =I('M500 180 V720 M500 720 L420 640 M500 720 L580 640');
  const fullI =I('M140 180 L140 140 L380 140 L380 180 L180 180 L180 380 L140 380 Z M620 140 L860 140 L860 380 L820 380 L820 180 L620 180 Z');
  const filtI =I('M200 200 H800 L600 520 V800 H400 V520 Z');
  const tableI=I('M160 200 H840 V800 H160 Z M160 320 H840 M160 480 H840 M160 640 H840 M360 200 V800 M560 200 V800');
  const plusI =I('M450 150 H550 V450 H850 V550 H550 V850 H450 V550 H150 V450 H450 Z');
  const trashI=I('M350 800 H650 V300 H350 Z M300 250 H700 L660 200 H340 Z');
  const zoomI =I('M300 300 H700 V700 H300 Z M500 300 V700 M300 500 H700');
  const homeI =I('M200 600 L500 300 L800 600 V850 H650 V650 H350 V850 H200 Z');
  const infoI =I('M500 840 A60 60 0 1 1 500 720 A60 60 0 1 1 500 840 Z M450 660 H550 V300 H450 Z');
  const consoleI=I('M200 260 H800 V740 H200 Z M260 320 H740 V680 H260 Z M320 380 H680 V440 H320 Z M320 480 H560 V540 H320 Z');

  // Helpers
  function closePop(){ document.querySelectorAll('.oas-pop').forEach(el=>{ if(el._rePos){ removeEventListener('resize',el._rePos); removeEventListener('scroll',el._rePos);} el.remove(); }); }
  function placeNear(gd, pop){
    const mb=gd.querySelector('.modebar');
    const r=mb?mb.getBoundingClientRect():{left:innerWidth-160,right:innerWidth-16,bottom:54,top:10};
    const pw=pop.offsetWidth, ph=pop.offsetHeight;
    let top=r.bottom+6, left=r.right-pw;
    top=Math.max(6,Math.min(top,innerHeight-ph-6));
    left=Math.max(6,Math.min(left,innerWidth-pw-6));
    pop.style.top=top+'px'; pop.style.left=left+'px';
    const re=()=>placeNear(gd,pop); addEventListener('resize',re); addEventListener('scroll',re,{passive:true}); pop._rePos=re;
  }
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  async function copyStr(s){ try{ await navigator.clipboard.writeText(s); }catch(_){ const ta=document.createElement('textarea'); ta.value=s; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); } }

  // Menus
  function openZoomMenu(gd, chartId){
    closePop();
    const pop=document.createElement('div'); pop.className='oas-pop'; pop.style.minWidth='240px';
    pop.innerHTML=`<button class="close-x" id="zx">✕</button>
      <h4>Zoom & Axis</h4>
      <div class="row"><button data-act="yplus">Y+</button><button data-act="yminus">Y-</button><button data-act="yreset">Y reset</button></div>
      <div class="row"><button data-act="xplus">X+</button><button data-act="xminus">X-</button><button data-act="xreset">X reset</button></div>
      <div class="row"><button data-act="bothreset">Reset both</button></div>
      <div class="row" style="opacity:.7">Session-only Y range</div>
      <div class="row"><label>Y min</label><input id="zymin" type="number" style="width:90px"><label>max</label><input id="zymax" type="number" style="width:90px"></div>
      <div class="row"><button id="zapply">Apply</button></div>`;
    (gd._fsOverlay||document.body).appendChild(pop); placeNear(gd, pop);
    pop.querySelector('#zx').onclick=()=>closePop();
    pop.querySelectorAll('button[data-act]').forEach(b=>b.onclick=()=>{
      const act=b.getAttribute('data-act'); const ax=act.includes('x')?'xaxis':'yaxis'; const r=(gd._fullLayout[ax]||{}).range;
      if(/reset/.test(act)){ const o={}; if(act==='bothreset'){ o['xaxis.autorange']=true; o['yaxis.autorange']=true; } else { o[ax+'.autorange']=true; } Plotly.relayout(gd,o); return; }
      if(!r||r.length!==2) return; const mid=(r[0]+r[1])/2; const factor=(/plus/.test(act)?0.8:1.25); const span=(r[1]-r[0])*factor; const nr=[mid-span/2, mid+span/2]; const o={}; o[ax+'.range']=nr; Plotly.relayout(gd,o);
    });
    pop.querySelector('#zapply').onclick=()=>{
      const v0=parseFloat(pop.querySelector('#zymin').value), v1=parseFloat(pop.querySelector('#zymax').value);
      const o={}; if(isFinite(v0)&&isFinite(v1)){ o['yaxis.range']=[v0,v1]; o['yaxis.autorange']=false; } Plotly.relayout(gd,o);
    };
  }

  function openFilterMenu(gd, chartId){
    closePop();
    const st=CTX?.state?.[chartId];
    const pop=document.createElement('div'); pop.className='oas-pop'; pop.style.minWidth='260px';
    const multiHint = (CTX?.mKeys?.length>1 && st) ? `<div class="row" style="opacity:.7">Filtering: ${CTX.TIT[st.mk]||st.mk}</div>` : '';
    pop.innerHTML=`<button class="close-x" id="fx">✕</button>
      <h4>Filters</h4>
      ${multiHint}
      <div class="row"><label><input type="checkbox" id="f_zero" ${st?.exZero?'checked':''}> Exclude zeros</label></div>
      <div class="row"><label><input type="checkbox" id="f_out" ${st?.exOut15?'checked':''}> Exclude outliers (1.5×IQR)</label></div>
      <div class="row"><label><input type="checkbox" id="f_ext" ${st?.exExt3?'checked':''}> Exclude extreme outliers (±3×IQR)</label></div>
      <div class="row"><input id="fp-min" placeholder="Min" value="${st?.fmin??''}" style="width:110px"><input id="fp-max" placeholder="Max" value="${st?.fmax??''}" style="width:110px"></div>
      <div class="row"><button id="fp-apply">Apply</button><button id="fp-clear">Clear</button></div>
      <div class="row" style="opacity:.7">Hover the red badge to see active filters.</div>`;
    (gd._fsOverlay||document.body).appendChild(pop); placeNear(gd, pop);
    pop.querySelector('#fx').onclick=()=>closePop();
    pop.querySelector('#fp-apply').onclick=()=>{
      if(!st) return;
      st.exZero=pop.querySelector('#f_zero').checked;
      st.exOut15=pop.querySelector('#f_out').checked;
      st.exExt3=pop.querySelector('#f_ext').checked;
      const v0=parseFloat(pop.querySelector('#fp-min').value), v1=parseFloat(pop.querySelector('#fp-max').value);
      st.fmin=Number.isFinite(v0)?v0:null; st.fmax=Number.isFinite(v1)?v1:null;
      st.uirev++; Core().draw(chartId);
    };
    pop.querySelector('#fp-clear').onclick=()=>{ if(!st) return; st.fmin=st.fmax=null; st.exZero=false; st.exOut15=false; st.exExt3=false; st.uirev++; Core().draw(chartId); };
  }

  function openDownloadsMenu(gd, chartId, title){
    closePop();
    const pop=document.createElement('div'); pop.className='oas-pop';
    pop.innerHTML=`<button class="close-x" id="dx">✕</button>
      <h4>Downloads</h4>
      <div class="row"><button id="dl-img">This chart – PNG</button></div>`;
    (gd._fsOverlay||document.body).appendChild(pop); placeNear(gd, pop);
    pop.querySelector('#dx').onclick=()=>closePop();
    pop.querySelector('#dl-img').onclick=()=>{ Plotly.downloadImage(gd,{format:'png',scale:2,filename:(title||'chart').replace(/\s+/g,'_')}); closePop(); };
  }

  function openAddPlotMenu(){
    closePop();
    if(!CTX) return;
    const pop=document.createElement('div'); pop.className='oas-pop';
    const attrKeys=(CTX.attrKeys||[]).concat(['dt','line','cell']).filter((v,i,a)=>a.indexOf(v)===i);
    pop.innerHTML=`<button class="close-x" id="ax">✕</button>
      <h4>Add plot</h4>
      <div class="row"><label>Measure</label><select id="ap_m">${CTX.mKeys.map(k=>`<option value="${k}">${CTX.TIT[k]}</option>`).join('')}</select></div>
      <div class="row"><label>X column</label><select id="ap_x">${attrKeys.map(k=>`<option value="${k}" ${k==='dt'?'selected':''}>${k}</option>`).join('')}</select></div>
      <div class="row"><label>Series column</label><select id="ap_s">${attrKeys.map(k=>`<option value="${k}" ${k==='line'?'selected':''}>${k}</option>`).join('')}</select></div>
      <div class="row"><label>Cell/Tooltip</label><select id="ap_c">${attrKeys.map(k=>`<option value="${k}" ${k==='cell'?'selected':''}>${k}</option>`).join('')}</select></div>
      <div class="row"><button id="ap_add">Add</button></div>`;
    document.body.appendChild(pop);
    const firstEl=document.getElementById(CTX.sections[0]); if(firstEl) placeNear(firstEl, pop);
    pop.querySelector('#ax').onclick=()=>closePop();
    pop.querySelector('#ap_add').onclick=()=>{ 
      const mk=pop.querySelector('#ap_m').value, x=pop.querySelector('#ap_x').value, s=pop.querySelector('#ap_s').value, c=pop.querySelector('#ap_c').value;
      Core().rebuildWithMapping({xKey:x,seriesKey:s,cellKey:c});
      Core().addPlot(mk);
      closePop();
    };
  }

  function toggleFS(g){
    if(g._fsOverlay){
      const parent=g._origParent||null, ph=g._ph||null;
      if(ph && ph.parentNode){ ph.parentNode.replaceChild(g, ph); g._ph=null; } else if(parent){ parent.appendChild(g); }
      const stWrap=document.getElementById('st_'+g.id); if(stWrap && g.parentNode){ g.parentNode.insertBefore(stWrap, g.nextSibling); stWrap.style.maxHeight='unset'; stWrap.style.overflow='unset'; }
      g.style.width='100%'; g.style.height=''; g._fsOverlay.remove(); g._fsOverlay=null; removeEventListener('resize',g._fsResize);
      requestAnimationFrame(()=>{ Plotly.relayout(g,{autosize:true}); Plotly.Plots.resize(g); });
      return;
    }
    g._origParent=g.parentNode; const ph=document.createElement('div'); ph.className='pl-fs-ph'; ph.style.display='none'; g._origParent.insertBefore(ph, g); g._ph=ph;
    const ov=document.createElement('div'); ov.className='pl-fs-overlay'; document.body.appendChild(ov); ov.appendChild(g); g._fsOverlay=ov;
    const stWrap=document.getElementById('st_'+g.id); if(stWrap){ ov.appendChild(stWrap); stWrap.style.maxHeight='30vh'; stWrap.style.overflow='auto'; }
    g._fsResize=()=>{ g.style.width=innerWidth+'px'; g.style.height=innerHeight+'px'; Plotly.relayout(g,{width:innerWidth,height:innerHeight,autosize:false}); Plotly.Plots.resize(g); }; 
    addEventListener('resize',g._fsResize); g._fsResize();
    addEventListener('keydown',function esc(e){ if(e.key==='Escape'&&g._fsOverlay){ toggleFS(g); removeEventListener('keydown',esc);} });
  }

  function openInsights(gd, chartId){
    closePop();
    const st=CTX?.state?.[chartId]; const mk=st?.mk; if(!CTX||!st) return;
    let html='<button class="close-x" id="ix">✕</button><h4>Insights</h4>';
    CTX.lines.forEach(ln=>{
      const S=CTX.store[mk][ln]; if(!S) return;
      const vals=S.allY.filter(Number.isFinite); if(!vals.length) return;
      const s=vals.slice().sort((a,b)=>a-b),n=s.length, med=(n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2);
      html+=`<div class="row"><b>${ln}</b>: min ${s[0].toFixed(2)}, median ${med.toFixed(2)}, max ${s[n-1].toFixed(2)}</div>`;
    });
    const pop=document.createElement('div'); pop.className='oas-pop'; pop.style.minWidth='260px'; pop.innerHTML=html;
    (gd._fsOverlay||document.body).appendChild(pop); placeNear(gd, pop); pop.querySelector('#ix').onclick=()=>closePop();
  }

  // Full Settings panel
  function openSettingsMenu(gd, chartId){
    closePop();
    const st=CTX?.state?.[chartId]; if(!st) return;
    const pop=document.createElement('div'); pop.className='oas-pop'; pop.style.minWidth='380px';

    const CT=[['box','Boxplot'],['violin','Violin'],['hist','Histogram'],['scatter','Scatter'],['line','Line'],['bar','Bar']];

    const seriesModeCtl = `
      <div class="row"><label>Series Mode</label>
        <select id="s_ser">
          <option value="perLine" ${st.seriesMode==='perLine'?'selected':''}>Per series</option>
          <option value="all" ${st.seriesMode==='all'?'selected':''}>All (combined)</option>
        </select>
      </div>`;

    const violinCtl = (st.chartType==='violin') ? `
      <div class="row"><label>Violin mode</label>
        <select id="s_vmode">
          <option value="group" ${st.violinMode!=='overlay'?'selected':''}>Group</option>
          <option value="overlay" ${st.violinMode==='overlay'?'selected':''}>Overlay</option>
        </select>
      </div>` : '';

    const histCtl = (st.chartType==='hist') ? `
      <div class="row"><label>Bins</label><input id="s_bins" type="number" min="0" step="1" value="${st.nbins||0}" style="width:90px"><span style="opacity:.7">(0=auto)</span></div>` : '';

    const lineCtl = (st.chartType==='line') ? `
      <div class="row"><label>Line type</label>
        <select id="s_ltype">
          ${['solid','dash','dot','dashdot','longdash'].map(v=>`<option value="${v}" ${st.lineType===v?'selected':''}>${v}</option>`).join('')}
        </select>
        <label><input type="checkbox" id="s_smooth" ${st.smooth?'checked':''}> Smooth</label>
      </div>` : '';

    const orientCtl = (['bar','hist','box','violin'].includes(st.chartType)) ? `
      <div class="row"><label>Orientation</label>
        <select id="s_orient">
          <option value="v" ${st.orient==='v'?'selected':''}>Vertical</option>
          <option value="h" ${st.orient==='h'?'selected':''}>Horizontal</option>
        </select>
      </div>` : '';

    const xMeasureCtl = (st.chartType==='scatter') ? `
      <div class="row"><label>X measure</label>
        <select id="s_xm">
          <option value="">${(CTX.params.dataset.dateTitle||'Date')}</option>
          ${CTX.mKeys.map(k=>`<option value="${k}" ${st.xMeasure===k?'selected':''}>${CTX.TIT[k]}</option>`).join('')}
        </select>
      </div>` : '';

    const limitsCtl = `
      <div class="row">
        <label>LSL</label><input id="s_lsl" type="number" value="${st.LSL??''}" style="width:100px">
        <label>USL</label><input id="s_usl" type="number" value="${st.USL??''}" style="width:100px">
        <label>TGT</label><input id="s_tgt" type="number" value="${st.TGT??''}" style="width:100px">
      </div>
      <div class="row">
        <label>Limits legend</label><select id="s_limleg"><option value="0" ${!st.showLimitsInLegend?'selected':''}>Hide</option><option value="1" ${st.showLimitsInLegend?'selected':''}>Show</option></select>
        <label>Limit orientation</label><select id="s_limori"><option value="h" ${st.limitOrient!=='v'?'selected':''}>Horizontal</option><option value="v" ${st.limitOrient==='v'?'selected':''}>Vertical</option></select>
      </div>`;

    const labelsCtl = `
      <div class="row"><label>Data labels</label>
        <select id="s_labels">
          <option value="off" ${st.labels==='off'?'selected':''}>Off</option>
          <option value="extremes" ${st.labels==='extremes'?'selected':''}>Extremes</option>
          <option value="all" ${st.labels==='all'?'selected':''}>All</option>
        </select>
      </div>`;

    const legendCtl = `
      <div class="row">
        <label><input type="checkbox" id="s_legend" ${st.showLegend?'checked':''}> Legend</label>
        <select id="s_lpos">
          ${['auto','top-left','top-center','top-right','bottom-center','left','right'].map(o=>`<option value="${o}" ${((st.legendPos||'auto')===o?'selected':'')}>${o}</option>`).join('')}
        </select>
      </div>`;

    const miscCtl = `
      <div class="row">
        <label><input type="checkbox" id="s_med" ${st.showMed?'checked':''}> Median</label>
        <label><input type="checkbox" id="s_reg" ${st.showReg?'checked':''}> Regression</label>
        <label><input type="checkbox" id="s_dense" ${st.dense?'checked':''}> Dense</label>
        ${st.chartType==='hist'?'<label><input type="checkbox" id="s_kde" '+(st.kde?'checked':'')+'> Density</label>':''}
      </div>`;

    const titlesCtl=`
      <div class="row"><label>Title</label><input id="s_title" type="text" value="${(st.titleTxt||'').replace(/"/g,'&quot;')}" style="min-width:240px"></div>
      <div class="row">
        <label>X Title</label><input id="s_xt" type="text" value="${(st.xTitle||'').replace(/"/g,'&quot;')}" style="width:150px">
        <label>Y Title</label><input id="s_yt" type="text" value="${(st.yTitle||'').replace(/"/g,'&quot;')}" style="width:150px">
      </div>
      <div class="row">
        <label>Title size</label><input id="s_tsize" type="number" min="10" max="28" value="${st.titleSize}" style="width:70px">
        <label>Axis title size</label><input id="s_asize" type="number" min="8" max="20" value="${st.axisTitleSize}" style="width:70px">
      </div>`;

    const yScaleCtl = `
      <div class="row"><b>Y-axis</b></div>
      <div class="row">
        <select id="s_yscale">
          ${['auto','zero','log','manual'].map(v=>`<option value="${v}" ${st.yAxisScale===v?'selected':''}>${v}</option>`).join('')}
        </select>
        <input id="s_ymin" type="number" placeholder="Min" value="${st.yMin??''}" style="width:110px">
        <input id="s_ymax" type="number" placeholder="Max" value="${st.yMax??''}" style="width:110px">
      </div>
      <div class="row">
        <label>Y decimals</label><input id="s_ydec" type="number" min="0" max="10" value="${st.yDecimals}" style="width:70px">
        <label>Hover decimals</label><input id="s_hdec" type="number" min="0" max="10" value="${st.hoverDecimals}" style="width:70px">
      </div>`;

    // Series colors
    let colorCtl = '';
    const lines = CTX.lines || [];
    if(lines.length){
      colorCtl += '<div class="row"><b>Series colors</b></div>';
      lines.forEach(ln=>{
        const col = Core().colorFor(ln);
        colorCtl += `<div class="row"><span style="min-width:120px;display:inline-block">${ln}</span><input type="color" value="${col}" data-ln="${ln}"></div>`;
      });
    }

    const guidance = `
      <div class="row" style="opacity:.75;max-width:520px">
        Tip: Box/Violin work best with 1 measure and 1 series; Scatter supports X=Date or X=Measure; Histogram accepts bins; Violin has Group/Overlay.
      </div>`;

    pop.innerHTML=`
      <button class="close-x" id="sx">✕</button>
      <h4>Chart Properties</h4>
      <div class="row"><label>Chart type</label>
        <select id="s_ct">${CT.map(([v,l])=>`<option value="${v}" ${st.chartType===v?'selected':''}>${l}</option>`).join('')}</select>
      </div>
      ${seriesModeCtl}
      ${violinCtl}
      ${histCtl}
      ${lineCtl}
      ${orientCtl}
      ${xMeasureCtl}
      ${legendCtl}
      ${miscCtl}
      ${limitsCtl}
      ${labelsCtl}
      ${titlesCtl}
      ${yScaleCtl}
      ${colorCtl}
      ${guidance}
      <div class="row"><button id="s_apply">Apply</button><button id="s_reset">Reset</button></div>
      <div class="row"><button id="s_copy_json">Copy settings JSON</button><button id="s_copy_b64">Copy base64</button></div>
    `;
    (gd._fsOverlay||document.body).appendChild(pop); placeNear(gd, pop);
    pop.querySelector('#sx').onclick=()=>closePop();

    function refreshOptions(){ closePop(); openSettingsMenu(gd, chartId); }

    pop.querySelector('#s_ct').onchange=()=>{ st.chartType = pop.querySelector('#s_ct').value; Core().draw(chartId); refreshOptions(); };

    pop.querySelector('#s_reset').onclick=()=>{ Core().resetToSavedDefaults(); };

    pop.querySelector('#s_apply').onclick=()=>{
      st.seriesMode = pop.querySelector('#s_ser') ? pop.querySelector('#s_ser').value : st.seriesMode;
      st.violinMode = pop.querySelector('#s_vmode') ? pop.querySelector('#s_vmode').value : st.violinMode;
      st.nbins = pop.querySelector('#s_bins') ? parseInt(pop.querySelector('#s_bins').value||'0',10) : st.nbins;
      st.lineType = pop.querySelector('#s_ltype') ? pop.querySelector('#s_ltype').value : st.lineType;
      st.smooth   = pop.querySelector('#s_smooth') ? pop.querySelector('#s_smooth').checked : st.smooth;
      st.orient   = pop.querySelector('#s_orient') ? pop.querySelector('#s_orient').value : st.orient;
      st.xMeasure = pop.querySelector('#s_xm') ? (pop.querySelector('#s_xm').value||null) : st.xMeasure;
      if(st.xMeasure){ st.xTitle = (CTX.TIT[st.xMeasure] || st.xMeasure); }

      st.showLegend=pop.querySelector('#s_legend').checked;
      st.legendPos=pop.querySelector('#s_lpos').value||'auto';
      st.showMed = pop.querySelector('#s_med').checked;
      st.showReg = pop.querySelector('#s_reg').checked;
      st.dense   = pop.querySelector('#s_dense').checked;
      if(pop.querySelector('#s_kde')) st.kde = pop.querySelector('#s_kde').checked;

      st.LSL = parseFloat(pop.querySelector('#s_lsl').value); if(!isFinite(st.LSL)) st.LSL=null;
      st.USL = parseFloat(pop.querySelector('#s_usl').value); if(!isFinite(st.USL)) st.USL=null;
      st.TGT = parseFloat(pop.querySelector('#s_tgt').value); if(!isFinite(st.TGT)) st.TGT=null;
      st.showLimitsInLegend = pop.querySelector('#s_limleg').value==='1';
      st.limitOrient = pop.querySelector('#s_limori').value;

      st.labels = pop.querySelector('#s_labels').value;

      st.titleTxt = pop.querySelector('#s_title').value || st.titleTxt;
      st.xTitle   = pop.querySelector('#s_xt').value || st.xTitle;
      st.yTitle   = pop.querySelector('#s_yt').value || st.yTitle;
      st.titleSize = clamp(parseInt(pop.querySelector('#s_tsize').value,10)||14,10,28);
      st.axisTitleSize = clamp(parseInt(pop.querySelector('#s_asize').value,10)||12,8,20);

      st.yAxisScale = pop.querySelector('#s_yscale').value;
      st.yMin = parseFloat(pop.querySelector('#s_ymin').value); if(!isFinite(st.yMin)) st.yMin=null;
      st.yMax = parseFloat(pop.querySelector('#s_ymax').value); if(!isFinite(st.yMax)) st.yMax=null;
      st.yDecimals = clamp(parseInt(pop.querySelector('#s_ydec').value,10)||2,0,10);
      st.hoverDecimals = clamp(parseInt(pop.querySelector('#s_hdec').value,10)||2,0,10);

      // Colors
      pop.querySelectorAll('input[type="color"][data-ln]').forEach(i=>{
        const ln=i.getAttribute('data-ln'); if(Core() && Core().LINE_COLORS) Core().LINE_COLORS[ln]=i.value;
      });

      st.uirev++; Core().draw(chartId); // keep menu open
    };

    pop.querySelector('#s_copy_json').onclick=()=>copyStr(JSON.stringify(Core().serializeAll()));
    pop.querySelector('#s_copy_b64').onclick=()=>copyStr(btoa(JSON.stringify(Core().serializeAll())));
  }

  // Safe cfg until context is wired
  function baseCfg(){ return {displayModeBar:true, displaylogo:false, responsive:true, scrollZoom:false}; }

  function cfgFor(gd, chartId, title){
    if(!CTX || !CTX.state) return baseCfg();

    const st=CTX.state[chartId] || {};
    const zoomBtn    ={name:'Zoom',     title:'Zoom & Axis',     icon:zoomI,   click:()=>openZoomMenu(gd, chartId)};
    const settingsBtn={name:'Settings', title:'Chart settings',   icon:gearI,   click:()=>openSettingsMenu(gd, chartId)};
    const filterBtn  ={name:'Filter',   title:'Filters',          icon:filtI,   click:()=>openFilterMenu(gd, chartId)};
    const statusBtn  ={name:'Status',   title:'Toggle status',    icon:tableI,  click:()=>{ st.showStatus=!st.showStatus; Core().draw(chartId); }};
    const themeBtn   ={name:'Theme',    title:'Light/Dark',       icon:themeI,  click:()=>{ Core().setTheme(Core().CUR_THEME()==='light'?'dark':'light'); }};
    const dlBtn      ={name:'Download', title:'Downloads',        icon:downI,   click:()=>openDownloadsMenu(gd, chartId, title)};
    const fsBtn      ={name:'Fullscreen',title:'Fullscreen',      icon:fullI,   click:()=>toggleFS(gd)};
    const resetAllBtn={name:'Home',     title:'Reset defaults',   icon:homeI,   click:()=>Core().resetToSavedDefaults()};
    const insightsBtn={name:'Insights', title:'Insights',         icon:infoI,   click:()=>openInsights(gd, chartId)};
    const consoleBtn ={name:'Console',  title:'Debug Console',    icon:consoleI,click:()=>window.OASDebugUI && window.OASDebugUI.toggle()};

    const addBtn     ={name:'Add',      title:'Add plot',         icon:plusI,   click:()=>openAddPlotMenu()};
    const remBtn     ={name:'Remove',   title:'Remove this plot', icon:trashI,  click:()=>{ Core().removePlot(chartId);} };

    const addRem = CTX.PV_READ_MODE ? [] : [addBtn,remBtn,settingsBtn];
    const dbg    = PVDebugOn() ? [consoleBtn] : [];

    return {
      displayModeBar:true, displaylogo:false, responsive:true, scrollZoom:false,
      modeBarButtonsToRemove:['zoom2d','zoomIn2d','zoomOut2d','pan2d','select2d','lasso2d','autoScale2d','resetScale2d','hoverClosestCartesian','hoverCompareCartesian','toggleSpikelines','toImage'],
      modeBarButtonsToAdd:[...addRem, filterBtn, statusBtn, zoomBtn, insightsBtn, resetAllBtn, ...dbg, themeBtn, dlBtn, fsBtn]
    };
  }

  // Wire: capture context and refresh charts so our modebar replaces default
  function wire(context){
    CTX=context;
    // Re-expose cfgFor so Core uses it
    global.OASPlotly.cfgFor=(gd, chartId, title)=>cfgFor(gd, chartId, title);
    // Redraw all charts so custom modebar replaces default even if first draw already happened
    try{ (CTX.sections||[]).forEach(id=> setTimeout(()=>Core().draw(id), 0)); }catch(e){ if(window.OASDebug) window.OASDebug.log('error:ui-wire-redraw', e && e.message); }
  }

  global.OASPlotlyUI={ wire };

})(window);