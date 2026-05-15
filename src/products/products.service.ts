import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../auth/auth.repository';
import { CloudinaryUtil } from '../utils/cloudinary.util';
import { WikipediaUtil } from '../utils/wikipedia.util';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateProductResponseDto } from './dto/create-response';
import { ProductCatalogResponseDto, ProductDetailResponseDto } from './dto/product.response';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductsService {
    constructor(
        private readonly productsRepository: ProductRepository,
        private readonly cloudinaryUtil: CloudinaryUtil,
        private readonly wikipediaUtil: WikipediaUtil,
        private readonly userRepository: UserRepository,
    ) { }

    async create(
        createProductDto: CreateProductDto,
        image: Express.Multer.File,
        sellerPayload: any,
    ): Promise<CreateProductResponseDto> {

        // 1. Buscamos el usuario completo en la DB
        const seller = await this.userRepository.findByEmail(sellerPayload.email);
        if (!seller) {
            throw new UnauthorizedException('Usuario no encontrado');
        }

        // 2. Subimos imagen a Cloudinary
        const imageUrl = await this.cloudinaryUtil.uploadImage(image, 'products');

        // 3. Generamos trivia
        const trivia = await this.wikipediaUtil.getTrivia(createProductDto.name, createProductDto.platform,createProductDto.category);

        // 4. Guardamos en DB con el seller completo
        const product = await this.productsRepository.createProduct(
            createProductDto,
            imageUrl,
            trivia,
            seller,
        );

        return {
            message: 'Producto creado exitosamente',
            productId: product.id,
        };
    }

    //traemos todos los productos
    async findAll(category?: string): Promise<ProductCatalogResponseDto[]> {
        return await this.productsRepository.findAllProducts(category);
    }
    async findById(id: string): Promise<ProductDetailResponseDto> {
        const product = await this.productsRepository.findById(id);
        if (!product) {
            throw new NotFoundException('Producto no encontrado');
        }
        return product;
    }

    //encontrar los productos del seller

    async findMyProducts(sellerPayload: any): Promise<any[]> {
        const seller = await this.userRepository.findByEmail(sellerPayload.email);
        if (!seller) {
            throw new UnauthorizedException('Usuario no encontrado');
        }
        return await this.productsRepository.findMyProducts(seller.id);
    }

    //actualizar los productos
     async updateProduct(
        id: string,
        dto: UpdateProductDto,
        sellerPayload: any,
    ): Promise<{ message: string }> {
        // 1. Buscamos el seller
        const seller = await this.userRepository.findByEmail(sellerPayload.email);
        if (!seller) {
            throw new UnauthorizedException('Usuario no encontrado');
        }

        // 2. Buscamos el producto con su seller
        const product = await this.productsRepository.findRawById(id);
        if (!product) {
            throw new NotFoundException('Producto no encontrado');
        }

        // 3. Validamos que sea el dueño — esto es lo más importante
        if (product.seller.id !== seller.id) {
            throw new ForbiddenException('No tienes permiso para editar este producto');
        }

        // 4. Actualizamos solo los campos que llegaron
        await this.productsRepository.updateProduct(id, dto);

        return { message: 'Producto actualizado exitosamente' };
    }

    //desactivar un producto
    async deactivateProduct(
        id: string,
        sellerPayload: any,
    ): Promise<{ message: string }> {
        const seller = await this.userRepository.findByEmail(sellerPayload.email);
        if (!seller) {
            throw new UnauthorizedException('Usuario no encontrado');
        }

        const product = await this.productsRepository.findRawById(id);
        if (!product) {
            throw new NotFoundException('Producto no encontrado');
        }

        if (product.seller.id !== seller.id) {
            throw new ForbiddenException('No tienes permiso para desactivar este producto');
        }

        if (!product.isActive) {
            throw new ForbiddenException('El producto ya está inactivo');
        }

        await this.productsRepository.deactivateProduct(id);
        return { message: 'Producto desactivado exitosamente' };
    }

    //activar un producto
    async activateProduct(
        id: string,
        sellerPayload: any,
    ): Promise<{ message: string }> {
        const seller = await this.userRepository.findByEmail(sellerPayload.email);
        if (!seller) {
            throw new UnauthorizedException('Usuario no encontrado');
        }

        const product = await this.productsRepository.findRawById(id);
        if (!product) {
            throw new NotFoundException('Producto no encontrado');
        }

        if (product.seller.id !== seller.id) {
            throw new ForbiddenException('No tienes permiso para activar este producto');
        }

        if (product.isActive) {
            throw new ForbiddenException('El producto ya está activo');
        }

        await this.productsRepository.activateProduct(id);
        return { message: 'Producto activado exitosamente' };
    }


}