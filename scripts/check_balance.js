const fs = require('fs');
const path = process.argv[2];
if(!path){console.error('Usage: node check_balance.js <file>'); process.exit(2);}
const s = fs.readFileSync(path,'utf8');
const pairs = { '(':')', '{':'}', '[':']' };
const stack = [];
for(let i=0;i<s.length;i++){
  const ch = s[i];
  if(ch==='"' || ch==="'" || ch==='`'){
    const quote = ch; i++;
    while(i<s.length){ if(s[i]==="\\") i+=2; else if(s[i]===quote) break; else i++; }
    continue;
  }
  if(ch==='/'){
    // skip comments and regex heuristics: if next is '/' or '*', skip comment
    const next = s[i+1];
    if(next==='/' ){ i+=2; while(i<s.length && s[i]!="\n") i++; continue; }
    if(next==='*'){ i+=2; while(i<s.length && !(s[i]==='*' && s[i+1]==='/')) i++; i+=1; continue; }
    // naive: skip regex if previous non-whitespace is one of (=,: or ( or [ or { or return or ? )
    // not robust but helps
    // treat as potential regex start: skip until next unescaped '/'
    // We'll attempt to detect by looking backwards
    let j=i-1; while(j>=0 && /\s/.test(s[j])) j--;
    const prev = s[j]||'';
    if('=:(,[!&|?{};'.includes(prev)){
      i++;
      while(i<s.length){ if(s[i]==='\\') i+=2; else if(s[i]==='/') break; else i++; }
      continue;
    }
  }
  if(Object.keys(pairs).includes(ch)) stack.push({ch,i});
  else if(Object.values(pairs).includes(ch)){
    const last = stack.pop();
    if(!last || pairs[last.ch]!==ch){
      console.log('Mismatch at',i, 'found', ch, 'expected', last?pairs[last.ch]:'none');
      process.exit(1);
    }
  }
}
if(stack.length>0){
  console.log('Unclosed tokens:', stack.map(x=>x.ch+"@"+x.i).join(', '));
  process.exit(1);
}
console.log('All balanced');
