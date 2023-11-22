import { IsNotEmpty, IsString } from 'class-validator';

export class GetMoreInfoQueryDto {
  @IsString()
  @IsNotEmpty()
  symbol: string;
}
