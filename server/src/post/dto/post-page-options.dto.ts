import { Category } from '../const/Category';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PageOptionsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly take?: number = 10;

  @Type(() => String)
  readonly category?: Category = Category.stories;

  @Expose()
  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
