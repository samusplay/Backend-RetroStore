import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../auth/auth.repository';
import { CloudinaryUtil } from '../utils/cloudinary.util';
import { WikipediaUtil } from '../utils/wikipedia.util';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateProductResponseDto } from './dto/create-response';
import { ProductCatalogResponseDto, ProductDetailResponseDto } from './dto/product.response';
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
        const trivia = await this.wikipediaUtil.getTrivia(createProductDto.name, createProductDto.platform);

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
    async findAll(): Promise<ProductCatalogResponseDto[]> {
        return await this.productsRepository.findAllProducts();
    }

    async findById(id: string): Promise<ProductDetailResponseDto> {
        const product = await this.productsRepository.findById(id);
        if (!product) {
            throw new NotFoundException('Producto no encontrado');
        }
        return product;
    }

}