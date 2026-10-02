import os
import sys
import socket
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

class DualStackThreadingHTTPServer(ThreadingHTTPServer):
    address_family = socket.AF_INET6

    def server_bind(self):
        self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
        return super().server_bind()

class FastHTTPRequestHandler(SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def end_headers(self):
        # Images can cache, but CSS/JS/HTML must never cache during development
        if self.path.endswith(('.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif', '.woff2')):
            self.send_header('Cache-Control', 'public, max-age=86400')
        else:
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def log_message(self, format, *args):
        # Skip slow terminal logging for maximum throughput
        pass

if __name__ == '__main__':
    port = 8080
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    
    server_address = ('::', port)
    httpd = DualStackThreadingHTTPServer(server_address, FastHTTPRequestHandler)
    print(f"Dual-Stack IPv4/IPv6 Fast Server active on http://localhost:{port} and http://127.0.0.1:{port}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
