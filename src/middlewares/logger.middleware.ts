import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(
    request: FastifyRequest,
    response: FastifyReply['raw'],
    next: () => void,
  ) {
    this.logger.log('***********');

    request.id = uuidv4();

    const { id, ip, headers, method, body, url } = request;

    const userAgent = headers['user-agent'] || '';

    // Gets the request log
    this.logger.log({
      context: 'HTTP-Request ***',
      id,
      method,
      url,
      userAgent,
      ip,
      body: body ? body : '',
    });

    response.on('finish', () => {
      const { statusCode } = response;

      this.logger.log({
        context: 'HTTP-Response ***',
        id,
        method,
        url,
        statusCode,
        userAgent,
        ip,
      });
    });

    // Ends middleware function execution, hence allowing to move on
    if (next) {
      next();
    }
  }
}
