/**
 * Minimale YAML-lezer voor store.yml — bewust geen dependency.
 *
 * Ondersteunt: nesting via 2-spaties-indent, `key: value`, lijsten met `- `,
 * comments met #, quotes, true/false/null en getallen.
 * NIET ondersteund: anchors, multiline-blokken (| en >), inline {} en [].
 * Houd store.yml dus simpel — dat is voor een vragenlijst geen bezwaar.
 */

function parseScalar(raw) {
  const v = raw.trim();
  if (v === '' || v === '~' || v === 'null') return null;
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1);
  }
  return v;
}

export function parseYaml(text) {
  const lines = text
    .split('\n')
    .map((l) => (l.includes(' #') ? l.slice(0, l.indexOf(' #')) : l))
    .map((l) => (l.trimStart().startsWith('#') ? '' : l))
    .filter((l) => l.trim() !== '');

  const root = {};
  const stack = [{ indent: -1, node: root }];

  for (const line of lines) {
    const indent = line.length - line.trimStart().length;
    const body = line.trim();

    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) stack.pop();
    const parent = stack[stack.length - 1].node;

    if (body.startsWith('- ')) {
      const val = parseScalar(body.slice(2));
      if (!Array.isArray(parent.__list)) parent.__list = [];
      parent.__list.push(val);
      continue;
    }

    const idx = body.indexOf(':');
    if (idx === -1) continue;
    const key = body.slice(0, idx).trim();
    const rest = body.slice(idx + 1);

    if (rest.trim() === '') {
      const child = {};
      parent[key] = child;
      stack.push({ indent, node: child });
    } else {
      parent[key] = parseScalar(rest);
    }
  }

  // lijsten die als __list op een object staan omzetten naar echte arrays
  const fix = (node) => {
    if (node === null || typeof node !== 'object') return node;
    for (const [k, v] of Object.entries(node)) {
      if (v && typeof v === 'object') {
        if (Array.isArray(v.__list) && Object.keys(v).length === 1) node[k] = v.__list;
        else fix(v);
      }
    }
    return node;
  };
  return fix(root);
}
