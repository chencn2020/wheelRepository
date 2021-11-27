import * as fs from "fs-extra"
import * as net from "net"
import * as path from "path"
import * as tls from "tls"
import { Emitter } from "../common/emitter"
import { generateUuid } from "../common/util"
import { tmpdir } from "./util"

/**
 * Provides a way to proxy a TLS socket. Can be used when you need to pass a
 * socket to a child process since you can't pass the TLS socket.
 */
export class SocketProxyProvider {
  private readonly onProxyConnect = new Emitter<net.Socket>()
  private proxyPipe = path.join(tmpdir, "tls-proxy")
  private _proxyServer?: Promise<net.Server>
  private readonly proxyTimeout = 5000

  /**
   * Stop the proxy server.
   */
  public stop(): void {
    if (this._proxyServer) {
      this._proxyServer.then((server) => server.close())
      this._proxyServer = undefined
    }
  }

  /**
   * Create a socket proxy for TLS sockets. If it's not a TLS socket the
   * original socket is returned. This will spawn a proxy server on demand.
   */
  public async createProxy(socket: net.Socket): Promise<net.Socket> {
    if (!(socket instanceof tls.TLSSocket)) {
      return socket
    }

    await this.startProxyServer()

    return new Promise((resolve, reject) => {
      const id = generateUuid()
      const proxy = net.connect(this.proxyPipe)
      proxy.once("connect", () => proxy.write(id))

      const timeout = setTimeout(() => {
        listener.dispose() // eslint-disable-line @typescript-eslint/no-use-before-define
        socket.destroy()
        proxy.destroy()
        reject(new Error("TLS socket proxy timed out"))
      }, this.proxyTimeout)

      const listener = this.onProxyConnect.event((connection) => {
        connection.once("data", (data) => {
          if (!socket.destroyed && !proxy.destroyed && data.toString() === id) {
            clearTimeout(timeout)
            listener.dispose()
            ;[
              [proxy, socket],
              [socket, proxy],
            ].forEach(([a, b]) => {
              a.pipe(b)
              a.on("error", () => b.destroy())
              a.on("close", () => b.destroy())
              a.on("end", () => b.end())
            })
            resolve(connection)
          }
        })
      })
    })
  }

  private async startProxyServer(): Promise<net.Server> {
    if (!this._proxyServer) {
      this._proxyServer = this.findFreeSocketPath(this.proxyPipe)
        .then((pipe) => {
          this.proxyPipe = pipe
          return Promise.all([fs.mkdirp(tmpdir), fs.remove(this.proxyPipe)])
        })
        .then(() => {
          return new Promise((resolve) => {
            const proxyServer = net.createServer((p) => this.onProxyConnect.emit(p))
            proxyServer.once("listening", () => resolve(proxyServer))
            proxyServer.listen(this.proxyPipe)
          })
        })
    }
    return this._proxyServer
  }

  public async findFreeSocketPath(basePath: string, maxTries = 100): Promise<string> {
    const canConnect = (path: string): Promise<boolean> => {
      return new Promise((resolve) => {
        const socket = net.connect(path)
        socket.once("error", () => resolve(false))
        socket.once("connect", () => {
          socket.destroy()
          resolve(true)
        })
      })
    }

    let i = 0
    let path = basePath
    while ((await canConnect(path)) && i < maxTries) {
      path = `${basePath}-${++i}`
    }
    return path
  }
}
