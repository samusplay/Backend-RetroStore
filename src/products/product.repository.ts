import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../auth/entities/user.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { ProductCatalogResponseDto, ProductDetailResponseDto } from "./dto/product.response";
import { Category, Condition, Product } from "./entities/product.entity";

@Injectable()
export class ProductRepository {
    constructor(
        @InjectRepository(Product)
        private readonly repository: Repository<Product>
    ) { }

    async createProduct(
        createProductDto: CreateProductDto,
        imageUrl: string,
        trivia: string,
        seller: User,
    ): Promise<Product> {
        try {
            const product = this.repository.create({
                ...createProductDto,
                condition: createProductDto.condition as Condition,
                category: createProductDto.category as Category,
                imageUrl,
                trivia,
                seller,
            });
            return await this.repository.save(product);
        } catch (error: any) {
            if (error.code === '23505') {
                throw new BadRequestException('El código del producto ya existe');
            }
            throw error;
        }
    }

    async findAllProducts(category?: string): Promise<ProductCatalogResponseDto[]> {
        const query = this.repository
            .createQueryBuilder('product')
            .leftJoin('product.seller', 'seller')
            .select([
                'product.id',
                'product.name',
                'product.imageUrl',
                'product.price',
                'seller.username',
            ]);

        // Si viene categoría la aplicamos como filtro
        if (category) {
            query.where('product.category = :category', { category });
        }

        const products = await query.getMany();

        return products.map(p => ({
            id: p.id,
            name: p.name,
            imageUrl: p.imageUrl,
            price: Number(p.price),
            seller: p.seller?.username ?? 'Vendedor desconocido',
        }));
    }
    async findById(id: string): Promise<ProductDetailResponseDto | null> {
        const product = await this.repository
            .createQueryBuilder('product')
            .leftJoin('product.seller', 'seller')
            .select([
                'product.id',
                'product.name',
                'product.description',
                'product.price',
                'product.platform',
                'product.condition',
                'product.imageUrl',
                'product.trivia',
                'seller.username',
                'product.category',
                'product.youtubeUrl',
            ])
            .where('product.id = :id', { id })
            .getOne();

        if (!product) return null;

        return {
            ...product,
            price: Number(product.price),
            seller: product.seller?.username ?? 'Vendedor desconocido',
        };
    }


}