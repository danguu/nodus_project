import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class DocumentsService {
  private s3: S3Client;
  private bucket: string;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.s3 = new S3Client({
      region: this.config.get('AWS_REGION', 'us-east-1'),
      credentials: {
        accessKeyId: this.config.get('AWS_ACCESS_KEY_ID', ''),
        secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY', ''),
      },
    });
    this.bucket = this.config.get('S3_BUCKET', 'nodus-docs');
  }

  async getUploadUrl(caseId: string, dto: { stage: string; type: string; fileName: string }, user: any) {
    const key = `cases/${caseId}/${dto.stage}/${dto.type}/${Date.now()}-${dto.fileName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const uploadUrl = await getSignedUrl(this.s3, command, { expiresIn: 3600 });

    const existing = await this.prisma.document.findFirst({
      where: { caseId, stage: dto.stage as any, type: dto.type },
      orderBy: { version: 'desc' },
    });

    const doc = await this.prisma.document.create({
      data: {
        caseId,
        stage: dto.stage as any,
        type: dto.type,
        path: key,
        version: (existing?.version ?? 0) + 1,
        uploadedById: user.id,
      },
    });

    return { uploadUrl, document: doc };
  }

  async getCaseDocuments(caseId: string, user: any) {
    const where: any = { caseId };

    return this.prisma.document.findMany({
      where,
      include: { uploadedBy: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
