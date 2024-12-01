import { ConsoleLogger, Injectable, LoggerService } from '@nestjs/common';

import { access, constants, writeFile } from 'fs';

@Injectable()
export class CustomLoggerService extends ConsoleLogger implements LoggerService{
    constructor(context?: string) {
        super();
        this.setLogLevels(['log', 'error', 'warn']);
        this.setContext(context);
    }

    async logToConsole (entry: any) {
        const formattedEntry = `${Intl.DateTimeFormat('en-US', {
            dateStyle: 'short',
            timeStyle: 'short',
            // timeZone: 'France/Paris',
        }).format(new Date())} ${entry}\n`;

        try {
            process.stdout.write(`${formattedEntry}`)
        } catch (error) {
            if (error instanceof Error) console.error(error.message);
        }

    }

    async log(message: any, context?: string) {
        const entry = `${context}\t${message}`;
        await this.logToConsole(entry);
        super.log(context, message);
    }

    async error(message: any, context: string){
        const entry = `${context}\t${message}`;
        await this.logToConsole(entry);
        super.log(context, message);
    }

    warn(message: any, ...optionalParams: any[]){}

    fatal(message: any, ...optionalParams: any[]){}

    // 

    debug(message: any, ...optionalParams: any[]){}

    verbose(message: any, ...optionalParams: any[]) {
        
    }
}
