package main

import (
	"context"
	"crypto/md5"
	"encoding/base64"
	"encoding/hex"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"golang.design/x/clipboard"
)

func encodeClipboardData(format clipboard.Format, data []byte) string {
	switch format {
	case clipboard.FmtText:
		return string(data)
	case clipboard.FmtImage:
		return base64.StdEncoding.EncodeToString(data)
	default:
		// Unsupported format
		return string(data)
	}
}

func decodeClipboardData(format clipboard.Format, data string) ([]byte, error) {
	switch format {
	case clipboard.FmtText:
		return []byte(data), nil
	case clipboard.FmtImage:
		return base64.StdEncoding.DecodeString(data)
	default:
		// Unsupported format
		return []byte(data), nil
	}
}

func watchClipboardChangeEvent(ctx context.Context, format clipboard.Format) {
	ch := clipboard.Watch(ctx, format)

	for data := range ch {
		// Calc hash of data as unique id
		h := md5.New()
		h.Write(data)
		runtime.EventsEmit(ctx, "clipboard-change", format, hex.EncodeToString(h.Sum(nil)), encodeClipboardData(format, data))
	}
}

func (a *App) SetClipboard(format clipboard.Format, content string) {
	data, err := decodeClipboardData(format, content)
	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to decode clipboard data %d %s: %v", format, content, err)
		return
	}

	clipboard.Write(format, data)
}
