import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetWatchListQueryDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  symbols: string;
}

export class PostAddToWatchListDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsBoolean()
  @IsNotEmpty()
  isLargerOrEqual: boolean;
}

export class PutUpdateWatchListItemParamsDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class DeleteWatchItemParamsDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class DeleteWatchItemQueryDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  symbol: string;
}
