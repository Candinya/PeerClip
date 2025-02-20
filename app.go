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
	"golang.design/x/clipboard"
	"log"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startupWithCfg(cfg *config) func(ctx context.Context) {

	// Prepare clipboard
	err := clipboard.Init()
	if err != nil {
		log.Fatal(err)
	}

	// Initialize key pair
	privKey, _, err := crypto.GenerateEd25519Key(rand.Reader)
	if err != nil {
		log.Fatal(err)
	}

	// Start mDNS auto-discover server
	sourceMultiAddr, _ := multiaddr.NewMultiaddr(fmt.Sprintf("/ip4/%s/tcp/%d", cfg.listenHost, cfg.listenPort))

	// Construct a new libp2p host
	host, err := libp2p.New(
		libp2p.ListenAddrs(sourceMultiAddr),
		libp2p.Identity(privKey),
	)
	if err != nil {
		log.Fatal(err)
	}

	log.Printf("[*] Listening on: %s with port: %d\n", cfg.listenHost, cfg.listenPort)

	return func(ctx context.Context) {
		a.ctx = ctx

		// Set a function as stream handler
		// This function is called when a peer initiates a connection and starts a stream with this peer
		host.SetStreamHandler(protocol.ID(cfg.protocolID), func(stream network.Stream) {
			log.Println("Got a new stream!")
			streamClipboard(ctx, stream)
			// 'stream' will stay open until you close it (or the other side closes it).
		})

		log.Printf("\n[*] Your Multiaddress Is: /ip4/%s/tcp/%v/p2p/%s\n", cfg.listenHost, cfg.listenPort, host.ID())

		peerChan := initMDNS(host, cfg.rendezvousString)

		// Start join nodes
		go func() {
			for { // allows multiple peers to join
				peer := <-peerChan // will block until we discover a peer
				if peer.ID > host.ID() {
					// if other end peer id greater than us, don't connect to it, just wait for it to connect us
					log.Println("Found peer:", peer, " id is greater than us, wait for it to connect to us")
					continue
				}
				log.Println("Found peer:", peer, ", connecting")

				if err := host.Connect(ctx, peer); err != nil {
					log.Println("Connection failed:", err)
					continue
				}

				// open a stream, this stream will be handled by handleStream other end
				stream, err := host.NewStream(ctx, peer.ID, protocol.ID(cfg.protocolID))

				if err != nil {
					log.Println("Stream open failed", err)
				} else {
					log.Println("Connected to:", peer)
					streamClipboard(ctx, stream)
				}
			}
		}()
	}
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}
