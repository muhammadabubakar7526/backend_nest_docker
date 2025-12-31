import { Controller, Post, Body, Get, Delete, Param, Patch, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('signup')
    @ApiOperation({ summary: 'Create a new user' })
    signup(@Body() dto: CreateUserDto) {
        return this.usersService.signup(dto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login user and get JWT token' })
    login(@Body() dto: LoginDto) {
        return this.usersService.login(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all users' })
    getAll() {
        return this.usersService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get single user by ID' })
    getOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update user by ID' })
    update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return this.usersService.updateUser(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete user by ID' })
    delete(@Param('id') id: string) {
        return this.usersService.deleteUser(id);
    }
}
