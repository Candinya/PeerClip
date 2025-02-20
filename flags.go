package main

import "flag"

type config struct {
	rendezvousString string
	protocolID       string
	listenHost       string
	listenPort       int
}

func parseFlags() *config {
	c := &config{}

	flag.StringVar(&c.rendezvousString, "rendezvous", DefaultRendezvousString, "Unique string to identify group of nodes.")
	flag.StringVar(&c.protocolID, "protocol", DefaultProtocolID, "Sets a protocol id for stream headers")
	flag.StringVar(&c.listenHost, "host", "0.0.0.0", "Node host listen address")
	flag.IntVar(&c.listenPort, "port", 0, "Node listen port (0 for random)")

	flag.Parse()
	return c
}
