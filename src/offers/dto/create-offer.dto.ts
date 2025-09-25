import { IsNumber, Min, IsBoolean, IsOptional } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  @Min(1)
  amount: number;

  @IsNumber()
  itemId: number;

  @IsOptional()
  @IsBoolean()
  hidden?: boolean;
}
