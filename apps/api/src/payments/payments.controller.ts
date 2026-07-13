import { Controller, Post, Get, Body, Req, Res, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { PaymentsService } from './payments.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('checkout')
  @ApiOperation({ summary: 'Criar sessão de checkout Stripe' })
  async createCheckout(@Body() body: { orderId: string }) {
    return this.paymentsService.createCheckoutSession(body.orderId);
  }

  @Post('pix')
  @ApiOperation({ summary: 'Gerar pagamento PIX' })
  async createPix(@Body() body: { orderId: string }) {
    return this.paymentsService.createPixPayment(body.orderId);
  }

  @Post('webhook')
  @HttpCode(200)
  @ApiOperation({ summary: 'Webhook do Stripe' })
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const signature = req.headers['stripe-signature'] as string;
      const result = await this.paymentsService.handleWebhook(
        req['rawBody'],
        signature,
      );
      return res.json(result);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
