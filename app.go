package main

import (
	"context"
	"fmt"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"golang.design/x/clipboard"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startupWithCfg(cfg *config) func(ctx context.Context) {

	return func(ctx context.Context) {
		a.ctx = ctx

		// Prepare clipboard
		err := clipboard.Init()
		if err != nil {
			runtime.LogFatalf(ctx, "Failed to init clipboard: %v", err)
		}

		// Prepare libp2p
		initLibP2P(ctx, cfg)
	}
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}
