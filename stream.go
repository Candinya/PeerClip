package main

import (
	"bufio"
	"bytes"
	"context"
	"fmt"
	"github.com/libp2p/go-libp2p/core/network"
	"golang.design/x/clipboard"
	"log"
)

func readData(rw *bufio.ReadWriter) {
	for {
		var b []byte
		n, err := rw.Read(b)
		if err != nil {
			fmt.Println("Error reading from buffer")
			panic(err)
		}

		log.Printf("[*] Read %d bytes", n)

		currentBytes := clipboard.Read(clipboard.FmtText)
		if n != len(currentBytes) || !bytes.Equal(currentBytes, b) {
			// Only update when is different
			clipboard.Write(clipboard.FmtText, b)
		}
	}
}

func writeData(ctx context.Context, rw *bufio.ReadWriter) {

	ch := clipboard.Watch(ctx, clipboard.FmtText)

	for data := range ch {
		log.Printf("[*] clipboard change: %s", data)
		_, err := rw.Write(data)
		if err != nil {
			log.Println("Error writing to buffer")
			panic(err)
		}
		err = rw.Flush()
		if err != nil {
			log.Println("Error flushing buffer")
			panic(err)
		}
	}
}

func streamClipboard(ctx context.Context, stream network.Stream) {
	// Create a buffer stream for non-blocking read and write.
	rw := bufio.NewReadWriter(bufio.NewReader(stream), bufio.NewWriter(stream))

	go readData(rw)
	go writeData(ctx, rw)
}
