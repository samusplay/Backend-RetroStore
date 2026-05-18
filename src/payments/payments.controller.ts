import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ZodValidationPipe } from '../lib/pipes/zod-validation.pipe';
import type { CreatePaymentDto } from './dto/create-payment.dto';
import { CreatePaymentSchema } from './dto/create-payment.dto';
import type { UpdatePaymentDto } from './dto/update-payment.dto';
import { UpdatePaymentSchema } from './dto/update-payment.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
@UseGuards(JwtGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body(new ZodValidationPipe(CreatePaymentSchema)) dto: CreatePaymentDto,
    @CurrentUser() user: any,
  ) {
    const buyerId: string = user.sub;
    return this.paymentsService.create(dto, buyerId);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('SELLER')
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get('my-payments')
  getMyPayments(@CurrentUser() user: any) {
    const buyerId: string = user.sub;
    return this.paymentsService.getMyPayments(buyerId);
  }

  @Get('product/:productId')
  @UseGuards(RolesGuard)
  @Roles('SELLER')
  getByProduct(@Param('productId') productId: string) {
    return this.paymentsService.getPaymentsByProduct(productId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOneById(id);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('SELLER')
  updateStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdatePaymentSchema)) dto: UpdatePaymentDto,
  ) {
    return this.paymentsService.updateStatus(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  cancel(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    const buyerId: string = user.sub;
    return this.paymentsService.cancel(id, buyerId);
  }
}