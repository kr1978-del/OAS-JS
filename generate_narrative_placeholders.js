#!/usr/bin/env node
/**
 * Generate OAS Narrative key->placeholder mapping from column names/order.
 *
 * Usage:
 *   node generate_narrative_placeholders.js --columns "Site Line Design,Cell ID,Cell Age (days),Latest Comb drop" --start 2
 *   node generate_narrative_placeholders.js --file columns.txt --start 2 --json
 *
 * columns.txt can be comma-separated, newline-separated, or JSON array.
 */
const fs = require('fs');

function parseArgs(argv){
  const args = { start: 1, json: false };
  for(let i=2;i<argv.length;i++){
    const a = argv[i];
    if(a==='--columns') args.columns = argv[++i];
    else if(a==='--file') args.file = argv[++i];
    else if(a==='--start') args.start = Number(argv[++i]);
    else if(a==='--json') args.json = true;
    else if(a==='--help' || a==='-h') args.help = true;
  }
  return args;
}

function loadColumns(args){
  let raw = '';
  if(args.columns) raw = args.columns;
  else if(args.file) raw = fs.readFileSync(args.file, 'utf8');
  else throw new Error('Provide --columns or --file');

  const t = raw.trim();
  if(!t) return [];
  if(t.startsWith('[')){
    const arr = JSON.parse(t);
    return arr.map(x=>String(x).trim()).filter(Boolean);
  }
  if(t.includes('\n')) return t.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
  return t.split(',').map(s=>s.trim()).filter(Boolean);
}

function generate(columns, start){
  const out = [];
  for(let i=0;i<columns.length;i++){
    const idx = start + i;
    const key = columns[i].replace(/"/g,'\\"');
    out.push(`"${key}":"@{${idx}}"`);
  }
  return out;
}

function main(){
  const args = parseArgs(process.argv);
  if(args.help){
    console.log('Usage: node generate_narrative_placeholders.js --columns "A,B,C" --start 2 [--json]');
    process.exit(0);
  }
  if(!Number.isFinite(args.start)) throw new Error('--start must be numeric');
  const cols = loadColumns(args);
  const lines = generate(cols, args.start);
  if(args.json) console.log('{\n  ' + lines.join(',\n  ') + '\n}');
  else console.log(lines.join(',\n'));
}

main();
