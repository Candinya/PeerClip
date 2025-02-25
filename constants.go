package main

import "time"

const (
	DefaultRendezvousString  = "peerclip"
	DefaultProtocolID        = "/peerclip/0.2"
	MessageDelim             = '\n'
	HeaderEncodingBase       = 36
	PeersCountUpdateInterval = time.Second * 5
)
