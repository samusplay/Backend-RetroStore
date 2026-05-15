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

    // ── existente sin cambios ──
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

    // ── existente — solo agregamos el filtro isActive ──
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
            ])
            .where('product.isActive = :isActive', { isActive: true }); // ← único cambio aquí

        if (category) {
            query.andWhere('product.category = :category', { category }); // ← andWhere en lugar de where
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

    // ── existente sin cambios ──
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

    // ── NUEVOS ─────────────────────────────────────────────────────────────

    async findMyProducts(sellerId: string): Promise<Product[]> {
        return await this.repository
            .createQueryBuilder('product')
            .where('product.seller = :sellerId', { sellerId })
            .select([
                'product.id',
                'product.name',
                'product.code',
                'product.price',
                'product.category',
                'product.condition',
                'product.isActive',
                'product.imageUrl',
                'product.platform',
                'product.createdAt',
            ])
            .orderBy('product.createdAt', 'DESC')
            .getMany();
    }

    async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
        await this.repository.update(id, data);
        return await this.repository.findOneOrFail({ where: { id } });
    }

    async deactivateProduct(id: string): Promise<void> {
        await this.repository.update(id, { isActive: false });
    }

    async activateProduct(id: string): Promise<void> {
        await this.repository.update(id, { isActive: true });
    }

    async findRawById(id: string): Promise<Product | null> {
        return await this.repository.findOne({
            where: { id },
            relations: ['seller'],
        });
    }

}