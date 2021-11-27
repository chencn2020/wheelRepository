"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Provides utilities for handling SSH connections
 */
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var ssh = __importStar(require("ssh2"));
/**
 * Fills out all the functionality of SFTP using fs.
 */
function fillSftpStream(accept) {
    var sftp = accept();
    var oid = 0;
    var fds = {};
    var ods = {};
    var sftpStatus = function (reqID, err) {
        var code = ssh.SFTP_STATUS_CODE.OK;
        if (err) {
            if (err.code === "EACCES") {
                code = ssh.SFTP_STATUS_CODE.PERMISSION_DENIED;
            }
            else if (err.code === "ENOENT") {
                code = ssh.SFTP_STATUS_CODE.NO_SUCH_FILE;
            }
            else {
                code = ssh.SFTP_STATUS_CODE.FAILURE;
            }
        }
        return sftp.status(reqID, code);
    };
    sftp.on("OPEN", function (reqID, filename) {
        fs.open(filename, "w", function (err, fd) {
            if (err) {
                return sftpStatus(reqID, err);
            }
            fds[fd] = true;
            var buf = Buffer.alloc(4);
            buf.writeUInt32BE(fd, 0);
            return sftp.handle(reqID, buf);
        });
    });
    sftp.on("OPENDIR", function (reqID, path) {
        var buf = Buffer.alloc(4);
        var id = oid++;
        buf.writeUInt32BE(id, 0);
        ods[id] = {
            path: path,
            read: false,
        };
        sftp.handle(reqID, buf);
    });
    sftp.on("READDIR", function (reqID, handle) {
        var od = handle.readUInt32BE(0);
        if (!ods[od]) {
            return sftp.status(reqID, ssh.SFTP_STATUS_CODE.NO_SUCH_FILE);
        }
        if (ods[od].read) {
            sftp.status(reqID, ssh.SFTP_STATUS_CODE.EOF);
            return;
        }
        return fs.readdir(ods[od].path, function (err, files) {
            if (err) {
                return sftpStatus(reqID, err);
            }
            return Promise.all(files.map(function (f) {
                return new Promise(function (resolve, reject) {
                    var fullPath = path.join(ods[od].path, f);
                    fs.stat(fullPath, function (err, stats) {
                        if (err) {
                            return reject(err);
                        }
                        resolve({
                            filename: f,
                            longname: fullPath,
                            attrs: {
                                atime: stats.atimeMs,
                                gid: stats.gid,
                                mode: stats.mode,
                                size: stats.size,
                                mtime: stats.mtimeMs,
                                uid: stats.uid,
                            },
                        });
                    });
                });
            }))
                .then(function (files) {
                sftp.name(reqID, files);
                ods[od].read = true;
            })
                .catch(function () {
                sftp.status(reqID, ssh.SFTP_STATUS_CODE.FAILURE);
            });
        });
    });
    sftp.on("WRITE", function (reqID, handle, offset, data) {
        var fd = handle.readUInt32BE(0);
        if (!fds[fd]) {
            return sftp.status(reqID, ssh.SFTP_STATUS_CODE.NO_SUCH_FILE);
        }
        return fs.write(fd, data, offset, function (err) { return sftpStatus(reqID, err); });
    });
    sftp.on("CLOSE", function (reqID, handle) {
        var fd = handle.readUInt32BE(0);
        if (!fds[fd]) {
            if (ods[fd]) {
                delete ods[fd];
                return sftp.status(reqID, ssh.SFTP_STATUS_CODE.OK);
            }
            return sftp.status(reqID, ssh.SFTP_STATUS_CODE.NO_SUCH_FILE);
        }
        return fs.close(fd, function (err) { return sftpStatus(reqID, err); });
    });
    sftp.on("STAT", function (reqID, path) {
        fs.stat(path, function (err, stats) {
            if (err) {
                return sftpStatus(reqID, err);
            }
            return sftp.attrs(reqID, {
                atime: stats.atime.getTime(),
                gid: stats.gid,
                mode: stats.mode,
                mtime: stats.mtime.getTime(),
                size: stats.size,
                uid: stats.uid,
            });
        });
    });
    sftp.on("MKDIR", function (reqID, path) {
        fs.mkdir(path, function (err) { return sftpStatus(reqID, err); });
    });
    sftp.on("LSTAT", function (reqID, path) {
        fs.lstat(path, function (err, stats) {
            if (err) {
                return sftpStatus(reqID, err);
            }
            return sftp.attrs(reqID, {
                atime: stats.atimeMs,
                gid: stats.gid,
                mode: stats.mode,
                mtime: stats.mtimeMs,
                size: stats.size,
                uid: stats.uid,
            });
        });
    });
    sftp.on("REMOVE", function (reqID, path) {
        fs.unlink(path, function (err) { return sftpStatus(reqID, err); });
    });
    sftp.on("RMDIR", function (reqID, path) {
        fs.rmdir(path, function (err) { return sftpStatus(reqID, err); });
    });
    sftp.on("REALPATH", function (reqID, path) {
        fs.realpath(path, function (pathErr, resolved) {
            if (pathErr) {
                return sftpStatus(reqID, pathErr);
            }
            fs.stat(path, function (statErr, stat) {
                if (statErr) {
                    return sftpStatus(reqID, statErr);
                }
                sftp.name(reqID, [
                    {
                        filename: resolved,
                        longname: resolved,
                        attrs: {
                            mode: stat.mode,
                            uid: stat.uid,
                            gid: stat.gid,
                            size: stat.size,
                            atime: stat.atime.getTime(),
                            mtime: stat.mtime.getTime(),
                        },
                    },
                ]);
                return;
            });
            return;
        });
    });
}
exports.fillSftpStream = fillSftpStream;
//# sourceMappingURL=sftp.js.map