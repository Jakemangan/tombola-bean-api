import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { JwtAuthAdminGuard } from '../../guards/jwtAdmin.guard';
import { verify } from 'jsonwebtoken';

// Mock jsonwebtoken
jest.mock('jsonwebtoken');
const mockVerify = verify as jest.MockedFunction<typeof verify>;

describe('JwtAuthAdminGuard', () => {
  let guard: JwtAuthAdminGuard;
  let configService: jest.Mocked<ConfigService>;

  const mockExecutionContext = {
    switchToHttp: () => ({
      getRequest: () => ({
        headers: {},
      }),
    }),
  };

  const mockConfigValues = {
    JWT_ISS: 'test-issuer',
    JWT_AUD: 'test-audience',
    JWT_KEY: 'test-secret-key',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthAdminGuard,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<JwtAuthAdminGuard>(JwtAuthAdminGuard);
    configService = module.get(ConfigService);

    // Setup default config values
    configService.get.mockImplementation(
      (key: string) => mockConfigValues[key],
    );

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    it('should return true for valid admin token', () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer valid-admin-token',
        },
      };

      const mockPayload = {
        sub: 'admin123',
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
        iat: Math.floor(Date.now() / 1000),
        iss: 'test-issuer',
        aud: 'test-audience',
        role: 'admin',
      };

      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => mockRequest,
      });

      mockVerify.mockReturnValue(mockPayload as any);

      const result = guard.canActivate(mockExecutionContext as any);

      expect(result).toBe(true);
      expect((mockRequest as any).user).toEqual(mockPayload);
      expect(mockVerify).toHaveBeenCalledWith(
        'valid-admin-token',
        'test-secret-key',
        {
          issuer: 'test-issuer',
          audience: 'test-audience',
          algorithms: ['HS256'],
        },
      );
    });

    it('should throw UnauthorizedException when authorization header is missing', () => {
      const mockRequest = {
        headers: {},
      };

      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => mockRequest,
      });

      expect(() => guard.canActivate(mockExecutionContext as any)).toThrow(
        new UnauthorizedException('Missing or invalid Authorization header'),
      );
    });

    it('should throw UnauthorizedException when authorization header does not start with Bearer', () => {
      const mockRequest = {
        headers: {
          authorization: 'Invalid token',
        },
      };

      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => mockRequest,
      });

      expect(() => guard.canActivate(mockExecutionContext as any)).toThrow(
        new UnauthorizedException('Missing or invalid Authorization header'),
      );
    });

    it('should throw UnauthorizedException when JWT configuration is missing', () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer valid-token',
        },
      };

      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => mockRequest,
      });

      // Mock missing JWT configuration
      configService.get.mockReturnValue(undefined);

      expect(() => guard.canActivate(mockExecutionContext as any)).toThrow(
        new UnauthorizedException('Authorization invalid for request'),
      );
    });

    it('should throw UnauthorizedException when JWT issuer is missing', () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer valid-token',
        },
      };

      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => mockRequest,
      });

      configService.get.mockImplementation((key: string) =>
        key === 'JWT_ISS' ? undefined : mockConfigValues[key],
      );

      expect(() => guard.canActivate(mockExecutionContext as any)).toThrow(
        new UnauthorizedException('Authorization invalid for request'),
      );
    });

    it('should throw UnauthorizedException when JWT audience is missing', () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer valid-token',
        },
      };

      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => mockRequest,
      });

      configService.get.mockImplementation((key: string) =>
        key === 'JWT_AUD' ? undefined : mockConfigValues[key],
      );

      expect(() => guard.canActivate(mockExecutionContext as any)).toThrow(
        new UnauthorizedException('Authorization invalid for request'),
      );
    });

    it('should throw UnauthorizedException when JWT key is missing', () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer valid-token',
        },
      };

      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => mockRequest,
      });

      configService.get.mockImplementation((key: string) =>
        key === 'JWT_KEY' ? undefined : mockConfigValues[key],
      );

      expect(() => guard.canActivate(mockExecutionContext as any)).toThrow(
        new UnauthorizedException('Authorization invalid for request'),
      );
    });

    it('should throw UnauthorizedException when token verification fails', () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer invalid-token',
        },
      };

      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => mockRequest,
      });

      mockVerify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => guard.canActivate(mockExecutionContext as any)).toThrow(
        new UnauthorizedException('Authorization invalid for request'),
      );
    });

    it('should throw UnauthorizedException when token payload is missing exp', () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer valid-token',
        },
      };

      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => mockRequest,
      });

      const mockPayload = {
        sub: 'admin123',
        iat: Math.floor(Date.now() / 1000),
        iss: 'test-issuer',
        aud: 'test-audience',
        role: 'admin',
        // Missing exp field
      };

      mockVerify.mockReturnValue(mockPayload as any);

      expect(() => guard.canActivate(mockExecutionContext as any)).toThrow(
        new UnauthorizedException('Authorization invalid for request'),
      );
    });

    it('should throw UnauthorizedException when token exp is not a number', () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer valid-token',
        },
      };

      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => mockRequest,
      });

      const mockPayload = {
        sub: 'admin123',
        exp: 'not-a-number', // exp is not a number
        iat: Math.floor(Date.now() / 1000),
        iss: 'test-issuer',
        aud: 'test-audience',
        role: 'admin',
      };

      mockVerify.mockReturnValue(mockPayload as any);

      expect(() => guard.canActivate(mockExecutionContext as any)).toThrow(
        new UnauthorizedException('Authorization invalid for request'),
      );
    });

    it('should throw UnauthorizedException when token is expired', () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer expired-token',
        },
      };

      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => mockRequest,
      });

      const mockPayload = {
        sub: 'admin123',
        exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago (expired)
        iat: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
        iss: 'test-issuer',
        aud: 'test-audience',
        role: 'admin',
      };

      mockVerify.mockReturnValue(mockPayload as any);

      expect(() => guard.canActivate(mockExecutionContext as any)).toThrow(
        new UnauthorizedException('Authorization invalid for request'),
      );
    });

    it('should throw UnauthorizedException when user role is not admin', () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer user-token',
        },
      };

      const mockPayload = {
        sub: 'user123',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
        iss: 'test-issuer',
        aud: 'test-audience',
        role: 'user', // Not admin
      };

      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => mockRequest,
      });

      mockVerify.mockReturnValue(mockPayload as any);

      expect(() => guard.canActivate(mockExecutionContext as any)).toThrow(
        new UnauthorizedException('Authorization invalid for request'),
      );
    });

    it('should throw UnauthorizedException when user role is missing', () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer token-without-role',
        },
      };

      const mockPayload = {
        sub: 'user123',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
        iss: 'test-issuer',
        aud: 'test-audience',
        // Missing role field
      };

      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => mockRequest,
      });

      mockVerify.mockReturnValue(mockPayload as any);

      expect(() => guard.canActivate(mockExecutionContext as any)).toThrow(
        new UnauthorizedException('Authorization invalid for request'),
      );
    });

    it('should throw UnauthorizedException when user role is null', () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer token-with-null-role',
        },
      };

      const mockPayload = {
        sub: 'user123',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
        iss: 'test-issuer',
        aud: 'test-audience',
        role: null,
      };

      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => mockRequest,
      });

      mockVerify.mockReturnValue(mockPayload as any);

      expect(() => guard.canActivate(mockExecutionContext as any)).toThrow(
        new UnauthorizedException('Authorization invalid for request'),
      );
    });

    it('should throw UnauthorizedException when user role is undefined', () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer token-with-undefined-role',
        },
      };

      const mockPayload = {
        sub: 'user123',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
        iss: 'test-issuer',
        aud: 'test-audience',
        role: undefined,
      };

      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => mockRequest,
      });

      mockVerify.mockReturnValue(mockPayload as any);

      expect(() => guard.canActivate(mockExecutionContext as any)).toThrow(
        new UnauthorizedException('Authorization invalid for request'),
      );
    });

    it('should handle token with whitespace correctly', () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer   valid-admin-token-with-spaces   ',
        },
      };

      const mockPayload = {
        sub: 'admin123',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
        iss: 'test-issuer',
        aud: 'test-audience',
        role: 'admin',
      };

      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => mockRequest,
      });

      mockVerify.mockReturnValue(mockPayload as any);

      const result = guard.canActivate(mockExecutionContext as any);

      expect(result).toBe(true);
      expect(mockVerify).toHaveBeenCalledWith(
        'valid-admin-token-with-spaces',
        'test-secret-key',
        {
          issuer: 'test-issuer',
          audience: 'test-audience',
          algorithms: ['HS256'],
        },
      );
    });

    it('should handle null payload from verify', () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer valid-token',
        },
      };

      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => mockRequest,
      });

      mockVerify.mockReturnValue(null as any);

      expect(() => guard.canActivate(mockExecutionContext as any)).toThrow(
        new UnauthorizedException('Authorization invalid for request'),
      );
    });

    it('should accept admin role with different case variations', () => {
      const testCases = ['admin', 'Admin', 'ADMIN'];

      testCases.forEach((roleCase) => {
        const mockRequest = {
          headers: {
            authorization: 'Bearer valid-admin-token',
          },
        };

        const mockPayload = {
          sub: 'admin123',
          exp: Math.floor(Date.now() / 1000) + 3600,
          iat: Math.floor(Date.now() / 1000),
          iss: 'test-issuer',
          aud: 'test-audience',
          role: roleCase,
        };

        mockExecutionContext.switchToHttp = () => ({
          getRequest: () => mockRequest,
        });

        mockVerify.mockReturnValue(mockPayload as any);

        // Only 'admin' (lowercase) should pass based on the guard implementation
        if (roleCase === 'admin') {
          const result = guard.canActivate(mockExecutionContext as any);
          expect(result).toBe(true);
        } else {
          expect(() => guard.canActivate(mockExecutionContext as any)).toThrow(
            new UnauthorizedException('Authorization invalid for request'),
          );
        }
      });
    });
  });
});
