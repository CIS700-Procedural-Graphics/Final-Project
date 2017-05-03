package main

import "github.com/gorilla/websocket"

// Client encapsulates all player connection contexts
type Client struct {
	Conn *websocket.Conn
	ID   int32
}

// NewClient creates a new client
func NewClient(conn *websocket.Conn, id int32) *Client {
	c := &Client{
		Conn: conn,
		ID:   id,
	}
	return c
}

// ReadJSON forwards the ReadJSON call
func (C *Client) ReadJSON(v interface{}) error {
	return C.Conn.ReadJSON(v)
}

// WriteJSON forwards the WriteJSON call
func (C *Client) WriteJSON(v interface{}) error {
	return C.Conn.WriteJSON(v)
}

// Close forwards the Close call
func (C *Client) Close() error {
	return C.Conn.Close()
}
