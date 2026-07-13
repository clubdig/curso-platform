import { Controller, Post, Req, Res, HttpCode, RawBodyRequest } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { WebhooksService } from './webhooks.service';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private webhooksService: WebhooksService) {}

  @Post('stripe')
  @HttpCode(200)
  @ApiOperation({ summary: 'Webhook do Stripe' })
  async handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    try {
      const signature = req.headers['stripe-signature'] as string;
      const result = await this.webhooksService.handleStripeWebhook(
        req.rawBody,
        signature,
      );
      return res.json(result);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
