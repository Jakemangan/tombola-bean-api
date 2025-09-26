#!/usr/bin/env ts-node

import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

interface JwtPayload {
  sub?: string;
  iss?: string;
  aud?: string;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

function generateJWT(payload: Partial<JwtPayload> = {}): string {
  
  const secret = process.env.JWT_KEY;
  const issuer = process.env.JWT_ISS;
  const audience = process.env.JWT_AUD;

  if (!secret) {
    throw new Error('JWT_KEY environment variable is required');
  }

  if (!issuer) {
    throw new Error('JWT_ISS environment variable is required');
  }

  if (!audience) {
    throw new Error('JWT_AUD environment variable is required');
  }

  const now = Math.floor(Date.now() / 1000);
  const defaultPayload: JwtPayload = {
    sub: 'user', 
    iss: issuer,
    aud: audience, 
    iat: now, 
    exp: now + 24 * 60 * 60,
    ...payload,
  };

  const token = jwt.sign(defaultPayload, secret, {
    algorithm: 'HS256',
  });

  return token;
}

function main() {
  try {
    const args = process.argv.slice(2);
    let customPayload: Partial<JwtPayload> = {};

    for (let i = 0; i < args.length; i += 2) {
      if (args[i].startsWith('--') && args[i + 1]) {
        const key = args[i].substring(2);
        const value = args[i + 1];

        if (['exp', 'iat', 'nbf'].includes(key)) {
          customPayload[key] = parseInt(value, 10);
        } else {
          customPayload[key] = value;
        }
      }
    }

    const token = generateJWT(customPayload);

    console.log('Generated JWT Token:');
    console.log(token);
    console.log('\nToken Details:');
    console.log('Algorithm: HS256');
    console.log('Issuer:', process.env.JWT_ISS);
    console.log('Audience:', process.env.JWT_AUD);
    console.log(
      'Expires:',
      new Date(
        (customPayload.exp || Math.floor(Date.now() / 1000) + 24 * 60 * 60) *
          1000,
      ).toISOString(),
    );

    const decoded = jwt.decode(token, { complete: true });
    console.log('\nDecoded Payload:');
    console.log(JSON.stringify(decoded?.payload, null, 2));
  } catch (error) {
    console.error('Error generating JWT:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { generateJWT };
