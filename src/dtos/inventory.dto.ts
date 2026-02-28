import { IsUUID, IsInt, Min, IsOptional, IsString, IsEnum } from "class-validator";
import { MovementType } from "../generated/prisma/client/client";
import { Type } from "class-transformer";
import { JSONSchema } from "class-validator-jsonschema";

@JSONSchema({ title: "AdjustInventoryDto" })
export class AdjustInventoryDto {

  @IsUUID()
  productId!: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
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
