package main

import (
	"bytes"
	"context"
	"github.com/libp2p/go-libp2p/core/network"
	"golang.design/x/clipboard"
	"io"
	"log"
)

var history [][]byte

func setClipboardFromRemote(r io.Reader) {
	for {
		b, err := io.ReadAll(r)
		if err != nil {
			log.Printf("Error reading from buffer: %v", err)
			//panic(err)
			break
		}

		n := len(b)

		log.Printf("[*] clipboard data arrive: %d bytes", n)

		currentBytes := clipboard.Read(clipboard.FmtText)
		if n != len(currentBytes) || !bytes.Equal(currentBytes, b) {
			// Only update when is different
			clipboard.Write(clipboard.FmtText, b)
			history = append(history, currentBytes)
			if len(history) >= DefaultKeepHistory {
				// Remove first
				history = history[1:]
			}
		}
	}
}

func getChangeFromClipboard(ctx context.Context, w io.Writer) {
	ch := clipboard.Watch(ctx, clipboard.FmtText)

	for data := range ch {
		log.Printf("[*] clipboard change: %s", data)
		_, err := w.Write(data)
		if err != nil {
			log.Printf("Error writing to buffer: %v", err)
			//panic(err)
			break
		}
	}
}

func streamClipboard(ctx context.Context, stream network.Stream) {
	go getChangeFromClipboard(ctx, stream)
	go setClipboardFromRemote(stream)
}
