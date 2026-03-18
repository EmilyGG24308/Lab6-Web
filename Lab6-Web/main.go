package main

import (
	"fmt"
	"io"
	"net/http"
)

var chatApi = "http://framework.dennisaldana.com"

func getMessages(w http.ResponseWriter, r *http.Request) {
	resp, err := http.Get(chatApi + "/messages")
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	defer resp.Body.Close()

	io.Copy(w, resp.Body)
}

func postMessage(w http.ResponseWriter, r *http.Request) {
	resp, err := http.Post(chatApi+"/messages", "application/json", r.Body)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	defer resp.Body.Close()

	io.Copy(w, resp.Body)
}

func main() {
	http.Handle("/", http.FileServer(http.Dir("static")))

	http.HandleFunc("/api/messages", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "GET" {
			getMessages(w, r)
		} else if r.Method == "POST" {
			postMessage(w, r)
		}
	})

	fmt.Println("Server running on http://localhost:8000")
	http.ListenAndServe(":8000", nil)
}