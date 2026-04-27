import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Category } from '../products/entities/product.entity';

@Injectable()
export class WikipediaUtil {
  private readonly baseUrl: string;

  // Mapeamos cada categoría a un término de búsqueda en español
  private readonly categoryTerms: Record<string, string> = {
    [Category.VIDEOJUEGO]: 'videojuego',
    [Category.VINILO]: 'álbum musical',
    [Category.ROPA]: 'moda',
  };

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>(
      'WIKIPEDIA_API_URL',
      'https://es.wikipedia.org/api/rest_v1/page/summary',
    );
  }

  async getTrivia(name: string, platform: string, category: string): Promise<string> {
    try {
      const term = this.categoryTerms[category] ?? '';

      // Intento 1: nombre + término específico de la categoría
      const query1 = encodeURIComponent(`${name} ${term}`);
      const response1 = await fetch(`${this.baseUrl}/${query1}`);
      const data1 = await response1.json();
      if (data1.extract) return data1.extract;

      // Intento 2: nombre + plataforma
      const query2 = encodeURIComponent(`${name} ${platform}`);
      const response2 = await fetch(`${this.baseUrl}/${query2}`);
      const data2 = await response2.json();
      if (data2.extract) return data2.extract;

      // Intento 3: solo el nombre
      const query3 = encodeURIComponent(name);
      const response3 = await fetch(`${this.baseUrl}/${query3}`);
      const data3 = await response3.json();

      return data3.extract ?? 'No se encontró trivia para este producto.';
    } catch {
      return 'No se encontró trivia para este producto.';
    }
  }
}