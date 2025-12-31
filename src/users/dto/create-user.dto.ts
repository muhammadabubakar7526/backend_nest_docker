import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ example: 'Abubakar' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'abubakar@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: '123456' })
    @MinLength(6)
    password: string;
}
