package main

import "time"

const (
	DefaultRendezvousString  = "clipboard"
	DefaultProtocolID        = "/peerclip/v1"
	MessageDelim             = '\n'
	HeaderEncodingBase       = 36
	PeersCountUpdateInterval = time.Second * 5
)
