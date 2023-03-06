// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { DATABASE_HOST } from '@config';
import { Handler } from 'express';
import expressWinston from 'express-winston';
import winston from 'winston';
import 'winston-mongodb';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let httpRequestLogger: undefined | Handler;
if (process.env.NODE_ENV !== 'test') {
  const mongoTransport = new winston.transports.MongoDB({
    db: DATABASE_HOST,
    collection: 'requestLogs',
    options: { useUnifiedTopology: true }
  });

  const consoleTransport = new winston.transports.Console({
    format: winston.format.combine({
      transform: (info) => {
        info.message = `${info.message}`;
        return info;
      },
      options: {
        timestamp: true,
        colorize: true
      }
    })
  });
  httpRequestLogger = expressWinston.logger({
    transports: [
      process.env.NODE_ENV === 'production' ? mongoTransport : consoleTransport
    ],
    meta: process.env.NODE_ENV === 'production' ? false : true,
    msg: '{{req.headers["user-agent"]}};{{req.method}};{{req.headers["host"]}};{{req.url}};{{req.connection.remoteAddress}};HTTP/{{req.httpVersion}};{{res.statusCode}};'
  });
}
export { httpRequestLogger };
