package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"
)

type HealthResp struct {
	OK bool `json:"ok"`
}

func main() {
	url := os.Getenv("DEPLOYED_HEALTH_URL")
	if url == "" {
		fmt.Println("ERROR: DEPLOYED_HEALTH_URL is not set")
		os.Exit(1)
	}

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Get(url)
	if err != nil {
		fmt.Printf("ERROR: request failed: %v\n", err)
		os.Exit(1)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		fmt.Printf("ERROR: non-2xx status: %d\nBody: %s\n", resp.StatusCode, string(body))
		os.Exit(1)
	}

	var hr HealthResp
	if err := json.Unmarshal(body, &hr); err != nil {
		fmt.Printf("ERROR: invalid JSON: %v\nBody: %s\n", err, string(body))
		os.Exit(1)
	}

	if !hr.OK {
		fmt.Printf("ERROR: ok=false\nBody: %s\n", string(body))
		os.Exit(1)
	}

	fmt.Println("OK: deployed health check passed")
}
