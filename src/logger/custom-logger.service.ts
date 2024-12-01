import { ConsoleLogger, Injectable, LoggerService } from '@nestjs/common';

import { access, constants, existsSync, writeFile } from 'fs';
import { appendFile, mkdir } from 'fs/promises';
import { dirname, join, resolve } from 'path';
import { promisify } from 'util';



@Injectable()
export class CustomLoggerService extends ConsoleLogger implements LoggerService{
    constructor(context?: string) {
        super();
        this.setLogLevels(['log', 'error', 'warn']);
    }

    async writeToLogFile (entry: any) {
        const formattedEntry = `${Intl.DateTimeFormat('en-US', {
            dateStyle: 'short',
            timeStyle: 'short',
        }).format(new Date())} ${entry}\n`;
        const dirName =  resolve(process.cwd(), 'logs');
        const pathFileName = resolve(dirName, 'logFile.log');
        console.log(dirName, pathFileName);

        try {
            await mkdir(dirName,  { recursive: true })
            await appendFile(pathFileName, formattedEntry); 
        } catch (error) {
            if (error instanceof Error) console.error(error.message);
        }

    }

    async log(message: any, context?: string) {
        const entry = `${message}\t${context}`;
        await this.writeToLogFile(entry);
        super.log(message, context);
    }

    async error(message: any, context: string){
        const entry = `${message}\t${context}`;
        await this.writeToLogFile(entry);
        super.error(message, context);
    }

    warn(message: any, ...optionalParams: any[]){}

    fatal(message: any, ...optionalParams: any[]){}

    // 

    debug(message: any, ...optionalParams: any[]){}

    verbose(message: any, ...optionalParams: any[]) {
        
    }
}
