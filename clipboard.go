package main

import (
	"bufio"
	"bytes"
	"context"
	"crypto/md5"
	"encoding/binary"
	"encoding/hex"
	"github.com/libp2p/go-libp2p/core/network"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"golang.design/x/clipboard"
	"io"
)

// Refer to https://stackoverflow.com/questions/74326022/go-libp2p-receiving-bytes-from-stream

func setClipboardFromRemote(ctx context.Context, r io.Reader) {
	for {
		buf := bufio.NewReader(r)
		header, err := buf.ReadBytes(MessageDelim)
		if err != nil {
			runtime.LogErrorf(ctx, "Failed to read header: %v", err)
			return
		}

		length := binary.BigEndian.Uint64(header)

		payload := make([]byte, length)
		n, err := io.ReadFull(buf, payload)
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
		}
	}
}

func getChangeFromClipboard(ctx context.Context, w io.Writer) {
	ch := clipboard.Watch(ctx, clipboard.FmtText)

	for data := range ch {
		runtime.LogDebugf(ctx, "clipboard change: %s", data)
		// Write data to stream
		header := make([]byte, 8)
		binary.BigEndian.PutUint64(header, uint64(len(data))) // Refer to https://go.dev/play/p/pt4cUAcH3Vt
		_, err := w.Write(header)
		if err != nil {
			runtime.LogWarningf(ctx, "Error writing header: %v", err)
			continue
		}
		_, err = w.Write([]byte{MessageDelim})
		if err != nil {
			runtime.LogWarningf(ctx, "Error writing splitter: %v", err)
			continue
		}
		_, err = w.Write(data)
		if err != nil {
			runtime.LogWarningf(ctx, "Error writing payload: %v", err)
			//panic(err)
			break
		}
	}
}

func streamClipboard(ctx context.Context, stream network.Stream) {
	go getChangeFromClipboard(ctx, stream)
	go setClipboardFromRemote(ctx, stream)
}

func emitClipboardChangeEvent(ctx context.Context) {
	ch := clipboard.Watch(ctx, clipboard.FmtText)

	for data := range ch {
		// Calc hash of data as unique id
		h := md5.New()
		h.Write(data)
		runtime.EventsEmit(ctx, "clipboard-change", hex.EncodeToString(h.Sum(nil)), string(data))
	}
}
