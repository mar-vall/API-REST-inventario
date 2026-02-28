import { IsUUID, IsInt, Min, IsOptional, IsString, IsEnum } from "class-validator";
import { MovementType } from "../generated/prisma/client/client";

export class AdjustInventoryDto {

  @IsUUID()
  productId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class GetMovementsQueryDto {

  @IsOptional()
  @IsEnum(MovementType)
  type?: MovementType;
}
