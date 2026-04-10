import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";


export const getCorsOptions = (frontendUrl: string): CorsOptions => ({
  origin: frontendUrl,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});

