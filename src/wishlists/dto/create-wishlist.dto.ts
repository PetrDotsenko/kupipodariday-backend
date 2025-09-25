import { IsString, IsOptional, IsUrl, IsArray, ArrayNotEmpty, IsNumber } from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsUrl()
  image?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  itemsId?: number[];
}
