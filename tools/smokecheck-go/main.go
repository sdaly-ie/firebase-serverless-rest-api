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

func check(url string, client *http.Client) error {
	if url == "" {
		return fmt.Errorf("DEPLOYED_HEALTH_URL is not set")
	}

	resp, err := client.Get(url)
	if err != nil {
		return fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("read body failed: %w", err)
	}

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return fmt.Errorf("non-2xx status: %d\nBody: %s", resp.StatusCode, string(body))
	}

	var hr HealthResp
	if err := json.Unmarshal(body, &hr); err != nil {
		return fmt.Errorf("invalid JSON: %w\nBody: %s", err, string(body))
	}

	if !hr.OK {
		return fmt.Errorf("ok=false\nBody: %s", string(body))
	}

	return nil
}

func main() {
	url := os.Getenv("DEPLOYED_HEALTH_URL")

	client := &http.Client{
		Timeout: 10 * time.Second,
	}

	if err := check(url, client); err != nil {
		fmt.Printf("ERROR: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("OK: deployed health check passed")
}
