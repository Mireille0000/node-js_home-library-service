import { Controller, Get } from '@nestjs/common';

@Controller('user')
export class UsersController {
    // GET 
    // /user
    // /user/:id (id: uuid)
    // POST
    // /user
    //  PUT
    // /user/:id (id: uuid)
    // DELETE
    // /user/:id
    @Get()
    findAll() {
        return ["db(create db)"]
    }
}
