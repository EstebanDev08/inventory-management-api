export abstract class IEncryptor {
  abstract encrypt(textPlain: string): Promise<string>;
  abstract compare(textPlain: string, hashText: string): Promise<boolean>;
}
