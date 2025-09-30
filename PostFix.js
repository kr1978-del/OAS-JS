]</div>

<div id="oas-params" style="display:none"
  data-gpr="@{GraphsPerRow}{1}"
  data-legend-pos="@{PV_LegendPos}{top-center}"
  data-legend-show="@{PV_LegendShow}{1}"
  data-date-title="@{PV_Attribute01}{Week}"
  data-line-title="@{PV_Attribute02}{Series}"
  data-cell-title="@{PV_Attribute03}{Cell}"
  data-plot-settings="@{PV_PlotSettings}{}"
  data-default-theme="@{PV_DefaultTheme}{light}"
  data-enable-persistence="@{PV_EnablePersistence}{1}"
  data-read-mode="@{PV_ReadMode}{0}"
  data-debug="@{PV_Debug}{1}"
></div>

<link rel="stylesheet" href="/analyticsRes/custom/oas-plotly.css">
<div id="chart-grid" class="grid cols1" style="width:100%"></div>

<!-- Load order: Plotly -> Core -> UI -->
<script src="/analyticsRes/custom/plotly.min.js"></script>
<script src="/analyticsRes/custom/oas-plotly-core.js"></script>
<script src="/analyticsRes/custom/oas-plotly-ui.js"></script>

<script>
(function kick(){
  function sanitize(s){
    try{ return String(s||'').replace(/https?:\/\/[^)\s]+/g, m=>{ try{ var u=new URL(m); return u.pathname + (u.search||''); }catch(_){ return '[url]'; } }); }
    catch(_){ return String(s||''); }
  }
  function safeInit(attempt){
    attempt = attempt || 0;
    if(!window.OASPlotly || !window.OASPlotlyUI){
      if(attempt < 40){ return setTimeout(()=>safeInit(attempt+1), 50); } // ~2s
      const g=document.getElementById('chart-grid');
      if(g) g.innerHTML='<div style="padding:10px;color:#b91c1c">OAS Plotly bundles not found.</div>';
      return;
    }
    try{
      const ok = window.OASPlotly.init({ onReady:(ctx)=>window.OASPlotlyUI.wire(ctx) });
      if(!ok){
        const g=document.getElementById('chart-grid');
        if(g) g.innerHTML='<div style="padding:10px">No data rows.</div>';
      }
    }catch(err){
      const g=document.getElementById('chart-grid');
      const msg = sanitize(err && (err.stack || err.message) || err);
      if(g) g.innerHTML='<div style="padding:10px;color:#b91c1c">Init error: '+msg+'</div>';
      console.error('[OAS Init error]', msg);
      if(window.OASDebug){ window.OASDebug.log('error:init', msg); if(window.OASDebugUI) window.OASDebugUI.ensureOpen(); }
    }
  }
  if(document.readyState === 'complete' || document.readyState === 'interactive'){
    setTimeout(safeInit, 0);
  }else{
    document.addEventListener('DOMContentLoaded', ()=>safeInit(0), {once:true});
  }
})();
</script>