package main

import (
  "log"
  "net/http"
)

func main() {
  fs := http.FileServer(http.Dir("./static"))
  http.Handle("/", fs)

  log.Println("Listening on :8007...")
  err := http.ListenAndServe(":8007", nil)
  if err != nil {
    log.Fatal(err)
  }
}