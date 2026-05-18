#!/usr/bin/env python3
"""Tiny static server that sends no-cache headers.

Default http.server caches aggressively in the browser, which has bitten us
during iteration (modules served stale even after a reload). This server
disables both client-side caching and intermediate caching.
"""
from __future__ import annotations
import http.server, socketserver, sys
from pathlib import Path

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    root = Path(__file__).resolve().parents[2]
    import os; os.chdir(root)
    with socketserver.ThreadingTCPServer(('', port), NoCacheHandler) as httpd:
        httpd.allow_reuse_address = True
        print(f'serving {root} on :{port} (no-cache)')
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass

if __name__ == '__main__':
    main()
