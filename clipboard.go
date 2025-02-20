package main

import (
	"bytes"
	"context"
	"github.com/libp2p/go-libp2p/core/network"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"golang.design/x/clipboard"
	"io"
)

var history [][]byte

func setClipboardFromRemote(ctx context.Context, r io.Reader) {
	for {
		b, err := io.ReadAll(r)
		if err != nil {
			runtime.LogWarningf(ctx, "Error reading from buffer: %v", err)
			//panic(err)
			break
		}

		runtime.LogDebugf(ctx, "clipboard data arrive: %d bytes", n)

		currentBytes := clipboard.Read(clipboard.FmtText)
		if n != len(currentBytes) || !bytes.Equal(currentBytes, payload) {
			runtime.LogDebugf(ctx, "clipboard data is different, updating")
			// Only update when is different
			clipboard.Write(clipboard.FmtText, payload)
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
		runtime.LogDebugf(ctx, "clipboard change: %s", data)
		if err != nil {
			runtime.LogWarningf(ctx, "Error writing to buffer: %v", err)
			//panic(err)
			break
		}
	}
}

func streamClipboard(ctx context.Context, stream network.Stream) {
	go getChangeFromClipboard(ctx, stream)
	go setClipboardFromRemote(ctx, stream)
}
