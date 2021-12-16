import * as pulumi from '@pulumi/pulumi';
import { Environment } from '@statespacelabs/pulumi';

const config = new pulumi.Config();
const env = config.require('env');

const e = new Environment(env);

e.set('AUTH_ENDPOINT', e.param`auth-endpoint`);
e.set('APP_URL', e.param`app-url`);

e.set('OAUTH_COOKIE_KEY', e.param`oauth-cookie-key`);
e.set('OAUTH_JWKS_KEY', e.param`oauth-jwks-key`);

e.set('SEGMENT_WRITE_KEY', e.param`segment-write-key`);
e.set('STRIPE_SECRET_KEY', e.param`stripe-secret-key`);
e.set('PLAYFAB_SECRET', e.param`playfab-secret`);
e.set('RIOT_API_KEY', e.param`riot-api-key`);

e.set('REDIS_HOST', e.param`redis-host`);
e.set('AUTH_REDIS_HOST', e.param`auth-redis-host`);
e.set('DATABASE_URL', e.param`database-url`);
e.set('PERSONAL_INFO_DATABASE_URL', e.param`personal-info-database-url`);
e.set('REPLICA_DATABASE_URL', e.param`replica-database-url`);

e.set('API_IMAGE_BUCKET', e.param`api-image-bucket`);
e.set('PLAYFAB_PASSWORD_RESET_EMAIL_TEMPLATE', e.param`playfab-password-reset-email-template`);

e.set('OAUTH_DISCORD_CLIENTID', e.param`oauth-discord-clientid`);
e.set('OAUTH_DISCORD_CLIENTSECRET', e.param`oauth-discord-clientsecret`);
e.set('OAUTH_RIOT_CLIENTID', e.param`oauth-riot-clientid`);
e.set('OAUTH_RIOT_CLIENTSECRET', e.param`oauth-riot-clientsecret`);

e.set('NODE_ENV', 'production');
e.set('NODE_OPTIONS', '--max-old-space-size=4096');

export default e;
