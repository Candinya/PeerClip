package main

import (
	"crypto/md5"
	"encoding/hex"
	"testing"
)

func TestHash(t *testing.T) {
	data := []byte("")

	h := md5.New()
	h.Write(data)
	t.Log(hex.EncodeToString(h.Sum(nil)))
}
