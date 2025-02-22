package main

import (
	"context"
	"crypto/rand"
	"fmt"
	"github.com/libp2p/go-libp2p"
	"github.com/libp2p/go-libp2p/core/crypto"
	"github.com/libp2p/go-libp2p/core/network"
	"github.com/libp2p/go-libp2p/core/protocol"
	"github.com/multiformats/go-multiaddr"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"time"
)

// Refer to https://github.com/libp2p/go-libp2p/tree/master/examples/chat-with-mdns

func initLibP2P(ctx context.Context, cfg *config) {
	// Initialize key pair
	privKey, _, err := crypto.GenerateEd25519Key(rand.Reader)
	if err != nil {
		runtime.LogFatalf(ctx, "Failed to init key pair: %v", err)
	}

	// Start mDNS auto-discover server
	sourceMultiAddr, _ := multiaddr.NewMultiaddr(fmt.Sprintf("/ip4/%s/tcp/%d", cfg.listenHost, cfg.listenPort))

	// Construct a new libp2p host
	h, err := libp2p.New(
		libp2p.ListenAddrs(sourceMultiAddr),
		libp2p.Identity(privKey),
	)
	if err != nil {
		runtime.LogFatalf(ctx, "Failed to contruct libp2p host: %v", err)
	}

	runtime.LogInfof(ctx, "Listening on: %s with port: %d", cfg.listenHost, cfg.listenPort)
	runtime.LogInfof(ctx, "Your Multiaddress Is: /ip4/%s/tcp/%v/p2p/%s", cfg.listenHost, cfg.listenPort, h.ID())

	// Set a function as stream handler
	// This function is called when a peer initiates a connection and starts a stream with this peer
	h.SetStreamHandler(protocol.ID(cfg.protocolID), func(stream network.Stream) {
		runtime.LogDebugf(ctx, "Got a new stream!")
		streamClipboard(ctx, stream)
		// 'stream' will stay open until you close it (or the other side closes it).
	})

	peerChan := initMDNS(h, cfg.rendezvousString)

	// Start join nodes
	go func() {
		for { // allows multiple peers to join
			peer := <-peerChan // will block until we discover a peer
			if peer.ID > h.ID() {
				// if other end peer id greater than us, don't connect to it, just wait for it to connect us
				runtime.LogDebugf(ctx, "Found peer: %v, id is greater than us, wait for it to connect to us", peer)
				continue
			}
			runtime.LogDebugf(ctx, "Found peer: %v, connecting", peer)

			if err := h.Connect(ctx, peer); err != nil {
				runtime.LogWarningf(ctx, "Connection failed: %v", err)
				continue
			}

			// open a stream, this stream will be handled by handleStream other end
			stream, err := h.NewStream(ctx, peer.ID, protocol.ID(cfg.protocolID))

			if err != nil {
				runtime.LogErrorf(ctx, "Stream open failed: %v", err)
			} else {
				runtime.LogInfof(ctx, "Connected to: %v", peer)
				streamClipboard(ctx, stream)

				// New connection start
				runtime.EventsEmit(ctx, "peers-count", len(h.Network().Peers()))
			}
		}
	}()

	// Update peers count periodically // TODO: find a better way
	go func() {
		t := time.NewTicker(PeersCountUpdateInterval)
		for {
			select {
			case <-t.C:
				runtime.EventsEmit(ctx, "peers-count", len(h.Network().Peers()))
			}
		}
	}()
}
