import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WikipediaUtil {
    private readonly baseUrl: string;

    constructor(private readonly configService: ConfigService) {
        this.baseUrl = this.configService.get<string>(
            'WIKIPEDIA_API_URL',
            'https://en.wikipedia.org/api/rest_v1/page/summary',
        );
    }

    async getTrivia(name: string, platform: string): Promise<string> {
        try {
            // Intentamos primero solo con el nombre
            const query = encodeURIComponent(name);
            const response = await fetch(`${this.baseUrl}/${query}`);
            const data = await response.json();

            if (data.extract) {
                return data.extract;
            }

            // Si no encuentra, intentamos con "video game"
            const query2 = encodeURIComponent(`${name} video game`);
            const response2 = await fetch(`${this.baseUrl}/${query2}`);
            const data2 = await response2.json();

            return data2.extract ?? 'No se encontró trivia para este producto.';
        } catch {
            return 'No se encontró trivia para este producto.';
        }
    }
}