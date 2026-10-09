#!/usr/bin/env python3
"""Preview the site on your own computer exactly as GitHub Pages will serve it.

Run:   python3 preview.py
Then open http://localhost:8000 in a browser. Press Ctrl+C to stop.
"""
import http.server
import os
import sys

os.chdir(os.path.dirname(os.path.abspath(__file__)))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000


class Handler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        # GitHub Pages serves /about from about.html; do the same here
        full = super().translate_path(path)
        if not os.path.exists(full) and os.path.exists(full + ".html"):
            return full + ".html"
        return full

    def send_error(self, code, message=None, explain=None):
        if code == 404 and os.path.exists("404.html"):
            body = open("404.html", "rb").read()
            self.send_response(404)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        else:
            super().send_error(code, message, explain)


print(f"Preview running at http://localhost:{PORT}  (Ctrl+C to stop)")
http.server.ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
