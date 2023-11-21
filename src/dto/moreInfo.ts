import { IsNotEmpty, IsString } from 'class-validator';

export class GetMoreInfoParamsDto {
  @IsString()
  @IsNotEmpty()
  symbol: string;
}
