import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
    @ApiPropertyOptional({ example: 'Abubakar Updated' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: 'newemail@example.com' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ example: 'newpassword' })
    @IsOptional()
    @MinLength(6)
    password?: string;
}
