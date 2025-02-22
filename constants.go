package main

import "time"

const (
	//DefaultPort       = 25220 // Project start at 2025-02-20
	DefaultRendezvousString  = "clipboard"
	DefaultProtocolID        = "/peerclip/v1"
	MessageDelim             = '\n'
	HeaderEncodingBase       = 36
	PeersCountUpdateInterval = time.Second * 5
)
