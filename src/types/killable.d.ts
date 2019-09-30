declare module 'killable' {
  import { Server } from 'http';

  export type KillableServer = Server & {
    kill: (callback: () => void) => never;
  };
  export default function killable(server: Server): KillableServer;
}
