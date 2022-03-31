import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";

export class ParamsValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if(!value) {
      throw new BadRequestException(`Values missing from ${ metadata.type }`);
    }

    return value;
  }
}