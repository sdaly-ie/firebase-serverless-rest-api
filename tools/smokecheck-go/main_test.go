package main

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestCheckSuccess(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"ok":true}`))
	}))
	defer server.Close()

	err := check(server.URL, server.Client())
	if err != nil {
		t.Fatalf("expected success, got error: %v", err)
	}
}

func TestCheckEmptyURL(t *testing.T) {
	err := check("", &http.Client{})
	if err == nil {
		t.Fatal("expected error for empty URL, got nil")
	}

	if !strings.Contains(err.Error(), "DEPLOYED_HEALTH_URL is not set") {
		t.Fatalf("unexpected error: %v", err)
	}
}

func TestCheckNon2xx(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		_, _ = w.Write([]byte(`{"ok":false}`))
	}))
	defer server.Close()

	err := check(server.URL, server.Client())
	if err == nil {
		t.Fatal("expected non-2xx error, got nil")
	}

	if !strings.Contains(err.Error(), "non-2xx status") {
		t.Fatalf("unexpected error: %v", err)
	}
}

func TestCheckInvalidJSON(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`not-json`))
	}))
	defer server.Close()

	err := check(server.URL, server.Client())
	if err == nil {
		t.Fatal("expected invalid JSON error, got nil")
	}

	if !strings.Contains(err.Error(), "invalid JSON") {
		t.Fatalf("unexpected error: %v", err)
	}
}

func TestCheckOKFalse(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"ok":false}`))
	}))
	defer server.Close()

	err := check(server.URL, server.Client())
	if err == nil {
		t.Fatal("expected ok=false error, got nil")
	}

	if !strings.Contains(err.Error(), "ok=false") {
		t.Fatalf("unexpected error: %v", err)
	}
}
