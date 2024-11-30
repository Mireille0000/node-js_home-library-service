import { ConsoleLogger, Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class CustomLoggerService extends ConsoleLogger implements LoggerService{
    constructor(context?: string) {
        super();
        this.setLogLevels(['log', 'error', 'warn']);
        this.setContext(context);
    }
    log(message: any, context?: string): any{
        const entry = `${context}\t${message}`;
        super.log(context, message);
    }

    fatal(message: any, ...optionalParams: any[]){}

    error(message: any, ...optionalParams: any[]){}

    warn(message: any, ...optionalParams: any[]){}

    // 

    debug(message: any, ...optionalParams: any[]){}

    verbose(message: any, ...optionalParams: any[]) {
        
    }
}
