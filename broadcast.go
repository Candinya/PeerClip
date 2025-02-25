package main

import (
	"bufio"
	"bytes"
	"context"
	"encoding/gob"
	"github.com/libp2p/go-libp2p/core/network"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"golang.design/x/clipboard"
	"io"
	"strconv"
)

type BroadcastData struct {
	Format  clipboard.Format
	Content []byte
}

// Refer to https://stackoverflow.com/questions/74326022/go-libp2p-receiving-bytes-from-stream

func setClipboardFromRemote(ctx context.Context, r io.Reader) {
	for {
		// Receive header
		buf := bufio.NewReader(r)
		header, err := buf.ReadBytes(MessageDelim)
		if err != nil {
			runtime.LogErrorf(ctx, "Failed to read header: %v", err)
			break
		}

		lengthStr := string(header[:len(header)-1]) // Minus 1 to get rid of the delim suffix
		runtime.LogDebugf(ctx, "header arrive: %s", lengthStr)

		length, err := strconv.ParseInt(lengthStr, HeaderEncodingBase, 64)
		if err != nil {
			runtime.LogErrorf(ctx, "Failed to parse header: %v", err)
			break
		}

		// Receive payload
		payloadBytes := make([]byte, length)
		n, err := io.ReadFull(buf, payloadBytes)
		if err != nil {
			runtime.LogWarningf(ctx, "Error reading from buffer: %v", err)
			break
		}

		runtime.LogDebugf(ctx, "payload arrive: %d bytes", n)

		// Decode payload
		var payload BroadcastData
		err = gob.NewDecoder(bytes.NewReader(payloadBytes)).Decode(&payload)
		if err != nil {
			runtime.LogErrorf(ctx, "Failed to decode payload: %v", err)
			break
		}

		currentBytes := clipboard.Read(payload.Format)
		if n != len(currentBytes) || !bytes.Equal(currentBytes, payload.Content) {
			runtime.LogDebugf(ctx, "clipboard data is different, updating")
			// Only update when is different
			clipboard.Write(payload.Format, payload.Content)
		}
	}
}

func getChangeFromClipboard(ctx context.Context, w io.Writer, format clipboard.Format) {
	ch := clipboard.Watch(ctx, format)

	for data := range ch {
		runtime.LogDebugf(ctx, "clipboard %d change: %s", format, data)
		// Encode data to payload
		buf := new(bytes.Buffer)
		err := gob.NewEncoder(buf).Encode(BroadcastData{
			Format:  format,
			Content: data,
		})
		if err != nil {
			runtime.LogWarningf(ctx, "Error encoding data: %v", err)
			break
		}

		// Write header to stream
		header := []byte(strconv.FormatInt(int64(buf.Len()), HeaderEncodingBase))
		_, err = w.Write(header)
		if err != nil {
			runtime.LogWarningf(ctx, "Error writing header: %v", err)
			break
		}
		// Write splitter
		_, err = w.Write([]byte{MessageDelim})
		if err != nil {
			runtime.LogWarningf(ctx, "Error writing splitter: %v", err)
			break
		}
		// Write payload
		_, err = w.Write(buf.Bytes())
		if err != nil {
			runtime.LogWarningf(ctx, "Error writing payload: %v", err)
			break
		}
	}
}

func streamClipboard(ctx context.Context, stream network.Stream) {
	go getChangeFromClipboard(ctx, stream, clipboard.FmtText)
	go getChangeFromClipboard(ctx, stream, clipboard.FmtImage)
	go setClipboardFromRemote(ctx, stream)
}
