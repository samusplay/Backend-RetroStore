import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

// 1. Esto soluciona el error de Cannot find namespace 'Express'
import 'multer';

@Injectable()
export class CloudinaryUtil {
  async uploadImage(file: Express.Multer.File, folder: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `retro-store/${folder}`,
          resource_type: 'image',
        },
        // 2. Le decimos a TS que result puede ser opcional (?) 
        (error: UploadApiErrorResponse | undefined, result?: UploadApiResponse) => {
          if (error) {
            return reject(error);
          }
          // Si todo salió bien, result existe de forma segura
          if (result) {
            return resolve(result.secure_url);
          }
          
          return reject(new Error('Error desconocido al subir imagen a Cloudinary'));
        },
      );

      // Usamos Readable para convertir el buffer del archivo en un stream para Cloudinary
      Readable.from(file.buffer).pipe(uploadStream);
    });
  }
}