import { createLibp2p, Libp2p } from "libp2p";
import { webSockets } from "@libp2p/websockets";
import { all } from "@libp2p/websockets/filters";
import { noise } from "@chainsafe/libp2p-noise";
import { mplex } from "@libp2p/mplex";
import { gossipsub, GossipsubEvents } from "@chainsafe/libp2p-gossipsub";
import { identifyService } from "libp2p/identify";
import { PingService, pingService } from "libp2p/ping";
import {
  PubsubServiceDiscovery,
  pubsubServiceDiscovery,
} from "@canvas-js/pubsub-service-discovery";
import { PubSub } from "@libp2p/interface-pubsub";

export type ServiceMap = {
  identify: {};
  pubsub: PubSub<GossipsubEvents>;
  ping: PingService;
};

const protocolPrefix = "/canvas/v1/something";

export const createLibp2pWithConfig = async (): Promise<Libp2p<ServiceMap>> => {
  const MIN_CONNECTIONS = 2;
  const MAX_CONNECTIONS = 10;
  const PING_TIMEOUT = 5e3;

  return await createLibp2p({
    start: false,
    // peerId: peerId,

    // addresses: {
    // 	listen: ["/webrtc"],
    // 	announce: bootstrapList.map((address) => `${address}/p2p-circuit/webrtc/p2p/${peerId}`),
    // },

    // transports: [
    // 	webRTC(),
    // 	webSockets({ filter: all }),
    // 	circuitRelayTransport({ discoverRelays: bootstrapList.length }),
    // ],

    addresses: { listen: [], announce: [] },
    transports: [webSockets({ filter: all })],

    connectionEncryption: [noise()],
    streamMuxers: [mplex()],
    // peerDiscovery: bootstrapList.length > 0 ? [bootstrap({ list: bootstrapList })] : [],

    connectionManager: {
      minConnections: MIN_CONNECTIONS,
      maxConnections: MAX_CONNECTIONS,
    },

    connectionGater: {
      denyDialMultiaddr: () => {
        return false;
      },
    },

    services: {
      pubsub: gossipsub({
        emitSelf: false,
        fallbackToFloodsub: false,
        allowPublishToZeroPeers: true,
        globalSignaturePolicy: "StrictSign",
      }),

      identify: identifyService({
        protocolPrefix: "something",
      }),

      ping: pingService({
        protocolPrefix: "something",
        maxInboundStreams: 32,
        maxOutboundStreams: 32,
        timeout: PING_TIMEOUT,
      }),

      // serviceDiscovery: pubsubServiceDiscovery({
      //   filterProtocols: (protocol) =>
      //     protocol === PubsubServiceDiscovery.DISCOVERY_TOPIC ||
      //     protocol.startsWith(protocolPrefix),
      // }),
    },
  });
};
