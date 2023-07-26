import { unstable_createFileUploadHandler } from '@remix-run/node';
import dns from 'dns';
import Client from 'ssh2-sftp-client';
import * as Sentry from '@sentry/node';

export const uploadHandler = unstable_createFileUploadHandler({
  directory: './images/',
  file: ({ filename }) => filename,
});

async function getIPsOfApps() {
  return dns.promises.resolve6(`${process.env.FLY_APP_NAME}.internal`);
}

async function getIPsOfAppsWithoutCurrentApp() {
  const ips = await getIPsOfApps();
  return ips.filter((ip) => ip !== process.env.FLY_PRIVATE_IP);
}

export async function replicateImageAcrossApps(image: string) {
  const ips = await getIPsOfAppsWithoutCurrentApp();
  const sftp = new Client();

  await Promise.all(
    ips.map(async (ip) => {
      try {
        await sftp.connect({
          host: ip,
          port: 3022,
          username: process.env.REPLICATOR_SSH_USER,
          password: process.env.REPLICATOR_SSH_PASSWORD,
        });

        await sftp.put(`./images/${image}`, `/weddingfest/images/${image}`);
      } catch (error: unknown) {
        console.error(error);
        Sentry.captureException(error);
      } finally {
        sftp.end();
      }
    })
  );
}
