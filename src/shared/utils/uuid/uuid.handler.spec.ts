import { parse, stringify, v1 as uuidV1 } from 'uuid';

import { UuidHandler } from './uuid.handler';

jest.mock('uuid', () => ({
  v1: jest.fn(),
  parse: jest.fn(),
  stringify: jest.fn(),
}));

describe('UuidHandler', () => {
  describe('newUuid', () => {
    it('should generate a new UUID', () => {
      const mockUuid = '550e8400-e29b-41d4-a716-446655440000';
      (uuidV1 as jest.Mock).mockReturnValue(mockUuid);

      const result = UuidHandler.newUuid();

      expect(uuidV1).toHaveBeenCalled();
      expect(result).toBe(mockUuid);
    });
  });

  describe('uuidToBin', () => {
    it('should convert a UUID to a binary buffer', () => {
      const mockUuid = '550e8400-e29b-41d4-a716-446655440000';
      const mockBuffer = Buffer.from([
        85, 14, 132, 0, 226, 155, 65, 212, 167, 22, 68, 102, 85, 68, 0, 0,
      ]);
      (parse as jest.Mock).mockReturnValue(mockBuffer);

      const result = UuidHandler.uuidToBin(mockUuid);

      expect(parse).toHaveBeenCalledWith(mockUuid);
      expect(result).toEqual(mockBuffer);
    });
  });

  describe('binToUuid', () => {
    it('should convert a binary buffer to a UUID', () => {
      const mockBuffer = Buffer.from([
        85, 14, 132, 0, 226, 155, 65, 212, 167, 22, 68, 102, 85, 68, 0, 0,
      ]);
      const mockUuid = '550e8400-e29b-41d4-a716-446655440000';
      (stringify as jest.Mock).mockReturnValue(mockUuid);

      const result = UuidHandler.binToUuid(mockBuffer);

      expect(stringify).toHaveBeenCalledWith(Uint8Array.from(mockBuffer));
      expect(result).toBe(mockUuid);
    });
  });
});
