import { IsNotEmpty, IsString } from 'class-validator';

export class GetHistoryShortQueryDto {
  @IsString()
  @IsNotEmpty()
  symbols: string;
}

export class GetHistoryLongParamsDto {
  @IsString()
  @IsNotEmpty()
  symbol: string;
}
