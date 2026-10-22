#!/usr/bin/env python3
"""Synchronize the canonical Impulzia header and footer across every HTML page.
Edit components/header.html and components/footer.html, then run this script.
"""
from pathlib import Path
import re, posixpath
ROOT = Path(__file__).resolve().parent
HEADER = (ROOT / "components" / "header.html").read_text()
FOOTER = (ROOT / "components" / "footer.html").read_text()

def for_page(fragment, page):
    depth = len(page.relative_to(ROOT).parts) - 1
    prefix = "../" * depth
    fragment = fragment.replace('href="#accueil"', f'href="{prefix}index.html#accueil"')
    fragment = fragment.replace('href="#services"', f'href="{prefix}index.html#services"')
    fragment = fragment.replace('href="realisations/index.html"', f'href="{prefix}realisations/index.html"')
    fragment = fragment.replace('href="#tarifs"', f'href="{prefix}index.html#tarifs"')
    fragment = fragment.replace('href="#contact"', f'href="{prefix}index.html#contact"')
    return fragment

for page in sorted(ROOT.rglob("*.html")):
    if "components" in page.relative_to(ROOT).parts:
        continue
    html = page.read_text()
    nav = for_page(HEADER, page)
    footer = for_page(FOOTER, page)
    html = re.sub(r'<nav id="navbar"[\s\S]*?</nav>', lambda _: nav, html, count=1)
    html = re.sub(r'<footer class="footer"[\s\S]*?</footer>', lambda _: footer, html, count=1)
    page.write_text(html)
print("Header/footer synchronisés sur toutes les pages HTML.")
