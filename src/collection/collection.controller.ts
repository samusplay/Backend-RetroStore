import { Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CollectionService } from './collection.service';

// Todos los endpoints de colección requieren estar autenticado
// por eso ponemos el guard a nivel de controller y no de método
@Controller('collection')
@UseGuards(JwtGuard)
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  // GET /collection → trae la estantería del usuario autenticado
  @Get()
  async getCollection(@CurrentUser() user: any) {
    return await this.collectionService.getCollection(user.sub);
    // user.sub es el id del usuario que guardamos en el JWT payload
  }

  // PATCH /collection/add/:productId → agrega producto a la estantería
  @Patch('add/:productId')
  async addProduct(
    @CurrentUser() user: any,
    @Param('productId') productId: string,
  ) {
    return await this.collectionService.addProduct(user.sub, productId);
  }

  // DELETE /collection/remove/:productId → quita producto de la estantería
  @Delete('remove/:productId')
  async removeProduct(
    @CurrentUser() user: any,
    @Param('productId') productId: string,
  ) {
    return await this.collectionService.removeProduct(user.sub, productId);
  }
}