    const display = document.getElementById('display');
    function appendToDisplay(char) {
      const ops = ['+','-','*','/','%'];
      let v = display.value;
      const last = v.slice(-1);

      if (char === '%') {
        if (v === '' || ops.includes(last) || last === '.') return;
        display.value = v + char;
        return;
      }
      if (char === '.') {
        const match = v.match(/(?:^|[+\-*/%])(\d*\.?\d*)$/);
        const lastNum = match ? match[1] : '';
        if (lastNum.includes('.')) return;
        if (lastNum === '') {
          display.value += '0.';
          return;
        }
      }
      if (ops.includes(char)) {
        if (v === '' && char !== '-') return; 
        if (ops.includes(last)) {
          display.value = v.slice(0,-1) + char;
          return;
        }
      }
      display.value = v + char;
      if (display.value.length > 50) {
        display.value = display.value.slice(0,50);
      }
    }
    function clearDisplay() {
      display.value = '';
    }
    function backspace() {
      display.value = display.value.slice(0, -1);
    }
    function calculateResult() {
      let expr = display.value;
      if (!expr) return;
      while (expr && /[+\-*/%.\s]$/.test(expr)) {
        expr = expr.slice(0, -1);
      }
      if (!expr) { display.value = ''; return; }
      expr = expr.replace(/(\d+(\.\d+)?)%/g, '($1/100)');
      if (!/^[0-9+\-*/().\s%]+$/.test(display.value)) {
        display.value = 'Error';
        return;
      }

      try {
        const result = Function('"use strict"; return (' + expr + ')')();
        if (result === Infinity || result === -Infinity || Number.isNaN(result)) {
          display.value = 'Error';
          return;
        }
        let out = Number.isInteger(result) ? String(result) : String(+result.toFixed(10));
        out = out.replace(/\.0+$/, ''); // remove .0
        display.value = out;
      } catch (e) {
        display.value = 'Error';
      }
    }
    window.addEventListener('keydown', (e) => {
      const allowed = '0123456789+-*/.%';
      if (allowed.includes(e.key)) {
        e.preventDefault();
        appendToDisplay(e.key);
        return;
      }
      if (e.key === 'Enter') { e.preventDefault(); calculateResult(); return; }
      if (e.key === 'Backspace') { e.preventDefault(); backspace(); return; }
      if (e.key === 'Escape') { e.preventDefault(); clearDisplay(); return; }
    });