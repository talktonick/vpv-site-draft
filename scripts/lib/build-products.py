#!/usr/bin/env python3
"""
Parse the two Commerce+ Master Database CSV exports and emit
data/products.json.

Source CSVs live in ~/Downloads/Private & Shared 7/. Pass --csv-dir to
override. Both CSVs are merged on Product Name.

Per Nick: drop cost from output, drop "Common Growth Features" altogether.
"""

from __future__ import annotations
import argparse, csv, json, re, sys, unicodedata
from pathlib import Path

# CSV "Commerce+ Programs Master Database" cell -> our program id
PROGRAM_MAP = {
    'flagship reimagination':  'flagship',
    'experience revitalization': 'experience',
    'architecture migration':  'architecture',
    'lifetime value enhancement': 'ltv',
    'conversion optimization': 'conversion',
    'channel expansion':       'channel',
    'commerce care':           'preventative',  # CSV calls preventative care "Commerce care"
}

NOTION_RE = re.compile(r'^(.+?)\s*\(https?://[^)]+\)\s*$')

def strip_notion(s: str) -> str:
    """'Foo Bar (https://...)' -> 'Foo Bar'."""
    s = s.strip()
    m = NOTION_RE.match(s)
    return m.group(1).strip() if m else s

def split_multi(cell: str) -> list[str]:
    """A Notion multi-value cell separates entries with ', '. The entries
    themselves include a parenthesized URL, so naive split on ',' breaks.
    Split on '), ' and re-append the ')' we ate."""
    if not cell:
        return []
    raw = cell.strip()
    if not raw:
        return []
    if '), ' in raw:
        parts = [p if p.endswith(')') else p + ')' for p in raw.split('), ')]
        # last part already ends with ')' so the loop produced an extra one; fix
        if parts and parts[-1].endswith('))'):
            parts[-1] = parts[-1][:-1]
        return [strip_notion(p) for p in parts]
    return [strip_notion(raw)]

def slugify(s: str) -> str:
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode()
    s = re.sub(r'[^A-Za-z0-9]+', '-', s).strip('-').lower()
    return 'p-' + s

def parse_phase(block: str) -> dict | None:
    """A phase cell looks like:

        Phase Name

        Item Title
        Item body paragraph.

        Item Title
        Item body paragraph.

    Returns {"name": <phase name>, "items": [{title, body}, ...]}.
    Returns None for empty blocks.
    """
    if not block or not block.strip():
        return None
    # Normalize newlines and split on blank lines into stanzas.
    paragraphs = [p.strip() for p in re.split(r'\n\s*\n', block.strip()) if p.strip()]
    if not paragraphs:
        return None
    phase_name = paragraphs[0].splitlines()[0].strip()
    items = []
    for para in paragraphs[1:]:
        lines = [ln.rstrip() for ln in para.splitlines()]
        if not lines:
            continue
        title = lines[0].strip()
        body = ' '.join(ln.strip() for ln in lines[1:] if ln.strip())
        items.append({'title': title, 'body': body})
    return {'name': phase_name, 'items': items}

def parse_duration(cell: str) -> str:
    """'Time Investment (Weeks)' is mostly noisy. Keep first line."""
    if not cell:
        return ''
    first = cell.strip().splitlines()[0].strip()
    return first

def load_main(path: Path) -> dict[str, dict]:
    out = {}
    with open(path, newline='', encoding='utf-8-sig') as f:
        for row in csv.DictReader(f):
            name = (row.get('Product Name') or '').strip()
            if not name or name.lower().startswith('time + materials'):
                continue
            out[name] = row
    return out

def load_all(path: Path) -> dict[str, dict]:
    out = {}
    with open(path, newline='', encoding='utf-8-sig') as f:
        for row in csv.DictReader(f):
            name = (row.get('Product Name') or '').strip()
            if not name or name.lower().startswith('time + materials'):
                continue
            out[name] = row
    return out

def build(main: dict, full: dict) -> list[dict]:
    names = sorted(set(main) | set(full), key=str.lower)
    products = []
    seen_ids = set()

    for name in names:
        m = main.get(name, {})
        f = full.get(name, {})

        # Programs from CSV (use _all.csv field for richest matching, fall back to main).
        program_cell = (f.get('Commerce+ Programs Master Database')
                        or m.get('Commerce+ Programs Master Database') or '')
        program_names = split_multi(program_cell)
        program_ids = []
        for pn in program_names:
            key = pn.lower().strip()
            mapped = PROGRAM_MAP.get(key)
            if mapped:
                program_ids.append(mapped)

        # Case studies from _all.csv only
        case_cell = f.get('Connected Case Studies', '')
        cases = split_multi(case_cell)

        phases = [p for p in (parse_phase(f.get(c, '')) for c in ('Phase 1', 'Phase 2', 'Phase 3')) if p]

        pid = slugify(name)
        # Ensure uniqueness if slug collides
        base, n = pid, 1
        while pid in seen_ids:
            n += 1
            pid = f'{base}-{n}'
        seen_ids.add(pid)

        product = {
            'id': pid,
            'name': name,
            'code': (f.get('Product Code') or '').strip() or None,
            'category': (m.get('Overall Category') or f.get('Overall Category') or '').strip() or None,
            'subcategory': (m.get('Subcategory') or f.get('Subcategory') or '').strip() or None,
            'description': (m.get('Product Description') or f.get('Product Description') or '').strip(),
            'duration': parse_duration(m.get('Time Investment (Weeks)') or f.get('Time Investment (Weeks)') or ''),
            'output': (m.get('Output') or f.get('Output') or '').strip(),
            'outcome': (m.get('Outcome') or f.get('Outcome') or '').strip(),
            'programs': program_ids,
            'phases': phases,
            'caseStudies': cases,
        }
        # Drop empty fields for tidiness
        product = {k: v for k, v in product.items() if v not in (None, '', [], {})}
        products.append(product)

    return products


def main_cli():
    ap = argparse.ArgumentParser()
    home = Path.home()
    default_dir = home / 'Downloads' / 'Private & Shared 7'
    ap.add_argument('--csv-dir', type=Path, default=default_dir)
    ap.add_argument('--out', type=Path, default=Path(__file__).resolve().parents[2] / 'data' / 'products.json')
    args = ap.parse_args()

    csv_dir: Path = args.csv_dir
    if not csv_dir.is_dir():
        print(f'No such directory: {csv_dir}', file=sys.stderr); sys.exit(1)

    matches = sorted(csv_dir.glob('Commerce+ Products Master Database *.csv'))
    main_csv = next((p for p in matches if '_all' not in p.name), None)
    all_csv  = next((p for p in matches if '_all'  in p.name), None)
    if not main_csv or not all_csv:
        print(f'Expected both CSVs in {csv_dir}.\nFound: {[p.name for p in matches]}', file=sys.stderr)
        sys.exit(1)

    main_rows = load_main(main_csv)
    all_rows  = load_all(all_csv)
    products = build(main_rows, all_rows)

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(products, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    print(f'wrote {args.out} ({len(products)} products)')

if __name__ == '__main__':
    main_cli()
