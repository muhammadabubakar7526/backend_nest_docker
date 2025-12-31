import {
    Injectable,
    BadRequestException,
    UnauthorizedException,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
    ) { }

    // CREATE / SIGNUP
    async signup(dto: CreateUserDto) {
        const exist = await this.userModel.findOne({ email: dto.email });
        if (exist) throw new BadRequestException('Email already registered');

        const hashedPass = await bcrypt.hash(dto.password, 10);

        const user = await this.userModel.create({
            name: dto.name,
            email: dto.email,
            password: hashedPass,
        });

        return { message: 'User created successfully', user };
    }

    // LOGIN
    // LOGIN
    async login(dto: LoginDto) {
        const user = await this.userModel.findOne({ email: dto.email });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordMatch = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // JWT payload (BEST PRACTICE)
        const payload = {
            sub: user._id.toString(),
            email: user.email,
        };

        const accessToken = await this.jwtService.signAsync(payload);

        return {
            message: 'Login successful',
            access_token: accessToken,
        };
    }

    // GET ALL USERS
    async findAll() {
        return this.userModel.find().select('-password');
    }

    // GET SINGLE USER
    async findOne(id: string) {
        const user = await this.userModel.findById(id).select('-password');
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    // UPDATE USER
    async updateUser(id: string, dto: UpdateUserDto) {
        if (dto.password) {
            dto.password = await bcrypt.hash(dto.password, 10);
        }

        const updated = await this.userModel
            .findByIdAndUpdate(id, dto, { new: true })
            .select('-password');

        if (!updated) throw new NotFoundException('User not found');

        return updated;
    }

    // DELETE USER
    async deleteUser(id: string) {
        const deleted = await this.userModel.findByIdAndDelete(id);
        if (!deleted) throw new NotFoundException('User not found');
        return { message: 'User deleted successfully' };
    }
}
