import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('CORS Configuration (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Enable CORS with test configuration
    const corsOrigins = process.env.CORS_ORIGINS?.split(',')
      .map((o) => o.trim())
      .filter(Boolean);
    app.enableCors({
      origin: corsOrigins && corsOrigins.length > 0 ? corsOrigins : true,
      credentials: true,
    });

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('CORS Headers', () => {
    it('should include CORS headers for allowed origins', async () => {
      const response = await request(app.getHttpServer())
        .options('/botd')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'GET')
        .set('Access-Control-Request-Headers', 'Content-Type')
        .expect(204);

      // Check for CORS headers
      expect(response.headers['access-control-allow-origin']).toBeDefined();
      expect(response.headers['access-control-allow-credentials']).toBe('true');
      expect(response.headers['access-control-allow-methods']).toBeDefined();
      expect(response.headers['access-control-allow-headers']).toBeDefined();
    });

    it('should include CORS headers for allthebeans.com origin', async () => {
      const response = await request(app.getHttpServer())
        .options('/botd')
        .set('Origin', 'https://allthebeans.com')
        .set('Access-Control-Request-Method', 'GET')
        .set('Access-Control-Request-Headers', 'Content-Type')
        .expect(204);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
      expect(response.headers['access-control-allow-credentials']).toBe('true');
    });

    it('should allow actual GET request with CORS headers', async () => {
      const response = await request(app.getHttpServer())
        .get('/botd')
        .set('Origin', 'http://localhost:3000')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
      expect(response.headers['access-control-allow-credentials']).toBe('true');
    });

    it('should allow POST request with CORS headers', async () => {
      const response = await request(app.getHttpServer())
        .post('/search')
        .set('Origin', 'http://localhost:3000')
        .set('Content-Type', 'application/json')
        .send({ query: 'test' })
        .expect(401); // Expected 401 due to JWT auth requirement

      expect(response.headers['access-control-allow-origin']).toBeDefined();
      expect(response.headers['access-control-allow-credentials']).toBe('true');
    });
  });

  describe('CORS with Environment Variables', () => {
    beforeEach(() => {
      // Save original env
      process.env.ORIGINAL_CORS_ORIGINS = process.env.CORS_ORIGINS;
    });

    afterEach(() => {
      // Restore original env
      if (process.env.ORIGINAL_CORS_ORIGINS) {
        process.env.CORS_ORIGINS = process.env.ORIGINAL_CORS_ORIGINS;
      } else {
        delete process.env.CORS_ORIGINS;
      }
      delete process.env.ORIGINAL_CORS_ORIGINS;
    });

    it('should allow requests from origins specified in CORS_ORIGINS env var', async () => {
      process.env.CORS_ORIGINS =
        'http://localhost:3000,https://allthebeans.com,https://test.example.com';

      // Restart app with new CORS config
      await app.close();
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();

      const corsOrigins = process.env.CORS_ORIGINS?.split(',')
        .map((o) => o.trim())
        .filter(Boolean);
      app.enableCors({
        origin: corsOrigins && corsOrigins.length > 0 ? corsOrigins : true,
        credentials: true,
      });

      await app.init();

      const response = await request(app.getHttpServer())
        .get('/botd')
        .set('Origin', 'https://test.example.com')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBe(
        'https://test.example.com',
      );
    });

    it('should reject requests from origins not in CORS_ORIGINS env var', async () => {
      process.env.CORS_ORIGINS =
        'http://localhost:3000,https://allthebeans.com';

      // Restart app with new CORS config
      await app.close();
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();

      const corsOrigins = process.env.CORS_ORIGINS?.split(',')
        .map((o) => o.trim())
        .filter(Boolean);
      app.enableCors({
        origin: corsOrigins && corsOrigins.length > 0 ? corsOrigins : true,
        credentials: true,
      });

      await app.init();

      const response = await request(app.getHttpServer())
        .get('/botd')
        .set('Origin', 'https://malicious-site.com')
        .expect(200); // Request succeeds but CORS headers should be missing

      // When origin is not allowed, the Access-Control-Allow-Origin header should not be set
      expect(response.headers['access-control-allow-origin']).toBeUndefined();
    });
  });

  describe('CORS Preflight Requests', () => {
    it('should handle OPTIONS preflight request correctly', async () => {
      const response = await request(app.getHttpServer())
        .options('/botd')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'GET')
        .set('Access-Control-Request-Headers', 'Authorization,Content-Type')
        .expect(204);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
      expect(response.headers['access-control-allow-methods']).toBeDefined();
      expect(response.headers['access-control-allow-headers']).toBeDefined();
      expect(response.headers['access-control-max-age']).toBeDefined();
    });

    it('should handle preflight request for POST with auth headers', async () => {
      const response = await request(app.getHttpServer())
        .options('/search')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'POST')
        .set('Access-Control-Request-Headers', 'Authorization,Content-Type')
        .expect(204);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
      expect(response.headers['access-control-allow-methods']).toContain(
        'POST',
      );
      expect(response.headers['access-control-allow-headers']).toContain(
        'Authorization',
      );
    });
  });

  describe('CORS Error Scenarios', () => {
    it('should not include CORS headers for disallowed origin when CORS_ORIGINS is set', async () => {
      // Set specific origins
      process.env.CORS_ORIGINS =
        'http://localhost:3000,https://allthebeans.com';

      // Restart app with restricted CORS
      await app.close();
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();

      const corsOrigins = process.env.CORS_ORIGINS?.split(',')
        .map((o) => o.trim())
        .filter(Boolean);
      app.enableCors({
        origin: corsOrigins && corsOrigins.length > 0 ? corsOrigins : true,
        credentials: true,
      });

      await app.init();

      const response = await request(app.getHttpServer())
        .get('/botd')
        .set('Origin', 'https://evil-site.com')
        .expect(200);

      // Should not have CORS headers for disallowed origin
      expect(response.headers['access-control-allow-origin']).toBeUndefined();
    });

    it('should handle requests without Origin header', async () => {
      const response = await request(app.getHttpServer())
        .get('/botd')
        .expect(200);

      // Should still work but may not have CORS headers
      expect(response.body).toBeDefined();
    });
  });
});
