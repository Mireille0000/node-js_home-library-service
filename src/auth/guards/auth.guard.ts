import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { jwtConstants } from "../utils/constants";
import { IS_PUBLIC_KEY } from "../decorators/decorator";
import { Reflector } from "@nestjs/core";
import { Payload } from "../interfaces/payload-jwt";
import { UsersService } from "src/users/users.service";
import "dotenv/config";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService,
         private readonly reflector: Reflector){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
          
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        const jwtSecret = process.env.JWT_SECRET_KEY || 'secret123123';

        if(!token) {
            throw new HttpException('Authentication Failed: No Token In Body', HttpStatus.UNAUTHORIZED)
        }

        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {secret: jwtSecret}
            )

            request['user'] = payload;
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const authorizationHeader = request.headers.authorization;
        if (!authorizationHeader) {
            return undefined;
        }
       
        if (authorizationHeader.startsWith('Bearer ')) {
            return authorizationHeader.split(' ')[1];
        }
        return authorizationHeader;
    }
    

    // private extractTokenFromHeader(request: Request): string | undefined {
    //     console.log('Request Headers:', request.headers);
    //     const [type, token] = request.headers.authorization.split(' ') ?? []
    //     return type === "Bearer" ? token : undefined
    // }
}