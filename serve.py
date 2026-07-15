#!/usr/bin/env python3
"""
NOVA local server — run:  python3 serve.py
then open  http://localhost:8000/nova.html

Why this exists: the multi-threaded WASM engine (wllama) needs
SharedArrayBuffer, which browsers only enable on "cross-origin isolated"
pages. These two headers turn that on. Opening nova.html as a plain file://
still works, but the brain falls back to single-threaded mode (slower).

If you host NOVA on your own site (e.g. citizenlink.net), send the same two
headers from your web server and multithreading works there too:
    Cross-Origin-Opener-Policy: same-origin
    Cross-Origin-Embedder-Policy: credentialless
"""
import http.server, socketserver, sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
socketserver.ThreadingTCPServer.allow_reuse_address = True

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cross-Origin-Opener-Policy", "same-origin")
        # 'credentialless' lets CDN/HuggingFace downloads work without CORP headers
        self.send_header("Cross-Origin-Embedder-Policy", "credentialless")
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

Handler.extensions_map.update({".wasm": "application/wasm", ".gguf": "application/octet-stream"})

with socketserver.ThreadingTCPServer(("", PORT), Handler) as httpd:
    print(f"NOVA is served →  http://localhost:{PORT}/nova.html   (Ctrl+C to stop)")
    httpd.serve_forever()
