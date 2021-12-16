import * as pulumi from '@pulumi/pulumi';
import { AnthicAuth, getClusterProviders } from '@statespacelabs/pulumi';
import environment from './env';
import { version } from '../package.json';

const config = new pulumi.Config();
const env = config.require('env');
const certificateArn = config.get('certificateArn');
const replicas = config.requireNumber('replicas');

const { services } = getClusterProviders(env);

const anthicAuth = new AnthicAuth('anthic-auth', env, environment, { port: 8080, replicas, version, certificateArn });
anthicAuth.provision(services);
