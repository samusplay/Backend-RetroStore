import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentSchema } from './dto/create-payment.dto';
import type { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentSchema } from './dto/update-payment.dto';
import type { UpdatePaymentDto } from './dto/update-payment.dto';
import { AuthGuard } from '@nestjs/passport';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('payments')
@UseGuards(AuthGuard('jwt'))
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(CreatePaymentSchema))
  create(@Body() dto: CreatePaymentDto, @Req() req: any) {
    const buyerId: string = req.user.sub ?? req.user.id;
    return this.paymentsService.create(dto, buyerId);
  }

  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get('my-payments')
  getMyPayments(@Req() req: any) {
    const buyerId: string = req.user.sub ?? req.user.id;
    return this.paymentsService.getMyPayments(buyerId);
  }

  @Get('product/:productId')
  getByProduct(@Param('productId') productId: string) {
    return this.paymentsService.getPaymentsByProduct(productId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOneById(id);
  }

  @Patch(':id/status')
  @UsePipes(new ZodValidationPipe(UpdatePaymentSchema))
  updateStatus(@Param('id') id: string, @Body() dto: UpdatePaymentDto) {
    return this.paymentsService.updateStatus(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  cancel(@Param('id') id: string, @Req() req: any) {
    const buyerId: string = req.user.sub ?? req.user.id;
    return this.paymentsService.cancel(id, buyerId);
  }
}
